/**
 * GraphQL Query Fragments
 *
 * This module provides functionality for creating and composing reusable GraphQL query fragments
 * that can be selectively imported and combined to build GraphQL schemas.
 *
 * @example Basic usage:
 * ```typescript
 * import { defineQueryFragment, mergeQueryFragments } from "@bfmono/apps/bfDb/graphql/fragments";
 *
 * // Define fragments
 * const blogQueries = defineQueryFragment((gql) =>
 *   gql
 *     .object("blogPost", () => BlogPost, { args, resolve })
 *     .connection("blogPosts", () => BlogPost, { args, resolve })
 * );
 *
 * const userQueries = defineQueryFragment((gql) =>
 *   gql
 *     .object("currentUser", () => User, { resolve })
 *     .object("user", () => User, { args, resolve })
 * );
 *
 * // Merge and use
 * const combinedSpec = mergeQueryFragments([blogQueries, userQueries]).spec;
 *
 * class Query extends GraphQLObjectBase {
 *   static override gqlSpec = combinedSpec;
 * }
 * ```
 */

// Core functionality
export {
  defineQueryFragment,
  validateQueryFragment,
} from "./defineQueryFragment.ts";
export {
  mergeQueryFragments,
  mergeQueryFragmentsWithDependencyOrdering,
  simpleFragmentMerge,
} from "./mergeQueryFragments.ts";

// Types and interfaces
export type {
  DefineQueryFragmentOptions,
  MergedQueryFragment,
  MergeQueryFragmentsOptions,
  QueryFragment,
  QueryFragmentBuilder,
} from "./types.ts";
export { QueryFragmentError } from "./types.ts";
