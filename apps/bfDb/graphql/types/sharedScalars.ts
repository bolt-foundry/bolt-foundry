/**
 * Shared GraphQL Scalar Type Definitions
 *
 * This file defines the standard scalar types used across all Pothos GraphQL
 * schema builders in the Bolt Foundry application to ensure consistency
 * and avoid duplication.
 */

/**
 * Standard GraphQL scalar types used in Bolt Foundry schemas
 */
export type BfGraphqlScalars = {
  ID: { Input: string; Output: string };
  String: { Input: string; Output: string };
  Boolean: { Input: boolean; Output: boolean };
  Int: { Input: number; Output: number };
  Float: { Input: number; Output: number };
  IsoDate: { Input: string; Output: string };
  JSON: { Input: unknown; Output: unknown };
};

/**
 * Standard Pothos SchemaBuilder type for Bolt Foundry applications
 * Using any for now to avoid complex Pothos generics
 */
// deno-lint-ignore no-explicit-any
export type BfSchemaBuilder = any;

/**
 * Test version of SchemaBuilder with relaxed context typing
 */
// deno-lint-ignore no-explicit-any
export type BfTestSchemaBuilder = any;
