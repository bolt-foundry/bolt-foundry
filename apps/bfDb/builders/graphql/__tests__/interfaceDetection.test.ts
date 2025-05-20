#! /usr/bin/env -S bff test

/**
 * Tests for interface implementation detection in gqlSpecToNexus
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { GraphQLNode } from "apps/bfDb/graphql/GraphQLNode.ts";

// We'll need to create these functions in gqlSpecToNexus.ts
import {
  createObjectTypeFromClass,
  createInterfaceFromClass,
  detectImplementedInterfaces,
} from "../gqlSpecToNexus.ts";

// Test class that implements the Node interface by extending GraphQLNode
class TestNode extends GraphQLNode {
  override get id(): string {
    return "test-id";
  }
  
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .string("name")
  );
}

// Another test class that doesn't implement Node interface
class NonNodeClass extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("title")
  );
}

Deno.test("detectImplementedInterfaces should identify Node interface", () => {
  // Detect interfaces for TestNode
  const interfaces = detectImplementedInterfaces(TestNode);
  
  // Should include the Node interface
  assert(
    interfaces.includes("Node") || interfaces.includes("GraphQLNode"),
    "TestNode should be detected as implementing the Node interface"
  );
  
  // NonNodeClass should not implement Node
  const nonNodeInterfaces = detectImplementedInterfaces(NonNodeClass);
  assert(
    !nonNodeInterfaces.includes("Node") && !nonNodeInterfaces.includes("GraphQLNode"),
    "NonNodeClass should not be detected as implementing the Node interface"
  );
});

Deno.test("createInterfaceFromClass should create a valid interface definition", () => {
  // Create an interface definition from GraphQLNode
  const interfaceDef = createInterfaceFromClass(GraphQLNode);
  
  // Verify interface name
  assertEquals(
    interfaceDef.name,
    "Node",
    "Interface name should be 'Node' for GraphQLNode class"
  );
  
  // Verify interface fields (at minimum id)
  assertExists(
    interfaceDef.definition,
    "Interface definition should include a definition function"
  );
});

Deno.test("createObjectTypeFromClass should detect implemented interfaces", () => {
  // Create an object type definition for TestNode
  const objectDef = createObjectTypeFromClass(TestNode);
  
  // Verify object name
  assertEquals(
    objectDef.name,
    "TestNode",
    "Object type name should match class name"
  );
  
  // Verify implemented interfaces
  assertExists(
    objectDef.implements,
    "Object implementing an interface should have 'implements' property"
  );
  
  assert(
    Array.isArray(objectDef.implements),
    "implements should be an array of interface names"
  );
  
  assert(
    objectDef.implements.includes("Node") || objectDef.implements.includes("GraphQLNode"),
    "TestNode should implement the Node interface"
  );
  
  // Non-node class should not have implements
  const nonNodeDef = createObjectTypeFromClass(NonNodeClass);
  assertEquals(
    nonNodeDef.implements,
    undefined,
    "NonNodeClass should not have any implemented interfaces"
  );
});