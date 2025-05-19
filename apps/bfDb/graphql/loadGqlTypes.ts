import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import * as rootsModule from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";

const roots = Object.values(rootsModule);
/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export function loadGqlTypes() {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const mutationTypes = [];

  // Process each root object
  for (const root of roots) {
    const rootSpec = root.gqlSpec;
    const rootName = root.name;
    const nexusTypes = gqlSpecToNexus(rootSpec, rootName);

    // Create the main type
    const mainType = objectType(nexusTypes.mainType);
    types.push(mainType);

    // Process payload types if they exist
    if (nexusTypes.payloadTypes) {
      for (
        const [typeName, typeDef] of Object.entries(
          nexusTypes.payloadTypes,
        )
      ) {
        payloadTypeObjects[typeName] = objectType(
          typeDef as Parameters<typeof objectType>[0],
        );
      }
    }

    // Create the mutation type if it exists
    if (nexusTypes.mutationType) {
      const mutationType = extendType(nexusTypes.mutationType);
      mutationTypes.push(mutationType);
    }
  }

  // Return the types - order matters for Nexus!
  // Add all main types first, then payload types, then mutations last
  return [
    ...types,
    ...Object.values(payloadTypeObjects),
    ...mutationTypes,
  ];
}
