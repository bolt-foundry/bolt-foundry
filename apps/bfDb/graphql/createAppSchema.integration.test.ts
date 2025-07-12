/**
 * Integration tests for the real createAppSchema implementation
 */

import { assertEquals, assertExists } from "@std/assert";
import {
  createAppSchema,
  createQueryFragment,
} from "@bfmono/apps/bfDb/graphql/createAppSchema.ts";
import { blogQueries } from "@bfmono/apps/bfDb/graphql/queries/blogQueries.ts";
import { documentQueries } from "@bfmono/apps/bfDb/graphql/queries/documentQueries.ts";
import { systemQueries } from "@bfmono/apps/bfDb/graphql/queries/systemQueries.ts";
import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";

Deno.test("createAppSchema - real implementation generates schema config", async () => {
  const schemaConfig = await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument],
    queryFragments: [blogQueries, documentQueries, systemQueries],
    mutationFragments: [],
    customScalars: ["IsoDate"],
  });

  assertExists(schemaConfig);
  assertExists(schemaConfig.types);
  assertExists(schemaConfig.plugins);
  assertExists(schemaConfig.features);

  // Should have connection plugin
  assertEquals(schemaConfig.plugins.length, 1);
});

Deno.test("createQueryFragment - creates proper fragment structure", () => {
  const fragment = createQueryFragment(
    "testFragment",
    (gql) =>
      gql
        .boolean("ok")
        .string("version", {
          resolve: () => "1.0.0",
        }),
    {
      description: "Test query fragment",
      dependencies: ["String"],
    },
  );

  assertEquals(fragment.name, "testFragment");
  assertEquals(fragment.description, "Test query fragment");
  assertEquals(fragment.dependencies, ["String"]);
  assertExists(fragment.spec);
  assertExists(fragment.spec.fields);
});

Deno.test("Fragment composition - fragments merge correctly", async () => {
  const fragment1 = createQueryFragment(
    "fragment1",
    (gql) => gql.boolean("ok"),
  );

  const fragment2 = createQueryFragment(
    "fragment2",
    (gql) => gql.string("version"),
  );

  const schemaConfig = await createAppSchema({
    nodeTypes: [],
    queryFragments: [fragment1, fragment2],
    mutationFragments: [],
  });

  assertExists(schemaConfig.types);

  // The fragments should be merged without crashing
  assertEquals(typeof schemaConfig, "object");
});

Deno.test("Empty configuration - handles gracefully", async () => {
  const schemaConfig = await createAppSchema({
    nodeTypes: [],
    queryFragments: [],
    mutationFragments: [],
  });

  assertExists(schemaConfig);
  assertExists(schemaConfig.types);

  // Should have at least interfaces
  assertEquals(Array.isArray(schemaConfig.types), true);
});
