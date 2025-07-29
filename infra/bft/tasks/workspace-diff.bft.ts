#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface WorkspaceDiffArgs {
  help?: boolean;
  workspace?: string;
  format?: "short" | "long";
  "only-changed"?: boolean;
  "exclude-patterns"?: Array<string>;
}

async function workspaceDiff(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["help", "only-changed"],
    string: ["workspace", "format", "exclude-patterns"],
    alias: { h: "help", w: "workspace", f: "format" },
    collect: ["exclude-patterns"],
    default: {
      format: "short",
    },
  }) as WorkspaceDiffArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft workspace-diff [OPTIONS] [WORKSPACE]

Compare workspace directories to find changed files between workspaces or against the current directory.

OPTIONS:
  --workspace NAME, -w NAME    Compare against specific workspace (default: compare all workspaces)
  --format FORMAT, -f FORMAT   Output format: short, long (default: short)
  --only-changed              Show only files that have changed
  --exclude-patterns PATTERN   Exclude files matching glob patterns (can be used multiple times)
  --help, -h                   Show this help message

EXAMPLES:
  bft workspace-diff                           # List all workspaces and their status
  bft workspace-diff --workspace fuzzy-goat    # Compare current dir with fuzzy-goat workspace
  bft workspace-diff --only-changed            # Show only changed files across all workspaces
  bft workspace-diff --format long             # Show detailed diff information
  bft workspace-diff --exclude-patterns "*.log" --exclude-patterns "node_modules/*"

OUTPUT FORMAT:
  short: Lists changed files with basic status (A=added, M=modified, D=deleted)
  long:  Shows detailed diff statistics and modification times
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

  // If specific workspace requested, compare only that one
  if (parsed.workspace) {
    if (!workspaces.includes(parsed.workspace)) {
      ui.error(`❌ Workspace '${parsed.workspace}' not found`);
      ui.output("Available workspaces:");
      for (const ws of workspaces.sort()) {
        ui.output(`  - ${ws}`);
      }
      return 1;
    }

    return await compareWorkspace(
      parsed.workspace,
      `${workspacesDir}/${parsed.workspace}`,
      currentDir,
      parsed.format || "short",
      parsed["only-changed"] || false,
      parsed["exclude-patterns"] || [],
    );
  }

  // Compare all workspaces in parallel for better performance
  ui.output(`🔍 Found ${workspaces.length} workspace(s):`);
  ui.output("");

  const comparePromises = workspaces.sort().map(async (workspace) => {
    const workspacePath = `${workspacesDir}/${workspace}`;
    const changes = await compareWorkspace(
      workspace,
      workspacePath,
      currentDir,
      parsed.format || "short",
      parsed["only-changed"] || false,
      parsed["exclude-patterns"] || [],
    );
    return { workspace, changes };
  });

  const results = await Promise.all(comparePromises);

  let hasChanges = false;
  for (const { changes } of results) {
    if (changes > 0) {
      hasChanges = true;
    }
    ui.output("");
  }

  if (!hasChanges && parsed["only-changed"]) {
    ui.output("✅ No changes found in any workspace");
  }

  return 0;
}

async function compareWorkspace(
  workspaceName: string,
  workspacePath: string,
  currentPath: string,
  format: string,
  onlyChanged: boolean,
  excludePatterns: Array<string>,
): Promise<number> {
  try {
    // Get workspace info
    const workspaceStat = await Deno.stat(workspacePath);
    const lastModified = workspaceStat.mtime?.toISOString() || "unknown";

    if (format === "long") {
      ui.output(`📁 Workspace: ${workspaceName}`);
      ui.output(`   Path: ${workspacePath}`);
      ui.output(`   Last modified: ${lastModified}`);
    } else {
      ui.output(`📁 ${workspaceName} (${lastModified})`);
    }

    // Use file-based comparison (workspaces are unlikely to be git repos, but use CoW efficiently)
    const changes = await fileDiffComparison(
      workspaceName,
      workspacePath,
      currentPath,
      format,
      onlyChanged,
      excludePatterns,
    );

    if (changes === 0 && !onlyChanged) {
      ui.output("   ✅ No changes detected");
    }

    return changes;
  } catch (error) {
    ui.error(`❌ Failed to compare workspace ${workspaceName}: ${error}`);
    return 0;
  }
}

async function fileDiffComparison(
  _workspaceName: string,
  workspacePath: string,
  currentPath: string,
  format: string,
  _onlyChanged: boolean,
  excludePatterns: Array<string>,
): Promise<number> {
  const changes: Array<{ status: string; path: string; details?: string }> = [];

  // Get all files from both directories
  const currentFiles = await getAllFiles(currentPath, excludePatterns);
  const workspaceFiles = await getAllFiles(workspacePath, excludePatterns);

  // Create sets for efficient comparison
  const currentSet = new Set(currentFiles);
  const workspaceSet = new Set(workspaceFiles);

  // Find added files (in workspace but not current)
  for (const file of workspaceFiles) {
    if (!currentSet.has(file)) {
      changes.push({ status: "A", path: file });
    }
  }

  // Find deleted files (in current but not workspace)
  for (const file of currentFiles) {
    if (!workspaceSet.has(file)) {
      changes.push({ status: "D", path: file });
    }
  }

  // Find modified files (in both but different)
  for (const file of currentFiles) {
    if (workspaceSet.has(file)) {
      const currentFilePath = `${currentPath}/${file}`;
      const workspaceFilePath = `${workspacePath}/${file}`;

      try {
        const currentStat = await Deno.stat(currentFilePath);
        const workspaceStat = await Deno.stat(workspaceFilePath);

        // Compare file sizes and modification times
        if (
          currentStat.size !== workspaceStat.size ||
          (currentStat.mtime?.getTime() || 0) !==
            (workspaceStat.mtime?.getTime() || 0)
        ) {
          const details = format === "long"
            ? `(current: ${currentStat.size}b @ ${
              currentStat.mtime?.toISOString() || "unknown"
            }, workspace: ${workspaceStat.size}b @ ${
              workspaceStat.mtime?.toISOString() || "unknown"
            })`
            : undefined;

          changes.push({ status: "M", path: file, details });
        }
      } catch {
        // If we can't stat one of the files, consider it modified
        changes.push({ status: "M", path: file });
      }
    }
  }

  // Sort changes by path for consistent output
  changes.sort((a, b) => a.path.localeCompare(b.path));

  // Output changes
  for (const change of changes) {
    if (format === "long" && change.details) {
      ui.output(`   ${change.status} ${change.path} ${change.details}`);
    } else {
      ui.output(`   ${change.status} ${change.path}`);
    }
  }

  return changes.length;
}

async function getAllFiles(
  dirPath: string,
  excludePatterns: Array<string>,
): Promise<Array<string>> {
  const files: Array<string> = [];

  async function walkDir(currentPath: string, relativePath: string = "") {
    try {
      for await (const entry of Deno.readDir(currentPath)) {
        const fullPath = `${currentPath}/${entry.name}`;
        const relativeFilePath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name;

        // Skip excluded patterns
        if (shouldExclude(relativeFilePath, excludePatterns)) {
          continue;
        }

        if (entry.isDirectory) {
          // Skip common directories that shouldn't be compared
          if (
            entry.name === ".git" ||
            entry.name === "node_modules" ||
            entry.name === ".bft" ||
            entry.name === "tmp"
          ) {
            continue;
          }
          await walkDir(fullPath, relativeFilePath);
        } else if (entry.isFile) {
          files.push(relativeFilePath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
      logger.warn(`Cannot read directory ${currentPath}: ${error}`);
    }
  }

  await walkDir(dirPath);
  return files.sort();
}

function shouldExclude(
  filePath: string,
  excludePatterns: Array<string>,
): boolean {
  for (const pattern of excludePatterns) {
    // Simple glob matching - convert * to .* for regex
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    if (regex.test(filePath)) {
      return true;
    }
  }
  return false;
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
