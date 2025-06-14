#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write --allow-env

import { join } from "@std/path";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const ROOT_DIR = join(import.meta.dirname!, "../../..");
const MAIN_ENTRY = join(ROOT_DIR, "apps/aibff/main.ts");
const BUILD_DIR = join(ROOT_DIR, "build/bin");
const OUTPUT_PATH = join(BUILD_DIR, "aibff");

// Check if .deno directory exists - we don't want Deno-managed node_modules
async function validateNodeModules() {
  const denoDir = join(ROOT_DIR, "node_modules/.deno");
  try {
    await Deno.stat(denoDir);
    // If we get here, .deno exists - fail the build
    logger.error("❌ Detected node_modules/.deno directory!");
    logger.error("This project uses npm for dependency management.");
    logger.error("Please run:");
    logger.error("  rm -rf node_modules");
    logger.error("  npm install");
    logger.error("\nThen try building again.");
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

  logger.info(`Found ${npmPackages.size} directly used packages`);
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

  logger.info(
    `Resolved ${directPackages.length} direct packages to ${allRequired.size} total required packages`,
  );
  return Array.from(allRequired);
}

async function build() {
  logger.info("Building aibff command...");

  // Validate node_modules structure first
  await validateNodeModules();

  // Ensure build directory exists
  await Deno.mkdir(BUILD_DIR, { recursive: true });

  // Get required npm packages
  logger.info("Collecting required npm packages...");
  const npmPackages = await getAllRequiredPackages();

  // Build compile command
  const compileArgs = [
    "compile",
    "--allow-all",
    "--no-check",
    "--output",
    OUTPUT_PATH,
    "--exclude",
    "node_modules",
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

  logger.info("Running deno compile...");
  logger.info(
    `Compile command will include ${npmPackages.length} npm packages`,
  );
  logger.debug(`Output will be: ${OUTPUT_PATH}`);

  const cmd = new Deno.Command("deno", {
    args: compileArgs,
    stdout: "inherit",
    stderr: "inherit",
  });

  const { success } = await cmd.output();

  if (success) {
    logger.info("✅ Build successful!");

    // Check output size
    const stat = await Deno.stat(OUTPUT_PATH);
    logger.info(`Output size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  } else {
    logger.error("❌ Build failed!");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await build();
}
