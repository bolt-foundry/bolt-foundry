/**
 * BFT (Bolt Foundry Task) - Core task types and management
 * 
 * This is a cleanroom implementation that uses export-based task discovery.
 */

import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

export interface TaskDefinition {
  description: string;
  fn: (args: Array<string>) => number | Promise<number>;
  aiSafe?: boolean;
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
      const aiSafeIndicator = task.aiSafe ? " (AI-safe)" : "";
      ui.output(`  ${name.padEnd(20)} ${task.description}${aiSafeIndicator}`);
    }
    
    return 0;
  }
};

// Register help as a built-in
taskMap.set("help", help);
