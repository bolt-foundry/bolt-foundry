#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { exists } from "@std/fs";
import { join } from "@std/path";

async function iso(args: Array<string>): Promise<number> {
  // Get the actual current working directory (where the user ran the command from)
  const cwd = Deno.cwd();

  // Check if there's a local isograph.config.json in the current directory
  const localConfig = join(cwd, "isograph.config.json");
  const hasLocalConfig = await exists(localConfig);

  // If there's a local config and no --config flag was provided, add it
  const finalArgs = [...args];
  if (
    hasLocalConfig &&
    !args.some((arg) => arg === "--config" || arg.startsWith("--config="))
  ) {
    finalArgs.unshift("--config", localConfig);
  }

  const cmd = new Deno.Command("deno", {
    args: ["run", "-A", "npm:@isograph/compiler", ...finalArgs],
    cwd: cwd, // Run the compiler in the user's current directory
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  const process = cmd.spawn();
  const status = await process.status;

  return status.code;
}

export const bftDefinition = {
  description: "Run the Isograph compiler",
  aiSafe: true,
  fn: iso,
} satisfies TaskDefinition;

if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await iso(scriptArgs));
}
