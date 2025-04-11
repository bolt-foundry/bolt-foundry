import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { parse } from "@std/jsonc";

const logger = getLogger(import.meta);

export async function testCommand(_options: string[]): Promise<number> {
  logger.info("Running tests...");

  const paths = ["apps", "infra", "lib", "packages", "util", "sites"];
  const pathsStrings = paths.map((path) => `${path}/**/*.test.ts`);
  const pathsStringsX = paths.map((path) => `${path}/**/*.test.tsx`);

  // Parse user-provided options for specific test files or patterns
  const userSpecifiedPaths: string[] = [];

  // Determine which paths to test
  const runnablePaths = userSpecifiedPaths.length > 0
    ? userSpecifiedPaths
    : [...pathsStrings, ...pathsStringsX];
  const testArgs = ["deno", "test", "-A", ...runnablePaths];

  // Initialize test command arguments
  const testArgs = ["deno", "test", "-A"];

  // Handle import map
  const testDenoConfig = "test_deno.jsonc";
  const mocksDenoConfig = "util/mocks/deno.jsonc";
  
  try {
    // Copy and merge deno.jsonc configurations
    logger.info("Preparing test config by merging deno.jsonc with mocks...");
    
    // Read the main deno.jsonc
    const denoJsoncText = await Deno.readTextFile("deno.jsonc");
    // Parse the JSON, handling comments
    const denoConfig = parse(denoJsoncText)

    // Read the mocks import map
    const mocksImportMapText = await Deno.readTextFile(mocksDenoConfig);
    const mocksImportMap = JSON.parse(mocksImportMapText);

    

    // Function to resolve relative paths in import maps
    const resolveRelativePaths = (
      imports: Record<string, string>,
      basePath: string,
    ): Record<string, string> => {
      const processed: Record<string, string> = {};

      for (const [key, value] of Object.entries(imports)) {
        // If the import path is relative (starts with "." or contains "./"), resolve it to an absolute path
        if (
          typeof value === "string" &&
          (value.startsWith("./") || value.startsWith("../"))
        ) {
          try {
            // Resolve the relative path
            const resolvedPath = new URL(value, `file://${basePath}/`).pathname;
            processed[key] = resolvedPath;
          } catch (error) {
            logger.warn(
              `Failed to resolve import path for ${key}: ${value}`,
              error,
            );
            processed[key] = value;
          }
        } else {
          processed[key] = value;
        }
      }

      return processed;
    };

    // Get the current working directory for resolving main config paths
    const workingDir = Deno.cwd();

    // Get the directory of the mocks import map for resolving mocks imports
    const mocksImportMapDir = `${workingDir}/util/mocks`;

    // Process both import maps to resolve relative paths
    const processedDenoImports = resolveRelativePaths(
      denoConfig.imports,
      workingDir,
    );
    
    const processedMocksImports = resolveRelativePaths(
      mocksImportMap.imports,
      mocksImportMapDir,
    );

    // Create the merged import map
    const mergedDenoJsonc = {
      ...denoConfig,
      imports: {
        ...processedDenoImports,
        ...processedMocksImports, // This will overwrite any duplicates with the resolved mocks version
      },
    };

    // Write the merged import map to the test config
    await Deno.writeTextFile(
      testDenoConfig,
      JSON.stringify(mergedDenoJsonc, null, 2),
    );
    
    logger.info(`Created merged config at ${testDenoConfig}`);
    
    // Add config to testArgs
    testArgs.push(`--config=${testDenoConfig}`);
    
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
  } finally {
    // Clean up the temporary config file
    // try {
    //   await Deno.remove(testDenoConfig);
    //   logger.info(`Cleaned up temporary config file ${testDenoConfig}`);
    // } catch (error) {
    //   logger.warn(`Failed to clean up ${testDenoConfig}: ${(error as Error).message}`);
    // }
  }
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
