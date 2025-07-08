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
  aibff-gui          aibff GUI application

Examples:
  bft compile boltfoundry-com           # Compile boltfoundry-com to binary
  bft compile aibff-gui                 # Compile aibff GUI to binary
  bft compile boltfoundry-com --help    # Show app-specific help`);
    return 0;
  }

  if (args.length === 0) {
    ui.error("Usage: bft compile <app-name>");
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    ui.output("  aibff-gui          aibff GUI application");
    return 1;
  }

  const appName = args[0];
  const compileArgs = args.slice(1);

  if (appName !== "boltfoundry-com" && appName !== "aibff-gui") {
    ui.error(`Unknown app: ${appName}`);
    ui.output("Available apps:");
    ui.output("  boltfoundry-com    Bolt Foundry landing page");
    ui.output("  aibff-gui          aibff GUI application");
    return 1;
  }

  // Parse flags
  const flags = parseArgs(compileArgs, {
    boolean: ["help"],
  });

  if (flags.help) {
    if (appName === "boltfoundry-com") {
      ui.output(`Usage: bft compile boltfoundry-com

Compile Bolt Foundry landing page to single executable binary.
This will build frontend assets and compile the server into a standalone binary.

The binary will be output to: ./build/boltfoundry-com

Examples:
  bft compile boltfoundry-com    # Build assets and compile to binary`);
    } else if (appName === "aibff-gui") {
      ui.output(`Usage: bft compile aibff-gui

Compile aibff GUI application to single executable binary.
This will compile the aibff GUI server into a standalone binary.

The binary will be output to: ./build/aibff-gui

Examples:
  bft compile aibff-gui          # Compile aibff GUI to binary`);
    }
    return 0;
  }

  const buildDir = new URL(import.meta.resolve("../../../build")).pathname;

  if (appName === "boltfoundry-com") {
    return await compileBoltFoundryCom(buildDir);
  } else if (appName === "aibff-gui") {
    return await compileAibffGui(buildDir);
  }

  return 1;
}

async function compileBoltFoundryCom(buildDir: string): Promise<number> {
  const appPath =
    new URL(import.meta.resolve("../../../apps/boltfoundry-com")).pathname;

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
  const distPath = `${appPath}/dist`;
  let assetsExist = false;

  try {
    const stat = await Deno.stat(distPath);
    assetsExist = stat.isDirectory;
  } catch {
    // dist directory doesn't exist
  }

  if (!assetsExist) {
    ui.output("Assets not found, building frontend first...");

    // Run the build command
    const buildCommand = new Deno.Command("bft", {
      args: ["app", "boltfoundry-com", "--build"],
      stdout: "inherit",
      stderr: "inherit",
    });

    const buildResult = buildCommand.outputSync();
    if (!buildResult.success) {
      ui.error("Frontend build failed");
      return 1;
    }
  }

  // Compile the server to binary
  ui.output("Compiling server to single binary...");

  const binaryPath = `${buildDir}/boltfoundry-com`;
  const serverPath = `${appPath}/server.tsx`;

  const compileCommand = new Deno.Command("deno", {
    args: [
      "compile",
      "--allow-all",
      "--include",
      "dist",
      "--output",
      binaryPath,
      serverPath,
    ],
    cwd: appPath,
    stdout: "inherit",
    stderr: "inherit",
  });

  const compileResult = compileCommand.outputSync();

  if (!compileResult.success) {
    ui.error("Binary compilation failed");
    return 1;
  }

  ui.output(`✅ Successfully compiled to: ${binaryPath}`);
  ui.output("");
  ui.output("To run the binary:");
  ui.output(`  ${binaryPath}`);
  ui.output(`  ${binaryPath} --help`);
  ui.output(`  ${binaryPath} --port 4000`);

  return 0;
}

async function compileAibffGui(buildDir: string): Promise<number> {
  const appPath =
    new URL(import.meta.resolve("../../../apps/aibff/gui")).pathname;

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

  // Run build process to ensure latest code is compiled
  ui.output("Building aibff GUI dependencies...");
  const buildCommand = new Deno.Command("bft", {
    args: ["build"],
    stdout: "inherit",
    stderr: "inherit",
  });

  const buildResult = buildCommand.outputSync();
  if (!buildResult.success) {
    ui.error("Build failed");
    return 1;
  }

  // Build the frontend assets
  ui.output("Building aibff GUI frontend assets...");
  const frontendBuildCommand = new Deno.Command("deno", {
    args: ["task", "build"],
    cwd: appPath,
    stdout: "inherit",
    stderr: "inherit",
  });

  const frontendBuildResult = frontendBuildCommand.outputSync();
  if (!frontendBuildResult.success) {
    ui.error("Frontend build failed");
    return 1;
  }

  // Compile the GUI server to binary
  ui.output("Compiling aibff GUI server to single binary...");

  const binaryPath = `${buildDir}/aibff-gui`;
  const serverPath = `${appPath}/guiServer.ts`;

  const compileCommand = new Deno.Command("deno", {
    args: [
      "compile",
      "--allow-all",
      "--include",
      "dist",
      "--output",
      binaryPath,
      serverPath,
    ],
    cwd: appPath,
    stdout: "inherit",
    stderr: "inherit",
  });

  const compileResult = compileCommand.outputSync();

  if (!compileResult.success) {
    ui.error("Binary compilation failed");
    return 1;
  }

  ui.output(`✅ Successfully compiled to: ${binaryPath}`);
  ui.output("");
  ui.output("To run the binary:");
  ui.output(`  ${binaryPath}`);
  ui.output(`  ${binaryPath} --help`);
  ui.output(`  ${binaryPath} --port 4000`);

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
