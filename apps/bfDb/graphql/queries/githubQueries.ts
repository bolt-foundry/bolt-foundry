import { defineQueryFragment } from "../fragments/defineQueryFragment.ts";
import { GithubRepoStats } from "@bfmono/apps/bfDb/nodeTypes/GithubRepoStats.ts";

/**
 * GitHub-related GraphQL queries.
 * Includes repository statistics and metadata.
 */
export const githubQueries = defineQueryFragment((gql) =>
  gql
    .object("githubRepoStats", () => GithubRepoStats, {
      resolve: async () => {
        return await GithubRepoStats.findX();
      },
    })
);
