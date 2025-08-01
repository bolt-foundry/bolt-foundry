import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runLintWithGithubAnnotations } from "@bfmono/infra/bff/friends/githubAnnotations.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function lintCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno lint...");

  const args = ["deno", "lint"];

  // Check for GitHub annotations mode
  const githubMode = options.includes("--github") || options.includes("-g");
  if (githubMode) {
    logger.info("Running in GitHub annotations mode...");
    return await runLintWithGithubAnnotations();
  }

  // Auto-fix by default unless --no-fix is specified
  const noFix = options.includes("--no-fix");
  if (!noFix) {
    args.push("--fix");
    logger.info("Auto-fixing linting issues...");
  }

  // Add all other arguments (excluding our custom flags)
  const filteredOptions = options.filter((opt) =>
    opt !== "--github" && opt !== "-g" && opt !== "--no-fix"
  );
  args.push(...filteredOptions);

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Linting passed!");
  } else {
    logger.error("❌ Linting failed");
  }

  return result;
}

export const bftDefinition = {
  description: "Run Deno lint (auto-fix by default)",
  fn: lintCommand,
} satisfies TaskDefinition;
