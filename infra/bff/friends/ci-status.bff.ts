#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function ciStatus(args: string[]): Promise<number> {
  // Check if commit hash is provided
  const [commitHash] = args;

  let targetCommit = commitHash;

  // If no commit provided, get the current commit
  if (!targetCommit) {
    const { stdout: currentCommit } = await runShellCommandWithOutput([
      "sl",
      "log",
      "-r",
      ".",
      "-T",
      "{node|short}",
    ]);
    targetCommit = currentCommit.trim();
  }

  logger.info(`Fetching check status for commit: ${targetCommit}`);

  // Use hardcoded repo for now since we're in content-foundry/content-foundry
  const owner = "bolt-foundry";
  const repoName = "bolt-foundry";

  try {
    // Fetch both check runs and workflow runs for the commit
    const checkRunsResult = await runShellCommandWithOutput([
      "gh",
      "api",
      `repos/${owner}/${repoName}/commits/${targetCommit}/check-runs`,
      "--jq",
      ".check_runs",
    ]);

    // Also fetch workflow runs
    const workflowRunsResult = await runShellCommandWithOutput([
      "gh",
      "api",
      `repos/${owner}/${repoName}/actions/runs?head_sha=${targetCommit}`,
      "--jq",
      ".workflow_runs",
    ]);

    const checkRuns = JSON.parse(checkRunsResult.stdout);
    const workflowRuns = JSON.parse(workflowRunsResult.stdout);

    if (checkRuns.length === 0 && workflowRuns.length === 0) {
      logger.info("No check runs or workflow runs found for this commit");

      // Try fetching with the full commit hash
      const { stdout: fullCommit } = await runShellCommandWithOutput([
        "sl",
        "log",
        "-r",
        targetCommit,
        "-T",
        "{node}",
      ]);

      if (fullCommit.trim() !== targetCommit) {
        logger.info(`Trying with full commit hash: ${fullCommit.trim()}`);
        return ciStatus([fullCommit.trim()]);
      }

      return 0;
    }

    // Group check runs by status
    const statusGroups: Record<string, any[]> = {
      completed: [],
      in_progress: [],
      queued: [],
    };

    checkRuns.forEach((check: any) => {
      const status = check.status;
      if (statusGroups[status]) {
        statusGroups[status].push(check);
      }
    });

    // Display workflow runs first
    if (workflowRuns.length > 0) {
      logger.info("\nGitHub Actions Workflows:");
      logger.info("=".repeat(40));

      workflowRuns.forEach((workflow: any) => {
        const statusEmoji = workflow.status === "completed"
          ? (workflow.conclusion === "success"
            ? "✅"
            : workflow.conclusion === "failure"
            ? "❌"
            : workflow.conclusion === "cancelled"
            ? "🚫"
            : "❓")
          : workflow.status === "in_progress"
          ? "🔄"
          : "⏳";

        logger.info(`${statusEmoji} ${workflow.name} (${workflow.status})`);
        if (workflow.conclusion) {
          logger.info(`   Conclusion: ${workflow.conclusion}`);
        }
      });
    }

    // Display check statuses
    logger.info("\nCheck Status Summary:");
    logger.info("=".repeat(40));

    // Show completed checks
    if (statusGroups.completed.length > 0) {
      logger.info("\n✅ Completed:");
      statusGroups.completed.forEach((check: any) => {
        const emoji = check.conclusion === "success"
          ? "✅"
          : check.conclusion === "failure"
          ? "❌"
          : check.conclusion === "neutral"
          ? "⚪"
          : check.conclusion === "cancelled"
          ? "🚫"
          : check.conclusion === "skipped"
          ? "⏭️"
          : "❓";
        logger.info(`  ${emoji} ${check.name}: ${check.conclusion}`);
      });
    }

    // Show in-progress checks
    if (statusGroups.in_progress.length > 0) {
      logger.info("\n🔄 In Progress:");
      statusGroups.in_progress.forEach((check: any) => {
        logger.info(`  🔄 ${check.name}`);
      });
    }

    // Show queued checks
    if (statusGroups.queued.length > 0) {
      logger.info("\n⏳ Queued:");
      statusGroups.queued.forEach((check: any) => {
        logger.info(`  ⏳ ${check.name}`);
      });
    }

    // Overall status summary
    const hasFailures = statusGroups.completed.some(
      (check: any) => check.conclusion === "failure",
    );
    const hasInProgress = statusGroups.in_progress.length > 0 ||
      statusGroups.queued.length > 0;

    logger.info("\n" + "=".repeat(40));
    if (hasFailures) {
      logger.error("❌ Some checks have failed");
      return 1;
    } else if (hasInProgress) {
      logger.info("🔄 Checks are still running");
      return 0;
    } else {
      logger.info("✅ All checks passed");
      return 0;
    }
  } catch (error) {
    logger.error("Failed to fetch check status:", error);
    return 1;
  }
}

register(
  "ci-status",
  "Check GitHub CI status for current or specified commit",
  ciStatus,
);

export default ciStatus;
