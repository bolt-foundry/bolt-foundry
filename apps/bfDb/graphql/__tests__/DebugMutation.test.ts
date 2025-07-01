#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { Waitlist } from "@bfmono/apps/bfDb/graphql/roots/Waitlist.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("debug Mutation type definition", async () => {
  const waitlistSpec = Waitlist.gqlSpec;
  const waitlistNexusTypes = await gqlSpecToNexus(waitlistSpec, "Waitlist");

  logger.debug("Full mutation type definition:");
  logger.debug(JSON.stringify(waitlistNexusTypes.mutationType, null, 2));

  // Let's manually inspect the definition function
  if (
    waitlistNexusTypes.mutationType &&
    waitlistNexusTypes.mutationType.definition
  ) {
    logger.debug("\nTrying to execute mutation definition...");

    // Create a mock 't' object to capture what's being defined
    const mockT = {
      field: (name: string, config: unknown) => {
        logger.debug(`Field: ${name}`);
        logger.debug(`Config:`, JSON.stringify(config, null, 2));
      },
    };

    // Execute the definition function
    waitlistNexusTypes.mutationType.definition(mockT);
  }

  assert(true, "Debug completed");
});
