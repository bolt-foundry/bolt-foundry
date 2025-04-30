#! /usr/bin/env -S bff e2e

import { assertExists, assertStringIncludes } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";

Deno.test("User can sign in with email", async () => {
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

Deno.test("Visiting /login while logged-in shows you logged in", async () => {
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
});

Deno.test("user can sign in with Google (GraphQL flow)", async () => {
  const ctx = await setupE2ETest({ headless: true });
  const { page } = ctx;

  /* ────────────────────────────── 1️⃣  Stub Google endpoints ───────────────────────────── */
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const url = req.url();

    // Popup HTML that immediately postMessage’s the fake JWT
    if (url.startsWith("https://accounts.google.com/")) {
      return req.respond({
        status: 200,
        contentType: "text/html",
        body: `
          <html><body>
            <script>
              window.opener.postMessage(
                { credential: "${Deno.env.get("GOOGLE_TEST_JWT")}" },
                "*"
              );
              window.close();
            </script>
          </body></html>`,
      });
    }

    // Google tokeninfo introspection
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

  /* ────────────────────────────── 2️⃣  Kick off login flow ─────────────────────────────── */
  await navigateTo(ctx, "/login");
  await page.click("text/Sign in with Google");

  /* ────────────────────────────── 3️⃣  Wait for GraphQL call  ───────────────────────────── */
  await page.waitForResponse((res) => {
    if (!res.url().endsWith("/graphql") || res.request().method() !== "POST") {
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

  /* ────────────────────────────── 4️⃣  Expect navbar greeting ──────────────────────────── */
  // This will stay red until the resolver sets cookies & viewer properly.
  await page.waitForSelector("text/Welcome, Tester");
  const greeting = await page.$("text/Welcome, Tester");
  assertExists(greeting); // <-- 🔴 fails now, turns 🟢 when Phase-1 is done

  await teardownE2ETest(ctx);
});

Deno.test("user can sign in with Google and see CurrentViewerLoggedIn", async () => {
  const ctx = await setupE2ETest({ headless: true });
  const { page } = ctx;

  /* ── 1️⃣  Stub Google endpoints ───────────────────────────────────────── */
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const url = req.url();

    // Fake popup that instantly postMessage’s a test JWT
    if (url.startsWith("https://accounts.google.com/")) {
      return req.respond({
        status: 200,
        contentType: "text/html",
        body: `
          <html><body>
            <script>
              window.opener.postMessage(
                { credential: "${Deno.env.get("GOOGLE_TEST_JWT")}" },
                "*"
              );
              window.close();
            </script>
          </body></html>`,
      });
    }

    // Stub tokeninfo verification
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
  await page.click("text/Sign in with Google");

  /* ── 3️⃣  Wait for loginWithGoogle request to /graphql ────────────────── */
  await page.waitForResponse((res) => {
    if (res.request().method() !== "POST" || !res.url().endsWith("/graphql")) {
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

  const string = await recheckedLoggedInDiv?.evaluate((el) => el.textContent) ??
    "";

  /* 6️⃣  Confirm it shows the correct typename */

  assertStringIncludes(
    string,
    "CurrentViewerLoggedIn",
    'Should contain "CurrentViewerLoggedIn"',
  );

  await teardownE2ETest(ctx);
});
