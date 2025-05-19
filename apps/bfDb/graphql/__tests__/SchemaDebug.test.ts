#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { loadGqlTypes } from "../loadGqlTypes.ts";
import { makeSchema } from "nexus";

Deno.test("debug schema building", () => {
  try {
    const types = loadGqlTypes();
    console.log("Loaded types:", types.map((t) => t.config.name));

    const schema = makeSchema({ types });
    console.log("Schema built successfully");

    assert(schema, "Schema should be created");
  } catch (error) {
    console.error("Error building schema:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
});

Deno.test("debug loadGqlTypes", () => {
  const types = loadGqlTypes();

  console.log("All types:", types.map((t) => t.config.name));

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

  console.log("Duplicates:", duplicates);
  assert(
    duplicates.length === 0,
    `Found duplicate types: ${duplicates.join(", ")}`,
  );
});
