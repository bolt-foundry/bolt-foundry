/**
 * GraphQL Type Loading
 *
 * This file loads all GraphQL types using our builder pattern and generates the schema.
 * It automatically includes interfaces, object types, and mutations in the correct order.
 */

import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import * as rootsModule from "@bfmono/apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import * as nodeTypesModule from "@bfmono/apps/bfDb/models/__generated__/nodeTypesList.ts";
// Import the loadInterfaces function to register GraphQL interfaces
import { loadInterfaces } from "@bfmono/apps/bfDb/graphql/graphqlInterfaces.ts";
// Import the correct type for GraphQL object constructors
import type { AnyGraphqlObjectBaseCtor } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
// Import custom scalars
import { IsoDate } from "@bfmono/apps/bfDb/graphql/scalars/IsoDate.ts";
// Interface classes are automatically loaded via the barrel file in __generated__/interfacesList.ts

const roots = Object.values(rootsModule);
const nodeTypes = Object.values(nodeTypesModule);

/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export async function loadGqlTypes() {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const mutationTypes = [];

  // Add custom scalars
  types.push(IsoDate);

  // Add all defined interfaces
  types.push(...loadInterfaces());

  // The decorator-based approach for interface implementation will
  // automatically detect classes that extend a decorated parent class

  // Process all node types first (they can be referenced by roots)
  for (const nodeType of nodeTypes) {
    // Skip if it's not a class with gqlSpec
    if (!nodeType.gqlSpec || typeof nodeType !== "function") continue;

    const nodeSpec = nodeType.gqlSpec;
    const nodeName = nodeType.name;

    const nexusTypes = await gqlSpecToNexus(nodeSpec, nodeName, {
      classType: nodeType as AnyGraphqlObjectBaseCtor,
    });

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
      // deno-lint-ignore no-explicit-any
      const mutationType = extendType(nexusTypes.mutationType as any);
      mutationTypes.push(mutationType);
    }
  }

  // Process each root object
  for (const root of roots) {
    const rootSpec = root.gqlSpec;
    const rootName = root.name;

    // Use our improved gqlSpecToNexus with class type for interface detection
    const nexusTypes = await gqlSpecToNexus(rootSpec, rootName, {
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
      // deno-lint-ignore no-explicit-any
      const mutationType = extendType(nexusTypes.mutationType as any);
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
