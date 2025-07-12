/**
 * Query Fragments Index
 *
 * This file exports all available query fragments for the selective GraphQL
 * import system. Apps can import only the fragments they need to compose
 * their specific schema.
 *
 * Example usage:
 * ```typescript
 * import { blogQueries, documentQueries } from "@bfmono/apps/bfDb/graphql/queries/index.ts";
 *
 * export const schema = await createAppSchema({
 *   nodeTypes: [BlogPost, PublishedDocument],
 *   queryFragments: [blogQueries, documentQueries],
 * });
 * ```
 */

export { blogQueries } from "./blogQueries.ts";
export { documentQueries } from "./documentQueries.ts";
export { githubQueries } from "./githubQueries.ts";
export { utilQueries } from "./utilQueries.ts";
