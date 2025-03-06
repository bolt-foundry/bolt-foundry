# Phase 1: Basic Recursive Structure

## Overview

This document details the first phase of implementing recursive folder scanning
for `BfContentCollection`. Following the "Worse is Better" philosophy, we focus
on creating the simplest implementation that correctly builds a hierarchical
structure representing folders and files.

## Goals

- Create a working implementation of the `createFromFolder` static method
- Establish proper parent-child relationships using standard BfEdge methods
- Use a consistent ID generation strategy with file:// URI scheme
- Recursively process nested folders to maintain proper hierarchy

## Referenced Files

- [packages/bfDb/models/BfContentCollection.ts](packages/bfDb/models/BfContentCollection.ts)
- [packages/bfDb/models/BfContentItem.ts](packages/bfDb/models/BfContentItem.ts)
- [packages/bfDb/coreModels/BfNodeBase.ts](packages/bfDb/coreModels/BfNodeBase.ts)

## TDD Approach - Red Tests

First, we create failing tests that define the expected behavior:

```typescript
// Tests for basic recursive folder scanning
Deno.test("BfContentCollection.createFromFolder - empty folder", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Verify collection was created
    assertEquals(collection instanceof BfContentCollection, true);

    // Verify no items in an empty folder
    const items = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      { role: "contains" },
    );
    assertEquals(items.length, 0);

    // Verify no child collections in an empty folder
    const childCollections = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      collection.metadata.bfGid,
      { role: "contains" },
    );
    assertEquals(childCollections.length, 0);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection.createFromFolder - folder with files", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create test files
    await Deno.writeTextFile(`${tempDir}/file1.md`, "# Test File 1");
    await Deno.writeTextFile(`${tempDir}/file2.md`, "# Test File 2");

    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Verify collection was created
    assertEquals(collection instanceof BfContentCollection, true);

    // Verify files were added as content items
    const items = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      { role: "contains" },
    );
    assertEquals(items.length, 2);

    // Verify item properties
    const fileNames = items.map((item) => item.props.slug);
    assert(fileNames.includes("file1"));
    assert(fileNames.includes("file2"));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection.createFromFolder - nested folders", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create nested folder structure
    const subDir = `${tempDir}/subdir`;
    await Deno.mkdir(subDir);
    await Deno.writeTextFile(`${tempDir}/file1.md`, "# Test File 1");
    await Deno.writeTextFile(`${subDir}/file2.md`, "# Test File 2");

    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Verify collection was created
    assertEquals(collection instanceof BfContentCollection, true);

    // Verify parent folder has one file and one child collection
    const items = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      { role: "contains" },
    );
    assertEquals(items.length, 1);

    const childCollections = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      collection.metadata.bfGid,
      { role: "contains" },
    );
    assertEquals(childCollections.length, 1);

    // Verify child collection has one file
    const childItems = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      childCollections[0].metadata.bfGid,
      { role: "contains" },
    );
    assertEquals(childItems.length, 1);
    assertEquals(childItems[0].props.slug, "file2");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
```

## Implementation - Green Phase

### Path Utilities for ID Management

First, we implement utility functions for consistent path-to-ID conversion:

```typescript
/**
 * Converts a file path to a BfGid with file:// scheme
 */
function pathToBfGid(filePath: string): BfGid {
  const absolutePath = path.resolve(filePath);
  return toBfGid(`file://${absolutePath}`);
}

/**
 * Extracts the file path from a file:// scheme BfGid
 */
function bfGidToPath(id: BfGid): string {
  const idStr = id.toString();
  if (!idStr.startsWith("file://")) {
    throw new Error(`Invalid file:// ID format: ${idStr}`);
  }
  return idStr.replace("file://", "");
}
```

### Static Factory Method

Next, we implement the core `createFromFolder` method:

```typescript
/**
 * Creates a BfContentCollection from a folder on disk, recursively processing
 * all nested folders and files
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
  // Verify folder exists
  try {
    const stat = await Deno.stat(folderPath);
    if (!stat.isDirectory) {
      throw new Error(`Path is not a directory: ${folderPath}`);
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Directory not found: ${folderPath}`);
    }
    throw error;
  }

  // Generate ID using the file:// scheme with absolute path
  const absolutePath = path.resolve(folderPath);
  const collectionId = pathToBfGid(absolutePath);

  // Create collection props with defaults based on folder path
  const name = options.name || path.basename(folderPath);
  const slug = options.slug || path.basename(folderPath);
  const description = options.description || `Content from ${folderPath}`;

  // Create the collection
  const collection = await this.__DANGEROUS__createUnattached(
    cv,
    {
      name,
      slug,
      description,
    },
    { bfGid: collectionId },
    cache
  );

  // If this is a child collection, create relationship with parent
  if (parentCollection) {
    await BfEdge.createBetweenNodes(
      cv,
      parentCollection,
      collection,
      "contains",
      undefined,
      cache
    );
  }

  // Process files in the directory
  await this._processDirectoryFiles(cv, collection, folderPath, options, cache);

  // Process subdirectories if maxDepth allows
  if (options.maxDepth === undefined || options.maxDepth > 0) {
    await this._processSubdirectories(cv, collection, folderPath, options, cache);
  }

  return collection;
}
```

### Helper Methods for File and Directory Processing

```typescript
/**
 * Process files in a directory and add them as content items
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
  try {
    // Read directory contents
    const entries = [];
    for await (const entry of Deno.readDir(dirPath)) {
      if (!entry.isDirectory) {
        entries.push(entry);
      }
    }

    // Filter files based on extensions and skip list
    const filteredEntries = entries.filter(entry => {
      const ext = path.extname(entry.name).toLowerCase();

      // Skip files in the skip list
      if (options.skipFiles?.includes(entry.name)) {
        return false;
      }

      // Filter by file extension if specified
      if (options.fileExts && options.fileExts.length > 0) {
        return options.fileExts.includes(ext);
      }

      return true;
    });

    // Process files in parallel
    await Promise.all(
      filteredEntries.map(async (entry) => {
        const filePath = path.join(dirPath, entry.name);

        try {
          // Read file content
          const fileContent = await Deno.readTextFile(filePath);

          // Create content item with a file:// scheme ID using absolute path
          const absolutePath = path.resolve(filePath);
          const itemId = pathToBfGid(absolutePath);

          // Get file name without extension for slug
          const slug = path.basename(entry.name, path.extname(entry.name));

          // Create the content item
          const contentItem = await BfContentItem.__DANGEROUS__createUnattached(
            cv,
            {
              title: slug, // Simple title based on filename
              body: fileContent,
              slug,
              filePath: absolutePath,
            },
            { bfGid: itemId },
            cache
          );

          // Create relationship between collection and item
          await BfEdge.createBetweenNodes(
            cv,
            collection,
            contentItem,
            "contains",
            undefined,
            cache
          );
        } catch (error) {
          // Log error but continue processing other files
          logger.error(`Error processing file ${filePath}:`, error);
        }
      })
    );
  } catch (error) {
    logger.error(`Error reading directory ${dirPath}:`, error);
    throw error;
  }
}

/**
 * Process subdirectories and create child collections
 */
private static async _processSubdirectories(
  cv: BfCurrentViewer,
  parentCollection: BfContentCollection,
  dirPath: string,
  options: {
    maxDepth?: number;
    skipFolders?: string[];
    [key: string]: any;
  },
  cache?: BfNodeCache,
): Promise<void> {
  try {
    // Read directory contents
    const entries = [];
    for await (const entry of Deno.readDir(dirPath)) {
      if (entry.isDirectory) {
        entries.push(entry);
      }
    }

    // Filter directories based on skip list
    const filteredEntries = entries.filter(entry => {
      return !options.skipFolders?.includes(entry.name);
    });

    // Calculate new max depth for recursive calls
    const newOptions = {
      ...options,
      maxDepth: options.maxDepth !== undefined ? options.maxDepth - 1 : undefined,
    };

    // Process subdirectories in parallel
    await Promise.all(
      filteredEntries.map(async (entry) => {
        const subdirPath = path.join(dirPath, entry.name);

        try {
          // Recursively process subdirectory
          await BfContentCollection.createFromFolder(
            cv,
            subdirPath,
            newOptions,
            parentCollection,
            cache
          );
        } catch (error) {
          // Log error but continue processing other directories
          logger.error(`Error processing subdirectory ${subdirPath}:`, error);
        }
      })
    );
  } catch (error) {
    logger.error(`Error reading directory ${dirPath}:`, error);
    throw error;
  }
}
```

## Refactor Phase

Ensure all methods use proper error handling with structured logging:

```typescript
/**
 * Process files in a directory and add them as content items
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
  try {
    logger.debug(`Processing files in directory: ${dirPath}`);

    // Implementation remains the same, but with improved logging
    // ...

    logger.debug(`Processed ${filteredEntries.length} files in directory: ${dirPath}`);
  } catch (error) {
    logger.error(`Error reading directory ${dirPath}:`, error);
    throw new BfError(
      `Failed to process directory files: ${error.message}`,
      { cause: error, dirPath }
    );
  }
}
```

## Integration with Existing Code

### Replace scanContentDirectory Usage

In the collection initialization code, replace `scanContentDirectory` with
`createFromFolder`:

```typescript
// Before:
const collection = await BfContentCollection.__DANGEROUS__createUnattached(
  cv,
  {
    name: "Content Collection",
    slug: "content",
    description: "Main content collection",
  },
);
await collection.scanContentDirectory("content/", {
  fileExts: [".md", ".mdx"],
});

// After:
const collection = await BfContentCollection.createFromFolder(
  cv,
  "content/",
  {
    name: "Content Collection",
    slug: "content",
    description: "Main content collection",
    fileExts: [".md", ".mdx"],
  },
);
```

## Limitations of Phase 1

This initial implementation has some limitations that will be addressed in later
phases:

1. No support for symlinks
2. Basic error handling without detailed reporting
3. No incremental update capability
4. No content type detection
5. No event notifications for content changes

These limitations are acceptable in Phase 1 following the "Worse is Better"
philosophy. We have a working implementation that correctly represents folder
hierarchy, and we'll add more sophisticated features in subsequent phases.
