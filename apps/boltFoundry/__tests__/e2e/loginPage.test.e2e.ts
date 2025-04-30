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

Deno.test("user can sign in with Google and see CurrentViewerLoggedIn", async () => {
  const ctx = await setupE2ETest({ headless: false });
  const { page } = ctx;

  await page.evaluateOnNewDocument(
    (jwt: string) => {
      /* global helper the test will poke */
      (globalThis as any).__gsi = { fire: () => {} };

      (globalThis as any).google = {
        accounts: {
          id: {
            initialize({ callback }: { callback: (p: any) => void }) {
              /* store for later; test will call __gsi.fire() */
              (globalThis as any).__gsi.fire = () =>
                callback({ credential: jwt });
            },
            renderButton(container: HTMLElement) {
              const btn = document.createElement("button");
              btn.id = "google-btn";
              btn.textContent = "Sign in with Google";
              container.appendChild(btn);
            },
            prompt: () => {},
            cancel: () => {},
          },
        },
      };
    },
    Deno.env.get("GOOGLE_TEST_JWT")!,
  );

  /* keep the real SDK from loading */
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().startsWith("https://accounts.google.com/gsi/client")) {
      req.respond({ status: 200, body: "" });
    } else req.continue();
  });

  /* ── 2️⃣  Kick off login flow ─────────────────────────────────────────── */
  await navigateTo(ctx, "/login");
  await ctx.takeScreenshot("google-login-initial");


  /* 1️⃣  Button is in the DOM */
  await page.waitForSelector("#google-btn");
  await ctx.takeScreenshot("google-login-button");

  /* 2️⃣  Pretend the user clicked it: run the stored callback */
  await page.evaluate(() => (window as any).__gsi.fire());
  await ctx.takeScreenshot("google-login-after-click");

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
  ctx.takeScreenshot("google-login-after-request");

  const recheckedLoggedInDiv = await ctx.page.waitForSelector(
    "::-p-text(logged in as)",
  );
  ctx.takeScreenshot("google-login-after-div");

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
