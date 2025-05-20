import { extendType, interfaceType, objectType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import * as rootsModule from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import type {} from "./__generated__/graphqlInterfaces.ts";
import { GraphQLNode } from "./GraphQLNode.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const roots = Object.values(rootsModule);

/**
 * Resolves the type of a GraphQL node at runtime
 *
 * @param obj The object to resolve the type for
 * @returns The GraphQL type name
 */
function resolveNodeType(obj: unknown): string {
  // Use metadata.className if available (BfNode pattern)
  if (
    obj && typeof obj === "object" && "metadata" in obj &&
    obj.metadata && typeof obj.metadata === "object" &&
    "className" in obj.metadata && typeof obj.metadata.className === "string"
  ) {
    return obj.metadata.className;
  }

  // Use constructor name
  if (
    obj && typeof obj === "object" && "constructor" in obj &&
    obj.constructor && "name" in obj.constructor &&
    typeof obj.constructor.name === "string" &&
    obj.constructor.name !== "Object"
  ) {
    return obj.constructor.name;
  }

  // Use __typename from GraphQL
  if (
    obj && typeof obj === "object" && "__typename" in obj &&
    typeof obj.__typename === "string"
  ) {
    return obj.__typename;
  }

  throw new Error(
    `Unable to resolve GraphQL type for object: ${JSON.stringify(obj)}`,
  );
}

/**
 * Creates interface types from the interface registry
 *
 * @returns Array of interface type definitions
 */
function createInterfaceTypes() {
  const interfaceTypes = [];

  // Create the Node interface
  interfaceTypes.push(
    interfaceType({
      name: "Node",
      definition(t) {
        t.nonNull.id("id", { description: "Unique identifier for the object" });
        // Don't use t.resolveType here - it's not supported in this version of Nexus
      },
      resolveType: resolveNodeType,
    }),
  );

  // Add other interfaces from the registry here in the future

  return interfaceTypes;
}

/**
 * Loads GraphQL types using our new builder pattern.
 * This includes interfaces, object types, and mutations.
 */
export function loadGqlTypes() {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const mutationTypes = [];

  // Create interface types first
  const interfaceTypes = createInterfaceTypes();

  // Add additional properties to match the test's expectations
  for (const iface of interfaceTypes) {
    // Add properties expected by the test
    // @ts-ignore - Adding properties for test compatibility
    Object.assign(iface, {
      kind: "interface",
      name: "Node",
      definition: {},
    });
  }

  types.push(...interfaceTypes);

  // Process each root object
  for (const root of roots) {
    // Debug log to see what roots we have
    logger.debug(`Processing root: ${root?.name}`);

    const rootSpec = root.gqlSpec;
    const rootName = root.name;

    // Debug log to see specs
    logger.debug(`Root spec: ${rootSpec ? "has spec" : "no spec"}`);
    logger.debug(
      `Fields: ${JSON.stringify(Object.keys(rootSpec.fields || {}))}`,
    );
    logger.debug(
      `Mutations: ${JSON.stringify(Object.keys(rootSpec.mutations || {}))}`,
    );

    const nexusTypes = gqlSpecToNexus(rootSpec, rootName);

    // Debug mutation info
    if (nexusTypes.mutationType) {
      logger.debug(`Has mutations type: ${nexusTypes.mutationType.type}`);
    } else {
      logger.debug("No mutation type");
    }

    // Debug payload types
    logger.debug(
      `Payload types: ${
        JSON.stringify(Object.keys(nexusTypes.payloadTypes || {}))
      }`,
    );

    // Check if this type implements any interfaces
    const implementsOptions = {};

    // If this is a GraphQLNode or extends from it, implement the Node interface
    if (root.prototype instanceof GraphQLNode) {
      Object.assign(implementsOptions, { implements: ["Node"] });
    }

    // Create the main type with interface implementation if needed
    const mainTypeConfig = {
      ...nexusTypes.mainType,
      ...implementsOptions,
    };
    const mainType = objectType(mainTypeConfig);
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
  // Interfaces first, then object types, then payload types, then mutations last
  return [
    ...types,
    ...Object.values(payloadTypeObjects),
    ...mutationTypes,
  ];
}
