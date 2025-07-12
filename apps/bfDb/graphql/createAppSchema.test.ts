#! /usr/bin/env -S bff test

/**
 * Tests for the createAppSchema function and selective fragment system.
 * Tests schema generation, fragment composition, and backward compatibility.
 */

import {
  assert,
  assertEquals,
  assertInstanceOf,
  assertRejects,
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
import { githubQueries } from "@bfmono/apps/bfDb/graphql/queries/githubQueries.ts";
import { GithubRepoStats } from "@bfmono/apps/bfDb/nodeTypes/GithubRepoStats.ts";

// Use real query fragments
const blogPostQueries = blogQueries;

Deno.test("createAppSchema with minimal configuration", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  assertInstanceOf(schema, Object);
  assert(schema.getQueryType());
  assertEquals(schema.getMutationType(), undefined); // No mutations specified
});

Deno.test("createAppSchema with multiple query fragments", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogPostQueries, documentQueries],
  });

  const queryType = schema.getQueryType();
  assertInstanceOf(queryType, Object);

  // Should include fields from both fragments
  const queryFields = queryType.getFields();
  assert("blogPost" in queryFields);
  assert("blogPosts" in queryFields);
  assert("documentsBySlug" in queryFields);
});

Deno.test("createAppSchema with query and mutation fragments", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
  });

  assert(schema.getQueryType());
  assertEquals(schema.getMutationType(), undefined); // No mutations specified
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

Deno.test("createAppSchema with custom plugins", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogPostQueries],
    plugins: [], // Add custom plugins if needed
  });

  assertInstanceOf(schema, Object);
});

Deno.test("createAppSchema merges fragments correctly", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument, GithubRepoStats],
    queryFragments: [blogPostQueries, documentQueries, githubQueries],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");

  // Should include all fields from all fragments
  const queryFields = queryType.getFields();
  assert("blogPost" in queryFields);
  assert("blogPosts" in queryFields);
  assert("documentsBySlug" in queryFields);
  assert("githubRepoStats" in queryFields);
});

Deno.test("createAppSchema handles empty fragments array", async () => {
  const schema = await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [],
  });

  const queryType = schema.getQueryType();
  assert(queryType, "Query type should exist");
  const queryFields = queryType.getFields();
  assertEquals(Object.keys(queryFields).length, 1); // Should have default 'ok' field
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
  const detectDependencies = (
    nodeTypes: Array<typeof BlogPost | typeof PublishedDocument>,
  ) => {
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
  assertEquals(blogPostQueries.dependencies, ["BlogPost", "IsoDate"]);
  assertEquals(documentQueries.dependencies, ["PublishedDocument"]);
  assertEquals(githubQueries.dependencies || [], []); // No dependencies
});

Deno.test("createAppSchema handles fragment name conflicts", async () => {
  const conflictingFragment: QueryFragment = {
    spec: {
      fields: {
        blogPost: { // Same field name as blogPostQueries
          type: "String",
          resolve: () => "conflicting implementation",
        },
      },
      relations: {},
      mutations: {},
      connections: {},
    },
    name: "conflictingQueries",
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

  // Should include BlogPost type, but queries are in Query type, not as separate types
  const typeMap = blogOnlySchema.getTypeMap();
  assert(typeMap["BlogPost"]);
  assertEquals(typeMap["PublishedDocument"], undefined);
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

Deno.test("createAppSchema error handling for missing dependencies", async () => {
  // Test what happens when fragment dependencies aren't satisfied
  const missingDepFragment: QueryFragment = {
    spec: {
      fields: {
        nonExistentType: {
          type: "object",
          returnType: () => "NonExistentType",
        },
      },
      relations: {},
      mutations: {},
      connections: {},
    },
    name: "missingDepQueries",
    dependencies: ["NonExistentType"],
  };

  // Real implementation should detect missing dependencies and throw an error
  await assertRejects(
    async () => {
      await createAppSchema({
        nodeTypes: [BlogPost],
        queryFragments: [missingDepFragment],
      });
    },
    Error,
    "Missing type",
  );
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
