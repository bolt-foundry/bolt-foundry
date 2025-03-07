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

## Implementation Approach

### Path Utilities for ID Management

```typescript
/**
 * Converts a file path to a BfGid with file:// scheme
 */
function pathToBfGid(filePath: string): BfGid;

/**
 * Extracts the file path from a file:// scheme BfGid
 */
function bfGidToPath(id: BfGid): string;
```

### Static Factory Method

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
): Promise<BfContentCollection>;
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
): Promise<void>;

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
): Promise<void>;
```

## Integration with Existing Code

### Replace scanContentDirectory Usage

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

1. No support for symlinks
2. Basic error handling without detailed reporting
3. No incremental update capability
4. No content type detection
5. No event notifications for content changes

These limitations are acceptable in Phase 1 following the "Worse is Better"
philosophy. We have a working implementation that correctly represents folder
hierarchy, and we'll add more sophisticated features in subsequent phases.
