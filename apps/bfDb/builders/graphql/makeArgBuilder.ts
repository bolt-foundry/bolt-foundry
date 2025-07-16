import type { GraphQLInputType } from "graphql";
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

/**
 * Maps string names to GraphQL scalar types for type inference
 */
export interface ArgMap {
  [key: string]: GraphQLInputType;
}

/**
 * Type-safe GraphQL argument builder with full type inference
 */
export interface ArgsBuilder<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  string<N extends string>(
    name: N,
  ): ArgsBuilder<T & { [K in N]: string | undefined }>;
  int<N extends string>(
    name: N,
  ): ArgsBuilder<T & { [K in N]: number | undefined }>;
  float<N extends string>(
    name: N,
  ): ArgsBuilder<T & { [K in N]: number | undefined }>;
  boolean<N extends string>(
    name: N,
  ): ArgsBuilder<T & { [K in N]: boolean | undefined }>;
  id<N extends string>(
    name: N,
  ): ArgsBuilder<T & { [K in N]: string | undefined }>;
  nonNull: NonNullArgsBuilder<T>;
  _args: ArgMap;
  _inferredTypes: T;
}

/**
 * NonNull version of ArgsBuilder that makes fields required
 */
export interface NonNullArgsBuilder<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  string<N extends string>(name: N): ArgsBuilder<T & { [K in N]: string }>;
  int<N extends string>(name: N): ArgsBuilder<T & { [K in N]: number }>;
  float<N extends string>(name: N): ArgsBuilder<T & { [K in N]: number }>;
  boolean<N extends string>(name: N): ArgsBuilder<T & { [K in N]: boolean }>;
  id<N extends string>(name: N): ArgsBuilder<T & { [K in N]: string }>;
  _args: ArgMap;
  _inferredTypes: T;
}

/**
 * Function to create a builder for GraphQL arguments
 * Returns a function that takes a callback function and returns a Record of argument name to GraphQL input type
 */
export function makeArgBuilder(): (
  fn: (a: ArgsBuilder) => ArgsBuilder,
) => ArgMap {
  return (fn: (a: ArgsBuilder) => ArgsBuilder) => {
    // Create a builder and apply the callback function
    const builder = createArgsBuilder();
    fn(builder);

    // Return the collected arguments from the builder
    return builder._args;
  };
}

/**
 * Type-safe version of makeArgBuilder that infers argument types
 */
export function makeTypedArgBuilder<T extends Record<string, unknown>>(): (
  fn: (a: ArgsBuilder<Record<string, unknown>>) => ArgsBuilder<T>,
) => { args: ArgMap; inferredTypes: T } {
  return (fn: (a: ArgsBuilder<Record<string, unknown>>) => ArgsBuilder<T>) => {
    const builder = createArgsBuilder();
    const result = fn(builder);
    return {
      args: result._args,
      inferredTypes: result._inferredTypes,
    };
  };
}

/**
 * Creates an ArgsBuilder instance that collects GraphQL arguments
 */
export function createArgsBuilder(): ArgsBuilder {
  // Use a map to collect argument definitions
  const args: ArgMap = {};
  let isNonNull = false;

  const argsBuilder: ArgsBuilder = {
    string(name: string) {
      args[name] = isNonNull
        ? new GraphQLNonNull(GraphQLString)
        : GraphQLString;
      isNonNull = false; // Reset after use
      // deno-lint-ignore no-explicit-any
      return argsBuilder as any; // Type cast needed for generic return
    },

    int(name: string) {
      args[name] = isNonNull ? new GraphQLNonNull(GraphQLInt) : GraphQLInt;
      isNonNull = false; // Reset after use
      // deno-lint-ignore no-explicit-any
      return argsBuilder as any; // Type cast needed for generic return
    },

    float(name: string) {
      args[name] = isNonNull ? new GraphQLNonNull(GraphQLFloat) : GraphQLFloat;
      isNonNull = false; // Reset after use
      // deno-lint-ignore no-explicit-any
      return argsBuilder as any; // Type cast needed for generic return
    },

    boolean(name: string) {
      args[name] = isNonNull
        ? new GraphQLNonNull(GraphQLBoolean)
        : GraphQLBoolean;
      isNonNull = false; // Reset after use
      // deno-lint-ignore no-explicit-any
      return argsBuilder as any; // Type cast needed for generic return
    },

    id(name: string) {
      args[name] = isNonNull ? new GraphQLNonNull(GraphQLID) : GraphQLID;
      isNonNull = false; // Reset after use
      // deno-lint-ignore no-explicit-any
      return argsBuilder as any; // Type cast needed for generic return
    },

    get nonNull() {
      // Set nonNull flag for next operation
      isNonNull = true;

      // Create a nonNull version that doesn't have the nonNull property
      const nonNullBuilder: NonNullArgsBuilder = {
        string: (name: string) => {
          args[name] = new GraphQLNonNull(GraphQLString);
          isNonNull = false; // Reset after use
          // deno-lint-ignore no-explicit-any
          return argsBuilder as any;
        },
        int: (name: string) => {
          args[name] = new GraphQLNonNull(GraphQLInt);
          isNonNull = false; // Reset after use
          // deno-lint-ignore no-explicit-any
          return argsBuilder as any;
        },
        float: (name: string) => {
          args[name] = new GraphQLNonNull(GraphQLFloat);
          isNonNull = false; // Reset after use
          // deno-lint-ignore no-explicit-any
          return argsBuilder as any;
        },
        boolean: (name: string) => {
          args[name] = new GraphQLNonNull(GraphQLBoolean);
          isNonNull = false; // Reset after use
          // deno-lint-ignore no-explicit-any
          return argsBuilder as any;
        },
        id: (name: string) => {
          args[name] = new GraphQLNonNull(GraphQLID);
          isNonNull = false; // Reset after use
          // deno-lint-ignore no-explicit-any
          return argsBuilder as any;
        },
        _args: args,
        // deno-lint-ignore no-explicit-any
        _inferredTypes: {} as any,
      };

      return nonNullBuilder;
    },

    // Store collected arguments
    _args: args,
    // deno-lint-ignore no-explicit-any
    _inferredTypes: {} as any, // This will be properly typed at compile time
  };

  return argsBuilder;
}

/**
 * Type helper to extract argument types from an ArgsBuilder
 */
export type InferArgTypes<T> = T extends ArgsBuilder<infer U> ? U : never;
