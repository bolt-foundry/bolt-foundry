import { extendType, objectType, queryType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "apps/bfDb/graphql/roots/Waitlist.ts";

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

  // Create the JoinWaitlistPayload type manually for now
  const JoinWaitlistPayload = objectType({
    name: "JoinWaitlistPayload",
    definition(t) {
      t.nonNull.boolean("success");
      t.string("message");
    },
  });

  // Load the Waitlist type using our new builder
  const waitlistSpec = Waitlist.gqlSpec;
  const waitlistNexusTypes = gqlSpecToNexus(waitlistSpec, "Waitlist");

  // Create types from the Nexus definitions
  const WaitlistType = objectType(waitlistNexusTypes.mainType);

  // Create the mutation type if it exists
  let WaitlistMutation = null;
  if (waitlistNexusTypes.mutationType) {
    WaitlistMutation = extendType(waitlistNexusTypes.mutationType);
  }

  // Return the types
  const types = {
    Query,
    TestType,
    Waitlist: WaitlistType,
    JoinWaitlistPayload,
    ...(WaitlistMutation ? { Mutation: WaitlistMutation } : {}),
  };

  return types;
}
