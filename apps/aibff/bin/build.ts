#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write --allow-env

import { join } from "@std/path";
import { parseArgs } from "@std/cli";
import { getLogger, startSpinner } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

const ROOT_DIR = join(import.meta.dirname!, "../../..");
const MAIN_ENTRY = join(ROOT_DIR, "apps/aibff/main.ts");
const BUILD_DIR = join(ROOT_DIR, "build/bin");

// Parse command line arguments
const args = parseArgs(Deno.args, {
  string: ["platform", "arch"],
  boolean: ["debug"],
  default: {
    platform: Deno.build.os,
    arch: Deno.build.arch,
    debug: false,
  },
});

// Map platform/arch to Deno target
function getDenoTarget(platform: string, arch: string): string {
  const targetMap: Record<string, string> = {
    "darwin-x86_64": "x86_64-apple-darwin",
    "darwin-aarch64": "aarch64-apple-darwin",
    "linux-x86_64": "x86_64-unknown-linux-gnu",
    "linux-aarch64": "aarch64-unknown-linux-gnu",
    "windows-x86_64": "x86_64-pc-windows-msvc",
  };

  const key = `${platform}-${arch}`;
  return targetMap[key] || "";
}

// Determine output filename based on platform
function getOutputPath(platform: string, arch: string): string {
  const baseName = "aibff";
  const suffix = platform === "windows" ? ".exe" : "";
  const platformArch = `${platform}-${arch}`;
  return join(BUILD_DIR, `${baseName}-${platformArch}${suffix}`);
}

// Check if .deno directory exists - we don't want Deno-managed node_modules
async function validateNodeModules() {
  const denoDir = join(ROOT_DIR, "node_modules/.deno");
  try {
    await Deno.stat(denoDir);
    // If we get here, .deno exists - fail the build
    logger.printErr("❌ Detected node_modules/.deno directory!");
    logger.printErr("This project uses npm for dependency management.");
    logger.printErr("Please run:");
    logger.printErr("  rm -rf node_modules");
    logger.printErr("  npm install");
    logger.printErr("\nThen try building again.");
    Deno.exit(1);
  } catch {
    // Good - .deno doesn't exist, we can proceed
    logger.debug("✓ node_modules structure is npm-managed");
  }
}

async function getDirectlyUsedPackages(): Promise<Array<string>> {
  // Get packages from deno info
  const denoInfoCmd = new Deno.Command("deno", {
    args: ["info", "--json", MAIN_ENTRY],
    stdout: "piped",
  });

  const { stdout } = await denoInfoCmd.output();
  const denoInfo = JSON.parse(new TextDecoder().decode(stdout));

  // Extract npm packages from modules
  const npmPackages = new Set<string>();
  for (const module of denoInfo.modules) {
    if (
      module.kind === "external" && module.specifier.includes("/node_modules/")
    ) {
      // Extract from file:// URLs (e.g., "file:///path/node_modules/chalk/..." -> "chalk")
      const match = module.specifier.match(/node_modules\/(@?[^\/]+)\//);
      if (match) {
        const pkgName = match[1];
        if (!pkgName.startsWith("@types")) { // Skip @types packages for now
          npmPackages.add(pkgName);
        }
      }
    }
  }

  logger.debug(`Found ${npmPackages.size} directly used packages`);
  return Array.from(npmPackages);
}

async function readPackageJson(
  packageName: string,
): Promise<{ dependencies?: Record<string, string> } | null> {
  try {
    const packageJsonPath = join(
      ROOT_DIR,
      "node_modules",
      packageName,
      "package.json",
    );
    const content = await Deno.readTextFile(packageJsonPath);
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function getAllRequiredPackages(): Promise<Array<string>> {
  // First get directly used packages
  const directPackages = await getDirectlyUsedPackages();
  const allRequired = new Set<string>(directPackages);
  const toProcess = [...directPackages];

  // Recursively resolve dependencies by reading package.json files
  while (toProcess.length > 0) {
    const pkg = toProcess.shift()!;
    const packageJson = await readPackageJson(pkg);

    if (packageJson && packageJson.dependencies) {
      for (const depName of Object.keys(packageJson.dependencies)) {
        if (!allRequired.has(depName)) {
          allRequired.add(depName);
          toProcess.push(depName);
          logger.debug(`Added dependency: ${depName} (required by ${pkg})`);
        }
      }
    }
  }

  logger.debug(
    `Resolved ${directPackages.length} direct packages to ${allRequired.size} total required packages`,
  );
  return Array.from(allRequired);
}

async function build() {
  const platform = args.platform as string;
  const arch = args.arch as string;
  const outputPath = getOutputPath(platform, arch);

  logger.println(`Building aibff for ${platform}-${arch}...`);
  logger.println(`Output: ${outputPath}`);

  // Validate node_modules structure first
  await validateNodeModules();

  // Ensure build directory exists
  await Deno.mkdir(BUILD_DIR, { recursive: true });

  // Get required npm packages
  logger.println("Collecting required npm packages...");
  const stopPackageSpinner = startSpinner([
    "Analyzing dependencies...",
    "Resolving package tree...",
    "Collecting npm packages...",
  ]);
  const npmPackages = await getAllRequiredPackages();
  stopPackageSpinner();

  // Get the Deno target
  const denoTarget = getDenoTarget(platform, arch);
  if (!denoTarget) {
    logger.printErr(
      `Unsupported platform/arch combination: ${platform}-${arch}`,
    );
    Deno.exit(1);
  }

  // Build compile command
  const compileArgs = [
    "compile",
    "--allow-all",
    "--no-check",
    "--target",
    denoTarget,
    "--output",
    outputPath,
    "--exclude",
    "node_modules",
    // Include the decks folder for embedded resources
    "--include",
    "apps/aibff/decks",
  ];

  // Add includes for each npm package
  for (const pkg of npmPackages) {
    const pkgPath = join(ROOT_DIR, "node_modules", pkg);
    try {
      await Deno.stat(pkgPath);
      compileArgs.push("--include", `node_modules/${pkg}`);
      logger.debug(`Including: node_modules/${pkg}`);
    } catch {
      logger.warn(`Package ${pkg} not found in node_modules - skipping`);
    }
  }

  // Add the entry point
  compileArgs.push(MAIN_ENTRY);

  logger.println("Running deno compile...");
  logger.println(
    `Compile command will include ${npmPackages.length} npm packages`,
  );
  logger.debug(`Output will be: ${outputPath}`);

  const stopCompileSpinner = startSpinner([
    "Compiling TypeScript...",
    "Bundling dependencies...",
    "Creating executable...",
    "Optimizing output...",
  ]);
  const cmd = new Deno.Command("deno", {
    args: compileArgs,
    stdout: "inherit",
    stderr: "inherit",
  });

  const { success } = await cmd.output();
  stopCompileSpinner();

  if (success) {
    logger.println("✅ Build successful!");

    // Check output size
    const stat = await Deno.stat(outputPath);
    logger.println(`Output size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
    logger.println(`Binary location: ${outputPath}`);

    // Create a symlink to the latest build for convenience
    const latestLink = join(BUILD_DIR, "aibff");
    try {
      await Deno.remove(latestLink);
    } catch {
      // Ignore if doesn't exist
    }
    if (platform === Deno.build.os && arch === Deno.build.arch) {
      await Deno.symlink(outputPath, latestLink);
      logger.println(`Created symlink: ${latestLink} -> ${outputPath}`);
    }
  } else {
    logger.printErr("❌ Build failed!");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await build();
}
