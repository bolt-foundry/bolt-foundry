/**
 * gqlSpecToNexus.ts
 *
 * Converts GqlNodeSpec to Nexus types for schema generation.
 */

import type { GraphQLResolveInfo } from "graphql";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { GqlNodeSpec } from "./makeGqlBuilder.ts";

/**
 * Creates a nonNull wrapper for a GraphQL type
 * This matches the Nexus nonNull wrapper format expected by the tests
 */
function createNonNullType(type: string) {
  return {
    _name: `${type}!`,
    ofType: type,
  };
}

/**
 * Default resolver for scalar fields that follows the standardized fallback chain:
 * 1. Try root.props[fieldName]
 * 2. Try root[fieldName] as property or method
 * 3. Return null if all else fails
 */
function createDefaultFieldResolver(fieldName: string) {
  return function defaultResolver(
    // deno-lint-ignore no-explicit-any
    root: any,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) {
    // Try props first (BfNode standard pattern)
    if (root.props && fieldName in root.props) {
      return root.props[fieldName];
    }

    // Then try direct property/method
    if (fieldName in root) {
      const value = root[fieldName];
      if (typeof value === "function") {
        return value.call(root, args, ctx, info);
      }
      return value;
    }

    // Nothing found, return null
    return null;
  };
}

/**
 * Default resolver for relations that follows the relation fallback chain:
 * 1. Try root.relations[relationName]
 * 2. Try root[relationName] as method or property
 * 3. Return null if all else fails
 */
function createDefaultRelationResolver(relationName: string) {
  return function defaultRelationResolver(
    // deno-lint-ignore no-explicit-any
    root: any,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
  ) {
    // Try from relations first
    if (root.relations && relationName in root.relations) {
      return root.relations[relationName];
    }

    // Try as a method
    if (typeof root[relationName] === "function") {
      return root[relationName](args, ctx);
    }

    // Try as a property
    if (relationName in root) {
      return root[relationName];
    }

    return null;
  };
}

/**
 * Default resolver for mutations
 */
function createDefaultMutationResolver(mutationName: string) {
  return function defaultMutationResolver(
    // deno-lint-ignore no-explicit-any
    root: any,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) {
    // Mutations should be methods on the root object
    if (typeof root[mutationName] === "function") {
      return root[mutationName](args, ctx, info);
    }
    return null;
  };
}

/**
 * Converts a GqlNodeSpec to Nexus types for schema generation
 *
 * @param spec The GraphQL node specification
 * @param typeName The name of the GraphQL type
 * @returns Nexus compatible type definitions for main type and mutation type
 */
export function gqlSpecToNexus(spec: GqlNodeSpec, typeName: string) {
  // Create the main object type definition
  const mainType = {
    name: typeName,
    // deno-lint-ignore no-explicit-any
    definition(t: any) {
      // Process fields
      for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
        // deno-lint-ignore no-explicit-any
        const field = fieldDef as any;

        // Determine field type
        let fieldType = field.type;

        // Handle nonNull fields
        if (field.nonNull) {
          fieldType = createNonNullType(field.type);
        }

        // Add field to the object type
        t.field(fieldName, {
          type: fieldType,
          description: field.description,
          // Handle arguments if provided
          args: field.args || {},
          // Add resolver with fallback chain
          resolve: field.resolve || createDefaultFieldResolver(fieldName),
        });
      }

      // Process relations (object fields)
      for (
        const [relationName, relationDef] of Object.entries(spec.relations)
      ) {
        // deno-lint-ignore no-explicit-any
        const relation = relationDef as any;

        t.field(relationName, {
          type: relation.type,
          description: relation.description,
          // Handle arguments if provided
          args: relation.args || {},
          // Add resolver with proper fallback for relations
          resolve: relation.resolve ||
            createDefaultRelationResolver(relationName),
        });
      }
    },
  };

  // Create mutation type if there are mutations defined
  let mutationType = null;
  if (Object.keys(spec.mutations).length > 0) {
    mutationType = {
      type: "Mutation",
      // deno-lint-ignore no-explicit-any
      definition(t: any) {
        // Add each mutation field to the Mutation type
        for (
          const [mutationName, mutationDef] of Object.entries(spec.mutations)
        ) {
          // deno-lint-ignore no-explicit-any
          const mutation = mutationDef as any;

          t.field(mutationName, {
            type: mutation.returns || "JSON",
            description: mutation.description,
            // Handle mutation arguments
            args: mutation.args || {},
            // Add resolver with mutation-specific fallback
            resolve: mutation.resolve ||
              createDefaultMutationResolver(mutationName),
          });
        }
      },
    };
  }

  return {
    mainType,
    mutationType,
  };
}
