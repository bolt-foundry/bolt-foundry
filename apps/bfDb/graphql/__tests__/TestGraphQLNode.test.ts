#! /usr/bin/env -S bff test

/**
 * Tests for the TestGraphQLNode implementation
 */

import { assert, assertEquals } from "@std/assert";
import { GraphQLNode } from "../GraphQLNode.ts";
import { TestGraphQLNode } from "./__fixtures__/TestGraphQLNode.ts";

Deno.test("TestGraphQLNode extends GraphQLNode", () => {
  assert(
    Object.getPrototypeOf(TestGraphQLNode.prototype) === GraphQLNode.prototype,
    "TestGraphQLNode should extend GraphQLNode",
  );
});

Deno.test("TestGraphQLNode implements required id property", () => {
  const testId = "test-123";
  const node = new TestGraphQLNode(testId);

  assertEquals(
    node.id,
    testId,
    "TestGraphQLNode should return the correct id value",
  );
});

Deno.test("TestGraphQLNode implements name property", () => {
  // Test with default name
  const nodeDefault = new TestGraphQLNode("id-1");
  assertEquals(
    nodeDefault.name,
    "Test Node",
    "TestGraphQLNode should use default name when not provided",
  );

  // Test with custom name
  const customName = "Custom Node Name";
  const nodeCustom = new TestGraphQLNode("id-2", customName);
  assertEquals(
    nodeCustom.name,
    customName,
    "TestGraphQLNode should use the provided custom name",
  );
});

Deno.test("TestGraphQLNode properly extends gqlSpec with name field", () => {
  assert(TestGraphQLNode.gqlSpec, "TestGraphQLNode should define gqlSpec");

  // Check fields exist
  assert(
    TestGraphQLNode.gqlSpec.fields,
    "TestGraphQLNode.gqlSpec should define fields",
  );

  // Check id field exists
  const idField = TestGraphQLNode.gqlSpec.fields["id"];
  assert(idField, "TestGraphQLNode.gqlSpec should define an 'id' field");

  // Check name field exists
  const nameField = TestGraphQLNode.gqlSpec.fields["name"];
  assert(nameField, "TestGraphQLNode.gqlSpec should define a 'name' field");
});

Deno.test("TestGraphQLNode returns correct __typename", () => {
  const node = new TestGraphQLNode("test-id");
  assertEquals(
    node.__typename,
    "TestGraphQLNode",
    "TestGraphQLNode should have the correct __typename value",
  );
});

Deno.test("TestGraphQLNode can be converted to GraphQL format", () => {
  const testId = "gql-test-id";
  const node = new TestGraphQLNode(testId);

  const graphqlObject = node.toGraphql();

  assertEquals(
    graphqlObject.__typename,
    "TestGraphQLNode",
    "GraphQL object should have the correct __typename",
  );

  assertEquals(
    graphqlObject.id,
    testId,
    "GraphQL object should have the correct id",
  );
});
