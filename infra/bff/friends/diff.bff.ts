#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function diffCommand(options: Array<string>): Promise<number> {
  logger.info("Running sl diff...");

  const args = ["sl", "diff", ...options];

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Diff completed successfully!");
  } else {
    logger.error("❌ Diff command failed");
  }

  return result;
}

register(
  "diff",
  "Show diff of current changes using Sapling (sl diff)",
  diffCommand,
  [
    {
      option: "[files...]",
      description:
        "Optional files to diff. If not provided, shows all changes.",
    },
    {
      option: "--help",
      description: "Show sl diff help and options.",
    },
  ],
);
