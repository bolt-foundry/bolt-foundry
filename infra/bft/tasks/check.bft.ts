import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runCheckWithGithubAnnotations } from "@bfmono/infra/bff/friends/githubAnnotations.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function checkCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno type check...");

  // Check for GitHub annotations mode
  const githubMode = options.includes("--github") || options.includes("-g");
  if (githubMode) {
    logger.info("Running in GitHub annotations mode...");
    return await runCheckWithGithubAnnotations();
  }

  const args = ["deno", "check"];

  // Add all other arguments (excluding our custom flags)
  const filteredOptions = options.filter((opt) =>
    opt !== "--github" && opt !== "-g"
  );
  args.push(...filteredOptions);

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Type check passed!");
  } else {
    logger.error("❌ Type check failed");
  }

  return result;
}

export const bftDefinition = {
  description:
    "Run Deno type check. Use --github/-g for GitHub annotations output",
  fn: checkCommand,
  aiSafe: true,
} satisfies TaskDefinition;
