#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

async function stageFiles(): Promise<number> {
  // Get status to find unknown and missing files
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
    const file = line.slice(2); // Skip status character and space

    if (status === "?") {
      unknownFiles.push(file);
    } else if (status === "!") {
      missingFiles.push(file);
    }
  }

  // Add unknown files
  if (unknownFiles.length > 0) {
    logger.info(`Adding ${unknownFiles.length} unknown files...`);
    for (const file of unknownFiles) {
      const result = await runShellCommand(["sl", "add", file]);
      if (result !== 0) {
        logger.error(`Failed to add ${file}`);
        return result;
      }
    }
  }

  // Remove missing files
  if (missingFiles.length > 0) {
    logger.info(`Removing ${missingFiles.length} missing files...`);
    for (const file of missingFiles) {
      const result = await runShellCommand(["sl", "remove", file]);
      if (result !== 0) {
        logger.error(`Failed to remove ${file}`);
        return result;
      }
    }
  }

  return 0;
}

export async function precommitCommand(
  options: Array<string>,
): Promise<number> {
  // Separate flags from file arguments
  const flags: Array<string> = [];
  const files: Array<string> = [];

  for (const option of options) {
    if (option.startsWith("--") || option.startsWith("-")) {
      flags.push(option);
    } else {
      files.push(option);
    }
  }

  const verbose = flags.includes("--verbose") || flags.includes("-v");

  logger.info("Running AI-safe pre-commit checks...");

  // First, stage any unknown files and remove missing files
  logger.info("🔍 Staging files...");
  const stageResult = await stageFiles();
  if (stageResult !== 0) {
    logger.error("❌ Failed to stage files");
    return stageResult;
  }

  // Build check commands with file arguments if provided
  const checks = [
    { name: "Format", command: ["bff", "ai", "format", ...files] },
    { name: "Lint", command: ["bff", "ai", "lint", "--fix", ...files] },
    { name: "Type Check", command: ["bff", "ai", "check", ...files] },
    { name: "Test", command: ["bff", "ai", "test"] }, // Tests don't take file args
  ];

  // Allow skipping specific checks with options
  const skipFormat = flags.includes("--skip-format");
  const skipCheck = flags.includes("--skip-check");
  const skipLint = flags.includes("--skip-lint");
  const skipTest = flags.includes("--skip-test");

  const filteredChecks = checks.filter((check) => {
    if (skipFormat && check.name === "Format") return false;
    if (skipCheck && check.name === "Type Check") return false;
    if (skipLint && check.name === "Lint") return false;
    if (skipTest && check.name === "Test") return false;
    return true;
  });

  const filesInfo = files.length > 0 ? ` on ${files.length} file(s)` : "";
  logger.info(
    `Running ${filteredChecks.length} pre-commit checks${filesInfo}...`,
  );

  for (const check of filteredChecks) {
    if (verbose) {
      logger.info(`🔍 Running ${check.name}...`);
      const result = await runShellCommand(check.command);

      if (result !== 0) {
        logger.error(`❌ ${check.name} failed with exit code ${result}`);
        logger.error(
          "Pre-commit checks failed. Please fix the issues and try again.",
        );
        return result;
      }

      logger.info(`✅ ${check.name} passed!`);
    } else {
      // Concise mode - suppress output and show timing
      const start = Date.now();
      const result = await runShellCommand(
        check.command,
        undefined,
        {},
        true,
        true,
      ); // silent = true
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);

      if (result !== 0) {
        logger.error(`❌ ${check.name} failed (${elapsed}s)`);
        logger.error(
          "Pre-commit checks failed. Run with --verbose for full output.",
        );
        return result;
      }

      logger.info(`✅ ${check.name} passed (${elapsed}s)`);
    }
  }

  logger.info("🎉 All pre-commit checks passed!");
  return 0;
}

register(
  "precommit",
  "Stage files and run AI-safe pre-commit checks (format, check, lint, test)",
  precommitCommand,
  [
    {
      option: "--skip-format",
      description: "Skip code formatting check.",
    },
    {
      option: "--skip-check",
      description: "Skip type checking.",
    },
    {
      option: "--skip-lint",
      description: "Skip linting.",
    },
    {
      option: "--skip-test",
      description: "Skip running tests.",
    },
    {
      option: "--verbose, -v",
      description: "Show full output from all checks.",
    },
  ],
  true, // AI-safe - only runs other AI-safe commands
);
