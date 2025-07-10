/**
 * Type definitions for Nexus schema building
 */

import type { GraphQLResolveInfo } from "graphql";
import type { BfGraphqlContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import type { GraphQLResolverArgs } from "./resolverTypes.ts";

/**
 * Root object type representing a BfNode or similar GraphQL object
 * with standard properties and methods
 */
export interface GraphQLRootObject {
  // Standard BfNode properties
  props?: Record<string, unknown>;
  relations?: Record<string, unknown>;
  metadata?: {
    bfGid?: string;
    className?: string;
    [key: string]: unknown;
  };
  currentViewer?: unknown;

  // Allow dynamic properties and methods
  [key: string]: unknown;
}

/**
 * Field resolver function type
 */
export type GqlFieldResolver<TReturn = unknown> = (
  root: GraphQLRootObject,
  args: GraphQLResolverArgs,
  ctx: BfGraphqlContext,
  info: GraphQLResolveInfo,
) => TReturn | Promise<TReturn>;

/**
 * Field definition from the GQL spec
 */
export interface GqlFieldDef {
  type: string;
  nonNull?: boolean;
  description?: string;
  args?: Record<string, unknown>;
  resolve?: GqlFieldResolver;
}

/**
 * Relation definition from the GQL spec
 */
export interface GqlRelationDef {
  type: string;
  description?: string;
  args?: Record<string, unknown>;
  resolve?: GqlFieldResolver;
  isEdgeRelationship?: boolean;
  isSourceToTarget?: boolean;
  // deno-lint-ignore no-explicit-any
  _targetThunk?: () => any;
  _hasThunkFn?: boolean;
  _pendingTypeResolution?: boolean;
}

/**
 * Mutation definition from the GQL spec
 */
export interface GqlMutationDef {
  returnsType?: string;
  returnsSpec?: unknown;
  description?: string;
  args?: Record<string, unknown>;
  resolve?: GqlFieldResolver;
}

/**
 * Connection definition from the GQL spec
 * Represents a Relay-style connection field with pagination
 */
export interface GqlConnectionDef {
  type: string;
  description?: string;
  args?: Record<string, unknown>;
  resolve: GqlFieldResolver; // Required for connections
  // deno-lint-ignore no-explicit-any
  _targetThunk?: () => any;
  _pendingTypeResolution?: boolean;
}

/**
 * Type-safe replacement for Nexus object definition function parameter
 * This represents the 't' parameter in Nexus type definitions
 */
export interface NexusTypeDef {
  field(name: string, config: unknown): void;
  nonNull: {
    field(name: string, config: unknown): void;
  };
}
