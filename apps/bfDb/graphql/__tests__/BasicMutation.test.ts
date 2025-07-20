#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { createPothosSchema } from "@bfmono/apps/bfDb/graphql/schemaConfigPothosSimple.ts";
import { printSchema } from "graphql";

Deno.test("basic mutation with returns builder", async () => {
  // Use production Pothos schema configuration
  const schema = await createPothosSchema();
  const sdl = printSchema(schema);

  // SDL generated successfully

  // Verify mutation and payload type exist
  assert(sdl.includes("type Mutation"), "Schema should include Mutation type");
  assert(
    sdl.includes("joinWaitlist("),
    "Schema should include joinWaitlist mutation",
  );
  assert(
    sdl.includes("JoinWaitlistPayload"),
    "Schema should include JoinWaitlistPayload type",
  );
});
