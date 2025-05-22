#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function logCommand(options: string[]): Promise<number> {
  logger.info("Running sl log...");

  const args = ["sl", "log", ...options];

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Log command completed successfully!");
  } else {
    logger.error("❌ Log command failed");
  }

  return result;
}

register(
  "log",
  "Show commit history using Sapling (sl log)",
  logCommand,
  [
    {
      option: "[options...]",
      description: "Optional arguments to pass to sl log.",
    },
    {
      option: "--help",
      description: "Show sl log help and options.",
    },
  ],
  true, // AI-safe - read-only operation
);