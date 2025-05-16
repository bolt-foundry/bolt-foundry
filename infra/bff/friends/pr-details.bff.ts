#! /usr/bin/env -S bff

// infra/bff/friends/pr-details.bff.ts
import { register } from "infra/bff/bff.ts";
import { runShellCommandWithOutput } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Fetches detailed information about a GitHub PR
 */
export async function prDetailsCommand(options: string[]): Promise<number> {
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
    console.log("\n=== PR Details ===");
    console.log(`Title: ${prData.title}`);
    console.log(`Number: #${prData.number}`);
    console.log(`State: ${prData.state}`);
    console.log(`Author: ${prData.user.login}`);
    console.log(`Created: ${new Date(prData.created_at).toLocaleString()}`);
    console.log(`Updated: ${new Date(prData.updated_at).toLocaleString()}`);

    if (prData.merged_at) {
      console.log(`Merged: ${new Date(prData.merged_at).toLocaleString()}`);
    }

    console.log(`\nBranches: ${prData.head.ref} -> ${prData.base.ref}`);
    console.log(`URL: ${prData.html_url}`);

    console.log("\n=== Description ===");
    console.log(prData.body || "(No description provided)");

    console.log("\n=== Stats ===");
    console.log(`Comments: ${prData.comments}`);
    console.log(`Review Comments: ${prData.review_comments}`);
    console.log(`Commits: ${prData.commits}`);
    console.log(`Changed Files: ${prData.changed_files}`);
    console.log(`Additions: +${prData.additions}`);
    console.log(`Deletions: -${prData.deletions}`);

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
      console.log("\n=== Reviews ===");
      if (reviews.length === 0) {
        console.log("(No reviews yet)");
      } else {
        for (const review of reviews) {
          console.log(
            `- ${review.user.login}: ${review.state} (${
              new Date(review.submitted_at).toLocaleString()
            })`,
          );
          if (review.body) {
            console.log(`  "${review.body}"`);
          }
        }
      }
    }

    return 0;
  } catch (error) {
    logger.error("Failed to parse PR details", error);
    console.error("Failed to parse PR details");
    return 1;
  }
}

register(
  "pr-details",
  "Get detailed information about a GitHub PR",
  prDetailsCommand,
);
