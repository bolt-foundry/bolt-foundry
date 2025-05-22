#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { runShellCommandWithOutput } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface PR {
  number: string;
  title: string;
  state?: string;
  mergeable?: boolean;
  mergeable_state?: string;
  head?: {
    sha: string;
    ref: string;
  };
  base?: {
    ref: string;
  };
}

export async function mergeStack(args: string[]): Promise<number> {
  // Parse arguments
  let method = "rebase"; // default merge method
  let dryRun = false;
  let force = false;

  for (const arg of args) {
    if (arg === "--dry-run" || arg === "-d") {
      dryRun = true;
    } else if (arg === "--force" || arg === "-f") {
      force = true;
    } else if (["merge", "squash", "rebase"].includes(arg)) {
      method = arg;
    }
  }

  async function getRepoInfo(): Promise<
    { owner: string; repo: string } | null
  > {
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

    const repoUrl = repoUrlOutput.trim();
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!urlMatch) {
      logger.error(`Could not parse repo URL from Sapling: ${repoUrl}`);
      return null;
    }

    const [, owner, repoWithGit] = urlMatch;
    const repo = repoWithGit.replace(/\.git$/, "");
    return { owner, repo };
  }

  async function getCurrentCommitStack(): Promise<string[]> {
    // Get the current smartlog to identify the stack
    const { stdout, code } = await runShellCommandWithOutput([
      "sl",
      "smartlog",
      "--template",
      "{node} {desc|firstline}\n",
    ]);

    if (code !== 0) {
      logger.error("Failed to get smartlog");
      return [];
    }

    // Parse the smartlog output to find draft commits
    const lines = stdout.split("\n").filter((line) => line.trim());
    const commits: string[] = [];

    for (const line of lines) {
      // Look for lines with commit hashes (they contain a full 40-char hash)
      const hashMatch = line.match(/([a-f0-9]{40})/);
      if (!hashMatch) continue;

      const hash = hashMatch[1];
      const desc = line.substring(line.indexOf(hash) + hash.length).trim();

      // Skip if this looks like a master/main commit
      if (desc.includes("remote/main") || desc.includes("master")) continue;

      commits.push(hash);
    }

    return commits;
  }

  async function getCommitPRNumber(commitHash: string): Promise<string | null> {
    // Get the commit description to look for PR info
    const { stdout: descOutput, code: descCode } = await runShellCommandWithOutput([
      "sl",
      "log",
      "-r",
      commitHash,
      "--template",
      "{desc}",
    ]);

    if (descCode !== 0) return null;

    // Get PR list to match against
    const { stdout: prListOutput } = await runShellCommandWithOutput([
      "sl",
      "pr",
      "list",
    ]);
    const prLines = prListOutput.split("\n").filter((line) => line.trim());

    // Try to match by commit description with PR title
    const commitTitle = descOutput.split('\n')[0].trim();
    logger.debug(`Looking for commit title: "${commitTitle}"`);
    
    for (const line of prLines) {
      if (line.includes("OPEN")) {
        const parts = line.split("\t");
        const prNumber = parts[0];
        const prTitle = parts[1];
        
        logger.debug(`Checking PR ${prNumber}: "${prTitle?.trim()}"`);
        
        // Check if PR title matches commit title
        if (prTitle && commitTitle === prTitle.trim()) {
          logger.debug(`Found matching PR: ${prNumber}`);
          return prNumber;
        }
      }
    }

    // Fallback: try to get branch name from remote names
    const { stdout: branchOutput, code: branchCode } = await runShellCommandWithOutput([
      "sl",
      "log",
      "-r",
      commitHash,
      "--template",
      "{remotenames}",
    ]);

    if (branchCode === 0 && branchOutput.trim()) {
      const remoteBranches = branchOutput.trim().split(" ");
      
      for (const branch of remoteBranches) {
        const match = branch.match(/remote\/(.+)/);
        if (match) {
          const branchName = match[1];
          
          for (const line of prLines) {
            if (line.includes("OPEN") && line.includes(branchName)) {
              const parts = line.split("\t");
              return parts[0]; // PR number
            }
          }
        }
      }
    }

    return null;
  }

  async function getPRDetails(prNumber: string): Promise<PR | null> {
    const repoInfo = await getRepoInfo();
    if (!repoInfo) return null;

    const { stdout, code } = await runShellCommandWithOutput([
      "gh",
      "api",
      `repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}`,
    ]);

    if (code !== 0) return null;

    return JSON.parse(stdout);
  }

  async function isPRReadyToMerge(
    prNumber: string,
  ): Promise<{ ready: boolean; reason?: string }> {
    const pr = await getPRDetails(prNumber);
    if (!pr) {
      return { ready: false, reason: "Could not fetch PR details" };
    }

    // Check if PR is open
    if (pr.state !== "open") {
      return { ready: false, reason: `PR is ${pr.state}` };
    }

    // Check if PR is mergeable
    if (pr.mergeable === false) {
      return { ready: false, reason: "PR has merge conflicts" };
    }

    if (pr.mergeable_state === "blocked") {
      return {
        ready: false,
        reason: "PR is blocked (likely by required checks)",
      };
    }

    // Check CI status using GitHub API
    const repoInfo = await getRepoInfo();
    if (!repoInfo) {
      return { ready: false, reason: "Could not get repository info" };
    }

    const { stdout: checksOutput, code: checksCode } =
      await runShellCommandWithOutput([
        "gh",
        "api",
        `repos/${repoInfo.owner}/${repoInfo.repo}/commits/${pr.head?.sha}/check-runs`,
      ]);

    if (checksCode === 0) {
      try {
        const checksData = JSON.parse(checksOutput);
        const checkRuns = checksData.check_runs || [];

        // Check if any required checks are failing
        const failedChecks = checkRuns.filter((check: { conclusion: string }) =>
          check.conclusion === "failure" || check.conclusion === "cancelled"
        );

        if (failedChecks.length > 0) {
          return {
            ready: false,
            reason: `Failed checks: ${
              failedChecks.map((c: { name: string }) => c.name).join(", ")
            }`,
          };
        }

        // Check if any checks are still pending
        const pendingChecks = checkRuns.filter((check: { status: string }) =>
          check.status === "in_progress" || check.status === "queued"
        );

        if (pendingChecks.length > 0) {
          return {
            ready: false,
            reason: `Pending checks: ${
              pendingChecks.map((c: { name: string }) => c.name).join(", ")
            }`,
          };
        }
      } catch {
        logger.warn("Could not parse check runs data, proceeding anyway");
      }
    }

    return { ready: true };
  }

  async function mergePR(prNumber: string, method: string): Promise<boolean> {
    const repoInfo = await getRepoInfo();
    if (!repoInfo) return false;

    logger.info(`Merging PR #${prNumber} using ${method} method...`);

    if (dryRun) {
      logger.info(`[DRY RUN] Would merge PR #${prNumber}`);
      return true;
    }

    const { code: mergeCode } = await runShellCommandWithOutput([
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
      return false;
    }

    logger.info(`Successfully merged PR #${prNumber}`);
    return true;
  }

  async function getStackPRNumbers(): Promise<string[]> {
    // Get all commits in current stack
    const commits = await getCurrentCommitStack();
    const prNumbers: string[] = [];

    for (const commit of commits) {
      const prNumber = await getCommitPRNumber(commit);
      if (prNumber) {
        prNumbers.push(prNumber);
      }
    }

    // Remove duplicates and reverse to get bottom-to-top order
    const uniquePRs = [...new Set(prNumbers)];
    return uniquePRs.reverse();
  }

  function getBottomCommitOfStack(
    stackCommits: string[],
  ): string | null {
    if (stackCommits.length === 0) return null;

    // The last commit in our reversed list is actually the bottom of the stack
    // (since we get them in top-to-bottom order from smartlog and reverse them)
    return stackCommits[stackCommits.length - 1];
  }

  async function navigateToBottomOfStack(): Promise<boolean> {
    const commits = await getCurrentCommitStack();
    if (commits.length === 0) return true; // No stack to navigate

    const bottomCommit = getBottomCommitOfStack(commits);
    if (!bottomCommit) return true; // No bottom commit found

    // Check if we're already at the bottom
    const { stdout: currentCommit, code } = await runShellCommandWithOutput([
      "sl",
      "log",
      "-r",
      ".",
      "--template",
      "{node}",
    ]);

    if (code !== 0) {
      logger.warn("Could not get current commit");
      return false;
    }

    const currentHash = currentCommit.trim();
    if (
      currentHash.startsWith(bottomCommit) ||
      bottomCommit.startsWith(currentHash)
    ) {
      logger.info("Already at bottom of stack");
      return true;
    }

    // Navigate to bottom of stack
    logger.info(
      `Navigating to bottom of stack (commit ${
        bottomCommit.substring(0, 12)
      }...)`,
    );

    if (dryRun) {
      logger.info(`[DRY RUN] Would navigate to commit ${bottomCommit}`);
      return true;
    }

    const { code: gotoCode } = await runShellCommandWithOutput([
      "sl",
      "goto",
      bottomCommit.substring(0, 12),
    ]);

    if (gotoCode !== 0) {
      logger.error(`Failed to navigate to bottom of stack`);
      return false;
    }

    logger.info("Successfully navigated to bottom of stack");
    return true;
  }

  // Main execution
  logger.info("Detecting current commit stack...");

  const stackPRs = await getStackPRNumbers();

  if (stackPRs.length === 0) {
    logger.info(
      "No PRs found in current stack. Make sure you're on a commit with an associated PR.",
    );
    return 0;
  }

  logger.info(`Found ${stackPRs.length} PRs in stack: ${stackPRs.join(", ")}`);

  // Navigate to bottom of stack if we're not already there
  const navigatedSuccessfully = await navigateToBottomOfStack();
  if (!navigatedSuccessfully) {
    logger.error("Failed to navigate to bottom of stack");
    return 1;
  }

  // Check if all PRs are ready to merge
  const prReadiness: Array<{ pr: string; ready: boolean; reason?: string }> =
    [];

  for (const prNumber of stackPRs) {
    const readiness = await isPRReadyToMerge(prNumber);
    prReadiness.push({ pr: prNumber, ...readiness });

    if (readiness.ready) {
      logger.info(`✅ PR #${prNumber} is ready to merge`);
    } else {
      logger.warn(`⚠️  PR #${prNumber} is NOT ready: ${readiness.reason}`);
    }
  }

  const notReadyPRs = prReadiness.filter((p) => !p.ready);

  if (notReadyPRs.length > 0 && !force) {
    logger.error("\nSome PRs are not ready to merge:");
    notReadyPRs.forEach((pr) => {
      logger.error(`  PR #${pr.pr}: ${pr.reason}`);
    });
    logger.error(
      "\nUse --force to merge anyway, or --dry-run to see what would happen.",
    );
    return 1;
  }

  if (dryRun) {
    logger.info("\n[DRY RUN] Would merge the following PRs in order:");
    stackPRs.forEach((pr, index) => {
      logger.info(`  ${index + 1}. PR #${pr}`);
    });
    return 0;
  }

  // Merge all PRs from bottom to top
  logger.info(
    `\nMerging ${stackPRs.length} PRs from bottom to top using ${method} method...`,
  );

  for (let i = 0; i < stackPRs.length; i++) {
    const prNumber = stackPRs[i];
    logger.info(`\nStep ${i + 1}/${stackPRs.length}: Merging PR #${prNumber}`);

    const success = await mergePR(prNumber, method);
    if (!success) {
      logger.error(`Failed to merge PR #${prNumber}. Stopping stack merge.`);
      return 1;
    }

    // Small delay between merges to allow GitHub to update
    if (i < stackPRs.length - 1) {
      logger.info("Waiting 3 seconds for GitHub to update...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  logger.info(
    `\n🎉 Successfully merged entire stack of ${stackPRs.length} PRs!`,
  );
  return 0;
}

register(
  "merge-stack",
  "Automatically detect current commit stack and merge all PRs bottom-to-top",
  mergeStack,
  [
    {
      option: "[METHOD]",
      description: "Merge method: merge, squash, or rebase (default: rebase)",
    },
    {
      option: "--dry-run, -d",
      description: "Show what would be merged without actually merging",
    },
    {
      option: "--force, -f",
      description: "Merge even if some PRs appear not ready",
    },
  ],
  false, // Not AI-safe - can actually merge PRs
);

export default mergeStack;
