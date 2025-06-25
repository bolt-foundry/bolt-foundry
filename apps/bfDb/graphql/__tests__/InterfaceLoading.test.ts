#! /usr/bin/env -S bff test

/**
 * Tests for GraphQL interfaces loading and registration
 * This focuses on testing the v0.3 features for interface registration
 */

import { assert, assertEquals } from "@std/assert";
import { interfaceType, objectType } from "nexus";
import { makeSchema } from "nexus";
import { loadInterfaces } from "../graphqlInterfaces.ts";
import { GraphQLInterface, isGraphQLInterface } from "../decorators.ts";
import * as allInterfaces from "../__generated__/interfacesList.ts";
import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Test interface that should be in the dedicated interfaces directory
@GraphQLInterface({
  description: "Test interface for directory structure tests",
  name: "TestDirectoryInterface",
})
class TestDirectoryInterface extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.string("directoryField")
  );
}

// Test implementation of our interface
class TestDirectoryImplementation extends TestDirectoryInterface {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.string("implField")
  );

  get directoryField(): string {
    return "test field value";
  }

  get implField(): string {
    return "implementation field";
  }
}

Deno.test("All GraphQL interfaces are properly exported from the barrel file", () => {
  // Check that the barrel file is exporting at least some interfaces
  const exportedInterfaces = Object.values(allInterfaces);
  assert(
    exportedInterfaces.length > 0,
    "Barrel file should export at least one interface",
  );

  // Convert interface names to a set for easier checking
  const interfaceNames = new Set(
    Object.values(allInterfaces)
      .filter(isGraphQLInterface)
      // deno-lint-ignore no-explicit-any
      .map((intf) => (intf as any).name),
  );

  // We should at least find the GraphQLNode in the exported interfaces
  assert(
    interfaceNames.has("GraphQLNode"),
    "GraphQLNode should be exported from the interfaces barrel file",
  );
});

Deno.test("loadInterfaces correctly loads interfaces from the barrel file", () => {
  // Load all interfaces using the loadInterfaces function
  const interfaces = loadInterfaces();

  // Convert to map of name -> interface for easier checking
  const interfaceMap = new Map(
    interfaces.map((intf) => [intf.name, intf]),
  );

  // Verify we have at least the Node interface
  assert(
    interfaceMap.has("Node"),
    "Node interface should be loaded from the barrel file",
  );

  // Check interface structure
  const nodeInterface = interfaceMap.get("Node");
  assert(nodeInterface, "Node interface should be defined");
  assertEquals(nodeInterface?.name, "Node", "Interface name should match");
});

Deno.test("GraphQL schema includes all interfaces with correct fields", async () => {
  // Process test interface with gqlSpecToNexus
  const testInterfaceSpec = TestDirectoryInterface.gqlSpec;
  const _testInterfaceNexus = await gqlSpecToNexus(
    testInterfaceSpec,
    "TestDirectoryInterface",
    {
      classType: TestDirectoryInterface,
    },
  );

  // Process implementation
  const implSpec = TestDirectoryImplementation.gqlSpec;
  const implNexus = await gqlSpecToNexus(
    implSpec,
    "TestDirectoryImplementation",
    {
      classType: TestDirectoryImplementation,
    },
  );

  // Create an interface type for our test
  const testInterface = interfaceType({
    name: "TestDirectoryInterface",
    definition(t) {
      t.nonNull.string("directoryField");
    },
    resolveType: () => null,
  });

  // Load regular interfaces
  const interfaces = loadInterfaces();

  // This test needs a minimal schema with custom test interface
  // Exception: Testing interface loading mechanism with custom interface
  const schema = makeSchema({
    types: [
      ...interfaces,
      testInterface,
      objectType(implNexus.mainType),
    ],
  });

  assert(schema, "Schema should be created with all interfaces");

  // Get all types from the schema
  const allTypes = Object.keys(schema.getTypeMap());

  // Find interfaces - there are multiple ways to detect interfaces in a Nexus schema
  const nodeType = schema.getType("Node");
  const isInterface = nodeType?.astNode?.kind === "InterfaceTypeDefinition" ||
    // @ts-ignore - Accessing internal Nexus GraphQL properties
    nodeType?._interfaces?.length === 0 && nodeType?.getInterfaces?.();

  // Debug logging to see what's in the schema
  logger.debug("Schema types:", Object.keys(schema.getTypeMap()));
  logger.debug(
    "Schema interfaces:",
    Object.keys(schema.getTypeMap())
      .filter((typeName) =>
        schema.getType(typeName)?.astNode?.kind === "InterfaceTypeDefinition"
      ),
  );
  logger.debug("Node type:", nodeType);
  logger.debug("Is Node an interface:", isInterface);
  logger.debug("Interfaces loaded:", interfaces.map((i) => i.name));

  // Verify Node interface is in the schema
  assert(
    allTypes.includes("Node"),
    "Schema should include the Node interface",
  );

  assert(
    allTypes.includes("TestDirectoryInterface"),
    "Schema should include TestDirectoryInterface",
  );

  // Check that implementation is correctly connected to interface
  // This will fail until interfaces are properly organized and loaded
  assertEquals(
    implNexus.mainType.implements,
    "TestDirectoryInterface",
    "Implementation should implement TestDirectoryInterface",
  );
});

// We're using decorator-based detection rather than a dedicated interfaces directory
Deno.test("Interfaces are properly detected using @GraphQLInterface decorator", () => {
  // Check that our classes with @GraphQLInterface are properly detected
  const interfaces = loadInterfaces();
  const interfaceNames = interfaces.map((i) => i.name);

  // We should at least find these in the interfaces
  assert(interfaceNames.includes("Node"), "Node interface should be detected");
  assert(
    interfaceNames.includes("BfNode"),
    "BfNode interface should be detected",
  );
});

// Test for proper barrel file generation with decorator detection
Deno.test("genBarrel configuration detects @GraphQLInterface decorated classes", async () => {
  try {
    // Read and parse the genBarrel.ts file to check configuration
    const genBarrelPath = new URL(
      import.meta.resolve("apps/bfDb/bin/genBarrel.ts"),
    );
    const genBarrelContent = await Deno.readTextFile(genBarrelPath);

    // Check if it contains the decorator detection logic
    const hasDecoratorDetection =
      genBarrelContent.includes("@GraphQLInterface") &&
      genBarrelContent.includes("interfacesList.ts");

    assert(
      hasDecoratorDetection,
      "genBarrel.ts should have configuration for detecting @GraphQLInterface decorator",
    );
  } catch (_e) {
    throw new Error(
      "genBarrel.ts should include logic to detect @GraphQLInterface decorator in files",
    );
  }
});
