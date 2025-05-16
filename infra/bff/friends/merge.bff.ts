#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { runShellCommandWithOutput } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function merge(args: string[]): Promise<number> {
  // Check if PR number and method are provided directly
  const [prNumber, method] = args;

  async function mergePR(prNumber: string, method: string): Promise<number> {
    // Get the repository URL from Sapling
    const { stdout: repoUrlOutput, code: repoUrlCode } =
      await runShellCommandWithOutput([
        "sl",
        "paths",
        "--template",
        "{url}",
      ]);

    if (repoUrlCode !== 0 || !repoUrlOutput.trim()) {
      logger.error("Failed to get repository URL from Sapling");
      return 1;
    }

    // Parse the repo URL to get owner and repo name
    const repoUrl = repoUrlOutput.trim();
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!urlMatch) {
      logger.error(`Could not parse repo URL from Sapling: ${repoUrl}`);
      return 1;
    }

    // Extract owner and repo, and remove .git suffix if present
    const [, owner, repoWithGit] = urlMatch;
    const repo = repoWithGit.replace(/\.git$/, "");
    logger.info(`Using repository: ${owner}/${repo}`);

    logger.info(`Merging PR #${prNumber} using ${method} method...`);

    // Use the GitHub API to merge the PR
    const { stdout: mergeOutput, code: mergeCode } =
      await runShellCommandWithOutput([
        "gh",
        "api",
        `repos/${owner}/${repo}/pulls/${prNumber}/merge`,
        "-X",
        "PUT",
        "-f",
        `merge_method=${method}`,
      ]);

    if (mergeCode !== 0) {
      logger.error(`Failed to merge PR #${prNumber}`);
      logger.debug("Merge error:", mergeOutput);
      return mergeCode;
    }

    logger.info(`Successfully merged PR #${prNumber}`);
    return 0;
  }

  if (prNumber && method) {
    // Direct merge with specified PR and method
    if (!["merge", "squash", "rebase"].includes(method)) {
      logger.error("Invalid merge method. Use: merge, squash, or rebase");
      return 1;
    }

    return await mergePR(prNumber, method);
  } else if (prNumber) {
    // Merge specific PR with default method (squash)
    return await mergePR(prNumber, "squash");
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
