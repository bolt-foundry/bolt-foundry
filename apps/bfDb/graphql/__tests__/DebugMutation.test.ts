#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "apps/bfDb/graphql/roots/Waitlist.ts";

Deno.test("debug Mutation type definition", () => {
  const waitlistSpec = Waitlist.gqlSpec;
  const waitlistNexusTypes = gqlSpecToNexus(waitlistSpec, "Waitlist");

  console.log("Full mutation type definition:");
  console.log(JSON.stringify(waitlistNexusTypes.mutationType, null, 2));

  // Let's manually inspect the definition function
  if (
    waitlistNexusTypes.mutationType &&
    waitlistNexusTypes.mutationType.definition
  ) {
    console.log("\nTrying to execute mutation definition...");

    // Create a mock 't' object to capture what's being defined
    const mockT = {
      field: (name: string, config: any) => {
        console.log(`Field: ${name}`);
        console.log(`Config:`, JSON.stringify(config, null, 2));
      },
    };

    // Execute the definition function
    waitlistNexusTypes.mutationType.definition(mockT);
  }

  assert(true, "Debug completed");
});
