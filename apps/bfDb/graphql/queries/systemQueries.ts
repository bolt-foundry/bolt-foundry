/**
 * System Query Fragment
 *
 * This fragment defines system-level queries including health checks
 * and repository statistics.
 */

import { defineQueryFragment } from "../fragments/defineQueryFragment.ts";
import { GithubRepoStats } from "@bfmono/apps/bfDb/nodeTypes/GithubRepoStats.ts";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

export const systemQueries = defineQueryFragment(
  (gql) =>
    gql
      .boolean("ok")
      .object("githubRepoStats", () => GithubRepoStats, {
        resolve: async () => {
          return await GithubRepoStats.findX();
        },
      })
      .nonNull.object("currentViewer", () => CurrentViewer, {
        resolve: (_src, _args, ctx) => {
          return ctx.getCvForGraphql();
        },
      }),
  {
    name: "systemQueries",
    description: "System-level queries for health checks and repository stats",
    dependencies: ["GithubRepoStats", "CurrentViewer"],
  },
);
