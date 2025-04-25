#!/usr/bin/env -S bff e2e

/**
 * 🔴 Red E2E – rewritten to use the shared setup helpers.
 * Will turn green once the dev Google-login stub is functional.
 */

import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Dev Google login flow", async () => {
  const context = await setupE2ETest();

  try {
    /* ── 1. Open /login ──────────────────────────────────────────── */
    await navigateTo(context, "/login");
    await context.takeScreenshot("login-page-initial");

    /* ── 2. Click the (stub) Google button ───────────────────────── */
    // Button will exist after Phase 0 implementation
    await context.page.locator("[data-test=dev-google-login]").click();

    /* ── 3. Wait for redirect and navbar greeting ────────────────── */
    await context.page.waitForSelector("text=Welcome, Test User", {
      timeout: 5_000,
    });
    await context.takeScreenshot("login-page-post-auth");

    /* ── 4. Assertions ───────────────────────────────────────────── */
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    assertEquals(typeof bodyText, "string", "Body text should be a string");
    assertEquals(
      bodyText && bodyText.length > 0,
      true,
      "Body text should not be empty",
    );
    assert(
      bodyText?.includes("Welcome, Test User"),
      "Navbar should show 'Welcome, Test User'",
    );

    logger.info("Dev Google login flow test completed successfully");
  } catch (error) {
    await context.takeScreenshot("login-page-error");
    logger.error("Dev Google login flow failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
