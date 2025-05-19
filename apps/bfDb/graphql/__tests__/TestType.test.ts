#! /usr/bin/env -S bff test

/**
 * Test for the TestType integration in graphqlServer
 */

import { assert } from "@std/assert";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { loadGqlTypes } from "../loadGqlTypes.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

function buildTestSchema(): string {
  const schema = makeSchema({ types: loadGqlTypes() });
  return printSchema(schema);
}

Deno.test("graphqlServer schema includes health check", () => {
  const sdl = buildTestSchema();
  logger.debug("Generated SDL:", sdl);

  // Verify ok field is present
  assert(
    sdl.includes("ok: Boolean"),
    "Schema is missing health check field",
  );
});
