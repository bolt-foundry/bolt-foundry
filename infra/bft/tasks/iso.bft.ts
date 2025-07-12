import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { generateAllAppSchemas } from "@bfmono/infra/bft/tasks/genAppSchemas.bft.ts";

const logger = getLogger(import.meta);

export async function isoCommand(options: Array<string>): Promise<number> {
  logger.info("Running isograph compiler...");

  // First, generate selective app schemas
  logger.info("Generating selective app schemas...");
  const schemaSuccess = await generateAllAppSchemas();
  if (!schemaSuccess) {
    logger.error(
      "❌ App schema generation failed, skipping isograph compilation",
    );
    return 1;
  }

  // Generate routes before compilation to clean up stale references
  logger.info("Generating built routes...");
  try {
    const routesBuildPath =
      new URL(import.meta.resolve("@bfmono/infra/appBuild/routesBuild.ts"))
        .pathname;
    const repoRoot = new URL(import.meta.resolve("@bfmono/")).pathname;
    const routesBuildResult = await runShellCommand(
      ["deno", "run", "-A", routesBuildPath],
      repoRoot,
    );

    if (routesBuildResult !== 0) {
      logger.error("❌ Routes build failed");
      return routesBuildResult;
    }
    logger.info("✅ Routes build completed successfully");
  } catch (error) {
    logger.error("Error running routes build:", error);
    return 1;
  }

  // Working directories with isograph configs
  const workingDirs = [
    "apps/boltFoundry",
    "apps/aibff/gui",
    "apps/boltfoundry-com",
  ];

  let overallResult = 0;

  for (const workingDir of workingDirs) {
    logger.info(`Running isograph compiler in ${workingDir}...`);

    try {
      const result = await runShellCommand(
        ["deno", "run", "-A", "npm:@isograph/compiler", ...options],
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
  description: "Run the isograph compiler to generate code from GraphQL",
  fn: isoCommand,
  aiSafe: true,
} satisfies TaskDefinition;
