#! /usr/bin/env -S bff test

import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
import { BfErrorInvalidEmail } from "apps/bfDb/classes/BfErrorInvalidEmail.ts";
import { makeLoggedInCv, makeLoggedOutCv } from "apps/bfDb/utils/testUtils.ts";
import {
  ACCESS_COOKIE,
  buildAuthCookies,
  verifySession,
} from "apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { createContext } from "apps/bfDb/graphql/graphqlContext.ts";
import { yoga } from "apps/bfDb/graphql/graphqlServer.ts";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

Deno.env.set("JWT_SECRET", "test_secret_key"); // deterministic signatures

function extractCookieValue(cookieStr: string): string {
  return cookieStr.split(";")[0].split("=")[1];
}

/* -------------------------------------------------------------------------- */
/*  Sanity-checks                                                             */
/* -------------------------------------------------------------------------- */

Deno.test("makeLoggedInCv returns a fully-populated LoggedIn viewer", () => {
  const cv = makeLoggedInCv();
  assertEquals(cv.__typename, "CurrentViewerLoggedIn");
  assertExists(cv.orgBfOid);
  assertExists(cv.personBfGid);
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
    assertExists(CurrentViewer);
    assertExists(CurrentViewer.gqlSpec);
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

/* -------------------------------------------------------------------------- */
/*  JWT-based session tests                                                   */
/* -------------------------------------------------------------------------- */

Deno.test("createFromRequest with valid ACCESS token returns LoggedIn", async () => {
  await withIsolatedDb(async () => {
    const { access } = await buildAuthCookies("gid_Person_123", "oid_Org_456");
    const req = new Request("http://localhost", {
      headers: { cookie: access },
    });
    const resHeaders = new Headers();

    const cv = await CurrentViewer.createFromRequest(
      import.meta,
      req,
      resHeaders,
    );
    assertEquals(cv.__typename, "CurrentViewerLoggedIn");

    // No new tokens are issued when ACCESS is still valid
    assertEquals(resHeaders.get("Set-Cookie"), null);
  });
});

Deno.test("createFromRequest() restores viewer via REFRESH token", async () => {
  await withIsolatedDb(async () => {
    const { refresh } = await buildAuthCookies("gid_Person_123", "oid_Org_456");
    const req = new Request("http://localhost", {
      headers: { cookie: refresh },
    });
    const resHeaders = new Headers();

    const cv = await CurrentViewer.createFromRequest(
      import.meta,
      req,
      resHeaders,
    );
    assertEquals(cv.__typename, "CurrentViewerLoggedIn");

    // A new ACCESS cookie *should* be issued on the refresh path
    const setCookies = [...resHeaders.values()];
    const issued = setCookies.find((c) => c.startsWith(`${ACCESS_COOKIE}=`));
    assertExists(issued, "Expected fresh ACCESS cookie to be issued");
    const token = extractCookieValue(issued!);
    const claims = await verifySession(token);
    assertExists(claims);
    assertEquals(claims?.typ, "access");
  });
});

Deno.test("GraphQL currentViewer returns LoggedIn when session cookie is present", async () => {
  await withIsolatedDb(async () => {
    const { access } = await buildAuthCookies("gid_Person_123", "oid_Org_456");

    // Build request + GraphQL context
    const gqlReq = new Request("https://bolt-foundry.test/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: access },
      body: JSON.stringify({ query: "{ currentViewer { __typename } }" }),
    });
    const ctxReq = new Request("https://bolt-foundry.test/", {
      headers: { cookie: access },
    });

    const res = await yoga.fetch(
      new URL("/graphql", import.meta.url),
      gqlReq,
      await createContext(ctxReq),
    );
    const { data } = await res.json();

    assertEquals(data.currentViewer.__typename, "CurrentViewerLoggedIn");
  });
});

Deno.test("currentViewer returns LoggedIn after Google login", async () => {
  // Pre-bake ACCESS cookie (simulates the handler’s side-effect)
  const { access } = await buildAuthCookies("gid_Person_1", "oid_Org_1");

  const gqlReq = new Request("http://bolt.test/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: access },
    body: JSON.stringify({ query: "{ currentViewer { __typename } }" }),
  });

  const res = await yoga.fetch(
    new URL("/graphql", import.meta.url),
    gqlReq,
    await createContext(
      new Request("http://bolt.test/", { headers: { cookie: access } }),
    ),
  );
  const { data } = await res.json();
  assertEquals(data.currentViewer.__typename, "CurrentViewerLoggedIn"); // ❌ fails now
});
