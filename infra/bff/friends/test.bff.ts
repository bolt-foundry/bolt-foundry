import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function testCommand(options: string[]): Promise<number> {
  logger.info("Running tests...");

  let testArgs: string[] = ["deno", "test", "-A", "--no-check"];

  // If a specific path is provided, use that instead of the standard paths
  if (options.length > 0 && !options[0].startsWith("--")) {
    // First argument is a path
    const specificPath = options[0];
    testArgs.push(specificPath);

    // Remove the path from options
    options = options.slice(1);
  } else {
    // Use standard paths
    const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
    const pathsStrings = paths.map((path) => `${path}/**/*.test.ts`);
    const pathsStringsX = paths.map((path) => `${path}/**/*.test.tsx`);
    testArgs.push(...pathsStrings, ...pathsStringsX);
  }

  // Add remaining options/flags
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
