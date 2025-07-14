import { scalarType } from "nexus";

/**
 * JSON scalar type for handling JSON data.
 * Serializes JavaScript objects to JSON strings and parses JSON strings to JavaScript objects.
 */
export const JSON = scalarType({
  name: "JSON",
  description: "JSON data structure (objects, arrays, primitives)",
  serialize(value: unknown): unknown {
    // For GraphQL serialization, we return the value as-is
    // GraphQL will handle the JSON serialization over the wire
    return value;
  },
  parseValue(value: unknown): unknown {
    if (typeof value === "string") {
      try {
        return globalThis.JSON.parse(value);
      } catch (error) {
        throw new Error(
          `Invalid JSON string: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
    // If it's already a parsed object, return as-is
    return value;
  },
  parseLiteral(ast, _variables): unknown {
    const parseLiteralRecursive = (node: typeof ast): unknown => {
      if (node.kind === "StringValue") {
        try {
          return globalThis.JSON.parse(node.value);
        } catch (error) {
          throw new Error(
            `Invalid JSON string: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }
      if (node.kind === "ObjectValue") {
        // Handle object literals in GraphQL queries
        const obj: Record<string, unknown> = {};
        for (const field of node.fields) {
          obj[field.name.value] = parseLiteralRecursive(field.value);
        }
        return obj;
      }
      if (node.kind === "ListValue") {
        // Handle array literals in GraphQL queries
        return node.values.map((value) => parseLiteralRecursive(value));
      }
      if (node.kind === "BooleanValue") {
        return node.value;
      }
      if (node.kind === "IntValue") {
        return parseInt(node.value, 10);
      }
      if (node.kind === "FloatValue") {
        return parseFloat(node.value);
      }
      if (node.kind === "NullValue") {
        return null;
      }
      throw new Error(`Cannot parse AST value as JSON: ${node.kind}`);
    };

    return parseLiteralRecursive(ast);
  },
});
