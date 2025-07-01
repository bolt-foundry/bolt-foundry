#! /usr/bin/env -S bff test

/**
 * Tests for the GraphQLInterface decorator
 * Verifies that the decorator correctly marks classes as GraphQL interfaces
 * and that child classes inherit from their parent interfaces.
 */

import { assert } from "@std/assert";
import { interfaceType, objectType } from "nexus";
import { makeSchema } from "nexus";
import { GraphQLNode } from "../GraphQLNode.ts";
import { TestGraphQLNode } from "./__fixtures__/TestGraphQLNode.ts";
import { loadInterfaces } from "../graphqlInterfaces.ts";
import {
  getGraphQLInterfaceMetadata,
  GraphQLInterface,
  isGraphQLInterface,
} from "../decorators.ts";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

// Get logger for debug output
const logger = getLogger(import.meta);

// Create a test classes with the GraphQLInterface decorator
@GraphQLInterface({
  description: "A test interface with custom name",
  name: "CustomNameInterface",
})
class TestInterface {
  static gqlSpec = {
    fields: {
      testField: {
        type: "String",
        nonNull: true,
      },
    },
    relations: {},
    mutations: {},
  };
}

// Class that extends the decorated interface
class TestImplementation extends TestInterface {
  static override gqlSpec = {
    fields: {
      testField: {
        type: "String",
        nonNull: true,
      },
      additionalField: {
        type: "Int",
        nonNull: false,
      },
    },
    relations: {},
    mutations: {},
  };
}

Deno.test("GraphQLInterface decorator adds metadata to class", () => {
  // Check decorated class
  assert(
    isGraphQLInterface(TestInterface),
    "TestInterface should be marked as a GraphQL interface",
  );

  // Check metadata
  const metadata = getGraphQLInterfaceMetadata(TestInterface);
  assert(metadata, "Metadata should exist for TestInterface");
  assert(metadata.isInterface, "isInterface should be true");
  assert(metadata.name === "CustomNameInterface", "Custom name should be used");
  assert(
    metadata.description === "A test interface with custom name",
    "Description should be set",
  );

  // Check GraphQLNode is properly decorated
  assert(
    isGraphQLInterface(GraphQLNode),
    "GraphQLNode should be marked as a GraphQL interface",
  );
});

Deno.test("determineInterface detects parent classes with @GraphQLInterface", async () => {
  // Get interface types
  const interfaces = loadInterfaces();

  // Log the interfaces we got from loadInterfaces
  logger.debug(
    `Loaded interfaces: ${interfaces.map((i) => i.name).join(", ")}`,
  );

  // Process TestGraphQLNode with gqlSpecToNexus
  const testNodeSpec = TestGraphQLNode.gqlSpec;
  const testNodeNexusTypes = await gqlSpecToNexus(
    testNodeSpec,
    "TestGraphQLNode",
    {
      classType: TestGraphQLNode,
    },
  );

  // Process test implementation with gqlSpecToNexus
  const implementationSpec = TestImplementation.gqlSpec;
  const implementationNexusTypes = await gqlSpecToNexus(
    implementationSpec,
    "TestImplementation",
    {
      classType: TestImplementation,
    },
  );

  // Check GraphQLNode implementation
  assert(
    testNodeNexusTypes.mainType.implements === "Node",
    "TestGraphQLNode should implement Node interface",
  );

  // Check TestInterface implementation
  assert(
    implementationNexusTypes.mainType.implements === "CustomNameInterface",
    "TestImplementation should implement CustomNameInterface",
  );

  // For this test, we need a minimal schema with our custom interface
  // since we're testing decorator behavior, not the full production schema
  const customInterface = interfaceType({
    name: "CustomNameInterface",
    definition(t) {
      t.nonNull.string("testField");
    },
    resolveType: () => null,
  });

  // Build schema with all types - we create our own list to avoid
  // duplicating any interface definitions
  const types = [
    // Add only our custom interface for this test
    customInterface,
    // Then add our object types that implement these interfaces
    objectType(testNodeNexusTypes.mainType),
    objectType(implementationNexusTypes.mainType),
  ];

  const schema = makeSchema({ types });
  assert(schema, "Schema should be created with interface implementations");
});
