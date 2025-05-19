#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { extendType, makeSchema, objectType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "apps/bfDb/graphql/roots/Waitlist.ts";
import { printSchema } from "graphql";

Deno.test("basic mutation with returns builder", () => {
  // Get the spec from Waitlist
  const spec = Waitlist.gqlSpec;

  // Convert to nexus types
  const nexusTypes = gqlSpecToNexus(spec, "Waitlist");

  // Create types individually to debug
  const types = [];

  // Create main type
  types.push(objectType(nexusTypes.mainType));

  // Create payload types
  for (const [_name, def] of Object.entries(nexusTypes.payloadTypes || {})) {
    types.push(objectType(def as any));
  }

  // Create mutation extension
  if (nexusTypes.mutationType) {
    types.push(extendType(nexusTypes.mutationType));
  }

  // Create schema
  const schema = makeSchema({ types });
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
