#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { loadGqlTypes } from "../loadGqlTypes.ts";
import { makeSchema } from "nexus";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("debug schema building", () => {
  try {
    const types = loadGqlTypes();
    logger.debug("Loaded types:", types.map((t) => t.config.name));

    const schema = makeSchema({ types });
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

Deno.test("debug loadGqlTypes", () => {
  const types = loadGqlTypes();

  logger.debug("All types:", types.map((t) => t.config.name));

  // Check for duplicates
  const typeNames = types.map((t) => t.config.name);
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
