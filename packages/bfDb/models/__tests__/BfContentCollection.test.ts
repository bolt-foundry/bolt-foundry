import { assertEquals, assertExists, assertInstanceOf } from "@std/assert";
import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import { BfContentItem } from "packages/bfDb/models/BfContentItem.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { exists } from "@std/fs/exists";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { ensureDir, ensureFile } from "@std/fs";
import { join } from "@std/path";

Deno.test("BfContentCollection - scanContentDirectory", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  // Get the collections cache
  const collectionsCache = await BfContentCollection.getCollectionsCache(
    mockCv,
  );

  // Verify we have collections
  assertEquals(
    collectionsCache.size > 0,
    true,
    "Should have at least one collection",
  );

  // Test finding a specific collection
  const marketingId = toBfGid("collection-content-marketing");
  const marketingCollection = collectionsCache.get(marketingId);

  if (await exists("content/marketing")) {
    assertEquals(
      marketingCollection !== undefined,
      true,
      "Marketing collection should exist if content/marketing directory exists",
    );

    if (marketingCollection) {
      assertEquals(
        marketingCollection.props.slug,
        "content/marketing",
        "Slug should match directory path",
      );
      assertEquals(
        marketingCollection.props.name,
        "Marketing",
        "Name should be capitalized",
      );
    }
  }
});

Deno.test("BfContentCollection - findX with short ID", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  // Test looking up by shortened ID
  const shortId = toBfGid("collection-marketing");
  const collection = await BfContentCollection.findX(mockCv, shortId);

  assertEquals(
    collection.props.slug,
    "content/marketing",
    "Should find collection with shortened ID",
  );
});

Deno.test("BfContentCollection - query", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  // Test querying all collections
  const collections = await BfContentCollection.query(mockCv);

  assertEquals(
    collections.length > 0,
    true,
    "Should return at least one collection",
  );

  // Verify all returned items are BfContentCollection instances
  for (const collection of collections) {
    assertEquals(
      collection instanceof BfContentCollection,
      true,
      "All returned items should be BfContentCollection instances",
    );
  }
});

/**
 * Tests for Phase 1: Basic Recursive Structure implementation
 */

// Helper function to create a temporary test folder with content
async function createTestFolderStructure(basePath: string): Promise<string> {
  const testPath = join(basePath, `test-folder-${Date.now()}`);

  // Create test directory structure
  await ensureDir(join(testPath, "subfolder1"));
  await ensureDir(join(testPath, "subfolder2/nested"));

  // Create test files
  await ensureFile(join(testPath, "file1.md"));
  await Deno.writeTextFile(
    join(testPath, "file1.md"),
    "# File 1\nContent for file 1",
  );

  await ensureFile(join(testPath, "subfolder1/file2.md"));
  await Deno.writeTextFile(
    join(testPath, "subfolder1/file2.md"),
    "# File 2\nContent for file 2",
  );

  await ensureFile(join(testPath, "subfolder2/file3.md"));
  await Deno.writeTextFile(
    join(testPath, "subfolder2/file3.md"),
    "# File 3\nContent for file 3",
  );

  await ensureFile(join(testPath, "subfolder2/nested/file4.md"));
  await Deno.writeTextFile(
    join(testPath, "subfolder2/nested/file4.md"),
    "# File 4\nContent for file 4",
  );

  return testPath;
}

// Clean up test folder
async function cleanupTestFolder(path: string): Promise<void> {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    console.error(`Failed to clean up test folder: ${error.message}`);
  }
}

Deno.test("BfContentCollection.createFromFolder - basic functionality", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const testFolderPath = await createTestFolderStructure("tmp");

  try {
    // Test that the static method exists and returns a BfContentCollection
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        name: "Test Collection",
        slug: "test-collection",
        description: "Test collection description",
      },
    );

    assertExists(collection, "createFromFolder should return a collection");
    assertInstanceOf(collection, BfContentCollection);
    assertEquals(collection.props.name, "Test Collection");
    assertEquals(collection.props.slug, "test-collection");
    assertEquals(collection.props.description, "Test collection description");

    // ID should be based on the file path
    assertExists(collection.metadata.bfGid);
  } finally {
    await cleanupTestFolder(testFolderPath);
  }
});

Deno.test("BfContentCollection.createFromFolder - parent-child relationships", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const testFolderPath = await createTestFolderStructure("tmp");

  try {
    // Create a root collection
    const rootCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
    );

    // Get child collections
    const childEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      rootCollection.metadata.bfGid,
      "child-collection",
    );

    // Should have 2 child collections (subfolder1, subfolder2)
    assertEquals(
      childEdges.length,
      2,
      "Root collection should have 2 child collections",
    );

    // Get content items in the root collection
    const contentItemEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      rootCollection.metadata.bfGid,
      "content-item",
    );

    // Should have 1 content item (file1.md)
    assertEquals(
      contentItemEdges.length,
      1,
      "Root collection should have 1 content item",
    );

    // Check if one of the child collections has a nested collection
    const subfolder2 = childEdges.find((collection) =>
      collection.props.name.toLowerCase() === "subfolder2"
    );

    assertExists(subfolder2, "Subfolder2 should exist");

    const nestedCollectionEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      subfolder2.metadata.bfGid,
      "child-collection",
    );

    assertEquals(
      nestedCollectionEdges.length,
      1,
      "Subfolder2 should have 1 nested collection",
    );
  } finally {
    await cleanupTestFolder(testFolderPath);
  }
});

Deno.test("BfContentCollection.createFromFolder - recursive processing", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const testFolderPath = await createTestFolderStructure("tmp");

  try {
    // Test with maxDepth = 1 (only processes the root folder and immediate children)
    const limitedCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        maxDepth: 1,
      },
    );

    const limitedChildEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      limitedCollection.metadata.bfGid,
      "child-collection",
    );

    // Should have 2 child collections (subfolder1, subfolder2)
    assertEquals(
      limitedChildEdges.length,
      2,
      "With maxDepth=1, should have 2 direct child collections",
    );

    // The subfolder2 collection should not have any child collections since maxDepth=1
    const subfolder2 = limitedChildEdges.find((collection) =>
      collection.props.name.toLowerCase() === "subfolder2"
    );

    assertExists(subfolder2, "Subfolder2 should exist");

    const nestedCollectionEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      subfolder2.metadata.bfGid,
      "child-collection",
    );

    assertEquals(
      nestedCollectionEdges.length,
      0,
      "With maxDepth=1, subfolder2 should not have child collections",
    );

    // Test full recursive processing
    const fullCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
    );

    // Verify all levels of nesting are processed
    const rootChildEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      fullCollection.metadata.bfGid,
      "child-collection",
    );

    assertEquals(
      rootChildEdges.length,
      2,
      "Root should have 2 child collections",
    );

    const fullSubfolder2 = rootChildEdges.find((collection) =>
      collection.props.name.toLowerCase() === "subfolder2"
    );

    assertExists(fullSubfolder2, "Subfolder2 should exist in full collection");

    const fullNestedCollectionEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      fullSubfolder2.metadata.bfGid,
      "child-collection",
    );

    assertEquals(
      fullNestedCollectionEdges.length,
      1,
      "With full recursion, subfolder2 should have a nested collection",
    );
  } finally {
    await cleanupTestFolder(testFolderPath);
  }
});

Deno.test("BfContentCollection.createFromFolder - file filtering", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const testFolderPath = await createTestFolderStructure("tmp");

  try {
    // Create a non-markdown file
    await ensureFile(join(testFolderPath, "non-markdown.txt"));
    await Deno.writeTextFile(
      join(testFolderPath, "non-markdown.txt"),
      "This is not a markdown file",
    );

    // Test with fileExts filter for markdown only
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        fileExts: [".md", ".mdx"],
      },
    );

    // Get content items in the root collection
    const contentItemEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      "content-item",
    );

    // Should have 1 content item (file1.md) and not include non-markdown.txt
    assertEquals(contentItemEdges.length, 1, "Should only include .md files");

    // Test skipFiles option
    const collectionWithSkip = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        skipFiles: ["file1.md"],
      },
    );

    const contentItemEdgesWithSkip = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collectionWithSkip.metadata.bfGid,
      "content-item",
    );

    // Should have 0 content items in root level since file1.md is skipped
    assertEquals(
      contentItemEdgesWithSkip.length,
      0,
      "Should skip the specified file",
    );
  } finally {
    await cleanupTestFolder(testFolderPath);
  }
});

Deno.test("BfContentCollection.createFromFolder - ID generation with file:// scheme", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const testFolderPath = await createTestFolderStructure("tmp");

  try {
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
    );

    // The ID should use file:// scheme
    const idString = collection.metadata.bfGid.toString();
    assertTrue(
      idString.startsWith("file://") || idString.includes("file%3A%2F%2F"),
      "Collection ID should use file:// scheme",
    );

    // Get content items
    const contentItemEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      "content-item",
    );

    assertEquals(
      contentItemEdges.length > 0,
      true,
      "Should have content items",
    );

    // Content item ID should also use file:// scheme
    const contentItem = contentItemEdges[0];
    const contentItemIdString = contentItem.metadata.bfGid.toString();
    assertTrue(
      contentItemIdString.startsWith("file://") ||
        contentItemIdString.includes("file%3A%2F%2F"),
      "Content item ID should use file:// scheme",
    );
  } finally {
    await cleanupTestFolder(testFolderPath);
  }
});

// Helper function for string assertion
function assertTrue(condition: boolean, message?: string): void {
  assertEquals(condition, true, message);
}
