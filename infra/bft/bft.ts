/**
 * BFT (Bolt Foundry Task) - Core task types and management
 *
 * This is a cleanroom implementation that uses export-based task discovery.
 */

import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

export interface TaskDefinition {
  description: string;
  fn: (args: Array<string>) => number | Promise<number>;
  aiSafe?: boolean | ((args: Array<string>) => boolean);
  helpText?: string;
}

export const taskMap = new Map<string, TaskDefinition>();

// Built-in help task
export const help: TaskDefinition = {
  description: "Show available tasks or detailed help for a specific task",
  aiSafe: true,
  fn: (args: Array<string>) => {
    if (args.length === 0) {
      // Show all available tasks
      ui.output("Available tasks:\n");

      const tasks = Array.from(taskMap.entries())
        .sort(([a], [b]) => a.localeCompare(b));

      for (const [name, task] of tasks) {
        let aiSafeIndicator = "";
        if (typeof task.aiSafe === "boolean") {
          aiSafeIndicator = task.aiSafe ? " (AI-safe)" : "";
        } else if (typeof task.aiSafe === "function") {
          aiSafeIndicator = " (conditionally AI-safe)";
        } else {
          aiSafeIndicator = " (AI-safe)"; // default is safe
        }
        ui.output(`  ${name.padEnd(20)} ${task.description}${aiSafeIndicator}`);
      }

      ui.output(
        "\nUse 'bft help <command>' for detailed help on a specific command.",
      );
      return 0;
    }

    // Show help for specific command
    const commandName = args[0];
    const task = taskMap.get(commandName);

    if (!task) {
      ui.error(`Unknown command: ${commandName}`);
      ui.output("Use 'bft help' to see all available commands.");
      return 1;
    }

    ui.output(`Command: ${commandName}`);
    ui.output(`Description: ${task.description}`);

    let aiSafeIndicator = "";
    if (typeof task.aiSafe === "boolean") {
      aiSafeIndicator = task.aiSafe ? "AI-safe" : "Not AI-safe";
    } else if (typeof task.aiSafe === "function") {
      aiSafeIndicator = "Conditionally AI-safe";
    } else {
      aiSafeIndicator = "AI-safe"; // default is safe
    }
    ui.output(`AI Safety: ${aiSafeIndicator}`);

    if (task.helpText) {
      ui.output("\n" + task.helpText);
    } else {
      ui.output("\nNo additional help available for this command.");
    }

    return 0;
  },
};

// Register help as a built-in
taskMap.set("help", help);
