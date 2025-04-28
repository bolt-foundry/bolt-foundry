#! /usr/bin/env -S bff test

import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";

import { assert, assertEquals, assertExists, assertRejects } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { BfErrorInvalidEmail } from "apps/bfDb/classes/BfErrorInvalidEmail.ts";

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
    assertEquals(cv.email, "test@example.com");
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
      "Expected access token cookie (bfgat) to be present",
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

Deno.test("createFromRequest with valid access token returns LoggedIn", async () => {
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

    // Check that we got a logged in viewer
    assertEquals(cv.__typename, "CurrentViewerLoggedIn");

    // No new tokens should be set in response headers since the access token is valid
    const cookieHeader = resHeaders.get("Set-Cookie");
    assert(
      !cookieHeader || !cookieHeader.includes("bfgat="),
      "Expected no new access token to be set when existing token is valid",
    );
  });
});

Deno.test("refreshes token when access token is expired but refresh token is valid", async () => {
  await withIsolatedDb(async () => {
    const req = new Request("http://localhost");
    const resHeaders = new Headers();

    // Create mock cookies with expired access token but valid refresh token
    const expiredCookieHeader =
      "bfgat=expired_token; bfgrt=valid_refresh_token";
    Object.defineProperty(req, "headers", {
      value: new Headers({
        "Cookie": expiredCookieHeader,
      }),
    });

    const cv = await CurrentViewer.createFromRequest(
      import.meta,
      req,
      resHeaders,
    );

    // Check that we got a logged in viewer
    assertEquals(cv.__typename, "CurrentViewerLoggedIn");

    // Verify that new tokens were set in response headers
    const cookieHeader = resHeaders.get("Set-Cookie");
    assertExists(cookieHeader, "Expected Set-Cookie header to be written");
    assert(
      cookieHeader!.includes("bfgat="), /* access token cookie */
      "Expected new access token cookie (bfgat) to be present",
    );
    assert(
      cookieHeader!.includes("bfgrt="), /* refresh token cookie */
      "Expected new refresh token cookie (bfgrt) to be present",
    );
  });
});
