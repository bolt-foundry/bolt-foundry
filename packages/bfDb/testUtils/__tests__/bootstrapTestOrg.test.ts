import { getLogger } from "packages/logger.ts";
import { assert } from "@std/assert";
import { bootstrapTestOrg } from "packages/bfDb/testUtils/bootstrapTestOrg.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { withIsolatedDb } from "packages/bfDb/bfDb.ts";

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
