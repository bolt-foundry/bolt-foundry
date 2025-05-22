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
  let partial = false;
  let skipBlocked = false;
  let waitForChecks = true; // Default to waiting for checks

  for (const arg of args) {
    if (arg === "--dry-run" || arg === "-d") {
      dryRun = true;
    } else if (arg === "--force" || arg === "-f") {
      force = true;
    } else if (arg === "--partial" || arg === "-p") {
      partial = true;
    } else if (arg === "--skip-blocked" || arg === "-s") {
      skipBlocked = true;
    } else if (arg === "--no-wait" || arg === "-n") {
      waitForChecks = false;
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
    // Get commits in the current stack (ancestors of current commit that aren't on main)
    const { stdout, code } = await runShellCommandWithOutput([
      "sl",
      "log",
      "-r",
      "ancestors(.) - ancestors(main)",
      "--template",
      "{node}\n",
    ]);

    if (code !== 0) {
      logger.error("Failed to get current stack commits");
      return [];
    }

    // Parse the output to get commit hashes
    const lines = stdout.split("\n").filter((line) => line.trim());
    const commits: string[] = [];

    for (const line of lines) {
      const hash = line.trim();
      if (hash && hash.length >= 12) { // Sapling uses abbreviated hashes
        commits.push(hash);
      }
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

    // Use GitHub's mergeable_state to determine if PR is ready
    // This is more reliable than manually checking individual check runs
    if (pr.mergeable_state === "blocked") {
      return {
        ready: false,
        reason: "PR is blocked (likely by required checks)",
      };
    }

    if (pr.mergeable_state === "behind") {
      return {
        ready: false,
        reason: "PR branch is behind the base branch",
      };
    }

    if (pr.mergeable_state === "dirty") {
      return {
        ready: false,
        reason: "PR has merge conflicts",
      };
    }

    if (pr.mergeable_state === "draft") {
      return {
        ready: false,
        reason: "PR is in draft state",
      };
    }

    if (pr.mergeable_state === "unstable") {
      return {
        ready: false,
        reason: "PR has failing checks",
      };
    }

    // If mergeable_state is "clean", the PR is ready to merge
    if (pr.mergeable_state === "clean") {
      return { ready: true };
    }

    // For unknown states or if mergeable_state is missing, fall back to check-runs
    logger.warn(`Unknown mergeable_state: ${pr.mergeable_state}, falling back to check-runs`);

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

  async function waitForPRChecks(prNumber: string): Promise<boolean> {
    logger.info(`Waiting for checks to complete on PR #${prNumber}...`);
    
    while (true) {
      const readiness = await isPRReadyToMerge(prNumber);
      
      if (readiness.ready) {
        logger.info(`✅ PR #${prNumber} checks have completed and PR is ready!`);
        return true;
      }
      
      // If it's blocked by something other than pending checks, don't wait
      if (readiness.reason && !readiness.reason.includes("Pending checks")) {
        logger.warn(`⚠️  PR #${prNumber} is blocked by: ${readiness.reason}`);
        logger.warn(`This is not a pending check issue, so we won't wait for it.`);
        return false;
      }
      
      logger.info(`⏳ PR #${prNumber}: ${readiness.reason || "Still pending"}. Checking again in 30 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    }
  }

  async function waitForAllPRChecks(prNumbers: string[]): Promise<string[]> {
    logger.info(`Waiting for checks to complete on ${prNumbers.length} PRs...`);
    
    const readyPRs: string[] = [];
    
    for (const prNumber of prNumbers) {
      const isReady = await waitForPRChecks(prNumber);
      if (isReady) {
        readyPRs.push(prNumber);
      } else {
        logger.info(`Stopping wait at PR #${prNumber} - not a pending check issue.`);
        break;
      }
    }
    
    return readyPRs;
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

    // Remove duplicates and keep bottom-to-top order (as returned by Sapling)
    const uniquePRs = [...new Set(prNumbers)];
    return uniquePRs;
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
  let prReadiness: Array<{ pr: string; ready: boolean; reason?: string }> =
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

  // If --wait is specified, wait for pending checks to complete
  if (waitForChecks && !dryRun) {
    const notReadyPRs = prReadiness.filter((p) => !p.ready);
    const pendingChecksPRs = notReadyPRs.filter(p => 
      p.reason && (p.reason.includes("Pending checks") || p.reason.includes("PR is blocked"))
    );
    
    if (pendingChecksPRs.length > 0) {
      logger.info(`\nFound ${pendingChecksPRs.length} PRs with pending checks. Waiting for them to complete...`);
      
      // Wait for checks on PRs that have pending checks
      const prsToWaitFor = pendingChecksPRs.map(p => p.pr);
      const readyAfterWait = await waitForAllPRChecks(prsToWaitFor);
      
      // Re-check all PRs after waiting
      logger.info("\nRe-checking all PRs after waiting...");
      prReadiness = [];
      for (const prNumber of stackPRs) {
        const readiness = await isPRReadyToMerge(prNumber);
        prReadiness.push({ pr: prNumber, ...readiness });

        if (readiness.ready) {
          logger.info(`✅ PR #${prNumber} is ready to merge`);
        } else {
          logger.warn(`⚠️  PR #${prNumber} is NOT ready: ${readiness.reason}`);
        }
      }
    }
  }

  const notReadyPRs = prReadiness.filter((p) => !p.ready);

  // Determine which PRs to merge based on options
  let prsToMerge: string[] = [];
  
  if (partial) {
    // For --partial, merge PRs in order (bottom to top) until we hit a blocked one
    // stackPRs is already in bottom-to-top order, so process them in that order
    for (const prNumber of stackPRs) {
      const readiness = prReadiness.find(p => p.pr === prNumber);
      if (readiness?.ready) {
        prsToMerge.push(prNumber);
      } else {
        logger.info(`\nStopping at PR #${prNumber}: ${readiness?.reason}`);
        break;
      }
    }
  } else if (skipBlocked) {
    // For --skip-blocked, merge only the ready PRs
    prsToMerge = prReadiness.filter(p => p.ready).map(p => p.pr);
  } else if (force) {
    // For --force, merge all PRs regardless of readiness
    prsToMerge = stackPRs;
  } else {
    // Default behavior: all PRs must be ready
    if (notReadyPRs.length > 0) {
      logger.error("\nSome PRs are not ready to merge:");
      notReadyPRs.forEach((pr) => {
        logger.error(`  PR #${pr.pr}: ${pr.reason}`);
      });
      logger.error(
        "\nUse --force to merge anyway, --partial to merge until blocked, --skip-blocked to skip blocked PRs, --no-wait to skip waiting, or --dry-run to see what would happen.",
      );
      return 1;
    }
    prsToMerge = stackPRs;
  }

  if (prsToMerge.length === 0) {
    logger.info("No PRs are ready to merge.");
    return 0;
  }

  if (dryRun) {
    logger.info(`\n[DRY RUN] Would merge the following ${prsToMerge.length} PRs in order:`);
    prsToMerge.forEach((pr, index) => {
      const readiness = prReadiness.find(p => p.pr === pr);
      const status = readiness?.ready ? "✅" : "⚠️";
      logger.info(`  ${index + 1}. PR #${pr} ${status}`);
    });
    
    if (partial && prsToMerge.length < stackPRs.length) {
      const skippedPRs = stackPRs.slice(prsToMerge.length);
      logger.info(`\n[DRY RUN] Would stop before these PRs:`);
      skippedPRs.forEach((pr) => {
        const readiness = prReadiness.find(p => p.pr === pr);
        logger.info(`  PR #${pr}: ${readiness?.reason}`);
      });
    }
    
    return 0;
  }

  // Merge selected PRs from bottom to top
  logger.info(
    `\nMerging ${prsToMerge.length} PRs from bottom to top using ${method} method...`,
  );

  for (let i = 0; i < prsToMerge.length; i++) {
    const prNumber = prsToMerge[i];
    logger.info(`\nStep ${i + 1}/${prsToMerge.length}: Merging PR #${prNumber}`);

    const success = await mergePR(prNumber, method);
    if (!success) {
      logger.error(`Failed to merge PR #${prNumber}. Stopping stack merge.`);
      return 1;
    }

    // Small delay between merges to allow GitHub to update
    if (i < prsToMerge.length - 1) {
      logger.info("Waiting 3 seconds for GitHub to update...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  const totalPRs = stackPRs.length;
  const mergedPRs = prsToMerge.length;
  
  if (mergedPRs === totalPRs) {
    logger.info(
      `\n🎉 Successfully merged entire stack of ${mergedPRs} PRs!`,
    );
  } else {
    logger.info(
      `\n🎉 Successfully merged ${mergedPRs} of ${totalPRs} PRs in the stack!`,
    );
    const skippedPRs = stackPRs.filter(pr => !prsToMerge.includes(pr));
    if (skippedPRs.length > 0) {
      logger.info(`Skipped PRs: ${skippedPRs.join(", ")}`);
    }
  }
  
  return 0;
}

register(
  "merge-stack",
  "Automatically detect current commit stack and merge all PRs bottom-to-top (waits for checks by default)",
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
    {
      option: "--partial, -p",
      description: "Merge PRs in order until hitting a blocked one, then stop",
    },
    {
      option: "--skip-blocked, -s",
      description: "Skip blocked PRs and merge only the ready ones",
    },
    {
      option: "--no-wait, -n",
      description: "Don't wait for pending checks (default: waits for checks)",
    },
  ],
  false, // Not AI-safe - can actually merge PRs
);

export default mergeStack;
