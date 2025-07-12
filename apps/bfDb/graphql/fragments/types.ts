/**
 * Type definitions for GraphQL Query Fragments
 *
 * This module defines the TypeScript interfaces and types used by the fragment system
 * to enable selective GraphQL schema import and composition.
 */

import type {
  GqlBuilder,
  GqlNodeSpec,
} from "@bfmono/apps/bfDb/builders/graphql/makeGqlBuilder.ts";

/**
 * Function signature for defining a query fragment using the fluent builder API
 * This allows users to define fragments using the same syntax as regular GraphQL type definitions
 *
 * @param gql - The GraphQL builder instance with the fluent API
 * @returns The configured builder with the fragment's fields and relationships
 */
export type QueryFragmentBuilder = (gql: GqlBuilder) => GqlBuilder;

/**
 * Represents a compiled query fragment that can be merged with other fragments
 * Contains the GraphQL specification along with metadata about the fragment
 */
export interface QueryFragment {
  /** The compiled GraphQL node specification containing fields, relations, mutations, and connections */
  spec: GqlNodeSpec;

  /** Optional name for the fragment (useful for debugging and composition) */
  name?: string;

  /** Optional description of what this fragment provides */
  description?: string;

  /**
   * Optional metadata about fragment dependencies
   * Can be used to ensure fragments are loaded in the correct order
   */
  dependencies?: Array<string>;
}

/**
 * Options for creating a query fragment
 */
export interface DefineQueryFragmentOptions {
  /** Name for the fragment (useful for debugging and error messages) */
  name?: string;

  /** Description of what this fragment provides */
  description?: string;

  /** List of other fragment names this fragment depends on */
  dependencies?: Array<string>;
}

/**
 * Options for merging query fragments
 */
export interface MergeQueryFragmentsOptions {
  /** Whether to validate fragment dependencies before merging */
  validateDependencies?: boolean;

  /** How to handle conflicting field definitions between fragments */
  conflictResolution?: "error" | "first-wins" | "last-wins";

  /** Optional name for the merged result */
  resultName?: string;
}

/**
 * Error thrown when fragment operations fail
 */
export class QueryFragmentError extends Error {
  public readonly fragmentName?: string;
  public override readonly cause?: Error;

  constructor(
    message: string,
    fragmentName?: string,
    cause?: Error,
  ) {
    super(message);
    this.name = "QueryFragmentError";
    this.fragmentName = fragmentName;
    this.cause = cause;
  }
}

/**
 * Result of merging multiple query fragments
 */
export interface MergedQueryFragment {
  /** The merged GraphQL specification */
  spec: GqlNodeSpec;

  /** Names of all fragments that were merged */
  sourceFragments: Array<string>;

  /** Any warnings generated during the merge process */
  warnings?: Array<string>;
}
