import { assert, assertEquals, assertExists, assertInstanceOf } from "@std/assert";
import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import { BfContentItem } from "packages/bfDb/models/BfContentItem.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { ensureDir, ensureFile } from "@std/fs";
import { join } from "@std/path";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);



/**
 * Tests for Phase 1: Basic Recursive Structure implementation
 */

// Helper function to create a temporary test folder with content
async function createTestFolderStructure(basePath: string): Promise<string> {
  // Ensure we're using an absolute path
  const absoluteBasePath = basePath.startsWith("/")
    ? basePath
    : join(Deno.cwd(), basePath);
  const testPath = join(absoluteBasePath, `test-folder-${Date.now()}`);

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
    logger.error(`Failed to clean up test folder:`, error);
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

// Updated tests for BfContentCollection.createFromFolder

Deno.test("BfContentCollection.createFromFolder - parent-child relationships", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const testFolderPath = await createTestFolderStructure("tmp");

  try {
    // Create a new BfNodeCache for this test to avoid interference
    const cache = new Map();

    // Create a root collection
    const rootCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {},
      undefined,
      cache,
    );

    // Get child collections using the role parameter correctly
    const childCollections = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      rootCollection.metadata.bfGid,
      {},
      { role: "child-collection" },
    );

    // Should have 2 child collections (subfolder1, subfolder2)
    assertEquals(
      childCollections.length,
      2,
      "Root collection should have 2 child collections",
    );

    // Get content items in the root collection
    const contentItems = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      rootCollection.metadata.bfGid,
      {},
      { role: "content-item" },
    );

    // Should have 1 content item (file1.md)
    assertEquals(
      contentItems.length,
      1,
      "Root collection should have 1 content item",
    );

    // Check if one of the child collections has a nested collection
    const subfolder2 = childCollections.find((collection) =>
      collection.props.name.toLowerCase() === "subfolder2"
    );

    assertExists(subfolder2, "Subfolder2 should exist");

    const nestedCollections = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      subfolder2.metadata.bfGid,
      {},
      { role: "child-collection" },
    );

    assertEquals(
      nestedCollections.length,
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
    // Create a new BfNodeCache for this test
    const limitedCache = new Map();

    // Test with maxDepth = 1 (only processes the root folder and immediate children)
    const limitedCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        maxDepth: 1,
      },
      undefined,
      limitedCache,
    );

    const limitedChildEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      limitedCollection.metadata.bfGid,
      {},
      { role: "child-collection" },
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
      {},
      { role: "child-collection" },
    );

    assertEquals(
      nestedCollectionEdges.length,
      0,
      "With maxDepth=1, subfolder2 should not have child collections",
    );

    // Create a separate cache for the full recursion test
    const fullCache = new Map();

    // Test full recursive processing
    const fullCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {},
      undefined,
      fullCache,
    );

    // Verify all levels of nesting are processed
    const rootChildEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentCollection,
      fullCollection.metadata.bfGid,
      {},
      { role: "child-collection" },
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
      {},
      { role: "child-collection" },
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

    // Create a separate cache for this test
    const cache = new Map();

    // Test with fileExts filter for markdown only
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        fileExts: [".md", ".mdx"],
      },
      undefined,
      cache,
    );

    // Get content items in the root collection
    const contentItemEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      {},
      { role: "content-item" },
    );

    // Should have 1 content item (file1.md) and not include non-markdown.txt
    assertEquals(contentItemEdges.length, 1, "Should only include .md files");

    // Test skipFiles option with a fresh cache
    const skipCache = new Map();
    const collectionWithSkip = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {
        skipFiles: ["file1.md"],
      },
      undefined,
      skipCache,
    );

    const contentItemEdgesWithSkip = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collectionWithSkip.metadata.bfGid,
      {},
      { role: "content-item" },
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
    // Create a separate cache for this test
    const cache = new Map();

    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      testFolderPath,
      {},
      undefined,
      cache,
    );

    // The ID should use file:// scheme
    const idString = collection.metadata.bfGid.toString();
    assert(
      idString.startsWith("file://") || idString.includes("file%3A%2F%2F"),
      "Collection ID should use file:// scheme",
    );

    // Get content items
    const contentItemEdges = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      {},
      { role: "content-item" },
    );

    assertEquals(
      contentItemEdges.length > 0,
      true,
      "Should have content items",
    );

    // Content item ID should also use file:// scheme
    const contentItem = contentItemEdges[0];
    const contentItemIdString = contentItem.metadata.bfGid.toString();
    assert(
      contentItemIdString.startsWith("file://") ||
        contentItemIdString.includes("file%3A%2F%2F"),
      "Content item ID should use file:// scheme",
    );
  } finally {
    await cleanupTestFolder(testFolderPath);
  }
});
