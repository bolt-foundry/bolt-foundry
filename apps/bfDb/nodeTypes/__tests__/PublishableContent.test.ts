#! /usr/bin/env -S bff test
import { assertEquals, assertExists } from "@std/assert";
import { PublishableContent } from "../PublishableContent.ts";
import { join } from "@std/path";

// Create a concrete implementation for testing
class TestContent extends PublishableContent {
  protected static override get contentDirectory(): string {
    return "docs/test";
  }

  override get id(): string {
    return super.id;
  }
}

// Create another concrete implementation to test separate caching
class OtherTestContent extends PublishableContent {
  protected static override get contentDirectory(): string {
    return "docs/other";
  }

  override get id(): string {
    return super.id;
  }
}

// Setup test content
async function setupTestContent(dir: string) {
  await Deno.mkdir(join(dir, "docs", "test"), { recursive: true });
  await Deno.mkdir(join(dir, "docs", "other"), { recursive: true });

  // Create test content
  await Deno.writeTextFile(
    join(dir, "docs", "test", "test-doc.md"),
    "# Test Document\n\nTest content.",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "test", "another-doc.md"),
    "# Another Document\n\nMore content.",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "other", "other-doc.md"),
    "# Other Document\n\nOther content.",
  );
}

Deno.test("PublishableContent - separate caches for different subclasses", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestContent(tempDir);
    Deno.chdir(tempDir);

    // Load items from different subclasses
    const testDoc = await TestContent.findX("test-doc");
    const otherDoc = await OtherTestContent.findX("other-doc");

    assertEquals(testDoc.id, "test-doc");
    assertEquals(testDoc.content, "# Test Document\n\nTest content.");
    assertEquals(testDoc.__typename, "TestContent");

    assertEquals(otherDoc.id, "other-doc");
    assertEquals(otherDoc.content, "# Other Document\n\nOther content.");
    assertEquals(otherDoc.__typename, "OtherTestContent");

    // Verify they use separate caches
    const testCache = (TestContent as typeof TestContent & {
      getCache: () => Map<string, Promise<TestContent>>;
    }).getCache();
    const otherCache = (OtherTestContent as typeof OtherTestContent & {
      getCache: () => Map<string, Promise<OtherTestContent>>;
    }).getCache();

    assertExists(testCache.get("test-doc"));
    assertEquals(testCache.get("other-doc"), undefined);

    assertExists(otherCache.get("other-doc"));
    assertEquals(otherCache.get("test-doc"), undefined);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("PublishableContent.listAll() - works with concrete implementations", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestContent(tempDir);
    Deno.chdir(tempDir);

    const testItems = await TestContent.listAll();
    assertEquals(testItems.length, 2);
    assertEquals(testItems[0].id, "test-doc");
    assertEquals(testItems[1].id, "another-doc");

    const otherItems = await OtherTestContent.listAll();
    assertEquals(otherItems.length, 1);
    assertEquals(otherItems[0].id, "other-doc");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("PublishableContent.connection() - creates relay connections", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestContent(tempDir);
    Deno.chdir(tempDir);

    const items = await TestContent.listAll();
    const connection = await TestContent.connection(items, { first: 1 });

    assertEquals(connection.edges.length, 1);
    assertEquals(connection.edges[0].node.id, "test-doc");
    assertEquals(connection.pageInfo.hasNextPage, true);
    assertEquals(connection.pageInfo.hasPreviousPage, false);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
