#! /usr/bin/env -S bff e2e

import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryTest } from "../helpers.ts";
import { signSession } from "@bfmono/apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { graphQLHandler } from "@bfmono/apps/bfDb/graphql/graphqlServer.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

/**
 * This E2E verifies that a user can log in with Google and that the access
 * + refresh cookies are persisted between navigations when running in a local
 * (`http://localhost`) environment.
 *
 * Key points handled here:
 *   1.  Yoga returns **two** `Set‑Cookie` headers → we must forward both.
 *   2.  Those cookies include `; Secure`. Browsers discard them on HTTP, so we
 *       strip that flag while the test server is running on plain‐HTTP.
 *   3.  The Deno `Headers` type has no `raw()` helper (unlike `node‑fetch`), so
 *       we use `headers.getSetCookie()` (a Deno extension) to pull **all**
 *       cookie strings.
 */

const logger = getLogger(import.meta);

Deno.env.set("JWT_SECRET", "test_secret_key");

const TEST_JWT = await signSession(
  {
    typ: "access",
    personGid: "gid_Person_e2e",
    orgOid: "oid_Org_e2e",
  },
  { expiresIn: "15m" },
);

Deno.test.ignore(
  "user can sign in with Google and see CurrentViewerLoggedIn",
  async () => {
    const ctx = await setupBoltFoundryTest();
    const { page } = ctx;

    /* ── 1️⃣ Stub Google token verification so Yoga accepts our fake credential ── */
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (input: Request | URL | string, init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith("https://oauth2.googleapis.com/tokeninfo")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              email: "tester@example.com",
              email_verified: true,
              sub: "12345",
              hd: "example.com",
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
        );
      }
      return originalFetch(input, init as never);
    };

    /* ── 2️⃣ Intercept external requests (block GIS script, proxy GraphQL) ───── */
    await page.setRequestInterception(true);
    page.on("request", async (req) => {
      const url = req.url();
      const method = req.method();

      // Block the real Google Identity‑Services JS
      if (url.startsWith("https://accounts.google.com/gsi/client")) {
        return req.respond({
          status: 200,
          contentType: "text/javascript",
          body: "", // empty stub
        });
      }

      // Proxy GraphQL requests to the in‑process Yoga server
      if (method === "POST" && url.endsWith("/graphql")) {
        logger.info(`Proxying GraphQL request to ${url}`);
        const res = await graphQLHandler(
          new Request(url, {
            method,
            headers: req.headers(),
            body: req.postData(),
          }),
        );
        logger.info(
          `GraphQL request proxied to ${url} with status ${res.status}`,
          req,
          res,
        );

        // Convert Headers → plain object *without* collapsing duplicate keys.
        const headersObj: Record<string, string | Array<string>> = Object
          .fromEntries(
            res.headers,
          );

        // Pull all Set‑Cookie header values (Deno extension).
        // `getSetCookie()` returns string[] of *every* Set‑Cookie header.
        const allCookies: Array<string> = (res.headers as unknown as {
          getSetCookie(): Array<string>;
        }).getSetCookie?.() ?? [];

        if (allCookies.length) {
          // Browsers discard `Secure` cookies on http://, so strip the flag when
          // we’re NOT serving over HTTPS (i.e. in local E2E runs).
          const stripped = allCookies.map((c) => c.replace(/;\s*Secure/gi, ""));
          headersObj["Set-Cookie"] = stripped;
        }

        return req.respond({
          status: res.status,
          headers: headersObj,
          contentType: res.headers.get("content-type") ?? "application/json",
          body: await res.text(),
        });
      }

      req.continue();
    });

    /* ── 3️⃣ Inject a stubbed google.accounts.id implementation EARLY ─────────── */
    await page.evaluateOnNewDocument((jwt) => {
      let interceptedCallback:
        | ((arg: { credential: string; select_by: string }) => void)
        | undefined;

      // deno-lint-ignore no-explicit-any
      (globalThis as any).google = {
        accounts: {
          id: {
            initialize({ callback }: { callback?: (r: unknown) => void }) {
              interceptedCallback = callback;
            },
            renderButton(el: HTMLElement) {
              el.innerHTML =
                '<button id="fake-google">Fake Google Sign‑In</button>';
              el.querySelector("button")?.addEventListener("click", () => {
                interceptedCallback?.({ credential: jwt, select_by: "btn" });
              });
            },
            /* no‑op helpers we don’t need in the test */
            prompt() {},
            disableAutoSelect() {},
            storeCredential() {},
            cancel() {},
            revoke() {},
          },
          oauth2: {
            initTokenClient() {
              return { requestAccessToken() {} } as const;
            },
            initCodeClient() {
              return { requestCode() {} } as const;
            },
            hasGrantedAllScopes() {
              return true;
            },
            hasGrantedAnyScope() {
              return true;
            },
            revoke() {},
          },
        },
      };
    }, TEST_JWT);

    /* ── 4️⃣ Visit the login page ─────────────────────────────────────────────── */
    await navigateTo(ctx, "/login");

    // Wait for our stub button then snapshot
    await page.waitForSelector("#fake-google");
    await ctx.takeScreenshot("google-login-visible");

    /* ── 5️⃣ Complete the login flow ─────────────────────────────────────────── */
    await page.click("#fake-google");

    await ctx.takeScreenshot("google-login-complete");

    /* ── 6️⃣ Assert viewer shows logged‑in banner, even after reload ─────────── */
    await page.waitForSelector("text/CurrentViewerLoggedIn");

    await navigateTo(ctx, "/login");
    await ctx.takeScreenshot("google-login-revisited");
    await page.waitForSelector("text/CurrentViewerLoggedIn");

    /* ── 7️⃣ Cleanup ─────────────────────────────────────────────────────────── */
    globalThis.fetch = originalFetch;
    await teardownE2ETest(ctx);
  },
);
