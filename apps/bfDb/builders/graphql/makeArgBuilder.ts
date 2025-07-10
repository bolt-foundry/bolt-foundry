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
 * Helper type for nonNull versions of the builder
 */
type OmitNonNull<T> = Omit<T, "nonNull">;

/**
 * Maps string names to GraphQL scalar types for type inference
 */
export interface ArgMap {
  [key: string]: GraphQLInputType;
}

/**
 * Type for GraphQL argument builder with strong typing
 */
export interface ArgsBuilder {
  string(name: string): ArgsBuilder;
  int(name: string): ArgsBuilder;
  float(name: string): ArgsBuilder;
  boolean(name: string): ArgsBuilder;
  id(name: string): ArgsBuilder;
  nonNull: OmitNonNull<ArgsBuilder>;
  _args: ArgMap;
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
      return argsBuilder;
    },

    int(name: string) {
      args[name] = isNonNull ? new GraphQLNonNull(GraphQLInt) : GraphQLInt;
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    float(name: string) {
      args[name] = isNonNull ? new GraphQLNonNull(GraphQLFloat) : GraphQLFloat;
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    boolean(name: string) {
      args[name] = isNonNull
        ? new GraphQLNonNull(GraphQLBoolean)
        : GraphQLBoolean;
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    id(name: string) {
      args[name] = isNonNull ? new GraphQLNonNull(GraphQLID) : GraphQLID;
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    get nonNull() {
      // Set nonNull flag for next operation
      isNonNull = true;

      // Create a nonNull version that doesn't have the nonNull property
      const nonNullBuilder: OmitNonNull<ArgsBuilder> = {
        string: argsBuilder.string,
        int: argsBuilder.int,
        float: argsBuilder.float,
        boolean: argsBuilder.boolean,
        id: argsBuilder.id,
        _args: argsBuilder._args,
      };

      return nonNullBuilder;
    },

    // Store collected arguments
    _args: args,
  };

  return argsBuilder;
}
