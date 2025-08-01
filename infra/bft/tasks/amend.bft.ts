#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { parseArgs } from "@std/cli/parse-args";

interface AmendArgs {
  message?: string;
  m?: string;
  help?: boolean;
  h?: boolean;
  _: Array<string>;
}

async function runCommand(
  cmd: string,
  args: Array<string>,
  options?: { cwd?: string; captureOutput?: boolean },
): Promise<{ success: boolean; output?: string; error?: string }> {
  const command = new Deno.Command(cmd, {
    args,
    cwd: options?.cwd,
    stdout: options?.captureOutput ? "piped" : "inherit",
    stderr: options?.captureOutput ? "piped" : "inherit",
  });

  if (options?.captureOutput) {
    const result = await command.output();
    return {
      success: result.success,
      output: new TextDecoder().decode(result.stdout),
      error: new TextDecoder().decode(result.stderr),
    };
  }

  const result = await command.spawn().status;

  return { success: "success" in result ? result.success : false };
}

async function getSubmodulePaths(): Promise<Array<string>> {
  const paths: Array<string> = [];

  // Check if .gitmodules exists
  try {
    await Deno.stat(".gitmodules");
  } catch {
    return paths;
  }

  // Get list of submodules
  const { success, output } = await runCommand(
    "git",
    ["config", "--file", ".gitmodules", "--name-only", "--get-regexp", "path"],
    { captureOutput: true },
  );

  if (!success || !output) {
    return paths;
  }

  // Parse submodule paths
  const lines = output.trim().split("\n");
  for (const line of lines) {
    if (line.includes(".path")) {
      const { output: pathOutput } = await runCommand(
        "git",
        ["config", "--file", ".gitmodules", "--get", line],
        { captureOutput: true },
      );

      if (pathOutput) {
        paths.push(pathOutput.trim());
      }
    }
  }

  return paths;
}

async function checkSubmoduleHasCommits(path: string): Promise<boolean> {
  const { success, output } = await runCommand(
    "git",
    ["rev-list", "--count", "HEAD"],
    { cwd: path, captureOutput: true },
  );

  if (!success || !output) {
    return false;
  }

  const count = parseInt(output.trim(), 10);
  return count > 0;
}

async function amendInSubmodule(
  path: string,
  message?: string,
): Promise<boolean> {
  // Check if submodule has any commits
  const hasCommits = await checkSubmoduleHasCommits(path);
  if (!hasCommits) {
    ui.output(`⏭️  Skipping ${path} - no commits to amend`);
    return true;
  }

  ui.output(`\n📁 Amending in submodule: ${path}`);

  // Check for staged changes
  const { output: diffOutput } = await runCommand(
    "git",
    ["diff", "--cached", "--quiet"],
    { cwd: path, captureOutput: true },
  );

  const _hasStagedChanges = diffOutput !== "";

  // Build amend command
  const amendArgs = ["commit", "--amend", "--no-edit"];
  if (message) {
    amendArgs.pop(); // Remove --no-edit
    amendArgs.push("-m", message);
  }

  // Amend the commit
  const { success } = await runCommand("git", amendArgs, { cwd: path });

  if (!success) {
    ui.error(`❌ Failed to amend in ${path}`);
    return false;
  }

  ui.output(`✅ Amended commit in ${path}`);
  return true;
}

async function amend(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    string: ["message", "m"],
    boolean: ["help", "h"],
    alias: { m: "message", h: "help" },
    "--": true,
  }) as AmendArgs;

  if (parsed.help || parsed.h) {
    ui.output(`
Usage: bft amend [OPTIONS]

Amend the last commit in both the main repo and any submodules.

OPTIONS:
  -m, --message MSG    New commit message (optional)
  -h, --help          Show this help message

EXAMPLES:
  bft amend                          # Amend with same message
  bft amend -m "Updated message"     # Amend with new message

This command will:
1. Check all git submodules for commits
2. Amend the last commit in each submodule (if it has commits)
3. Update submodule pointers in the main repo
4. Amend the main repo's commit

Note: This uses 'sl' (Sapling) for the main repo and 'git' for submodules.
`);
    return 0;
  }

  const message = parsed.message || parsed.m;

  // Get all submodule paths
  const submodulePaths = await getSubmodulePaths();

  if (submodulePaths.length > 0) {
    ui.output("🔍 Found submodules:");
    for (const path of submodulePaths) {
      ui.output(`  - ${path}`);
    }

    // Amend in each submodule
    let submoduleMessage: string | undefined;
    if (message) {
      submoduleMessage = `${message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
    }

    for (const path of submodulePaths) {
      const success = await amendInSubmodule(path, submoduleMessage);
      if (!success) {
        return 1;
      }
    }

    // Check if any submodule pointers changed
    const { output: statusOutput } = await runCommand(
      "sl",
      ["status", "--porcelain"],
      { captureOutput: true },
    );

    if (statusOutput) {
      const changedSubmodules = submodulePaths.filter((path) =>
        statusOutput.includes(path)
      );

      if (changedSubmodules.length > 0) {
        ui.output("\n🔄 Updating submodule pointers in main repo...");
        for (const path of changedSubmodules) {
          const { success } = await runCommand("sl", ["add", path]);
          if (!success) {
            ui.error(`❌ Failed to add submodule pointer for ${path}`);
            return 1;
          }
        }
      }
    }
  }

  // Amend the main commit
  ui.output("\n📝 Amending main commit...");

  const amendArgs = ["amend"];
  if (message) {
    const fullMessage = `${message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
    amendArgs.push("-m", fullMessage);
  }

  const { success } = await runCommand("sl", amendArgs);

  if (!success) {
    ui.error("❌ Failed to amend commit");
    return 1;
  }

  ui.output("✅ Commit amended successfully!");

  if (submodulePaths.length > 0) {
    ui.output(
      "\n📌 Note: Submodule commits may have been amended. Don't forget to force-push them:",
    );
    for (const path of submodulePaths) {
      ui.output(`  cd ${path} && git push --force-with-lease`);
    }
  }

  return 0;
}

export const bftDefinition = {
  description:
    "Amend commits in both main repo and submodules. IMPORTANT: Before amending any commit, you MUST: 1) Use TodoWrite to create tasks for: 'Run bft check', 'Run bft lint', 'Run bft test', 'Run bft format', 'Execute bft amend'. 2) Use the Task tool with subagent_type: 'general-purpose' to run the first three tasks (check, lint, test) in PARALLEL - launch all three subagents at once. IMPORTANT: Each subagent MUST fix any problems they find (type errors, lint issues, test failures) before marking their task as complete. 3) After all three parallel tasks are completed and all issues are fixed, run 'bft format' to fix any formatting issues. 4) Only after format is complete and ALL todos are marked as completed, execute bft amend command.", // Modifies repository state
  fn: amend,
} satisfies TaskDefinition;

if (import.meta.main) {
  const result = await amend(Deno.args.slice(2));
  Deno.exit(result);
}
