# Implementation Plan: BfContentCollection Recursive Folder Scanning

## 1. Executive Summary

This implementation plan outlines an approach to enhancing the
`BfContentCollection` class with recursive folder scanning capabilities.
Following the "Worse is Better" philosophy, we'll create a hierarchical content
structure that accurately reflects filesystem organization using parent-child
relationships, prioritizing simplicity in implementation over completeness.

### Key Goals

- Create a direct mapping between filesystem structure and content hierarchy
- Use standard node relationships instead of a flat items array
- Optimize for performance with parallel processing
- Support efficient incremental updates
- Provide robust path and ID management

### Expected Benefits

- Accurate representation of content hierarchy
- Improved performance through parallel processing
- Better maintenance through direct filesystem mapping
- Enhanced discoverability through logical content organization
- Support for advanced features like symlink handling and incremental updates

## 2. Background and Current Limitations

Currently, `BfContentCollection` has a `scanContentDirectory` method that
performs a two-pass scan to identify directories and files, but it doesn't
create a proper hierarchical structure. The existing approach has several
limitations:

1. It doesn't properly handle nested folder structures with parent-child
   relationships
2. It doesn't use the built-in relationship capabilities of `BfNodeBase`
3. It doesn't support parallel processing for better performance with large
   directory structures
4. It maintains content in a flat `items` array, which doesn't accurately
   represent folder hierarchies

By implementing a recursive folder scanning approach, we can create a more
accurate representation of the content structure while leveraging relationship
features already built into the node system. Since backward compatibility is not
required, we can completely replace the existing implementation.

## 3. Technical Design

### 3.1 Architecture Overview

The implementation will follow the `BfNodeInMemory` pattern since
`BfContentCollection` already extends this class:

1. Add a new static method `createFromFolder` to `BfContentCollection` to fully
   replace the existing `scanContentDirectory` method
2. Implement recursive scanning that creates parent-child relationships using
   BfNodeBase's relationship capabilities
3. Process folders in parallel where appropriate for better performance
4. Remove dependencies on the legacy flat `items` array structure

### 3.2 Method Signature

```typescript
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
static createFromFolder(
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
    followSymlinks?: boolean;
    maxSymlinkDepth?: number;
  } = {},
  parentCollection?: BfContentCollection,
  cache?: BfNodeCache,
): Promise<BfContentCollection>
```

### 3.3 ID Management Strategy

We'll use the standard `file://` URI scheme with absolute paths for generating
BfGids:

- For collections (directories):
  `toBfGid(`file://${path.resolve(directoryPath)})`
- For items (files): `toBfGid(`file://${path.resolve(filePath)})`

This approach offers several advantages:

1. **Standard URI Scheme**: Uses the well-established `file://` protocol for
   local files
2. **Absolute Paths**: Ensures consistency regardless of working directory
3. **Direct Mapping**: Clear 1:1 mapping between filesystem paths and content
   IDs
4. **Cross-platform**: Works across different operating systems with proper path
   resolution
5. **Stability**: IDs remain stable as long as file paths don't change

### 3.4 Edge Relationship Model

The implementation will establish these relationships using standard BfEdge
methods:

- `BfContentCollection` (parent) → `BfContentItem` (child): Represents files
  within a folder
- `BfContentCollection` (parent) → `BfContentCollection` (child): Represents
  nested folders

Following AGENT.md guidance, we'll use standard `BfEdge` methods directly rather
than creating custom relationship methods in model classes:

```typescript
// Creating relationships (used in implementation)
await BfEdge.createBetweenNodes(cv, collection, item, "contains");

// Querying relationships (used in implementation)
const items = await BfEdge.queryTargetInstances(
  cv,
  BfContentItem,
  collection.metadata.bfGid,
  { role: "contains" },
);
```

## 4. Implementation Phases

Following the "Worse is Better" philosophy, we'll break implementation into four
phases, prioritizing simplicity in the initial phase and adding complexity only
as needed in later phases:

### 4.1 Phase 1: Basic Recursive Structure

**Goal:** Create the simplest implementation that correctly builds a
hierarchical structure representing folders and files.

**Key Tasks:**

- Implement the basic `createFromFolder` static method
- Create parent-child relationships using standard BfEdge methods
- Use the file:// URI scheme with absolute paths for stable identification
- Recursive processing of nested folders to maintain proper hierarchy

**Reference files:**

- [packages/bfDb/models/BfContentCollection.ts](packages/bfDb/models/BfContentCollection.ts)
- [packages/bfDb/models/BfContentItem.ts](packages/bfDb/models/BfContentItem.ts)
- [packages/bfDb/coreModels/BfNodeBase.ts](packages/bfDb/coreModels/BfNodeBase.ts)
- [packages/graphql/types/graphqlBfContentCollection.ts](packages/graphql/types/graphqlBfContentCollection.ts)

**GraphQL Integration:**

- Update the GraphQL ContentCollection type to expose the hierarchical structure
- Add a basic `items` field that returns direct content items
- Add a minimal `childCollections` field that returns direct child collections

```typescript
// GraphQL schema changes for Phase 1
extend type ContentCollection {
  // Get direct content items (non-recursive in Phase 1)
  items: [ContentItem!]!
  
  // Get direct child collections (non-recursive in Phase 1)
  childCollections: [ContentCollection!]!
}
```

**"Done" Criteria:**

- Can create a collection from a folder with the correct hierarchical structure
- Basic relationships between parent and child collections are established
- Files are correctly associated with their parent collections
- Tests for basic structures pass (empty folders, folders with files, nested
  folders)
- GraphQL queries for items and childCollections return correct results

**Testing Strategy:**

- Test empty folder handling (should create a collection with no items)
- Test folder with files only (should create a collection with items but no
  child collections)
- Test nested folder structure (should create a hierarchy of collections)
- Test file-to-collection relationships using BfEdge queries
- Test GraphQL queries for both items and childCollections fields

### 4.2 Phase 2: Query Interface Enhancement

**Goal:** Add efficient methods to navigate and query the hierarchical
structure.

**Key Tasks:**

- Implement utility functions for querying content recursively
- Add methods to traverse up/down the content hierarchy
- Ensure proper cache usage for performance optimization

**Reference files:**

- [packages/bfDb/classes/NodeCache.ts](packages/bfDb/classes/NodeCache.ts)
- [packages/graphql/types/graphqlBfContentCollection.ts](packages/graphql/types/graphqlBfContentCollection.ts)
- [packages/graphql/types/graphqlBfContentItem.ts](packages/graphql/types/graphqlBfContentItem.ts)

**Method Signatures (Key Interfaces):**

```typescript
// Query content items with optional recursion
async queryContentItems(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: { cache?: BfNodeCache } = {}
): Promise<BfContentItem[]>

// Query child collections with optional recursion
async queryChildCollections(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: { cache?: BfNodeCache } = {}
): Promise<BfContentCollection[]>

// Find the parent collection
async findParentCollection(
  cv: BfCurrentViewer,
  options: { cache?: BfNodeCache } = {}
): Promise<BfContentCollection | null>

// Get the complete path from root to this collection
async getCollectionPath(
  cv: BfCurrentViewer,
  options: { cache?: BfNodeCache } = {}
): Promise<BfContentCollection[]>
```

**GraphQL Integration:**

- Enhance the GraphQL schema to support recursive queries and traversal
- Add a recursive flag to existing items and childCollections fields
- Add parentCollection field to enable upward traversal
- Add breadcrumbs field for navigation UI support

```typescript
// GraphQL schema changes for Phase 2
extend type ContentCollection {
  // Enhanced to support recursion
  items(recursive: Boolean = false): [ContentItem!]!
  
  // Enhanced to support recursion
  childCollections(recursive: Boolean = false): [ContentCollection!]!
  
  // Added to support upward traversal
  parentCollection: ContentCollection
  
  // Added to support navigation UIs
  breadcrumbs: [Breadcrumb!]!
}

// New type for breadcrumb navigation
type Breadcrumb {
  id: ID!
  name: String!
  slug: String!
}
```

**"Done" Criteria:**

- All query methods are implemented and tested
- Recursive queries work correctly for both items and collections
- Traversal methods correctly navigate up and down the hierarchy
- Cache is properly utilized for performance optimization
- GraphQL resolvers are implemented for all new and enhanced fields

**Testing Strategy:**

- Test recursive content queries (should return all nested items)
- Test child collection queries (should return direct and/or nested collections)
- Test parent collection finding (should return the correct parent or null)
- Test collection path retrieval (should return the full path from root to
  collection)
- Test cache utilization (queries should use and update the cache correctly)
- Test GraphQL queries with and without recursive flag
- Test breadcrumbs GraphQL field returns correct hierarchy

### 4.3 Phase 3: File Monitoring and Incremental Updates

**Goal:** Add capability to efficiently update content when files change.

**Key Tasks:**

- Implement methods to update content based on file changes
- Create event-based notifications for content changes
- Add structured error handling and logging

**Reference files:**

- [packages/logger.ts](packages/logger.ts)
- [packages/BfError.ts](packages/BfError.ts)
- [packages/graphql/types/graphqlBfContentCollection.ts](packages/graphql/types/graphqlBfContentCollection.ts)
- [packages/graphql/subscriptions/contentChangeSubscription.ts](packages/graphql/subscriptions/contentChangeSubscription.ts)
  (new file)

**Interface Definitions:**

```typescript
// Event types for content changes
enum ContentEventType {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
  MOVED = "moved",
}

// Event interface for content changes
interface ContentEvent {
  type: ContentEventType;
  contentId: BfGid;
  path: string;
  collection?: BfContentCollection;
  item?: BfContentItem;
}

// Method for updating collections based on file changes
static updateFromFileChanges(
  cv: BfCurrentViewer,
  changedPaths: string[],
  options: { cache?: BfNodeCache } = {}
): Promise<BfContentCollection[]>

// Method for updating collections based on directory changes
static updateFromDirectoryChange(
  cv: BfCurrentViewer,
  dirPath: string,
  options: { cache?: BfNodeCache, isDeleted?: boolean } = {}
): Promise<BfContentCollection[]>
```

**GraphQL Integration:**

- Add mutation to trigger manual content updates
- Implement GraphQL subscription for content change notifications
- Add lastUpdated field to content items to track changes

```typescript
// GraphQL schema changes for Phase 3
extend type Mutation {
  // Manually trigger content refresh
  refreshContent(path: String!): Boolean!
  
  // Watch a specific directory for changes
  watchContentDirectory(path: String!): Boolean!
}

// New subscription type for content changes
type Subscription {
  contentChanged: ContentChangeEvent!
}

type ContentChangeEvent {
  type: String!  // "created", "updated", "deleted", "moved"
  id: ID!
  path: String!
  collectionId: ID
}

// Update ContentItem to show last update time
extend type ContentItem {
  lastUpdated: DateTime!
}
```

**"Done" Criteria:**

- Can detect and process file additions, modifications, and deletions
- Event notifications work correctly for all change types
- Updates are efficient, only changing affected parts of the structure
- Error handling properly manages common filesystem issues
- GraphQL subscriptions deliver real-time updates to clients
- Manual content refresh mutation works correctly

**Testing Strategy:**

- Test file addition (should create a new content item)
- Test file modification (should update the existing content item)
- Test file deletion (should remove the content item)
- Test event emission (should emit the correct events for each change)
- Test error handling (should gracefully handle common errors)
- Test GraphQL subscription receives proper notifications
- Test manual refresh mutation updates content correctly

### 4.4 Phase 4: Advanced Features

**Goal:** Add advanced features for edge cases and better content management.

**Key Tasks:**

- Implement symlink handling with loop detection
- Add content type detection based on file extensions
- Handle binary files appropriately
- Add sorting and filtering options for content queries

**Reference files:**

- Similar file systems implementations in the Content Foundry codebase
- [packages/graphql/types/graphqlBfContentCollection.ts](packages/graphql/types/graphqlBfContentCollection.ts)
- [packages/graphql/types/graphqlBfContentItem.ts](packages/graphql/types/graphqlBfContentItem.ts)

**Interface Enhancements:**

```typescript
// Content type enum for file type categorization
enum ContentType {
  MARKDOWN = "markdown",
  HTML = "html",
  JSON = "json",
  YAML = "yaml",
  TEXT = "text",
  BINARY = "binary",
  UNKNOWN = "unknown",
}

// Extended query options for content items
type ContentQueryOptions = {
  cache?: BfNodeCache;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
};

// Enhanced content items query method
async queryContentItems(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: ContentQueryOptions = {}
): Promise<BfContentItem[]>
```

**GraphQL Integration:**

- Add enhanced filtering and sorting capabilities to GraphQL queries
- Add contentType field to ContentItem type
- Add specialized fields for binary content handling
- Implement connection-based pagination for large collections

```typescript
// GraphQL schema changes for Phase 4
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

type ContentItemEdge {
  node: ContentItem!
  cursor: String!
}

type ContentCollectionConnection {
  edges: [ContentCollectionEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ContentCollectionEdge {
  node: ContentCollection!
  cursor: String!
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

enum ContentItemSortField {
  TITLE
  CREATED_AT
  UPDATED_AT
  SLUG
  # other sortable fields
}

enum SortDirection {
  ASC
  DESC
}

// Enhanced ContentItem type with content type and binary handling
extend type ContentItem {
  contentType: String!
  isBinary: Boolean!
  binarySize: Int
  binaryUrl: String
  mediaType: String
}
```

**"Done" Criteria:**

- Symlinks are handled correctly with loop detection
- Content types are properly detected for different file types
- Binary files are handled appropriately
- Query sorting and filtering works correctly
- Edge cases like broken symlinks and access permission issues are handled
  gracefully
- GraphQL schema supports advanced filtering, sorting, and pagination
- Connection-based pagination works for large collections

**Testing Strategy:**

- Test symlink handling (should follow symlinks when configured)
- Test symlink loop detection (should detect and avoid infinite loops)
- Test content type detection (should correctly identify various file types)
- Test binary file handling (should handle binary files appropriately)
- Test query sorting and filtering (should correctly sort and filter results)
- Test GraphQL filtering and sorting capabilities
- Test pagination with large collections
- Test binary file fields in GraphQL queries

## 5. Incremental Migration Strategy

### 5.1 Phased GraphQL Schema Evolution

Each phase in our implementation will have its own GraphQL schema changes,
allowing for incremental adoption:

1. **Phase 1**: Basic structure with direct item and collection relationships
2. **Phase 2**: Enhanced navigation with recursive queries and traversal
3. **Phase 3**: Real-time updates with mutations and subscriptions
4. **Phase 4**: Advanced filtering, sorting, and pagination

### 5.2 Replacing Existing Functionality

We'll gradually replace the existing `scanContentDirectory` functionality in a
controlled manner:

1. **During Phase 1**:
   - Implement `createFromFolder` alongside existing functionality
   - Add tests comparing results between old and new implementations
   - Maintain backward compatibility with existing code

2. **During Phase 2**:
   - Update GraphQL resolvers to use the new query methods
   - Add a feature flag to control which implementation is used
   - Begin migrating internal usage to new methods

3. **During Phase 3**:
   - Update `BfContentCollection.getCollectionsCache` to use `createFromFolder`
   - Add deprecation notice to `scanContentDirectory`
   - Ensure all direct calls to `scanContentDirectory` use the new methods

4. **After Phase 4**:
   - Remove the deprecated `scanContentDirectory` method
   - Clean up any remaining legacy code

### 5.3 Performance Considerations

The implementation will address performance in several ways:

1. **Parallel processing** of directories where appropriate
2. **Efficient caching** to avoid redundant operations
3. **Incremental updates** to avoid full rescans
4. **Batched database operations** to minimize overhead
5. **Connection-based pagination** for efficient handling of large collections

### 5.4 Rolling Out Features

To ensure a smooth rollout of each phase:

1. Each phase will be fully tested before merging to the main branch
2. Feature flags will control the availability of new functionality
3. Performance metrics will be collected to verify improvements
4. User feedback will be gathered and incorporated into subsequent phases

## 6. Testing Approach

### 6.1 Unit Tests

Each phase will include comprehensive unit tests:

1. Test initialization with various folder structures
2. Test relationship establishment between collections and items
3. Test query methods with various parameters
4. Test traversal methods (parent, children, path)
5. Test file change handling and event notifications
6. Test edge cases (symlinks, binary files, etc.)

### 6.2 Integration Tests

Integration tests will verify:

1. GraphQL schema integration works correctly
2. Performance with large directory structures
3. Interaction with other systems like GraphQL connections

### 6.3 Migration Tests

Specific tests will verify that the new implementation correctly replaces the
existing functionality:

1. Compare results from `scanContentDirectory` and `createFromFolder`
2. Verify all existing use cases continue to work with the new implementation

## 7. Risks and Mitigation

| Risk                                            | Impact | Mitigation                                                               |
| ----------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| Performance issues with large directories       | High   | Implement batched processing and pagination                              |
| Filesystem permission issues                    | Medium | Robust error handling with clear messages                                |
| Symlink loops causing infinite recursion        | High   | Implement loop detection and configurable depth limits                   |
| Binary file handling consuming excessive memory | Medium | Stream processing for large files and configurable size limits           |
| Cross-platform path handling issues             | Medium | Thorough testing on multiple platforms and consistent path normalization |

## 8. Conclusion

This implementation plan provides a clear path to enhancing
`BfContentCollection` with recursive folder scanning capabilities, following the
"Worse is Better" philosophy by prioritizing simplicity and incremental
improvement. By breaking the work into four distinct phases, we can deliver
value at each step while building toward a complete solution.

The approach leverages existing Content Foundry patterns and infrastructure,
particularly the standard BfEdge relationship methods, to create a clean,
maintainable implementation that accurately represents filesystem hierarchy in
the database model.
