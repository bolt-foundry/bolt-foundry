import {
  assert,
  assertEquals,
  assertExists,
  assertInstanceOf,
} from "@std/assert";
import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import { BfContentItem } from "packages/bfDb/models/BfContentItem.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { ensureDir, ensureFile } from "@std/fs";
import { join } from "@std/path";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

/**
 * Helper function to create a temporary test file with content
 * This creates a test file in a temporary directory
 */
async function createTestFile(fileName: string, content: string): Promise<string> {
  // Create a unique test directory name
  const testDir = join("tmp", `test-content-${Date.now()}`);

  // Ensure the directory exists
  await ensureDir(testDir);

  // Create the file
  const filePath = join(testDir, fileName);
  await ensureFile(filePath);
  await Deno.writeTextFile(filePath, content);

  // Add a small delay to ensure the file is fully written
  await new Promise(resolve => setTimeout(resolve, 100));

  return testDir;
}

/**
 * Clean up test folder
 */
async function cleanupTestFolder(path: string): Promise<void> {
  try {
    // Wait a bit to ensure all file operations are complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    logger.error(`Failed to clean up test folder: ${path}`, error);
  }
}

Deno.test("BfContentItem - type definition and compatibility with BfContentCollection", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  // Create test content with frontmatter
  const content = `---
title: Test Content Item
author: Test Author
summary: This is a test summary
cta: Read more
---
# Test Content

This is the body of the test content.`;

  const testDir = await createTestFile("test-content.md", content);

  try {
    // Test creating a content item directly
    const contentItem = await BfContentItem.__DANGEROUS__createUnattached(
      mockCv,
      {
        title: "Test Content Item",
        body: "This is the body of the test content.",
        slug: "test-content-item",
        filePath: join(testDir, "test-content.md"),
        author: "Test Author",
        summary: "This is a test summary",
        cta: "Read more",
      },
    );

    // Verify the content item has the expected properties
    assertExists(contentItem);
    assertInstanceOf(contentItem, BfContentItem);
    assertEquals(contentItem.props.title, "Test Content Item");
    assertEquals(
      contentItem.props.body,
      "This is the body of the test content.",
    );
    assertEquals(contentItem.props.slug, "test-content-item");
    assertEquals(contentItem.props.author, "Test Author");
    assertEquals(contentItem.props.summary, "This is a test summary");
    assertEquals(contentItem.props.cta, "Read more");

    // Test creating a content collection and relating it to a content item
    const collection = await BfContentCollection.__DANGEROUS__createUnattached(
      mockCv,
      {
        name: "Test Collection",
        slug: "test-collection",
      },
    );

    // Create a relationship between the collection and content item
    // Ensure we use the correct role name - "content-item"
    await BfEdge.createBetweenNodes(
      mockCv,
      collection,
      contentItem,
      { role: "content-item" }, // Must match what's in BfContentCollection._createContentItem
    );

    // Query for content items in the collection
    const contentItems = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      {},
      { role: "content-item" }, // Must match the role above
    );

    // Verify the relationship works correctly
    assertEquals(contentItems.length, 1);
    assertEquals(contentItems[0].metadata.bfGid, contentItem.metadata.bfGid);
    assertEquals(contentItems[0].props.title, "Test Content Item");

    // Test with BfContentCollection.createFromFolder
    const testCollection = await BfContentCollection.createFromFolder(
      mockCv,
      testDir,
    );

    // Give time for file processing to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    // Query for content items in the collection created from folder
    const items = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      testCollection.metadata.bfGid,
      {},
      { role: "content-item" }, // Use the correct role name
    );

    // Verify content item was created correctly from file
    assertEquals(items.length, 1);
    assertEquals(items[0].props.title, "Test Content Item");
    assertEquals(items[0].props.author, "Test Author");
    assertEquals(items[0].props.summary, "This is a test summary");
    assert(items[0].props.body.includes("# Test Content"));
  } finally {
    await cleanupTestFolder(testDir);
  }
});

Deno.test("BfContentItem - frontmatter parsing", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  // Create test content with various frontmatter formats
  const contentWithFullFrontmatter = `---
title: Full Frontmatter
author: Test Author
summary: This is a test summary
cta: Read more
slug: custom-slug
---
Content with full frontmatter`;

  const contentWithPartialFrontmatter = `---
title: Partial Frontmatter
---
Content with partial frontmatter`;

  const contentWithoutFrontmatter = `Content without any frontmatter`;

  // Create the test directory
  const testDir = await createTestFile(
    "test1.md",
    contentWithFullFrontmatter,
  );

  try {
    // Create additional test files in the same directory
    await ensureFile(join(testDir, "test2.md"));
    await Deno.writeTextFile(
      join(testDir, "test2.md"),
      contentWithPartialFrontmatter,
    );

    await ensureFile(join(testDir, "test3.md"));
    await Deno.writeTextFile(
      join(testDir, "test3.md"),
      contentWithoutFrontmatter,
    );

    // Add a small delay to ensure all files are fully written
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Create collection from folder
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      testDir,
    );

    // Add a small delay to ensure all content processing is complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Query for content items
    const contentItems = await BfEdge.queryTargetInstances(
      mockCv,
      BfContentItem,
      collection.metadata.bfGid,
      {},
      { role: "content-item" }, // Use the correct role name
    );

    // Verify we have 3 content items
    assertEquals(contentItems.length, 3);

    // Test content with full frontmatter
    const fullItem = contentItems.find((item) =>
      item.props.title === "Full Frontmatter"
    );
    assertExists(
      fullItem,
      "Should have a content item with title 'Full Frontmatter'",
    );
    assertEquals(fullItem.props.author, "Test Author");
    assertEquals(fullItem.props.summary, "This is a test summary");
    assertEquals(fullItem.props.cta, "Read more");
    assertEquals(fullItem.props.slug, "custom-slug");
    assertEquals(fullItem.props.body.trim(), "Content with full frontmatter");

    // Test content with partial frontmatter
    const partialItem = contentItems.find((item) =>
      item.props.title === "Partial Frontmatter"
    );
    assertExists(
      partialItem,
      "Should have a content item with title 'Partial Frontmatter'",
    );
    assertEquals(partialItem.props.author, undefined);
    assertEquals(partialItem.props.summary, undefined);
    assertEquals(partialItem.props.slug, "partial-frontmatter");
    assertEquals(
      partialItem.props.body.trim(),
      "Content with partial frontmatter",
    );

    // Test content without frontmatter
    const noFrontmatterItem = contentItems.find((item) =>
      item.props.title === "test3"
    );
    assertExists(
      noFrontmatterItem,
      "Should have a content item with title 'test3'",
    );
    assertEquals(
      noFrontmatterItem.props.body.trim(),
      "Content without any frontmatter",
    );
    assertEquals(noFrontmatterItem.props.slug, "test3");
  } finally {
    await cleanupTestFolder(testDir);
  }
});