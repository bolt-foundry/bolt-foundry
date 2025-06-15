#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function testCommand(options: Array<string>): Promise<number> {
  logger.info("Running tests...");

  const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
  const pathsStrings = paths.map((path) => `${path}/**/*.test.ts`);
  const pathsStringsX = paths.map((path) => `${path}/**/*.test.tsx`);
  const runnablePaths = options.length > 0
    ? options
    : [...pathsStrings, ...pathsStringsX];
  const testArgs = ["deno", "test", "-A", ...runnablePaths];

  // Set test environment variables to prevent 1Password popups during tests
  const testEnv = {
    BF_SECRETS_NEXT_UPDATE: "9999999999999", // Far future timestamp to skip 1Password
    UNIT_TEST_PUBLIC: "public-value",
    UNIT_TEST_SECRET: "shh-not-public",
  };

  const result = await runShellCommand(
    testArgs,
    undefined,
    testEnv,
    true,
    true,
  );

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
  [],
  true, // AI-safe
);
