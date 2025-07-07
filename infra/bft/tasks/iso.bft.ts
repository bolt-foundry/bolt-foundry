import {
  runShellCommand,
  type runShellCommandWithOutput as _runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { walk } from "@std/fs";
import { dirname, relative } from "@std/path";

const logger = getLogger(import.meta);

/**
 * Auto-discover directories containing isograph.config.json files
 */
async function findIsographConfigs(): Promise<Array<string>> {
  const monorepoRoot = new URL("../../../", import.meta.url).pathname;
  const configs: Array<string> = [];

  for await (
    const entry of walk(monorepoRoot, {
      includeDirs: false,
      match: [/isograph\.config\.json$/],
      skip: [/node_modules/, /\.git/, /dist/, /build/, /__generated__/],
    })
  ) {
    // Get the directory containing the config file
    const configDir = dirname(entry.path);
    // Make it relative to the monorepo root
    const relativeDir = relative(monorepoRoot, configDir);
    configs.push(relativeDir);
  }

  return configs.sort();
}

export async function isoCommand(options: Array<string>): Promise<number> {
  logger.info("Running isograph compiler...");

  // Separate directory arguments from compiler flags
  const targetDirs = options.filter((opt) => !opt.startsWith("-"));
  const compilerFlags = options.filter((opt) => opt.startsWith("-"));

  let workingDirs: Array<string>;
  if (targetDirs.length > 0) {
    // Specific directories provided
    workingDirs = targetDirs;
    logger.info(`Targeting specific directories: ${targetDirs.join(", ")}`);
  } else {
    // Auto-discover all isograph configs
    workingDirs = await findIsographConfigs();
    if (workingDirs.length === 0) {
      logger.warn("No isograph.config.json files found in the monorepo");
      return 0;
    }
    logger.info(
      `Auto-discovered ${workingDirs.length} Isograph projects: ${
        workingDirs.join(", ")
      }`,
    );
  }

  let overallResult = 0;

  for (const workingDir of workingDirs) {
    logger.info(`Running isograph compiler in ${workingDir}...`);

    try {
      const result = await runShellCommand(
        ["deno", "run", "-A", "npm:@isograph/compiler", ...compilerFlags],
        workingDir,
      );

      if (result === 0) {
        logger.info(
          `✅ Isograph compilation completed successfully in ${workingDir}`,
        );
      } else {
        logger.error(
          `❌ Isograph compilation failed in ${workingDir} with code ${result}`,
        );
        overallResult = result; // Track any failures
      }
    } catch (error) {
      logger.error(`Error running isograph compiler in ${workingDir}:`, error);
      overallResult = 1;
    }
  }

  if (overallResult === 0) {
    logger.info("✅ All Isograph compilations completed successfully");
  } else {
    logger.error("❌ One or more Isograph compilations failed");
  }

  return overallResult;
}

export const bftDefinition = {
  description:
    "Run the isograph compiler to generate code from GraphQL. Auto-discovers all isograph.config.json files, or specify directories: 'bft iso apps/my-app'",
  fn: isoCommand,
  aiSafe: true,
} satisfies TaskDefinition;
