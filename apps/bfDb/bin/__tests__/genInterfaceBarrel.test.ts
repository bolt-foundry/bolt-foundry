#! /usr/bin/env -S bff test

/**
 * Tests for the interface barrel file generator
 */

import { assert, assertEquals, assertExists } from "@std/assert";

// We'll create this file later
import { generateInterfaceBarrel } from "../genInterfaceBarrel.ts";

Deno.test("generateInterfaceBarrel should create a registry file", async () => {
  const outputPath = "/home/runner/workspace/apps/bfDb/graphql/__generated__/graphqlInterfaces.ts";
  
  // Run the generator
  await generateInterfaceBarrel();
  
  // Check if the file was created using Deno.stat
  try {
    const stat = await Deno.stat(outputPath);
    assert(stat.isFile, "Interface barrel file should be created at the correct path");
  } catch (error) {
    assert(false, `File not found: ${outputPath}`);
  }
  
  // Import the generated file
  const registry = await import("apps/bfDb/graphql/__generated__/graphqlInterfaces.ts");
  
  // Should export GraphQLNode
  assertExists(
    registry.GraphQLNode,
    "Registry should export GraphQLNode"
  );
  
  // Content check is covered in the GraphQLInterfaces.test.ts
});

Deno.test("generateInterfaceBarrel should detect GraphQLNode class", async () => {
  // Get the detection function from the generator
  const { findInterfaceClasses } = await import("../genInterfaceBarrel.ts");
  
  // Find interface classes
  const interfaces = await findInterfaceClasses();
  
  // Should include GraphQLNode
  const hasGraphQLNode = interfaces.some((path: string) => 
    path.includes("GraphQLNode.ts")
  );
  
  assert(
    hasGraphQLNode,
    "findInterfaceClasses should detect GraphQLNode.ts"
  );
});

Deno.test("Interface classes should be properly detected", async () => {
  // Get the detection function from the generator
  const { isInterfaceClass } = await import("../genInterfaceBarrel.ts");
  
  // Import GraphQLNode for testing
  const { GraphQLNode } = await import("apps/bfDb/graphql/GraphQLNode.ts");
  
  // GraphQLNode should be detected as an interface class
  assert(
    await isInterfaceClass(GraphQLNode),
    "GraphQLNode should be detected as an interface class"
  );
  
  // Regular class should not be detected as an interface
  class RegularClass {}
  assert(
    !(await isInterfaceClass(RegularClass)),
    "Regular class should not be detected as an interface class"
  );
});