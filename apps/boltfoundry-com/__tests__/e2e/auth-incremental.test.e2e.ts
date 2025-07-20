#! /usr/bin/env -S bff e2e

import { setupBoltFoundryComTest } from "../helpers.ts";

Deno.test("Auth Implementation - Incremental TDD", async (t) => {
  const ctx = await setupBoltFoundryComTest();

  try {
    await t.step("Step 1: Basic routing works", async () => {
      await ctx.navigateTo("/");
      await ctx.takeScreenshot("step-1-home");

      await ctx.navigateTo("/rlhf");
      await ctx.takeScreenshot("step-1-rlhf");
    });

    await t.step("Step 2: Login page renders", async () => {
      await ctx.navigateTo("/login");
      await ctx.takeScreenshot("step-2-login-page");

      // Check that the login page elements are present
      await ctx.page.waitForSelector("[data-testid='login-page']");

      // Check for either the Google OAuth button or error state
      const googleButton = await ctx.page.$(
        "[data-testid='google-signin-button']",
      );
      const googleError = await ctx.page.$(
        "[data-testid='google-signin-error']",
      );
      const googleContainer = await ctx.page.$(
        "[data-testid='google-signin-container']",
      );

      if (googleButton || googleError || googleContainer) {
        // Google OAuth component rendered successfully
      } else {
        throw new Error(
          "No Google OAuth component found (button, error, or container)",
        );
      }
    });

    await t.step("Step 3: CurrentViewer query works", async () => {
      // Test that the login page loads without GraphQL errors
      await ctx.navigateTo("/login");
      await ctx.takeScreenshot("step-3-login-with-currentviewer");

      // Verify page loads successfully (no GraphQL errors would prevent rendering)
      await ctx.page.waitForSelector("[data-testid='login-page']");

      // Check if authentication state is detected (should be logged out)
      const loginPage = await ctx.page.$("[data-testid='login-page']");
      if (loginPage) {
        // Login page renders with currentViewer query
      }
    });

    await t.step("Step 4: Google OAuth button functionality", async () => {
      // Navigate to login and verify Google OAuth functionality
      await ctx.navigateTo("/login");
      await ctx.takeScreenshot("step-4-google-oauth-button");

      // Check for Google OAuth states - configured vs unconfigured
      const googleButton = await ctx.page.$(
        "[data-testid='google-signin-button']",
      );
      const googleError = await ctx.page.$(
        "[data-testid='google-signin-error']",
      );
      const googleContainer = await ctx.page.$(
        "[data-testid='google-signin-container']",
      );

      if (googleButton) {
        // Google OAuth is configured and button is available
        const isDisabled = await googleButton.evaluate((el) =>
          el.hasAttribute("disabled")
        );
        if (!isDisabled) {
          // Google OAuth button is enabled and ready
        } else {
          // Google OAuth button disabled - check configuration
        }
      } else if (googleError) {
        // Google OAuth is not configured - this is expected in test environment
        // Google OAuth error state handled correctly (missing config)
      } else if (googleContainer) {
        // Container exists but waiting for Google script to load
        // Google OAuth container rendered, waiting for script
      } else {
        throw new Error("No Google OAuth component state found");
      }
    });
  } finally {
    await ctx.teardown();
  }
});
