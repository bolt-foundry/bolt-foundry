import type { Command } from "./types.ts";
import { getLogger } from "packages/logger/logger.ts";
import { join } from "@std/path";
import { parseArgs } from "@std/cli";

const logger = getLogger(import.meta);

export const rebuildCommand: Command = {
  name: "rebuild",
  description: "Rebuild the aibff binary",
  async run(args: Array<string>) {
    // Parse command line arguments
    const parsedArgs = parseArgs(args, {
      string: ["platform", "arch"],
      boolean: ["debug", "help"],
      alias: { h: "help", d: "debug" },
      default: {
        platform: Deno.build.os,
        arch: Deno.build.arch,
        debug: false,
      },
    });

    if (parsedArgs.help) {
      logger.info("Usage: aibff rebuild [options]");
      logger.info("\nOptions:");
      logger.info("  --platform <os>     Target platform (darwin, linux, windows)");
      logger.info("  --arch <arch>       Target architecture (x86_64, aarch64)");
      logger.info("  --debug, -d         Show debug output");
      logger.info("  --help, -h          Show this help message");
      logger.info("\nExamples:");
      logger.info("  aibff rebuild                               # Rebuild for current platform");
      logger.info("  aibff rebuild --platform linux --arch x86_64 # Build for Linux x64");
      logger.info("  aibff rebuild --debug                        # Rebuild with debug output");
      return;
    }

    const platform = parsedArgs.platform as string;
    const arch = parsedArgs.arch as string;

    logger.info(`Rebuilding aibff binary for ${platform}-${arch}...`);

    // Path to the build script
    const buildScriptPath = join(
      import.meta.dirname!,
      "..",
      "bin",
      "build.ts"
    );

    // Build the command arguments
    const buildArgs = [
      "run",
      "--allow-read",
      "--allow-run",
      "--allow-write",
      "--allow-env",
      buildScriptPath,
      "--platform",
      platform,
      "--arch",
      arch,
    ];

    if (parsedArgs.debug) {
      buildArgs.push("--debug");
    }

    // Run the build script
    const buildCommand = new Deno.Command("deno", {
      args: buildArgs,
      stdout: "inherit",
      stderr: "inherit",
      cwd: join(import.meta.dirname!, "../../.."), // Set working directory to project root
    });

    const { success } = await buildCommand.output();

    if (!success) {
      logger.error("Build failed!");
      Deno.exit(1);
    }

    logger.info("✅ Rebuild complete!");
  },
};