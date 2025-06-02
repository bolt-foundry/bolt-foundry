#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlSpec } from "../makeGqlSpec.ts";
import { gqlSpecToNexus } from "../gqlSpecToNexus.ts";

// Define common types used in tests
type FieldConfig = {
  type: string | { ofType: string; _name: string };
  nullable?: boolean;
  resolve?: (
    root: unknown,
    args: unknown,
    ctx: unknown,
    info: unknown,
  ) => unknown;
};

type NexusBuilder = {
  field: (name: string, config: FieldConfig) => unknown;
};

/**
 * Tests for gqlSpecToNexus - convert GqlNodeSpec to Nexus types
 */

// Helper function to create a basic GqlNodeSpec for testing
// Not currently used but kept for documentation
function _createTestSpec() {
  return makeGqlSpec((gql) =>
    gql
      .string("name")
      .nonNull.id("id")
      .boolean("isActive")
      .mutation("update", {
        args: (a) => a.string("newName"),
        returns: "UpdateResult",
      })
  );
}

Deno.test("gqlSpecToNexus converts scalar fields correctly", async () => {
  // Create a simple spec with scalar fields
  const spec = makeGqlSpec((gql) =>
    gql
      .string("title")
      .int("count")
      .boolean("isPublished")
  );

  // Convert to Nexus types
  const result = await gqlSpecToNexus(spec, "TestType");

  // Ensure the main type is an objectType
  assert(
    result.mainType.name === "TestType",
    "Should create an object type with the correct name",
  );

  // Check that the definition function exists
  assert(
    typeof result.mainType.definition === "function",
    "Should have a definition function",
  );

  // We can't directly test the contents of the definition function,
  // but we can ensure it doesn't throw when executed with a mock builder

  const mockBuilder = {
    field: (name: string, config: FieldConfig) => {
      // Validate field configuration for known fields
      if (name === "title") {
        assertEquals(config.type, "String", "title should be a String type");
      } else if (name === "count") {
        assertEquals(config.type, "Int", "count should be an Int type");
      } else if (name === "isPublished") {
        assertEquals(
          config.type,
          "Boolean",
          "isPublished should be a Boolean type",
        );
      }
      return mockBuilder;
    },
  };

  // This shouldn't throw - we have to cast because the actual Nexus type is complex
  type NexusBuilder = {
    field: (name: string, config: FieldConfig) => unknown;
  };
  result.mainType.definition(mockBuilder as NexusBuilder);
});

Deno.test("gqlSpecToNexus handles nonNull fields", async () => {
  // Create a spec with nonNull fields
  const spec = makeGqlSpec((gql) => gql.nonNull.string("requiredField"));

  // Convert to Nexus types
  const result = await gqlSpecToNexus(spec, "NonNullTest");

  // Check definition with mock builder
  let wasNonNull = false;
  const mockBuilder = {
    field: (name: string, config: FieldConfig) => {
      if (name === "requiredField") {
        assertEquals(config.type, "String");
      }
      return mockBuilder;
    },
    nonNull: {
      field: (name: string, config: FieldConfig) => {
        if (name === "requiredField") {
          assertEquals(config.type, "String");
          wasNonNull = true;
        }
        return mockBuilder;
      },
    },
  };

  result.mainType.definition(mockBuilder as NexusBuilder);
  assert(wasNonNull, "nonNull field should be converted correctly");
});

Deno.test("gqlSpecToNexus creates mutation fields", async () => {
  // Create a spec with a mutation
  const spec = makeGqlSpec((gql) =>
    gql.mutation("createItem", {
      args: (a) => a.string("name").int("quantity"),
      returns: "CreateItemResult",
      resolve: () => ({ success: true }),
    })
  );

  // Convert to Nexus types
  const result = await gqlSpecToNexus(spec, "MutationTest");

  // Mutation type should exist
  assert(result.mutationType, "Should create a mutation type");
  assertEquals(
    result.mutationType.type,
    "Mutation",
    "Should extend the Mutation type",
  );

  // Check definition with mock builder
  let foundMutation = false;
  // Use mutation-specific config type
  type MutationConfig = {
    type: string;
    args: Record<string, unknown>;
    resolve?: (
      root: unknown,
      args: unknown,
      ctx: unknown,
      info: unknown,
    ) => unknown;
  };

  const mockBuilder = {
    field: (name: string, config: MutationConfig) => {
      if (name === "createItem") {
        foundMutation = true;
        // Check args
        assert(config.args.name, "Should have a name argument");
        assert(config.args.quantity, "Should have a quantity argument");
        // Check return type
        assertEquals(
          config.type,
          "CreateItemResult",
          "Should return the specified type",
        );
        // Check resolver exists
        assert(
          typeof config.resolve === "function",
          "Should have a resolver function",
        );
      }
      return mockBuilder;
    },
  };

  type MutationNexusBuilder = {
    field: (name: string, config: MutationConfig) => unknown;
  };
  result.mutationType.definition(mockBuilder as MutationNexusBuilder);
  assert(foundMutation, "Should define the mutation field");
});

Deno.test("gqlSpecToNexus includes default resolvers for fields", async () => {
  // Create spec with no custom resolvers
  const spec = makeGqlSpec((gql) => gql.string("autoResolved"));

  // Convert to Nexus types
  const result = await gqlSpecToNexus(spec, "ResolverTest");

  // Check that default resolver is included
  let hasResolver = false;
  const mockBuilder = {
    field: (name: string, config: FieldConfig) => {
      if (name === "autoResolved") {
        hasResolver = typeof config.resolve === "function";
      }
      return mockBuilder;
    },
  };

  result.mainType.definition(mockBuilder as NexusBuilder);
  assert(hasResolver, "Field should have a default resolver");
});

Deno.test("gqlSpecToNexus default resolver uses fallback chain", async () => {
  // Create spec with no custom resolvers
  const spec = makeGqlSpec((gql) => gql.string("field"));

  // Convert to Nexus types
  const result = await gqlSpecToNexus(spec, "FallbackTest");

  // Extract resolver for testing
  type ResolverFn = (
    root: unknown,
    args: unknown,
    ctx: unknown,
    info: unknown,
  ) => Promise<unknown> | unknown;

  let resolver: ResolverFn | undefined;
  const mockBuilder = {
    field: (name: string, config: FieldConfig) => {
      if (name === "field") {
        resolver = config.resolve as ResolverFn;
      }
      return mockBuilder;
    },
  };

  result.mainType.definition(mockBuilder as NexusBuilder);
  assert(resolver, "Field should have a resolver");

  // Test resolver with different root objects

  // 1. Root with property in props
  const root1 = { props: { field: "from props" } };
  assertEquals(
    await resolver(root1, {}, {}, {}),
    "from props",
    "Should resolve from props first",
  );

  // 2. Root with direct property
  const root2 = { field: "direct property" };
  assertEquals(
    await resolver(root2, {}, {}, {}),
    "direct property",
    "Should resolve from direct property",
  );

  // 3. Root with method
  const root3 = {
    // deno-lint-ignore no-explicit-any
    field: (args: any) => `method with args: ${args.test}`,
  };
  assertEquals(
    await resolver(root3, { test: "value" }, {}, {}),
    "method with args: value",
    "Should resolve by calling method with args",
  );

  // 4. Root with none of the above
  const root4 = { otherField: "wrong field" };
  assertEquals(
    await resolver(root4, {}, {}, {}),
    null,
    "Should resolve to null if not found",
  );
});
