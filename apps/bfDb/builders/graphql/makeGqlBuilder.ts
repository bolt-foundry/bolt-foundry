import type { GraphQLResolveInfo } from "graphql";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { type ArgsBuilder, makeArgBuilder } from "./makeArgBuilder.ts";

// More flexible type that accepts any class with the right static properties
type GraphQLObjectClass = {
  name?: string;
  __typename?: string;
  gqlSpec?: unknown;
};

// For actual GraphQL nodes that need to be instantiated
type ThisNode = GraphQLObjectBase;

/**
 * Represents a value that may be a Promise or a direct value
 */
type MaybePromise<T> = T | Promise<T>;

/** Generic placeholder for a mutation's payload */
type NMutationPayload = unknown; // Mutations can return any GraphQL type

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

  object<N extends keyof R & string>(
    name: N,
    targetOrTypeOrOpts:
      | string // Direct type name for circular imports
      | (() => GraphQLObjectClass) // Factory function returns class directly
      | { // Options object
        type?: string;
        args?: (ab: ArgsBuilder) => ArgsBuilder;
        resolve?: (
          root: ThisNode,
          args: Record<string, unknown>,
          ctx: BfGraphqlContext,
          info: GraphQLResolveInfo,
        ) => MaybePromise<R[N]>;
      },
    extraOpts?: {
      args?: (ab: ArgsBuilder) => ArgsBuilder;
      resolve?: (
        root: ThisNode,
        args: Record<string, unknown>,
        ctx: BfGraphqlContext,
        info: GraphQLResolveInfo,
      ) => MaybePromise<R[N]>;
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
      returns?: string | (() => GraphQLObjectClass);
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

    object(name, targetOrTypeOrOpts, extraOpts) {
      // Create the argument builder function
      const argFn = makeArgBuilder();

      let typeName: string;
      let opts: {
        args?: (ab: ArgsBuilder) => ArgsBuilder;
        resolve?: (
          root: ThisNode,
          args: Record<string, unknown>,
          ctx: BfGraphqlContext,
          info: GraphQLResolveInfo,
        ) => MaybePromise<unknown>;
      } = {};
      let targetFn: (() => GraphQLObjectClass) | undefined;

      // Handle the three different argument patterns
      if (typeof targetOrTypeOrOpts === "string") {
        // Direct type name: .object("owner", "BfPerson")
        typeName = targetOrTypeOrOpts;
        opts = extraOpts || {};
      } else if (typeof targetOrTypeOrOpts === "function") {
        // Factory pattern: .object("owner", () => BfPerson)
        targetFn = targetOrTypeOrOpts;

        // Execute the factory to get the class and its name
        try {
          const target = targetOrTypeOrOpts();
          if (!target || typeof target.name !== "string") {
            throw new Error(
              `Cannot determine type name for relation "${name}". Factory must return a class with a name.`,
            );
          }
          typeName = target.name;
        } catch (e) {
          throw new Error(
            `Failed to determine type for relation "${name}": ${e}. ` +
              `Use string type for circular imports: .object("${name}", "TypeName")`,
          );
        }

        opts = extraOpts || {};
      } else {
        // Options object: .object("owner", { type: "BfPerson", resolve: ... })
        const optsObj = targetOrTypeOrOpts || {};

        if (!optsObj.type) {
          throw new Error(
            `No type specified for relation "${name}". ` +
              `Use: .object("${name}", "TypeName") or .object("${name}", () => TypeClass)`,
          );
        }

        typeName = optsObj.type;
        opts = {
          args: optsObj.args,
          resolve: optsObj.resolve,
        };
      }

      // Store the relation definition
      spec.relations[name] = {
        type: typeName,
        targetFn,
        args: opts.args ? argFn(opts.args) : {},
        resolve: opts.resolve,
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

      // Handle returns as either string or factory function
      let returnType: string;
      if (typeof opts.returns === "function") {
        // Factory function that returns a class
        try {
          const targetClass = opts.returns();
          returnType = targetClass.name || "JSON";
        } catch (e) {
          throw new Error(
            `Failed to determine return type for mutation "${name}": ${e}. ` +
              `Use string type for circular imports: returns: "TypeName"`,
          );
        }
      } else {
        returnType = opts.returns || "JSON";
      }

      // Store the mutation definition
      spec.mutations[name] = {
        returns: returnType,
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

        object:
          ((name, targetOrTypeOrOpts, extraOpts) =>
            builder.object(name, targetOrTypeOrOpts, extraOpts)) as OmitNonNull<
              GqlBuilder<R>
            >["object"],
        connection: builder.connection,
        mutation: builder.mutation,
        _spec: builder._spec,
      };

      return nonNullBuilder;
    },

    // Expose the spec
    get _spec() {
      return spec;
    },
  };

  return builder;
}