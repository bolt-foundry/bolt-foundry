#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { makeSchema } from "nexus";
import { getSchemaOptions } from "../graphql/schemaConfig.ts";

const logger = getLogger(import.meta);

export async function generateSchema() {
  const schemaOptions = await getSchemaOptions();
  makeSchema({
    ...schemaOptions,
    types: { ...schemaOptions.types },
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
        import.meta.resolve("../schema.graphql"),
      ).pathname,
      typegen: new URL(
        import.meta.resolve("../graphql/__generated__/_nexustypes.ts"),
      ).pathname,
    },
  });
}

if (import.meta.main) {
  try {
    logger.info("Generating boltfoundry-com GraphQL schema...");
    await generateSchema();
    logger.info("✅ Schema generated");
  } catch (err) {
    logger.error("Schema generation failed", err);
    Deno.exit(1);
  }
}
