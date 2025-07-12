/**
 * Query Fragment Merging
 *
 * This module provides functionality to merge multiple query fragments together
 * into a single combined fragment that can be used to build GraphQL schemas.
 */

import type { GqlNodeSpec } from "@bfmono/apps/bfDb/builders/graphql/makeGqlBuilder.ts";
import type {
  MergedQueryFragment,
  MergeQueryFragmentsOptions,
  QueryFragment,
} from "./types.ts";
import { QueryFragmentError } from "./types.ts";
import { validateQueryFragment } from "./defineQueryFragment.ts";

/**
 * Merges multiple query fragments into a single combined fragment.
 *
 * This function combines the specifications from multiple fragments,
 * handling conflicts according to the specified resolution strategy.
 * It also validates dependencies if requested.
 *
 * @param fragments - Array of fragments to merge
 * @param options - Configuration for the merge operation
 * @returns A merged fragment containing all the combined specifications
 *
 * @example
 * ```typescript
 * const blogFragment = defineQueryFragment((gql) => gql.object("blogPost", () => BlogPost));
 * const userFragment = defineQueryFragment((gql) => gql.object("currentUser", () => User));
 *
 * const combined = mergeQueryFragments([blogFragment, userFragment], {
 *   conflictResolution: "error",
 *   resultName: "CombinedQueries"
 * });
 *
 * // Use the merged spec in your GraphQL root
 * class Query extends GraphQLObjectBase {
 *   static override gqlSpec = combined.spec;
 * }
 * ```
 */
export function mergeQueryFragments(
  fragments: Array<QueryFragment>,
  options: MergeQueryFragmentsOptions = {},
): MergedQueryFragment {
  // Input validation
  if (!Array.isArray(fragments)) {
    throw new QueryFragmentError("Fragments must be an array");
  }

  if (fragments.length === 0) {
    throw new QueryFragmentError("At least one fragment must be provided");
  }

  // Validate all fragments
  for (const fragment of fragments) {
    validateQueryFragment(fragment);
  }

  // Validate dependencies if requested
  if (options.validateDependencies) {
    validateDependencies(fragments);
  }

  // Set default options
  const conflictResolution = options.conflictResolution || "error";
  const warnings: Array<string> = [];

  // Initialize merged spec
  const mergedSpec: GqlNodeSpec = {
    fields: {},
    relations: {},
    mutations: {},
    connections: {},
  };

  // Track fragment names for the result
  const sourceFragments: Array<string> = [];

  // Merge each fragment
  for (const fragment of fragments) {
    const fragmentName = fragment.name || `Fragment${sourceFragments.length}`;
    sourceFragments.push(fragmentName);

    mergeSpecInto(
      mergedSpec,
      fragment.spec,
      fragmentName,
      conflictResolution,
      warnings,
    );
  }

  return {
    spec: mergedSpec,
    sourceFragments,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validates that fragment dependencies are satisfied
 */
function validateDependencies(fragments: Array<QueryFragment>): void {
  const fragmentNames = new Set(
    fragments.map((f) => f.name).filter((name): name is string =>
      Boolean(name)
    ),
  );

  for (const fragment of fragments) {
    if (!fragment.dependencies) continue;

    for (const dependency of fragment.dependencies) {
      if (!fragmentNames.has(dependency)) {
        throw new QueryFragmentError(
          `Fragment "${
            fragment.name || "unnamed"
          }" depends on "${dependency}" which is not present in the merge`,
          fragment.name,
        );
      }
    }
  }
}

/**
 * Merges a single fragment spec into the target spec
 */
function mergeSpecInto(
  target: GqlNodeSpec,
  source: GqlNodeSpec,
  sourceName: string,
  conflictResolution: "error" | "first-wins" | "last-wins",
  warnings: Array<string>,
): void {
  // Merge fields
  mergeObjectInto(
    target.fields,
    source.fields,
    "field",
    sourceName,
    conflictResolution,
    warnings,
  );

  // Merge relations
  mergeObjectInto(
    target.relations,
    source.relations,
    "relation",
    sourceName,
    conflictResolution,
    warnings,
  );

  // Merge mutations
  mergeObjectInto(
    target.mutations,
    source.mutations,
    "mutation",
    sourceName,
    conflictResolution,
    warnings,
  );

  // Merge connections (if they exist)
  if (source.connections) {
    if (!target.connections) {
      target.connections = {};
    }
    mergeObjectInto(
      target.connections,
      source.connections,
      "connection",
      sourceName,
      conflictResolution,
      warnings,
    );
  }
}

/**
 * Generic object merging with conflict resolution
 */
function mergeObjectInto(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  itemType: string,
  sourceName: string,
  conflictResolution: "error" | "first-wins" | "last-wins",
  warnings: Array<string>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (key in target) {
      // Handle conflict
      switch (conflictResolution) {
        case "error":
          throw new QueryFragmentError(
            `Conflict: ${itemType} "${key}" is defined in multiple fragments including "${sourceName}"`,
          );

        case "first-wins":
          warnings.push(
            `${itemType} "${key}" from "${sourceName}" was ignored (first-wins policy)`,
          );
          // Don't overwrite - keep existing value
          break;

        case "last-wins":
          warnings.push(
            `${itemType} "${key}" was overwritten by "${sourceName}" (last-wins policy)`,
          );
          target[key] = value;
          break;
      }
    } else {
      // No conflict, just add it
      target[key] = value;
    }
  }
}

/**
 * Creates a simple fragment merger that uses default options
 *
 * @param fragments - Fragments to merge
 * @returns The merged GqlNodeSpec ready for use
 *
 * @example
 * ```typescript
 * const mergedSpec = simpleFragmentMerge([blogFragment, userFragment]);
 *
 * class Query extends GraphQLObjectBase {
 *   static override gqlSpec = mergedSpec;
 * }
 * ```
 */
export function simpleFragmentMerge(
  fragments: Array<QueryFragment>,
): GqlNodeSpec {
  const result = mergeQueryFragments(fragments, {
    conflictResolution: "error",
    validateDependencies: true,
  });

  return result.spec;
}

/**
 * Utility function to merge fragments with dependency ordering
 *
 * Automatically sorts fragments based on their dependencies before merging.
 * This ensures that dependencies are processed before fragments that depend on them.
 *
 * @param fragments - Fragments to merge (will be sorted by dependencies)
 * @param options - Merge options
 * @returns Merged fragment result
 */
export function mergeQueryFragmentsWithDependencyOrdering(
  fragments: Array<QueryFragment>,
  options: MergeQueryFragmentsOptions = {},
): MergedQueryFragment {
  // Sort fragments by dependencies using topological sort
  const sortedFragments = topologicalSortFragments(fragments);

  return mergeQueryFragments(sortedFragments, {
    ...options,
    validateDependencies: true, // Always validate when using dependency ordering
  });
}

/**
 * Performs topological sort on fragments based on their dependencies
 */
function topologicalSortFragments(
  fragments: Array<QueryFragment>,
): Array<QueryFragment> {
  const fragmentMap = new Map<string, QueryFragment>();
  const dependencyGraph = new Map<string, Array<string>>();
  const inDegree = new Map<string, number>();

  // Build fragment map and initialize dependency tracking
  for (const fragment of fragments) {
    const name = fragment.name || `Fragment${fragmentMap.size}`;
    fragmentMap.set(name, fragment);
    dependencyGraph.set(name, fragment.dependencies || []);
    inDegree.set(name, 0);
  }

  // Calculate in-degrees
  for (const [name, deps] of dependencyGraph) {
    for (const dep of deps) {
      if (!fragmentMap.has(dep)) {
        throw new QueryFragmentError(
          `Fragment "${name}" depends on "${dep}" which is not in the fragment list`,
        );
      }
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
    }
  }

  // Topological sort using Kahn's algorithm
  const result: Array<QueryFragment> = [];
  const queue: Array<string> = [];

  // Start with fragments that have no dependencies
  for (const [name, degree] of inDegree) {
    if (degree === 0) {
      queue.push(name);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const fragment = fragmentMap.get(current)!;
    result.push(fragment);

    // Process dependencies
    const deps = dependencyGraph.get(current) || [];
    for (const dep of deps) {
      const newDegree = (inDegree.get(dep) || 0) - 1;
      inDegree.set(dep, newDegree);

      if (newDegree === 0) {
        queue.push(dep);
      }
    }
  }

  // Check for circular dependencies
  if (result.length !== fragments.length) {
    throw new QueryFragmentError(
      "Circular dependency detected in fragment dependencies",
    );
  }

  return result;
}

// Re-export types for convenience
export type {
  MergedQueryFragment,
  MergeQueryFragmentsOptions,
} from "./types.ts";
