#! /usr/bin/env -S bff


import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommandWithOutput } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Custom console logger for PR details that formats and outputs them with better readability
 */
const consoleLogger = {
  header: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\n\x1b[1;36m=== ${text} ===\x1b[0m`);
  },
  content: (text: string) => {
    // deno-lint-ignore no-console
    console.log(text);
  },
  error: (text: string) => {
    // deno-lint-ignore no-console
    console.error(text);
  },
};

/**
 * Fetches detailed information about a GitHub PR
 */
export async function prDetailsCommand(
  options: Array<string>,
): Promise<number> {
  // Check if PR number is provided
  const prNumber = options[0];
  if (!prNumber) {
    logger.error("Please provide a PR number (e.g., bff pr-details 123)");
    return 1;
  }

  logger.info(`Fetching details for PR #${prNumber}...`);

  // First, get the repository URL from Sapling
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

  // Use GitHub API to fetch PR details
  const { stdout: prDetailsOutput, code: prDetailsCode } =
    await runShellCommandWithOutput([
      "gh",
      "api",
      `repos/${owner}/${repo}/pulls/${prNumber}`,
      "--jq",
      ".",
    ]);

  if (prDetailsCode !== 0) {
    logger.error("Failed to fetch PR details from GitHub");
    // Check if gh CLI is authenticated
    const { code: authCode } = await runShellCommandWithOutput([
      "gh",
      "auth",
      "status",
    ]);
    if (authCode !== 0) {
      logger.error(
        "GitHub CLI not authenticated. Try running 'gh auth login' first",
      );
    }
    return 1;
  }

  try {
    const prData = JSON.parse(prDetailsOutput);

    // Print PR information in a formatted way
    consoleLogger.header("PR Details");
    consoleLogger.content(`Title: ${prData.title}`);
    consoleLogger.content(`Number: #${prData.number}`);
    consoleLogger.content(`State: ${prData.state}`);
    consoleLogger.content(`Author: ${prData.user.login}`);
    consoleLogger.content(
      `Created: ${new Date(prData.created_at).toLocaleString()}`,
    );
    consoleLogger.content(
      `Updated: ${new Date(prData.updated_at).toLocaleString()}`,
    );

    if (prData.merged_at) {
      consoleLogger.content(
        `Merged: ${new Date(prData.merged_at).toLocaleString()}`,
      );
    }

    consoleLogger.content(
      `\nBranches: ${prData.head.ref} -> ${prData.base.ref}`,
    );
    consoleLogger.content(`URL: ${prData.html_url}`);

    consoleLogger.header("Description");
    consoleLogger.content(prData.body || "(No description provided)");

    consoleLogger.header("Stats");
    consoleLogger.content(`Comments: ${prData.comments}`);
    consoleLogger.content(`Review Comments: ${prData.review_comments}`);
    consoleLogger.content(`Commits: ${prData.commits}`);
    consoleLogger.content(`Changed Files: ${prData.changed_files}`);
    consoleLogger.content(`Additions: +${prData.additions}`);
    consoleLogger.content(`Deletions: -${prData.deletions}`);

    // Fetch reviews
    const { stdout: reviewsOutput, code: reviewsCode } =
      await runShellCommandWithOutput([
        "gh",
        "api",
        `repos/${owner}/${repo}/pulls/${prNumber}/reviews`,
        "--jq",
        ".",
      ]);

    if (reviewsCode === 0 && reviewsOutput.trim()) {
      const reviews = JSON.parse(reviewsOutput);
      consoleLogger.header("Reviews");
      if (reviews.length === 0) {
        consoleLogger.content("(No reviews yet)");
      } else {
        for (const review of reviews) {
          consoleLogger.content(
            `- ${review.user.login}: ${review.state} (${
              new Date(review.submitted_at).toLocaleString()
            })`,
          );
          if (review.body) {
            consoleLogger.content(`  "${review.body}"`);
          }
        }
      }
    }

    return 0;
  } catch (error) {
    logger.error("Failed to parse PR details", error);
    consoleLogger.error("Failed to parse PR details");
    return 1;
  }
}

register(
  "pr-details",
  "Get detailed information about a GitHub PR",
  prDetailsCommand,
);
