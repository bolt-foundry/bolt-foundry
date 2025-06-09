#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { buildTestSchema } from "./TestHelpers.test.ts";
import { printSchema } from "graphql";

Deno.test("basic mutation with returns builder", async () => {
  // Use production schema configuration
  const schema = await buildTestSchema();
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
