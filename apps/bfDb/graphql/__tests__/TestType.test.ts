#! /usr/bin/env -S bff test

/**
 * Test for the TestType integration in graphqlServer
 */

import { assert } from "@std/assert";
import { printSchema } from "graphql";
import { buildTestSchema } from "./TestHelpers.test.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
const logger = getLogger(import.meta);

Deno.test("graphqlServer schema includes health check", async () => {
  const schema = await buildTestSchema();
  const sdl = printSchema(schema);
  logger.debug("Generated SDL:", sdl);

  // Verify ok field is present
  assert(
    sdl.includes("ok: Boolean"),
    "Schema is missing health check field",
  );
});
