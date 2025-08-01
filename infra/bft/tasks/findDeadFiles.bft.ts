import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { walk } from "@std/fs";
import { join, relative } from "@std/path";

const logger = getLogger(import.meta);

interface FileInfo {
  path: string;
  isEntryPoint: boolean;
  isTest: boolean;
  isGenerated: boolean;
  isConfig: boolean;
  dependencies: Set<string>;
}

export async function findDeadFilesCommand(
  options: Array<string>,
): Promise<number> {
  logger.info("🔍 Starting dead files analysis...");

  const showDetails = options.includes("--verbose") || options.includes("-v");
  const dryRun = !options.includes("--delete");

  try {
    // Step 1: Build file inventory
    logger.info("📋 Building file inventory...");
    const fileMap = new Map<string, FileInfo>();
    await buildFileInventory(fileMap);

    // Step 2: Analyze dependencies
    logger.info("🔗 Analyzing dependencies...");
    await analyzeDependencies(fileMap);

    // Step 3: Find entry points
    logger.info("🚪 Identifying entry points...");
    const entryPoints = findEntryPoints(fileMap);

    // Step 4: Traverse from entry points
    logger.info("🌳 Traversing dependency graph...");
    const referencedFiles = new Set<string>();
    traverseFromEntryPoints(entryPoints, fileMap, referencedFiles);

    // Step 5: Find dead files
    logger.info("💀 Finding dead files...");
    const deadFiles = findDeadFiles(fileMap, referencedFiles);

    // Step 6: Report results
    reportResults(deadFiles, showDetails, dryRun);

    logger.info("✨ Dead files analysis complete!");
    return 0;
  } catch (error) {
    logger.error("❌ Dead files analysis failed:", error);
    return 1;
  }
}

async function buildFileInventory(
  fileMap: Map<string, FileInfo>,
): Promise<void> {
  const cwd = Deno.cwd();

  // File extensions to analyze
  const codeExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

  // Directories to exclude
  const excludeDirs = [
    "node_modules",
    "vendor",
    ".sl",
    ".deno",
    ".git",
    "build",
    "dist",
    "__generated__",
    "__isograph",
    "tmp",
    ".direnv",
    ".cache",
  ];

  for await (
    const entry of walk(cwd, {
      exts: codeExtensions,
      skip: excludeDirs.map((dir) => new RegExp(`/${dir}/`)),
      includeDirs: false,
    })
  ) {
    const relativePath = relative(cwd, entry.path);

    const fileInfo: FileInfo = {
      path: relativePath,
      isEntryPoint: isEntryPoint(relativePath),
      isTest: isTestFile(relativePath),
      isGenerated: isGeneratedFile(relativePath),
      isConfig: isConfigFile(relativePath),
      dependencies: new Set(),
    };

    fileMap.set(relativePath, fileInfo);
  }
}

async function analyzeDependencies(
  fileMap: Map<string, FileInfo>,
): Promise<void> {
  for (const [filePath, fileInfo] of fileMap) {
    try {
      const content = await Deno.readTextFile(filePath);
      const deps = await extractDependencies(content, filePath);

      for (const dep of deps) {
        if (fileMap.has(dep)) {
          fileInfo.dependencies.add(dep);
        }
      }
    } catch (error) {
      logger.debug(`Could not analyze ${filePath}: ${error}`);
    }
  }
}

async function extractDependencies(
  content: string,
  filePath: string,
): Promise<Array<string>> {
  const dependencies: Array<string> = [];
  const cwd = Deno.cwd();

  // Match import statements and dynamic imports
  const importRegex =
    /(?:import\s+(?:[\w*{}\s,]+\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|from\s+["']([^"']+)["'])/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1] || match[2] || match[3]; // Handle multiple capture groups
    if (!importPath) continue;

    // Skip external imports (npm packages, JSR imports, etc.) but handle @bfmono/ specially
    if (
      importPath.startsWith("@std/") ||
      importPath.startsWith("jsr:") ||
      importPath.startsWith("npm:") ||
      importPath.startsWith("node:") ||
      importPath.startsWith("@deno/")
    ) {
      continue;
    }

    let resolvedPath = importPath;

    // Handle @bfmono/ imports - these resolve to local files
    if (importPath.startsWith("@bfmono/")) {
      resolvedPath = importPath.substring(8); // Remove @bfmono/ prefix
    } // Handle @bolt-foundry/ imports - these resolve to packages
    else if (importPath.startsWith("@bolt-foundry/")) {
      const packageName = importPath.substring(14); // Remove @bolt-foundry/ prefix
      if (packageName === "bolt-foundry") {
        resolvedPath = "packages/bolt-foundry/bolt-foundry.ts";
      } else if (packageName === "logger") {
        resolvedPath = "packages/logger/logger.ts";
      } else if (packageName === "get-configuration-var") {
        resolvedPath =
          "packages/get-configuration-var/get-configuration-var.ts";
      } else {
        // Try to find the package
        resolvedPath = `packages/${packageName}/${packageName}.ts`;
      }
    } // Handle workspace imports (apps/, packages/, etc.)
    else if (
      importPath.startsWith("apps/") ||
      importPath.startsWith("packages/") ||
      importPath.startsWith("infra/") ||
      importPath.startsWith("lib/")
    ) {
      resolvedPath = importPath;
    } // Handle relative imports
    else if (importPath.startsWith("./") || importPath.startsWith("../")) {
      try {
        const basePath = join(
          cwd,
          filePath.substring(0, filePath.lastIndexOf("/")),
        );
        resolvedPath = relative(cwd, join(basePath, importPath));
      } catch {
        continue;
      }
    } // Skip other imports we can't resolve
    else {
      continue;
    }

    // Try with different extensions
    const extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs"];
    for (const ext of extensions) {
      const candidate = resolvedPath + ext;
      try {
        const stat = await Deno.stat(candidate);
        if (stat.isFile) {
          dependencies.push(candidate);
          break;
        }
      } catch {
        // File doesn't exist, try next extension
      }
    }

    // Also try without extension (for exact matches)
    try {
      const stat = await Deno.stat(resolvedPath);
      if (stat.isFile) {
        dependencies.push(resolvedPath);
      }
    } catch {
      // File doesn't exist
    }
  }

  return dependencies;
}

function isEntryPoint(filePath: string): boolean {
  // CLI entry points
  if (
    filePath.includes("/bin/") || filePath.endsWith("/main.ts") ||
    filePath.endsWith("/cli.ts")
  ) {
    return true;
  }

  // App entry points
  if (
    filePath.startsWith("apps/") &&
    (filePath.endsWith("/index.ts") || filePath.endsWith("/main.ts"))
  ) {
    return true;
  }

  // BFT tasks are CLI entry points
  if (filePath.includes("/tasks/") && filePath.endsWith(".bft.ts")) {
    return true;
  }

  // BFF friends are CLI entry points
  if (filePath.includes("/bff/friends/") && filePath.endsWith(".bff.ts")) {
    return true;
  }

  // Package entry points (files directly referenced in deno.json imports)
  if (filePath.startsWith("packages/") && filePath.endsWith(".ts")) {
    // Check if it's a main package file (not in subdirectories)
    const pathParts = filePath.split("/");
    if (pathParts.length === 3) { // packages/name/file.ts
      return true;
    }
  }

  // Infrastructure entry points
  if (
    filePath.startsWith("infra/") && (
      filePath.endsWith("/bft.ts") ||
      filePath.endsWith("/bff.ts") ||
      filePath.includes("/bin/")
    )
  ) {
    return true;
  }

  // App server/entry files
  if (filePath.endsWith("/server.ts") || filePath.endsWith("/bff.ts")) {
    return true;
  }

  return false;
}

function isTestFile(filePath: string): boolean {
  return filePath.includes(".test.") ||
    filePath.includes(".spec.") ||
    filePath.includes("_test.") ||
    filePath.includes("test/") ||
    filePath.endsWith(".e2e.ts");
}

function isGeneratedFile(filePath: string): boolean {
  return filePath.includes("__generated__") ||
    filePath.includes("__isograph") ||
    filePath.includes(".generated.") ||
    filePath.startsWith("build/");
}

function isConfigFile(filePath: string): boolean {
  const configFiles = [
    "deno.json",
    "deno.jsonc",
    "package.json",
    "tsconfig.json",
    ".eslintrc",
    "vite.config",
    "esbuild.config",
    "webpack.config",
  ];

  return configFiles.some((config) => filePath.includes(config)) ||
    filePath.endsWith(".config.ts") ||
    filePath.endsWith(".config.js");
}

function findEntryPoints(fileMap: Map<string, FileInfo>): Array<string> {
  const entryPoints: Array<string> = [];

  for (const [filePath, fileInfo] of fileMap) {
    if (fileInfo.isEntryPoint || fileInfo.isTest || fileInfo.isConfig) {
      entryPoints.push(filePath);
    }
  }

  return entryPoints;
}

function traverseFromEntryPoints(
  entryPoints: Array<string>,
  fileMap: Map<string, FileInfo>,
  visited: Set<string>,
): void {
  const queue = [...entryPoints];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    const fileInfo = fileMap.get(current);
    if (fileInfo) {
      for (const dep of fileInfo.dependencies) {
        if (!visited.has(dep)) {
          queue.push(dep);
        }
      }
    }
  }
}

function findDeadFiles(
  fileMap: Map<string, FileInfo>,
  referencedFiles: Set<string>,
): Array<
  { path: string; confidence: "high" | "medium" | "low"; reason: string }
> {
  const deadFiles: Array<
    { path: string; confidence: "high" | "medium" | "low"; reason: string }
  > = [];

  for (const [filePath, fileInfo] of fileMap) {
    if (referencedFiles.has(filePath)) {
      continue;
    }

    let confidence: "high" | "medium" | "low" = "high";
    let reason = "Not referenced by any other file";

    // Lower confidence for certain file types
    if (fileInfo.isConfig) {
      confidence = "low";
      reason = "Config file - may be referenced dynamically";
    } else if (fileInfo.isGenerated) {
      confidence = "medium";
      reason = "Generated file - may be recreated";
    } else if (filePath.includes("example") || filePath.includes("template")) {
      confidence = "low";
      reason = "Example/template file - may be referenced indirectly";
    } else if (filePath.includes("util") || filePath.includes("lib")) {
      confidence = "medium";
      reason = "Utility/library file - may be referenced dynamically";
    }

    deadFiles.push({ path: filePath, confidence, reason });
  }

  return deadFiles.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
  });
}

function reportResults(
  deadFiles: Array<
    { path: string; confidence: "high" | "medium" | "low"; reason: string }
  >,
  showDetails: boolean,
  dryRun: boolean,
): void {
  if (deadFiles.length === 0) {
    logger.info("🎉 No dead files found!");
    return;
  }

  logger.info(`Found ${deadFiles.length} potentially dead files:`);

  const grouped = {
    high: deadFiles.filter((f) => f.confidence === "high"),
    medium: deadFiles.filter((f) => f.confidence === "medium"),
    low: deadFiles.filter((f) => f.confidence === "low"),
  };

  if (grouped.high.length > 0) {
    ui.output(`\n🔴 HIGH CONFIDENCE (${grouped.high.length} files):`);
    for (const file of grouped.high) {
      ui.output(`  ${file.path}${showDetails ? ` - ${file.reason}` : ""}`);
    }
  }

  if (grouped.medium.length > 0) {
    ui.output(`\n🟡 MEDIUM CONFIDENCE (${grouped.medium.length} files):`);
    for (const file of grouped.medium) {
      ui.output(`  ${file.path}${showDetails ? ` - ${file.reason}` : ""}`);
    }
  }

  if (grouped.low.length > 0) {
    ui.output(`\n🟢 LOW CONFIDENCE (${grouped.low.length} files):`);
    for (const file of grouped.low) {
      ui.output(`  ${file.path}${showDetails ? ` - ${file.reason}` : ""}`);
    }
  }

  if (dryRun) {
    ui.output(
      "\n💡 This is a dry run. Use --delete to remove files (use with caution!)",
    );
  }

  ui.output("\n📊 Summary:");
  ui.output(`  Total files analyzed: ${deadFiles.length}`);
  ui.output(`  High confidence: ${grouped.high.length}`);
  ui.output(`  Medium confidence: ${grouped.medium.length}`);
  ui.output(`  Low confidence: ${grouped.low.length}`);
}

export const bftDefinition = {
  description: "Find potentially dead/unused files in the codebase",
  fn: findDeadFilesCommand,
} satisfies TaskDefinition;
