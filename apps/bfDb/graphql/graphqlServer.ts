#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env

import { connectionPlugin, makeSchema } from "nexus";
import { createYoga } from "graphql-yoga";

import { createContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { SchemaConfig } from "nexus/dist/builder.js";
import { getLogger } from "packages/logger/logger.ts";
// Let's create our own loadModelTypes function
// import { loadModelTypes } from "apps/bfDb/builders/graphql/loadSpecs.ts";

const logger = getLogger(import.meta);
logger.setLevel(logger.levels.DEBUG);

// Import our GraphQL builder tools - imported only for types but not used directly yet
import type { makeGqlSpec as _makeGqlSpec } from "apps/bfDb/builders/graphql/makeGqlSpec.ts";
import type { gqlSpecToNexus as _gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { objectType, queryType } from "nexus";
import { generateGqlTypes } from "infra/bff/friends/genGqlTypes.bff.ts";

/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export function loadGqlTypes() {
  // Create a test GraphQL type directly with Nexus to verify schema generation
  const TestType = objectType({
    name: "TestType",
    definition(t) {
      t.string("name");
      t.nonNull.id("id");
      t.boolean("isActive");
      t.int("count");
    },
  });

  // Create a query type that returns our test type
  const Query = queryType({
    definition(t) {
      // Test field
      t.field("test", {
        type: "TestType",
        resolve: () => ({
          id: "test-123",
          name: "Test Object",
          isActive: true,
          count: 42,
        }),
      });

      // Health check
      t.nonNull.boolean("ok", {
        resolve: () => true,
      });
    },
  });

  // Return the types
  return {
    Query,
    TestType,
  };
}

export const schemaOptions: SchemaConfig = {
  // Use our new loadGqlTypes function
  types: { ...loadGqlTypes() },
  features: {
    abstractTypeStrategies: {
      __typename: true,
    },
  },
  plugins: [
    connectionPlugin({
      validateArgs: (args) => {
        if (args.first == null && args.last == null) {
          args.first = 10;
        }
        return args;
      },
      extendConnection: {
        count: {
          type: "Int",
          requireResolver: false,
        },
      },
      includeNodesField: true,
    }),
  ],
};

export const schema = makeSchema(schemaOptions);

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
  generateGqlTypes();
}
