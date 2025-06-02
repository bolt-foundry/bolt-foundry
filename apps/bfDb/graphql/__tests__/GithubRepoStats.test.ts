import { assertEquals, assertExists } from "@std/assert";
import { GithubRepoStats } from "apps/bfDb/nodeTypes/GithubRepoStats.ts";
import { testQuery } from "apps/bfDb/graphql/__tests__/TestHelpers.test.ts";

Deno.test("GithubRepoStats - should return a valid GithubRepoStats instance", async () => {
  const stats = await GithubRepoStats.findX();
  assertExists(stats);
  assertEquals(stats.id, "github-repo-stats-bolt-foundry-bolt-foundry");
});

Deno.test("GithubRepoStats - should have stars property as a number", async () => {
  const stats = await GithubRepoStats.findX();
  assertEquals(typeof stats.stars, "number");
});

Deno.test("GithubRepoStats - should be queryable via GraphQL", async () => {
  const query = `
    query {
      githubRepoStats {
        id
        stars
      }
    }
  `;

  const result = await testQuery({ query });
  assertExists(result.data);
  assertExists(result.data.githubRepoStats);
  assertEquals(
    result.data.githubRepoStats.id,
    "github-repo-stats-bolt-foundry-bolt-foundry",
  );
  assertEquals(typeof result.data.githubRepoStats.stars, "number");
});

Deno.test("GithubRepoStats - should always return the same singleton instance", async () => {
  const stats1 = await GithubRepoStats.findX();
  const stats2 = await GithubRepoStats.findX();
  assertEquals(stats1, stats2);
});
