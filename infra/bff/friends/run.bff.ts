#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { resolve } from "@std/path";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function runCommand(args: Array<string>): Promise<number> {
  // Get the directory path from the first argument
  const directory = args[0];

  if (!directory) {
    logger.error("Please specify a directory path");
    return 1;
  }

  // Resolve the full path
  const fullPath = resolve(directory);
  const bffPath = resolve(fullPath, "bff.ts");

  // Check if bff.ts exists in the directory
  try {
    await Deno.stat(bffPath);
  } catch {
    logger.error(`No bff.ts found in ${fullPath}`);
    return 1;
  }

  // Execute the bff.ts file
  const cmd = new Deno.Command(bffPath, {
    args: args.slice(1), // Pass any additional arguments
  });

  const child = cmd.spawn();
  const status = await child.status;

  return status.code || 0;
}

register(
  "run",
  "Run a bff.ts file in any directory",
  runCommand,
  [],
  true, // AI-safe
);
