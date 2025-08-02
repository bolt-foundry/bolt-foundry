import {
  runShellCommand,
  runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { ui } from "@bfmono/packages/tui/tui.ts";
import { parseArgs } from "@std/cli/parse-args";

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

  // Note: Config file checking removed as build validation requires specific app name

  // Add validation tasks based on what changed
  if (hasCodeFiles) {
    tasks.push({ name: "Format", command: ["bft", "format"] });
    tasks.push({ name: "Lint", command: ["bft", "lint"] });
  }

  if (hasTestFiles || hasCodeFiles) {
    tasks.push({ name: "Test", command: ["bft", "test"] });
  }

  // Note: Build validation skipped as compile requires specific app name

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
 * Get list of shelved changes
 */
async function getShelvedChangesList(): Promise<Array<string>> {
  const { stdout, code } = await runShellCommandWithOutput([
    "sl",
    "shelve",
    "--list",
  ]);

  if (code !== 0) {
    return [];
  }

  const lines = stdout.split("\n").filter((line) => line.trim());
  const shelves: Array<string> = [];

  for (const line of lines) {
    // Parse shelve list output format
    const match = line.match(/^\s*(\S+)\s+/);
    if (match) {
      shelves.push(match[1]);
    }
  }

  return shelves;
}

/**
 * Enhanced shelve command
 */
async function handleShelve(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    string: ["name", "message"],
    boolean: ["interactive", "keep"],
    alias: { n: "name", m: "message", i: "interactive", k: "keep" },
  });

  // Check if we have changes to shelve
  const changes = await getChangedFiles();
  if (changes.length === 0) {
    ui.output("No changes to shelve");
    return 0;
  }

  // Generate smart shelve name if not provided
  const shelveName = parsed.name || `codebot-${Date.now()}`;

  ui.output(`📦 Shelving ${changes.length} file(s) as '${shelveName}'`);

  // Build shelve command
  const shelveArgs = ["sl", "shelve", "-n", shelveName];

  if (parsed.message) {
    shelveArgs.push("-m", parsed.message);
  }

  if (parsed.interactive) {
    shelveArgs.push("-i");
  }

  if (parsed.keep) {
    shelveArgs.push("--keep");
  }

  // Add any remaining positional arguments (file paths)
  const positionalArgs = parsed._.map(String);
  if (positionalArgs.length > 0) {
    shelveArgs.push(...positionalArgs);
  }

  const result = await runShellCommand(shelveArgs);

  if (result === 0) {
    ui.output(`✅ Changes shelved successfully as '${shelveName}'`);
  }

  return result;
}

/**
 * Enhanced unshelve command
 */
async function handleUnshelve(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    string: ["name"],
    boolean: ["keep", "tool"],
    alias: { n: "name", k: "keep", t: "tool" },
  });

  const shelveName = parsed.name || parsed._[0]?.toString();

  // If no name provided, list available shelves
  if (!shelveName) {
    const shelves = await getShelvedChangesList();
    if (shelves.length === 0) {
      ui.output("No shelved changes found");
      return 0;
    }

    ui.output("Available shelves:");
    for (const shelve of shelves) {
      ui.output(`  - ${shelve}`);
    }
    ui.output("\nUsage: bft sl unshelve <name>");
    return 0;
  }

  ui.output(`📤 Unshelving '${shelveName}'...`);

  // Build unshelve command
  const unshelveArgs = ["sl", "unshelve", shelveName];

  if (parsed.keep) {
    unshelveArgs.push("--keep");
  }

  if (parsed.tool) {
    unshelveArgs.push("--tool");
  }

  const result = await runShellCommand(unshelveArgs);

  if (result === 0) {
    ui.output(`✅ Successfully unshelved '${shelveName}'`);
  } else {
    ui.error(`❌ Failed to unshelve '${shelveName}'`);
    if (!parsed.tool) {
      ui.output("💡 Tip: Use --tool flag to resolve conflicts interactively");
    }
  }

  return result;
}

/**
 * Check if there are uncommitted changes
 */
async function hasUncommittedChanges(): Promise<boolean> {
  const changes = await getChangedFiles();
  return changes.length > 0;
}

/**
 * Enhanced checkout command with automatic shelve/unshelve
 */
async function handleCheckout(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    string: ["branch", "shelve-name"],
    boolean: ["no-shelve", "keep-shelved"],
    alias: { b: "branch", s: "shelve-name" },
  });

  const targetBranch = parsed.branch || parsed._[0]?.toString() ||
    "remote/main";
  const autoShelveName = parsed["shelve-name"] || `checkout-${Date.now()}`;

  // Check for uncommitted changes
  let shelvedChanges = false;
  if (!parsed["no-shelve"] && await hasUncommittedChanges()) {
    ui.output("🔍 Detected uncommitted changes");

    // Shelve current changes
    ui.output(`📦 Shelving changes as '${autoShelveName}'...`);
    const shelveResult = await runShellCommand([
      "sl",
      "shelve",
      "-n",
      autoShelveName,
    ]);

    if (shelveResult !== 0) {
      ui.error("❌ Failed to shelve changes");
      return shelveResult;
    }

    shelvedChanges = true;
    ui.output(`✅ Changes shelved as '${autoShelveName}'`);
  }

  // Checkout target branch
  ui.output(`🔄 Checking out '${targetBranch}'...`);
  const checkoutResult = await runShellCommand(["sl", "goto", targetBranch]);

  if (checkoutResult !== 0) {
    ui.error(`❌ Failed to checkout '${targetBranch}'`);

    // Try to restore shelved changes if checkout failed
    if (shelvedChanges) {
      ui.output(`🔄 Restoring shelved changes...`);
      await runShellCommand(["sl", "unshelve", autoShelveName]);
    }

    return checkoutResult;
  }

  ui.output(`✅ Successfully checked out '${targetBranch}'`);

  // Unshelve changes if requested (default behavior unless --keep-shelved)
  if (shelvedChanges && !parsed["keep-shelved"]) {
    ui.output(`📤 Restoring shelved changes...`);
    const unshelveResult = await runShellCommand([
      "sl",
      "unshelve",
      autoShelveName,
    ]);

    if (unshelveResult !== 0) {
      ui.error(`❌ Failed to unshelve changes`);
      ui.output(`💡 Your changes are still shelved as '${autoShelveName}'`);
      ui.output(
        `   Run 'bft sl unshelve ${autoShelveName}' to restore them manually`,
      );
      return unshelveResult;
    }

    ui.output(`✅ Changes restored successfully`);
  } else if (shelvedChanges) {
    ui.output(`📦 Changes remain shelved as '${autoShelveName}'`);
    ui.output(
      `   Run 'bft sl unshelve ${autoShelveName}' when ready to restore`,
    );
  }

  return 0;
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
  } else if (subcommand === "shelve") {
    return await handleShelve(args);
  } else if (subcommand === "unshelve") {
    return await handleUnshelve(args);
  } else if (subcommand === "checkout") {
    return await handleCheckout(args);
  } else {
    // Pass through all other commands
    return await runShellCommand(["sl", ...options]);
  }
}

export const bftDefinition = {
  description:
    "Sapling proxy with enhanced commit and amend (smart validation)",
  fn: slCommand,
} satisfies TaskDefinition;
