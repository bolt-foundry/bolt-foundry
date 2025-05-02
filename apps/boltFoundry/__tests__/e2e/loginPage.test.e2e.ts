#! /usr/bin/env -S bff e2e

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertExists, assertStringIncludes } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";

Deno.test.ignore("User can sign in with email", async () => {
  const ctx = await setupE2ETest();

  try {
    /* 1️⃣  Go to the login page */
    await navigateTo(ctx, "/login");
    await ctx.takeScreenshot("login-initial");

    /* 2️⃣  Wait for the form element */
    const form = await ctx.page.waitForSelector(
      'input[placeholder="you@example.com"]',
    );
    assertExists(form, "Login form should be present");

    /* 3️⃣  Type into the email input (by placeholder) */
    await ctx.page.type(
      'input[placeholder="you@example.com"]',
      "test@example.com",
    );
    await ctx.takeScreenshot("login-email-filled");

    /* 4️⃣  Click the “Continue” button */
    await ctx.page.click("::-p-text(Continue)");
    await ctx.takeScreenshot("login-clicked-continue");

    /* 5️⃣  Wait for the success copy */
    const loggedInDiv = await ctx.page.waitForSelector(
      "::-p-text(logged in as)",
    );
    assertExists(
      loggedInDiv,
      'Expected a div containing the phrase "logged in as"',
    );

    const string = await loggedInDiv.evaluate((el) => el.textContent) ?? "";

    /* 6️⃣  Confirm it shows the correct typename */

    assertStringIncludes(
      string,
      "CurrentViewerLoggedIn",
      'Should contain "CurrentViewerLoggedIn"',
    );

    await ctx.takeScreenshot("login-success");
  } finally {
    await teardownE2ETest(ctx);
  }
});

Deno.test.ignore(
  "Visiting /login while logged-in shows you logged in",
  async () => {
    const ctx = await setupE2ETest();
    try {
      /* 1️⃣ Log-in via existing happy-path helper */
      await navigateTo(ctx, "/login");
      await ctx.takeScreenshot("session-initial");
      const form = await ctx.page.waitForSelector(
        'input[placeholder="you@example.com"]',
      );
      assertExists(form, "Login form should be present");

      /* 3️⃣  Type into the email input (by placeholder) */
      await ctx.page.type(
        'input[placeholder="you@example.com"]',
        "test@example.com",
      );

      await ctx.takeScreenshot("session-email-filled");
      await ctx.page.click("::-p-text(Continue)");
      await ctx.takeScreenshot("session-continued");
      const loggedInDiv = await ctx.page.waitForSelector(
        "::-p-text(logged in as)",
      );
      assertExists(
        loggedInDiv,
        'Expected a div containing the phrase "logged in as"',
      );

      await navigateTo(ctx, "/login");
      await ctx.takeScreenshot("session-revisited");

      const recheckedLoggedInDiv = await ctx.page.waitForSelector(
        "::-p-text(logged in as)",
      );

      const string = await recheckedLoggedInDiv?.evaluate((el) =>
        el.textContent
      ) ?? "";

      /* 6️⃣  Confirm it shows the correct typename */

      assertStringIncludes(
        string,
        "CurrentViewerLoggedIn",
        'Should contain "CurrentViewerLoggedIn"',
      );

      await ctx.takeScreenshot("session-success");
    } finally {
      await teardownE2ETest(ctx);
    }
  },
);

Deno.test.ignore(
  "user can sign in with Google and see CurrentViewerLoggedIn",
  async () => {
    const ctx = await setupE2ETest({ headless: false });
    const { page } = ctx;

    /* ── 1️⃣  Stub Google endpoints ───────────────────────────────────────── */
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();

      // 1️⃣  Let the Identity-Services SDK & its iframe through
      if (url.startsWith("https://accounts.google.com/gsi/")) {
        return req.continue();
      }

      // 2️⃣  Intercept ONLY the top-level popup document
      if (
        url.startsWith("https://accounts.google.com/") &&
        req.resourceType() === "document"
      ) {
        return req.respond({
          status: 200,
          contentType: "text/html",
          body: `
          <html><body>
            <script>
              window.opener.postMessage(
                { credential: "${
            getConfigurationVariable("GOOGLE_TEST_JWT")
          }" },
                "*"
              );
              window.close();
            </script>
          </body></html>`,
        });
      }

      // 3️⃣  Fake token-introspection
      if (url.startsWith("https://oauth2.googleapis.com/tokeninfo")) {
        return req.respond({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            email: "tester@example.com",
            email_verified: true,
          }),
        });
      }

      req.continue();
    });

    /* ── 2️⃣  Kick off login flow ─────────────────────────────────────────── */
    await navigateTo(ctx, "/login");
    await ctx.takeScreenshot("google-login-initial");

    // Find and click the Google Sign-In button
    const googleButton = await page.waitForSelector("text/Sign in with Google");
    await ctx.takeScreenshot("google-login-before-click");
    await googleButton?.click();
    await ctx.takeScreenshot("google-login-after-click");

    /* ── 3️⃣  Wait for loginWithGoogle request to /graphql ────────────────── */
    await page.waitForResponse((res) => {
      if (
        res.request().method() !== "POST" || !res.url().endsWith("/graphql")
      ) {
        return false;
      }
      try {
        const body = JSON.parse(res.request().postData() ?? "{}");
        return typeof body.query === "string" &&
          body.query.includes("loginWithGoogle");
      } catch {
        return false;
      }
    });

    const recheckedLoggedInDiv = await ctx.page.waitForSelector(
      "::-p-text(logged in as)",
    );

    const string =
      await recheckedLoggedInDiv?.evaluate((el) => el.textContent) ??
        "";

    /* 6️⃣  Confirm it shows the correct typename */

    assertStringIncludes(
      string,
      "CurrentViewerLoggedIn",
      'Should contain "CurrentViewerLoggedIn"',
    );

    await teardownE2ETest(ctx);
  },
);
