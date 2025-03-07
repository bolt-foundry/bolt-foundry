import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { join } from "@std/path";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

/**
 * Initialize content collections from the content directory
 */
export async function initializeContentCollections(
  cv: BfCurrentViewer,
): Promise<void> {
  logger.info("Initializing content collections...");

  try {
    // Define the content directory paths to initialize
    const contentDirectories = ["blog", "documentation", "marketing"];

    // Initialize each content directory
    for (const dir of contentDirectories) {
      const dirPath = join(Deno.cwd(), "content", dir);

      logger.info(`Creating content collection from: ${dirPath}`);

      // Create the collection using the file path
      await BfContentCollection.createFromFolder(
        cv,
        dirPath,
        {
          name: dir.charAt(0).toUpperCase() + dir.slice(1),
          slug: dir,
          description: `${
            dir.charAt(0).toUpperCase() + dir.slice(1)
          } content collection`,
        },
      );

      logger.info(`Initialized content collection for: ${dir}`);
    }

    logger.info("Content collections initialized successfully");
  } catch (error) {
    logger.error("Error initializing content collections:", error);
    throw error;
  }
}
