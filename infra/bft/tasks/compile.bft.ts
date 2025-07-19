#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { parseArgs } from "@std/cli";

async function compile(args: Array<string>): Promise<number> {
  // Check for global help flag
  if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
    ui.output(`Usage: bft compile <app-name> [OPTIONS]

Compile applications to single executable binaries.

Available apps:
  boltfoundry-com    Bolt Foundry landing page

Examples:
  bft compile boltfoundry-com           # Compile boltfoundry-com to binary
  bft compile boltfoundry-com --help    # Show app-specific help`);
    return 0;
  }

  if (args.length === 0) {
    ui.error("Usage: bft compile <app-name>");
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    return 1;
  }

  const appName = args[0];
  const compileArgs = args.slice(1);

  if (appName !== "boltfoundry-com") {
    ui.error(`Unknown app: ${appName}`);
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    return 1;
  }

  // Handle boltfoundry-com compilation
  const flags = parseArgs(compileArgs, {
    boolean: ["help", "quiet"],
  });

  if (flags.help) {
    ui.output(`Usage: bft compile boltfoundry-com

Compile Bolt Foundry landing page to single executable binary.
This will build frontend assets and compile the server into a standalone binary.

The binary will be output to: ./build/boltfoundry-com

Examples:
  bft compile boltfoundry-com    # Build assets and compile to binary`);
    return 0;
  }

  const appPath =
    new URL(import.meta.resolve("../../../apps/boltfoundry-com")).pathname;
  const buildDir = new URL(import.meta.resolve("../../../build")).pathname;

  // Ensure build directory exists
  try {
    await Deno.mkdir(buildDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      ui.error(
        `Failed to create build directory: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return 1;
    }
  }

  // Check if assets are built, if not, build them
  const staticBuildPath = `${appPath}/static/build`;
  let assetsExist = false;

  try {
    const stat = await Deno.stat(staticBuildPath);
    assetsExist = stat.isDirectory;
  } catch {
    // static/build directory doesn't exist
  }

  if (!assetsExist) {
    if (!flags.quiet) {
      ui.output("Assets not found, building frontend first...");
    }

    // Run Vite build directly (same as bft dev --build)
    const buildCommand = new Deno.Command("deno", {
      args: ["run", "-A", "--node-modules-dir", "npm:vite", "build"],
      cwd: appPath,
      stdout: flags.quiet ? "null" : "inherit",
      stderr: flags.quiet ? "null" : "inherit",
    });

    const buildResult = buildCommand.outputSync();
    if (!buildResult.success) {
      ui.error("Frontend build failed");
      return 1;
    }
  }

  // Compile the server to binary
  if (!flags.quiet) {
    ui.output("Compiling server to single binary...");
  }

  const binaryPath = `${buildDir}/boltfoundry-com`;
  const serverPath = `${appPath}/server.tsx`;

  // Remove old binary if it exists
  try {
    await Deno.remove(binaryPath);
    if (!flags.quiet) {
      ui.output("Removed existing binary");
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      ui.error(
        `Failed to remove existing binary: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return 1;
    }
  }

  const compileCommand = new Deno.Command("deno", {
    args: [
      "compile",
      "--allow-all",
      "--include",
      "static",
      "--output",
      binaryPath,
      serverPath,
    ],
    cwd: appPath,
    stdout: flags.quiet ? "null" : "inherit",
    stderr: flags.quiet ? "null" : "inherit",
  });

  const compileResult = compileCommand.outputSync();

  if (!compileResult.success) {
    ui.error("Binary compilation failed");
    return 1;
  }

  // Clean up static assets since they're now embedded in the binary
  try {
    await Deno.remove(staticBuildPath, { recursive: true });
    if (!flags.quiet) {
      ui.output("🧹 Cleaned up static build assets (embedded in binary)");
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      ui.error(
        `Warning: Failed to clean up static assets: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      // Don't fail the compilation for cleanup issues
    }
  }

  if (!flags.quiet) {
    ui.output(`✅ Successfully compiled to: ${binaryPath}`);
    ui.output("");
    ui.output("To run the binary:");
    ui.output(`  ${binaryPath}`);
    ui.output(`  ${binaryPath} --help`);
    ui.output(`  ${binaryPath} --port 4000`);
  }

  return 0;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Compile applications to single binaries",
  aiSafe: true,
  fn: compile,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await compile(scriptArgs));
}
