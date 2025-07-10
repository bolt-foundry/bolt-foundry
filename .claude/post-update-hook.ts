#!/usr/bin/env -S deno run --allow-read --allow-run --allow-env

/**
 * Claude Code PostToolUse hook for running bft commands after file updates
 *
 * This hook runs after Edit, MultiEdit, or Write operations on .md or .ts files
 * and executes bft lint --fix, bft check, and bft format on the changed file.
 */

import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

interface HookContext {
  session_id: string;
  transcript_path: string;
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_response: unknown;
}

async function main() {
  try {
    // Read the hook context from stdin
    const input = await readStdin();
    const context: HookContext = JSON.parse(input);

    // Extract file path from the tool arguments
    const filePath = getFilePathFromContext(context);

    if (!filePath) {
      // No file path found, exit silently
      Deno.exit(0);
    }

    // Check if the file is a .md or .ts file
    if (!isTargetFile(filePath)) {
      // Not a target file type, exit silently
      Deno.exit(0);
    }

    // Run the bft commands on the file
    await runBftCommands(filePath);

    Deno.exit(0);
  } catch (error) {
    ui.error(`Post-update hook error: ${(error as Error).message}`);
    Deno.exit(1);
  }
}

async function readStdin(): Promise<string> {
  const decoder = new TextDecoder();
  const chunks: Array<Uint8Array> = [];

  for await (const chunk of Deno.stdin.readable) {
    chunks.push(chunk);
  }

  const combined = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  );
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return decoder.decode(combined);
}

function getFilePathFromContext(context: HookContext): string | null {
  const { tool_name, tool_input } = context;

  // Handle different tool types
  switch (tool_name) {
    case "Edit":
    case "MultiEdit":
    case "Write":
      return tool_input.file_path as string || null;
    default:
      return null;
  }
}

function isTargetFile(filePath: string): boolean {
  return filePath.endsWith(".md") || filePath.endsWith(".ts");
}

async function runBftCommands(filePath: string): Promise<void> {
  const commands = [
    { name: "format", args: ["bft", "format", filePath] },
    { name: "check", args: ["bft", "check", filePath] },
  ];

  const errors: Array<string> = [];
  let hasTypeErrors = false;

  for (const { name, args } of commands) {
    try {
      const process = new Deno.Command(args[0], {
        args: args.slice(1),
        stdout: "piped",
        stderr: "piped",
      });

      const { code, stderr } = await process.output();
      const stderrText = new TextDecoder().decode(stderr);

      if (code !== 0) {
        if (name === "check") {
          hasTypeErrors = true;
          // Extract just the type errors from the output
          const typeErrorLines = stderrText
            .split("\n")
            .filter((line) =>
              line.includes("TS") &&
              (line.includes("ERROR") || line.includes("error"))
            )
            .join("\n");
          if (typeErrorLines) {
            errors.push(`Type errors in ${filePath}:\n${typeErrorLines}`);
          }
        } else {
          errors.push(`${name} failed for ${filePath}:\n${stderrText}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to run ${name}: ${(error as Error).message}`);
    }
  }

  // Report results to Claude
  if (errors.length > 0) {
    ui.output(`\n🔍 Post-edit analysis for ${filePath}:`);
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
}

if (import.meta.main) {
  main();
}
