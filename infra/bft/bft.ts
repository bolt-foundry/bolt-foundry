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
}

export const taskMap = new Map<string, TaskDefinition>();

// Built-in help task
export const help: TaskDefinition = {
  description: "Show available tasks",
  aiSafe: true,
  fn: (_args: Array<string>) => {
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

    return 0;
  },
};

// Register help as a built-in
taskMap.set("help", help);
