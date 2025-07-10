#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { loadGqlTypes } from "../loadGqlTypes.ts";
import { buildTestSchema } from "./TestHelpers.test.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("debug schema building", async () => {
  try {
    const types = await loadGqlTypes();
    // deno-lint-ignore no-explicit-any
    logger.debug("Loaded types:", types.map((t: any) => t.config.name));

    // Use the same schema building approach as other tests
    const schema = await buildTestSchema();
    logger.debug("Schema built successfully");

    assert(schema, "Schema should be created");
  } catch (error) {
    logger.error("Error building schema:", error);
    if (error instanceof Error) {
      logger.error("Error stack:", error.stack);
    }
    throw error;
  }
});

Deno.test("debug loadGqlTypes", async () => {
  const types = await loadGqlTypes();

  // deno-lint-ignore no-explicit-any
  logger.debug("All types:", types.map((t: any) => t.config.name));

  // Check for duplicates
  // deno-lint-ignore no-explicit-any
  const typeNames = types.map((t: any) => t.config.name);
  const seen = new Set();
  const duplicates = [];

  for (const name of typeNames) {
    if (seen.has(name)) {
      duplicates.push(name);
    }
    seen.add(name);
  }

  logger.debug("Duplicates:", duplicates);
  assert(
    duplicates.length === 0,
    `Found duplicate types: ${duplicates.join(", ")}`,
  );
});
