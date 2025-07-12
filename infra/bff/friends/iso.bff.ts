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

  // Apps that have isograph configurations
  const appsWithIsograph = ["apps/boltFoundry", "apps/boltfoundry-com"];
  
  const verbose = options.includes("--verbose");
  if (verbose) {
    options = options.filter((opt) => opt !== "--verbose");
  }

  let overallResult = 0;

  try {
    // Compile isograph for each app that has a configuration
    for (const workingDir of appsWithIsograph) {
      logger.info(`Compiling isograph for ${workingDir}...`);

      if (verbose) {
        const { stdout, stderr, code } = await runShellCommandWithOutput(
          [
            "deno",
            "run",
            "--no-check",
            "-A",
            "npm:@isograph/compiler",
            ...options,
          ],
          workingDir,
        );

        if (stdout) logger.info(stdout);
        if (stderr) logger.error(stderr);

        if (code === 0) {
          logger.info(`✅ Isograph compilation for ${workingDir} completed successfully`);
        } else {
          logger.error(`❌ Isograph compilation for ${workingDir} failed with code ${code}`);
          overallResult = code;
        }
      } else {
        // Standard execution for build pipeline
        const result = await runShellCommand(
          ["deno", "run", "-A", "npm:@isograph/compiler", ...options],
          workingDir,
        );

        if (result === 0) {
          logger.info(`✅ Isograph compilation for ${workingDir} completed successfully`);
        } else {
          logger.error(`❌ Isograph compilation for ${workingDir} failed with code ${result}`);
          overallResult = result;
        }
      }
    }

    if (overallResult === 0) {
      logger.info("✅ All isograph compilations completed successfully");
      await restartLspServer();
    } else {
      logger.error("❌ One or more isograph compilations failed");
    }

    return overallResult;
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
