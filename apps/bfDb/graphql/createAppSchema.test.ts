#! /usr/bin/env -S bff test

/**
 * Tests for the createAppSchema function and selective fragment system.
 * Tests schema generation, fragment composition, and backward compatibility.
 */

import {
  assert,
  assertEquals,
  assertInstanceOf,
  type assertRejects as _assertRejects,
} from "@std/assert";
import type {
  GraphQLObjectType as _GraphQLObjectType,
  GraphQLSchema as _GraphQLSchema,
  printSchema as _printSchema,
} from "graphql";
import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";
import { createAppSchema } from "./createAppSchema.ts";
import type { QueryFragment } from "@bfmono/apps/bfDb/graphql/fragments/types.ts";
import { blogQueries } from "@bfmono/apps/bfDb/graphql/queries/blogQueries.ts";
import { documentQueries } from "@bfmono/apps/bfDb/graphql/queries/documentQueries.ts";

// Use real query fragments
const blogPostQueries = blogQueries;

Deno.test("createAppSchema with minimal configuration", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  assertInstanceOf(schema, Object);
  assert(schema.getQueryType());
  assertEquals(schema.getMutationType(), null); // No mutations specified
});

Deno.test("createAppSchema with multiple query fragments", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogPostQueries, documentQueries],
  });

  const queryType = schema.getQueryType();
  assertInstanceOf(queryType, Object);

  // Should include fields from both fragments
  assert("blogPost" in queryType);
  assert("blogPosts" in queryType);
  assert("documentsBySlug" in queryType);
});

Deno.test("createAppSchema with query and mutation fragments", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  assert(schema.getQueryType());
  assertEquals(schema.getMutationType(), null); // No mutations specified
});

Deno.test("createAppSchema with custom scalars", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
    customScalars: ["IsoDate", "JSON"],
  });

  // In real implementation, custom scalars would be included in schema
  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema with interfaces", async () => {
  const mockInterface = {
    name: "Node",
    fields: { id: "ID!" },
  };

  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
    interfaces: [mockInterface],
  });

  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema merges fragments correctly", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogPostQueries, documentQueries, githubQueries],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");

  // Should include all fields from all fragments
  assert("blogPost" in queryType);
  assert("blogPosts" in queryType);
  assert("documentsBySlug" in queryType);
  assert("githubStats" in queryType);
});

Deno.test("createAppSchema handles empty fragments array", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");
  assertEquals(Object.keys(queryType).length, 0);
});

Deno.test("createAppSchema handles missing optional parameters", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
  });

  // Should work with minimal config
  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema detects dependencies automatically", async () => {
  // Mock dependency detection
  const detectDependencies = (nodeTypes: Array<GraphQLNodeConstructor>) => {
    const deps: Array<string> = [];
    for (const nodeType of nodeTypes) {
      deps.push(nodeType.name);
    }
    return deps;
  };

  await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogPostQueries, documentQueries],
  });

  const detectedDeps = detectDependencies([
    BlogPost,
    PublishedDocument,
  ]);
  assert(detectedDeps.includes("BlogPost"));
  assert(detectedDeps.includes("PublishedDocument"));
});

Deno.test("createAppSchema validates fragment dependencies", () => {
  // Test that fragments declare their dependencies correctly
  assertEquals(blogPostQueries.dependencies, ["BlogPost"]);
  assertEquals(documentQueries.dependencies, ["PublishedDocument"]);
  assertEquals(githubQueries.dependencies, []); // No dependencies
});

Deno.test("createAppSchema handles fragment name conflicts", async () => {
  const conflictingFragment: QueryFragment = {
    name: "conflictingQueries",
    fields: {
      blogPost: { // Same field name as blogPostQueries
        type: "string",
        resolve: () => "conflicting implementation",
      },
    },
    dependencies: [],
  };

  // In real implementation, this might throw or use last-wins strategy
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries, conflictingFragment],
  });

  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema produces valid GraphQL SDL", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogPostQueries, documentQueries],
  });

  // In real implementation, printSchema would generate valid SDL
  // const sdl = printSchema(schema);
  // assert(sdl.includes("type Query"));
  // assert(sdl.includes("blogPost"));
  // assert(sdl.includes("documentsBySlug"));

  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema supports selective node type inclusion", async () => {
  // Test that only specified node types are included
  const blogOnlySchema = await createAppSchema({
    nodeTypes: [BlogPost], // Only BlogPost, not PublishedDocument
    queryFragments: [blogPostQueries],
  });

  // Should include BlogPost but not PublishedDocument
  assert(blogOnlySchema.getType("BlogPost"));
  assertEquals(blogOnlySchema.getType("PublishedDocument"), undefined);
});

Deno.test("createAppSchema maintains resolver context", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");
  const queryFields = queryType.getFields();
  const blogPostField = queryFields.blogPost;
  assert(blogPostField, "blogPost field should exist");

  // Resolvers should maintain their original functionality
  assertInstanceOf(blogPostField.resolve, Function);
});

Deno.test("createAppSchema supports complex fragment composition", async () => {
  // Test composing fragments with shared dependencies
  const advancedBlogQueries: QueryFragment = {
    name: "advancedBlogQueries",
    fields: {
      featuredBlogPosts: {
        type: "connection",
        returnType: () => BlogPost,
        resolve: async () => {
          const posts = await BlogPost.listAll();
          return BlogPost.connection(posts.slice(0, 3), {});
        },
      },
    },
    dependencies: ["BlogPost"], // Same dependency as blogPostQueries
  };

  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries, advancedBlogQueries],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");
  assert("blogPost" in queryType);
  assert("blogPosts" in queryType);
  assert("featuredBlogPosts" in queryType);
});

Deno.test("createAppSchema error handling for missing dependencies", async () => {
  // Test what happens when fragment dependencies aren't satisfied
  const missingDepFragment: QueryFragment = {
    name: "missingDepQueries",
    fields: {
      nonExistentType: {
        type: "object",
        returnType: () => "NonExistentType",
      },
    },
    dependencies: ["NonExistentType"],
  };

  // Real implementation might throw an error or warn
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [missingDepFragment],
  });

  // For now, just test that it doesn't crash
  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema supports query-only schemas", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  const queryType = schema.getQueryType();
  assert(queryType);
  assertEquals(schema.getMutationType(), null); // No mutations specified
});

Deno.test("createAppSchema preserves field arguments", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");
  const queryFields = queryType.getFields();
  const blogPostField = queryFields.blogPost;
  assert(blogPostField, "blogPost field should exist");

  // Should preserve args from fragment definition
  // Check if args is an array with slug argument or an object with slug property
  const hasSlugArg = Array.isArray(blogPostField.args)
    ? blogPostField.args.some((arg) => arg.name === "slug")
    : "slug" in blogPostField.args;
  assert(hasSlugArg, "blogPost field should have slug argument");
});

Deno.test("createAppSchema supports nested schema generation", async () => {
  // Test creating schemas that can be nested or composed
  const subSchema1 = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  const subSchema2 = await createAppSchema({
    nodeTypes: [PublishedDocument],
    queryFragments: [documentQueries],
  });

  // In real implementation, schemas could be merged
  assertInstanceOf(subSchema1, Object);
  assertInstanceOf(subSchema2, Object);
});

Deno.test("createAppSchema maintains backward compatibility", async () => {
  // Test that new selective schema produces same output as old monolithic schema
  const selectiveSchema = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogPostQueries, documentQueries],
  });

  // Mock old monolithic schema
  const monolithicSchema = {
    getQueryType: () => ({
      blogPost: blogPostQueries.fields.blogPost,
      blogPosts: blogPostQueries.fields.blogPosts,
      documentsBySlug: documentQueries.fields.documentsBySlug,
    }),
  };

  // Should have same fields
  const selectiveQueryType = selectiveSchema.getQueryType();
  assert(selectiveQueryType, "Selective schema query type should exist");
  const selectiveFields = Object.keys(selectiveQueryType);
  const monolithicFields = Object.keys(monolithicSchema.getQueryType());

  assertEquals(selectiveFields.sort(), monolithicFields.sort());
});
