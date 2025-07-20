#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env

import { createYoga } from "graphql-yoga";

import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
// Use complete Pothos schema with full builder system integration
import { createPothosSchema } from "./schemaConfigPothosSimple.ts";

const logger = getLogger(import.meta);

// Import our GraphQL builder tools - imported only for types but not used directly yet
import type { makeGqlSpec as _makeGqlSpec } from "@bfmono/apps/bfDb/builders/graphql/makeGqlSpec.ts";
import type { gqlSpecToPothos as _gqlSpecToPothos } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToPothos.ts";

export const schema = await createPothosSchema();

// Create a Yoga instance with a GraphQL schema.
export const yoga = createYoga({ schema });

export const graphQLHandler = async (req: Request) => {
  using ctx = await createContext(req);
  // @ts-expect-error bad types or something
  const res = await yoga.handleRequest(req, ctx);
  const responseHeaders = ctx.getResponseHeaders();

  for (const [k, v] of responseHeaders) res.headers.append(k, v);

  return res;
};

if (import.meta.main) {
  // Server is ready - no need to generate types as we use Pothos
  logger.info("GraphQL server ready with Pothos schema");
}
