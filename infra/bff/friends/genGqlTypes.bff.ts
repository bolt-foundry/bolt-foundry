#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { makeSchema } from "nexus";
import { schemaOptions } from "apps/bfDb/graphql/graphqlServer.ts";

const logger = getLogger(import.meta);

export function generateGqlTypes() {
  makeSchema({
    ...schemaOptions,
    types: { ...schemaOptions.types },
    contextType: {
      module: import.meta.resolve("apps/bfDb/graphql/graphqlContext.ts")
        .replace(
          "file://",
          "",
        ),
      export: "Context",
    },
    formatTypegen: (content, type) => {
      if (type === "schema") {
        return `### @generated \n${content}`;
      } else {
        return `/* @generated */\n// deno-lint-ignore-file\n${
          content.replace(/(["'])(\.+\/[^"']+)\1/g, "$1$2.ts$1")
        }`;
      }
    },
    outputs: {
      schema: new URL(
        import.meta.resolve(`apps/bfDb/graphql/__generated__/schema.graphql`),
      ).pathname,
      typegen: new URL(
        import.meta.resolve(`apps/bfDb/graphql/__generated__/_nexustypes.ts`),
      ).pathname,
    },
  });
}

export function genGqlTypes(_: string[]): number {
  try {
    logger.info("Generating GraphQL schema and types...");
    generateGqlTypes();
    logger.info("✅ GraphQL types generated");
    return 0;
  } catch (err) {
    logger.error("GraphQL type generation failed", err);
    return 1;
  }
}

register(
  "genGqlTypes",
  "Generate GraphQL schema and nexus types",
  genGqlTypes,
);
