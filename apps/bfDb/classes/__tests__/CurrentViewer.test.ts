#! /usr/bin/env -S bff test

import { assert, assertEquals, assertExists, assertRejects } from "@std/assert";

import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
import { BfErrorInvalidEmail } from "apps/bfDb/classes/BfErrorInvalidEmail.ts";
import { makeLoggedInCv, makeLoggedOutCv } from "apps/bfDb/utils/testUtils.ts";
import { createContext } from "apps/bfDb/graphql/graphqlContext.ts";
import { yoga } from "apps/bfDb/graphql/graphqlServer.ts";

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

Deno.test("setLoginSuccessHeaders() writes a secure session cookie", () => {
  /* 1️⃣ Build a fake logged-in viewer */
  const viewer = makeLoggedInCv();

  const headers = new Headers();

  /* 3️⃣ Call the helper under test */
  CurrentViewer.setLoginSuccessHeaders(headers, viewer.bfGid);

  /* 4️⃣ Red assertion – should write a cookie header */
  assert(
    headers.has("Set-Cookie"),
    "Expected a Set-Cookie header with the new session",
  );
});

Deno.test("createFromRequest() restores viewer from a valid cookie", async () => {
  /* 1️⃣ Pretend a previous call set the cookie value */
  const cookie = "bf_session=XYZ.valid.jwt.signature; Path=/; HttpOnly; Secure";

  /* 2️⃣ Forge a Request carrying the cookie */
  const req = new Request("https://bolt-foundry.test/graphql", {
    headers: { cookie },
  });

  /* 3️⃣ Invoke CurrentViewer */
  const viewer = await CurrentViewer.createFromRequest(import.meta, req);

  /* 4️⃣ Red assertion – it should round-trip to a LoggedIn instance */
  assert(
    viewer?.__typename === "CurrentViewerLoggedIn",
    "Expected createFromRequest() to re-hydrate a CurrentViewerLoggedIn",
  );
});

Deno.test("GraphQL currentViewer returns LoggedIn when session cookie is present", async () => {
  /* 1️⃣ Cookie forged to mimic a prior login */
  const cookie = "bf_session=XYZ.valid.jwt.signature; Path=/; HttpOnly; Secure";

  /* 2️⃣ Run the root query with the cookie */
  const res = await yoga.fetch(
    new URL("/graphql", import.meta.url),
    {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ query: "{ currentViewer { __typename } }" }),
    },
    await createContext(
      new Request("https://bolt-foundry.test/", { headers: { cookie } }),
    ),
  );

  const { data } = await res.json();

  /* 3️⃣ Red assertion – should recognise the session */
  assertEquals(
    data.currentViewer.__typename,
    "CurrentViewerLoggedIn",
    "currentViewer should surface LoggedIn when a valid session cookie is sent",
  );
});
