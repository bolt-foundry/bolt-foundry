/**
 * Type definitions for GraphQL resolver arguments and related types
 */

/**
 * Arguments passed to GraphQL resolvers
 * These are the parsed arguments from the GraphQL query
 * Using Record<string, unknown> here is appropriate as GraphQL args can be any shape
 */
export type GraphQLResolverArgs = Record<string, unknown>;

/**
 * Nexus object type definition with configuration
 * This represents the structure of Nexus type definitions
 */
export interface NexusObjectTypeDef {
  name: string;
  // deno-lint-ignore no-explicit-any
  definition: (t: any) => void;
}

/**
 * Collection of Nexus object type definitions
 * Used for storing generated payload types and other object types
 */
export type NexusObjectTypeMap = Record<string, NexusObjectTypeDef>;
