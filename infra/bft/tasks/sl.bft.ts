import {
  runShellCommand,
  runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

/**
 * Get changed files from sl status
 */
async function getChangedFiles(): Promise<Array<string>> {
  const { stdout: statusOutput, code: statusCode } =
    await runShellCommandWithOutput(["sl", "status"]);

  if (statusCode !== 0) {
    return [];
  }

  const lines = statusOutput.split("\n").filter((line) => line.trim());
  const changedFiles: Array<string> = [];

  for (const line of lines) {
    const status = line.charAt(0);
    const file = line.slice(2); // Skip status character and space

    // Include modified, added, removed files
    if (["M", "A", "R", "?"].includes(status)) {
      changedFiles.push(file);
    }
  }

  return changedFiles;
}

/**
 * Simple smart validation - check file patterns to decide what to run
 */
async function getValidationTasks(
  files?: Array<string>,
): Promise<Array<{ name: string; command: Array<string> }>> {
  const tasks: Array<{ name: string; command: Array<string> }> = [];

  // If specific files provided, use those. Otherwise get all changed files
  const filesToCheck = files && files.length > 0
    ? files
    : await getChangedFiles();

  // Check for TypeScript/JavaScript files
  const hasCodeFiles = filesToCheck.some((file) =>
    file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") ||
    file.endsWith(".jsx")
  );

  // Check for test files
  const hasTestFiles = filesToCheck.some((file) =>
    file.includes(".test.") || file.includes("__tests__/")
  );

  // Check for config files
  const hasConfigFiles = filesToCheck.some((file) =>
    file.includes("package.json") || file.includes("deno.json") ||
    file.includes("deno.lock")
  );

  // Add validation tasks based on what changed
  if (hasCodeFiles) {
    tasks.push({ name: "Format", command: ["bft", "format"] });
    tasks.push({ name: "Lint", command: ["bft", "lint"] });
  }

  if (hasTestFiles || hasCodeFiles) {
    tasks.push({ name: "Test", command: ["bft", "test"] });
  }

  if (hasConfigFiles) {
    tasks.push({ name: "Build", command: ["bft", "build"] });
  }

  return tasks;
}

/**
 * Run smart validation pipeline
 */
async function runSmartValidation(
  files?: Array<string>,
  skipPrecommit = false,
): Promise<boolean> {
  if (skipPrecommit) {
    return true;
  }

  logger.info("Running smart validation...");

  const tasks = await getValidationTasks(files);

  if (tasks.length === 0) {
    logger.info("No validation needed for these changes");
    return true;
  }

  logger.info(`Running ${tasks.length} validation task(s)...`);

  for (const task of tasks) {
    const start = Date.now();
    const result = await runShellCommand(
      task.command,
      undefined,
      {},
      true,
      true,
    ); // silent mode
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (result !== 0) {
      logger.error(`❌ ${task.name} failed (${elapsed}s)`);
      logger.error("Smart validation failed. Fix issues and try again.");
      return false;
    }

    logger.info(`✅ ${task.name} passed (${elapsed}s)`);
  }

  logger.info("🎉 Smart validation passed!");
  return true;
}

/**
 * Stage files for commit
 */
async function stageFiles(files?: Array<string>): Promise<number> {
  // Always run addremove first to discover new files and removed files
  logger.info("Discovering new and removed files...");
  const addremoveResult = await runShellCommand(["sl", "addremove"]);
  if (addremoveResult !== 0) {
    logger.error("❌ Failed to discover new/removed files");
    return addremoveResult;
  }

  // If specific files are provided, add them explicitly
  if (files && files.length > 0) {
    logger.info("Staging specified files...");
    const addResult = await runShellCommand(["sl", "add", ...files]);
    if (addResult !== 0) {
      return addResult;
    }
  }

  return 0;
}

/**
 * Enhanced commit command
 */
async function handleCommit(args: Array<string>): Promise<number> {
  let commitMessage = "";
  const filesToCommit: Array<string> = [];
  let skipPrecommit = false;
  let noSubmit = false;

  // Parse arguments
  const skipIndices = new Set<number>();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-m" && i + 1 < args.length) {
      commitMessage = args[i + 1];
      skipIndices.add(i);
      skipIndices.add(i + 1);
    } else if (args[i] === "--skip-precommit") {
      skipPrecommit = true;
      skipIndices.add(i);
    } else if (args[i] === "--no-submit") {
      noSubmit = true;
      skipIndices.add(i);
    }
  }

  // Get files to commit
  for (let i = 0; i < args.length; i++) {
    if (!skipIndices.has(i)) {
      filesToCommit.push(args[i]);
    }
  }

  if (!commitMessage) {
    logger.error(
      '❌ No commit message provided. Usage: bft sl commit -m "Your message" [--skip-precommit] [--no-submit] [files...]',
    );
    return 1;
  }

  // Run smart validation
  if (!await runSmartValidation(filesToCommit, skipPrecommit)) {
    return 1;
  }

  // Stage files
  const stageResult = await stageFiles(
    filesToCommit.length > 0 ? filesToCommit : undefined,
  );
  if (stageResult !== 0) {
    logger.error("❌ Failed to stage files");
    return stageResult;
  }

  // Create commit
  logger.info("Creating commit...");
  const commitArgs = ["sl", "commit", "-m", commitMessage];
  if (filesToCommit.length > 0) {
    commitArgs.push(...filesToCommit);
  }

  const commitResult = await runShellCommand(commitArgs);
  if (commitResult !== 0) {
    logger.error("❌ Failed to create commit");
    return commitResult;
  }

  logger.info("🎉 Commit created successfully!");

  // Submit PR if requested
  if (!noSubmit) {
    logger.info("Submitting PR...");
    const submitResult = await runShellCommand(["sl", "pr", "submit"]);
    if (submitResult !== 0) {
      logger.error("❌ Failed to submit PR");
      return submitResult;
    }
    logger.info("🚀 PR submitted successfully!");
  }

  return 0;
}

/**
 * Enhanced amend command
 */
async function handleAmend(args: Array<string>): Promise<number> {
  const skipPrecommit = args.includes("--skip-precommit");

  // Run smart validation (no files specified for amend)
  if (!await runSmartValidation(undefined, skipPrecommit)) {
    return 1;
  }

  // Run sl amend with original args (minus our custom flags)
  const filteredArgs = args.filter((arg) => arg !== "--skip-precommit");
  const amendResult = await runShellCommand(["sl", "amend", ...filteredArgs]);

  if (amendResult === 0) {
    logger.info("🎉 Commit amended successfully!");
  }

  return amendResult;
}

/**
 * Main sl proxy command
 */
export async function slCommand(options: Array<string>): Promise<number> {
  if (options.length === 0) {
    // No subcommand, show help
    return await runShellCommand(["sl", "--help"]);
  }

  const subcommand = options[0];
  const args = options.slice(1);

  // Enhanced commands
  if (subcommand === "commit") {
    return await handleCommit(args);
  } else if (subcommand === "amend") {
    return await handleAmend(args);
  } else {
    // Pass through all other commands
    return await runShellCommand(["sl", ...options]);
  }
}

/**
 * Check if sl subcommand is AI-safe
 */
function isSlCommandSafe(args: Array<string>): boolean {
  if (args.length === 0) {
    return true; // sl without args shows help
  }

  const subcommand = args[0];

  // Commands that modify the repository state are not AI-safe
  const unsafeCommands = [
    "commit",
    "amend",
    "uncommit",
    "split",
    "add",
    "remove",
    "forget",
    "revert",
    "purge",
    "shelve",
    "unshelve",
    "metaedit",
    "rebase",
    "graft",
    "hide",
    "unhide",
    "fold",
    "histedit",
    "absorb",
    "unamend",
    "undo",
    "redo",
    "clone",
    "init",
    "pull",
    "push",
    "land",
    "pr",
  ];

  return !unsafeCommands.includes(subcommand);
}

export const bftDefinition = {
  description:
    "Sapling proxy with enhanced commit and amend (smart validation)",
  fn: slCommand,
  aiSafe: isSlCommandSafe,
  helpText: `Usage: bft sl <subcommand> [arguments...]

Sapling proxy with enhanced commit and amend functionality.

Enhanced commands:
  commit      Create commit with smart validation
              Usage: bft sl commit -m "message" [--skip-precommit] [--no-submit] [files...]
  amend       Amend commit with smart validation
              Usage: bft sl amend [--skip-precommit] [args...]

All other Sapling commands are passed through unchanged.

Examples:
  bft sl status                              # Show repository status
  bft sl commit -m "Add feature"             # Create commit with validation
  bft sl commit -m "Fix bug" --skip-precommit # Skip pre-commit validation
  bft sl amend                               # Amend last commit with validation
  bft sl diff                                # Show changes
  bft sl log                                 # Show commit history

For help on standard Sapling commands, use: bft sl <command> --help`,
} satisfies TaskDefinition;
