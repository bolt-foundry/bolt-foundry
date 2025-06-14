import type { Command } from "./types.ts";
import { getLogger, startSpinner } from "packages/logger/logger.ts";
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
      logger.println("Usage: aibff rebuild [options]");
      logger.println("\nOptions:");
      logger.println(
        "  --platform <os>     Target platform (darwin, linux, windows)",
      );
      logger.println(
        "  --arch <arch>       Target architecture (x86_64, aarch64)",
      );
      logger.println("  --debug, -d         Show debug output");
      logger.println("  --help, -h          Show this help message");
      logger.println("\nExamples:");
      logger.println(
        "  aibff rebuild                               # Rebuild for current platform",
      );
      logger.println(
        "  aibff rebuild --platform linux --arch x86_64 # Build for Linux x64",
      );
      logger.println(
        "  aibff rebuild --debug                        # Rebuild with debug output",
      );
      return;
    }

    const platform = parsedArgs.platform as string;
    const arch = parsedArgs.arch as string;

    logger.println(`Rebuilding aibff binary for ${platform}-${arch}...`);

    // Path to the build script
    const buildScriptPath = join(
      import.meta.dirname!,
      "..",
      "bin",
      "build.ts",
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

    // Run the build script with spinner
    const stopSpinner = startSpinner();

    const buildCommand = new Deno.Command("deno", {
      args: buildArgs,
      stdout: "inherit",
      stderr: "inherit",
      cwd: join(import.meta.dirname!, "../../.."), // Set working directory to project root
    });

    const { success } = await buildCommand.output();
    stopSpinner();

    if (!success) {
      logger.println("Build failed!", { isError: true });
      Deno.exit(1);
    }

    logger.println("✅ Rebuild complete!");
  },
};
