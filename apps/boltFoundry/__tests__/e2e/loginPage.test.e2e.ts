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

Deno.test("Session persists across page reloads", async () => {
  const ctx = await setupE2ETest();

  try {
    /* 1️⃣ Regular email sign-in (re-uses the dev flow) */
    await navigateTo(ctx, "/login");
    await ctx.page.type(
      'input[placeholder="you@example.com"]',
      "test@example.com",
    );
    await ctx.page.click("::-p-text(Continue)");
    await ctx.page.waitForSelector("::-p-text(logged in as)");

    /* 2️⃣ Hard refresh */
    await ctx.page.reload({ waitUntil: "networkidle0" });

    /* 3️⃣ Should still display LoggedIn */
    const div = await ctx.page.waitForSelector("::-p-text(logged in as)");
    assertExists(div);
    const text = await div.evaluate((el) => el.textContent) ?? "";
    assertStringIncludes(text, "CurrentViewerLoggedIn");
  } finally {
    await teardownE2ETest(ctx);
  }
});

Deno.test("Visiting /login while logged-in redirects to /", async () => {
  const ctx = await setupE2ETest();
  try {
    /* 1️⃣ Log-in via existing happy-path helper */
    await navigateTo(ctx, "/login");
    await ctx.page.type(
      'input[placeholder="you@example.com"]',
      "test@example.com",
    );
    await ctx.page.click("::-p-text(Continue)");
    await ctx.page.waitForSelector("::-p-text(logged in as)");

    /* 2️⃣ Attempt to load /login again */
    await navigateTo(ctx, "/login");

    /* 3️⃣ Router / server should bounce us back to home (or show the “Already logged in” copy) */
    const url = ctx.page.url();
    assertEquals(
      url.endsWith("/") || url.endsWith("/home") || url.endsWith("/"),
      true,
      "Expected /login to redirect once a viewer is authenticated",
    );
  } finally {
    await teardownE2ETest(ctx);
  }
});
