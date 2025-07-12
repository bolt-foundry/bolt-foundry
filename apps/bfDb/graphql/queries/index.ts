/**
 * Query Fragments Index
 *
 * This file exports all available query fragments for the selective GraphQL
 * import system. Apps can import only the fragments they need to compose
 * their specific schema.
 *
 * Example usage:
 * ```typescript
 * import { githubQueries, systemQueries } from "@bfmono/apps/bfDb/graphql/queries/index.ts";
 *
 * export const schema = await createAppSchema({
 *   nodeTypes: [GithubRepoStats],
 *   queryFragments: [githubQueries, systemQueries],
 * });
 * ```
 */

export { githubQueries } from "./githubQueries.ts";
export { systemQueries } from "./systemQueries.ts";
export { utilQueries } from "./utilQueries.ts";
