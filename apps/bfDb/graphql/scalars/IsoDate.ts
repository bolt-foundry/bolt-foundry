import { scalarType } from "nexus";

/**
 * IsoDate scalar type for handling ISO 8601 date strings.
 * Serializes Date objects to ISO strings and parses ISO strings to Date objects.
 */
export const IsoDate = scalarType({
  name: "IsoDate",
  description: "ISO 8601 date string (e.g., 2025-06-10T14:30:00.000Z)",
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error(`Cannot serialize non-Date value as IsoDate: ${value}`);
  },
  parseValue(value: unknown): Date {
    if (typeof value === "string") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid ISO date string: ${value}`);
      }
      return date;
    }
    throw new Error(`Cannot parse non-string value as IsoDate: ${value}`);
  },
  parseLiteral(ast): Date {
    if (ast.kind === "StringValue") {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid ISO date string: ${ast.value}`);
      }
      return date;
    }
    throw new Error(`Cannot parse non-string AST value as IsoDate`);
  },
});
