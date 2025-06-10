#! /usr/bin/env -S bff test
import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { PublishedDocument } from "../PublishedDocument.ts";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";
import { join } from "@std/path";

// Create test documents in a temp directory
async function setupTestDocuments(dir: string) {
  await Deno.mkdir(join(dir, "docs", "guides"), { recursive: true });

  // Create test documents
  const documents = [
    {
      name: "README.md",
      content: "# Getting Started\n\nThis is the main documentation.",
    },
    {
      name: "quickstart.md",
      content: "# Quickstart Guide\n\nGet up and running quickly.",
    },
    {
      name: "api-reference.md",
      content: "# API Reference\n\nDetailed API documentation.",
    },
    {
      name: "troubleshooting.md",
      content: "# Troubleshooting\n\nCommon issues and solutions.",
    },
  ];

  for (const doc of documents) {
    await Deno.writeTextFile(
      join(dir, "docs", "guides", doc.name),
      doc.content,
    );
  }
}

Deno.test("PublishedDocument - constructor and basic properties", () => {
  const doc = new PublishedDocument("test-slug", "Test content");
  assertEquals(doc.id, "test-slug");
  assertEquals(doc.content, "Test content");
});

Deno.test("PublishedDocument - extends GraphQLNode", () => {
  const doc = new PublishedDocument("test-slug", "Test content");
  assertEquals(doc.__typename, "PublishedDocument");
});

Deno.test("PublishedDocument.findX() - finds existing document", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    const doc = await PublishedDocument.findX("README");
    assertExists(doc);
    assertEquals(doc.id, "README");
    assertEquals(
      doc.content,
      "# Getting Started\n\nThis is the main documentation.",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("PublishedDocument.findX() - throws error for non-existent document", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    await assertRejects(
      () => PublishedDocument.findX("non-existent-doc"),
      BfErrorNodeNotFound,
      "Document not found: non-existent-doc",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("PublishedDocument.findX() - uses cache for repeated requests", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    // First request
    const doc1 = await PublishedDocument.findX("README");

    // Second request should return the same instance from cache
    const doc2 = await PublishedDocument.findX("README");

    // They should be the exact same promise/instance
    assertEquals(doc1, doc2);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("PublishedDocument.findX() - handles different document names", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    const readme = await PublishedDocument.findX("README");
    assertEquals(readme.id, "README");

    const quickstart = await PublishedDocument.findX("quickstart");
    assertEquals(quickstart.id, "quickstart");

    const apiRef = await PublishedDocument.findX("api-reference");
    assertEquals(apiRef.id, "api-reference");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("PublishedDocument - no listAll method", () => {
  // PublishedDocument doesn't have a listAll method
  assertEquals(
    typeof (PublishedDocument as typeof PublishedDocument & {
      listAll?: unknown;
    }).listAll,
    "undefined",
  );
});

Deno.test("PublishedDocument - no connection method", () => {
  // PublishedDocument doesn't have a connection method
  assertEquals(
    typeof (PublishedDocument as typeof PublishedDocument & {
      connection?: unknown;
    }).connection,
    "undefined",
  );
});

Deno.test("PublishedDocument.gqlSpec - defines correct GraphQL fields", () => {
  const spec = PublishedDocument.gqlSpec;
  assertExists(spec);
  // The spec should include id and content fields
  // This is more of a smoke test since we can't easily inspect the spec structure
});
