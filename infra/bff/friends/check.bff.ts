#! /usr/bin/env -S bff

// infra/bff/friends/check.bff.ts
import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function checkCommand(options: Array<string>): Promise<number> {
  logger.info("Running type checking...");

  const args = ["deno", "check"];

  // Add files to check
  if (options.length > 0) {
    // Filter out non-TypeScript/JavaScript files
    const tsFiles = options.filter((file) => {
      return file.endsWith(".ts") || file.endsWith(".tsx") ||
        file.endsWith(".js") || file.endsWith(".jsx") ||
        file.endsWith(".mjs") || file.endsWith(".mts") ||
        file.startsWith("--"); // Keep flags
    });

    if (tsFiles.length === 0) {
      logger.info("No TypeScript/JavaScript files to check");
      return 0;
    }

    args.push(...tsFiles);
  } else {
    // Default to check important directories if no files specified
    args.push(
      "infra/**/*.ts",
      "infra/**/*.tsx",
      "packages/**/*.ts",
      "packages/**/*.tsx",
    );
  }

  // Add --watch flag if requested
  if (options.includes("--watch")) {
    args.push("--watch");
    logger.info("Running in watch mode...");
  }

  // Add --quiet flag if requested for less verbose output
  if (options.includes("--quiet")) {
    args.push("--quiet");
  }

  // Execute deno check with the specified arguments
  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Type checking passed!");
  } else {
    logger.error("❌ Type checking failed");
  }

  return result;
}

register(
  "check",
  "Run type checking on the codebase using Deno check",
  checkCommand,
  [],
  true, // AI-safe
);
