import { getLogger } from "packages/logger/logger.ts";
import { join } from "@std/path";

const logger = getLogger(import.meta);

/**
 * Merges the main Deno import map (from deno.jsonc) with the mocks import map
 * and writes the result to a temporary file for tests to use
 */
export async function mergeImportMaps(): Promise<string> {
  logger.info("Merging import maps for tests...");

  try {
    // Read the main deno.jsonc
    const denoJsoncText = await Deno.readTextFile("deno.jsonc");
    // Parse the JSON, handling comments
    const denoConfig = JSON.parse(
      denoJsoncText.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, ""),
    );

    // Read the mocks import map
    const mocksImportMapText = await Deno.readTextFile(
      "util/mocks/import_map.json",
    );
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
            const resolvedPath = new URL(value, `file://${basePath}`).pathname;
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
    const workingDir = Deno.cwd() + "/";

    // Get the directory of the import map file for mocks imports
    const importMapDir = new URL(".", import.meta.url).pathname;

    // Process both import maps to resolve relative paths
    const processedDenoImports = resolveRelativePaths(
      denoConfig.imports,
      workingDir,
    );
    const processedMocksImports = resolveRelativePaths(
      mocksImportMap.imports,
      importMapDir,
    );

    // Create a map of original imports accessible via @real/ prefix
    const realImportsMap: Record<string, string> = {};
    for (const [key, _value] of Object.entries(processedMocksImports)) {
      // Get the original import path from the main import map or use the original specifier
      // For imports like "posthog-node", we need to ensure there's a valid path
      const originalImport = processedDenoImports[key];
      if (originalImport) {
        realImportsMap[`@real/${key}`] = originalImport;
      } else {
        // If it's not in the main import map, check if it's an npm package or other URL
        if (key.startsWith("npm:") || key.startsWith("http")) {
          realImportsMap[`@real/${key}`] = key;
        } else {
          // For non-URL modules (like "posthog-node"), use npm: prefix as fallback
          realImportsMap[`@real/${key}`] = `npm:${key}`;
        }
      }
    }

    // Create the merged import map
    const mergedImportMap = {
      imports: {
        ...processedDenoImports,
        ...processedMocksImports, // This will overwrite any duplicates with the resolved mocks version
        ...realImportsMap, // Add @real/ prefixed imports pointing to original modules
      },
    };

    // Create a temporary directory for the import map
    const tempDir = await Deno.makeTempDir({ prefix: "import_map_" });

    // Write the merged import map to the temporary directory
    const outputPath = join(tempDir, "import_map_for_tests.json");
    await Deno.writeTextFile(
      outputPath,
      JSON.stringify(mergedImportMap, null, 2),
    );

    logger.info(`Merged import map written to ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error("Error merging import maps:", error);
    throw error;
  }
}
