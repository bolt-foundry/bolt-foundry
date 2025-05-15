#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env

import { connectionPlugin, makeSchema } from "nexus";
import { createYoga } from "graphql-yoga";

import { createContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { SchemaConfig } from "nexus/dist/builder.js";
import { getLogger } from "packages/logger/logger.ts";
// import { loadModelTypes } from "apps/bfDb/builders/graphql/loadSpecs.ts";

const _logger = getLogger(import.meta);

const schemaOptions: SchemaConfig = {
  // types: { ...loadModelTypes() },
  types: {},
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
  makeSchema({
    ...schemaOptions,
    types: { ...schemaOptions.types },
    contextType: {
      module: import.meta.resolve("./graphqlContext.ts").replace("file://", ""),
      export: "Context",
    },
    formatTypegen: (content, type) => {
      if (type === "schema") {
        return `### @generated \n${content}`;
      } else {
        return `/* @generated */\n// deno-lint-ignore-file\n${
          content.replace(
            /(["'])(\.+\/[^"']+)\1/g,
            "$1$2.ts$1",
          )
        }`;
      }
    },
    outputs: {
      schema: new URL(
        import.meta.resolve(`apps/bfDb/graphql/__generated__/schema.graphql`),
      )
        .pathname,
      typegen: new URL(
        import.meta.resolve(`apps/bfDb/graphql/__generated__/_nexustypes.ts`),
      )
        .pathname,
    },
  });
}
