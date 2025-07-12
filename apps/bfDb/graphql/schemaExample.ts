/**
 * Example demonstrating the new fragment composition system
 *
 * This file shows how to use createAppSchema to build a GraphQL schema
 * from fragments, which can be used as an alternative to the existing
 * loadGqlTypes() approach.
 */

import { createAppSchema } from "@bfmono/apps/bfDb/graphql/createAppSchema.ts";
import { blogQueries } from "@bfmono/apps/bfDb/graphql/queries/blogQueries.ts";
import { documentQueries } from "@bfmono/apps/bfDb/graphql/queries/documentQueries.ts";
import { systemQueries } from "@bfmono/apps/bfDb/graphql/queries/systemQueries.ts";
import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";
import { GithubRepoStats } from "@bfmono/apps/bfDb/nodeTypes/GithubRepoStats.ts";

/**
 * Example usage of the new fragment composition system
 *
 * This creates a schema equivalent to the existing one but built
 * from composable fragments.
 */
export async function createExampleSchema() {
  return await createAppSchema({
    // Include all the node types that should be available
    nodeTypes: [
      BlogPost,
      PublishedDocument,
      GithubRepoStats,
    ],

    // Compose the Query root from fragments
    queryFragments: [
      blogQueries,
      documentQueries,
      systemQueries,
    ],

    // No mutation fragments in this example
    mutationFragments: [],

    // Custom scalars to include
    customScalars: ["IsoDate"],
  });
}

/**
 * Alternative composition showing how fragments can be mixed and matched
 */
export async function createMinimalBlogSchema() {
  return await createAppSchema({
    nodeTypes: [BlogPost],
    queryFragments: [blogQueries, systemQueries], // Only blog + system queries
    mutationFragments: [],
    customScalars: ["IsoDate"],
  });
}

/**
 * Example showing how to add additional fragments
 */
export async function createExtendedSchema() {
  // You could add more fragments here
  const additionalQueries = [
    // createQueryFragment("custom", (gql) => gql.string("customField")),
  ] as Array<typeof blogQueries>;

  return await createAppSchema({
    nodeTypes: [BlogPost, PublishedDocument, GithubRepoStats],
    queryFragments: [
      blogQueries,
      documentQueries,
      systemQueries,
      ...additionalQueries,
    ],
    mutationFragments: [],
    customScalars: ["IsoDate"],
  });
}
