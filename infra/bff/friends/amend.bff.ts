#! /usr/bin/env -S bff

// ./infra/bff/friends/amend.bff.ts

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function amend(args: Array<string>): Promise<number> {
  // Check for --skip-precommit, --no-submit, and --verbose flags
  let runPreCheck = true;
  let submitPR = true;
  let verbose = false;
  const filteredArgs = args.filter((arg) => {
    if (arg === "--skip-precommit") {
      runPreCheck = false;
      return false;
    }
    if (arg === "--no-submit") {
      submitPR = false;
      return false;
    }
    if (arg === "--verbose" || arg === "-v") {
      verbose = true;
      return false;
    }
    return true;
  });

  // Separate files from other arguments for precommit
  const files: Array<string> = [];
  const otherArgs: Array<string> = [];

  for (const arg of filteredArgs) {
    if (!arg.startsWith("-")) {
      files.push(arg);
    } else {
      otherArgs.push(arg);
    }
  }

  // Run precommit checks by default (unless skipped)
  if (runPreCheck) {
    logger.info("Running precommit checks...");
    const precommitArgs = ["bff", "precommit"];
    if (verbose) {
      precommitArgs.push("--verbose");
    }
    // Add file arguments if provided
    if (files.length > 0) {
      precommitArgs.push(...files);
    }
    const precommitResult = await runShellCommand(precommitArgs);
    if (precommitResult !== 0) {
      logger.error("❌ Precommit checks failed");
      return precommitResult;
    }
    logger.info("✅ Precommit checks passed");
  }

  // Run sl amend with all filtered arguments (including files)
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
    {
      option: "--verbose, -v",
      description:
        "Show full output from pre-commit checks. By default, shows concise output.",
    },
  ],
);
