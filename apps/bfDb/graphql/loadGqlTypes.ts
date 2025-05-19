import { objectType, queryType } from "nexus";

/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export function loadGqlTypes() {
  // Create a test GraphQL type directly with Nexus to verify schema generation
  const TestType = objectType({
    name: "TestType",
    definition(t) {
      t.string("name");
      t.nonNull.id("id");
      t.boolean("isActive");
      t.int("count");
    },
  });

  // Create a query type that returns our test type
  const Query = queryType({
    definition(t) {
      // Test field
      t.field("test", {
        type: "TestType",
        resolve: () => ({
          id: "test-123",
          name: "Test Object",
          isActive: true,
          count: 42,
        }),
      });

      // Health check
      t.nonNull.boolean("ok", {
        resolve: () => true,
      });
    },
  });

  // Return the types
  return {
    Query,
    TestType,
  };
}
