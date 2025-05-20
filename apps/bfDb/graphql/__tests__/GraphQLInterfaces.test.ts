#! /usr/bin/env -S bff test

/**
 * Tests for the GraphQL interface registry system
 */

import { assert, assertEquals, assertExists } from "@std/assert";
// Using import type since this is only used for type declarations
import type { GraphQLObjectBase as _GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { GraphQLNode } from "../GraphQLNode.ts";

// This import should eventually work when we implement the registry
import * as interfaces from "../__generated__/graphqlInterfaces.ts";

Deno.test("GraphQL interface registry file exists", async () => {
  try {
    // Try to read the interface registry file using a direct path
    const path =
      "/home/runner/workspace/apps/bfDb/graphql/__generated__/graphqlInterfaces.ts";
    const stat = await Deno.stat(path);

    assert(stat.isFile, "Interface registry file should exist");

    const content = await Deno.readTextFile(path);

    assert(
      content.includes("@generated"),
      "Interface registry should be marked as generated",
    );

    assert(
      content.includes("export * from"),
      "Interface registry should export from interface modules",
    );

    assert(
      content.includes("GraphQLNode"),
      "GraphQLNode should be registered in the interfaces file",
    );
  } catch (error) {
    throw new Error(
      `Interface registry file does not exist or has invalid content: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
});

Deno.test("Interface registry exports GraphQLNode", () => {
  assertExists(
    interfaces.GraphQLNode,
    "GraphQLNode should be exported through the registry",
  );

  assertEquals(
    interfaces.GraphQLNode,
    GraphQLNode,
    "GraphQLNode export from registry should match direct import",
  );
});

Deno.test("Interface registry is loaded by schema builder", async () => {
  // Import the loadGqlTypes function that should use the registry
  const { loadGqlTypes } = await import("../loadGqlTypes.ts");

  // Load the types, which should include interfaces
  const types = loadGqlTypes();

  type InterfaceType = {
    name: string;
    kind: string;
    definition: unknown;
  };

  // Find any interface definition that includes 'Node'
  const nodeInterface = types.find((type) => {
    const t = type as InterfaceType;
    return (t.name === "Node" || t.name === "GraphQLNode") &&
      t.kind === "interface";
  });

  assertExists(
    nodeInterface,
    "Node interface should be registered by loadGqlTypes",
  );

  // Verify the interface has the required fields
  assert(
    (nodeInterface as InterfaceType).definition,
    "Node interface should have a definition",
  );
});

// Test class that implements the Node interface by extending GraphQLNode
class TestNode extends GraphQLNode {
  override get id(): string {
    return "test-id";
  }
}

Deno.test("Interface implementation detection works", async () => {
  // Import the interface detection function
  const { detectImplementedInterfaces } = await import("../interfaceUtils.ts");

  // Detect interfaces for TestNode
  const interfaces = detectImplementedInterfaces(TestNode);

  // Should include Node interface
  assert(
    interfaces.includes("Node") || interfaces.includes("GraphQLNode"),
    "TestNode should be detected as implementing the Node interface",
  );
});
