#! /usr/bin/env -S bff

// ./infra/bff/friends/commit.bff.ts

import { register } from "@bfmono/infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Stage all untracked files and remove missing files
 */
async function stageAllFiles(): Promise<number> {
  // Get status to find unknown and missing files
  const { stdout: statusOutput, code: statusCode } =
    await runShellCommandWithOutput(["sl", "status"]);

  if (statusCode !== 0) {
    logger.error("Failed to get repository status");
    return statusCode;
  }

  const lines = statusOutput.split("\n").filter((line) => line.trim());
  const unknownFiles: Array<string> = [];
  const missingFiles: Array<string> = [];

  for (const line of lines) {
    const status = line.charAt(0);
    const file = line.slice(2); // Skip status character and space

    if (status === "?") {
      unknownFiles.push(file);
    } else if (status === "!") {
      missingFiles.push(file);
    }
  }

  // Add unknown files
  if (unknownFiles.length > 0) {
    logger.info(`Adding ${unknownFiles.length} unknown files...`);
    for (const file of unknownFiles) {
      const result = await runShellCommand(["sl", "add", file]);
      if (result !== 0) {
        logger.error(`Failed to add ${file}`);
        return result;
      }
    }
  }

  // Remove missing files
  if (missingFiles.length > 0) {
    logger.info(`Removing ${missingFiles.length} missing files...`);
    for (const file of missingFiles) {
      const result = await runShellCommand(["sl", "remove", file]);
      if (result !== 0) {
        logger.error(`Failed to remove ${file}`);
        return result;
      }
    }
  }

  return 0;
}

/**
 * Run the full precommit checks
 */
async function runPrecommitChecks(
  verbose: boolean,
  files: Array<string>,
): Promise<boolean> {
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
    return false;
  }
  logger.info("✅ Precommit checks passed");
  return true;
}

export async function commit(args: Array<string>): Promise<number> {
  // Check if user provided a commit message
  let commitMessage = "";
  const filesToCommit: Array<string> = [];
  let runPreCheck = true; // Default to true - run pre-checks by default
  let submitPR = true; // Default to true - submit PR by default
  let verbose = false; // Default to false - concise output by default

  // Parse arguments - look for -m flag, --skip-precommit flag, --no-submit flag, and --verbose flag
  const skipIndices = new Set<number>();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-m" && i + 1 < args.length) {
      commitMessage = args[i + 1];
      skipIndices.add(i);
      skipIndices.add(i + 1);
    } else if (args[i] === "--skip-precommit") {
      runPreCheck = false;
      skipIndices.add(i);
    } else if (args[i] === "--no-submit") {
      submitPR = false;
      skipIndices.add(i);
    } else if (args[i] === "--verbose" || args[i] === "-v") {
      verbose = true;
      skipIndices.add(i);
    }
  }

  // Get files to commit (all args except -m, the message, and --skip-precommit)
  for (let i = 0; i < args.length; i++) {
    if (!skipIndices.has(i)) {
      filesToCommit.push(args[i]);
    }
  }

  if (!commitMessage) {
    logger.error(
      '❌ No commit message provided. Usage: bff commit -m "Your message" [--skip-precommit] [--no-submit] [--verbose] [files...]',
    );
    return 1;
  }

  // Run precommit checks by default (unless skipped)
  if (runPreCheck) {
    if (!await runPrecommitChecks(verbose, filesToCommit)) {
      return 1;
    }
  }

  // Stage files appropriately
  if (filesToCommit.length > 0) {
    // If specific files are provided, stage only those files
    logger.info("Staging specified files...");

    // Check which files exist and which are deleted
    const existingFiles: Array<string> = [];
    const deletedFiles: Array<string> = [];

    for (const file of filesToCommit) {
      try {
        await Deno.stat(file);
        existingFiles.push(file);
      } catch {
        // File doesn't exist, assume it's deleted
        deletedFiles.push(file);
      }
    }

    // Add existing files
    if (existingFiles.length > 0) {
      const addArgs = ["sl", "add", ...existingFiles];
      const addResult = await runShellCommand(addArgs);
      if (addResult !== 0) {
        logger.error("❌ Failed to add files");
        return addResult;
      }
    }

    // Mark deleted files for removal
    if (deletedFiles.length > 0) {
      const removeArgs = ["sl", "remove", "--mark", ...deletedFiles];
      const removeResult = await runShellCommand(removeArgs);
      if (removeResult !== 0) {
        logger.error("❌ Failed to mark deleted files for removal");
        return removeResult;
      }
    }
  } else {
    // No specific files provided - stage all changes
    logger.info("Staging all changes...");
    const stageResult = await stageAllFiles();
    if (stageResult !== 0) {
      logger.error("❌ Failed to stage files");
      return stageResult;
    }
  }

  logger.info("Creating commit...");

  // If specific files were provided, include any files marked for removal
  let allFilesToCommit = filesToCommit;
  if (filesToCommit.length > 0) {
    // Get status to find all files marked for removal
    const { stdout: statusOutput } = await runShellCommandWithOutput([
      "sl",
      "status",
    ]);
    const removedFiles: Array<string> = [];

    const lines = statusOutput.split("\n").filter((line) => line.trim());
    for (const line of lines) {
      const status = line.charAt(0);
      const file = line.slice(2); // Skip status character and space

      if (status === "R") {
        removedFiles.push(file);
      }
    }

    // Combine original files with any removed files (deduplicated)
    allFilesToCommit = [...new Set([...filesToCommit, ...removedFiles])];

    if (removedFiles.length > 0) {
      logger.info(`Including ${removedFiles.length} removed files in commit`);
    }
  }

  // Create the commit
  const commitArgs = ["sl", "commit", "-m", commitMessage];
  if (allFilesToCommit.length > 0) {
    commitArgs.push(...allFilesToCommit);
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
  "Create a commit and submit PR",
  commit,
  [
    {
      option: "-m <message>",
      description: "Commit message.",
    },
    {
      option: "--skip-precommit",
      description:
        "Skip precommit checks (format, lint, type check, test). By default, pre-checks run automatically.",
    },
    {
      option: "--no-submit",
      description:
        "Skip PR submission. By default, PR is submitted automatically.",
    },
    {
      option: "--verbose, -v",
      description:
        "Show full output from pre-commit checks. By default, shows concise output.",
    },
    {
      option: "[files...]",
      description:
        "Optional files to commit. If not provided, commits all staged changes.",
    },
  ],
);
