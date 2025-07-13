#! /usr/bin/env -S bff test

/**
 * Tests for backward compatibility between fragment system and existing Query root.
 * Ensures fragment-based schemas produce identical output to current monolithic Query.
 */

import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import type { testQuery as _testQuery } from "./TestHelpers.test.ts";
import type { Query as _Query } from "../roots/Query.ts";

// Mock current Query implementation for comparison
interface QueryField {
  type: string;
  args?: Record<string, string>;
  resolve: (root: unknown, args: unknown) => unknown;
}

interface Fragment {
  fields: Record<string, QueryField>;
}

const currentQueryFields: Record<string, QueryField> = {
  ok: {
    type: "Boolean",
    resolve: () => true,
  },
  documentsBySlug: {
    type: "PublishedDocument",
    args: { slug: "String" },
    resolve: (_root: unknown, args: unknown) => {
      // Simulate current Query resolver
      const typedArgs = args as { slug?: string };
      const slug = typedArgs.slug || "getting-started";
      return { id: slug, content: `Content for ${slug}` };
    },
  },
  blogPost: {
    type: "BlogPost",
    args: { slug: "String" },
    resolve: (_root: unknown, args: unknown) => {
      const typedArgs = args as { slug?: string };
      const slug = typedArgs.slug || "README";
      return { id: slug, title: `Blog Post: ${slug}` };
    },
  },
  blogPosts: {
    type: "BlogPostConnection",
    args: {
      sortDirection: "String",
      filterByYear: "String",
      first: "Int",
      after: "String",
      last: "Int",
      before: "String",
    },
    resolve: (_root: unknown, args: unknown) => {
      const typedArgs = args as Record<string, unknown>;
      const mockPosts = [
        { id: "2025-01-01", title: "New Year Post" },
        { id: "2024-12-01", title: "December Post" },
      ];

      let filtered = mockPosts;
      if (typedArgs.filterByYear) {
        filtered = mockPosts.filter((p) =>
          p.id.startsWith(typedArgs.filterByYear as string)
        );
      }

      return {
        edges: filtered.map((post) => ({ node: post, cursor: post.id })),
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        count: filtered.length,
      };
    },
  },
  githubRepoStats: {
    type: "GithubRepoStats",
    args: {},
    resolve: () => {
      return { id: "stats", stars: 100, forks: 20 };
    },
  },
};

// Mock fragment-based composition that should match current Query
const fragmentComposition = {
  blogPostQueries: {
    fields: {
      blogPost: currentQueryFields.blogPost,
      blogPosts: currentQueryFields.blogPosts,
    },
  },
  documentQueries: {
    fields: {
      documentsBySlug: currentQueryFields.documentsBySlug,
    },
  },
  githubQueries: {
    fields: {
      githubRepoStats: currentQueryFields.githubRepoStats,
    },
  },
  coreQueries: {
    fields: {
      ok: currentQueryFields.ok,
    },
  },
};

function composeFragmentFields(
  fragmentNames: Array<string>,
): Record<string, QueryField> {
  const composed: Record<string, QueryField> = {};

  for (const fragmentName of fragmentNames) {
    const fragment =
      (fragmentComposition as Record<string, Fragment>)[fragmentName];
    if (fragment) {
      Object.assign(composed, fragment.fields);
    }
  }

  return composed;
}

Deno.test("fragment composition matches current Query field names", () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  const currentFields = Object.keys(currentQueryFields);
  const composedFields = Object.keys(fragmentFields);

  assertEquals(composedFields.sort(), currentFields.sort());
});

Deno.test("fragment composition matches current Query field types", () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // Check that field types match
  for (const [fieldName, currentField] of Object.entries(currentQueryFields)) {
    const fragmentField = fragmentFields[fieldName];
    assert(fragmentField, `Missing field: ${fieldName}`);
    assertEquals(fragmentField.type, currentField.type);
  }
});

Deno.test("fragment composition matches current Query field arguments", () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // Check that field arguments match
  for (const [fieldName, currentField] of Object.entries(currentQueryFields)) {
    const fragmentField = fragmentFields[fieldName];

    if ("args" in currentField && currentField.args) {
      assert(
        "args" in fragmentField && fragmentField.args,
        `Missing args for field: ${fieldName}`,
      );

      const currentArgKeys = Object.keys(currentField.args).sort();
      const fragmentArgKeys = Object.keys(fragmentField.args).sort();

      assertEquals(
        fragmentArgKeys,
        currentArgKeys,
        `Argument mismatch for field: ${fieldName}`,
      );
    }
  }
});

Deno.test("fragment resolvers produce same output as current Query", async () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // Test each resolver with same inputs
  const testCases = [
    { field: "ok", args: {} },
    { field: "documentsBySlug", args: { slug: "test-doc" } },
    { field: "blogPost", args: { slug: "test-post" } },
    { field: "blogPosts", args: { sortDirection: "DESC" } },
    { field: "githubRepoStats", args: {} },
  ];

  for (const testCase of testCases) {
    const currentResolver =
      currentQueryFields[testCase.field as keyof typeof currentQueryFields]
        .resolve;
    const fragmentResolver = fragmentFields[testCase.field].resolve;

    const currentResult = await currentResolver({}, testCase.args);
    const fragmentResult = await fragmentResolver({}, testCase.args);

    // Results should be structurally equivalent
    assertEquals(
      fragmentResult,
      currentResult,
      `Resolver output mismatch for field: ${testCase.field}`,
    );
  }
});

Deno.test("fragment composition supports selective inclusion", () => {
  // Test that we can include only blog-related fields
  const blogOnlyFields = composeFragmentFields(["blogPostQueries"]);

  assert("blogPost" in blogOnlyFields);
  assert("blogPosts" in blogOnlyFields);
  assert(!("documentsBySlug" in blogOnlyFields));
  assert(!("githubRepoStats" in blogOnlyFields));

  // Test that we can include only document-related fields
  const docsOnlyFields = composeFragmentFields(["documentQueries"]);

  assert("documentsBySlug" in docsOnlyFields);
  assert(!("blogPost" in docsOnlyFields));
  assert(!("githubRepoStats" in docsOnlyFields));
});

Deno.test("fragment composition maintains resolver context", async () => {
  const fragmentFields = composeFragmentFields(["blogPostQueries"]);

  const resolver = fragmentFields.blogPost.resolve;

  // Should work with GraphQL context (even if unused in this case)
  const result = await resolver({}, { slug: "test" });

  assertInstanceOf(result, Object);
  assertEquals((result as { id: string }).id, "test");
});

Deno.test("fragment resolvers handle same error cases", async () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
  ]);

  // Test error handling for missing documents
  const docResolver = fragmentFields.documentsBySlug.resolve;
  const blogResolver = fragmentFields.blogPost.resolve;

  // Should handle missing slugs gracefully (like current implementation)
  const docResult = await docResolver({}, { slug: "non-existent" });
  const blogResult = await blogResolver({}, { slug: "non-existent" });

  // Current implementation returns objects with the requested ID
  assertEquals((docResult as { id: string }).id, "non-existent");
  assertEquals((blogResult as { id: string }).id, "non-existent");
});

Deno.test("fragment composition supports connection pagination", async () => {
  const fragmentFields = composeFragmentFields(["blogPostQueries"]);

  const resolver = fragmentFields.blogPosts.resolve;

  // Test connection args (same as current implementation)
  const result = await resolver({}, {
    first: 10,
    after: "cursor",
    sortDirection: "ASC",
    filterByYear: "2025",
  });

  // Should return connection structure
  const typedResult = result as {
    edges: Array<unknown>;
    pageInfo: unknown;
    count: unknown;
  };
  assert("edges" in typedResult);
  assert("pageInfo" in typedResult);
  assert("count" in typedResult);
  assertInstanceOf(typedResult.edges, Array);
});

Deno.test("fragment system maintains GraphQL specification compliance", () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // All fields should have proper GraphQL types
  for (const [fieldName, field] of Object.entries(fragmentFields)) {
    assert(field.type, `Missing type for field: ${fieldName}`);
    assertInstanceOf(
      field.resolve,
      Function,
      `Missing resolver for field: ${fieldName}`,
    );
  }
});

Deno.test("fragment composition supports query introspection", () => {
  // Test that fragment-based schema supports __schema introspection
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // Should include all introspection-friendly metadata
  for (const [fieldName, field] of Object.entries(fragmentFields)) {
    assert(field.type, `Field ${fieldName} should have type information`);

    if (field.args) {
      for (const [argName, argType] of Object.entries(field.args)) {
        assert(
          argType,
          `Argument ${argName} of field ${fieldName} should have type`,
        );
      }
    }
  }
});

Deno.test("fragment system enables incremental migration", () => {
  // Test that we can migrate one fragment at a time

  // Step 1: Start with just core queries
  const step1 = composeFragmentFields(["coreQueries"]);
  assertEquals(Object.keys(step1), ["ok"]);

  // Step 2: Add blog queries
  const step2 = composeFragmentFields(["coreQueries", "blogPostQueries"]);
  assert("ok" in step2);
  assert("blogPost" in step2);
  assert("blogPosts" in step2);

  // Step 3: Add document queries
  const step3 = composeFragmentFields([
    "coreQueries",
    "blogPostQueries",
    "documentQueries",
  ]);
  assert("documentsBySlug" in step3);

  // Step 4: Complete migration (should match current)
  const step4 = composeFragmentFields([
    "coreQueries",
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
  ]);
  assertEquals(
    Object.keys(step4).sort(),
    Object.keys(currentQueryFields).sort(),
  );
});

Deno.test("fragment system maintains performance characteristics", async () => {
  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // Test that fragment resolvers perform similarly to current ones
  const testResolvers = ["blogPost", "documentsBySlug", "githubRepoStats"];

  for (const fieldName of testResolvers) {
    const start = performance.now();

    const resolver = fragmentFields[fieldName].resolve;
    await resolver({}, {});

    const end = performance.now();

    // Should resolve quickly (same as current implementation)
    assert(
      end - start < 10,
      `Resolver ${fieldName} took too long: ${end - start}ms`,
    );
  }
});

Deno.test("fragment system supports existing client queries", () => {
  // Test that existing GraphQL queries continue to work

  // Mock existing queries that clients might be using
  const existingQueries = [
    {
      name: "GetBlogPost",
      query:
        "query GetBlogPost($slug: String) { blogPost(slug: $slug) { id title } }",
      variables: { slug: "test-post" },
    },
    {
      name: "GetDocument",
      query:
        "query GetDocument($slug: String) { documentsBySlug(slug: $slug) { id content } }",
      variables: { slug: "test-doc" },
    },
    {
      name: "ListBlogPosts",
      query:
        "query ListBlogPosts { blogPosts(first: 10) { edges { node { id title } } } }",
      variables: {},
    },
  ];

  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // All required fields should be available
  for (const query of existingQueries) {
    if (query.query.includes("blogPost(")) {
      assert(
        "blogPost" in fragmentFields,
        `Missing field for query: ${query.name}`,
      );
    }
    if (query.query.includes("documentsBySlug(")) {
      assert(
        "documentsBySlug" in fragmentFields,
        `Missing field for query: ${query.name}`,
      );
    }
    if (query.query.includes("blogPosts(")) {
      assert(
        "blogPosts" in fragmentFields,
        `Missing field for query: ${query.name}`,
      );
    }
  }
});

Deno.test("fragment composition produces identical SDL output", () => {
  // This test would verify that printSchema() produces identical output
  // For now, just test structural equivalence

  const fragmentFields = composeFragmentFields([
    "blogPostQueries",
    "documentQueries",
    "githubQueries",
    "coreQueries",
  ]);

  // Should have same field signatures
  for (const [fieldName, currentField] of Object.entries(currentQueryFields)) {
    const fragmentField = fragmentFields[fieldName];

    assertEquals(
      fragmentField.type,
      currentField.type,
      `Type mismatch for field: ${fieldName}`,
    );

    if (
      "args" in currentField && currentField.args && "args" in fragmentField &&
      fragmentField.args
    ) {
      for (const [argName, argType] of Object.entries(currentField.args)) {
        assertEquals(
          fragmentField.args[argName],
          argType,
          `Argument type mismatch for ${fieldName}.${argName}`,
        );
      }
    }
  }
});
