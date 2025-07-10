#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

function echo(args: Array<string>): number {
  ui.output(args.join(" "));
  return 0;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Echo arguments to stdout",
  aiSafe: true,
  fn: echo,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(echo(scriptArgs));
}

// Test comment for smart validation
