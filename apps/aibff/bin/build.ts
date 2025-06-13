#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write --allow-env

import { join } from "@std/path";
import { getLogger } from "../../../packages/logger/logger.ts";

const logger = getLogger(import.meta);

const ROOT_DIR = join(import.meta.dirname!, "../../..");
const DENO_LOCK_PATH = join(ROOT_DIR, "deno.lock");
const EVAL_ENTRY = join(ROOT_DIR, "apps/aibff/eval.ts");
const BUILD_DIR = join(ROOT_DIR, "build");
const OUTPUT_PATH = join(BUILD_DIR, "eval");

async function extractNpmDependencies(): Promise<Array<string>> {
  const lockFile = JSON.parse(await Deno.readTextFile(DENO_LOCK_PATH));

  // Get initial packages from deno info
  const denoInfoCmd = new Deno.Command("deno", {
    args: ["info", "--json", EVAL_ENTRY],
    stdout: "piped",
  });

  const { stdout } = await denoInfoCmd.output();
  const denoInfo = JSON.parse(new TextDecoder().decode(stdout));

  // Extract npm packages from modules
  const npmPackages = new Set<string>();
  for (const module of denoInfo.modules) {
    if (
      module.kind === "external" && module.specifier.includes("node_modules")
    ) {
      // Extract package name from path like: node_modules/.deno/chalk@5.4.1/...
      const match = module.specifier.match(
        /node_modules\/\.deno\/([^\/]+)@[^\/]+/,
      );
      if (match) {
        // Find the exact version in specifiers
        const packageName = match[1];
        for (const [spec, version] of Object.entries(lockFile.specifiers)) {
          if (
            spec.startsWith(`npm:${packageName}@`) ||
            spec === `npm:${packageName}`
          ) {
            const versionedPackage = `${packageName}@${version}`;
            npmPackages.add(versionedPackage);
            break;
          }
        }
      }
    }
  }

  // Collect transitive dependencies
  const visited = new Set<string>();
  const allDeps = new Set<string>();

  function collectDeps(pkgName: string) {
    if (visited.has(pkgName)) return;
    visited.add(pkgName);

    const pkg = lockFile.npm[pkgName];
    if (!pkg) return;

    allDeps.add(pkgName);

    if (pkg.dependencies) {
      for (const dep of pkg.dependencies) {
        const depName = dep.replace(/^npm:/, "");
        const exactDep = Object.keys(lockFile.npm).find((key) =>
          key.startsWith(depName + "@") || key === depName
        );

        if (exactDep) {
          collectDeps(exactDep);
        }
      }
    }
  }

  // Start with packages found in deno info
  for (const pkg of npmPackages) {
    collectDeps(pkg);
  }

  // Convert to package names without versions for includes
  return Array.from(allDeps).map((dep) => {
    const match = dep.match(/^(@?[^@]+)/);
    return match ? match[1] : dep;
  });
}

async function build() {
  logger.info("Building aibff eval command...");

  // Ensure build directory exists
  await Deno.mkdir(BUILD_DIR, { recursive: true });

  // Extract dependencies
  logger.info("Extracting npm dependencies...");
  const npmDeps = await extractNpmDependencies();
  logger.info(
    `Found ${npmDeps.length} npm packages (including transitive dependencies)`,
  );

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

  // Add individual includes for each npm package that exists
  const existingPackages: Array<string> = [];
  const missingPackages: Array<string> = [];

  for (const pkg of npmDeps) {
    const pkgPath = join(ROOT_DIR, "node_modules", pkg);
    try {
      await Deno.stat(pkgPath);
      existingPackages.push(pkg);
      compileArgs.push("--include", `node_modules/${pkg}`);
    } catch {
      missingPackages.push(pkg);
    }
  }

  logger.info(`Including ${existingPackages.length} existing packages`);
  if (missingPackages.length > 0) {
    logger.debug(
      `Skipping ${missingPackages.length} missing packages: ${
        missingPackages.join(", ")
      }`,
    );
  }

  // Add the entry point
  compileArgs.push(EVAL_ENTRY);

  logger.info("Running deno compile...");
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
