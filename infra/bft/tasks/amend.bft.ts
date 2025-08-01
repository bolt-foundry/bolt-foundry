#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface AmendArgs {
  help?: boolean;
  message?: string;
  "no-edit"?: boolean;
  _: Array<string>;
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

async function getSubmodules(): Promise<Array<string>> {
  try {
    // Check for .gitmodules file
    await Deno.stat(".gitmodules");
  } catch {
    // No submodules
    return [];
  }

  const submoduleStatusCmd = new Deno.Command("git", {
    args: ["submodule", "status"],
    stdout: "piped",
    stderr: "piped",
  });
  const result = await submoduleStatusCmd.output();

  if (!result.success) {
    return [];
  }

  const output = new TextDecoder().decode(result.stdout);
  const submodules: Array<string> = [];

  const lines = output.trim().split("\n").filter((line) => line.length > 0);
  for (const line of lines) {
    const match = line.match(/^[\s\+\-\*]?([a-f0-9]+)\s+([^\s]+)/);
    if (match) {
      submodules.push(match[2]);
    }
  }

  return submodules;
}

async function amendInSubmodule(
  submodulePath: string,
  message?: string,
  noEdit?: boolean,
): Promise<boolean> {
  ui.output(`📝 Amending commit in submodule: ${submodulePath}`);

  const amendArgs = ["commit", "--amend"];

  if (noEdit) {
    amendArgs.push("--no-edit");
  }

  if (message) {
    amendArgs.push("-m", message);
  }

  const amendCmd = new Deno.Command("git", {
    args: ["-C", submodulePath, ...amendArgs],
    stdin: noEdit ? undefined : "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = await amendCmd.output();

  if (!result.success) {
    ui.error(`Failed to amend in ${submodulePath}`);
    return false;
  }

  ui.output(`✅ Amended commit in ${submodulePath}`);
  return true;
}

async function updateSubmodulePointer(submodulePath: string): Promise<boolean> {
  // Stage the updated submodule pointer
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

async function amend(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["help", "no-edit"],
    string: ["message"],
    alias: { h: "help", m: "message" },
  }) as AmendArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft amend [OPTIONS] [FILES...]

Amend the last commit, with automatic handling of submodule changes.

OPTIONS:
  -m, --message MSG    New commit message
  --no-edit           Amend without changing the commit message
  -h, --help          Show this help message

FEATURES:
  - Automatically detects if amendments are needed in submodules
  - Updates parent repository submodule pointers after amending
  - Works with both Git and Sapling repositories
  - Preserves commit message by default (use -m to change)

EXAMPLES:
  bft amend                                    # Amend and edit message
  bft amend --no-edit                          # Amend without editing message
  bft amend -m "Updated commit message"        # Amend with new message
  bft amend src/file.ts                        # Add file to last commit

NOTE:
  When amending in a repository with submodules, this command will:
  1. Check if any submodules have changes that need amending
  2. Amend commits in submodules first (if needed)
  3. Update submodule pointers in the parent repository
  4. Amend the parent repository commit
`);
    return 0;
  }

  const isSapling = await checkIfSapling();
  const vcs = isSapling ? "sl" : "git";

  // For Git repos, check if we need to handle submodules
  if (!isSapling) {
    const submodules = await getSubmodules();

    if (submodules.length > 0) {
      ui.output("🔍 Checking submodules for changes...");

      let submodulePointersUpdated = false;

      for (const submodulePath of submodules) {
        // Check if submodule has uncommitted changes
        const statusCmd = new Deno.Command("git", {
          args: ["-C", submodulePath, "status", "--porcelain"],
          stdout: "piped",
          stderr: "piped",
        });
        const statusResult = await statusCmd.output();

        if (statusResult.success) {
          const statusOutput = new TextDecoder().decode(statusResult.stdout)
            .trim();

          if (statusOutput.length > 0) {
            // Submodule has changes
            ui.output(`  Found changes in ${submodulePath}`);

            // Ask user if they want to amend the submodule
            ui.output(`Amend changes in submodule ${submodulePath}? (y/N)`);
            const response = prompt(">");

            if (response?.toLowerCase() === "y") {
              // Stage all changes in submodule first
              const addCmd = new Deno.Command("git", {
                args: ["-C", submodulePath, "add", "-A"],
                stdout: "piped",
                stderr: "piped",
              });
              await addCmd.output();

              // Amend the submodule
              const success = await amendInSubmodule(
                submodulePath,
                parsed.message,
                parsed["no-edit"],
              );

              if (!success) {
                return 1;
              }

              // Update the submodule pointer
              const pointerUpdated = await updateSubmodulePointer(
                submodulePath,
              );
              if (!pointerUpdated) {
                return 1;
              }

              submodulePointersUpdated = true;
            }
          }
        }
      }

      if (submodulePointersUpdated) {
        ui.output("✅ Submodule pointers updated");
      }
    }
  }

  // Build amend command args
  const amendArgs = ["commit", "--amend"];

  if (parsed["no-edit"]) {
    amendArgs.push("--no-edit");
  }

  if (parsed.message) {
    amendArgs.push("-m", parsed.message);
  }

  // Add specific files if provided
  if (parsed._.length > 0) {
    if (isSapling) {
      // For Sapling, need to add files first
      const addCmd = new Deno.Command("sl", {
        args: ["add", ...parsed._],
        stdout: "piped",
        stderr: "piped",
      });
      const addResult = await addCmd.output();
      if (!addResult.success) {
        const error = new TextDecoder().decode(addResult.stderr);
        ui.error(`Failed to stage files: ${error}`);
        return 1;
      }
    } else {
      // For Git, stage the files first
      const addCmd = new Deno.Command("git", {
        args: ["add", ...parsed._],
        stdout: "piped",
        stderr: "piped",
      });
      const addResult = await addCmd.output();
      if (!addResult.success) {
        const error = new TextDecoder().decode(addResult.stderr);
        ui.error(`Failed to stage files: ${error}`);
        return 1;
      }
    }
  }

  // Execute the amend command
  const amendCmd = new Deno.Command(vcs, {
    args: amendArgs,
    stdin: parsed["no-edit"] ? undefined : "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = await amendCmd.output();

  if (result.success) {
    ui.output("✅ Successfully amended commit");
  }

  return result.success ? 0 : 1;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Amend commits with automatic submodule handling",
  aiSafe: true,
  fn: amend,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await amend(scriptArgs);
  Deno.exit(result);
}
