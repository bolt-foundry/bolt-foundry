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
  if (files && files.length > 0) {
    // Stage specific files
    logger.info("Staging specified files...");

    // Check which files exist and which are deleted
    const existingFiles: Array<string> = [];
    const deletedFiles: Array<string> = [];

    for (const file of files) {
      try {
        await Deno.stat(file);
        existingFiles.push(file);
      } catch {
        // File doesn't exist, assume it's deleted
        deletedFiles.push(file);
      }
    }

    // Add existing files
    if (existingFiles.length > 0) {
      const addResult = await runShellCommand(["sl", "add", ...existingFiles]);
      if (addResult !== 0) {
        return addResult;
      }
    }

    // Mark deleted files for removal
    if (deletedFiles.length > 0) {
      const removeResult = await runShellCommand([
        "sl",
        "remove",
        "--mark",
        ...deletedFiles,
      ]);
      if (removeResult !== 0) {
        return removeResult;
      }
    }
  } else {
    // Stage all changes
    logger.info("Staging all changes...");

    const { stdout: statusOutput, code: statusCode } =
      await runShellCommandWithOutput(["sl", "status"]);
    if (statusCode !== 0) {
      logger.error("Failed to get repository status");
      return statusCode;
    }

    const lines = statusOutput.split("\n").filter((line) => line.trim());
    const unknownFiles: Array<string> = [];
    const missingFiles: Array<string> = [];

    for (const line of lines) {
      const status = line.charAt(0);
      const file = line.slice(2);

      if (status === "?") {
        unknownFiles.push(file);
      } else if (status === "!") {
        missingFiles.push(file);
      }
    }

    // Add unknown files
    if (unknownFiles.length > 0) {
      for (const file of unknownFiles) {
        const result = await runShellCommand(["sl", "add", file]);
        if (result !== 0) {
          return result;
        }
      }
    }

    // Remove missing files
    if (missingFiles.length > 0) {
      for (const file of missingFiles) {
        const result = await runShellCommand(["sl", "remove", file]);
        if (result !== 0) {
          return result;
        }
      }
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
} satisfies TaskDefinition;
