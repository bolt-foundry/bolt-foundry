import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runTestWithGithubAnnotations } from "@bfmono/infra/bff/friends/githubAnnotations.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function testCommand(options: Array<string>): Promise<number> {
  logger.info("Running tests...");
  logger.debug("Test command options:", options);

  // Check for GitHub annotations mode
  const githubMode = options.includes("--github") || options.includes("-g");
  if (githubMode) {
    logger.info("Running in GitHub annotations mode...");
    return await runTestWithGithubAnnotations();
  }

  const args = ["deno", "test", "-A"];

  // Exclude E2E tests by default unless specifically requested
  const hasE2EFlag = options.some((opt) =>
    opt.includes("e2e") || opt.includes("E2E")
  );
  if (!hasE2EFlag) {
    args.push("--ignore=**/*.e2e.ts");
    logger.debug("Added E2E exclusion");
  }

  // Exclude Sapling backup files
  args.push("--ignore=.sl/**");

  // Add all other arguments (excluding our custom flags)
  const filteredOptions = options.filter((opt) =>
    opt !== "--github" && opt !== "-g"
  );
  args.push(...filteredOptions);

  logger.debug("Final test command args:", args);
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
