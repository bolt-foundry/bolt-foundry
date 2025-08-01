#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/tui/tui.ts";
import { join } from "@std/path";

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

// Dynamic task discovery
async function loadBftTaskDefinitions(): Promise<Map<string, TaskDefinition>> {
  const taskMap = new Map<string, TaskDefinition>();

  // Add built-in help task
  taskMap.set("help", {
    description: "Show available tasks",
    aiSafe: true,
    fn: () => 0,
  });

  const bftTasksDir = join(
    import.meta.dirname!,
    ".",
  );

  try {
    for await (const entry of Deno.readDir(bftTasksDir)) {
      if (entry.isFile) {
        // Handle .bft.ts files
        if (entry.name.endsWith(".bft.ts")) {
          const taskName = entry.name.slice(0, -7); // Remove .bft.ts extension

          try {
            // Import the task module
            const modulePath = join(bftTasksDir, entry.name);
            const module = await import(modulePath);

            // Look for the bftDefinition export
            const taskDef = module.bftDefinition;

            if (
              taskDef && typeof taskDef.fn === "function" && taskDef.description
            ) {
              taskMap.set(taskName, taskDef);
            }
          } catch (_error) {
            // Silently ignore failed imports in the safety hook
          }
        } // Handle .bft.deck.md files
        else if (entry.name.endsWith(".bft.deck.md")) {
          const taskName = entry.name.slice(0, -12); // Remove .bft.deck.md extension

          // Deck tasks are always AI-safe
          taskMap.set(taskName, {
            description: `Run ${taskName} deck`,
            aiSafe: true,
            fn: () => 0,
          });
        }
      }
    }
  } catch (_error) {
    // Silently ignore directory read errors
  }

  return taskMap;
}

// Cache for task definitions to avoid repeated file system access
let taskDefinitionsCache: Map<string, TaskDefinition> | null = null;

async function getTaskDefinitions(): Promise<Map<string, TaskDefinition>> {
  if (!taskDefinitionsCache) {
    taskDefinitionsCache = await loadBftTaskDefinitions();
  }
  return taskDefinitionsCache;
}

// Special handling for sl command - hardcoded for now since it's not a .bft.ts file
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

  // Handle "bft requestApproval ..." commands
  if (
    parts.length >= 3 && parts[0] === "bft" && parts[1] === "requestApproval"
  ) {
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

async function isBftCommandSafe(
  command: string,
  subcommand?: string,
  args: Array<string> = [],
): Promise<{ exists: boolean; safe: boolean }> {
  // Special handling for sl command
  if (command === "sl" && subcommand) {
    return { exists: true, safe: SAFE_SL_SUBCOMMANDS.has(subcommand) };
  }

  // Get task definitions
  const taskDefinitions = await getTaskDefinitions();
  const taskDef = taskDefinitions.get(command);

  if (!taskDef) {
    return { exists: false, safe: false }; // Unknown command doesn't exist
  }

  // Evaluate aiSafe property
  let safe: boolean;
  if (typeof taskDef.aiSafe === "boolean") {
    safe = taskDef.aiSafe;
  } else if (typeof taskDef.aiSafe === "function") {
    try {
      safe = taskDef.aiSafe(args);
    } catch (_error) {
      safe = false; // If evaluation fails, assume unsafe
    }
  } else {
    safe = true; // Default is safe if aiSafe is undefined
  }

  return { exists: true, safe };
}

async function safety(): Promise<number> {
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
      return 0;
    }

    const command = hookInput.tool_input.command;

    // Only process bft commands
    if (!command.trim().startsWith("bft ")) {
      return 0;
    }

    const parsed = parseBftCommand(command);

    // If it's already marked requestApproval (bft requestApproval ...), let the normal permission system handle it
    if (command.includes("bft requestApproval ")) {
      return 0;
    }

    // Check if the command exists and is safe
    const { exists, safe } = await isBftCommandSafe(
      parsed.command,
      parsed.subcommand,
      parsed.args,
    );

    if (!exists) {
      const output: HookOutput = {
        decision: "block",
        reason: `bft ${parsed.command}${
          parsed.subcommand ? ` ${parsed.subcommand}` : ""
        } is not a defined BFT command. Run 'bft help' to see available commands.`,
      };
      ui.output(JSON.stringify(output));
    } else if (safe) {
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
        } requires manual approval. LLM agents should retry running the command with "bft requestApproval" so the user can opt in.`,
      };
      ui.output(JSON.stringify(output));
    }

    return 0;
  } catch (error) {
    ui.error(
      `Hook error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return 1;
  }
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Validate BFT command safety for AI agents",
  aiSafe: true,
  fn: safety,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const exitCode = await safety();
  Deno.exit(exitCode);
}
