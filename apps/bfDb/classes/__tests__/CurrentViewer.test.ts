#! /usr/bin/env -S bff test

import { assert, assertEquals, assertExists, assertRejects } from "@std/assert";

import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
import { BfErrorInvalidEmail } from "apps/bfDb/classes/BfErrorInvalidEmail.ts";
import { makeLoggedInCv, makeLoggedOutCv } from "apps/bfDb/utils/testUtils.ts";

/* -------------------------------------------------------------------------- */
/*  Helper sanity-checks                                                      */
/* -------------------------------------------------------------------------- */

Deno.test("makeLoggedInCv returns a fully-populated LoggedIn viewer", () => {
  const cv = makeLoggedInCv();
  assertEquals(cv.__typename, "CurrentViewerLoggedIn");
  assertExists(cv.bfOid, "bfOid should be present");
  assertExists(cv.bfGid, "bfGid should be present");
});

Deno.test("makeLoggedOutCv returns a LoggedOut viewer", () => {
  const cv = makeLoggedOutCv();
  assertEquals(cv.__typename, "CurrentViewerLoggedOut");
});

/* -------------------------------------------------------------------------- */
/*  Existing behaviour                                                        */
/* -------------------------------------------------------------------------- */

Deno.test("CurrentViewer class exists and defines gqlSpec", async () => {
  await withIsolatedDb(() => {
    assertExists(CurrentViewer, "CurrentViewer export missing");
    assertExists(CurrentViewer.gqlSpec, "CurrentViewer.gqlSpec missing");
    return Promise.resolve();
  });
});

Deno.test("loginWithEmailDev returns CurrentViewerLoggedIn", async () => {
  await withIsolatedDb(async () => {
    const cv = await CurrentViewer.loginWithEmailDev("test@example.com");

    assertEquals(cv.__typename, "CurrentViewerLoggedIn");
  });
});

Deno.test("currentViewer before login returns LoggedOut", async () => {
  await withIsolatedDb(async () => {
    const testRequest = new Request("http://localhost:8000");
    const cv = await CurrentViewer.createFromRequest(import.meta, testRequest);
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

Deno.test("setLoginSuccessHeaders sets auth cookies", async () => {
  await withIsolatedDb(() => {
    const headers = new Headers();

    CurrentViewer.setLoginSuccessHeaders(headers, "test-gid");

    const cookieHeader = headers.get("Set-Cookie");
    assertExists(cookieHeader, "Expected Set-Cookie header to be written");
    assert(
      cookieHeader!.includes("bfgat="),
      "Expected access-token cookie (bfgat) to be present",
    );
    assert(
      cookieHeader!.includes("bfgrt="),
      "Expected refresh-token cookie (bfgrt) to be present",
    );
    return Promise.resolve();
  });
});

Deno.test("createFromRequest with no cookies returns LoggedOut", async () => {
  await withIsolatedDb(async () => {
    const req = new Request("http://localhost");
    const resHeaders = new Headers();

    const cv = await CurrentViewer.createFromRequest(
      import.meta,
      req,
      resHeaders,
    );

    assertEquals(cv.__typename, "CurrentViewerLoggedOut");
  });
});

Deno.test(
  "createFromRequest with valid access token returns LoggedIn",
  async () => {
    await withIsolatedDb(async () => {
      // Set up request with valid access token
      const req = new Request("http://localhost");
      const resHeaders = new Headers();

      // Create mock cookie with valid access token
      const validCookieHeader = "bfgat=valid_access_token";
      Object.defineProperty(req, "headers", {
        value: new Headers({
          "Cookie": validCookieHeader,
        }),
      });

      const cv = await CurrentViewer.createFromRequest(
        import.meta,
        req,
        resHeaders,
      );

      // Check that we got a logged-in viewer
      assertEquals(cv.__typename, "CurrentViewerLoggedIn");

      // No new tokens should be set in response headers since the access token is valid
      const cookieHeader = resHeaders.get("Set-Cookie");
      assert(
        !cookieHeader || !cookieHeader.includes("bfgat="),
        "Expected no new access token to be set when existing token is valid",
      );
    });
  },
);
