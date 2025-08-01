#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";

function aibff(args: Array<string>): number {
  const command = new Deno.Command("aibff", {
    args,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = command.outputSync();
  return result.code;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Forward to aibff command",
  fn: aibff,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(aibff(scriptArgs));
}
