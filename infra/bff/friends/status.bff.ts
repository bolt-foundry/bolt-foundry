#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function statusCommand(options: Array<string>): Promise<number> {
  logger.info("Running sl status...");

  const args = ["sl", "status", ...options];

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Status check completed successfully!");
  } else {
    logger.error("❌ Status command failed");
  }

  return result;
}

register(
  "status",
  "Show working directory status using Sapling (sl status)",
  statusCommand,
  [
    {
      option: "[options...]",
      description: "Optional arguments to pass to sl status.",
    },
    {
      option: "--help",
      description: "Show sl status help and options.",
    },
  ],
);
