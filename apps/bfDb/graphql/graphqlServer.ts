#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env

import { makeSchema } from "nexus";
import { createYoga } from "graphql-yoga";

import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
// Let's create our own loadModelTypes function
// import { loadModelTypes } from "apps/bfDb/builders/graphql/loadSpecs.ts";

const _logger = getLogger(import.meta);

// Import our GraphQL builder tools - imported only for types but not used directly yet
import type { makeGqlSpec as _makeGqlSpec } from "@bfmono/apps/bfDb/builders/graphql/makeGqlSpec.ts";
import type { gqlSpecToNexus as _gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { generateGqlTypes } from "@bfmono/infra/bff/friends/genGqlTypes.bff.ts";
import { getSchemaOptions } from "./schemaConfig.ts";

export const schema = await makeSchema(await getSchemaOptions());

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
  await generateGqlTypes();
}
