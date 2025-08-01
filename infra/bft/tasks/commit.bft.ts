#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { parseArgs } from "@std/cli/parse-args";

interface CommitArgs {
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

async function checkForSubmoduleChanges(): Promise<
  Array<{ path: string; hasChanges: boolean }>
> {
  const submodules: Array<{ path: string; hasChanges: boolean }> = [];

  // Check if .gitmodules exists
  try {
    await Deno.stat(".gitmodules");
  } catch {
    // No submodules in this repo
    return submodules;
  }

  // Get list of submodules
  const { success, output } = await runCommand(
    "git",
    ["config", "--file", ".gitmodules", "--name-only", "--get-regexp", "path"],
    { captureOutput: true },
  );

  if (!success || !output) {
    return submodules;
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
        const submodulePath = pathOutput.trim();

        // Check if submodule has changes
        const { success: statusSuccess, output: statusOutput } =
          await runCommand(
            "git",
            ["status", "--porcelain"],
            { cwd: submodulePath, captureOutput: true },
          );

        const hasChanges = Boolean(
          statusSuccess && statusOutput &&
            statusOutput.trim().length > 0,
        );
        submodules.push({ path: submodulePath, hasChanges });
      }
    }
  }

  return submodules;
}

async function commitSubmodule(
  path: string,
  message: string,
): Promise<boolean> {
  ui.output(`\n📁 Committing changes in submodule: ${path}`);

  // Add all changes in submodule
  const { success: addSuccess } = await runCommand(
    "git",
    ["add", "-A"],
    { cwd: path },
  );

  if (!addSuccess) {
    ui.error(`❌ Failed to add changes in ${path}`);
    return false;
  }

  // Commit in submodule
  const { success: commitSuccess } = await runCommand(
    "git",
    ["commit", "-m", message],
    { cwd: path },
  );

  if (!commitSuccess) {
    ui.error(`❌ Failed to commit in ${path}`);
    return false;
  }

  ui.output(`✅ Committed changes in ${path}`);
  return true;
}

async function commit(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    string: ["message", "m"],
    boolean: ["help", "h"],
    alias: { m: "message", h: "help" },
    "--": true,
  }) as CommitArgs;

  if (parsed.help || parsed.h) {
    ui.output(`
Usage: bft commit [OPTIONS] [FILES...]

Create a commit with automatic submodule handling.

OPTIONS:
  -m, --message MSG    Commit message
  -h, --help          Show this help message

EXAMPLES:
  bft commit -m "Update feature"                    # Commit all changes
  bft commit -m "Update docs" README.md             # Commit specific files
  bft commit -m "Fix bug" src/app.ts src/app.test.ts

This command will:
1. Check for changes in any git submodules
2. Commit submodule changes first (if any)
3. Update submodule pointers in the main repo
4. Create the main commit with your message

Note: This uses 'sl' (Sapling) for the main repo and 'git' for submodules.
`);
    return 0;
  }

  const message = parsed.message || parsed.m;
  if (!message) {
    ui.error("❌ Commit message is required. Use -m or --message");
    return 1;
  }

  // Check for submodule changes
  const submodules = await checkForSubmoduleChanges();
  const submodulesWithChanges = submodules.filter((s) => s.hasChanges);

  if (submodulesWithChanges.length > 0) {
    ui.output("🔍 Found changes in submodules:");
    for (const submodule of submodulesWithChanges) {
      ui.output(`  - ${submodule.path}`);
    }

    // Commit each submodule
    for (const submodule of submodulesWithChanges) {
      const submoduleMessage = `${message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      const success = await commitSubmodule(submodule.path, submoduleMessage);
      if (!success) {
        return 1;
      }
    }

    // Add submodule pointer updates to the main repo
    ui.output("\n🔄 Updating submodule pointers in main repo...");
    for (const submodule of submodulesWithChanges) {
      const { success } = await runCommand("sl", ["add", submodule.path]);
      if (!success) {
        ui.error(`❌ Failed to add submodule pointer for ${submodule.path}`);
        return 1;
      }
    }
  }

  // Prepare the main commit message
  const fullMessage = `${message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

  // Build the commit command
  const commitArgs = ["commit", "-m", fullMessage];

  // Add specific files if provided
  if (parsed._.length > 0) {
    commitArgs.push(...parsed._);
  }

  // Create the main commit
  ui.output("\n📝 Creating main commit...");
  const { success } = await runCommand("sl", commitArgs);

  if (!success) {
    ui.error("❌ Failed to create commit");
    return 1;
  }

  ui.output("✅ Commit created successfully!");

  if (submodulesWithChanges.length > 0) {
    ui.output(
      "\n📌 Note: Submodule changes were committed. Don't forget to push them:",
    );
    for (const submodule of submodulesWithChanges) {
      ui.output(`  cd ${submodule.path} && git push`);
    }
  }

  return 0;
}

export const bftDefinition = {
  description:
    "Create commits with automatic submodule handling. IMPORTANT: Before creating any commit, you MUST: 1) Use TodoWrite to create tasks for: 'Run bft check', 'Run bft lint', 'Run bft test', 'Run bft format', 'Execute bft commit'. 2) Use the Task tool with subagent_type: 'general-purpose' to run the first three tasks (check, lint, test) in PARALLEL - launch all three subagents at once. IMPORTANT: Each subagent MUST fix any problems they find (type errors, lint issues, test failures) before marking their task as complete. 3) After all three parallel tasks are completed and all issues are fixed, run 'bft format' to fix any formatting issues. 4) Only after format is complete and ALL todos are marked as completed, execute bft commit command.", // Modifies repository state
  fn: commit,
} satisfies TaskDefinition;

if (import.meta.main) {
  const result = await commit(Deno.args.slice(2));
  Deno.exit(result);
}
