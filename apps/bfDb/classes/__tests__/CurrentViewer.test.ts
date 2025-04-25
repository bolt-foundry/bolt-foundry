#! /usr/bin/env -S bff test

import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
/**
 * 🔴 Red test – will fail until `CurrentViewer.ts` is migrated from
 * `BfCurrentViewer.ts` and exports a `gqlSpec`.
 */

import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { BfErrorInvalidEmail } from "apps/bfDb/classes/BfErrorInvalidEmail.ts";

Deno.test("CurrentViewer class exists and defines gqlSpec", () => {
  assertExists(CurrentViewer, "CurrentViewer export missing");
  assertExists(CurrentViewer.gqlSpec, "CurrentViewer.gqlSpec missing");
});

Deno.test("loginWithEmailDev returns CurrentViewerLoggedIn", async () => {
  await withIsolatedDb(async () => {
    // call the dev stub wherever you attach it on the class
    // adjust when you finalise the API surface
    const cv = await CurrentViewer.loginWithEmailDev("test@example.com");

    assertEquals(cv.__typename, "CurrentViewerLoggedIn");
    assertEquals(cv.email, "test@example.com");
  });
});

/* -------------------------------------------------------------------------- */
/* New Phase-0 red tests (edge-cases)                                          */
/* -------------------------------------------------------------------------- */

Deno.test("currentViewer before login returns LoggedOut", async () => {
  await withIsolatedDb(async () => {
    // The helper will be added during implementation; for now it will throw.
    const testRequest = new Request("http://localhost:8000");
    const cv = await CurrentViewer.currentViewerForRequest(testRequest);
    assertEquals(cv.__typename, "CurrentViewerLoggedOut");
  });
});

Deno.test("loginWithEmailDev rejects invalid email", async () => {
  await withIsolatedDb(async () => {
    await assertRejects(
      () => CurrentViewer.loginWithEmailDev("not-an-email"),
      BfErrorInvalidEmail,
    );
  });
});
