#! /usr/bin/env -S bff test
import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { Document } from "../Document.ts";
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

Deno.test("Document - extends PublishableContent", () => {
  const doc = new Document("test-slug", "Test content");
  assertEquals(doc.__typename, "Document");
  assertEquals(doc.id, "test-slug");
  assertEquals(doc.content, "Test content");
});

Deno.test("Document.findX() - finds existing document", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    const doc = await Document.findX("README");
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

Deno.test("Document.findX() - throws error for non-existent document", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    await assertRejects(
      () => Document.findX("non-existent-doc"),
      BfErrorNodeNotFound,
      "Document not found: non-existent-doc",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Document.listAll() - returns all documents", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    const docs = await Document.listAll();
    assertEquals(docs.length, 4);

    // Test ascending order
    const ascDocs = await Document.listAll("ASC");
    assertEquals(ascDocs.length, 4);
    // Verify alphabetical order (case-sensitive)
    assertEquals(ascDocs[0].id, "api-reference");
    assertEquals(ascDocs[1].id, "quickstart");
    assertEquals(ascDocs[2].id, "README");
    assertEquals(ascDocs[3].id, "troubleshooting");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Document.listAll() - supports descending order", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    const docs = await Document.listAll("DESC");
    assertEquals(docs.length, 4);

    // In descending order
    assertEquals(docs[0].id, "troubleshooting");
    assertEquals(docs[1].id, "README");
    assertEquals(docs[2].id, "quickstart");
    assertEquals(docs[3].id, "api-reference");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Document.connection() - creates relay connection", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestDocuments(tempDir);
    Deno.chdir(tempDir);

    const docs = await Document.listAll("ASC");
    const connection = await Document.connection(docs, { first: 2 });

    assertEquals(connection.edges.length, 2);
    assertEquals(connection.edges[0].node.id, "api-reference");
    assertEquals(connection.edges[1].node.id, "quickstart");
    assertEquals(connection.pageInfo.hasNextPage, true);
    assertEquals(connection.pageInfo.hasPreviousPage, false);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
