#! /usr/bin/env -S bff test

/**
 * Tests for the GraphQLNode class implementation
 */

import { assert, assertEquals, assertThrows } from "@std/assert";
import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

// Import the class we're about to create
import { GraphQLNode } from "../GraphQLNode.ts";

Deno.test("GraphQLNode extends GraphQLObjectBase", () => {
  // This test will fail until we create the GraphQLNode class
  assert(
    Object.getPrototypeOf(GraphQLNode.prototype) ===
      GraphQLObjectBase.prototype,
    "GraphQLNode should extend GraphQLObjectBase",
  );
});

Deno.test("GraphQLNode defines gqlSpec with required Node interface fields", () => {
  // This test will fail until we implement gqlSpec correctly
  assert(GraphQLNode.gqlSpec, "GraphQLNode should define gqlSpec");

  // Fields should exist
  assert(
    GraphQLNode.gqlSpec.fields,
    "GraphQLNode.gqlSpec should define fields",
  );

  // ID field should exist
  const idField = GraphQLNode.gqlSpec.fields["id"];
  assert(idField, "GraphQLNode.gqlSpec should define an 'id' field");
});

Deno.test("GraphQLNode requires concrete implementations to provide an id getter", () => {
  // Abstract classes can't be directly instantiated in JavaScript/TypeScript,
  // but we can test that we've properly made the getter abstract

  // We should be able to extend it with a concrete implementation
  class TestNode extends GraphQLNode {
    override get id(): string {
      return "test-id";
    }
  }

  const testNode = new TestNode();
  assertEquals(
    testNode.id,
    "test-id",
    "TestNode should have the correct id value",
  );

  // Test instantiating the abstract class directly
  assertThrows(
    () => {
      // @ts-ignore - We're intentionally trying to instantiate an abstract class
      new GraphQLNode();
    },
    TypeError,
    "Cannot instantiate abstract class",
    "Should not be able to instantiate GraphQLNode directly",
  );
});
