#! /usr/bin/env -S bff

// ./infra/bff/friends/amend.bff.ts

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export async function amend(args: string[]): Promise<number> {
  // Just run sl amend with all provided arguments
  const amendArgs = ["sl", "amend", ...args];

  const amendResult = await runShellCommand(amendArgs);
  return amendResult;
}

register(
  "amend",
  "Amend the current commit (passes all arguments to 'sl amend')",
  amend,
  [],
  false, // Not AI-safe - modifies commits
);
