#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { loadGqlTypes } from "../graphqlServer.ts";

Deno.test("graphqlServer loads node types via builder", () => {
  const schema = makeSchema({ types: { ...loadGqlTypes() } });
  const sdl = printSchema(schema);

  // Once the builder integration is complete, BfPerson should be included
  // as a GraphQL type in the schema.
  assert(
    sdl.includes("type BfPerson"),
    "Schema should include BfPerson when builder integration is implemented",
  );
});
