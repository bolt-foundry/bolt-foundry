// infra/bff/friends/pr-comments.bff.ts
import { register } from "infra/bff/bff.ts";
import { runShellCommandWithOutput } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

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
 * Fetches comments from the GitHub PR that's linked to the current Sapling branch
 */
export async function prCommentsCommand(_options: string[]): Promise<number> {
  logger.info("Fetching PR comments from linked GitHub PR...");

  // First, get the current PR info directly from Sapling
  const { stdout: prOutput, code: prCode } = await runShellCommandWithOutput([
    "sl",
    "pr",
    "list",
    "--limit",
    "1",
  ]);

  if (prCode !== 0) {
    logger.error("Failed to get PR information from Sapling");
    return 1;
  }

  // Check if we have any PR data
  if (!prOutput || !prOutput.trim()) {
    logger.error("No linked GitHub PR found for current branch", prOutput);
    return 1;
  }

  logger.debug("PR output:", prOutput);

  // Find the PR number from the PR output
  // The format is like: "532   Add OpenAI analytics tracking and enhance PostHog integration   pr532   OPEN    2025-04-04T15:50:12Z"
  const prRegex = /^(\d+)\s+/; // Match the PR number at the start of the output
  const prMatch = prOutput.match(prRegex);

  if (!prMatch) {
    logger.error("Could not extract PR number from Sapling output");
    logger.debug("Received PR output:", prOutput);
    return 1;
  }

  const prNumber = prMatch[1];
  logger.info(`Found linked GitHub PR #${prNumber}`);

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
        ) as ReviewComment[];

        if (reviewComments.length === 0) {
          consoleLogger.info("(No code review comments found)");
        } else {
          // Group comments by file for better readability
          const commentsByFile: Record<string, ReviewComment[]> = {};

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
  "Fetch comments from the linked GitHub PR",
  prCommentsCommand,
);
