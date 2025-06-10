#! /usr/bin/env -S bff

// ./infra/bff/friends/amend.bff.ts

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function amend(args: Array<string>): Promise<number> {
  // Check for --skip-precommit and --no-submit flags
  let runPreCheck = true;
  let submitPR = true;
  const filteredArgs = args.filter((arg) => {
    if (arg === "--skip-precommit") {
      runPreCheck = false;
      return false;
    }
    if (arg === "--no-submit") {
      submitPR = false;
      return false;
    }
    return true;
  });

  // Run precommit checks by default (unless skipped)
  if (runPreCheck) {
    logger.info("Running precommit checks...");
    const precommitResult = await runShellCommand(["bff", "precommit"]);
    if (precommitResult !== 0) {
      logger.error("❌ Precommit checks failed");
      return precommitResult;
    }
    logger.info("✅ Precommit checks passed");
  }

  // Run sl amend with filtered arguments
  const amendArgs = ["sl", "amend", ...filteredArgs];
  const amendResult = await runShellCommand(amendArgs);

  if (amendResult !== 0) {
    logger.error("❌ Failed to amend commit");
    return amendResult;
  }

  logger.info("✅ Commit amended successfully");

  // Submit PR if not skipped
  if (submitPR) {
    logger.info("Submitting PR...");
    const submitResult = await runShellCommand(["sl", "pr", "submit"]);
    if (submitResult !== 0) {
      logger.error("❌ Failed to submit PR");
      return submitResult;
    }
    logger.info("🚀 PR submitted successfully!");
  }

  return 0;
}

register(
  "amend",
  "Amend the current commit and submit PR",
  amend,
  [
    {
      option: "--skip-precommit",
      description:
        "Skip precommit checks (format, lint, type check, test). By default, pre-checks run automatically.",
    },
    {
      option: "--no-submit",
      description: "Skip PR submission after amending the commit.",
    },
  ],
  false, // Not AI-safe - modifies commits
);
