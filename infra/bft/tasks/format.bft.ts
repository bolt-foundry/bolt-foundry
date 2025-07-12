import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runFormatWithGithubAnnotations } from "@bfmono/infra/bff/friends/githubAnnotations.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function formatCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno format...");

  const args = ["deno", "fmt"];

  // Check for GitHub annotations mode
  const githubMode = options.includes("--github") || options.includes("-g");
  if (githubMode) {
    logger.info("Running in GitHub annotations mode...");
    return await runFormatWithGithubAnnotations();
  }

  // Add all other arguments (excluding our custom flags)
  const filteredOptions = options.filter((opt) =>
    opt !== "--github" && opt !== "-g"
  );
  args.push(...filteredOptions);

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
