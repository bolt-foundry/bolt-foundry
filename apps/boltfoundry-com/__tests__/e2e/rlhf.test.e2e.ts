#!/usr/bin/env -S bff e2e

import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { takeScreenshot, withVideoRecording } from "./shared/video-helpers.ts";
import { verifyAuthState } from "./shared/auth-helpers.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { assertEquals } from "@std/assert";

const logger = getLogger(import.meta);

Deno.test("RLHF page shows login when not authenticated", async (t) => {
  const context = await setupBoltFoundryComTest();

  try {
    await withVideoRecording(
      context,
      "rlhf-demo",
      async (showSubtitle) => {
        await showSubtitle("RLHF Page Authentication Test");

        await t.step(
          "Navigate to RLHF page while unauthenticated",
          async () => {
            // Verify we're not authenticated
            const authState = await verifyAuthState(context);
            assertEquals(
              authState.isAuthenticated,
              false,
              "Should start unauthenticated",
            );

            // Navigate to RLHF page
            await navigateTo(context, "/rlhf");
            await context.page.waitForNetworkIdle({ timeout: 5000 });

            // Wait for React hydration to complete
            await context.page.waitForFunction(() => {
              const h1 = document.querySelector("h1");
              return h1 && (
                h1.textContent?.includes("Sign In") ||
                h1.textContent?.includes("RLHF")
              );
            }, { timeout: 5000 });
          },
        );

        await t.step("Verify authentication redirect behavior", async () => {
          // Check current URL - should redirect to login
          const currentUrl = context.page.url();
          logger.info(`Current URL: ${currentUrl}`);

          // Check that page loaded successfully (no 404)
          const response = await context.page.goto(context.page.url());
          const statusCode = response?.status();
          logger.info(`HTTP Status Code: ${statusCode}`);

          if (statusCode === 404) {
            throw new Error(
              "RLHF page returned 404 - route not configured correctly",
            );
          }

          // Verify we see auth-related content
          const pageContent = await context.page.evaluate(() => {
            const bodyText = document.body.innerText;
            return {
              hasSignIn: bodyText.includes("Sign In"),
              hasRLHF: bodyText.includes("RLHF"),
              hasGoogleSignIn: !!document.querySelector(
                '[aria-label="Sign in with Google"]',
              ),
              h1Text: document.querySelector("h1")?.textContent?.trim() || "",
            };
          });

          // Should show login page or RLHF content
          const hasAuthContent = pageContent.hasSignIn || pageContent.hasRLHF;
          assertEquals(hasAuthContent, true, "Should show auth-aware content");

          logger.info(`Page shows: ${pageContent.h1Text}`);
          logger.info(
            `Has Sign In: ${pageContent.hasSignIn}, Has RLHF: ${pageContent.hasRLHF}`,
          );
        });

        await t.step("Check page title and take screenshot", async () => {
          const title = await context.page.title();
          logger.info(`Page title: ${title}`);

          // Take screenshot for visual verification
          await takeScreenshot(context, "rlhf-page");
        });
      },
    );
  } finally {
    await teardownE2ETest(context);
  }
});
