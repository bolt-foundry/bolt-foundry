import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function postUpdateCommand(
  filePaths: Array<string>,
): Promise<number> {
  if (filePaths.length === 0) {
    ui.error("No file paths provided");
    return 1;
  }

  let overallResult = 0;

  for (const filePath of filePaths) {
    // Check if the file is a target file type
    if (!isTargetFile(filePath)) {
      logger.info(`Skipping ${filePath} - not a .md or .ts file`);
      continue;
    }

    logger.info(`Running post-update checks for ${filePath}...`);
    const result = await runPostUpdateChecks(filePath);
    if (result !== 0) {
      overallResult = result;
    }
  }

  return overallResult;
}

function isTargetFile(filePath: string): boolean {
  return filePath.endsWith(".md") || filePath.endsWith(".ts");
}

async function runPostUpdateChecks(filePath: string): Promise<number> {
  const commands = [
    { name: "format", args: ["bft", "format", filePath] },
    { name: "check", args: ["bft", "check", filePath] },
  ];

  const errors: Array<string> = [];
  let hasTypeErrors = false;
  let overallResult = 0;

  for (const { name, args } of commands) {
    try {
      const result = await runShellCommand(args);

      if (result !== 0) {
        overallResult = result;
        if (name === "check") {
          hasTypeErrors = true;
          errors.push(`Type check failed for ${filePath}`);
        } else {
          errors.push(`${name} failed for ${filePath}`);
        }
      }
    } catch (error) {
      overallResult = 1;
      errors.push(`Failed to run ${name}: ${(error as Error).message}`);
    }
  }

  // Report results
  if (errors.length > 0) {
    ui.output(`\n🔍 Post-update analysis for ${filePath}:`);
    for (const error of errors) {
      ui.output(error);
    }

    if (hasTypeErrors) {
      ui.output(
        `\n❌ Type checking failed - please fix the type errors above.`,
      );
    }
  } else {
    ui.output(
      `\n✅ File ${filePath} passed all checks (format, type check)`,
    );
  }

  return overallResult;
}

export const bftDefinition = {
  description: "Run post-update checks (format and type check) on files",
  fn: postUpdateCommand,
  aiSafe: true,
} satisfies TaskDefinition;
