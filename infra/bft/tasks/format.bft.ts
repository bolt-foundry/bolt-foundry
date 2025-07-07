import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runFormatWithGithubAnnotations } from "@bfmono/infra/bff/friends/githubAnnotations.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function formatCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno format...");

  // Check for GitHub Actions environment or explicit GitHub flag
  const githubMode = options.includes("--github") || options.includes("-g") ||
    getConfigurationVariable("GITHUB_ACTIONS") === "true";

  // If --check is specified and we're in GitHub mode, use GitHub annotations
  if (githubMode && options.includes("--check")) {
    logger.info("Running format check in GitHub annotations mode...");
    return await runFormatWithGithubAnnotations();
  }

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
  aiSafe: true,
} satisfies TaskDefinition;
