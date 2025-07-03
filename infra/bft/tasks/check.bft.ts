import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function checkCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno type check...");

  const args = ["deno", "check"];

  // Add all arguments (no custom flags needed for basic check)
  args.push(...options);

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Type check passed!");
  } else {
    logger.error("❌ Type check failed");
  }

  return result;
}

export const bftDefinition = {
  description: "Run Deno type check",
  fn: checkCommand,
  aiSafe: true,
} satisfies TaskDefinition;
