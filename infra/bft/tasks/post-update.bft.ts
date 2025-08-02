import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ui } from "@bfmono/packages/tui/tui.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function postUpdateCommand(
  filePaths: Array<string>,
): Promise<number> {
  // If no file paths provided via args, try to read from stdin (Claude hook context)
  if (filePaths.length === 0) {
    const hookInput = await readHookInput();
    if (hookInput) {
      const extractedPath = extractFilePathFromHookInput(hookInput);
      if (extractedPath) {
        filePaths = [extractedPath];
      }
    }
  }

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

interface HookInput {
  tool_input?: {
    file_path?: string;
    path?: string;
  };
  tool_response?: {
    filePath?: string;
  };
}

async function readHookInput(): Promise<HookInput | null> {
  try {
    const decoder = new TextDecoder();
    let input = "";

    // Read from stdin
    for await (const chunk of Deno.stdin.readable) {
      input += decoder.decode(chunk);
    }

    if (input.trim()) {
      return JSON.parse(input);
    }
  } catch (error) {
    logger.debug(`Failed to read hook input: ${error}`);
  }
  return null;
}

function extractFilePathFromHookInput(
  hookInput: HookInput | null,
): string | null {
  if (!hookInput) {
    return null;
  }

  try {
    // Check tool_input first (for Write, Edit, MultiEdit)
    if (hookInput.tool_input?.file_path) {
      return hookInput.tool_input.file_path;
    }

    // Check tool_response (alternative location)
    if (hookInput.tool_response?.filePath) {
      return hookInput.tool_response.filePath;
    }

    // For Update tool, might be in a different location
    if (hookInput.tool_input?.path) {
      return hookInput.tool_input.path;
    }
  } catch (error) {
    logger.debug(`Failed to extract file path from hook input: ${error}`);
  }
  return null;
}

function isTargetFile(filePath: string): boolean {
  return filePath.endsWith(".md") || filePath.endsWith(".ts") ||
    filePath.endsWith(".tsx");
}

async function runPostUpdateChecks(filePath: string): Promise<number> {
  const isTypeScript = filePath.endsWith(".ts") || filePath.endsWith(".tsx");

  // Only run format for markdown files, both format and check for TypeScript
  const commands = isTypeScript
    ? [
      { name: "format", args: ["bft", "format", filePath] },
      { name: "check", args: ["bft", "check", filePath] },
    ]
    : [
      { name: "format", args: ["bft", "format", filePath] },
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
    const checksRun = isTypeScript ? "(format, type check)" : "(format)";
    ui.output(
      `\n✅ File ${filePath} passed all checks ${checksRun}`,
    );
  }

  return overallResult;
}

export const bftDefinition = {
  description: "Run post-update checks (format and type check) on files",
  fn: postUpdateCommand,
} satisfies TaskDefinition;
