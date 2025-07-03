#!/usr/bin/env -S deno run --allow-read --allow-env

import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

interface HookInput {
  session_id: string;
  transcript_path: string;
  tool_name: string;
  tool_input: {
    command: string;
    description?: string;
  };
}

interface HookOutput {
  decision?: "approve" | "block";
  reason?: string;
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
}

const SAFE_BFT_COMMANDS = new Set([
  "echo",
  "help",
  "test",
  "lint",
  "deck",
  "genGqlTypes",
  "iso",
  "build",
  "aibff",
  "claudify",
  "code-reviewer",
  "commit",
]);

const SAFE_SL_SUBCOMMANDS = new Set([
  "status",
  "log",
  "show",
  "diff",
  "help",
  "annotate",
  "blame",
  "parents",
  "files",
  "cat",
  "export",
  "root",
  "whereami",
]);

function parseBftCommand(
  command: string,
): { command: string; subcommand?: string; args: Array<string> } {
  const parts = command.trim().split(/\s+/);

  // Handle "bft unsafe ..." commands
  if (parts.length >= 3 && parts[0] === "bft" && parts[1] === "unsafe") {
    return {
      command: parts[2],
      subcommand: parts[3],
      args: parts.slice(3),
    };
  }

  // Handle regular "bft ..." commands
  if (parts.length >= 2 && parts[0] === "bft") {
    return {
      command: parts[1],
      subcommand: parts[2],
      args: parts.slice(2),
    };
  }

  return { command: "", args: [] };
}

function isBftCommandSafe(command: string, subcommand?: string): boolean {
  // Always safe commands
  if (SAFE_BFT_COMMANDS.has(command)) {
    return true;
  }

  // Special handling for sl command
  if (command === "sl" && subcommand) {
    return SAFE_SL_SUBCOMMANDS.has(subcommand);
  }

  return false;
}

async function main() {
  try {
    let inputText = "";
    const decoder = new TextDecoder();
    const reader = Deno.stdin.readable.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      inputText += decoder.decode(value, { stream: true });
    }

    const hookInput: HookInput = JSON.parse(inputText);

    // Only process Bash tool calls
    if (hookInput.tool_name !== "Bash") {
      Deno.exit(0);
    }

    const command = hookInput.tool_input.command;

    // Only process bft commands
    if (!command.trim().startsWith("bft ")) {
      Deno.exit(0);
    }

    const parsed = parseBftCommand(command);

    // If it's already marked unsafe (bft unsafe ...), let the normal permission system handle it
    if (command.includes("bft unsafe ")) {
      Deno.exit(0);
    }

    // Check if the command is safe
    const isSafe = isBftCommandSafe(parsed.command, parsed.subcommand);

    if (isSafe) {
      const output: HookOutput = {
        decision: "approve",
        reason: `bft ${parsed.command}${
          parsed.subcommand ? ` ${parsed.subcommand}` : ""
        } is marked as AI-safe`,
      };
      ui.output(JSON.stringify(output));
    } else {
      const output: HookOutput = {
        decision: "block",
        reason: `bft ${parsed.command}${
          parsed.subcommand ? ` ${parsed.subcommand}` : ""
        } requires manual approval. LLM agents should retry running the command with "bft unsafe" so the user can opt in.`,
      };
      ui.output(JSON.stringify(output));
    }
  } catch (error) {
    ui.error(
      `Hook error: ${error instanceof Error ? error.message : String(error)}`,
    );
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
