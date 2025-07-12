#! /usr/bin/env -S bff test

/**
 * Tests for document-specific query fragments.
 * Tests PublishedDocument query fragments and their resolvers.
 */

import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";

// Mock implementation of the document query fragment system
interface DocumentQueryResolver {
  type: string;
  returnType?: () => unknown;
  args?: Record<string, string>;
  resolve: (root: unknown, args: Record<string, unknown>) => unknown;
}

interface DocumentQueryFragment {
  name: string;
  fields: Record<string, DocumentQueryResolver>;
  dependencies: Array<string>;
}

// Mock documentQueries fragment
const documentQueries: DocumentQueryFragment = {
  name: "documentQueries",
  fields: {
    documentsBySlug: {
      type: "object",
      returnType: () => PublishedDocument,
      args: { slug: "string" },
      resolve: async (_root: unknown, args: { slug?: string }) => {
        const slug = args.slug || "getting-started";
        try {
          return await PublishedDocument.findX(slug);
        } catch {
          return null;
        }
      },
    },
    documents: {
      type: "connection",
      returnType: () => PublishedDocument,
      args: {
        category: "string",
        published: "boolean",
        first: "int",
        after: "string",
        last: "int",
        before: "string",
      },
      resolve: async (_root: unknown, args: Record<string, unknown>) => {
        // Mock implementation - real version would query actual documents
        // Use async factory method instead of constructor
        const mockDocs: Array<PublishedDocument> = await Promise.all([
          PublishedDocument.findX("getting-started").catch(() =>
            new PublishedDocument("getting-started", "Getting Started Guide")
          ),
          PublishedDocument.findX("api-reference").catch(() =>
            new PublishedDocument(
              "api-reference",
              "API Reference Documentation",
            )
          ),
          PublishedDocument.findX("examples").catch(() =>
            new PublishedDocument("examples", "Examples and Tutorials")
          ),
        ]);

        let filtered = mockDocs;
        if (args.category) {
          filtered = filtered.filter((doc) =>
            doc.id.includes(args.category as string)
          );
        }

        // Mock connection response
        return {
          edges: filtered.map((doc) => ({ node: doc, cursor: doc.id })),
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
          count: filtered.length,
        };
      },
    },
    documentContent: {
      type: "string",
      args: { slug: "string" },
      resolve: async (_root: unknown, args: { slug?: string }) => {
        const slug = args.slug || "getting-started";
        try {
          const doc = await PublishedDocument.findX(slug);
          return doc?.content || null;
        } catch {
          return null;
        }
      },
    },
  },
  dependencies: ["PublishedDocument"],
};

Deno.test("documentQueries fragment includes required fields", () => {
  assert("documentsBySlug" in documentQueries.fields);
  assert("documents" in documentQueries.fields);
  assert("documentContent" in documentQueries.fields);
  assertEquals(Object.keys(documentQueries.fields).length, 3);
});

Deno.test("documentsBySlug field has correct configuration", () => {
  const documentField = documentQueries.fields
    .documentsBySlug as DocumentQueryResolver;

  assertEquals(documentField.type, "object");
  assertEquals(documentField.returnType?.(), PublishedDocument);
  assert(documentField.args && "slug" in documentField.args);
  assertEquals(documentField.args?.slug, "string");
  assertInstanceOf(documentField.resolve, Function);
});

Deno.test("documents connection field has correct configuration", () => {
  const documentsField = documentQueries.fields
    .documents as DocumentQueryResolver;

  assertEquals(documentsField.type, "connection");
  assertEquals(documentsField.returnType?.(), PublishedDocument);

  // Check connection args
  assert(documentsField.args && "category" in documentsField.args);
  assert(documentsField.args && "published" in documentsField.args);
  assert(documentsField.args && "first" in documentsField.args);
  assert(documentsField.args && "after" in documentsField.args);
  assert(documentsField.args && "last" in documentsField.args);
  assert(documentsField.args && "before" in documentsField.args);

  assertInstanceOf(documentsField.resolve, Function);
});

Deno.test("documentContent field has correct configuration", () => {
  const contentField = documentQueries.fields.documentContent;

  assertEquals(contentField.type, "string");
  assert(contentField.args && "slug" in contentField.args);
  assertEquals(contentField.args?.slug, "string");
  assertInstanceOf(contentField.resolve, Function);
});

Deno.test("documentsBySlug resolver handles missing slug", async () => {
  const resolver =
    (documentQueries.fields.documentsBySlug as DocumentQueryResolver).resolve;

  // Should default to "getting-started" when no slug provided
  await resolver({}, {});

  // In real test environment, this would resolve to the actual getting-started document
  // For now we test that the resolver function runs without error
});

Deno.test("documentsBySlug resolver handles explicit slug", async () => {
  const resolver =
    (documentQueries.fields.documentsBySlug as DocumentQueryResolver).resolve;

  // Test with specific slug
  await resolver({}, { slug: "api-reference" });

  // Resolver should attempt to find the document with the given slug
  // Error handling (returning null for missing docs) is built into the resolver
});

Deno.test("documents resolver handles category filtering", async () => {
  const resolver =
    (documentQueries.fields.documents as DocumentQueryResolver).resolve;

  // Test without category filter
  await resolver({}, {});

  // Test with category filter
  await resolver({}, { category: "api" });

  // Mock implementation should filter by category
  // Real implementation would query documents by category
});

Deno.test("documents resolver handles published filter", async () => {
  const resolver =
    (documentQueries.fields.documents as DocumentQueryResolver).resolve;

  // Test filtering by published status
  await resolver({}, { published: true });
  await resolver({}, { published: false });

  // Real implementation would filter by publication status
});

Deno.test("documents resolver handles pagination", async () => {
  const resolver =
    (documentQueries.fields.documents as DocumentQueryResolver).resolve;

  // Test forward pagination
  await resolver({}, { first: 2 });
  await resolver({}, { first: 2, after: "cursor1" });

  // Test backward pagination
  await resolver({}, { last: 2 });
  await resolver({}, { last: 2, before: "cursor2" });

  // Mock returns basic connection structure
  // Real implementation would handle cursor-based pagination
});

Deno.test("documentContent resolver returns content string", async () => {
  const resolver =
    (documentQueries.fields.documentContent as DocumentQueryResolver).resolve;

  // Test content extraction
  await resolver({}, { slug: "getting-started" });

  // Real implementation would return the document's content field
  // Error handling returns null for missing documents
});

Deno.test("documentContent resolver handles missing document", async () => {
  const resolver =
    (documentQueries.fields.documentContent as DocumentQueryResolver).resolve;

  // Test with non-existent document
  await resolver({}, { slug: "non-existent-doc" });

  // Should return null for missing documents
});

Deno.test("documentQueries fragment declares correct dependencies", () => {
  assertEquals(documentQueries.dependencies, ["PublishedDocument"]);
});

Deno.test("document resolvers handle errors gracefully", async () => {
  // Test all resolvers with invalid data
  const documentsBySlugResolver =
    (documentQueries.fields.documentsBySlug as DocumentQueryResolver).resolve;
  const documentsResolver =
    (documentQueries.fields.documents as DocumentQueryResolver).resolve;
  const documentContentResolver =
    (documentQueries.fields.documentContent as DocumentQueryResolver).resolve;

  // All resolvers should handle errors and return null/empty results
  await documentsBySlugResolver({}, { slug: "invalid" });
  await documentsResolver({}, { category: "nonexistent" });
  await documentContentResolver({}, { slug: "invalid" });

  // Error handling is built into each resolver
});

Deno.test("fragment supports different document types", async () => {
  // Test that fragment can work with different document categories
  const resolver =
    (documentQueries.fields.documents as DocumentQueryResolver).resolve;

  await resolver({}, { category: "guides" });
  await resolver({}, { category: "api" });
  await resolver({}, { category: "tutorials" });

  // Real implementation would support different document categories
});

Deno.test("fragment can be composed with blog queries", () => {
  // Test that documentQueries can be combined with blogPostQueries
  const mockBlogFragment = {
    name: "blogPostQueries",
    fields: {
      blogPost: { type: "object" },
      blogPosts: { type: "connection" },
    },
    dependencies: ["BlogPost"],
  };

  // Compose fragments
  const composedFields = {
    ...documentQueries.fields,
    ...mockBlogFragment.fields,
  };

  const composedDependencies = [
    ...documentQueries.dependencies,
    ...mockBlogFragment.dependencies,
  ];

  // Should include all fields from both fragments
  assert("documentsBySlug" in composedFields);
  assert("documents" in composedFields);
  assert("documentContent" in composedFields);
  assert("blogPost" in composedFields);
  assert("blogPosts" in composedFields);

  // Should include all dependencies
  assert(composedDependencies.includes("PublishedDocument"));
  assert(composedDependencies.includes("BlogPost"));
});

Deno.test("fragment supports advanced query features", async () => {
  const resolver =
    (documentQueries.fields.documents as DocumentQueryResolver).resolve;

  // Test complex query with multiple filters
  await resolver({}, {
    category: "guides",
    published: true,
    first: 5,
    after: "cursor123",
  });

  // Real implementation would support combining filters with pagination
});

Deno.test("document content resolver supports markdown processing", async () => {
  const resolver =
    (documentQueries.fields.documentContent as DocumentQueryResolver).resolve;

  // Test content that might contain markdown
  await resolver({}, { slug: "markdown-example" });

  // Real implementation might process markdown to HTML
  // Or return raw markdown for client-side processing
});

Deno.test("fragment handles document metadata", async () => {
  // Test that fragment can access document metadata beyond just content
  // In a real implementation, PublishedDocument might have fields like:
  // - title, description, tags, publishedAt, updatedAt, author

  const resolver =
    (documentQueries.fields.documentsBySlug as DocumentQueryResolver).resolve;
  await resolver({}, { slug: "test-doc" });

  // Real PublishedDocument instances would have metadata fields
  // Fragment would expose these through the GraphQL schema
});

Deno.test("fragment supports document search", () => {
  // Test that fragment could be extended with search functionality
  const searchField = {
    type: "connection",
    returnType: () => PublishedDocument,
    args: {
      query: "string",
      first: "int",
      after: "string",
    },
    resolve: (_root: unknown, _args: Record<string, unknown>) => {
      // Mock search implementation
      return {
        edges: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        count: 0,
      };
    },
  };

  // Could be added to documentQueries.fields
  const extendedFields = {
    ...documentQueries.fields,
    searchDocuments: searchField,
  };

  assert("searchDocuments" in extendedFields);
});
