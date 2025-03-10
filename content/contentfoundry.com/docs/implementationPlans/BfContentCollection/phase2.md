# Phase 2: Query Interface Enhancement

## Overview

Building on the basic recursive structure implemented in Phase 1, this phase
focuses on enhancing the query capabilities to efficiently navigate and explore
the hierarchical structure. Following the "Worse is Better" philosophy, we'll
implement only the essential query methods that provide real value for common
use cases.

## Goals

- Create utility functions for querying content items recursively
- Add methods to traverse up/down the content hierarchy
- Ensure proper cache usage for optimized performance
- Maintain the use of standard BfEdge methods as recommended in AGENT.md

## Referenced Files

- [packages/bfDb/models/BfContentCollection.ts](packages/bfDb/models/BfContentCollection.ts)
- [packages/bfDb/classes/NodeCache.ts](packages/bfDb/classes/NodeCache.ts)
- [packages/graphql/types/ContentCollection.ts](packages/graphql/types/ContentCollection.ts)

## Method Signatures

### Content Item Querying

```typescript
/**
 * Queries content items within this collection
 * 
 * @param cv Current viewer for permission context
 * @param recursive Whether to include items from child collections
 * @param options Additional query options
 * @returns Array of content items
 */
async queryContentItems(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentItem[]>;
```

### Child Collection Querying

```typescript
/**
 * Queries child collections within this collection
 * 
 * @param cv Current viewer for permission context
 * @param recursive Whether to include nested child collections
 * @param options Additional query options
 * @returns Array of child collections
 */
async queryChildCollections(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentCollection[]>;
```

### Parent Collection Finding

```typescript
/**
 * Finds the parent collection of this collection
 * 
 * @param cv Current viewer for permission context
 * @param options Additional query options
 * @returns Parent collection or null if this is a root collection
 */
async findParentCollection(
  cv: BfCurrentViewer,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentCollection | null>;
```

### Collection Path

```typescript
/**
 * Gets the complete path from root to this collection
 * 
 * @param cv Current viewer for permission context
 * @param options Additional query options
 * @returns Array of collections representing the path, ordered from root to this collection
 */
async getCollectionPath(
  cv: BfCurrentViewer,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentCollection[]>;
```

### Collection Breadcrumbs Helper

```typescript
/**
 * Gets collection breadcrumbs for UI navigation
 * 
 * @param cv Current viewer for permission context
 * @param options Additional query options
 * @returns Array of breadcrumb objects with id, name, and slug
 */
async getBreadcrumbs(
  cv: BfCurrentViewer,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<Array<{ id: string; name: string; slug: string }>>;
```

## Integration with GraphQL

```typescript
// In ContentCollection.ts GraphQL type definition
contentItems: {
  type: "[ContentItem!]!",
  args: {
    recursive: { type: "Boolean", defaultValue: false }
  },
  resolve: async (parent, args, ctx) => {
    const collection = await ctx.findX(BfContentCollection, parent.id);
    return collection.queryContentItems(ctx, args.recursive);
  }
},

childCollections: {
  type: "[ContentCollection!]!",
  args: {
    recursive: { type: "Boolean", defaultValue: false }
  },
  resolve: async (parent, args, ctx) => {
    const collection = await ctx.findX(BfContentCollection, parent.id);
    return collection.queryChildCollections(ctx, args.recursive);
  }
},

parentCollection: {
  type: "ContentCollection",
  resolve: async (parent, args, ctx) => {
    const collection = await ctx.findX(BfContentCollection, parent.id);
    return collection.findParentCollection(ctx);
  }
},

breadcrumbs: {
  type: "[Breadcrumb!]!",
  resolve: async (parent, args, ctx) => {
    const collection = await ctx.findX(BfContentCollection, parent.id);
    return collection.getBreadcrumbs(ctx);
  }
}
```

## Limitations of Phase 2

1. No file monitoring or automatic updates when content changes
2. No event notification system for content modifications
3. Limited handling of file system errors
4. No support for symlinks
5. No content type detection or special handling for different file types
6. No binary file handling
7. No handling of file moves/renames
8. Basic filtering and sorting capabilities only
9. No incremental update capability

These limitations will be addressed in Phase 3, which focuses on file monitoring
and incremental updates.
