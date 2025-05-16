import { promptForInputWithList } from "../tools.ts";
import { shellRun } from "../shellBase.ts";
import { BffFriend, BffFriendReturnValue } from "../bff.ts";
import { BfError } from "../../../lib/BfError.ts";

export const runMerge = async (): Promise<void> => {
  // Get list of open PRs
  const prsResult = await shellRun({
    command: ["sl", "pr", "list"],
    cwd: Deno.cwd(),
    stdin: "piped",
    stderr: "piped",
    stdout: "piped",
  });

  if (!prsResult.success) {
    throw new BfError("MERGE_FAILED", "Failed to get PR list", {
      stderr: prsResult.stderr,
    });
  }

  // Parse PR list
  const lines = prsResult.stdout.split("\n").filter((line) => line.trim());
  const openPRs = lines
    .filter((line) => line.includes("OPEN"))
    .map((line) => {
      const parts = line.split("\t");
      return {
        number: parts[0],
        title: parts[1],
        branch: parts[2],
        status: parts[3],
      };
    });

  if (openPRs.length === 0) {
    console.log("No open PRs found");
    return;
  }

  // Ask user which PR to merge
  const prOptions = openPRs.map((pr) => `#${pr.number}: ${pr.title}`);
  const selectedPR = await promptForInputWithList(
    "Select PR to merge:",
    prOptions,
  );

  const prNumber = selectedPR.match(/#(\d+)/)?.[1];
  if (!prNumber) {
    throw new BfError("MERGE_FAILED", "Invalid PR selection");
  }

  // Ask for merge method
  const mergeMethod = await promptForInputWithList(
    "Select merge method:",
    ["merge", "squash", "rebase"],
  );

  // Ask for confirmation
  const confirmInput = await promptForInputWithList(
    `Are you sure you want to ${mergeMethod} PR #${prNumber}?`,
    ["yes", "no"],
  );

  if (confirmInput !== "yes") {
    console.log("Merge cancelled");
    return;
  }

  // Execute merge using GitHub CLI
  console.log(`Merging PR #${prNumber} using ${mergeMethod} method...`);
  const mergeResult = await shellRun({
    command: ["gh", "pr", "merge", prNumber, `--${mergeMethod}`, "--auto"],
    cwd: Deno.cwd(),
    stdin: "piped",
    stderr: "piped",
    stdout: "piped",
  });

  if (!mergeResult.success) {
    throw new BfError("MERGE_FAILED", `Failed to merge PR #${prNumber}`, {
      stderr: mergeResult.stderr,
    });
  }

  console.log(`Successfully merged PR #${prNumber}`);
  console.log(mergeResult.stdout);

  // Ask if user wants to pull latest changes
  const pullConfirm = await promptForInputWithList(
    "Pull latest changes from remote?",
    ["yes", "no"],
  );

  if (pullConfirm === "yes") {
    const pullResult = await shellRun({
      command: ["sl", "pull"],
      cwd: Deno.cwd(),
      stdin: "piped",
      stderr: "piped",
      stdout: "piped",
    });

    if (pullResult.success) {
      console.log("Successfully pulled latest changes");
    } else {
      console.error("Failed to pull changes:", pullResult.stderr);
    }
  }
};

/**
 * bff friend: merge
 *
 * Merge a GitHub pull request
 *
 * Usage:
 *   bff merge        - Interactive PR merge with method selection
 *   bff merge <pr>   - Merge specific PR number (interactive method selection)
 *   bff merge <pr> <method> - Merge specific PR with method (merge/squash/rebase)
 */
const merge: BffFriend = async (
  args: string[],
  cwd: string,
): Promise<BffFriendReturnValue> => {
  const [prNumber, method] = args;

  if (prNumber && method) {
    // Direct merge with specified PR and method
    if (!["merge", "squash", "rebase"].includes(method)) {
      throw new BfError(
        "MERGE_FAILED",
        "Invalid merge method. Use: merge, squash, or rebase",
      );
    }

    console.log(`Merging PR #${prNumber} using ${method} method...`);
    const mergeResult = await shellRun({
      command: ["gh", "pr", "merge", prNumber, `--${method}`, "--auto"],
      cwd,
      stdin: "piped",
      stderr: "piped",
      stdout: "piped",
    });

    if (!mergeResult.success) {
      throw new BfError("MERGE_FAILED", `Failed to merge PR #${prNumber}`, {
        stderr: mergeResult.stderr,
      });
    }

    console.log(`Successfully merged PR #${prNumber}`);
    console.log(mergeResult.stdout);
  } else if (prNumber) {
    // Merge specific PR with interactive method selection
    const mergeMethod = await promptForInputWithList(
      "Select merge method:",
      ["merge", "squash", "rebase"],
    );

    console.log(`Merging PR #${prNumber} using ${mergeMethod} method...`);
    const mergeResult = await shellRun({
      command: ["gh", "pr", "merge", prNumber, `--${mergeMethod}`, "--auto"],
      cwd,
      stdin: "piped",
      stderr: "piped",
      stdout: "piped",
    });

    if (!mergeResult.success) {
      throw new BfError("MERGE_FAILED", `Failed to merge PR #${prNumber}`, {
        stderr: mergeResult.stderr,
      });
    }

    console.log(`Successfully merged PR #${prNumber}`);
    console.log(mergeResult.stdout);
  } else {
    // Interactive mode
    await runMerge();
  }

  return {
    code: 0,
    terminalOutput: "",
  };
};

const friend = merge;
export default friend;
