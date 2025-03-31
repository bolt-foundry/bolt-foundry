import { BfNodeInMemory } from "apps/bfDb/coreModels/BfNodeInMemory.ts";
import {
  BfContentItem,
  type BfContentItemProps,
} from "apps/bfDb/models/BfContentItem.ts";
import type { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import type { BfNodeCache } from "apps/bfDb/classes/BfNodeBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { basename, extname, join } from "@std/path";
import { pathToBfGid } from "apps/bfDb/utils/pathUtils.ts";
import { safeExtractFrontmatter } from "apps/bfDb/utils/contentUtils.ts";
import { BfEdge } from "apps/bfDb/coreModels/BfEdge.ts";

const logger = getLogger(import.meta);

/**
 * Properties for BfContentCollection
 */
export type BfContentCollectionProps = {
  name: string;
  slug: string;
  description?: string | null;
  filePath?: string | null;
};

/**
 * BfContentCollection: Represents a collection of content items organized in a hierarchy
 * This class provides recursive folder scanning capabilities to build content structures
 */
export class BfContentCollection
  extends BfNodeInMemory<BfContentCollectionProps> {
  /**
   * Creates a BfContentCollection from a folder on disk, recursively processing
   * all nested folders and files
   *
   * @param cv Current viewer for permission context
   * @param folderPath Path to the folder to scan
   * @param options Optional configuration options
   * @param parentCollection Optional parent collection for nesting
   * @param cache Optional node cache for better performance
   * @returns The created BfContentCollection
   */
  static async createFromFolder(
    cv: BfCurrentViewer,
    folderPath: string,
    options: {
      name?: string;
      slug?: string;
      description?: string;
      maxDepth?: number;
      fileExts?: string[];
      skipFolders?: string[];
      skipFiles?: string[];
    } = {},
    parentCollection?: BfContentCollection,
    cache?: BfNodeCache,
  ): Promise<BfContentCollection> {
    logger.debug(
      `Creating collection from folder: ${folderPath}`,
      options,
      Deno.cwd(),
    );

    // Generate an ID based on the folder path
    const bfGid = pathToBfGid(folderPath.replace(Deno.cwd(), "bf://"));

    // Create a name from the directory name if not provided
    const name = options.name || basename(folderPath);

    // Create a slug from the name if not provided
    const slug = options.slug || name.toLowerCase().replace(/\s+/g, "-");

    const description = options.description ?? null;

    // Create the collection
    const collection = await this.__DANGEROUS__createUnattached(
      cv,
      {
        name,
        slug,
        description,
        filePath: folderPath,
      },
      { bfGid },
      cache,
    );

    logger.debug(
      `Created collection: ${collection.metadata.bfGid} for ${folderPath}`,
    );

    // Process files in the directory
    await this._processDirectoryFiles(
      cv,
      collection,
      folderPath,
      {
        fileExts: options.fileExts,
        skipFiles: options.skipFiles,
      },
      cache,
    );

    // Process subdirectories if maxDepth allows
    const currentDepth = parentCollection ? 1 : 0;
    if (options.maxDepth === undefined || currentDepth < options.maxDepth) {
      await this._processSubdirectories(
        cv,
        collection,
        folderPath,
        {
          maxDepth: options.maxDepth,
          skipFolders: options.skipFolders,
          fileExts: options.fileExts,
          skipFiles: options.skipFiles,
        },
        cache,
      );
    }

    // Create edge relationship with parent if provided
    if (parentCollection) {
      await BfEdge.createBetweenNodes(
        cv,
        parentCollection,
        collection,
        { role: "child-collection" },
      );
    }

    return collection;
  }

  /**
   * Process files in a directory and add them as content items
   *
   * @param cv Current viewer for permission context
   * @param collection Parent collection to add items to
   * @param dirPath Directory path to process
   * @param options Processing options
   * @param cache Node cache
   */
  private static async _processDirectoryFiles(
    cv: BfCurrentViewer,
    collection: BfContentCollection,
    dirPath: string,
    options: {
      fileExts?: string[];
      skipFiles?: string[];
    },
    cache?: BfNodeCache,
  ): Promise<void> {
    logger.debug(`Processing files in directory: ${dirPath}`);

    try {
      // Read directory entries
      const entries = [];
      for await (const entry of Deno.readDir(dirPath)) {
        if (entry.isFile) {
          entries.push(entry);
        }
      }

      // Filter and process files
      for (const entry of entries) {
        const filePath = join(dirPath, entry.name);

        // Skip dotfiles (files starting with a dot)
        if (entry.name.startsWith(".")) {
          logger.debug(`Skipping dotfile: ${entry.name}`);
          continue;
        }

        // Skip files based on skipFiles option
        if (options.skipFiles && options.skipFiles.includes(entry.name)) {
          logger.debug(`Skipping file (in skipFiles list): ${entry.name}`);
          continue;
        }

        // Skip files not matching file extensions if specified
        if (options.fileExts && options.fileExts.length > 0) {
          const fileExt = extname(entry.name).toLowerCase();
          if (!options.fileExts.includes(fileExt)) {
            logger.debug(
              `Skipping file (extension not in fileExts): ${entry.name}`,
            );
            continue;
          }
        }

        // Create content item
        await this._createContentItem(cv, collection, filePath, cache);
      }
    } catch (error) {
      logger.error(`Error processing directory files: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Create a content item from a file
   *
   * @param cv Current viewer for permission context
   * @param collection Parent collection to add item to
   * @param filePath File path to process
   * @param cache Node cache
   * @returns Created content item
   */
  private static async _createContentItem(
    cv: BfCurrentViewer,
    collection: BfContentCollection,
    filePath: string,
    cache?: BfNodeCache,
  ): Promise<BfContentItem> {
    logger.debug(`Creating content item from file: ${filePath}`);

    try {
      // Read file content
      const fileContent = await Deno.readTextFile(filePath);

      // Extract frontmatter if present
      const { attrs, body } = safeExtractFrontmatter(fileContent);

      // Generate ID based on file path
      const bfGid = pathToBfGid(filePath);

      // Create content item properties
      const fileName = basename(filePath);
      const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

      const contentItemProps: BfContentItemProps = {
        // Use frontmatter title if available, otherwise use filename
        title: attrs.title || fileNameWithoutExt,
        body: body,
        // Use frontmatter slug if available, otherwise generate from title or filename
        slug: attrs.slug ||
          (attrs.title
            ? attrs.title.toLowerCase().replace(/\s+/g, "-")
            : fileNameWithoutExt.toLowerCase()),
        filePath: filePath,
        author: attrs.author,
        summary: attrs.summary,
        cta: attrs.cta,
      };

      // Create the content item
      const contentItem = await BfContentItem.__DANGEROUS__createUnattached(
        cv,
        contentItemProps,
        { bfGid },
        cache,
      );

      // Create edge relationship between collection and content item
      await BfEdge.createBetweenNodes(
        cv,
        collection,
        contentItem,
        { role: "content-item" },
      );

      logger.debug(
        `Created content item: ${contentItem.metadata.bfGid} for ${filePath}`,
      );

      return contentItem as BfContentItem;
    } catch (error) {
      logger.error(`Error creating content item for: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Process subdirectories and create child collections
   *
   * @param cv Current viewer for permission context
   * @param parentCollection Parent collection to add child collections to
   * @param dirPath Directory path to process
   * @param options Processing options
   * @param cache Node cache
   */
  private static async _processSubdirectories(
    cv: BfCurrentViewer,
    parentCollection: BfContentCollection,
    dirPath: string,
    options: {
      maxDepth?: number;
      skipFolders?: string[];
      fileExts?: string[];
      skipFiles?: string[];
    },
    cache?: BfNodeCache,
  ): Promise<void> {
    logger.debug(`Processing subdirectories in: ${dirPath}`);

    try {
      // Read directory entries
      const entries = [];
      for await (const entry of Deno.readDir(dirPath)) {
        if (entry.isDirectory) {
          entries.push(entry);
        }
      }

      // Process each subdirectory
      for (const entry of entries) {
        const subDirPath = join(dirPath, entry.name);

        // Skip dotfolders (directories starting with a dot)
        if (entry.name.startsWith(".")) {
          logger.debug(`Skipping dotfolder: ${entry.name}`);
          continue;
        }

        // Skip directories based on skipFolders option
        if (options.skipFolders && options.skipFolders.includes(entry.name)) {
          logger.debug(
            `Skipping directory (in skipFolders list): ${entry.name}`,
          );
          continue;
        }

        // Create a child collection recursively
        const nextDepth = options.maxDepth !== undefined
          ? options.maxDepth - 1
          : undefined;

        await this.createFromFolder(
          cv,
          subDirPath,
          {
            name: entry.name,
            slug: entry.name.toLowerCase().replace(/\s+/g, "-"),
            maxDepth: nextDepth,
            fileExts: options.fileExts,
            skipFiles: options.skipFiles,
            skipFolders: options.skipFolders,
          },
          parentCollection,
          cache,
        );
      }
    } catch (error) {
      logger.error(`Error processing subdirectories: ${dirPath}`, error);
      throw error;
    }
  }
  /**
   * Converts the content collection to a GraphQL representation
   */
  override toGraphql() {
    // Get the base GraphQL representation from parent
    const baseGraphql = super.toGraphql();

    // Add derived properties
    return {
      ...baseGraphql,
      // Add properties needed for GraphQL
      title: this.props.name,
      description: this.props.description || null,
      slug: this.props.slug,
      filePath: this.props.filePath || null,
    };
  }
}
