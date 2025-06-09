#! /usr/bin/env -S bff test
import { assert, assertEquals, assertExists } from "@std/assert";
import { gqlSpecToNexus } from "../gqlSpecToNexus.ts";
import type { GqlNodeSpec } from "../makeGqlBuilder.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { GqlConnectionDef } from "../types/nexusTypes.ts";

/** Test node type */
class TestNode {
  static name = "TestNode";
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

Deno.test("gqlSpecToNexus should process connections", async () => {
  // Create a spec with a connection
  const spec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
    connections: {
      testNodes: {
        type: "TestNode",
        args: {
          sortDirection: "String",
        },
        resolve: (
          _root: unknown,
          _args: ConnectionArguments & { sortDirection?: string },
        ) => {
          // Access args.first, args.sortDirection
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
        _targetThunk: () => TestNode,
      },
    },
  };

  const result = await gqlSpecToNexus(spec, "TestType");

  // The mainType definition should process connections
  assertExists(result.mainType, "Should have mainType");

  // We can't easily test the definition function without mocking Nexus
  // but we can verify the structure is correct
  assertEquals(result.mainType.name, "TestType");
});

Deno.test("gqlSpecToNexus should use connectionField for connections", async () => {
  let connectionFieldCalled = false;
  let fieldName: string | undefined;
  let fieldConfig:
    | { type?: string; resolve?: unknown; args?: unknown }
    | undefined;

  // Mock the t object that gets passed to definition
  const mockT = {
    connectionField: (
      name: string,
      config: { type?: string; resolve?: unknown; args?: unknown },
    ) => {
      connectionFieldCalled = true;
      fieldName = name;
      fieldConfig = config;
    },
    field: () => {}, // Regular fields
  };

  const spec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
    connections: {
      testNodes: {
        type: "TestNode",
        args: {
          sortDirection: "String",
        },
        resolve: () => ({
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        }),
        _targetThunk: () => TestNode,
      },
    },
  };

  const result = await gqlSpecToNexus(spec, "TestType");

  // Call the definition function with our mock
  if (result.mainType.definition) {
    result.mainType.definition(mockT);
  }

  assert(
    connectionFieldCalled,
    "Should call t.connectionField for connections",
  );
  assertEquals(fieldName, "testNodes", "Should use correct field name");
  assertExists(fieldConfig?.type, "Should have type in config");
  assertExists(fieldConfig?.resolve, "Should have resolve in config");
});

Deno.test("gqlSpecToNexus should pass custom args to connectionField", async () => {
  let capturedArgs: Record<string, unknown> | undefined;

  const mockT = {
    connectionField: (
      _name: string,
      config: { additionalArgs?: Record<string, unknown> },
    ) => {
      capturedArgs = config.additionalArgs;
    },
    field: () => {},
  };

  const spec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
    connections: {
      testNodes: {
        type: "TestNode",
        args: {
          sortDirection: "String",
          includeArchived: "Boolean",
        },
        resolve: () => ({
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        }),
        _targetThunk: () => TestNode,
      },
    },
  };

  const result = await gqlSpecToNexus(spec, "TestType");

  if (result.mainType.definition) {
    result.mainType.definition(mockT);
  }

  assertExists(capturedArgs, "Should pass args to connectionField");
  assert(
    "sortDirection" in capturedArgs,
    "Should include custom sortDirection arg",
  );
  assert(
    "includeArchived" in capturedArgs,
    "Should include custom includeArchived arg",
  );
});

Deno.test("gqlSpecToNexus should resolve target type from thunk", async () => {
  const spec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
    connections: {
      testNodes: {
        type: "PENDING_TestType_testNodes", // Should be resolved
        args: {},
        resolve: () => ({
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        }),
        _targetThunk: () => TestNode,
        _pendingTypeResolution: true,
      },
    },
  };

  const _result = await gqlSpecToNexus(spec, "TestType");

  // After processing, the type should be resolved
  const connection = spec.connections?.testNodes as GqlConnectionDef;
  assertEquals(connection?.type, "TestNode", "Should resolve type from thunk");
});

Deno.test("gqlSpecToNexus should handle async target thunks", async () => {
  const spec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
    connections: {
      testNodes: {
        type: "PENDING_TestType_testNodes",
        args: {},
        resolve: () => ({
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        }),
        _targetThunk: async () => {
          // Simulate dynamic import
          await new Promise((resolve) => setTimeout(resolve, 1));
          return TestNode;
        },
        _pendingTypeResolution: true,
      },
    },
  };

  const _result = await gqlSpecToNexus(spec, "TestType");

  // Type should be resolved even with async thunk
  const connection = spec.connections?.testNodes as GqlConnectionDef;
  assertEquals(connection?.type, "TestNode", "Should handle async thunk");
});
