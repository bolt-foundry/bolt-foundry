/**
 * Type definitions for the returns builder and return specifications
 */

/**
 * GraphQL scalar type names as string literals
 */
export type GraphQLScalarTypeName =
  | "String"
  | "Int"
  | "Boolean"
  | "ID"
  | "Float"
  | "IsoDate";

/**
 * Field definition in a return type specification
 */
export interface ReturnFieldDef {
  type: GraphQLScalarTypeName;
  nonNull: boolean;
}

/**
 * The actual field values that can be returned from mutations
 * Maps field names to their runtime values
 */
export type ReturnFieldValues = {
  [fieldName: string]: string | number | boolean | Date | null | undefined;
};

/**
 * Type-safe constraint for return shape building
 * Each field maps to its TypeScript type, now allowing objects and arrays
 */
export type ReturnShapeConstraint = {
  [key: string]: unknown;
};

/**
 * Shape constraint for non-null fields (no null/undefined allowed)
 */
export type NonNullReturnShapeConstraint = {
  [key: string]: NonNullable<unknown>;
};
