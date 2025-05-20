/**
 * GraphQL Type Loading
 *
 * This file loads all GraphQL types using our builder pattern and generates the schema.
 * It automatically includes interfaces, object types, and mutations in the correct order.
 */

import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import * as rootsModule from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
// Import the loadInterfaces function to register GraphQL interfaces
import { loadInterfaces } from "apps/bfDb/graphql/graphqlInterfaces.ts";
// Import the correct type for GraphQL object constructors
import type { AnyGraphqlObjectBaseCtor } from "apps/bfDb/builders/bfDb/types.ts";
// Interface classes are automatically loaded via the barrel file in __generated__/interfacesList.ts

const roots = Object.values(rootsModule);

/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export function loadGqlTypes() {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const mutationTypes = [];

  // Add all defined interfaces
  types.push(...loadInterfaces());

  // The decorator-based approach for interface implementation will
  // automatically detect classes that extend a decorated parent class

  // Process each root object
  for (const root of roots) {
    const rootSpec = root.gqlSpec;
    const rootName = root.name;

    // Use our improved gqlSpecToNexus with class type for interface detection
    const nexusTypes = gqlSpecToNexus(rootSpec, rootName, {
      // Pass the class constructor for automatic parent interface detection
      classType: root as AnyGraphqlObjectBaseCtor,
    });

    // Create the main type
    const mainType = objectType(nexusTypes.mainType);
    types.push(mainType);

    // We'll add an extension if we detect an interface implementation
    // This is handled automatically by the interface detection in gqlSpecToNexus now

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
