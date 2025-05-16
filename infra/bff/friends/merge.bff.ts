#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function merge(args: string[]): Promise<number> {
  // Check if PR number and method are provided directly
  const [prNumber, method] = args;

  if (prNumber && method) {
    // Direct merge with specified PR and method
    if (!["merge", "squash", "rebase"].includes(method)) {
      logger.error("Invalid merge method. Use: merge, squash, or rebase");
      return 1;
    }

    logger.info(`Merging PR #${prNumber} using ${method} method...`);
    const mergeResult = await runShellCommand([
      "gh",
      "pr",
      "merge",
      prNumber,
      `--${method}`,
      "--auto",
    ]);

    if (mergeResult !== 0) {
      logger.error(`Failed to merge PR #${prNumber}`);
      return mergeResult;
    }

    logger.info(`Successfully merged PR #${prNumber}`);
    return 0;
  } else if (prNumber) {
    // Merge specific PR with default method (squash)
    logger.info(`Merging PR #${prNumber} using squash method...`);
    const mergeResult = await runShellCommand([
      "gh",
      "pr",
      "merge",
      prNumber,
      "--squash",
      "--auto",
    ]);

    if (mergeResult !== 0) {
      logger.error(`Failed to merge PR #${prNumber}`);
      return mergeResult;
    }

    logger.info(`Successfully merged PR #${prNumber}`);
    return 0;
  } else {
    // Interactive mode - show list of open PRs
    logger.info("Fetching list of open PRs...");
    const { stdout } = await runShellCommandWithOutput(["sl", "pr", "list"]);

    // Parse PR list
    const lines = stdout.split("\n").filter((line) => line.trim());
    const openPRs = lines
      .filter((line) => line.includes("OPEN"))
      .map((line) => {
        const parts = line.split("\t");
        return {
          number: parts[0],
          title: parts[1],
        };
      });

    if (openPRs.length === 0) {
      logger.info("No open PRs found");
      return 0;
    }

    // Display open PRs
    logger.info("Open PRs:");
    openPRs.forEach((pr) => {
      logger.info(`  #${pr.number}: ${pr.title}`);
    });

    logger.info("\nTo merge a PR, run:");
    logger.info(
      "  bff merge <pr-number>           # merge with squash (default)",
    );
    logger.info(
      "  bff merge <pr-number> <method>  # merge with specific method (merge/squash/rebase)",
    );

    return 0;
  }
}

register(
  "merge",
  "Merge a GitHub pull request",
  merge,
);

export default merge;
