/**
 * GraphQL integration for automatic relationship methods.
 * Extends GraphQL specs with fields for relationships defined in bfNodeSpec.
 */

import type {
  GqlConnectionDef,
  GqlRelationDef,
} from "@bfmono/apps/bfDb/builders/graphql/types/graphqlTypes.ts";
import type {
  GqlBuilder,
  GqlNodeSpec,
} from "@bfmono/apps/bfDb/builders/graphql/makeGqlBuilder.ts";
import type {
  AnyBfNodeCtor,
  RelationSpec,
} from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
import { makeGqlBuilder } from "@bfmono/apps/bfDb/builders/graphql/makeGqlBuilder.ts";
import { makeGqlSpec } from "@bfmono/apps/bfDb/builders/graphql/makeGqlSpec.ts";
// import type { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";

/**
 * Extends a GraphQL spec with fields for relationships defined in the BfNode spec.
 *
 * For one-to-one relationships:
 * - Adds an object field with the relationship name
 * - The field returns the related node type
 * - No custom resolver needed (uses edge relationship)
 *
 * For many-to-many relationships:
 * - Adds a connection field with the relationship name
 * - Returns a Relay-style connection
 * - Placeholder implementation (will be fully implemented in Phase 6)
 *
 * @param nodeClass - The BfNode class to get relationships from
 * @param baseSpec - The base GraphQL spec to extend
 * @returns Extended GraphQL spec with relationship fields
 */
export function extendGqlSpecWithRelationships<
  TNodeClass extends AnyBfNodeCtor,
>(
  nodeClass: TNodeClass,
  baseSpec: GqlNodeSpec,
): GqlNodeSpec {
  // deno-lint-ignore no-explicit-any
  const bfNodeSpec = (nodeClass as any).bfNodeSpec as {
    // deno-lint-ignore no-explicit-any
    fields: any;
    relations: Record<string, RelationSpec>;
  } | undefined;

  if (!bfNodeSpec || !bfNodeSpec.relations) {
    // No relationships defined, return base spec as-is
    return baseSpec;
  }

  // Create a new spec with the base fields
  const extendedSpec: GqlNodeSpec = {
    ...baseSpec,
    relations: { ...baseSpec.relations },
    connections: { ...baseSpec.connections },
  };

  // Add fields for each relationship
  for (
    const [relationName, relationSpec] of Object.entries(bfNodeSpec.relations)
  ) {
    const relation = relationSpec as RelationSpec;

    if (relation.cardinality === "one") {
      // Add object field for one-to-one relationship
      const relationDef: GqlRelationDef = {
        type: "relation",
        _targetThunk: relation.target,
        // No resolver - this will become an edge relationship
      };

      extendedSpec.relations[relationName] = relationDef;
    } else {
      // Add connection field for many-to-many relationship (placeholder)
      // This will be fully implemented in Phase 6
      const connectionDef: GqlConnectionDef = {
        type: "connection",
        _targetThunk: relation.target,
        args: undefined, // Default connection args
        // deno-lint-ignore no-explicit-any
        resolve: async (_root: any, args: any, _ctx: any) => {
          // Placeholder implementation
          // In Phase 6, this will call the generated many() methods
          const targetClass = await resolveThunk(relation.target);
          // deno-lint-ignore no-explicit-any
          return (targetClass as any).connection([], args);
        },
      };

      if (!extendedSpec.connections) {
        extendedSpec.connections = {};
      }
      extendedSpec.connections[relationName] = connectionDef;
    }
  }

  return extendedSpec;
}

/**
 * Creates a new GraphQL spec by extending a base spec with relationship fields.
 * This is used by the defineGqlNodeWithRelations static method.
 *
 * @param nodeClass - The BfNode class to get relationships from
 * @param builder - The GraphQL builder function
 * @returns Complete GraphQL spec with relationship fields
 */
export function defineGqlNodeWithRelationships<
  TNodeClass extends AnyBfNodeCtor,
  // deno-lint-ignore no-explicit-any
  R extends Record<string, any>,
>(
  nodeClass: TNodeClass,
  builder: (gql: GqlBuilder<R>) => GqlBuilder<R>,
): GqlNodeSpec {
  // First, build the base spec using the provided builder
  const gqlBuilder = makeGqlBuilder<R>();
  const finalBuilder = builder(gqlBuilder);
  const baseSpec = makeGqlSpec(() => finalBuilder);

  // Then extend it with relationship fields
  return extendGqlSpecWithRelationships(nodeClass, baseSpec);
}

/**
 * Creates a GraphQL spec that includes relationship fields.
 * This is a convenience function for nodes that want to include
 * all their relationships in their GraphQL schema.
 *
 * @param nodeClass - The BfNode class to create spec for
 * @param baseSpec - Optional base spec to extend (defaults to empty spec)
 * @returns GraphQL spec with relationship fields
 */
export function createGqlSpecWithRelationships<
  TNodeClass extends AnyBfNodeCtor,
>(
  nodeClass: TNodeClass,
  baseSpec?: GqlNodeSpec,
): GqlNodeSpec {
  const spec = baseSpec || (() => {
    const builder = makeGqlBuilder();
    return makeGqlSpec(() => builder);
  })();
  return extendGqlSpecWithRelationships(nodeClass, spec);
}

/**
 * Helper to resolve a type thunk to the actual class.
 * Used internally for connection resolvers.
 */
async function resolveThunk(
  thunk: () => AnyBfNodeCtor | Promise<{ [key: string]: AnyBfNodeCtor }>,
): Promise<AnyBfNodeCtor> {
  const result = await thunk();

  // Handle module imports that return an object with the class as a property
  if (typeof result === "object" && result !== null) {
    // Find the first BfNode subclass in the module
    for (const value of Object.values(result)) {
      if (
        typeof value === "function" &&
        value.prototype &&
        "bfGid" in value.prototype
      ) {
        return value as AnyBfNodeCtor;
      }
    }
    throw new Error("Could not find BfNode class in module");
  }

  return result;
}
