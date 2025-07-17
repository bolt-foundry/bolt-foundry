import { assertEquals, assertExists } from "@std/assert";
import { stub } from "@std/testing/mock";
import { GithubRepoStats } from "@bfmono/apps/bfDb/nodeTypes/GithubRepoStats.ts";
import { testQuery } from "@bfmono/apps/bfDb/graphql/__tests__/TestHelpers.test.ts";

const mockGithubFetch = () =>
  stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response(JSON.stringify({ stargazers_count: 42 }))),
  );

Deno.test("GithubRepoStats - should return a valid GithubRepoStats instance", async () => {
  using _fetchStub = mockGithubFetch();

  const stats = await GithubRepoStats.findX();
  assertExists(stats);
  assertEquals(stats.id, "github-repo-stats-bolt-foundry-bolt-foundry");
});

Deno.test("GithubRepoStats - should have stars property as a number", async () => {
  using _fetchStub = mockGithubFetch();

  const stats = await GithubRepoStats.findX();
  assertEquals(typeof stats.stars, "number");
});

Deno.test("GithubRepoStats - should be queryable via GraphQL", async () => {
  using _fetchStub = mockGithubFetch();

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

  // Cast to the expected type after existence checks
  const githubRepoStats = result.data.githubRepoStats as {
    id: string;
    stars: number;
  };

  assertEquals(
    githubRepoStats.id,
    "github-repo-stats-bolt-foundry-bolt-foundry",
  );
  assertEquals(typeof githubRepoStats.stars, "number");
});

Deno.test("GithubRepoStats - should always return the same singleton instance", async () => {
  using _fetchStub = mockGithubFetch();

  const stats1 = await GithubRepoStats.findX();
  const stats2 = await GithubRepoStats.findX();
  assertEquals(stats1, stats2);
});
