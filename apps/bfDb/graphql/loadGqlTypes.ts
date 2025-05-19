import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "apps/bfDb/graphql/roots/Waitlist.ts";
import { Query } from "apps/bfDb/graphql/roots/Query.ts";

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

  // Load the Query type using our new builder
  const querySpec = Query.gqlSpec;
  const queryNexusTypes = gqlSpecToNexus(querySpec, "Query");
  const QueryType = objectType(queryNexusTypes.mainType);

  // Note: JoinWaitlistPayload is now automatically generated from the returns builder

  // Load the Waitlist type using our new builder
  const waitlistSpec = Waitlist.gqlSpec;
  const waitlistNexusTypes = gqlSpecToNexus(waitlistSpec, "Waitlist");

  // Create types from the Nexus definitions
  const WaitlistType = objectType(waitlistNexusTypes.mainType);

  // Create the payload types
  const payloadTypeObjects: Record<string, unknown> = {};
  if (waitlistNexusTypes.payloadTypes) {
    for (
      const [typeName, typeDef] of Object.entries(
        waitlistNexusTypes.payloadTypes,
      )
    ) {
      payloadTypeObjects[typeName] = objectType(
        typeDef as Parameters<typeof objectType>[0],
      );
    }
  }

  // Create the mutation type if it exists
  let WaitlistMutation = null;
  if (waitlistNexusTypes.mutationType) {
    WaitlistMutation = extendType(waitlistNexusTypes.mutationType);
  }

  // Return the types - order matters for Nexus!
  // Return as an array since that's what Nexus expects
  const types = [
    QueryType,
    TestType,
    WaitlistType,
    ...Object.values(payloadTypeObjects),
  ];

  // Add mutation last (it references the payload types)
  if (WaitlistMutation) {
    types.push(WaitlistMutation);
  }

  return types;
}
