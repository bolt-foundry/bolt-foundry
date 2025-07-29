#! /usr/bin/env -S bff test

/**
 * Test simple Pothos implementation that loads all types from builder system
 */

import { assert, assertExists } from "@std/assert";
import { createPothosSchema } from "@bfmono/apps/bfDb/graphql/schemaConfigPothosSimple.ts";
import { printSchema } from "graphql";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Simple Pothos schema loads all types from builder system", async () => {
  const schema = await createPothosSchema();

  // Verify schema was created
  assertExists(schema, "Schema should be created");

  // Print schema for inspection
  const schemaSDL = printSchema(schema);
  logger.info("Generated Simple Pothos Schema:");
  logger.info(schemaSDL);

  // Basic validation that schema contains some types
  assert(
    schemaSDL.length > 100,
    "Schema should contain substantial type definitions",
  );
});
