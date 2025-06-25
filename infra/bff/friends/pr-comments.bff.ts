#! /usr/bin/env -S bff

// infra/bff/friends/pr-comments.bff.ts
import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommandWithOutput } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Custom console logger for PR comments that formats and outputs them with better readability
 */
const consoleLogger = {
  header: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\n\x1b[1;36m=== ${text} ===\x1b[0m`);
  },
  subheader: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\n\x1b[1;33m${text}\x1b[0m`);
  },
  author: (name: string, date: string) => {
    // deno-lint-ignore no-console
    console.log(`\x1b[1;32m[${name} at ${date}]\x1b[0m`);
  },
  content: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`${text}`);
  },
  separator: () => {
    // deno-lint-ignore no-console
    console.log(`\x1b[90m----------------------------------------\x1b[0m`);
  },
  info: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\x1b[90m${text}\x1b[0m`);
  },
  error: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\x1b[1;31m${text}\x1b[0m`);
  },
};

/**
 * Fetches comments from a GitHub PR, either specified or the one linked to the current Sapling branch
 */
export async function prCommentsCommand(
  options: Array<string>,
): Promise<number> {
  let prNumber: string;

  // Check if PR number was provided as an argument
  if (options.length > 0 && /^\d+$/.test(options[0])) {
    prNumber = options[0];
    logger.info(`Fetching PR comments for PR #${prNumber}...`);
  } else {
    logger.info("Fetching PR comments from linked GitHub PR...");

    // Get the current commit's PR number
    const { stdout: prNumberOutput, code: prNumberCode } =
      await runShellCommandWithOutput([
        "sl",
        "log",
        "-r",
        ".",
        "-T",
        "{github_pull_request_number}",
      ]);

    if (prNumberCode !== 0) {
      logger.error("Failed to get PR information from Sapling");
      return 1;
    }

    // Check if we have a PR number
    if (!prNumberOutput || !prNumberOutput.trim()) {
      logger.error("No linked GitHub PR found for current commit");
      logger.info("Usage: bff pr-comments [PR_NUMBER]");
      logger.info("Make sure the current commit is part of a PR");
      return 1;
    }

    prNumber = prNumberOutput.trim();

    // Validate it's a number
    if (!/^\d+$/.test(prNumber)) {
      logger.error(`Invalid PR number returned: ${prNumber}`);

      // Fallback to checking if there's a PR associated with the branch
      logger.info("Attempting to find PR associated with current branch...");
      const { stdout: prListOutput, code: prListCode } =
        await runShellCommandWithOutput([
          "sl",
          "pr",
          "list",
          "--limit",
          "1",
        ]);

      if (prListCode !== 0 || !prListOutput || !prListOutput.trim()) {
        logger.error("No PR found for current branch either");
        return 1;
      }

      // Extract PR number from pr list output
      const prRegex = /^(\d+)\s+/;
      const prMatch = prListOutput.match(prRegex);

      if (!prMatch) {
        logger.error("Could not extract PR number from Sapling output");
        logger.debug("Received PR output:", prListOutput);
        return 1;
      }

      prNumber = prMatch[1];
    }

    logger.info(`Found linked GitHub PR #${prNumber}`);
  }

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
  // Format is typically like https://github.com/owner/repo
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

  // Use GitHub CLI to fetch PR comments with explicit repo reference
  const { stdout: prDetails, code: prDetailsCode } =
    await runShellCommandWithOutput([
      "gh",
      "pr",
      "view",
      prNumber,
      "--repo",
      `${owner}/${repo}`,
      "--json",
      "comments,reviews,body",
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
    const prData = JSON.parse(prDetails);

    // Print PR description
    consoleLogger.header("PR Description");
    consoleLogger.content(prData.body || "(No description provided)");

    // Print general comments
    consoleLogger.header("PR Comments");
    if (prData.comments && prData.comments.length > 0) {
      for (const comment of prData.comments) {
        consoleLogger.author(
          comment.author.login,
          new Date(comment.createdAt).toLocaleString(),
        );
        consoleLogger.content(comment.body);
        consoleLogger.separator();
      }
    } else {
      consoleLogger.info("(No comments found)");
    }

    // Print review comments
    consoleLogger.header("PR Reviews");
    if (prData.reviews && prData.reviews.length > 0) {
      for (const review of prData.reviews) {
        consoleLogger.author(
          review.author.login,
          new Date(review.submittedAt).toLocaleString(),
        );
        consoleLogger.info(`State: ${review.state}`);
        consoleLogger.content(review.body || "(No review comment)");
        consoleLogger.separator();
      }
    } else {
      consoleLogger.info("(No reviews found)");
    }

    // Fetch code review comments (inline comments on specific lines/files) with a separate API call
    consoleLogger.header("Code Review Comments");

    // Use GitHub API to fetch review comments
    const { stdout: reviewCommentsOutput, code: reviewCommentsCode } =
      await runShellCommandWithOutput([
        "gh",
        "api",
        `repos/${owner}/${repo}/pulls/${prNumber}/comments`,
        "--jq",
        ".",
      ]);

    if (reviewCommentsCode !== 0 || !reviewCommentsOutput.trim()) {
      consoleLogger.info(
        "(No code review comments found or failed to fetch them)",
      );
    } else {
      try {
        // Define interface for review comments
        interface ReviewComment {
          path: string;
          line?: number;
          position?: number;
          user: { login: string };
          created_at: string;
          body: string;
        }

        const reviewComments = JSON.parse(
          reviewCommentsOutput,
        ) as Array<ReviewComment>;

        if (reviewComments.length === 0) {
          consoleLogger.info("(No code review comments found)");
        } else {
          // Group comments by file for better readability
          const commentsByFile: Record<string, Array<ReviewComment>> = {};

          for (const comment of reviewComments) {
            const filePath = comment.path;
            if (!commentsByFile[filePath]) {
              commentsByFile[filePath] = [];
            }
            commentsByFile[filePath].push(comment);
          }

          // Display comments grouped by file
          for (const filePath in commentsByFile) {
            // Format the file path to be repository-relative
            const repoRelativePath = filePath;
            consoleLogger.subheader(`File: ${repoRelativePath}`);
            consoleLogger.separator();

            for (const comment of commentsByFile[filePath]) {
              const lineNum = comment.line || comment.position;
              const lineInfo = lineNum ? `:${lineNum}` : "";
              consoleLogger.author(
                comment.user.login,
                new Date(comment.created_at).toLocaleString(),
              );
              consoleLogger.info(`${repoRelativePath}${lineInfo}`);
              consoleLogger.content(comment.body);
              consoleLogger.separator();
            }
          }
        }
      } catch (error) {
        logger.error("Failed to parse code review comments", error);
        consoleLogger.error("Failed to parse code review comments");
      }
    }
  } catch (error) {
    logger.error("Failed to parse PR details", error);
    consoleLogger.error("Failed to parse PR details");
    return 1;
  }

  consoleLogger.header("Summary");
  consoleLogger.info("PR comments fetched successfully");
  return 0;
}

register(
  "pr-comments",
  "Fetch comments from a GitHub PR",
  prCommentsCommand,
  [
    {
      option: "[PR_NUMBER]",
      description:
        "Optional PR number to fetch comments from. If not provided, uses the PR linked to the current commit.",
    },
  ],
);
