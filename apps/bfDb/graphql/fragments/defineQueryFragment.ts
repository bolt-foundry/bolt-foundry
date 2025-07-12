/**
 * Query Fragment Definition
 *
 * This module provides the main `defineQueryFragment()` function for creating
 * reusable GraphQL query fragments that can be composed together.
 */

import { makeGqlBuilder } from "@bfmono/apps/bfDb/builders/graphql/makeGqlBuilder.ts";
import type {
  DefineQueryFragmentOptions,
  QueryFragment,
  QueryFragmentBuilder,
} from "./types.ts";
import { QueryFragmentError } from "./types.ts";

/**
 * Creates a query fragment using the fluent GraphQL builder API.
 *
 * This function allows you to define reusable pieces of GraphQL schema
 * using the same syntax as regular GraphQL type definitions. Fragments
 * can be composed together to build complete schemas selectively.
 *
 * @param builder - Function that configures the GraphQL fragment using the fluent API
 * @param options - Optional configuration for the fragment
 * @returns A QueryFragment that can be merged with other fragments
 *
 * @example
 * ```typescript
 * // Define a blog-related fragment
 * const blogQueries = defineQueryFragment((gql) =>
 *   gql
 *     .object("blogPost", () => BlogPost, {
 *       args: (a) => a.string("slug"),
 *       resolve: async (_root, args) => {
 *         return await BlogPost.findBySlug(args.slug);
 *       }
 *     })
 *     .connection("blogPosts", () => BlogPost, {
 *       args: (a) => a.string("sortDirection"),
 *       resolve: async (_root, args) => {
 *         const posts = await BlogPost.listAll(args.sortDirection);
 *         return BlogPost.connection(posts, args);
 *       }
 *     }),
 *   { name: "BlogQueries", description: "Blog-related queries and connections" }
 * );
 *
 * // Define a user-related fragment
 * const userQueries = defineQueryFragment((gql) =>
 *   gql
 *     .object("currentUser", () => User, {
 *       resolve: async (_root, _args, ctx) => {
 *         return ctx.getCurrentUser();
 *       }
 *     })
 *     .object("user", () => User, {
 *       args: (a) => a.nonNull.string("id"),
 *       resolve: async (_root, args) => {
 *         return await User.findById(args.id);
 *       }
 *     }),
 *   { name: "UserQueries" }
 * );
 * ```
 */
export function defineQueryFragment(
  builder: QueryFragmentBuilder,
  options?: DefineQueryFragmentOptions,
): QueryFragment {
  // Validate inputs
  if (typeof builder !== "function") {
    throw new QueryFragmentError(
      "Builder must be a function that accepts a GqlBuilder and returns a GqlBuilder",
      options?.name,
    );
  }

  try {
    // Create a fresh GraphQL builder instance
    const gqlBuilder = makeGqlBuilder();

    // Execute the builder function to configure the fragment
    const configuredBuilder = builder(gqlBuilder);

    // Ensure the builder function returned a builder
    if (
      !configuredBuilder || typeof configuredBuilder !== "object" ||
      !configuredBuilder._spec
    ) {
      throw new QueryFragmentError(
        "Builder function must return the GqlBuilder instance (ensure you return the result of your builder chain)",
        options?.name,
      );
    }

    // Extract the compiled specification
    const spec = configuredBuilder._spec;

    // Validate that the fragment actually defines something
    const hasFields = Object.keys(spec.fields || {}).length > 0;
    const hasRelations = Object.keys(spec.relations || {}).length > 0;
    const hasMutations = Object.keys(spec.mutations || {}).length > 0;
    const hasConnections = Object.keys(spec.connections || {}).length > 0;

    if (!hasFields && !hasRelations && !hasMutations && !hasConnections) {
      throw new QueryFragmentError(
        "Fragment must define at least one field, relation, mutation, or connection",
        options?.name,
      );
    }

    // Create and return the fragment
    const fragment: QueryFragment = {
      spec,
      name: options?.name,
      description: options?.description,
      dependencies: options?.dependencies,
    };

    return fragment;
  } catch (error) {
    // Re-throw QueryFragmentErrors as-is
    if (error instanceof QueryFragmentError) {
      throw error;
    }

    // Wrap other errors
    throw new QueryFragmentError(
      `Failed to create query fragment: ${
        error instanceof Error ? error.message : String(error)
      }`,
      options?.name,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Helper function to validate a query fragment
 *
 * @param fragment - The fragment to validate
 * @throws QueryFragmentError if the fragment is invalid
 */
export function validateQueryFragment(fragment: QueryFragment): void {
  if (!fragment || typeof fragment !== "object") {
    throw new QueryFragmentError("Fragment must be an object");
  }

  if (!fragment.spec || typeof fragment.spec !== "object") {
    throw new QueryFragmentError(
      "Fragment must have a valid spec property",
      fragment.name,
    );
  }

  // Check that the spec has the expected structure
  const spec = fragment.spec;
  if (
    typeof spec.fields !== "object" ||
    typeof spec.relations !== "object" ||
    typeof spec.mutations !== "object"
  ) {
    throw new QueryFragmentError(
      "Fragment spec must have fields, relations, and mutations objects",
      fragment.name,
    );
  }

  // Validate dependencies if provided
  if (fragment.dependencies && !Array.isArray(fragment.dependencies)) {
    throw new QueryFragmentError(
      "Fragment dependencies must be an array of strings",
      fragment.name,
    );
  }

  if (fragment.dependencies) {
    for (const dep of fragment.dependencies) {
      if (typeof dep !== "string") {
        throw new QueryFragmentError(
          "All fragment dependencies must be strings",
          fragment.name,
        );
      }
    }
  }
}

// Re-export the QueryFragmentError for convenience
export { QueryFragmentError } from "./types.ts";
