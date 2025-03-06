# Phase 4: Advanced Features

## Overview

Building on the core implementation from Phases 1-3, this final phase introduces
advanced features to handle edge cases and provide comprehensive content
management capabilities. Following the "Worse is Better" philosophy, these
features are added last because they address less common scenarios and add
complexity that wasn't essential for the core functionality.

## Goals

- Implement symlink handling with loop detection and security measures
- Add content type detection based on file extensions and content analysis
- Handle binary files appropriately
- Add sorting and filtering options for content queries
- Implement file move/rename detection

## Referenced Files

- [packages/bfDb/models/BfContentCollection.ts](packages/bfDb/models/BfContentCollection.ts)
- [packages/bfDb/models/BfContentItem.ts](packages/bfDb/models/BfContentItem.ts)
- [packages/BfError.ts](packages/BfError.ts)
- [packages/logger.ts](packages/logger.ts)

## Implementation Approach

### Content Types Definition

```typescript
/**
 * Content type definitions
 */
export enum ContentType {
  MARKDOWN = "markdown",
  HTML = "html",
  JSON = "json",
  YAML = "yaml",
  TEXT = "text",
  BINARY = "binary",
  UNKNOWN = "unknown",
}

/**
 * Extended content item props
 */
export type BfContentItemProps = BfNodeBaseProps & {
  title: string;
  body: string;
  slug: string;
  filePath?: string;
  contentType?: string;
  binarySize?: number;
  binaryPath?: string;
  summary?: string;
  author?: string;
  cta?: string;
  href?: string;
};
```

### Symlink Handling

```typescript
/**
 * Process directory entries with symlink handling
 * 
 * @param cv Current viewer for permission context
 * @param dirPath Directory path to process
 * @param options Processing options
 * @param parentCollection Parent collection
 * @param cache Node cache
 * @param seenPaths Set of already processed paths (for loop detection)
 * @returns Created or updated collection
 */
private static async _processDirectoryWithSymlinks(
  cv: BfCurrentViewer,
  dirPath: string,
  options: {
    followSymlinks?: boolean;
    maxSymlinkDepth?: number;
    seenPaths?: Set<string>;
    symlinkDepth?: number;
    [key: string]: any;
  },
  parentCollection?: BfContentCollection,
  cache?: BfNodeCache,
  seenPaths: Set<string> = new Set()
): Promise<BfContentCollection>;
```

### Content Type Detection

```typescript
/**
 * Detects content type based on file extension and content
 *
 * @param filePath File path to analyze
 * @param content File content (if available)
 * @returns Detected content type
 */
export function detectContentType(
  filePath: string,
  content?: string,
): ContentType;

/**
 * Checks if a file is binary based on its content
 *
 * @param content File content or part of it
 * @returns True if content appears to be binary
 */
export function isBinaryContent(content: Uint8Array): boolean;
```

### Binary File Handling

```typescript
/**
 * Processes a file for content collection
 * 
 * @param cv Current viewer for permission context
 * @param collection Parent collection
 * @param filePath File path to process
 * @param options Processing options
 * @param cache Node cache
 */
private static async _processFile(
  cv: BfCurrentViewer,
  collection: BfContentCollection,
  filePath: string,
  options: {
    skipBinaryContent?: boolean;
    maxBinarySize?: number;
    [key: string]: any;
  },
  cache?: BfNodeCache
): Promise<BfContentItem | null>;
```

### Enhanced Query Options

```typescript
/**
 * Extended query options for content items
 */
export type ContentQueryOptions = {
  cache?: BfNodeCache;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
};

/**
 * Queries content items with enhanced sorting and filtering
 * 
 * @param cv Current viewer for permission context
 * @param recursive Whether to include items from child collections
 * @param options Query options for sorting and filtering
 * @returns Array of content items
 */
async queryContentItems(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: ContentQueryOptions = {}
): Promise<BfContentItem[]>;
```

### File Move/Rename Detection

```typescript
/**
 * Detects and processes file renames/moves
 * 
 * @param cv Current viewer for permission context
 * @param moveData Array of old path to new path mappings
 * @param options Additional options
 * @returns Array of updated collections
 */
static async detectFileRenames(
  cv: BfCurrentViewer,
  moveData: Array<{ oldPath: string; newPath: string }>,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentCollection[]>;
```

## GraphQL Integration

```typescript
// Extended GraphQL schema
extend type ContentCollection {
  // Enhanced query with filtering and sorting
  items(
    recursive: Boolean = false,
    filter: ContentItemFilter,
    sort: ContentItemSort,
    first: Int,
    after: String,
    last: Int,
    before: String
  ): ContentItemConnection!
  
  // Similar enhancement for child collections
  childCollections(
    recursive: Boolean = false,
    filter: ContentCollectionFilter,
    sort: ContentCollectionSort,
    first: Int,
    after: String,
    last: Int,
    before: String
  ): ContentCollectionConnection!
}

// Connection types for pagination
type ContentItemConnection {
  edges: [ContentItemEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

// Filter and sort inputs
input ContentItemFilter {
  contentType: [String!]
  title: String
  slug: String
  author: String
  # other filter fields
}

input ContentItemSort {
  field: ContentItemSortField!
  direction: SortDirection!
}
```

## Limitations of Phase 4

Even after implementing all four phases, some limitations remain that are out of
scope for the current implementation:

1. Limited optimization for extremely large directory structures with thousands
   of files
2. No advanced conflict resolution strategies for concurrent updates beyond
   last-write-wins
3. No distributed file system support for content spanning multiple servers
4. No integration with external version control systems
5. No custom access control beyond the current viewer permissions model
6. No support for specialized content transformations or renderers
7. No automated content validation or schema enforcement
8. Limited search capabilities without full-text indexing
9. No versioning system for content history
10. Performance may degrade with very deep directory hierarchies

These limitations could be addressed in future enhancements as needed.
