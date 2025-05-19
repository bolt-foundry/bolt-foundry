#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "apps/bfDb/graphql/roots/Waitlist.ts";

Deno.test("debug Waitlist type generation", () => {
  try {
    const waitlistSpec = Waitlist.gqlSpec;
    console.log("Waitlist spec:", JSON.stringify(waitlistSpec, null, 2));

    const waitlistNexusTypes = gqlSpecToNexus(waitlistSpec, "Waitlist");
    console.log("Nexus types keys:", Object.keys(waitlistNexusTypes));
    console.log(
      "Main type:",
      JSON.stringify(waitlistNexusTypes.mainType, null, 2),
    );
    console.log(
      "Mutation type:",
      JSON.stringify(waitlistNexusTypes.mutationType, null, 2),
    );
    console.log(
      "Payload types:",
      JSON.stringify(waitlistNexusTypes.payloadTypes, null, 2),
    );

    // Try to create the types individually
    const WaitlistType = objectType(waitlistNexusTypes.mainType);
    console.log("Created Waitlist type successfully");

    // Create the payload types
    const payloadTypeObjects: Record<string, any> = {};
    if (waitlistNexusTypes.payloadTypes) {
      for (
        const [typeName, typeDef] of Object.entries(
          waitlistNexusTypes.payloadTypes,
        )
      ) {
        console.log(`Creating payload type: ${typeName}`);
        payloadTypeObjects[typeName] = objectType(typeDef as any);
      }
    }

    // Create the mutation type if it exists
    let WaitlistMutation = null;
    if (waitlistNexusTypes.mutationType) {
      console.log("Creating mutation extension");
      WaitlistMutation = extendType(waitlistNexusTypes.mutationType);
    }

    assert(WaitlistType, "Waitlist type should be created");
    assert(
      Object.keys(payloadTypeObjects).length > 0,
      "Should have payload types",
    );
    assert(WaitlistMutation, "Should have mutation extension");
  } catch (error) {
    console.error("Error in test:", error);
    throw error;
  }
});
