import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function formatCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno format...");

  const args = ["deno", "fmt"];

  // Add any file arguments
  if (options.length > 0) {
    args.push(...options);
  }

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Formatting completed!");
  } else {
    logger.error("❌ Formatting failed");
  }

  return result;
}

export const bftDefinition = {
  description: "Format code using deno fmt",
  fn: formatCommand,
} satisfies TaskDefinition;
