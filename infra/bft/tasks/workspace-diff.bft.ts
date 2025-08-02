#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface WorkspaceDiffArgs {
  help?: boolean;
  verbose?: boolean;
  all?: boolean;
  "exclude-patterns"?: Array<string>;
  _?: Array<string>; // positional args
}

async function workspaceDiff(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["help", "verbose", "all"],
    string: ["exclude-patterns"],
    alias: { h: "help", v: "verbose", a: "all" },
    collect: ["exclude-patterns"],
    default: {},
  }) as WorkspaceDiffArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft workspace-diff [WORKSPACE]

Show which workspaces have changes. Without arguments, shows a summary of all workspaces.

OPTIONS:
  --verbose, -v               Show detailed file changes (not just summary)
  --all, -a                   Include unchanged workspaces in summary
  --exclude-patterns PATTERN  Exclude files matching glob patterns (can be used multiple times)
  --help, -h                  Show this help message

EXAMPLES:
  bft workspace-diff                    # Summary of all workspaces with changes
  bft workspace-diff --all              # Include unchanged workspaces
  bft workspace-diff fuzzy-goat         # Show changes in specific workspace
  bft workspace-diff fuzzy-goat -v      # Show detailed file changes
  bft workspace-diff --exclude-patterns "*.log"
`);
    return 0;
  }

  const workspacesDir = "/Users/randallb/code/codebot-workspaces";
  const currentDir = Deno.cwd();

  // Check if workspaces directory exists
  try {
    const stat = await Deno.stat(workspacesDir);
    if (!stat.isDirectory) {
      ui.error(`❌ ${workspacesDir} exists but is not a directory`);
      return 1;
    }
  } catch {
    ui.error(`❌ Workspaces directory not found: ${workspacesDir}`);
    ui.output("💡 Run 'bft codebot' first to create workspaces");
    return 1;
  }

  // Get list of workspace directories
  const workspaces: Array<string> = [];
  try {
    for await (const entry of Deno.readDir(workspacesDir)) {
      if (entry.isDirectory && !entry.name.startsWith(".")) {
        workspaces.push(entry.name);
      }
    }
  } catch (error) {
    ui.error(`❌ Failed to read workspaces directory: ${error}`);
    return 1;
  }

  if (workspaces.length === 0) {
    ui.output("📁 No workspaces found");
    ui.output("💡 Run 'bft codebot' to create your first workspace");
    return 0;
  }

  // Get workspace name from positional args
  const workspaceName = parsed._?.[0];

  // If specific workspace requested, compare only that one
  if (workspaceName) {
    if (!workspaces.includes(workspaceName)) {
      ui.error(`❌ Workspace '${workspaceName}' not found`);
      ui.output("Available workspaces:");
      for (const ws of workspaces.sort()) {
        ui.output(`  - ${ws}`);
      }
      return 1;
    }

    return await compareWorkspace(
      workspaceName,
      `${workspacesDir}/${workspaceName}`,
      currentDir,
      parsed.verbose || false,
      parsed["exclude-patterns"] || [],
    );
  }

  // Compare all workspaces in parallel for better performance
  ui.output(`🔍 Found ${workspaces.length} workspace(s):`);
  ui.output("");

  // Create a function that returns comparison data without outputting
  const getComparisonData = async (workspace: string) => {
    const workspacePath = `${workspacesDir}/${workspace}`;
    return await compareWorkspaceData(
      workspace,
      workspacePath,
      currentDir,
      parsed["exclude-patterns"] || [],
    );
  };

  // Process all comparisons in parallel
  const comparePromises = workspaces.sort().map((workspace) =>
    getComparisonData(workspace)
  );

  const results = await Promise.all(comparePromises);

  // Always show summary for multiple workspaces
  outputSummary(results, parsed.all || false);

  return 0;
}

interface WorkspaceComparisonResult {
  workspaceName: string;
  workspacePath: string;
  lastModified: string;
  changes: Array<{ status: string; path: string; details?: string }>;
  error?: string;
}

async function compareWorkspaceData(
  workspaceName: string,
  workspacePath: string,
  _currentPath: string,
  _excludePatterns: Array<string>,
): Promise<WorkspaceComparisonResult> {
  try {
    // Get workspace info
    const workspaceStat = await Deno.stat(workspacePath);
    const lastModified = workspaceStat.mtime?.toISOString() || "unknown";

    // Get file differences using Sapling (much faster)
    const changes = await getSaplingChanges(workspacePath);

    return {
      workspaceName,
      workspacePath,
      lastModified,
      changes,
    };
  } catch (error) {
    return {
      workspaceName,
      workspacePath,
      lastModified: "unknown",
      changes: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function outputWorkspaceComparison(
  result: WorkspaceComparisonResult,
  verbose: boolean,
): void {
  if (result.error) {
    ui.error(
      `❌ Failed to compare workspace ${result.workspaceName}: ${result.error}`,
    );
    return;
  }

  ui.output(`📁 ${result.workspaceName}`);

  if (result.changes.length === 0) {
    ui.output("   ✅ No changes detected");
  } else if (verbose) {
    for (const change of result.changes) {
      ui.output(`   ${change.status} ${change.path}`);
    }
  } else {
    const added = result.changes.filter((c) => c.status === "A").length;
    const modified = result.changes.filter((c) => c.status === "M").length;
    const deleted = result.changes.filter((c) => c.status === "D").length;
    const parts: Array<string> = [];
    if (added > 0) parts.push(`${added} added`);
    if (modified > 0) parts.push(`${modified} modified`);
    if (deleted > 0) parts.push(`${deleted} deleted`);
    ui.output(`   ${parts.join(", ")} (${result.changes.length} total)`);
  }
}

function outputSummary(
  results: Array<WorkspaceComparisonResult>,
  showUnchanged: boolean,
): void {
  const changedWorkspaces: Array<{
    name: string;
    added: number;
    modified: number;
    deleted: number;
    total: number;
  }> = [];
  const unchangedWorkspaces: Array<string> = [];

  // Categorize workspaces
  for (const result of results) {
    if (result.changes.length > 0) {
      const added = result.changes.filter((c) => c.status === "A").length;
      const modified = result.changes.filter((c) => c.status === "M").length;
      const deleted = result.changes.filter((c) => c.status === "D").length;

      changedWorkspaces.push({
        name: result.workspaceName,
        added,
        modified,
        deleted,
        total: result.changes.length,
      });
    } else {
      unchangedWorkspaces.push(result.workspaceName);
    }
  }

  // Output changed workspaces
  if (changedWorkspaces.length > 0) {
    ui.output(`📊 Workspaces with changes (${changedWorkspaces.length}):`);
    ui.output("");

    for (const ws of changedWorkspaces) {
      const parts: Array<string> = [];
      if (ws.added > 0) parts.push(`${ws.added} added`);
      if (ws.modified > 0) parts.push(`${ws.modified} modified`);
      if (ws.deleted > 0) parts.push(`${ws.deleted} deleted`);

      ui.output(`  📁 ${ws.name}: ${parts.join(", ")} (${ws.total} total)`);
    }
  } else {
    ui.output("✅ No changes found in any workspace");
  }

  // Output unchanged workspaces if requested
  if (showUnchanged) {
    ui.output("");
    ui.output(`📂 Workspaces with no changes (${unchangedWorkspaces.length}):`);
    for (const ws of unchangedWorkspaces) {
      ui.output(`  - ${ws}`);
    }
  }

  // Summary statistics
  ui.output("");
  ui.output(
    `📈 Summary: ${changedWorkspaces.length} changed, ${unchangedWorkspaces.length} unchanged`,
  );
}

async function compareWorkspace(
  workspaceName: string,
  workspacePath: string,
  currentPath: string,
  verbose: boolean,
  excludePatterns: Array<string>,
): Promise<number> {
  const result = await compareWorkspaceData(
    workspaceName,
    workspacePath,
    currentPath,
    excludePatterns,
  );

  outputWorkspaceComparison(result, verbose);
  return result.changes.length;
}

// Note: We removed the file-by-file comparison functions since Sapling is much more efficient

async function getSaplingChanges(
  workspacePath: string,
): Promise<Array<{ status: string; path: string; details?: string }>> {
  const changes: Array<{ status: string; path: string; details?: string }> = [];

  // Find all Sapling repos in the workspace
  const saplingRepos = await findSaplingRepos(workspacePath);

  for (const repoPath of saplingRepos) {
    try {
      // Run sl status in each repo
      const cmd = new Deno.Command("sl", {
        args: ["status"],
        cwd: repoPath,
        stdout: "piped",
        stderr: "piped",
      });

      const { stdout } = await cmd.output();
      const output = new TextDecoder().decode(stdout);

      // Parse the output
      const lines = output.trim().split("\n").filter((line) => line.length > 0);

      for (const line of lines) {
        if (line.length < 2) continue;

        const status = line[0];
        const filePath = line.substring(2).trim();

        // Calculate relative path from workspace root
        const relativePath = repoPath === workspacePath
          ? filePath
          : `${repoPath.substring(workspacePath.length + 1)}/${filePath}`;

        let statusChar = status;
        if (status === "M") statusChar = "M";
        else if (status === "A") statusChar = "A";
        else if (status === "R") statusChar = "D";
        else if (status === "?") statusChar = "A";
        else if (status === "!") statusChar = "D";

        changes.push({
          status: statusChar,
          path: relativePath,
        });
      }
    } catch (error) {
      logger.debug(`Failed to get Sapling status for ${repoPath}: ${error}`);
    }
  }

  // Sort changes by path for consistent output
  changes.sort((a, b) => a.path.localeCompare(b.path));

  return changes;
}

async function findSaplingRepos(
  basePath: string,
): Promise<Array<string>> {
  const repos: Array<string> = [];

  async function walkDir(currentPath: string) {
    try {
      for await (const entry of Deno.readDir(currentPath)) {
        if (entry.isDirectory) {
          const fullPath = `${currentPath}/${entry.name}`;

          // Check if this directory has a .sl subdirectory
          try {
            const slPath = `${fullPath}/.sl`;
            const slStat = await Deno.stat(slPath);
            if (slStat.isDirectory) {
              repos.push(fullPath);
              // Still recurse to find nested repos
            }
          } catch {
            // No .sl directory here
          }

          // Skip certain directories
          if (
            entry.name !== "node_modules" &&
            entry.name !== ".sl" &&
            entry.name !== ".git" &&
            !entry.name.startsWith(".")
          ) {
            await walkDir(fullPath);
          }
        }
      }
    } catch (error) {
      logger.debug(`Cannot read directory ${currentPath}: ${error}`);
    }
  }

  await walkDir(basePath);
  return repos.sort();
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Compare workspace directories and find changed files",
  aiSafe: true,
  fn: workspaceDiff,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await workspaceDiff(scriptArgs);
  Deno.exit(result);
}
