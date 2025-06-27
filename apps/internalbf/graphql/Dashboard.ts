import { GraphQLObjectBase } from "@bfmono/apps/bfDb/classes/GraphQLObjectBase.ts";

export class Dashboard extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .int("customerCount", {
        resolve: () => 1, // Hardcoded as requested
      })
      .int("githubStars", {
        resolve: async () => {
          try {
            const response = await fetch("https://api.github.com/repos/bolt-foundry/bolt-foundry");
            const data = await response.json();
            return data.stargazers_count || 0;
          } catch (error) {
            console.error("Failed to fetch GitHub stars:", error);
            return 0;
          }
        },
      })
      .int("githubRecentPRs", {
        resolve: async () => {
          try {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const response = await fetch(
              `https://api.github.com/repos/bolt-foundry/bolt-foundry/pulls?state=closed&since=${yesterday}`
            );
            const pulls = await response.json();
            return Array.isArray(pulls) ? pulls.length : 0;
          } catch (error) {
            console.error("Failed to fetch GitHub PRs:", error);
            return 0;
          }
        },
      })
  );
}