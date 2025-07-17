#! /usr/bin/env -S bff test

/**
 * CurrentViewer unit + integration tests
 *
 * Test groups
 *   1. Sanity helpers (makeLoggedInCv / makeLoggedOutCv)
 *   2. Email‑dev login flow
 *   3. JWT‑backed session restore (ACCESS / REFRESH)
 *   4. Google Sign‑In (token verification + GraphQL path)
 *
 * All DB‑touching tests are wrapped in `withIsolatedDb` so they can be executed
 * in parallel without leaking state.
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import {
  makeLoggedInCv,
  makeLoggedOutCv,
} from "@bfmono/apps/bfDb/utils/testUtils.ts";
import {
  ACCESS_COOKIE,
  buildAuthCookies,
  REFRESH_COOKIE,
  verifySession,
} from "@bfmono/apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import { yoga } from "@bfmono/apps/bfDb/graphql/graphqlServer.ts";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

Deno.env.set("JWT_SECRET", "test_secret_key"); // deterministic signatures

function cookieVal(cookieStr: string): string {
  return cookieStr.split(";")[0].split("=")[1];
}

/* -------------------------------------------------------------------------- */
/*  Group 1: Sanity‑checks                                                    */
/* -------------------------------------------------------------------------- */

Deno.test("makeLoggedInCv returns a fully‑populated LoggedIn viewer", () => {
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
/*  Group 3: JWT‑based session restore                                        */
/* -------------------------------------------------------------------------- */

Deno.test("createFromRequest with ACCESS cookie returns LoggedIn", async () => {
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
    // No new cookies should be issued when ACCESS is still valid
    assertEquals(resHeaders.has("set-cookie"), false);
  });
});

Deno.test("createFromRequest refreshes ACCESS when only REFRESH present", async () => {
  await withIsolatedDb(async () => {
    const { refresh } = await buildAuthCookies("gid_Person_789", "oid_Org_999");
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

    const issuedAccess = Array.from(resHeaders.values()).find((v) =>
      v.startsWith(`${ACCESS_COOKIE}=`)
    );
    assertExists(issuedAccess, "Expected ACCESS cookie to be refreshed");
    const claims = await verifySession(cookieVal(issuedAccess!));
    assertEquals(claims?.typ, "access");
  });
});

/* -------------------------------------------------------------------------- */
/*  Group 4: Google OAuth                                                     */
/* -------------------------------------------------------------------------- */

Deno.test("loginWithGoogleToken verifies token and returns LoggedIn viewer", async () => {
  await withIsolatedDb(async () => {
    // mock tokeninfo
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (input: string | URL | Request) => {
      if (String(input).startsWith("https://oauth2.googleapis.com/tokeninfo")) {
        const headers = new Headers({ "content-type": "application/json" });
        return Promise.resolve(
          new Response(
            JSON.stringify({
              email: "test@example.com",
              email_verified: true,
              hd: "example.com",
              sub: "123",
            }),
            { status: 200, headers },
          ),
        );
      }
      return originalFetch(input);
    };

    try {
      const viewer = await CurrentViewer.loginWithGoogleToken("fake_token");
      assertEquals(viewer.__typename, "CurrentViewerLoggedIn");
      assertEquals(viewer.personBfGid, "google-person:123");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

Deno.test(
  "GraphQL mutation loginWithGoogle issues cookies + returns LoggedIn",
  async () => {
    await withIsolatedDb(async () => {
      // mock tokeninfo
      const originalFetch = globalThis.fetch;
      globalThis.fetch = (input: string | URL | Request) => {
        if (
          String(input).startsWith("https://oauth2.googleapis.com/tokeninfo")
        ) {
          const headers = new Headers({ "content-type": "application/json" });
          return Promise.resolve(
            new Response(
              JSON.stringify({
                email: "graph@example.com",
                email_verified: true,
                hd: "example.com",
                sub: "456",
              }),
              { status: 200, headers },
            ),
          );
        }

        return originalFetch(input);
      };

      try {
        const body = {
          query:
            `mutation Login($token:String!){\n  loginWithGoogle (idToken:$token){ __typename }\n}`,
          variables: { token: "fake_graph_token" },
        };
        const gqlReq = new Request("https://bolt.test/graphql", {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify(body),
        });

        const ctx = await createContext(new Request("https://bolt.test/"));
        const res = await yoga.fetch(
          new URL("/graphql", import.meta.url),
          gqlReq,
          ctx,
        );

        const { data, errors } = await res.json();

        assertEquals(errors, undefined, "Expected no errors");

        assertEquals(
          data.loginWithGoogle.__typename,
          "CurrentViewerLoggedIn",
        );

        const setCookies = Array.from(ctx.getResponseHeaders().values());
        assert(
          setCookies.some((v) => v.startsWith(`${ACCESS_COOKIE}=`)) &&
            setCookies.some((v) => v.startsWith(`${REFRESH_COOKIE}=`)),
          "Expected both ACCESS and REFRESH cookies to be set",
        );
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  },
);
