import { booleanArg, floatArg, idArg, intArg, nonNull, stringArg } from "nexus";

/**
 * Converts argument definitions from builder format to Nexus format
 * This handles the conversion from simple string types (e.g. "String!", "Int")
 * to Nexus argument definitions using the appropriate arg functions
 */
export function convertArgsToNexus(
  args: Record<string, unknown>,
): Record<string, unknown> {
  const nexusArgs: Record<string, unknown> = {};

  for (const [name, type] of Object.entries(args)) {
    // If type is a string, convert to proper Nexus arg
    if (typeof type === "string") {
      const isNonNull = type.endsWith("!");
      const baseType = isNonNull ? type.slice(0, -1) : type;

      let argFn;
      switch (baseType) {
        case "String":
          argFn = stringArg();
          break;
        case "Int":
          argFn = intArg();
          break;
        case "Float":
          argFn = floatArg();
          break;
        case "Boolean":
          argFn = booleanArg();
          break;
        case "ID":
          argFn = idArg();
          break;
        default:
          // Consider throwing an error for unknown types instead of defaulting to string
          // Using string as default for unknown types
          argFn = stringArg();
          break;
      }

      nexusArgs[name] = isNonNull ? nonNull(argFn) : argFn;
    } else {
      // Otherwise, assume it's already in the right format
      nexusArgs[name] = type;
    }
  }

  return nexusArgs;
}
