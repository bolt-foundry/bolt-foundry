#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import type { parseArgs } from "@std/cli";

async function compile(args: Array<string>): Promise<number> {
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

  // Always build frontend assets to ensure latest version
  ui.output("Building frontend assets...");

  const buildCommand = new Deno.Command("bft", {
    args: ["app", "boltfoundry-com", "--build"],
    stdout: "inherit",
    stderr: "inherit",
  });

  const buildResult = await buildCommand.output();
  if (!buildResult.success) {
    ui.error("Frontend build failed");
    return 1;
  }

  // Compile the server to binary
  ui.output("Compiling server to single binary...");

  const binaryPath = `${buildDir}/boltfoundry-com`;
  const serverPath = `${appPath}/server.ts`;

  const compileCommand = new Deno.Command("deno", {
    args: [
      "compile",
      "--allow-all",
      "--include",
      `${appPath}/dist`,
      "--output",
      binaryPath,
      serverPath,
    ],
    cwd: appPath,
    stdout: "inherit",
    stderr: "inherit",
  });

  const compileResult = await compileCommand.output();

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
  helpText: `Usage: bft compile <app-name>

Compile applications to single executable binaries.

Available apps:
  boltfoundry-com    Bolt Foundry landing page

The binary will be output to: ./build/boltfoundry-com

Examples:
  bft compile boltfoundry-com    # Build assets and compile to binary`,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await compile(scriptArgs));
}
