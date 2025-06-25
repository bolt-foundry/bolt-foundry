#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runLintWithGithubAnnotations } from "./githubAnnotations.ts";

const logger = getLogger(import.meta);

export async function lintCommand(options: Array<string>): Promise<number> {
  logger.info("Running Deno lint...");
  const args = ["deno", "lint"];

  if (options.includes("--fix")) {
    args.push("--fix");
    logger.info("Auto-fixing linting issues...");
  }

  const githubMode = options.includes("--github") || options.includes("-g");
  if (githubMode) {
    args.push("--json");
    logger.info("Running in GitHub annotations mode...");
    return await runLintWithGithubAnnotations();
  }

  const result = await runShellCommand(args);

  if (result === 0) {
    logger.info("✨ Linting passed!");
  } else {
    logger.error("❌ Linting failed");
  }

  return result;
}

register(
  "lint",
  "Run Deno lint on the codebase",
  lintCommand,
  [],
  true, // AI-safe
);
