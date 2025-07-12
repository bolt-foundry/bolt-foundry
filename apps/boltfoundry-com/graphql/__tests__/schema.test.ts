/**
 * Test file for selective GraphQL schema validation
 *
 * This test ensures that the selective import system works correctly by:
 * 1. Verifying the schema exports successfully
 * 2. Confirming only expected node types are included
 * 3. Confirming only expected query fields are present
 * 4. Confirming unwanted types/queries are excluded
 */

import { assertEquals, assertExists } from "@std/assert";
import { makeSchema } from "nexus";
import { schema } from "../schema.ts";

Deno.test("Selective GraphQL Schema - Basic Export", () => {
  // Test that the schema exports without errors
  assertExists(schema, "Schema should export successfully");
  assertExists(schema.types, "Schema should have types array");
  assertExists(schema.plugins, "Schema should have plugins array");
});

Deno.test("Selective GraphQL Schema - Type Inclusion", () => {
  // Build the actual GraphQL schema to introspect types
  const builtSchema = makeSchema(schema);
  const typeMap = builtSchema.getTypeMap();

  // Expected types that should be present
  const expectedTypes = [
    "BlogPost",
    "PublishedDocument",
    "BoltFoundryComCurrentViewer", // New viewer type
    "Query",
    "IsoDate", // Custom scalar
    "Node", // Interface
    "PageInfo", // From connection plugin
    "BlogPostConnection", // From BlogPost connection queries
    "BlogPostEdge", // From BlogPost connection queries
  ];

  for (const expectedType of expectedTypes) {
    assertExists(
      typeMap[expectedType],
      `Expected type ${expectedType} should be present in schema`,
    );
  }
});

Deno.test("Selective GraphQL Schema - Type Exclusion", () => {
  // Build the actual GraphQL schema to introspect types
  const builtSchema = makeSchema(schema);
  const typeMap = builtSchema.getTypeMap();

  // Types that should NOT be present (from other fragments)
  const excludedTypes = [
    "GithubRepoStats", // Should not be included
    "BfOrganization", // Should not be included
    "BfPerson", // Should not be included
  ];

  for (const excludedType of excludedTypes) {
    assertEquals(
      typeMap[excludedType],
      undefined,
      `Excluded type ${excludedType} should NOT be present in schema`,
    );
  }
});

Deno.test("Selective GraphQL Schema - Query Fields", () => {
  // Build the actual GraphQL schema to introspect query fields
  const builtSchema = makeSchema(schema);
  const queryType = builtSchema.getQueryType();
  assertExists(queryType, "Schema should have a Query type");

  const queryFields = queryType.getFields();

  // Expected query fields - now only currentViewer at root level
  const expectedQueries = [
    "currentViewer", // Single root entry point
  ];

  for (const expectedQuery of expectedQueries) {
    assertExists(
      queryFields[expectedQuery],
      `Expected query field ${expectedQuery} should be present`,
    );
  }

  // Queries that should NOT be present - old direct queries moved to currentViewer
  const excludedQueries = [
    "blogPost", // Now under currentViewer
    "blogPosts", // Now under currentViewer
    "documentsBySlug", // Now under currentViewer
    "githubRepoStats", // Should not be included
    "systemInfo", // Should not be included (from systemQueries)
  ];

  for (const excludedQuery of excludedQueries) {
    assertEquals(
      queryFields[excludedQuery],
      undefined,
      `Excluded query field ${excludedQuery} should NOT be present`,
    );
  }
});

Deno.test("Selective GraphQL Schema - Mutation Exclusion", () => {
  // Build the actual GraphQL schema to check mutations
  const builtSchema = makeSchema(schema);
  const mutationType = builtSchema.getMutationType();

  // GraphQL schemas may have an empty Mutation type even with no mutations
  // What matters is that it doesn't contain unwanted mutation fields
  if (mutationType) {
    const mutationFields = mutationType.getFields();
    const fieldNames = Object.keys(mutationFields);

    // There should be no actual mutation fields since we provided empty mutationFragments
    assertEquals(
      fieldNames.length,
      0,
      "Mutation type should have no fields since no mutation fragments were provided",
    );
  }
  // It's also acceptable for there to be no Mutation type at all
});

Deno.test("Selective GraphQL Schema - BlogPost Field Validation", () => {
  // Build the actual GraphQL schema to check BlogPost fields
  const builtSchema = makeSchema(schema);
  const typeMap = builtSchema.getTypeMap();
  const blogPostType = typeMap["BlogPost"];

  assertExists(blogPostType, "BlogPost type should exist");

  // Check that BlogPost has the expected fields
  if ("getFields" in blogPostType) {
    const fields = blogPostType.getFields();

    const expectedFields = [
      "id",
      "content",
      "author",
      "publishedAt",
      "updatedAt",
      "tags",
      "excerpt",
      "title",
      "heroImage",
    ];

    for (const expectedField of expectedFields) {
      assertExists(
        fields[expectedField],
        `BlogPost should have field ${expectedField}`,
      );
    }
  }
});

Deno.test("Selective GraphQL Schema - PublishedDocument Field Validation", () => {
  // Build the actual GraphQL schema to check PublishedDocument fields
  const builtSchema = makeSchema(schema);
  const typeMap = builtSchema.getTypeMap();
  const docType = typeMap["PublishedDocument"];

  assertExists(docType, "PublishedDocument type should exist");

  // Check that PublishedDocument has the expected fields
  if ("getFields" in docType) {
    const fields = docType.getFields();

    const expectedFields = [
      "id",
      "content",
    ];

    for (const expectedField of expectedFields) {
      assertExists(
        fields[expectedField],
        `PublishedDocument should have field ${expectedField}`,
      );
    }
  }
});
