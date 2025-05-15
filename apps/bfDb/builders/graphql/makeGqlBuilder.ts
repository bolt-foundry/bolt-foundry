import type { GraphQLResolveInfo } from "graphql";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/builders/bfDb/types.ts";
import { type ArgsBuilder, makeArgBuilder } from "./makeArgBuilder.ts";

type ThisNode = InstanceType<AnyBfNodeCtor>;

type MaybePromise<T> = T | Promise<T>;

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

  object<N extends keyof R & string>(name: N, opts?: {
    type?: string; // Type name for the relationship
    args?: (ab: ArgsBuilder) => ArgsBuilder;
    resolve?: (
      root: ThisNode,
      args: Record<string, unknown>,
      ctx: BfGraphqlContext,
      info: GraphQLResolveInfo,
    ) => MaybePromise<R[N]>;
    // Edge relationship options
    isEdgeRelationship?: boolean;
    edgeRole?: string;
    isSourceToTarget?: boolean;
  }): GqlBuilder<R>;

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

    object(name, opts = {}) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      // Store the relation definition with edge relationship info if provided
      spec.relations[name] = {
        type: opts.type || name, // Use provided type or fallback to field name
        args: opts.args ? argFn(opts.args) : {},
        resolve: opts.resolve,
        // Edge relationship properties
        isEdgeRelationship: opts.isEdgeRelationship || false,
        edgeRole: opts.edgeRole || name,
        isSourceToTarget: opts.isSourceToTarget !== false, // Default to true
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
