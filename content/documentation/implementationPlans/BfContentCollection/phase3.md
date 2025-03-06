# Phase 3: File Monitoring and Incremental Updates

## Overview

Building on the hierarchical content structure and query capabilities implemented in Phases 1 and 2, this phase introduces file monitoring and incremental update capabilities. Instead of rescanning the entire content structure when files change, we'll implement efficient methods to update only the affected parts of the content hierarchy.

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

## Implementation Approach

### Content Event System

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
  /**
   * Register an event listener
   */
  on(
    eventType: ContentEventType,
    listener: (event: ContentEvent) => void,
  ): void;

  /**
   * Remove an event listener
   */
  off(
    eventType: ContentEventType,
    listener: (event: ContentEvent) => void,
  ): void;

  /**
   * Emit an event to all registered listeners
   */
  emit(event: ContentEvent): void;

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void;
}

// Create singleton instance
export const contentEvents = new ContentEventEmitter();
```

### File Change Update Method

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
): Promise<BfContentCollection[]>;

/**
 * Handles a file that was added or modified
 */
private static async _handleFileAddedOrModified(
  cv: BfCurrentViewer,
  filePath: string,
  fileId: BfGid,
  updatedCollections: Set<BfContentCollection>,
  cache: BfNodeCache
): Promise<void>;

/**
 * Handles a file that was deleted
 */
private static async _handleFileDeleted(
  cv: BfCurrentViewer,
  filePath: string,
  fileId: BfGid,
  updatedCollections: Set<BfContentCollection>,
  cache: BfNodeCache
): Promise<void>;
```

### Directory Change Method

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
): Promise<BfContentCollection[]>;

/**
 * Recursively deletes a collection and all its contents
 */
private static async _deleteCollectionRecursive(
  cv: BfCurrentViewer,
  collection: BfContentCollection,
  cache: BfNodeCache
): Promise<void>;
```

### File System Watcher Integration

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
): () => void;

/**
 * Processes a file system change event
 */
private static async _processFileSystemChange(
  cv: BfCurrentViewer, 
  pathStr: string, 
  kind: Deno.FsEvent["kind"]
): Promise<void>;
```

### Optimized File Change Detection

```typescript
/**
 * Updates collections based on file changes with batch processing
 */
static async updateFromFileChanges(
  cv: BfCurrentViewer,
  changedPaths: string[],
  options: {
    cache?: BfNodeCache;
    batchSize?: number;
  } = {}
): Promise<BfContentCollection[]>;
```

### Content Collection Extension

```typescript
/**
 * Content collection extensions
 */
export class BfContentCollection extends BfNodeBase<BfContentCollectionProps> {
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
  ): () => void;
}
```

## Limitations of Phase 3

1. The file system watcher uses polling on some platforms, which may not be as efficient as native event-based notifications
2. There's no built-in conflict resolution for concurrent modifications
3. Limited support for symlinks and special file types
4. No handling of file moves/renames (treated as delete+add)
5. No content type detection

These limitations will be addressed in Phase 4, which focuses on advanced features and edge cases.