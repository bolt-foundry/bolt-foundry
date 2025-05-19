import { arg } from "nexus";

/**
 * Helper type for nonNull versions of the builder
 */
type OmitNonNull<T> = Omit<T, "nonNull">;

/**
 * Maps string names to Nexus arg definitions
 */
export interface ArgMapNexus {
  [key: string]: ReturnType<typeof arg>;
}

/**
 * Type for GraphQL argument builder with strong typing for Nexus
 */
export interface ArgsBuilderNexus {
  string(name: string): ArgsBuilderNexus;
  int(name: string): ArgsBuilderNexus;
  float(name: string): ArgsBuilderNexus;
  boolean(name: string): ArgsBuilderNexus;
  id(name: string): ArgsBuilderNexus;
  nonNull: OmitNonNull<ArgsBuilderNexus>;
  _args: ArgMapNexus;
}

/**
 * Function to create a builder for GraphQL arguments in Nexus format
 * Returns a function that takes a callback function and returns a Record of argument definitions
 */
export function makeArgBuilderNexus(): (
  fn: (a: ArgsBuilderNexus) => ArgsBuilderNexus,
) => ArgMapNexus {
  return (fn: (a: ArgsBuilderNexus) => ArgsBuilderNexus) => {
    // Create a builder and apply the callback function
    const builder = createArgsBuilderNexus();
    fn(builder);

    // Return the collected arguments from the builder
    return builder._args;
  };
}

/**
 * Creates an ArgsBuilderNexus instance that collects GraphQL arguments in Nexus format
 */
export function createArgsBuilderNexus(): ArgsBuilderNexus {
  // Use a map to collect argument definitions
  const args: ArgMapNexus = {};
  let isNonNull = false;

  const argsBuilder: ArgsBuilderNexus = {
    string(name: string) {
      args[name] = arg({
        type: isNonNull ? "String!" : "String",
      });
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    int(name: string) {
      args[name] = arg({
        type: isNonNull ? "Int!" : "Int",
      });
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    float(name: string) {
      args[name] = arg({
        type: isNonNull ? "Float!" : "Float",
      });
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    boolean(name: string) {
      args[name] = arg({
        type: isNonNull ? "Boolean!" : "Boolean",
      });
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    id(name: string) {
      args[name] = arg({
        type: isNonNull ? "ID!" : "ID",
      });
      isNonNull = false; // Reset after use
      return argsBuilder;
    },

    get nonNull() {
      // Set nonNull flag for next operation
      isNonNull = true;

      // Create a nonNull version that doesn't have the nonNull property
      const nonNullBuilder: OmitNonNull<ArgsBuilderNexus> = {
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
