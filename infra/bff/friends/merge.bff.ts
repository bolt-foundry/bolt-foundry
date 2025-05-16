#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { runShellCommandWithOutput } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface PR {
  number: string;
  title: string;
  state?: string;
  head?: {
    sha: string;
    ref: string;
  };
  base?: {
    ref: string;
  };
}

export async function merge(args: string[]): Promise<number> {
  // Parse arguments - check for flags and PR number
  let prNumber: string | undefined;
  let method: string | undefined;
  let closeStack = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--close-stack" || arg === "-s") {
      closeStack = true;
    } else if (!prNumber) {
      prNumber = arg;
    } else if (!method) {
      method = arg;
    }
  }

  async function getRepoInfo(): Promise<
    { owner: string; repo: string } | null
  > {
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
      return null;
    }

    // Parse the repo URL to get owner and repo name
    const repoUrl = repoUrlOutput.trim();
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!urlMatch) {
      logger.error(`Could not parse repo URL from Sapling: ${repoUrl}`);
      return null;
    }

    // Extract owner and repo, and remove .git suffix if present
    const [, owner, repoWithGit] = urlMatch;
    const repo = repoWithGit.replace(/\.git$/, "");
    return { owner, repo };
  }

  async function getPRDetails(
    prNumber: string,
  ): Promise<Record<string, unknown> | null> {
    const repoInfo = await getRepoInfo();
    if (!repoInfo) return null;

    const { stdout, code } = await runShellCommandWithOutput([
      "gh",
      "api",
      `repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}`,
    ]);

    if (code !== 0) {
      return null;
    }

    return JSON.parse(stdout);
  }

  async function getStackedPRs(prNumber: string): Promise<string[]> {
    // Get the PR details to find its branch
    const prDetails = await getPRDetails(prNumber);
    if (!prDetails) return [];

    const mergedSha = prDetails.head?.sha;
    if (!mergedSha) return [];

    // Get all open PRs
    const { stdout } = await runShellCommandWithOutput(["sl", "pr", "list"]);
    const lines = stdout.split("\n").filter((line) => line.trim());
    const openPRs = lines
      .filter((line) => line.includes("OPEN"))
      .map((line) => {
        const parts = line.split("\t");
        return parts[0]; // PR number
      });

    // For each open PR, check if it's part of the same stack
    const stackedPRs: string[] = [];
    for (const pr of openPRs) {
      if (pr === prNumber) continue; // Skip the PR we're merging

      const prInfo = await getPRDetails(pr);
      if (!prInfo) continue;

      // Check if this PR's base branch is the branch we're merging
      if (prInfo.base?.ref === prDetails.head?.ref) {
        stackedPRs.push(pr);
      }
    }

    return stackedPRs;
  }

  async function closePR(prNumber: string): Promise<boolean> {
    const repoInfo = await getRepoInfo();
    if (!repoInfo) return false;

    logger.info(`Closing PR #${prNumber}...`);

    const { stdout: _stdout, code } = await runShellCommandWithOutput([
      "gh",
      "api",
      `repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}`,
      "-X",
      "PATCH",
      "-f",
      "state=closed",
    ]);

    if (code !== 0) {
      logger.error(`Failed to close PR #${prNumber}`);
      return false;
    }

    logger.info(`Successfully closed PR #${prNumber}`);
    return true;
  }

  async function mergePR(prNumber: string, method: string): Promise<number> {
    const repoInfo = await getRepoInfo();
    if (!repoInfo) return 1;

    logger.info(`Using repository: ${repoInfo.owner}/${repoInfo.repo}`);
    logger.info(`Merging PR #${prNumber} using ${method} method...`);

    // Use the GitHub API to merge the PR
    const { stdout: mergeOutput, code: mergeCode } =
      await runShellCommandWithOutput([
        "gh",
        "api",
        `repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}/merge`,
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

    // Handle stacked PRs if requested
    if (closeStack) {
      logger.info("Checking for stacked PRs to close...");
      const stackedPRs = await getStackedPRs(prNumber);

      if (stackedPRs.length > 0) {
        logger.info(
          `Found ${stackedPRs.length} stacked PRs: ${stackedPRs.join(", ")}`,
        );

        for (const pr of stackedPRs) {
          await closePR(pr);
        }
      } else {
        logger.info("No stacked PRs found to close");
      }
    }

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
    // Merge specific PR with default method (rebase)
    return await mergePR(prNumber, "rebase");
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
      "  bff merge <pr-number>                       # merge with rebase (default)",
    );
    logger.info(
      "  bff merge <pr-number> <method>              # merge with specific method (merge/squash/rebase)",
    );
    logger.info(
      "  bff merge <pr-number> --close-stack         # merge and close dependent PRs in the stack",
    );
    logger.info(
      "  bff merge <pr-number> <method> --close-stack",
    );
    logger.info("\nFlags:");
    logger.info("  --close-stack, -s   Close dependent PRs after merging");

    return 0;
  }
}

register(
  "merge",
  "Merge a GitHub pull request and optionally close stacked PRs",
  merge,
  [
    {
      option: "[PR_NUMBER]",
      description: "The PR number to merge",
    },
    {
      option: "[METHOD]",
      description: "Merge method: merge, squash, or rebase (default: rebase)",
    },
    {
      option: "--close-stack, -s",
      description: "Close dependent PRs after merging",
    },
  ],
);

export default merge;
