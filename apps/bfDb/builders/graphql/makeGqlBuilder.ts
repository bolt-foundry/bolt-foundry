import type { GraphQLResolveInfo } from "graphql";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/builders/bfDb/types.ts";
import { type ArgsBuilder, makeArgBuilder } from "./makeArgBuilder.ts";

type ThisNode = InstanceType<AnyBfNodeCtor>;

type MaybePromise<T> = T | Promise<T>;

// We'll implement edge property building in a future version if needed

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

  object<
    N extends keyof R & string,
    // Allow either string type name or a thunk that returns a constructor
    TargetFn extends string | (() => MaybePromise<AnyBfNodeCtor>)
  >(
    name: N, 
    targetOrOpts: TargetFn | {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<R[N]>;
      // When an object field has no custom resolver, the field name itself is used as the edge role
      isSourceToTarget?: boolean;
      type?: string; // For legacy compatibility
    },
    opts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<R[N]>;
      isSourceToTarget?: boolean;
    }
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

    object(name, targetOrOpts, maybeOpts) {
      // Create the argument builder function
      const argFn = makeArgBuilder();
      
      // Handle both styles:
      // 1. .object("memberOf", () => BfOrganization)
      // 2. .object("memberOf", { type: "BfOrganization", ... })
      const isThunkStyle = typeof targetOrOpts === 'function' || typeof targetOrOpts === 'string';
      
      const targetFn = isThunkStyle ? targetOrOpts : undefined;
      // Use type assertion to help TypeScript understand the conditional type narrowing
      const opts = isThunkStyle ? (maybeOpts || {}) : (targetOrOpts as Record<string, unknown> || {});
      
      // Determine the relationship type
      let typeName: string;
      if (isThunkStyle) {
        if (typeof targetFn === 'string') {
          // Direct string type
          typeName = targetFn;
        } else {
          // For thunk-style, we'll need to resolve the type name at runtime
          // For now, we'll set the type to the field name, and the resolver
          // will dynamically determine the concrete type
          typeName = name;
          
          // Store the thunk function for later use
          (opts as any)._targetThunk = targetFn;
        }
      } else {
        // Legacy style with type in opts
        typeName = (opts as any).type || name;
      }

      // Process args function if provided - use type assertion to handle conditional logic
      const args = (opts as any).args ? argFn((opts as any).args) : {};
      
      // By default, all object fields without a custom resolver are edge relationships
      const isEdgeRelationship = !(opts as any).resolve;

      // Store the relation definition with edge relationship info
      spec.relations[name] = {
        type: typeName,
        args: args,
        resolve: (opts as any).resolve,
        // Edge relationship properties - now implicit unless resolve is provided
        isEdgeRelationship: isEdgeRelationship,
        edgeRole: name, // The field name itself is the role
        isSourceToTarget: (opts as any).isSourceToTarget !== false, // Default to true
        // Store the thunk function if we have one
        _targetThunk: (opts as any)._targetThunk
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
