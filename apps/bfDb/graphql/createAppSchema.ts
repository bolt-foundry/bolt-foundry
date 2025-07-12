/**
 * Fragment Composition System for GraphQL Schema
 *
 * This file provides a system for building GraphQL schemas from fragments,
 * allowing modular composition of queries and mutations while maintaining
 * backward compatibility with existing schema building.
 */

import { extendType, makeSchema, objectType } from "nexus";
import type { SchemaConfig } from "nexus/dist/builder.js";
import type { GraphQLSchema } from "graphql";
import { connectionPlugin } from "nexus";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import type {
  AnyBfNodeCtor,
  AnyGraphqlObjectBaseCtor,
} from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
import {
  type GqlNodeSpec,
  makeGqlSpec,
} from "@bfmono/apps/bfDb/builders/graphql/makeGqlSpec.ts";
import { loadInterfaces } from "@bfmono/apps/bfDb/graphql/graphqlInterfaces.ts";
import { IsoDate } from "@bfmono/apps/bfDb/graphql/scalars/IsoDate.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { QueryFragment } from "@bfmono/apps/bfDb/graphql/fragments/types.ts";

const logger = getLogger(import.meta);

/**
 * Configuration for creating an app schema
 */
export interface AppSchemaConfig {
  /** Node types to include in the schema */
  nodeTypes?: Array<AnyBfNodeCtor | AnyGraphqlObjectBaseCtor>;

  /** Query fragments to compose into the Query root */
  queryFragments?: Array<QueryFragment>;

  /** Mutation fragments to compose into the Mutation root */
  mutationFragments?: Array<MutationFragment>;

  /** Custom scalars to include (default: ["IsoDate"]) */
  customScalars?: Array<string>;

  /** Additional Nexus plugins to include */
  plugins?: Array<ReturnType<typeof connectionPlugin>>;

  /** Whether to enable backward compatibility mode (default: true) */
  backwardCompatibility?: boolean;
}

/**
 * A mutation fragment that can be composed into the Mutation root
 */
export interface MutationFragment {
  /** Unique identifier for this fragment */
  name?: string;

  /** GraphQL specification for the mutation fields */
  spec: GqlNodeSpec;

  /** Optional description */
  description?: string;

  /** Dependencies this fragment requires (node types, scalars, etc.) */
  dependencies?: Array<string>;
}

/**
 * Internal helper to merge multiple GqlNodeSpecs into a single spec
 */
function mergeGqlSpecs(specs: Array<GqlNodeSpec>): GqlNodeSpec {
  const merged: GqlNodeSpec = {
    fields: {},
    relations: {},
    connections: {},
    mutations: {},
  };

  for (const spec of specs) {
    // Merge fields
    Object.assign(merged.fields, spec.fields);

    // Merge relations
    Object.assign(merged.relations, spec.relations);

    // Merge connections
    if (spec.connections) {
      if (!merged.connections) merged.connections = {};
      Object.assign(merged.connections, spec.connections);
    }

    // Merge mutations
    Object.assign(merged.mutations, spec.mutations);
  }

  return merged;
}

/**
 * Creates a composed Query root from fragments
 */
function createComposedQueryRoot(
  fragments: Array<QueryFragment>,
): AnyGraphqlObjectBaseCtor {
  logger.debug(
    `Creating composed Query root from ${fragments.length} fragments`,
  );

  // Extract all the specs from fragments
  const specs = fragments.map((f) => f.spec);

  // Merge all specs into one
  const mergedSpec = mergeGqlSpecs(specs);

  // Create a dynamic Query class
  class ComposedQuery {
    static spec = mergedSpec;

    static get name() {
      return "Query";
    }

    toGraphql() {
      return { __typename: "Query", id: "Query" };
    }
  }

  return ComposedQuery as AnyGraphqlObjectBaseCtor;
}

/**
 * Creates a composed Mutation root from fragments
 */
function createComposedMutationRoot(
  fragments: Array<MutationFragment>,
): AnyGraphqlObjectBaseCtor {
  logger.debug(
    `Creating composed Mutation root from ${fragments.length} fragments`,
  );

  // Extract all the specs from fragments
  const specs = fragments.map((f) => f.spec);

  // Merge all specs into one
  const mergedSpec = mergeGqlSpecs(specs);

  // Create a dynamic Mutation class
  class ComposedMutation {
    static spec = mergedSpec;

    static get name() {
      return "Mutation";
    }

    toGraphql() {
      return { __typename: "Mutation", id: "Mutation" };
    }
  }

  return ComposedMutation as AnyGraphqlObjectBaseCtor;
}

/**
 * Loads and processes GraphQL types from the provided configuration
 */
async function loadTypesFromConfig(config: AppSchemaConfig) {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const mutationTypes = [];

  // Add custom scalars
  const scalars = config.customScalars || ["IsoDate"];
  for (const scalarName of scalars) {
    if (scalarName === "IsoDate") {
      types.push(IsoDate);
    }
    // Add other custom scalars as needed
  }

  // Add all defined interfaces
  types.push(...loadInterfaces());

  // Process node types
  const nodeTypes = config.nodeTypes || [];
  for (const nodeType of nodeTypes) {
    // Skip if it's not a class with gqlSpec
    // Type guard to check if the node type has gqlSpec
    if (!("gqlSpec" in nodeType) || typeof nodeType !== "function") continue;

    const nodeSpec =
      (nodeType as typeof nodeType & { gqlSpec: GqlNodeSpec }).gqlSpec;
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
      const mutationType = extendType(
        nexusTypes.mutationType as Parameters<typeof extendType>[0],
      );
      mutationTypes.push(mutationType);
    }
  }

  // Process composed Query root from fragments
  if (config.queryFragments && config.queryFragments.length > 0) {
    const composedQuery = createComposedQueryRoot(config.queryFragments);

    const nexusTypes = await gqlSpecToNexus(
      (composedQuery as typeof composedQuery & { spec: GqlNodeSpec }).spec,
      "Query",
      { classType: composedQuery },
    );

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
      const mutationType = extendType(
        nexusTypes.mutationType as Parameters<typeof extendType>[0],
      );
      mutationTypes.push(mutationType);
    }
  }

  // Process composed Mutation root from fragments
  if (config.mutationFragments && config.mutationFragments.length > 0) {
    const composedMutation = createComposedMutationRoot(
      config.mutationFragments,
    );

    const nexusTypes = await gqlSpecToNexus(
      (composedMutation as typeof composedMutation & { spec: GqlNodeSpec })
        .spec,
      "Mutation",
      { classType: composedMutation },
    );

    // Mutations are processed as extension types
    if (nexusTypes.mutationType) {
      const mutationType = extendType(
        nexusTypes.mutationType as Parameters<typeof extendType>[0],
      );
      mutationTypes.push(mutationType);
    }

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
  }

  // Return the types in the correct order for Nexus
  return [
    ...types,
    ...Object.values(payloadTypeObjects),
    ...mutationTypes,
  ];
}

/**
 * Creates a GraphQL schema from the provided configuration
 */
export async function createAppSchema(
  config: AppSchemaConfig,
): Promise<GraphQLSchema> {
  logger.debug("Creating app schema with fragment composition");

  // Load all types based on configuration
  const types = await loadTypesFromConfig(config);

  // Create base plugins array
  const plugins = [
    connectionPlugin({
      validateArgs: (args) => {
        if (args.first == null && args.last == null) {
          args.first = 10;
        }
        return args;
      },
      extendConnection: {
        count: {
          type: "Int",
          requireResolver: false,
        },
      },
      includeNodesField: true,
    }),
    ...(config.plugins || []),
  ];

  const schemaConfig: SchemaConfig = {
    types,
    features: {
      abstractTypeStrategies: {
        __typename: true,
        resolveType: true,
      },
    },
    plugins,
  };

  return makeSchema(schemaConfig);
}

/**
 * Helper function to create a query fragment
 */
export function createQueryFragment(
  name: string,
  definition: Parameters<typeof makeGqlSpec>[0],
  options?: {
    description?: string;
    dependencies?: Array<string>;
  },
): QueryFragment {
  return {
    name,
    spec: makeGqlSpec(definition),
    description: options?.description,
    dependencies: options?.dependencies,
  };
}

/**
 * Helper function to create a mutation fragment
 */
export function createMutationFragment(
  name: string,
  definition: Parameters<typeof makeGqlSpec>[0],
  options?: {
    description?: string;
    dependencies?: Array<string>;
  },
): MutationFragment {
  return {
    name,
    spec: makeGqlSpec(definition),
    description: options?.description,
    dependencies: options?.dependencies,
  };
}
