import type { GqlBuilder, GqlNodeSpec } from "./makeGqlBuilder.ts";
import { makeGqlBuilder } from "./makeGqlBuilder.ts";

// Re-export the GqlNodeSpec type
export type { GqlNodeSpec } from "./makeGqlBuilder.ts";

/**
 * Creates a GraphQL node spec using the builder pattern.
 * Similar to how bfDb's makeSpec works, this collects the fields, relations,
 * and mutations with their return types.
 */
export function makeGqlSpec(
  build: (gql: GqlBuilder) => GqlBuilder,
): GqlNodeSpec {
  if (!build) {
    throw new Error("Builder function is required");
  }

  // Create and configure the builder
  const gqlBuilder = makeGqlBuilder();

  // Run the builder function with nonNull support
  build(gqlBuilder);

  // Return the built spec, including mutations and connections
  return {
    fields: gqlBuilder._spec.fields,
    relations: gqlBuilder._spec.relations,
    mutations: gqlBuilder._spec.mutations,
    connections: gqlBuilder._spec.connections,
  };
}
