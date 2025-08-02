#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/tui/tui.ts";

async function run(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft run <file.bft.ts> [args...]");
    return 1;
  }

  const filePath = args[0];
  const fileArgs = args.slice(1);

  // Execute the .bft.ts file with deno
  const command = new Deno.Command("deno", {
    args: ["run", "-A", filePath, ...fileArgs],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await command.output();
  return code;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Execute a .bft.ts file",
  fn: run,
} satisfies TaskDefinition;
