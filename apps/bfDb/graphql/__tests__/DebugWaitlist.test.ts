#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "@bfmono/apps/bfDb/graphql/roots/Waitlist.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("debug Waitlist type generation", async () => {
  try {
    const waitlistSpec = Waitlist.gqlSpec;
    logger.debug("Waitlist spec:", JSON.stringify(waitlistSpec, null, 2));

    const waitlistNexusTypes = await gqlSpecToNexus(waitlistSpec, "Waitlist");
    logger.debug("Nexus types keys:", Object.keys(waitlistNexusTypes));
    logger.debug(
      "Main type:",
      JSON.stringify(waitlistNexusTypes.mainType, null, 2),
    );
    logger.debug(
      "Mutation type:",
      JSON.stringify(waitlistNexusTypes.mutationType, null, 2),
    );
    logger.debug(
      "Payload types:",
      JSON.stringify(waitlistNexusTypes.payloadTypes, null, 2),
    );

    // Try to create the types individually
    const WaitlistType = objectType(waitlistNexusTypes.mainType);
    logger.debug("Created Waitlist type successfully");

    // Create the payload types
    const payloadTypeObjects: Record<string, unknown> = {};
    if (waitlistNexusTypes.payloadTypes) {
      for (
        const [typeName, typeDef] of Object.entries(
          waitlistNexusTypes.payloadTypes,
        )
      ) {
        logger.debug(`Creating payload type: ${typeName}`);
        payloadTypeObjects[typeName] = objectType(
          typeDef as Parameters<typeof objectType>[0],
        );
      }
    }

    // Create the mutation type if it exists
    let WaitlistMutation = null;
    if (waitlistNexusTypes.mutationType) {
      logger.debug("Creating mutation extension");
      WaitlistMutation = extendType(waitlistNexusTypes.mutationType);
    }

    assert(WaitlistType, "Waitlist type should be created");
    assert(
      Object.keys(payloadTypeObjects).length > 0,
      "Should have payload types",
    );
    assert(WaitlistMutation, "Should have mutation extension");
  } catch (error) {
    logger.error("Error in test:", error);
    throw error;
  }
});
