import {
  runShellCommand,
  type runShellCommandWithOutput as _runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function isoCommand(options: Array<string>): Promise<number> {
  logger.info("Running isograph compiler...");

  // Default working directory is apps/boltFoundry where the isograph config lives
  const workingDir = "apps/boltFoundry";

  try {
    // Standard execution for build pipeline (--verbose flag not needed for our use case)
    const result = await runShellCommand(
      ["deno", "run", "-A", "npm:@isograph/compiler", ...options],
      workingDir,
    );

    if (result === 0) {
      logger.info("✅ Isograph compilation completed successfully");
    } else {
      logger.error(`❌ Isograph compilation failed with code ${result}`);
    }

    return result;
  } catch (error) {
    logger.error("Error running isograph compiler:", error);
    return 1;
  }
}

export const bftDefinition = {
  description: "Run the isograph compiler to generate code from GraphQL",
  fn: isoCommand,
  aiSafe: true,
} satisfies TaskDefinition;
