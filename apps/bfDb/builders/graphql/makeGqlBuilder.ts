import type { GraphQLResolveInfo } from "graphql";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/builders/bfDb/types.ts";
import { type ArgsBuilder, makeArgBuilder } from "./makeArgBuilder.ts";

type ThisNode = InstanceType<AnyBfNodeCtor>;

/**
 * Represents a value that may be a Promise or a direct value
 */
type MaybePromise<T> = T | Promise<T>;

/**
 * Function that returns a GraphQL object type constructor
 * Used for thunk-style references to break circular dependencies
 *
 * The returned value can be:
 * 1. A concrete class constructor (BfOrganization)
 * 2. An abstract class constructor (BfNode)
 * 3. A module promise with a named export (.then(m => m.BfOrganization))
 */
// deno-lint-ignore no-explicit-any
type GqlObjectThunk = () => MaybePromise<any>; // Any is necessary to support various constructor forms

/** Generic placeholder for a mutation's payload */
type NMutationPayload = Record<string, unknown>;

/**
 * Helper type to create nonNull version of the builder
 * This removes the nonNull property to prevent chaining like .nonNull.nonNull
 */
export type OmitNonNull<T> = Omit<T, "nonNull">;

/**
 * GqlNodeSpec type that represents the structure built by the builder
 */
export interface GqlNodeSpec {
  fields: Record<string, unknown>;
  relations: Record<string, unknown>;
  mutations: Record<string, unknown>;
}

/**
 * Main GraphQL builder interface
 */
export interface GqlBuilder<
  R extends Record<string, unknown> = Record<string, unknown>,
> {
  string<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<string>;
    },
  ): GqlBuilder<R>;

  int<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<number>;
    },
  ): GqlBuilder<R>;

  boolean<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<boolean>;
    },
  ): GqlBuilder<R>;

  id<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<string>;
    },
  ): GqlBuilder<R>;

  /**
   * Define an object field that represents an edge relationship to another object type.
   *
   * @param name The field name, which will also serve as the edge role name
   * @param targetThunk Function that returns the target object type constructor
   * @param opts Optional configuration for edge relationship
   * @returns The builder instance for method chaining
   *
   * @example
   * // Define a relationship to BfOrganization
   * .object("memberOf", () => BfOrganization)
   *
   * // With dynamic import to handle circular dependencies
   * .object("memberOf", () => import("apps/bfDb/nodeTypes/BfOrganization.ts").then(m => m.BfOrganization))
   *
   * // With custom arguments
   * .object("memberOf", () => BfOrganization, {
   *   args: (a) => a.string("filterBy")
   * })
   *
   * // Custom resolver (not an edge relationship when custom resolver is provided)
   * .object("memberOf", () => BfOrganization, {
   *   resolve: (root, args, ctx) => ctx.getOrganizationForUser(root.id)
   * })
   *
   * // Change relationship direction (default is source→target)
   * .object("follows", () => BfPerson, {
   *   isSourceToTarget: false // Makes this a target→source relationship
   * })
   */
  object<N extends keyof R & string>(
    name: N,
    targetThunk: GqlObjectThunk,
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<R[N]>;
      isSourceToTarget?: boolean; // Defaults to true (source->target)
    },
  ): GqlBuilder<R>;

  connection<N extends keyof R & string>(
    name: N,
    opts?: {
      additionalArgs?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: ConnectionArguments & Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<Connection<ThisNode>>;
    },
  ): GqlBuilder<R>;

  mutation<N extends string>(
    name: N,
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      returns?: string;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<NMutationPayload>;
    },
  ): GqlBuilder<R>;

  // Add nonNull property for creating required fields
  nonNull: OmitNonNull<GqlBuilder<R>>;

  _spec: {
    fields: Record<string, unknown>;
    relations: Record<string, unknown>;
    mutations: Record<string, unknown>;
  };
}

/**
 * Creates a GraphQL builder for defining GraphQL types
 */
// Edge property building will be implemented in a future version if needed

/**
 * Creates a GraphQL builder for defining GraphQL types
 */
export function makeGqlBuilder<
  R extends Record<string, unknown> = Record<string, unknown>,
>(): GqlBuilder<R> {
  // Internal spec that's built up as methods are called
  const spec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
  };

  // Create the builder with all scalar field methods
  const builder: GqlBuilder<R> = {
    string(name, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      spec.fields[name] = {
        type: "String",
        nonNull: false,
        args: opts.args ? argFn(opts.args) : {},
        resolve: opts.resolve,
      };
      return builder;
    },

    int(name, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      spec.fields[name] = {
        type: "Int",
        nonNull: false,
        args: opts.args ? argFn(opts.args) : {},
        resolve: opts.resolve,
      };
      return builder;
    },

    boolean(name, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      spec.fields[name] = {
        type: "Boolean",
        nonNull: false,
        args: opts.args ? argFn(opts.args) : {},
        resolve: opts.resolve,
      };
      return builder;
    },

    id(name, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      spec.fields[name] = {
        type: "ID",
        nonNull: false,
        args: opts.args ? argFn(opts.args) : {},
        resolve: opts.resolve,
      };
      return builder;
    },

    object(name, targetThunk, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      // The field name is used as the GraphQL type name initially
      // This will be resolved at runtime using the targetThunk
      const typeName = name;

      // Store the thunk function for later resolution
      const _targetThunk = targetThunk;

      // Process args function if provided
      const args = opts.args ? argFn(opts.args) : {};

      // By default, all object fields without a custom resolver are edge relationships
      const isEdgeRelationship = !opts.resolve;

      // Store the relation definition with edge relationship info
      spec.relations[name] = {
        type: typeName,
        args: args,
        resolve: opts.resolve,
        // Edge relationship properties - implicitly created for fields without custom resolvers
        isEdgeRelationship: isEdgeRelationship,
        edgeRole: name, // The field name itself is the role
        isSourceToTarget: opts.isSourceToTarget !== false, // Default to true
        // Store the thunk function for later use
        _targetThunk: _targetThunk,
      };
      return builder;
    },

    connection(_name, _opts = {}) {
      // Stub for connection implementation - will be expanded later
      return builder;
    },

    mutation(name, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      // Create and collect arguments if provided
      const args = opts.args ? argFn(opts.args) : {};

      // Store the mutation definition
      spec.mutations[name] = {
        returns: opts.returns || "JSON",
        args: args,
        resolve: opts.resolve,
      };
      return builder;
    },

    // NonNull property for required fields
    get nonNull() {
      // Create a new object (not a copy) to avoid reference loops
      const nonNullBuilder: OmitNonNull<GqlBuilder<R>> = {
        // Override scalar field methods to set nonNull flag
        string: (name, opts = {}) => {
          // Create the argument builder function
          const argFn = makeArgBuilder();

          spec.fields[name] = {
            type: "String",
            nonNull: true,
            args: opts.args ? argFn(opts.args) : {},
            resolve: opts.resolve,
          };
          return builder;
        },

        int: (name, opts = {}) => {
          // Create the argument builder function
          const argFn = makeArgBuilder();

          spec.fields[name] = {
            type: "Int",
            nonNull: true,
            args: opts.args ? argFn(opts.args) : {},
            resolve: opts.resolve,
          };
          return builder;
        },

        boolean: (name, opts = {}) => {
          // Create the argument builder function
          const argFn = makeArgBuilder();

          spec.fields[name] = {
            type: "Boolean",
            nonNull: true,
            args: opts.args ? argFn(opts.args) : {},
            resolve: opts.resolve,
          };
          return builder;
        },

        id: (name, opts = {}) => {
          // Create the argument builder function
          const argFn = makeArgBuilder();

          spec.fields[name] = {
            type: "ID",
            nonNull: true,
            args: opts.args ? argFn(opts.args) : {},
            resolve: opts.resolve,
          };
          return builder;
        },

        object: builder.object,
        connection: builder.connection,
        mutation: builder.mutation,
        _spec: builder._spec,
      };

      return nonNullBuilder;
    },

    // Expose the spec for other modules to use
    _spec: spec,
  };

  return builder;
}
