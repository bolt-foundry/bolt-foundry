#! /usr/bin/env -S bff

import { parse as parseToml, stringify as stringifyToml } from "@std/toml";
import { register } from "infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

async function getSaplingCommitsSince(
  lastSaplingHash: string,
): Promise<Array<string>> {
  const { stdout } = await runShellCommandWithOutput([
    "sl",
    "log",
    `-r"${lastSaplingHash}::."`,
    "--template",
    "{desc}\n",
  ]);
  return stdout.split("\n").filter(Boolean);
}

async function getCurrentSaplingHash(): Promise<string> {
  const { stdout } = await runShellCommandWithOutput([
    "sl",
    "log",
    "-r",
    ".",
    "--template",
    "{node}",
  ]);
  return stdout.trim();
}

async function getLastSaplingHashFromGit(): Promise<string | null> {
  try {
    const { stdout: lastCommitMsg } = await runShellCommandWithOutput([
      "git",
      "log",
      "-1",
      "--pretty=%B",
    ]);
    const match = lastCommitMsg.match(/Sapling-Hash: ([a-f0-9]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function land(): Promise<number> {
  // Then pull the latest code
  logger.info("Pulling latest code from sapling...");
  const pullResult = await runShellCommand([
    "sl",
    "pull",
  ]);

  if (pullResult !== 0) {
    logger.error("Failed to pull latest code");
    return pullResult;
  }
  // Try to goto remote/main with clean state
  logger.info("Going to remote/main with clean state...");
  const gotoResult = await runShellCommand([
    "sl",
    "goto",
    "remote/main",
    "--clean",
  ]);

  if (gotoResult !== 0) {
    logger.error("Failed to goto remote/main");
    return gotoResult;
  }

  // Install dependencies
  logger.info("Installing dependencies...");
  const installResult = await runShellCommand([
    "deno",
    "install",
  ]);

  if (installResult !== 0) {
    logger.error("Failed to install dependencies");
    return installResult;
  }

  // Build BFF with bolt-foundry package
  logger.info("Building BFF with bolt-foundry package...");
  const buildResult = await runShellCommand([
    "bff",
    "build",
    "--include-bolt-foundry",
  ]);

  if (buildResult !== 0) {
    logger.error("Failed to build BFF");
    return buildResult;
  }

  const currentSaplingHash = await getCurrentSaplingHash();
  const lastSaplingHash = await getLastSaplingHashFromGit();

  let commitMsg = "";
  if (lastSaplingHash) {
    const commits = await getSaplingCommitsSince(lastSaplingHash);
    commitMsg = commits.join("\n\n");
  } else {
    const { stdout } = await runShellCommandWithOutput([
      "sl",
      "log",
      "-r",
      ".",
      "--template",
      "{desc}",
    ]);
    commitMsg = stdout;
  }

  // Add all changes to git
  logger.info("Adding changes to git...");
  const addResult = await runShellCommand([
    "git",
    "add",
    ".",
  ]);

  if (addResult !== 0) {
    logger.error("Failed to add changes to git");
    return addResult;
  }

  logger.info("Proceeding with commit");

  // First check for .replit.local.toml file and merge with .replit if it exists
  // Do this before git commit so it happens regardless of commit success/failure
  logger.info("Checking for .replit.local.toml file...");
  const replitLocalExists = await exists(".replit.local.toml");

  if (replitLocalExists) {
    logger.info(".replit.local.toml file found, merging with .replit file...");
    try {
      const replitLocalContent = await Deno.readTextFile(".replit.local.toml");
      const replitContent = await Deno.readTextFile(".replit");

      // Parse both TOML files
      const replitLocalData = parseToml(replitLocalContent);
      const replitData = parseToml(replitContent);

      // Deep merge the TOML objects
      const mergedData = deepMergeToml(replitData, replitLocalData);

      // Convert back to TOML string
      const mergedContent = stringifyToml(mergedData);

      await Deno.writeTextFile(".replit", mergedContent);
      logger.info("Successfully merged .replit.local with .replit");
    } catch (error) {
      logger.error("Error merging .replit.local with .replit:", error);
      // Continue with the process even if the merge fails
    }
  } else {
    logger.info("No .replit.local.toml file found, skipping merge step.");
  }

  // Delete .env.local file if it exists
  logger.info("Checking for .env.local file...");
  const envLocalExists = await exists(".env.local");

  if (envLocalExists) {
    logger.info("Deleting .env.local file before git commit...");
    try {
      await Deno.remove(".env.local");
      logger.info("Successfully deleted .env.local");
    } catch (error) {
      logger.error("Error deleting .env.local:", error);
      // Continue with the process even if the delete fails
    }
  } else {
    logger.info("No .env.local file found, skipping deletion.");
  }

  // Create git commit with sapling commits and hash
  logger.info("Creating git commit...");
  const fullCommitMsg =
    `${commitMsg.trim()}\n\nSapling-Hash: ${currentSaplingHash}`;
  const commitResult = await runShellCommand([
    "git",
    "commit",
    "-a",
    "-m",
    fullCommitMsg,
  ]);

  if (commitResult !== 0) {
    logger.error("Failed to create git commit");
    return commitResult;
  }

  logger.info("Successfully landed changes!");
  return 0;
}

// Import exists function from Deno standard library
import { exists } from "@std/fs/exists";

/**
 * Deep merge two TOML objects
 * @param target Base TOML object
 * @param source TOML object to merge in
 * @returns Merged TOML object
 */
function deepMergeToml(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const output = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (
        isObject(source[key]) &&
        key in target &&
        isObject(target[key])
      ) {
        // If both properties are objects, recursively merge them
        output[key] = deepMergeToml(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>,
        );
      } else if (
        Array.isArray(source[key]) &&
        key in target &&
        Array.isArray(target[key])
      ) {
        // For workflow arrays, we want to append new workflows but not duplicate
        if (key === "workflows") {
          const targetWorkflows = target[key] as Array<unknown>;
          const sourceWorkflows = source[key] as Array<unknown>;
          // Create a new array with unique workflows
          output[key] = [...targetWorkflows];

          // Add workflows from source that don't exist in target
          for (const workflow of sourceWorkflows) {
            if (typeof workflow === "object" && workflow !== null) {
              const workflowName = (workflow as Record<string, unknown>).name;
              // Check if this workflow already exists in the target
              const exists = (targetWorkflows as Array<Record<string, unknown>>)
                .some(
                  (tw) => tw.name === workflowName,
                );
              if (!exists) {
                (output[key] as Array<unknown>).push(workflow);
              }
            }
          }
        } else {
          // Don't merge any arrays - just use the source value
          output[key] = source[key];
        }
      } else {
        // Otherwise, just overwrite with the source value
        output[key] = source[key];
      }
    }
  }

  return output;
}

/**
 * Check if value is an object
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

register(
  "land",
  "Pull code from sapling, install deps, and create a git commit",
  land,
);
