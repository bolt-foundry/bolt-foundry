#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface CommitArgs {
  help?: boolean;
  message?: string;
  all?: boolean;
  _: Array<string>;
}

async function checkSubmoduleChanges(): Promise<{
  hasSubmoduleChanges: boolean;
  submodules: Array<{ path: string; changes: string }>;
}> {
  try {
    // Check for .gitmodules file to see if submodules exist
    await Deno.stat(".gitmodules");
  } catch {
    // No submodules in this repository
    return { hasSubmoduleChanges: false, submodules: [] };
  }

  const submodules: Array<{ path: string; changes: string }> = [];

  // Get list of submodules
  const submoduleStatusCmd = new Deno.Command("git", {
    args: ["submodule", "status"],
    stdout: "piped",
    stderr: "piped",
  });
  const submoduleStatusResult = await submoduleStatusCmd.output();

  if (!submoduleStatusResult.success) {
    logger.debug("Failed to check submodule status");
    return { hasSubmoduleChanges: false, submodules: [] };
  }

  const submoduleStatusOutput = new TextDecoder().decode(
    submoduleStatusResult.stdout,
  );
  const submoduleLines = submoduleStatusOutput.trim().split("\n").filter((
    line,
  ) => line.length > 0);

  // Check each submodule for changes
  for (const line of submoduleLines) {
    const match = line.match(/^[\s\+\-\*]?([a-f0-9]+)\s+([^\s]+)/);
    if (match) {
      const submodulePath = match[2];

      // Check if submodule has uncommitted changes
      const submoduleDiffCmd = new Deno.Command("git", {
        args: ["-C", submodulePath, "diff", "--stat"],
        stdout: "piped",
        stderr: "piped",
      });
      const submoduleDiffResult = await submoduleDiffCmd.output();

      if (submoduleDiffResult.success) {
        const diffOutput = new TextDecoder().decode(submoduleDiffResult.stdout)
          .trim();
        if (diffOutput.length > 0) {
          submodules.push({ path: submodulePath, changes: diffOutput });
        }
      }

      // Check if submodule has uncommitted staged changes
      const submoduleStagedCmd = new Deno.Command("git", {
        args: ["-C", submodulePath, "diff", "--staged", "--stat"],
        stdout: "piped",
        stderr: "piped",
      });
      const submoduleStagedResult = await submoduleStagedCmd.output();

      if (submoduleStagedResult.success) {
        const stagedOutput = new TextDecoder().decode(
          submoduleStagedResult.stdout,
        ).trim();
        if (
          stagedOutput.length > 0 &&
          !submodules.find((s) => s.path === submodulePath)
        ) {
          submodules.push({ path: submodulePath, changes: stagedOutput });
        }
      }
    }
  }

  return { hasSubmoduleChanges: submodules.length > 0, submodules };
}

async function commitSubmoduleChanges(
  submodulePath: string,
  message: string,
): Promise<boolean> {
  ui.output(`📝 Committing changes in submodule: ${submodulePath}`);

  // Stage all changes in the submodule
  const addCmd = new Deno.Command("git", {
    args: ["-C", submodulePath, "add", "-A"],
    stdout: "piped",
    stderr: "piped",
  });
  const addResult = await addCmd.output();

  if (!addResult.success) {
    const error = new TextDecoder().decode(addResult.stderr);
    ui.error(`Failed to stage changes in ${submodulePath}: ${error}`);
    return false;
  }

  // Commit with the same message
  const commitCmd = new Deno.Command("git", {
    args: ["-C", submodulePath, "commit", "-m", message],
    stdout: "piped",
    stderr: "piped",
  });
  const commitResult = await commitCmd.output();

  if (!commitResult.success) {
    const error = new TextDecoder().decode(commitResult.stderr);
    ui.error(`Failed to commit in ${submodulePath}: ${error}`);
    return false;
  }

  ui.output(`✅ Committed changes in ${submodulePath}`);
  return true;
}

async function updateSubmodulePointer(submodulePath: string): Promise<boolean> {
  // Stage the submodule pointer update
  const addCmd = new Deno.Command("git", {
    args: ["add", submodulePath],
    stdout: "piped",
    stderr: "piped",
  });
  const addResult = await addCmd.output();

  if (!addResult.success) {
    const error = new TextDecoder().decode(addResult.stderr);
    ui.error(
      `Failed to update submodule pointer for ${submodulePath}: ${error}`,
    );
    return false;
  }

  return true;
}

async function checkIfSapling(): Promise<boolean> {
  try {
    // Check if .sl directory exists
    const slStat = await Deno.stat(".sl");
    return slStat.isDirectory;
  } catch {
    return false;
  }
}

async function commit(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["help", "all"],
    string: ["message"],
    alias: { h: "help", m: "message", a: "all" },
  }) as CommitArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft commit [OPTIONS] [FILES...]

Create a commit with automatic handling of submodule changes.

OPTIONS:
  -m, --message MSG    Commit message
  -a, --all           Stage all changes before committing
  -h, --help          Show this help message

FEATURES:
  - Automatically detects and commits submodule changes first
  - Updates parent repository submodule pointers
  - Falls back to deck-based AI commit message generation if no message provided
  - Works with both Git and Sapling repositories

EXAMPLES:
  bft commit -m "Add new feature"              # Commit with message
  bft commit -a -m "Fix all the things"        # Stage all and commit
  bft commit                                    # Use AI to generate message
  bft commit src/file.ts src/other.ts          # Commit specific files
`);
    return 0;
  }

  const isSapling = await checkIfSapling();

  // Check for submodule changes (only in Git repos)
  if (!isSapling) {
    const { hasSubmoduleChanges, submodules } = await checkSubmoduleChanges();

    if (hasSubmoduleChanges) {
      ui.output("🔍 Detected changes in submodules:");
      for (const submodule of submodules) {
        ui.output(`  - ${submodule.path}`);
      }

      // If we have a message, use it for submodule commits
      if (parsed.message) {
        for (const submodule of submodules) {
          const success = await commitSubmoduleChanges(
            submodule.path,
            parsed.message,
          );
          if (!success) {
            ui.error("❌ Failed to commit submodule changes");
            return 1;
          }

          // Update the submodule pointer in the parent repo
          const pointerUpdated = await updateSubmodulePointer(submodule.path);
          if (!pointerUpdated) {
            ui.error("❌ Failed to update submodule pointer");
            return 1;
          }
        }
        ui.output("✅ All submodule changes committed and pointers updated");
      } else {
        ui.output(
          "⚠️  Submodule changes detected but no commit message provided.",
        );
        ui.output(
          "Please provide a commit message with -m or use the deck-based flow.",
        );
        // Fall through to deck-based flow
      }
    }
  }

  // Handle main repository commit
  if (parsed.message) {
    // Direct commit with provided message
    const vcs = isSapling ? "sl" : "git";

    // Build commit command args
    const commitArgs = ["commit", "-m", parsed.message];

    if (parsed.all) {
      if (isSapling) {
        // Sapling doesn't have -a flag, need to add files first
        const addCmd = new Deno.Command("sl", {
          args: ["add", "."],
          stdout: "piped",
          stderr: "piped",
        });
        const addResult = await addCmd.output();
        if (!addResult.success) {
          const error = new TextDecoder().decode(addResult.stderr);
          ui.error(`Failed to stage changes: ${error}`);
          return 1;
        }
      } else {
        commitArgs.push("-a");
      }
    }

    // Add specific files if provided
    if (parsed._.length > 0) {
      commitArgs.push(...parsed._);
    }

    const commitCmd = new Deno.Command(vcs, {
      args: commitArgs,
      stdout: "inherit",
      stderr: "inherit",
    });

    const commitResult = await commitCmd.output();
    return commitResult.success ? 0 : 1;
  } else {
    // Use deck-based AI commit message generation
    ui.output("🤖 Using AI to generate commit message...");

    // Execute the deck file
    const deckCmd = new Deno.Command("bft", {
      args: ["deck", "infra/bft/tasks/commit.bft.deck.md"],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });

    const deckResult = await deckCmd.output();
    return deckResult.success ? 0 : 1;
  }
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Commit changes with automatic submodule handling",
  aiSafe: true,
  fn: commit,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await commit(scriptArgs);
  Deno.exit(result);
}
