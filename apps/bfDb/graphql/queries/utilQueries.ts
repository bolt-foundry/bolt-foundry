import { defineQueryFragment } from "../fragments/defineQueryFragment.ts";

/**
 * Utility GraphQL queries.
 * Includes basic health check and system status queries.
 */
export const utilQueries = defineQueryFragment((gql) =>
  gql
    .boolean("ok")
);
