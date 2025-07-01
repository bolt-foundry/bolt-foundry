import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function testCommand(options: Array<string>): Promise<number> {
  logger.info("Running tests...");

  const args = ["deno", "test"];

  // Pass through all arguments directly to deno test
  args.push(...options);

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ All tests passed!");
  } else {
    logger.error("❌ Tests failed");
  }

  return result;
}

export const bftDefinition = {
  description: "Run Deno tests",
  fn: testCommand,
  aiSafe: true,
} satisfies TaskDefinition;
