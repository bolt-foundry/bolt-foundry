/**
 * Integration tests for the real createAppSchema implementation
 */

import { assertEquals, assertExists, assertFalse } from "@std/assert";
import {
  createAppSchema,
  createQueryFragment,
} from "@bfmono/apps/bfDb/graphql/createAppSchema.ts";

Deno.test("createAppSchema - real implementation generates GraphQL schema", async () => {
  const schema = await createAppSchema({
    nodeTypes: [],
    queryFragments: [],
    mutationFragments: [],
    customScalars: ["IsoDate"],
  });

  assertExists(schema);
  assertExists(schema.getQueryType());
  assertFalse(schema.getMutationType()); // No mutations specified
  assertFalse(schema.getSubscriptionType()); // No subscriptions
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

  const schema = await createAppSchema({
    nodeTypes: [],
    queryFragments: [fragment1, fragment2],
    mutationFragments: [],
  });

  assertExists(schema);
  assertExists(schema.getQueryType());

  // The fragments should be merged without crashing
  assertEquals(typeof schema, "object");
});

Deno.test("Empty configuration - handles gracefully", async () => {
  const schema = await createAppSchema({
    nodeTypes: [],
    queryFragments: [],
    mutationFragments: [],
  });

  assertExists(schema);
  assertExists(schema.getQueryType());

  // Should create a valid GraphQL schema even with minimal config
  assertEquals(typeof schema, "object");
});
