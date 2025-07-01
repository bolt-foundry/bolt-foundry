import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { genGqlTypesCommand } from "./genGqlTypes.bft.ts";
import { isoCommand } from "./iso.bft.ts";

const logger = getLogger(import.meta);

export async function buildCommand(options: Array<string>): Promise<number> {
  logger.info("Starting build pipeline...");

  try {
    // Step 1: Generate GraphQL types
    logger.info("Running genGqlTypes...");
    const gqlResult = await genGqlTypesCommand([]);
    if (gqlResult !== 0) {
      logger.error("❌ Build failed at genGqlTypes step");
      return gqlResult;
    }
    logger.info("✨ genGqlTypes complete");

    // Step 2: Run Isograph compiler
    logger.info("Running iso...");
    const isoResult = await isoCommand(options); // Pass through any options to iso
    if (isoResult !== 0) {
      logger.error("❌ Build failed at iso step");
      return isoResult;
    }
    logger.info("✨ iso complete");

    logger.info("🎉 Build pipeline completed successfully!");
    return 0;
  } catch (error) {
    logger.error("❌ Build pipeline failed:", error);
    return 1;
  }
}

export const bftDefinition = {
  description: "Run the full build pipeline (genGqlTypes → iso)",
  fn: buildCommand,
  aiSafe: true,
} satisfies TaskDefinition;
