#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";

export async function formatCommand(_options: Array<string>): Promise<number> {
  return await runShellCommand(["deno", "fmt"]);
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
