#!/usr/bin/env -S deno run --allow-read --allow-write

import { join } from "@std/path";
import { parseArgs } from "@std/cli";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const args = parseArgs(Deno.args, {
  string: ["version"],
  boolean: ["help"],
});

if (args.help || !args.version) {
  logger.println("Usage: prepare-release.ts --version <version>");
  logger.println("Example: prepare-release.ts --version 1.0.0");
  Deno.exit(args.help ? 0 : 1);
}

const VERSION_FILE = join(import.meta.dirname!, "../version.ts");
const newVersion = args.version;

// Validate version format
if (!/^\d+\.\d+\.\d+(-\w+)?$/.test(newVersion)) {
  logger.printErr(
    "Invalid version format. Use semantic versioning (e.g., 1.0.0 or 1.0.0-beta)",
  );
  Deno.exit(1);
}

// Update version.ts
logger.println(`Updating version to ${newVersion}...`);

const versionContent = await Deno.readTextFile(VERSION_FILE);
const updatedContent = versionContent.replace(
  /VERSION = ".*"/,
  `VERSION = "${newVersion}"`,
);

await Deno.writeTextFile(VERSION_FILE, updatedContent);

logger.println("✅ Version updated successfully!");
logger.println("\nNext steps:");
logger.println("1. Commit the version change");
logger.println("2. Push to repository");
logger.println("3. Run the GitHub Actions workflow 'Publish aibff Release'");
logger.println(`4. Use version: ${newVersion}`);
