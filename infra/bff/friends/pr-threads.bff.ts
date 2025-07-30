#! /usr/bin/env -S bff


import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommandWithOutput } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Type definition for review thread
interface ReviewThread {
  id: string;
  isResolved: boolean;
  isCollapsed: boolean;
  path: string | null;
  line: number | null;
  comments: {
    nodes: Array<{
      id: string;
      body: string;
      author: {
        login: string;
      } | null;
      createdAt: string;
    }>;
  };
}

/**
 * Custom console logger for PR threads that formats and outputs them with better readability
 */
const consoleLogger = {
  header: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\n\x1b[1;36m=== ${text} ===\x1b[0m`);
  },
  threadHeader: (text: string, resolved: boolean) => {
    const color = resolved ? "\x1b[32m" : "\x1b[33m"; // Green for resolved, yellow for unresolved
    // deno-lint-ignore no-console
    console.log(`\n${color}${text}\x1b[0m`);
  },
  info: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\x1b[90m${text}\x1b[0m`);
  },
  error: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`\x1b[1;31m${text}\x1b[0m`);
  },
  content: (text: string) => {
    // deno-lint-ignore no-console
    console.log(`${text}`);
  },
  separator: () => {
    // deno-lint-ignore no-console
    console.log(`\x1b[90m----------------------------------------\x1b[0m`);
  },
};

/**
 * Lists review threads on a GitHub PR
 */
export async function prThreadsCommand(
  options: Array<string>,
): Promise<number> {
  let prNumber: string;

  // Check if PR number was provided as an argument
  if (options.length > 0 && /^\d+$/.test(options[0])) {
    prNumber = options[0];
    logger.info(`Fetching review threads for PR #${prNumber}...`);
  } else {
    logger.info("Fetching review threads from linked GitHub PR...");

    // Get the current PR info directly from Sapling
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
      logger.info("Usage: bff pr-threads [PR_NUMBER]");
      return 1;
    }

    logger.debug("PR output:", prOutput);

    // Find the PR number from the PR output
    const prRegex = /^(\d+)\s+/; // Match the PR number at the start of the output
    const prMatch = prOutput.match(prRegex);

    if (!prMatch) {
      logger.error("Could not extract PR number from Sapling output");
      logger.debug("Received PR output:", prOutput);
      return 1;
    }

    prNumber = prMatch[1];
    logger.info(`Found linked GitHub PR #${prNumber}`);
  }

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

  // Create GraphQL query to fetch review threads
  const query = `
    query GetReviewThreads($owner: String!, $repo: String!, $pr: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $pr) {
          title
          reviewThreads(first: 100) {
            nodes {
              id
              isResolved
              isCollapsed
              path
              line
              comments(first: 10) {
                nodes {
                  id
                  body
                  author {
                    login
                  }
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  `;

  // Execute the GraphQL query using gh CLI
  const { stdout: queryResult, code: queryCode } =
    await runShellCommandWithOutput([
      "gh",
      "api",
      "graphql",
      "-f",
      `query=${query}`,
      "-f",
      `owner=${owner}`,
      "-f",
      `repo=${repo}`,
      "-F",
      `pr=${prNumber}`,
    ]);

  if (queryCode !== 0) {
    logger.error("Failed to fetch review threads");
    logger.debug("GraphQL error:", queryResult);

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
    const result = JSON.parse(queryResult);
    const threads = result.data?.repository?.pullRequest?.reviewThreads?.nodes;

    if (!threads) {
      logger.error("Failed to parse review threads");
      logger.debug("Result:", result);
      return 1;
    }

    consoleLogger.header(`Review Threads for PR #${prNumber}`);

    if (threads.length === 0) {
      consoleLogger.info("(No review threads found)");
      return 0;
    }

    // Group threads by resolved status
    const resolvedThreads = threads.filter((t: ReviewThread) => t.isResolved);
    const unresolvedThreads = threads.filter((t: ReviewThread) =>
      !t.isResolved
    );

    // Display unresolved threads first
    if (unresolvedThreads.length > 0) {
      consoleLogger.header("Unresolved Threads");
      for (const thread of unresolvedThreads) {
        displayThread(thread, false, prNumber);
      }
    }

    // Display resolved threads
    if (resolvedThreads.length > 0) {
      consoleLogger.header("Resolved Threads");
      for (const thread of resolvedThreads) {
        displayThread(thread, true, prNumber);
      }
    }

    // Summary
    consoleLogger.header("Summary");
    consoleLogger.info(`Total threads: ${threads.length}`);
    consoleLogger.info(`Unresolved: ${unresolvedThreads.length}`);
    consoleLogger.info(`Resolved: ${resolvedThreads.length}`);

    return 0;
  } catch (error) {
    logger.error("Failed to parse query result", error);
    logger.debug("Raw result:", queryResult);
    return 1;
  }
}

function displayThread(
  thread: ReviewThread,
  resolved: boolean,
  prNumber: string,
) {
  const status = resolved ? "✅ RESOLVED" : "🔴 UNRESOLVED";
  const file = thread.path || "(unknown file)";
  const line = thread.line ? `:${thread.line}` : "";

  consoleLogger.threadHeader(`Thread ${thread.id} - ${status}`, resolved);
  consoleLogger.info(`File: ${file}${line}`);
  consoleLogger.separator();

  if (thread.comments?.nodes) {
    for (const comment of thread.comments.nodes) {
      const author = comment.author?.login || "(unknown)";
      const date = new Date(comment.createdAt).toLocaleString();
      consoleLogger.info(`${author} at ${date}`);
      consoleLogger.content(comment.body);
      consoleLogger.separator();
    }
  }

  if (!resolved) {
    consoleLogger.info(`To resolve: bff pr-resolve ${prNumber} ${thread.id}`);
  }
}

register(
  "pr-threads",
  "List review threads on a GitHub PR",
  prThreadsCommand,
  [
    {
      option: "[PR_NUMBER]",
      description:
        "Optional PR number. If not provided, uses the PR linked to the current branch.",
    },
  ],
);
