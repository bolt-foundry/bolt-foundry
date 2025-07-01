#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";

export async function formatCommand(options: Array<string>): Promise<number> {
  const args = ["deno", "fmt"];

  // Add any file arguments
  if (options.length > 0) {
    args.push(...options);
  }

  return await runShellCommand(args);
}

// Register both 'format' and 'f' as aliases for the same command
register(
  "format",
  "Format code using deno fmt",
  formatCommand,
  [],
  true, // AI-safe
);

register(
  "f",
  "Alias for format command",
  formatCommand,
  [],
  true, // AI-safe
);
