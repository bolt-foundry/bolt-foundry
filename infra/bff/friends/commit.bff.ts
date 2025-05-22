#! /usr/bin/env -S bff

// ./infra/bff/friends/commit.bff.ts

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

export async function commit(args: string[]): Promise<number> {
  // Check if user provided a commit message
  let commitMessage = "";
  const filesToCommit: string[] = [];
  let runPreCheck = false;
  let submitPR = false;

  // Parse arguments - look for -m flag, --pre-check flag, and --submit flag
  const skipIndices = new Set<number>();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-m" && i + 1 < args.length) {
      commitMessage = args[i + 1];
      skipIndices.add(i);
      skipIndices.add(i + 1);
    } else if (args[i] === "--pre-check") {
      runPreCheck = true;
      skipIndices.add(i);
    } else if (args[i] === "--submit") {
      submitPR = true;
      skipIndices.add(i);
    }
  }

  // Get files to commit (all args except -m, the message, and --pre-check)
  for (let i = 0; i < args.length; i++) {
    if (!skipIndices.has(i)) {
      filesToCommit.push(args[i]);
    }
  }

  if (!commitMessage) {
    logger.error(
      '❌ No commit message provided. Usage: bff commit -m "Your message" [--pre-check] [files...]',
    );
    return 1;
  }

  // Run precommit checks if requested
  if (runPreCheck) {
    logger.info("Running precommit checks...");
    if (!await runPrecommitChecks()) {
      return 1;
    }
  }

  logger.info("Creating commit...");

  // Create the commit
  const commitArgs = ["sl", "commit", "-m", commitMessage];
  if (filesToCommit.length > 0) {
    commitArgs.push(...filesToCommit);
  }

  const commitResult = await runShellCommand(commitArgs);
  if (commitResult !== 0) {
    logger.error("❌ Failed to create commit");
    return commitResult;
  }

  logger.info("🎉 Commit created successfully!");

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
  "commit",
  "Create a commit",
  commit,
  [
    {
      option: "-m <message>",
      description: "Commit message.",
    },
    {
      option: "--pre-check",
      description:
        "Run precommit checks (format, lint, type check) before committing.",
    },
    {
      option: "--submit",
      description: "Submit a PR after creating the commit.",
    },
    {
      option: "[files...]",
      description:
        "Optional files to commit. If not provided, commits all staged changes.",
    },
  ],
  false, // Not AI-safe - creates commits
);
