#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function testCommand(options: string[]): Promise<number> {
  logger.info("Running tests...");

  const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
  const pathsStrings = paths.map((path) => `${path}/**/*.test.ts`);
  const pathsStringsX = paths.map((path) => `${path}/**/*.test.tsx`);
  const runnablePaths = options.length > 0
    ? options
    : [...pathsStrings, ...pathsStringsX];
  const testArgs = ["deno", "test", "-A", ...runnablePaths];

  // Allow passing specific test files or additional arguments
  if (options.length > 0) {
    testArgs.push(...options);
  }

  const result = await runShellCommand(testArgs, undefined, {}, true, true);

  if (result === 0) {
    logger.info("✨ All tests passed!");
  } else {
    logger.error("❌ Tests failed");
  }

  return result;
}

register(
  "test",
  "Run project tests",
  testCommand,
);

register(
  "t",
  "Run project tests",
  testCommand,
);
