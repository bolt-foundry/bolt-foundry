#!/usr/bin/env -S deno run -A
import * as esbuild from "esbuild";
import { getLogger } from "packages/logger/logger.ts";
import { denoFileResolver } from "../appBuild/plugins/denoFileResolver.ts";
import { basename, dirname, join } from "@std/path";
import { parse } from "@std/jsonc";

const logger = getLogger(import.meta);
logger.setLevel(logger.levels.DEBUG);
const entryPoints = [
  "./packages/bolt-foundry/bolt-foundry.ts",
  "./packages/logger/logger.ts",
];

const outdir = "./dist";

const defaultOptions: esbuild.BuildOptions = {
  outdir,
  format: "esm",
  platform: "node",
  write: true,
  plugins: [
    denoFileResolver,
  ],
  entryPoints,
};

interface DenoJsoncConfig {
  imports?: Record<string, string>;
  name?: string;
  version?: string;
  exports?: Record<string, string>;
  // Add other fields as needed
}

/**
 * Load deno.jsonc for a package directory
 */

async function loadDenoJsonc(
  packageDir: string,
): Promise<DenoJsoncConfig | null> {
  const denoJsoncPath = join(packageDir, "deno.jsonc");

  try {
    const content = await Deno.readTextFile(denoJsoncPath);
    // Use the JSONC parser to properly handle comments
    return parse(content) as DenoJsoncConfig;
  } catch (error) {
    logger.info(
      `No deno.jsonc found for ${packageDir} or error parsing: ${error.message}`,
    );
    return null;
  }
}

/**
 * Process imports from deno.jsonc into package.json dependencies
 */
function processImports(
  imports: Record<string, string>,
): Record<string, string> {
  const dependencies: Record<string, string> = {};

  for (const [importName, importTarget] of Object.entries(imports)) {
    logger.debug(`Processing import: ${importName} -> ${importTarget}`);
    // JSR dependencies (jsr:@namespace/pkg)
    if (importTarget.startsWith("jsr:")) {
      const jsrImport = importTarget.substring(4); // Remove 'jsr:' prefix
      let packageName = "";
      let version = "";

      // Extract the package name and version
      const versionMatch = jsrImport.match(/^(.+?)@(.+)$/);
      if (versionMatch) {
        packageName = versionMatch[1];
        version = versionMatch[2];
      } else {
        packageName = jsrImport;
        version = "^0.0.0-dev.0"; // Default version if not specified
      }

      // Check if it's a bolt-foundry package
      if (packageName.startsWith("@bolt-foundry/")) {
        const subPackageName = packageName.replace("@bolt-foundry/", "");
        dependencies[importName] =
          `npm:@jsr/bolt-foundry__${subPackageName}@${version}`;
      } else {
        // Format as npm package from JSR
        const npmName = packageName.replace(/\//g, "__");
        dependencies[importName] = `npm:@jsr/${npmName}@${version}`;
      }
    } // npm dependencies (npm:package@version)
    else if (importTarget.startsWith("npm:")) {
      const npmImport = importTarget.substring(4); // Remove 'npm:' prefix
      const versionMatch = npmImport.match(/^(.+?)@(.+)$/);

      if (versionMatch) {
        dependencies[importName] = versionMatch[2];
      } else {
        dependencies[importName] = "latest"; // Default to latest if no version
      }
    }
    // Skip other import types (file imports, std libraries, etc.)
  }

  return dependencies;
}

/**
 * Generates a package.json file for the specified package
 * @param packagePath The path to the package entry point
 * @param options Optional configuration options
 */
async function generatePackageJson(
  packagePath: string,
  options: { skipNpmrc?: boolean } = {},
) {
  const packageDir = dirname(packagePath);
  const packageName = basename(packageDir);
  const outputDir = join("dist", packageName);

  try {
    // Create the output directory if it doesn't exist
    await Deno.mkdir(outputDir, { recursive: true });

    // Load default package.json template
    let packageJson: Record<string, unknown> = {
      name: `@bolt-foundry/${packageName}`,
      version: "0.1.0",
      description: `Bolt Foundry ${packageName} package`,
      main: `${packageName}.js`,
      module: `${packageName}.js`,
      types: `${packageName}.d.ts`,
      type: "module",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/your-org/bolt-foundry.git",
        directory: `packages/${packageName}`,
      },
      dependencies: {},
    };

    // Load deno.jsonc if exists
    const denoConfig = await loadDenoJsonc(packageDir);
    if (denoConfig) {
      logger.info(`Found deno.jsonc for ${packageName}`);

      // Override name and version if specified in deno.jsonc
      if (denoConfig.name) {
        packageJson.name = denoConfig.name;
      }

      if (denoConfig.version) {
        packageJson.version = denoConfig.version;
      }

      // Process imports into dependencies
      if (denoConfig.imports) {
        packageJson.dependencies = processImports(denoConfig.imports);
        logger.info(
          `Processed ${
            Object.keys(denoConfig.imports).length
          } imports for ${packageName}`,
        );
      }
    }

    // Try to read existing package.json if it exists
    try {
      const existingPackageJsonPath = join(packageDir, "package.json");
      const existingPackageJson = JSON.parse(
        await Deno.readTextFile(existingPackageJsonPath),
      );
      // Merge with our template, but keep dependencies we generated
      const mergedDependencies = {
        ...(existingPackageJson.dependencies || {}),
        ...(packageJson.dependencies as Record<string, string>),
      };
      // Keep the original name, version and other properties, but merge in our dependencies
      const mergedPackageJson = {
        ...packageJson,
        ...existingPackageJson,
        dependencies: mergedDependencies,
      };

      // Preserve the type: "module" setting which is crucial for ESM compatibility
      if (packageJson.type) {
        mergedPackageJson.type = packageJson.type;
      }

      packageJson = mergedPackageJson;
      logger.info(`Merged with existing package.json for ${packageName}`);
    } catch (error) {
      // No existing package.json, using generated one
      logger.info(
        `No existing package.json found for ${packageName}, using generated one`,
      );
    }

    // Write the package.json to the output directory
    const packageJsonPath = join(outputDir, "package.json");
    await Deno.writeTextFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
    );
    logger.info(
      `Generated package.json for ${packageName} at ${packageJsonPath}`,
    );

    // Create .npmrc file with JSR registry configuration (unless skipped)
    if (!options.skipNpmrc) {
      const npmrcPath = join(outputDir, ".npmrc");
      await Deno.writeTextFile(
        npmrcPath,
        "@jsr:registry=https://npm.jsr.io",
      );
      logger.info(`Generated .npmrc for ${packageName} at ${npmrcPath}`);
    } else {
      logger.info(`Skipped .npmrc generation for ${packageName} as requested`);
    }
  } catch (error) {
    logger.error(`Failed to generate package.json for ${packageName}:`, error);
  }
}

/**
 * Generates package.json files for all built packages
 * @param options Optional configuration options
 */
async function generatePackageJsonFiles(options: { skipNpmrc?: boolean } = {}) {
  logger.info("Generating package.json files...");
  for (const entryPoint of entryPoints) {
    await generatePackageJson(entryPoint, options);
  }
  logger.info("Package.json generation complete!");
}

/**
 * Validate all package imports to ensure they're properly configured
 */
async function validatePackageImports() {
  logger.info("Validating package imports...");

  for (const entryPoint of entryPoints) {
    const packageDir = dirname(entryPoint);
    const packageName = basename(packageDir);

    // Load deno.jsonc if it exists
    const denoConfig = await loadDenoJsonc(packageDir);
    if (!denoConfig) {
      logger.warn(
        `No deno.jsonc found for ${packageName}, skipping validation`,
      );
      continue;
    }

    // Check for proper imports configuration
    if (denoConfig.imports) {
      let hasErrors = false;

      for (
        const [importName, importTarget] of Object.entries(denoConfig.imports)
      ) {
        if (
          importName.startsWith("@bolt-foundry/") &&
          !importTarget.startsWith("jsr:@bolt-foundry/") &&
          !importTarget.includes("@jsr/bolt-foundry__")
        ) {
          logger.error(
            `${packageName}: Import ${importName} should be configured as JSR import in npm format`,
          );
          hasErrors = true;
        }
      }

      if (hasErrors) {
        logger.warn(
          `${packageName}: Some imports may not be properly configured for distribution`,
        );
      } else {
        logger.info(`${packageName}: All imports correctly configured`);
      }
    }
  }

  logger.info("Package imports validation complete!");
}

// Export these functions for testing
export {
  generatePackageJson,
  loadDenoJsonc,
  processImports,
  validatePackageImports,
};

export async function build(
  buildOptions: esbuild.BuildOptions = defaultOptions,
) {
  logger.info("Building...");

  // First validate the imports
  await validatePackageImports();

  const result = await esbuild.build({
    ...defaultOptions,
    ...buildOptions,
  });
  esbuild.stop();
  logger.info("Building complete!!!");
  return result;
}

if (import.meta.main) {
  try {
    await Deno.mkdir("build", { recursive: true });
    await Deno.mkdir("dist", { recursive: true });
  } catch (e) {
    if ((e as Error).name !== "AlreadyExists") {
      throw e;
    }
  }

  // Parse command line arguments
  const args = Deno.args;
  const skipNpmrc = args.includes("--skip-npmrc");

  if (skipNpmrc) {
    logger.info(
      "Running with --skip-npmrc: .npmrc files will not be generated",
    );
  }

  try {
    await build();
    await generatePackageJsonFiles({ skipNpmrc });
  } catch (e) {
    logger.error("Build failed:", e);
    throw e;
  }
}
