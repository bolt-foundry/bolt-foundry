import { assertEquals } from "@std/assert";
import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { exists } from "@std/fs/exists";

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
