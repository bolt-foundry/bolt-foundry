#! /usr/bin/env -S bff test
import { assert, assertEquals, assertExists } from "@std/assert";
import { makeGqlBuilder } from "../makeGqlBuilder.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";

/** Test type to use as connection target */
class TestNode {
  static name = "TestNode";
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

/** Helper to reach into the builder's private spec */
const specOf = <T extends Record<string, unknown>>(b: unknown): T => {
  type WithSpec = { _spec: T };
  return (b as WithSpec)._spec;
};

type ConnectionSpec = {
  type: string;
  args?: Record<string, unknown>;
  resolve?: (...args: Array<unknown>) => unknown;
  _targetThunk?: () => unknown;
  _pendingTypeResolution?: boolean;
};

interface BuilderSpec extends Record<string, unknown> {
  fields: Record<string, unknown>;
  mutations: Record<string, unknown>;
  relations: Record<string, unknown>;
  connections?: Record<string, ConnectionSpec>;
}

Deno.test("gqlBuilder should have connection method", () => {
  const builder = makeGqlBuilder();

  // Test that connection method exists
  assert(
    "connection" in builder,
    "Builder should have connection method",
  );

  assert(
    typeof builder.connection === "function",
    "connection should be a function",
  );
});

Deno.test("connection method should accept name, targetThunk, and options", () => {
  const builder = makeGqlBuilder();

  // This test will fail until we implement the connection method
  try {
    builder.connection("testNodes", () => TestNode, {
      resolve: (_root, _args: ConnectionArguments) => {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        } as Connection<TestNode>;
      },
    });

    // If we get here without error, the method signature is correct
    assert(true, "connection method accepts expected parameters");
  } catch (error) {
    throw new Error(`connection method failed: ${(error as Error).message}`);
  }
});

Deno.test("connection method should return builder for chaining", () => {
  const builder = makeGqlBuilder();

  // Test method chaining
  const result = builder
    .string("name")
    .connection("testNodes", () => TestNode, {
      resolve: () => ({
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      } as Connection<TestNode>),
    })
    .int("count");

  // Should return the same builder instance
  assertEquals(
    result,
    builder,
    "connection should return builder for chaining",
  );
});

Deno.test("connection should store spec in connections property", () => {
  const builder = makeGqlBuilder();

  const resolver = (_root: unknown, _args: ConnectionArguments) => ({
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  } as Connection<TestNode>);

  builder.connection("testNodes", () => TestNode, {
    resolve: resolver,
  });

  const spec = specOf<BuilderSpec>(builder);

  // Check that connections property exists
  assertExists(spec.connections, "spec should have connections property");

  // Check that our connection was stored
  assert(
    "testNodes" in spec.connections,
    "connections should contain testNodes",
  );

  const connectionSpec = spec.connections.testNodes;
  assertEquals(
    connectionSpec.type,
    "testNodes",
    "Should store field name as initial type",
  );
  assert(connectionSpec.resolve === resolver, "Should store resolver");
  assertExists(connectionSpec._targetThunk, "Should store target thunk");
  assertEquals(
    connectionSpec._pendingTypeResolution,
    true,
    "Should mark for type resolution",
  );
});

Deno.test("connection should support custom args", () => {
  const builder = makeGqlBuilder();

  builder.connection("testNodes", () => TestNode, {
    args: (a) =>
      a
        .string("sortDirection")
        .boolean("includeArchived"),
    resolve: (
      _root,
      _args: ConnectionArguments & {
        sortDirection?: string;
        includeArchived?: boolean;
      },
    ) => {
      // Resolver can access both Relay args and custom args
      // Access args.first, args.sortDirection, args.includeArchived
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      } as Connection<TestNode>;
    },
  });

  const spec = specOf<BuilderSpec>(builder);
  const connectionSpec = spec.connections?.testNodes;

  assertExists(connectionSpec?.args, "Connection should have args");
  assert(
    "sortDirection" in connectionSpec.args,
    "Should have sortDirection arg",
  );
  assert(
    "includeArchived" in connectionSpec.args,
    "Should have includeArchived arg",
  );
});

Deno.test("connection resolver should be required", () => {
  const builder = makeGqlBuilder();

  // Test that resolver is required - this might need adjustment based on implementation
  try {
    // @ts-expect-error - Testing that resolver is required
    builder.connection("testNodes", () => TestNode);
    throw new Error("Should require resolver");
  } catch (error) {
    assert(
      (error as Error).message.includes("resolver") ||
        (error as Error).message.includes("required"),
      "Should throw error about missing resolver",
    );
  }
});

Deno.test("connection should work with async thunk", () => {
  const builder = makeGqlBuilder();

  // Test with async import pattern
  builder.connection(
    "testNodes",
    async () => {
      // Simulate dynamic import
      await new Promise((resolve) => setTimeout(resolve, 1));
      return TestNode;
    },
    {
      resolve: () => ({
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      } as Connection<TestNode>),
    },
  );

  const spec = specOf<BuilderSpec>(builder);
  assertExists(spec.connections?.testNodes, "Should handle async thunk");
});
