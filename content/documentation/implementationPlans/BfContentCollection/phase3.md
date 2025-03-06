# Phase 3: File Monitoring and Incremental Updates

## Overview

Building on the hierarchical content structure and query capabilities
implemented in Phases 1 and 2, this phase introduces file monitoring and
incremental update capabilities. Instead of rescanning the entire content
structure when files change, we'll implement efficient methods to update only
the affected parts of the content hierarchy.

## Goals

- Create methods to update content based on file system changes
- Implement a file change detection system
- Create an event-based notification system for content changes
- Ensure proper error handling and logging for file operations

## Referenced Files

- [packages/bfDb/models/BfContentCollection.ts](packages/bfDb/models/BfContentCollection.ts)
- [packages/bfDb/models/BfContentItem.ts](packages/bfDb/models/BfContentItem.ts)
- [packages/logger.ts](packages/logger.ts)
- [packages/BfError.ts](packages/BfError.ts)

## TDD Approach - Red Tests

First, we create failing tests that define the expected behavior for file change
handling:

```typescript
Deno.test("BfContentCollection.updateFromFileChanges - add file", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create initial folder structure
    await Deno.writeTextFile(`${tempDir}/initial.md`, "# Initial File");

    // Create collection from directory
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Verify initial state
    const initialItems = await collection.queryContentItems(mockCv);
    assertEquals(initialItems.length, 1);

    // Add a new file
    const newFilePath = `${tempDir}/new.md`;
    await Deno.writeTextFile(newFilePath, "# New File");

    // Update collection based on changed file
    const updatedCollections = await BfContentCollection.updateFromFileChanges(
      mockCv,
      [newFilePath],
    );

    // Verify collection was updated
    assertEquals(updatedCollections.length, 1);
    assertEquals(
      updatedCollections[0].metadata.bfGid,
      collection.metadata.bfGid,
    );

    // Verify new file was added
    const updatedItems = await collection.queryContentItems(mockCv);
    assertEquals(updatedItems.length, 2);

    // Verify content of new item
    const newItem = updatedItems.find((item) => item.props.slug === "new");
    assertNotEquals(newItem, undefined);
    assertEquals(newItem?.props.body, "# New File");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection.updateFromFileChanges - modify file", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create initial file
    const filePath = `${tempDir}/file.md`;
    await Deno.writeTextFile(filePath, "# Original Content");

    // Create collection from directory
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Verify initial state
    const initialItems = await collection.queryContentItems(mockCv);
    assertEquals(initialItems.length, 1);
    assertEquals(initialItems[0].props.body, "# Original Content");

    // Modify the file
    await Deno.writeTextFile(filePath, "# Updated Content");

    // Update collection based on changed file
    const updatedCollections = await BfContentCollection.updateFromFileChanges(
      mockCv,
      [filePath],
    );

    // Verify collection was updated
    assertEquals(updatedCollections.length, 1);

    // Verify file content was updated
    const updatedItems = await collection.queryContentItems(mockCv);
    assertEquals(updatedItems.length, 1);
    assertEquals(updatedItems[0].props.body, "# Updated Content");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection.updateFromFileChanges - delete file", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create initial files
    const filePath1 = `${tempDir}/file1.md`;
    const filePath2 = `${tempDir}/file2.md`;
    await Deno.writeTextFile(filePath1, "# File 1");
    await Deno.writeTextFile(filePath2, "# File 2");

    // Create collection from directory
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Verify initial state
    const initialItems = await collection.queryContentItems(mockCv);
    assertEquals(initialItems.length, 2);

    // Delete one file
    await Deno.remove(filePath1);

    // Update collection based on deleted file
    const updatedCollections = await BfContentCollection.updateFromFileChanges(
      mockCv,
      [filePath1],
    );

    // Verify collection was updated
    assertEquals(updatedCollections.length, 1);

    // Verify file was removed
    const updatedItems = await collection.queryContentItems(mockCv);
    assertEquals(updatedItems.length, 1);
    assertEquals(updatedItems[0].props.slug, "file2");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("ContentEventEmitter - emits events for file changes", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create initial file
    const filePath = `${tempDir}/file.md`;
    await Deno.writeTextFile(filePath, "# Content");

    // Create collection from directory
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Listen for content events
    const events: ContentEvent[] = [];
    contentEvents.on(ContentEventType.CREATED, (event) => events.push(event));
    contentEvents.on(ContentEventType.UPDATED, (event) => events.push(event));
    contentEvents.on(ContentEventType.DELETED, (event) => events.push(event));

    // Add a new file
    const newFilePath = `${tempDir}/new.md`;
    await Deno.writeTextFile(newFilePath, "# New File");
    await BfContentCollection.updateFromFileChanges(mockCv, [newFilePath]);

    // Modify a file
    await Deno.writeTextFile(filePath, "# Updated Content");
    await BfContentCollection.updateFromFileChanges(mockCv, [filePath]);

    // Delete a file
    await Deno.remove(newFilePath);
    await BfContentCollection.updateFromFileChanges(mockCv, [newFilePath]);

    // Verify events were emitted
    assertEquals(events.length, 3);

    const createEvent = events.find((e) => e.type === ContentEventType.CREATED);
    const updateEvent = events.find((e) => e.type === ContentEventType.UPDATED);
    const deleteEvent = events.find((e) => e.type === ContentEventType.DELETED);

    assertNotEquals(createEvent, undefined);
    assertNotEquals(updateEvent, undefined);
    assertNotEquals(deleteEvent, undefined);

    assertEquals(createEvent?.path, newFilePath);
    assertEquals(updateEvent?.path, filePath);
    assertEquals(deleteEvent?.path, newFilePath);
  } finally {
    // Clean up event listeners
    contentEvents.removeAllListeners();
    await Deno.remove(tempDir, { recursive: true });
  }
});
```

## Implementation - Green Phase

First, let's implement the event system to notify subscribers when content
changes:

### 1. Content Event System

```typescript
/**
 * Content event types
 */
export enum ContentEventType {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
  MOVED = "moved",
}

/**
 * Content event interface
 */
export interface ContentEvent {
  type: ContentEventType;
  contentId: BfGid;
  path: string;
  collection?: BfContentCollection;
  item?: BfContentItem;
}

/**
 * Event emitter for content changes
 */
export class ContentEventEmitter {
  private listeners: Map<ContentEventType, Set<(event: ContentEvent) => void>> =
    new Map();

  /**
   * Register an event listener
   */
  on(
    eventType: ContentEventType,
    listener: (event: ContentEvent) => void,
  ): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
    logger.debug(`Added listener for ${eventType} events`);
  }

  /**
   * Remove an event listener
   */
  off(
    eventType: ContentEventType,
    listener: (event: ContentEvent) => void,
  ): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      logger.debug(`Removed listener for ${eventType} events`);
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  emit(event: ContentEvent): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      logger.debug(`Emitting ${event.type} event for ${event.path}`);
      for (const listener of listeners) {
        try {
          listener(event);
        } catch (error) {
          logger.error(`Error in content event listener:`, error);
        }
      }
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
    logger.debug("Removed all content event listeners");
  }
}

// Create singleton instance
export const contentEvents = new ContentEventEmitter();
```

### 2. File Change Update Method

```typescript
/**
 * Updates collections based on file changes
 * 
 * @param cv Current viewer for permission context
 * @param changedPaths Array of file paths that changed
 * @param options Additional options
 * @returns Array of updated collections
 */
static async updateFromFileChanges(
  cv: BfCurrentViewer,
  changedPaths: string[],
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentCollection[]> {
  logger.debug(`Updating collections for ${changedPaths.length} changed files`);

  const updatedCollections = new Set<BfContentCollection>();
  const cache = options.cache || new BfNodeCache();

  for (const changedPath of changedPaths) {
    try {
      const absolutePath = path.resolve(changedPath);
      const fileId = pathToBfGid(absolutePath);

      logger.debug(`Processing changed file: ${absolutePath}`);

      // Check if file exists
      const fileExists = await Deno.stat(absolutePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        // File was added or modified
        await this._handleFileAddedOrModified(cv, absolutePath, fileId, updatedCollections, cache);
      } else {
        // File was deleted
        await this._handleFileDeleted(cv, absolutePath, fileId, updatedCollections, cache);
      }
    } catch (error) {
      logger.error(`Error processing changed file ${changedPath}:`, error);
    }
  }

  logger.debug(`Updated ${updatedCollections.size} collections`);
  return Array.from(updatedCollections);
}

/**
 * Handles a file that was added or modified
 */
private static async _handleFileAddedOrModified(
  cv: BfCurrentViewer,
  filePath: string,
  fileId: BfGid,
  updatedCollections: Set<BfContentCollection>,
  cache: BfNodeCache
): Promise<void> {
  try {
    // Find parent directory
    const dirPath = path.dirname(filePath);
    const dirId = pathToBfGid(dirPath);

    // Find the collection for this directory
    const collection = await BfContentCollection.find(cv, dirId, cache);

    if (!collection) {
      logger.debug(`No collection found for directory: ${dirPath}`);
      return;
    }

    // Check if content item already exists
    const existingItem = await BfContentItem.find(cv, fileId, cache);

    if (existingItem) {
      // Update existing item
      logger.debug(`Updating existing content item: ${fileId}`);

      // Read updated file content
      const fileContent = await Deno.readTextFile(filePath);

      // Update item properties
      existingItem.props.body = fileContent;
      await existingItem.save();

      // Emit update event
      contentEvents.emit({
        type: ContentEventType.UPDATED,
        contentId: fileId,
        path: filePath,
        collection,
        item: existingItem,
      });
    } else {
      // Create new item
      logger.debug(`Creating new content item for: ${filePath}`);

      // Read file content
      const fileContent = await Deno.readTextFile(filePath);

      // Get file name without extension for slug
      const fileName = path.basename(filePath);
      const slug = path.basename(fileName, path.extname(fileName));

      // Create the content item
      const contentItem = await BfContentItem.__DANGEROUS__createUnattached(
        cv,
        {
          title: slug,
          body: fileContent,
          slug,
          filePath,
        },
        { bfGid: fileId },
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

      // Emit create event
      contentEvents.emit({
        type: ContentEventType.CREATED,
        contentId: fileId,
        path: filePath,
        collection,
        item: contentItem,
      });
    }

    updatedCollections.add(collection);
  } catch (error) {
    logger.error(`Error handling file add/modify for ${filePath}:`, error);
    throw new BfError(`Failed to handle file change: ${error.message}`, { cause: error });
  }
}

/**
 * Handles a file that was deleted
 */
private static async _handleFileDeleted(
  cv: BfCurrentViewer,
  filePath: string,
  fileId: BfGid,
  updatedCollections: Set<BfContentCollection>,
  cache: BfNodeCache
): Promise<void> {
  try {
    // Find content item
    const item = await BfContentItem.find(cv, fileId, cache);

    if (!item) {
      logger.debug(`No content item found for deleted file: ${filePath}`);
      return;
    }

    // Find parent collection through edges
    const sourceEdges = await BfEdge.querySourceEdges(cv, item.metadata.bfGid, { role: "contains" }, cache);

    if (sourceEdges.length === 0) {
      logger.debug(`No parent collection found for: ${filePath}`);
      return;
    }

    const parentId = sourceEdges[0].metadata.bfSid;
    const collection = await BfContentCollection.find(cv, parentId, cache);

    if (!collection) {
      logger.debug(`Failed to find parent collection with ID: ${parentId}`);
      return;
    }

    // Delete the edge between collection and item
    await BfEdge.deleteEdge(cv, sourceEdges[0].metadata.bfGid);

    // Delete the item
    await item.delete();

    // Emit delete event
    contentEvents.emit({
      type: ContentEventType.DELETED,
      contentId: fileId,
      path: filePath,
      collection,
    });

    updatedCollections.add(collection);
  } catch (error) {
    logger.error(`Error handling file deletion for ${filePath}:`, error);
    throw new BfError(`Failed to handle file deletion: ${error.message}`, { cause: error });
  }
}
```

### 3. Directory Change Method

```typescript
/**
 * Updates collections based on directory changes
 * 
 * @param cv Current viewer for permission context
 * @param dirPath Directory path that was added, modified, or deleted
 * @param options Additional options
 * @returns Updated collections
 */
static async updateFromDirectoryChange(
  cv: BfCurrentViewer,
  dirPath: string,
  options: {
    cache?: BfNodeCache;
    isDeleted?: boolean;
  } = {}
): Promise<BfContentCollection[]> {
  const absolutePath = path.resolve(dirPath);
  const dirId = pathToBfGid(absolutePath);
  const cache = options.cache || new BfNodeCache();

  logger.debug(`Processing directory change: ${absolutePath}`);

  // Check if directory exists (unless known to be deleted)
  const dirExists = options.isDeleted === true 
    ? false 
    : await Deno.stat(absolutePath).then(stat => stat.isDirectory).catch(() => false);

  if (dirExists) {
    // Directory was added or modified
    const parentDir = path.dirname(absolutePath);
    const parentId = pathToBfGid(parentDir);

    // Find parent collection
    const parentCollection = await BfContentCollection.find(cv, parentId, cache);

    if (!parentCollection) {
      logger.debug(`No parent collection found for: ${parentDir}`);
      return [];
    }

    // Check if collection already exists for this directory
    const existingCollection = await BfContentCollection.find(cv, dirId, cache);

    if (existingCollection) {
      // Directory already has a collection, scan for updates
      logger.debug(`Updating existing collection for: ${absolutePath}`);

      // Get all files in the directory
      const fileEntries = [];
      for await (const entry of Deno.readDir(absolutePath)) {
        if (!entry.isDirectory) {
          fileEntries.push(entry);
        }
      }

      // Update files
      const filePaths = fileEntries.map(entry => path.join(absolutePath, entry.name));
      return BfContentCollection.updateFromFileChanges(cv, filePaths, { cache });
    } else {
      // Create new collection for directory
      logger.debug(`Creating new collection for: ${absolutePath}`);

      // Create collection
      const collection = await BfContentCollection.createFromFolder(
        cv,
        absolutePath,
        {
          name: path.basename(absolutePath),
          slug: path.basename(absolutePath),
        },
        parentCollection,
        cache
      );

      return [collection];
    }
  } else {
    // Directory was deleted
    const collection = await BfContentCollection.find(cv, dirId, cache);

    if (!collection) {
      logger.debug(`No collection found for deleted directory: ${absolutePath}`);
      return [];
    }

    // Find parent collection
    const sourceEdges = await BfEdge.querySourceEdges(cv, collection.metadata.bfGid, { role: "contains" }, cache);
    const parentCollection = sourceEdges.length > 0
      ? await BfContentCollection.find(cv, sourceEdges[0].metadata.bfSid, cache)
      : null;

    // Delete the collection and all its content
    await this._deleteCollectionRecursive(cv, collection, cache);

    // Emit delete event
    contentEvents.emit({
      type: ContentEventType.DELETED,
      contentId: dirId,
      path: absolutePath,
      collection: parentCollection || undefined,
    });

    return parentCollection ? [parentCollection] : [];
  }
}

/**
 * Recursively deletes a collection and all its contents
 */
private static async _deleteCollectionRecursive(
  cv: BfCurrentViewer,
  collection: BfContentCollection,
  cache: BfNodeCache
): Promise<void> {
  logger.debug(`Recursively deleting collection: ${collection.metadata.bfGid}`);

  // Get child collections
  const childCollections = await collection.queryChildCollections(cv, false, { cache });

  // Delete each child collection recursively
  for (const childCollection of childCollections) {
    await this._deleteCollectionRecursive(cv, childCollection, cache);
  }

  // Get content items
  const contentItems = await collection.queryContentItems(cv, false, { cache });

  // Delete all content items
  for (const item of contentItems) {
    await item.delete();
  }

  // Delete all edges
  const edges = await BfEdge.querySourceEdges(cv, collection.metadata.bfGid, undefined, cache);
  for (const edge of edges) {
    await BfEdge.deleteEdge(cv, edge.metadata.bfGid);
  }

  // Delete the collection
  await collection.delete();
}
```

### 4. File System Watcher Integration

```typescript
/**
 * Sets up a watcher for file system changes
 * 
 * @param cv Current viewer for permission context
 * @param rootPath Root path to watch
 * @param options Additional options
 * @returns Function to stop watching
 */
static watchContentDirectory(
  cv: BfCurrentViewer,
  rootPath: string,
  options: {
    ignorePatterns?: RegExp[];
    debounceMs?: number;
  } = {}
): () => void {
  const absolutePath = path.resolve(rootPath);
  logger.info(`Starting content directory watcher for: ${absolutePath}`);

  // Default options
  const ignorePatterns = options.ignorePatterns || [/^\./];
  const debounceMs = options.debounceMs || 300;

  // Keep track of pending changes
  const pendingChanges = new Map<string, NodeJS.Timeout>();

  // Create watcher
  const watcher = Deno.watchFs(absolutePath);
  let active = true;

  // Process watcher events
  (async () => {
    for await (const event of watcher) {
      if (!active) break;

      // Skip ignored patterns
      if (event.paths.some(p => ignorePatterns.some(pattern => pattern.test(path.basename(p))))) {
        continue;
      }

      for (const pathStr of event.paths) {
        // Debounce changes for each path
        if (pendingChanges.has(pathStr)) {
          clearTimeout(pendingChanges.get(pathStr)!);
        }

        pendingChanges.set(pathStr, setTimeout(() => {
          pendingChanges.delete(pathStr);

          // Process the change
          this._processFileSystemChange(cv, pathStr, event.kind).catch(error => {
            logger.error(`Error processing file system change:`, error);
          });
        }, debounceMs));
      }
    }
  })();

  // Return function to stop watching
  return () => {
    active = false;
    watcher.close();

    // Clear any pending timeouts
    for (const timeout of pendingChanges.values()) {
      clearTimeout(timeout);
    }
    pendingChanges.clear();

    logger.info(`Stopped content directory watcher for: ${absolutePath}`);
  };
}

/**
 * Processes a file system change event
 */
private static async _processFileSystemChange(
  cv: BfCurrentViewer, 
  pathStr: string, 
  kind: Deno.FsEvent["kind"]
): Promise<void> {
  logger.debug(`Processing file system change for ${pathStr}: ${kind}`);

  try {
    const absolutePath = path.resolve(pathStr);

    // Check if path exists and is a directory or file
    const isDirectory = await Deno.stat(absolutePath)
      .then(stat => stat.isDirectory)
      .catch(() => {
        // Path doesn't exist, must have been deleted
        // Try to determine if it was a directory based on collection existence
        return BfContentCollection.find(cv, pathToBfGid(absolutePath))
          .then(collection => !!collection)
          .catch(() => false);
      });

    if (isDirectory) {
      // Handle directory change
      await this.updateFromDirectoryChange(cv, absolutePath, {
        isDeleted: kind === "remove",
      });
    } else {
      // Handle file change
      await this.updateFromFileChanges(cv, [absolutePath]);
    }
  } catch (error) {
    logger.error(`Error processing ${kind} for ${pathStr}:`, error);
  }
}
```

## Refactor Phase

Optimize the file change detection and handle edge cases:

```typescript
/**
 * Updates collections based on file changes
 */
static async updateFromFileChanges(
  cv: BfCurrentViewer,
  changedPaths: string[],
  options: {
    cache?: BfNodeCache;
    batchSize?: number;
  } = {}
): Promise<BfContentCollection[]> {
  logger.debug(`Updating collections for ${changedPaths.length} changed files`);

  const updatedCollections = new Set<BfContentCollection>();
  const cache = options.cache || new BfNodeCache();
  const batchSize = options.batchSize || 50;

  // Process files in batches to avoid memory issues with large changes
  for (let i = 0; i < changedPaths.length; i += batchSize) {
    const batch = changedPaths.slice(i, i + batchSize);

    await Promise.all(batch.map(async (changedPath) => {
      try {
        const absolutePath = path.resolve(changedPath);
        const fileId = pathToBfGid(absolutePath);

        logger.debug(`Processing changed file: ${absolutePath}`);

        // Check if file exists
        const fileExists = await Deno.stat(absolutePath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          // File was added or modified
          const collection = await this._handleFileAddedOrModified(cv, absolutePath, fileId, updatedCollections, cache);
          if (collection) updatedCollections.add(collection);
        } else {
          // File was deleted
          const collection = await this._handleFileDeleted(cv, absolutePath, fileId, updatedCollections, cache);
          if (collection) updatedCollections.add(collection);
        }
      } catch (error) {
        logger.error(`Error processing changed file ${changedPath}:`, error);
      }
    }));
  }

  logger.debug(`Updated ${updatedCollections.size} collections`);
  return Array.from(updatedCollections);
}
```

## Integration with BfContentCollection

Integrate the file monitoring capabilities with the content collection model:

```typescript
/**
 * Content collection extensions
 */
export class BfContentCollection extends BfNodeBase<BfContentCollectionProps> {
  // ... existing methods ...

  /**
   * Watches this collection's directory for changes
   *
   * @param cv Current viewer for permission context
   * @param options Additional options
   * @returns Function to stop watching
   */
  watchForChanges(
    cv: BfCurrentViewer,
    options: {
      ignorePatterns?: RegExp[];
      recursive?: boolean;
    } = {},
  ): () => void {
    // Get the directory path from the collection's file:// ID
    const collectionId = this.metadata.bfGid.toString();
    if (!collectionId.startsWith("file://")) {
      throw new BfError("Cannot watch collection without file:// ID scheme");
    }

    const directoryPath = collectionId.replace("file://", "");

    return BfContentCollection.watchContentDirectory(cv, directoryPath, {
      ignorePatterns: options.ignorePatterns,
      recursive: options.recursive,
    });
  }
}
```

## Limitations of Phase 3

While the implementation in Phase 3 provides a solid foundation for file
monitoring and incremental updates, there are still some limitations:

1. The file system watcher uses polling on some platforms, which may not be as
   efficient as native event-based notifications
2. There's no built-in conflict resolution for concurrent modifications
3. Limited support for symlinks and special file types
4. No handling of file moves/renames (treated as delete+add)
5. No content type detection

These limitations will be addressed in Phase 4, which focuses on advanced
features and edge cases.
