#! /usr/bin/env -S bff


import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommandWithOutput } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Resolves a review thread on a GitHub PR using GraphQL
 */
export async function prResolveCommand(
  options: Array<string>,
): Promise<number> {
  // Check if PR number and thread ID were provided as arguments
  if (options.length < 2) {
    logger.error("Missing required arguments");
    logger.info("Usage: bff pr-resolve PR_NUMBER THREAD_ID");
    logger.info("To list threads: bff pr-threads PR_NUMBER");
    return 1;
  }

  const prNumber = options[0];
  const threadId = options[1];

  if (!/^\d+$/.test(prNumber)) {
    logger.error("Invalid PR number: " + prNumber);
    return 1;
  }

  logger.info(`Resolving thread ${threadId} on PR #${prNumber}...`);

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

  // Create the GraphQL mutation to resolve the thread
  const mutation = `
    mutation ResolveReviewThread($threadId: ID!) {
      resolveReviewThread(input: { threadId: $threadId }) {
        thread {
          id
          isResolved
        }
      }
    }
  `;

  // Execute the GraphQL mutation using gh CLI
  const { stdout: mutationResult, code: mutationCode } =
    await runShellCommandWithOutput([
      "gh",
      "api",
      "graphql",
      "-f",
      `query=${mutation}`,
      "-f",
      `threadId=${threadId}`,
    ]);

  if (mutationCode !== 0) {
    logger.error("Failed to resolve review thread");
    logger.debug("GraphQL error:", mutationResult);

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
    } else {
      logger.error(
        "Make sure you have write permissions to the repository",
      );
      logger.error(
        "You need Repository Permissions > Contents set to Read and Write access",
      );
    }
    return 1;
  }

  try {
    const result = JSON.parse(mutationResult);
    if (result.data?.resolveReviewThread?.thread?.isResolved) {
      logger.info("Successfully resolved review thread");
      return 0;
    } else {
      logger.error("Failed to resolve review thread");
      logger.debug("Result:", result);
      return 1;
    }
  } catch (error) {
    logger.error("Failed to parse mutation result", error);
    logger.debug("Raw result:", mutationResult);
    return 1;
  }
}

register(
  "pr-resolve",
  "Resolve a review thread on a GitHub PR",
  prResolveCommand,
  [
    {
      option: "PR_NUMBER",
      description: "The pull request number",
    },
    {
      option: "THREAD_ID",
      description: "The review thread ID to resolve",
    },
  ],
);
