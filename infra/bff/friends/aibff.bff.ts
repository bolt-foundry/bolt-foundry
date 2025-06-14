#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write --allow-env

import { join } from "@std/path";
import { getLogger } from "packages/logger/logger.ts";
import { register } from "../bff.ts";

const logger = getLogger(import.meta);

async function buildAibff(options: { platform?: string; debug?: boolean }) {
  logger.info("Building aibff binary...");

  const buildScriptPath = join(
    import.meta.dirname!,
    "../../../apps/aibff/bin/build.ts",
  );

  // Determine platform
  const platform = options.platform || Deno.build.os;
  const arch = Deno.build.arch;

  logger.info(`Target platform: ${platform}-${arch}`);

  // Run the build script
  const buildCommand = new Deno.Command("deno", {
    args: [
      "run",
      "--allow-read",
      "--allow-run",
      "--allow-write",
      "--allow-env",
      buildScriptPath,
      ...(options.platform ? ["--platform", options.platform] : []),
      ...(options.debug ? ["--debug"] : []),
    ],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { success } = await buildCommand.output();

  if (!success) {
    logger.error("aibff build failed!");
    throw new Error("Build failed");
  }

  logger.info("✅ aibff build completed successfully!");

  // Report binary location
  const binaryPath = join(
    import.meta.dirname!,
    "../../../build/bin",
    platform === "windows" ? "aibff.exe" : "aibff",
  );

  logger.info(`Binary location: ${binaryPath}`);
}

// Register the command
register(
  "aibff:build",
  "Build the aibff binary for evaluation",
  buildAibff,
  [
    {
      name: "platform",
      description: "Target platform (linux, darwin, windows)",
      type: "string",
    },
    {
      name: "debug",
      description: "Enable debug output",
      type: "boolean",
      default: false,
    },
  ],
  true, // AI-safe
);

// Also register a shorter alias
register(
  "aibff",
  "Build the aibff binary (alias for aibff:build)",
  buildAibff,
  [
    {
      name: "platform",
      description: "Target platform (linux, darwin, windows)",
      type: "string",
    },
    {
      name: "debug",
      description: "Enable debug output",
      type: "boolean",
      default: false,
    },
  ],
  true, // AI-safe
);
