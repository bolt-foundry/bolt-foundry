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
import { JSON } from "@bfmono/apps/bfDb/graphql/scalars/JSON.ts";
// Import interface detection utilities
import {
  getGraphQLInterfaceMetadata,
  isGraphQLInterface,
} from "@bfmono/apps/bfDb/graphql/decorators.ts";
// Interface classes are automatically loaded via the barrel file in __generated__/interfacesList.ts
// Import concrete CurrentViewer types that implement the interface
import {
  CurrentViewerLoggedIn,
  CurrentViewerLoggedOut,
} from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

const roots = Object.values(rootsModule);
const nodeTypes = Object.values(nodeTypesModule);

// Add concrete CurrentViewer types to the nodeTypes array
const currentViewerTypes = [CurrentViewerLoggedIn, CurrentViewerLoggedOut];
const allNodeTypes = [...nodeTypes, ...currentViewerTypes];

/**
 * Automatically detect which GraphQL interfaces a class implements
 * by walking up the prototype chain and checking for @GraphQLInterface decorators
 */
function getImplementedInterfaces(classType: any): Array<string> {
  const interfaces: Array<string> = [];
  let currentClass = Object.getPrototypeOf(classType);

  // Walk up the prototype chain looking for interfaces
  while (currentClass && currentClass.name !== "Object") {
    if (isGraphQLInterface(currentClass)) {
      const metadata = getGraphQLInterfaceMetadata(currentClass);
      if (metadata?.name) {
        interfaces.push(metadata.name);
      }
    }
    currentClass = Object.getPrototypeOf(currentClass);
  }

  return interfaces;
}

/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export async function loadGqlTypes() {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const allMutations: Record<string, unknown> = {};

  // Add custom scalars
  types.push(IsoDate);
  types.push(JSON);

  // Add all defined interfaces
  types.push(...loadInterfaces());

  // The decorator-based approach for interface implementation will
  // automatically detect classes that extend a decorated parent class

  // FIRST PASS: Collect all mutations from all classes
  const allClasses = [...allNodeTypes, ...roots];
  for (const classType of allClasses) {
    // Skip if it's not a class with gqlSpec
    if (
      typeof classType !== "function" || !("gqlSpec" in classType) ||
      !classType.gqlSpec
    ) continue;

    const spec = classType.gqlSpec;

    // Collect mutations from this class
    if (spec.mutations && Object.keys(spec.mutations).length > 0) {
      Object.assign(allMutations, spec.mutations);
    }
  }

  // SECOND PASS: Process all node types (they can be referenced by roots)
  for (const nodeType of allNodeTypes) {
    // Skip if it's not a class with gqlSpec
    if (
      typeof nodeType !== "function" || !("gqlSpec" in nodeType) ||
      !nodeType.gqlSpec
    ) continue;

    const nodeSpec = nodeType.gqlSpec;
    const nodeName = nodeType.name;

    const nexusTypes = await gqlSpecToNexus(nodeSpec, nodeName, {
      classType: nodeType as AnyGraphqlObjectBaseCtor,
    });

    // Automatically detect implemented interfaces
    const implementedInterfaces = getImplementedInterfaces(nodeType);

    // Debug logging for CurrentViewer types
    if (
      nodeName === "CurrentViewerLoggedIn" ||
      nodeName === "CurrentViewerLoggedOut"
    ) {
      console.log(`${nodeName} implements interfaces:`, implementedInterfaces);
    }

    const mainType = implementedInterfaces.length > 0
      ? objectType({
        ...nexusTypes.mainType,
        definition(t) {
          nexusTypes.mainType.definition(t);
        },
        interfaces: implementedInterfaces,
      })
      : objectType(nexusTypes.mainType);
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

    // Note: We skip mutationType here since we're handling all mutations centrally
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

    // Note: We skip mutationType here since we're handling all mutations centrally
  }

  // THIRD PASS: Create a single consolidated Mutation type if there are any mutations
  const finalMutationTypes = [];
  if (Object.keys(allMutations).length > 0) {
    // Create a fake spec with all mutations to reuse existing gqlSpecToNexus logic
    const consolidatedSpec = {
      fields: {},
      relations: {},
      connections: {},
      mutations: allMutations,
    };

    const nexusTypes = await gqlSpecToNexus(
      consolidatedSpec,
      "ConsolidatedMutations",
      {},
    );

    if (nexusTypes.mutationType) {
      const consolidatedMutationType = extendType(
        nexusTypes.mutationType as Parameters<typeof extendType>[0],
      );
      finalMutationTypes.push(consolidatedMutationType);
    }

    // Also add any additional payload types from mutations
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
  }

  // Return the types - order matters for Nexus!
  // Add all main types first, then payload types, then mutations last
  return [
    ...types,
    ...Object.values(payloadTypeObjects),
    ...finalMutationTypes,
  ];
}
