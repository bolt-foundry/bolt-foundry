#! /usr/bin/env -S bff test

import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { BfPerson } from "apps/bfDb/models/BfPerson.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";
import { BfErrorOrganizationNotAllowed } from "apps/bfDb/classes/BfErrorNode.ts";

/**
 * Build a minimal mock of the Google ID‑token payload we care about for Phase A
 */
function mockGooglePayload(email: string) {
  return {
    email,
    email_verified: true,
    hd: email.split("@")[1], // hosted domain
    sub: "google-oauth-user-id",
    given_name: "Test",
    family_name: "User",
    picture: "https://example.com/avatar.png",
  };
}

Deno.test(
  "googleLogin › returns existing user when they already exist",
  async () => {
    await withIsolatedDb(async () => {
      const cv = BfCurrentViewer
        .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
          "test",
          "test",
        );

      // Seed an existing person in the DB
      const existing = await BfPerson.__DANGEROUS__createUnattached(cv, {
        email: "alice@example.com",
        name: "Alice Example",
      });

      // Attempt login with same email – should return the same person
      const person = await BfPerson.verifyLogin(
        cv,
        "alice@example.com",
        mockGooglePayload("alice@example.com"),
      );

      assertEquals(person.metadata.bfGid, existing.metadata.bfGid);
    });
  },
);

Deno.test(
  "googleLogin › first‑time login creates a Person *and* an Organization",
  async () => {
    await withIsolatedDb(async () => {
      const cv = BfCurrentViewer
        .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
          "test",
          "test",
        );

      const email = "newuser@boltfoundry.io";

      const person = await BfPerson.verifyLogin(
        cv,
        email,
        mockGooglePayload(email),
      );

      // Person exists
      assertExists(person.metadata.bfGid);

      // Person should own exactly one org on first login
      const orgs = await person.queryTargets(BfOrganization);
      assertEquals(orgs.length, 1);
      assertExists(orgs[0].metadata.bfGid);
    });
  },
);

Deno.test(
  "googleLogin › rejects sign‑in when the e‑mail domain is not allowed",
  async () => {
    await withIsolatedDb(async () => {
      const cv = BfCurrentViewer
        .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
          "test",
          "test",
        );

      const badEmail = "nogmail@gmail.com";

      await assertRejects(
        async () =>
          await BfPerson.verifyLogin(cv, badEmail, mockGooglePayload(badEmail)),
        BfErrorOrganizationNotAllowed,
      );
    });
  },
);
