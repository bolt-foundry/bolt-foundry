import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { genGqlTypesCommand } from "./genGqlTypes.bft.ts";
import { isoCommand } from "./iso.bft.ts";

const logger = getLogger(import.meta);

/**
 * Read the current content of a file
 */
async function readFileContent(filePath: string): Promise<string> {
  try {
    return await Deno.readTextFile(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return "";
    }
    throw error;
  }
}

/**
 * Get all generated files in the repository
 */
async function getGeneratedFiles(): Promise<Array<string>> {
  const generatedFiles: Array<string> = [];

  // Use walk to find all __generated__ files
  const { walk } = await import("jsr:@std/fs/walk");

  for await (
    const entry of walk(".", {
      match: [new RegExp("__generated__")],
      includeFiles: true,
      includeDirs: false,
    })
  ) {
    if (entry.isFile) {
      generatedFiles.push(entry.path);
    }
  }

  return generatedFiles;
}

/**
 * Compare two file contents and report differences
 */
function compareFiles(
  filePath: string,
  originalContent: string,
  newContent: string,
): boolean {
  if (originalContent === newContent) {
    return true;
  }

  logger.error(`❌ File ${filePath} is out of date`);

  // Show a brief diff summary
  const originalLines = originalContent.split("\n");
  const newLines = newContent.split("\n");
  const maxLines = Math.max(originalLines.length, newLines.length);

  let diffCount = 0;
  for (let i = 0; i < maxLines && diffCount < 5; i++) {
    const originalLine = originalLines[i] ?? "";
    const newLine = newLines[i] ?? "";

    if (originalLine !== newLine) {
      diffCount++;
      logger.error(`  Line ${i + 1}:`);
      logger.error(`    Current:  ${originalLine}`);
      logger.error(`    Expected: ${newLine}`);
    }
  }

  if (diffCount >= 5) {
    logger.error("  ... (more differences found)");
  }

  return false;
}

export async function verifyGeneratedCommand(
  _: Array<string>,
): Promise<number> {
  logger.info("Verifying generated files are up-to-date...");

  const tempDir = await Deno.makeTempDir({ prefix: "verify-generated-" });
  let allUpToDate = true;

  try {
    // Step 1: Get all generated files and create backups
    logger.info("Creating backups of generated files...");
    const generatedFiles = await getGeneratedFiles();
    const backups = new Map<string, string>();

    for (const filePath of generatedFiles) {
      try {
        const originalContent = await readFileContent(filePath);
        backups.set(filePath, originalContent);
      } catch (error) {
        logger.warn(`Could not read ${filePath}: ${error}`);
      }
    }

    logger.info(`Found ${backups.size} generated files to verify`);

    // Step 2: Run generation commands
    logger.info("Running GraphQL type generation...");
    const gqlResult = await genGqlTypesCommand([]);
    if (gqlResult !== 0) {
      logger.error("❌ GraphQL type generation failed during verification");
      return 1;
    }

    logger.info("Running Isograph compilation...");
    const isoResult = await isoCommand([]);
    if (isoResult !== 0) {
      logger.error("❌ Isograph compilation failed during verification");
      return 1;
    }

    // Step 3: Compare generated files with backups
    logger.info("Comparing generated files...");

    for (const [filePath, originalContent] of backups) {
      const newContent = await readFileContent(filePath);
      if (!compareFiles(filePath, originalContent, newContent)) {
        allUpToDate = false;
      }
    }

    // Step 4: Check for any new generated files that didn't exist before
    const newGeneratedFiles = await getGeneratedFiles();
    const newFiles = newGeneratedFiles.filter((path) => !backups.has(path));

    if (newFiles.length > 0) {
      logger.error(`❌ New generated files detected that weren't committed:`);
      for (const newFile of newFiles) {
        logger.error(`  ${newFile}`);
      }
      allUpToDate = false;
    }

    // Step 5: Restore original files if they were up to date
    if (allUpToDate) {
      logger.info("✅ All generated files are up-to-date");
    } else {
      logger.info("Restoring original files...");
      for (const [filePath, originalContent] of backups) {
        await Deno.writeTextFile(filePath, originalContent);
      }

      // Remove any new files that were created
      for (const newFile of newFiles) {
        try {
          await Deno.remove(newFile);
        } catch (error) {
          logger.warn(`Could not remove new file ${newFile}: ${error}`);
        }
      }

      logger.error(
        "❌ Some generated files are out of date. Run 'bft iso' and 'bft genGqlTypes' to update them.",
      );
    }

    return allUpToDate ? 0 : 1;
  } catch (error) {
    logger.error("❌ Failed to verify generated files:", error);
    return 1;
  } finally {
    // Clean up temp directory
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch (error) {
      logger.warn(`Could not clean up temp directory ${tempDir}: ${error}`);
    }
  }
}

export const bftDefinition = {
  description:
    "Verify that generated files are up-to-date without overwriting them",
  fn: verifyGeneratedCommand,
  aiSafe: true,
} satisfies TaskDefinition;
