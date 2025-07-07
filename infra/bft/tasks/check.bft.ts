import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runCheckWithGithubAnnotations } from "@bfmono/infra/bff/friends/githubAnnotations.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function checkCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno type check...");

  // Check for GitHub Actions environment or explicit GitHub flag
  const githubMode = options.includes("--github") || options.includes("-g") ||
    getConfigurationVariable("GITHUB_ACTIONS") === "true";

  if (githubMode) {
    logger.info("Running type check in GitHub annotations mode...");
    return await runCheckWithGithubAnnotations();
  }

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
