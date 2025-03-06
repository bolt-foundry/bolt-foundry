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

### 4.2 Phase 2: Query Interface Enhancement

**Goal:** Add efficient methods to navigate and query the hierarchical
structure.

**Key Tasks:**

- Implement utility functions for querying content recursively
- Add methods to traverse up/down the content hierarchy
- Ensure proper cache usage for performance optimization

**Reference files:**

- [packages/bfDb/classes/NodeCache.ts](packages/bfDb/classes/NodeCache.ts)
- [packages/graphql/types/ContentCollection.ts](packages/graphql/types/ContentCollection.ts)

### 4.3 Phase 3: File Monitoring and Incremental Updates

**Goal:** Add capability to efficiently update content when files change.

**Key Tasks:**

- Implement methods to update content based on file changes
- Create event-based notifications for content changes
- Add structured error handling and logging

**Reference files:**

- [packages/logger.ts](packages/logger.ts)
- [packages/BfError.ts](packages/BfError.ts)

### 4.4 Phase 4: Advanced Features

**Goal:** Add advanced features for edge cases and better content management.

**Key Tasks:**

- Implement symlink handling with loop detection
- Add content type detection based on file extensions
- Handle binary files appropriately
- Add sorting and filtering options for content queries

## 5. TDD Approach

Following the Red-Green-Refactor cycle for Test-Driven Development:

### 5.1 Red Phase

1. Write failing tests that define the expected behavior of the recursive folder
   scanning
2. Create tests for edge cases (empty folders, permission issues, etc.)
3. Commit these failing tests before implementing the functionality

### 5.2 Green Phase

1. Implement the minimal functionality to make the tests pass
2. Focus on simplicity over completeness (Worse is Better)
3. Use the standard relationship methods as outlined in AGENT.md

### 5.3 Refactor Phase

1. Clean up the implementation while ensuring tests still pass
2. Improve method interfaces and documentation
3. Ensure proper use of the `override` keyword for methods that override parent
   class methods

## 6. Integration Plan

### 6.1 Phase 1: Core Implementation

1. Implement the `createFromFolder` method in `BfContentCollection`
2. Add helper methods for file and directory filtering/processing
3. Add supporting methods for querying the hierarchical structure

### 6.2 Phase 2: Integration with Existing Code

1. Replace the existing `scanContentDirectory` method with `createFromFolder` in
   the collection initialization in `getCollectionsCache`
2. Update GraphQL resolvers to work with the new hierarchical structure
3. Remove any code related to the old flat `items` array structure

### 6.3 Phase 3: Updates to Frontend Components

1. Update the `ContentCollection` component to handle nested collections
2. Improve the UI to display hierarchical content collections

## 7. Testing Strategy

### 7.1 Unit Tests

- Test empty folder handling
- Test folder with only files
- Test folder with nested structure
- Test handling of various file types
- Test error cases (non-existent folder, etc.)
- Test path utilities for ID management

### 7.2 Integration Tests

- Test GraphQL queries against the new structure
- Test frontend component rendering the hierarchical structure
- Test event notification system when content changes

### 7.3 Performance Tests

- Test with deep folder hierarchies
- Test with large numbers of files
- Test parallel processing efficiency
- Test memory usage with large structures

## 8. Key Considerations and Challenges

1. **"Worse is Better" Approach**: Start with the simplest implementation that
   works correctly for the primary use case, then incrementally improve it.

2. **Standard Methods**: Follow AGENT.md guidance to use standard BfEdge methods
   directly rather than creating custom relationship methods.

3. **Error Handling**: Use structured logging with the logger module instead of
   console.log, avoiding JSON.stringify in debug messages.

4. **Method Overrides**: Explicitly use the `override` keyword when implementing
   methods from parent classes.

5. **Type Safety**: Ensure proper conversion between string paths and BfGid
   objects using toBfGid.

6. **Cross-platform Compatibility**: Handle path differences between operating
   systems, especially Windows backslashes vs. Unix forward slashes.

7. **Performance Considerations**: Monitor memory usage with large directory
   structures and implement batching if needed.

## 9. Detailed Design Documents (References to Standalone Documents)

Each phase has its own detailed design document:

1. [Phase 1: Basic Recursive Structure](content/implementation-plans/content-collection-recursive-scanning-phase1.md)
2. [Phase 2: Query Interface Enhancement](content/implementation-plans/content-collection-recursive-scanning-phase2.md)
3. [Phase 3: File Monitoring and Incremental Updates](content/implementation-plans/content-collection-recursive-scanning-phase3.md)
4. [Phase 4: Advanced Features](content/implementation-plans/content-collection-recursive-scanning-phase4.md)

These documents contain the detailed implementation specifics and code examples
for each phase.
