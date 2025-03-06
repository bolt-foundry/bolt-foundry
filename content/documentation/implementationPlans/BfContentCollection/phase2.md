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

## TDD Approach - Red Tests

First, we create failing tests that define the expected query behavior:

```typescript
Deno.test("BfContentCollection - queryContentItems with recursive flag", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create nested folder structure
    const subDir = `${tempDir}/subdir`;
    const nestedDir = `${subDir}/nesteddir`;
    await Deno.mkdir(subDir);
    await Deno.mkdir(nestedDir);
    await Deno.writeTextFile(`${tempDir}/root.md`, "# Root File");
    await Deno.writeTextFile(`${subDir}/sub.md`, "# Sub File");
    await Deno.writeTextFile(`${nestedDir}/nested.md`, "# Nested File");

    // Create collection from directory
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Test non-recursive query (should return only direct items)
    const directItems = await collection.queryContentItems(mockCv, false);
    assertEquals(directItems.length, 1);
    assertEquals(directItems[0].props.slug, "root");

    // Test recursive query (should return all items)
    const allItems = await collection.queryContentItems(mockCv, true);
    assertEquals(allItems.length, 3);

    // Verify all expected files are included
    const slugs = allItems.map((item) => item.props.slug);
    assert(slugs.includes("root"));
    assert(slugs.includes("sub"));
    assert(slugs.includes("nested"));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - queryChildCollections", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create nested folder structure
    const subDir1 = `${tempDir}/subdir1`;
    const subDir2 = `${tempDir}/subdir2`;
    const nestedDir = `${subDir1}/nesteddir`;
    await Deno.mkdir(subDir1);
    await Deno.mkdir(subDir2);
    await Deno.mkdir(nestedDir);

    // Create collection from directory
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Test direct child collections query
    const directChildren = await collection.queryChildCollections(
      mockCv,
      false,
    );
    assertEquals(directChildren.length, 2);

    // Test recursive child collections query
    const allChildren = await collection.queryChildCollections(mockCv, true);
    assertEquals(allChildren.length, 3);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - findParentCollection", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create nested folder structure
    const subDir = `${tempDir}/subdir`;
    await Deno.mkdir(subDir);

    // Create collection from directory
    const rootCollection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Get child collection
    const childCollections = await rootCollection.queryChildCollections(
      mockCv,
      false,
    );
    assertEquals(childCollections.length, 1);
    const childCollection = childCollections[0];

    // Test finding parent collection
    const parent = await childCollection.findParentCollection(mockCv);
    assertNotEquals(parent, null);
    assertEquals(parent?.metadata.bfGid, rootCollection.metadata.bfGid);

    // Test finding parent of root (should return null)
    const rootParent = await rootCollection.findParentCollection(mockCv);
    assertEquals(rootParent, null);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - getCollectionPath", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create nested folder structure
    const subDir = `${tempDir}/subdir`;
    const nestedDir = `${subDir}/nesteddir`;
    await Deno.mkdir(subDir);
    await Deno.mkdir(nestedDir);

    // Create collection from directory
    const rootCollection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Get nested child collection
    const childCollections = await rootCollection.queryChildCollections(
      mockCv,
      true,
    );
    assertEquals(childCollections.length, 2);

    // Find the most nested collection
    const nestedCollection = childCollections.find((c) =>
      c.props.slug === "nesteddir"
    );
    assertNotEquals(nestedCollection, undefined);

    // Test getting collection path
    const path = await nestedCollection!.getCollectionPath(mockCv);
    assertEquals(path.length, 3);
    assertEquals(path[0].metadata.bfGid, rootCollection.metadata.bfGid);
    assertEquals(
      path[path.length - 1].metadata.bfGid,
      nestedCollection!.metadata.bfGid,
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
```

## Implementation - Green Phase

Now we implement the query methods to make the tests pass:

### 1. Content Item Querying

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
): Promise<BfContentItem[]> {
  logger.debug(`Querying content items in collection ${this.metadata.bfGid}, recursive: ${recursive}`);

  // Get direct content items using standard BfEdge query methods
  const directItems = await BfEdge.queryTargetInstances(
    cv,
    BfContentItem,
    this.metadata.bfGid,
    { role: "contains" },
    options.cache
  );

  if (!recursive) {
    return directItems;
  }

  // For recursive query, get child collections and their items
  const childCollections = await this.queryChildCollections(cv, true, options);

  // Query items from each child collection in parallel
  const childItemArrays = await Promise.all(
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

  breadcrumbs: {
    type: "[Breadcrumb!]!",
    resolve: async (parent, args, ctx) => {
      const collection = await ctx.findX(BfContentCollection, parent.id);
      return collection.getBreadcrumbs(ctx);
    }
  }.map(collection => {
      return BfEdge.queryTargetInstances(
        cv,
        BfContentItem,
        collection.metadata.bfGid,
        { role: "contains" },
        options.cache
      );
    })
  );

  // Combine all items into a single array
  const allItems = [
    ...directItems,
    ...childItemArrays.flat()
  ];

  logger.debug(`Found ${allItems.length} total content items`);
  return allItems;
}
```

### 2. Child Collection Querying

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
): Promise<BfContentCollection[]> {
  logger.debug(`Querying child collections in ${this.metadata.bfGid}, recursive: ${recursive}`);

  // Get direct child collections using standard BfEdge query methods
  const directChildren = await BfEdge.queryTargetInstances(
    cv,
    BfContentCollection,
    this.metadata.bfGid,
    { role: "contains" },
    options.cache
  );

  if (!recursive) {
    return directChildren;
  }

  // For recursive query, get all descendants
  const descendants: BfContentCollection[] = [...directChildren];

  // Query each direct child's children recursively
  for (const child of directChildren) {
    const nestedChildren = await child.queryChildCollections(cv, true, options);
    descendants.push(...nestedChildren);
  }

  logger.debug(`Found ${descendants.length} total child collections`);
  return descendants;
}
```

### 3. Parent Collection Finding

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
): Promise<BfContentCollection | null> {
  logger.debug(`Finding parent collection for ${this.metadata.bfGid}`);

  // Find source nodes that are collections connected to this collection
  const sourceEdges = await BfEdge.querySourceEdges(
    cv,
    this.metadata.bfGid,
    { role: "contains" },
    options.cache
  );

  if (sourceEdges.length === 0) {
    logger.debug("No parent collection found, this appears to be a root collection");
    return null;
  }

  // Get the first parent collection (there should only be one in a tree structure)
  const parentId = sourceEdges[0].metadata.bfSid;
  const parent = await BfContentCollection.find(cv, parentId, options.cache);

  return parent;
}
```

### 4. Collection Path

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
): Promise<BfContentCollection[]> {
  logger.debug(`Getting collection path for ${this.metadata.bfGid}`);

  const path: BfContentCollection[] = [this];
  let current: BfContentCollection | null = this;

  // Traverse up the tree until we reach a root collection
  while (current) {
    const parent = await current.findParentCollection(cv, options);
    if (!parent) {
      break;
    }

    // Add parent to the beginning of the path
    path.unshift(parent);
    current = parent;
  }

  logger.debug(`Collection path length: ${path.length}`);
  return path;
}
```

### 5. Collection Breadcrumbs Helper

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
): Promise<Array<{ id: string; name: string; slug: string }>> {
  const path = await this.getCollectionPath(cv, options);

  return path.map(collection => ({
    id: collection.metadata.bfGid.toString(),
    name: collection.props.name,
    slug: collection.props.slug,
  }));
}
```

## Refactor Phase

Improve error handling and optimize cache usage:

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
): Promise<BfContentItem[]> {
  try {
    logger.debug(`Querying content items in collection ${this.props.name} (${this.metadata.bfGid}), recursive: ${recursive}`);

    // Create a cache if one wasn't provided
    const cache = options.cache || new BfNodeCache();
    const useProvidedCache = !!options.cache;

    // Get direct content items using standard BfEdge query methods
    const directItems = await BfEdge.queryTargetInstances(
      cv,
      BfContentItem,
      this.metadata.bfGid,
      { role: "contains" },
      cache
    );

    if (!recursive) {
      return directItems;
    }

    // For recursive query, get child collections and their items
    const childCollections = await this.queryChildCollections(cv, true, { cache });

    // Query items from each child collection in parallel
    const childItemArrays = await Promise.all(
      childCollections.map(collection => {
        return BfEdge.queryTargetInstances(
          cv,
          BfContentItem,
          collection.metadata.bfGid,
          { role: "contains" },
          cache
        );
      })
    );

    // Combine all items into a single array
    const allItems = [
      ...directItems,
      ...childItemArrays.flat()
    ];

    logger.debug(`Found ${allItems.length} total content items in collection ${this.props.name}`);
    return allItems;
  } catch (error) {
    logger.error(`Error querying content items for collection ${this.metadata.bfGid}:`, error);
    throw new BfError(`Failed to query content items: ${error.message}`, { cause: error });
  }
}
```

## Integration with GraphQL

Update the GraphQL resolvers to use the new query methods:

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

  childCollections
```
