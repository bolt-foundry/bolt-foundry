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
  // Check if user provided a commit message
  let commitMessage = "";
  const filesToCommit: string[] = [];

  // Parse arguments - look for -m flag
  let messageIndex = -1;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-m" && i + 1 < args.length) {
      commitMessage = args[i + 1];
      messageIndex = i;
      break;
    }
  }

  // Get files to commit (all args except -m and the message)
  for (let i = 0; i < args.length; i++) {
    if (i !== messageIndex && i !== messageIndex + 1) {
      filesToCommit.push(args[i]);
    }
  }

  if (!commitMessage) {
    logger.error(
      '❌ No commit message provided. Usage: bff amend -m "Your message" [files...]',
    );
    return 1;
  }

  logger.info("Running pre-amend checks...");
  
  // Run all precommit checks
  if (!await runPrecommitChecks()) {
    return 1;
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
  const amendArgs = ["sl", "commit", "--amend", "-m", commitMessage];
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
  return 0;
}

register(
  "amend",
  "Run precommit checks and amend the current commit",
  amend,
);