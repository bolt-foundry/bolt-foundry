import type { GraphQLInputFieldMap } from "graphql";
import type { GqlNodeSpec } from "./makeGqlBuilder.ts";
import type {
  AnyBfNodeCtor,
  AnyConstructor,
  AnyGraphqlObjectBaseCtor,
} from "apps/bfDb/builders/bfDb/types.ts";
import type {} from "./types/resolverTypes.ts";
// Keeping the imports since we'll need them later, but marking them as unused to satisfy the linter
import type {
  GqlFieldDef as _GqlFieldDef,
  GqlMutationDef as _GqlMutationDef,
  GqlRelationDef as _GqlRelationDef,
  GraphQLRootObject as _GraphQLRootObject,
} from "./types/nexusTypes.ts";

type MaybePromise<T> = T | Promise<T>;

/**
 * Type definition for an edge relationship specification
 *
 * This defines how an edge relationship is represented in the GraphQL schema
 * and provides the information needed to resolve the relationship at runtime.
 */
type EdgeRelationshipSpec = {
  /** GraphQL type name (initially same as field name) */
  type: string;

  /** GraphQL field arguments (from nexus/graphql) */
  args: GraphQLInputFieldMap;

  /** Direction of the relationship: true = source→target, false = target→source */
  isSourceToTarget: boolean;

  /** Function that returns the target type constructor, used for runtime resolution */
  _targetThunk: () => MaybePromise<
    AnyBfNodeCtor | AnyGraphqlObjectBaseCtor | AnyConstructor
  >;
};

/**
 * Creates a nonNull wrapper for a GraphQL type
 * This matches the Nexus nonNull wrapper format expected by the tests
 */
// Function is not used yet but will be used later
function _createNonNullWrapper<T>(type: T): { nonNull: T } {
  return { nonNull: type };
}

/**
 * Detects interfaces implemented by a class
 * @param classConstructor The class constructor to check for implemented interfaces
 * @returns Array of interface names implemented by the class
 */
// deno-lint-ignore no-explicit-any
export function detectImplementedInterfaces(_classConstructor: any): string[] {
  // This is just a scaffold - will be implemented later
  // The test should fail because we return an empty array
  return [];
}

/**
 * Creates a GraphQL interface from a class
 * @param classConstructor The class constructor to create an interface from
 * @returns Nexus interface definition
 */
// deno-lint-ignore no-explicit-any
export function createInterfaceFromClass(_classConstructor: any): any {
  // This is just a scaffold - will be implemented later
  // The test should fail because we return an object without proper properties
  return {
    name: "Unknown",
    kind: "interface",
    definition: () => {},
  };
}

/**
 * Creates a GraphQL object type from a class
 * @param classConstructor The class constructor to create an object type from
 * @returns Nexus object type definition
 */
// deno-lint-ignore no-explicit-any
export function createObjectTypeFromClass(classConstructor: any): any {
  // This is just a scaffold - will be implemented later
  // The test should fail because we return an object without proper properties
  return {
    name: classConstructor.name,
    kind: "object",
  };
}

/**
 * Converts a GqlNodeSpec to Nexus types
 * @param spec The GqlNodeSpec to convert
 * @param typeName The name of the GraphQL type
 * @returns Nexus type definitions
 */
export function gqlSpecToNexus(_spec: GqlNodeSpec, typeName: string) {
  // Return structure that matches the expected return type in loadGqlTypes.ts
  return {
    mainType: {
      name: typeName,
      // deno-lint-ignore no-explicit-any
      definition(_t: any) {
        // Empty implementation - will be filled in when we implement the full solution
      },
    },
    payloadTypes: {},
    mutationType: {
      type: "Mutation",
      // deno-lint-ignore no-explicit-any
      definition(_t: any) {
        // Empty implementation - will be filled in when we implement the full solution
      },
    },
  };
}