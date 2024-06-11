#! /usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env --watch

import { connectionPlugin, makeSchema } from "packages/graphql/deps.ts";
import * as types from "infra/graphql/types/mod.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const schema = makeSchema({
  types,
  plugins: [connectionPlugin({
    includeNodesField: true,
  })],
  outputs: false,
  features: {
    abstractTypeStrategies: {
      __typename: true,
    },
  },
});

export function build(configLocation: string = "packages") {
  logger.info(`Building schema for ${configLocation}`)
  makeSchema({
    types,
    plugins: [connectionPlugin({
      includeNodesField: true,
    })],
    features: {
      abstractTypeStrategies: {
        __typename: true,
      },
    },
    outputs: {
      schema: new URL(import.meta.resolve(`${configLocation}/graphql/schema.graphql`))
        .pathname,
      typegen:
        new URL(import.meta.resolve(`${configLocation}/__generated__/_nexustypes.ts`))
          .pathname,
    },
  });
}

if (import.meta.main) {
  const configLocation = Deno.args[1] ?? "packages";
  build(configLocation);
}