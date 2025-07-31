#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function cCommand(options: Array<string>): Promise<number> {
  logger.info("Running type check via 'c' command...");

  // Simply pass all arguments to the check command
  const result = await runShellCommand(["bff", "check", ...options]);

  return result;
}

register(
  "c",
  "Shortcut for 'bff check'",
  cCommand,
);
