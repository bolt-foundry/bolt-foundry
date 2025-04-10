import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function testCommand(options: string[]): Promise<number> {
  logger.info("Running tests...");
  const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
  const pathsStrings = paths.map((path) => `${path}/**/*.test.ts`);
  const pathsStringsX = paths.map((path) => `${path}/**/*.test.tsx`);

  // Parse user-provided options for specific test files or patterns
  let userSpecifiedImportMap = "";
  const userSpecifiedPaths: string[] = [];

  for (let i = 0; i < options.length; i++) {
    if (options[i] === "--import-map" && i + 1 < options.length) {
      userSpecifiedImportMap = options[i + 1];
      i++; // Skip the next option which is the import map path
    } else {
      userSpecifiedPaths.push(options[i]);
    }
  }

  // Determine which paths to test
  const runnablePaths = userSpecifiedPaths.length > 0
    ? userSpecifiedPaths
    : [...pathsStrings, ...pathsStringsX];

  // Initialize test command arguments
  const testArgs = ["deno", "test", "-A"];

  // Handle import map
  let importMapPath: string;

  if (userSpecifiedImportMap) {
    // Use the user-specified import map if provided
    importMapPath = userSpecifiedImportMap;
    logger.info(`Using user-specified import map: ${importMapPath}`);
  } else {
    // Generate a merged import map
    try {
      const { mergeImportMaps } = await import(
        "util/mocks/merge-import-maps.ts"
      );
      importMapPath = await mergeImportMaps();
      logger.info(`Using merged import map: ${importMapPath}`);
    } catch (error) {
      logger.error("Failed to merge import maps:", error);
      importMapPath = "util/mocks/import_map.json";
      logger.warn(`Falling back to mocks-only import map: ${importMapPath}`);
    }
  }

  // Add import map to test arguments
  testArgs.push("--import-map", importMapPath);

  // Add the test paths
  testArgs.push(...runnablePaths);

  // Run the tests
  logger.info(`Running tests with command: ${testArgs.join(" ")}`);
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
