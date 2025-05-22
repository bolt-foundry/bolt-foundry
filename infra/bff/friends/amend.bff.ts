#! /usr/bin/env -S bff

// ./infra/bff/friends/amend.bff.ts

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Run the standard precommit checks (format, lint, type checking)
 */
async function runPrecommitChecks(): Promise<boolean> {
  // Step 1: Run bff format
  logger.info("Step 1/3: Formatting code...");
  const formatResult = await runShellCommand(["bff", "format"]);
  if (formatResult !== 0) {
    logger.error("❌ Failed to format code");
    return false;
  }
  logger.info("✅ Code formatted successfully");

  // Step 2: Run bff lint
  logger.info("Step 2/3: Linting code...");
  const lintResult = await runShellCommand(["bff", "lint"]);
  if (lintResult !== 0) {
    logger.error("❌ Failed linting checks");
    return false;
  }
  logger.info("✅ Linting passed");

  // Step 3: Run bff check
  logger.info("Step 3/3: Type checking...");
  const checkResult = await runShellCommand(["bff", "check"]);
  if (checkResult !== 0) {
    logger.error("❌ Failed type checking");
    return false;
  }
  logger.info("✅ Type checking passed");

  return true;
}

export async function amend(args: string[]): Promise<number> {
  // Check if user provided a commit message and flags
  let commitMessage = "";
  const filesToCommit: string[] = [];
  let runPreChecks = false;
  let submitPR = false;

  // Parse arguments - look for -m flag, --pre-check flag, and --submit flag
  const skipIndices = new Set<number>();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-m" && i + 1 < args.length) {
      commitMessage = args[i + 1];
      skipIndices.add(i);
      skipIndices.add(i + 1);
    } else if (args[i] === "--pre-check") {
      runPreChecks = true;
      skipIndices.add(i);
    } else if (args[i] === "--submit") {
      submitPR = true;
      skipIndices.add(i);
    }
  }

  // Get files to commit (all args except flags and their values)
  for (let i = 0; i < args.length; i++) {
    if (!skipIndices.has(i)) {
      filesToCommit.push(args[i]);
    }
  }

  // Run precommit checks only if --pre-check flag is provided
  if (runPreChecks) {
    logger.info("Running pre-amend checks...");
    if (!await runPrecommitChecks()) {
      return 1;
    }
  }

  // Run sl diff to show changes
  logger.info("Showing changes...");
  const diffResult = await runShellCommand(["sl", "diff"]);
  if (diffResult !== 0) {
    logger.error("❌ Failed to show diff");
    return diffResult;
  }

  // Amend the commit
  logger.info("Amending commit...");
  const amendArgs = ["sl", "commit", "--amend"];
  if (commitMessage) {
    amendArgs.push("-m", commitMessage);
  }
  if (filesToCommit.length > 0) {
    amendArgs.push(...filesToCommit);
  }

  const amendResult = await runShellCommand(amendArgs);
  if (amendResult !== 0) {
    logger.error("❌ Failed to amend commit");
    return amendResult;
  }

  // All done!
  logger.info("\n🎉 Commit amended successfully!");

  // Submit PR if requested
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
  "Amend the current commit (use --pre-check to run format/lint/check first)",
  amend,
  [
    {
      option: "-m <message>",
      description: "New commit message.",
    },
    {
      option: "--pre-check",
      description:
        "Run precommit checks (format, lint, type check) before amending.",
    },
    {
      option: "--submit",
      description: "Submit a PR after amending the commit.",
    },
    {
      option: "[files...]",
      description:
        "Optional files to amend. If not provided, amends all changes.",
    },
  ],
  false, // Not AI-safe - modifies commits
);
