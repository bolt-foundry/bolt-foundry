import { BfContentCollection } from "@bfmono/apps/bfDb/models/BfContentCollection.ts";
import type { BfCurrentViewer } from "@bfmono/apps/bfDb/classes/BfCurrentViewer.ts";
import { join } from "@std/path";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Initialize content collections from the content directory
 */
export async function initializeContentCollections(
  cv: BfCurrentViewer,
): Promise<void> {
  logger.debug("Initializing content collections...");

  try {
    // Define the base content directory path
    const contentBasePath = join(Deno.cwd(), "content");

    // Check if the content directory exists
    try {
      const contentDirInfo = await Deno.stat(contentBasePath);
      if (!contentDirInfo.isDirectory) {
        logger.warn(`Content directory not found at: ${contentBasePath}`);
        return;
      }
    } catch (error) {
      logger.warn(`Error accessing content directory: ${error}`);
      return;
    }

    // Scan the content directory for subdirectories
    const contentDirectories = [];
    for await (const entry of Deno.readDir(contentBasePath)) {
      if (entry.isDirectory) {
        contentDirectories.push(entry.name);
      }
    }

    if (contentDirectories.length === 0) {
      logger.warn("No content subdirectories found in the content directory");
      return;
    }

    // Initialize each content directory
    for (const dir of contentDirectories) {
      const dirPath = join(contentBasePath, dir);

      logger.debug(`Creating content collection from: ${dirPath}`);

      // Create the collection using the file path
      await BfContentCollection.createFromFolder(
        cv,
        dirPath,
        {
          name: dir.charAt(0).toUpperCase() + dir.slice(1),
          slug: dir,
          description: `${dir.charAt(0).toUpperCase() + dir.slice(1)}`,
        },
      );

      logger.debug(`Initialized content collection for: ${dir}`);
    }

    logger.debug("Content collections initialized successfully");
  } catch (error) {
    logger.error("Error initializing content collections:", error);
    throw error;
  }
}
