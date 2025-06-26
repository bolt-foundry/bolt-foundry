#! /usr/bin/env -S bff test

import {
  ACCESS_COOKIE,
  buildAuthCookies,
  buildCookie,
  claimsFromRequest,
  REFRESH_COOKIE,
  setLoginSuccessHeaders,
  signSession,
  verifySession,
} from "@bfmono/apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { assert, assertEquals, assertExists, assertMatch } from "@std/assert";
import type { BfGid } from "@bfmono/lib/types.ts";

// Ensure deterministic secret for crypto helpers
Deno.env.set("JWT_SECRET", "test_secret_key");

const PERSON_GID = "gid_Person_123";
const ORG_OID = "oid_Org_456";

function extractCookieValue(cookieStr: string): string {
  return cookieStr.split(";")[0].split("=")[1];
}

Deno.test("signSession ↔ verifySession round‑trip", async () => {
  const token = await signSession({
    typ: "access",
    personGid: PERSON_GID,
    orgOid: ORG_OID,
  });

  const claims = await verifySession(token);
  assertExists(claims, "verifySession returned null for valid token");
  assertEquals(claims?.typ, "access");
  assertEquals(claims?.personGid, PERSON_GID);
  assertEquals(claims?.orgOid, ORG_OID);
});

Deno.test("verifySession rejects tampered token", async () => {
  const token = await signSession({
    typ: "access",
    personGid: PERSON_GID,
    orgOid: ORG_OID,
  });
  // Corrupt the signature (flip last char)
  const bad = token.slice(0, -1) + (token.slice(-1) === "A" ? "B" : "A");
  const claims = await verifySession(bad);
  assertEquals(claims, null);
});

Deno.test("buildCookie formats cookie string with default attrs", () => {
  const cookie = buildCookie("foo", "bar", 60);
  assertMatch(cookie, /^foo=bar;/);
  assert(cookie.includes("Path=/"));
  assert(cookie.includes("HttpOnly"));
  assert(cookie.includes("Secure"));
  assert(cookie.includes("SameSite=Lax"));
  assert(cookie.includes("Max-Age=60"));
});

Deno.test("buildAuthCookies issues ACCESS + REFRESH cookies", async () => {
  const { access, refresh } = await buildAuthCookies(PERSON_GID, ORG_OID, 7);

  assert(access.startsWith(`${ACCESS_COOKIE}=`));
  assert(refresh.startsWith(`${REFRESH_COOKIE}=`));

  const accessToken = extractCookieValue(access);
  const refreshToken = extractCookieValue(refresh);
  const accClaims = await verifySession(accessToken);
  const refClaims = await verifySession(refreshToken);

  assertExists(accClaims);
  assertExists(refClaims);
  assertEquals(accClaims?.typ, "access");
  assertEquals(refClaims?.typ, "refresh");
  assertEquals(refClaims?.ver, 7);
});

Deno.test("claimsFromRequest – valid ACCESS cookie", async () => {
  const { access } = await buildAuthCookies(PERSON_GID, ORG_OID);
  const req = new Request("http://localhost", {
    headers: { cookie: access },
  });
  const resHeaders = new Headers();

  const claims = await claimsFromRequest(req, resHeaders);

  assertExists(claims);
  assertEquals(claims?.personGid, PERSON_GID);
  assertEquals(resHeaders.get("Set-Cookie"), null);
});

Deno.test("claimsFromRequest – valid REFRESH cookie refreshes ACCESS", async () => {
  const { refresh } = await buildAuthCookies(PERSON_GID, ORG_OID);
  const req = new Request("http://localhost", {
    headers: { cookie: refresh },
  });
  const resHeaders = new Headers();

  const claims = await claimsFromRequest(req, resHeaders);
  assertExists(claims);

  const setCookies = [...resHeaders.values()];
  const issued = setCookies.find((c) => c.startsWith(`${ACCESS_COOKIE}=`));
  assertExists(issued, "No ACCESS cookie was issued during refresh path");
  const accToken = extractCookieValue(issued!);
  const accClaims = await verifySession(accToken);
  assertExists(accClaims);
  assertEquals(accClaims?.typ, "access");
});

Deno.test("claimsFromRequest – invalid REFRESH clears cookie", async () => {
  const validRefresh = await signSession({
    typ: "refresh",
    personGid: PERSON_GID,
    orgOid: ORG_OID,
  });
  const parts = validRefresh.split(".");
  const badRefreshJwt = `${parts[0]}.${parts[1]}.AAAA`;
  const badRefreshCookie = buildCookie(REFRESH_COOKIE, badRefreshJwt, 3600);

  const req = new Request("http://localhost", {
    headers: { cookie: badRefreshCookie },
  });
  const resHeaders = new Headers();

  const claims = await claimsFromRequest(req, resHeaders);
  assertEquals(claims, null);

  const cleared = [...resHeaders.values()].find((v) =>
    v.startsWith(`${REFRESH_COOKIE}=;`)
  );
  assertExists(cleared, "REFRESH cookie was not cleared on invalid token");
});

Deno.test("setLoginSuccessHeaders appends both cookies", async () => {
  const headers = new Headers();
  await setLoginSuccessHeaders(
    headers,
    PERSON_GID as BfGid,
    ORG_OID as BfGid,
    5,
  );

  const values = [...headers.values()];
  const hasAccess = values.some((v) => v.startsWith(`${ACCESS_COOKIE}=`));
  const hasRefresh = values.some((v) => v.startsWith(`${REFRESH_COOKIE}=`));
  assert(hasAccess && hasRefresh, "Expected both ACCESS and REFRESH cookies");
});
