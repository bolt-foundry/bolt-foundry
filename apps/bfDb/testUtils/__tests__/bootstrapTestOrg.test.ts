import { getLogger } from "packages/logger/logger.ts";
import { assert } from "@std/assert";
import { bootstrapTestOrg } from "apps/bfDb/testUtils/bootstrapTestOrg.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";
import { BfPerson } from "apps/bfDb/models/BfPerson.ts";
import { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";

const _logger = getLogger(import.meta);

Deno.test("bootstrapTestOrg creates expected entities", async () => {
  await withIsolatedDb(async () => {
    const { cv, person, org } = await bootstrapTestOrg();

    // Test that current viewer is created and logged in
    assert(cv instanceof BfCurrentViewer);
    assert(person instanceof BfPerson);
    assert(org instanceof BfOrganization);
  });
});
