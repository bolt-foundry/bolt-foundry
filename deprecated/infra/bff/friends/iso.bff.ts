#! /usr/bin/env -S bff

// ./infra/bff/friends/iso.bff.ts
import { register } from "@bfmono/infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Runs the isograph compiler to generate code from GraphQL
 *
 * @param options Command-line options passed to the isograph command
 * @returns Exit code (0 for success, non-zero for failure)
 */
export async function isoCommand(options: Array<string>): Promise<number> {
  logger.info("Running isograph compiler...");

  // Default working directory is apps/boltFoundry where the isograph config lives
  const workingDir = "apps/boltFoundry";

  try {
    // When called directly, provide more verbose output
    if (options.includes("--verbose")) {
      options = options.filter((opt) => opt !== "--verbose");
      const { stdout, stderr, code } = await runShellCommandWithOutput(
        [
          "deno",
          "run",
          "--no-check",
          "-A",
          "npm:@isograph/compiler",
          ...options,
        ],
      );

      if (stdout) logger.info(stdout);
      if (stderr) logger.error(stderr);

      if (code === 0) {
        logger.info("✅ Isograph compilation completed successfully");
        await restartLspServer();
      } else {
        logger.error(`❌ Isograph compilation failed with code ${code}`);
      }

      return code;
    }

    // Standard execution for build pipeline
    const result = await runShellCommand(
      ["deno", "run", "-A", "npm:@isograph/compiler", ...options],
      workingDir,
    );

    if (result === 0) {
      logger.info("✅ Isograph compilation completed successfully");
      await restartLspServer();
    } else {
      logger.error(`❌ Isograph compilation failed with code ${result}`);
    }

    return result;
  } catch (error) {
    logger.error("Error running isograph compiler:", error);
    return 1;
  }
}

/**
 * Restart the Deno LSP server to pick up changes
 */
async function restartLspServer(): Promise<void> {
  logger.info("Restarting LSP server to pick up changes...");
  try {
    await runShellCommand(["pkill", "-f", "deno lsp"]);
    logger.info("LSP server restarted successfully");
  } catch {
    logger.info("No LSP process found to restart");
  }
}

// Register the command with the BFF framework
register(
  "iso",
  "Run the isograph compiler to generate code from GraphQL",
  isoCommand,
  [],
);
