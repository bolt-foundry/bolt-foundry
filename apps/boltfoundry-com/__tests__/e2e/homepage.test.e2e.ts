#!/usr/bin/env -S bff e2e

import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { takeScreenshot } from "./shared/video-helpers.ts";
import { verifyAuthState } from "./shared/auth-helpers.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Homepage test", async (t) => {
  const context = await setupBoltFoundryComTest();

  try {
    await t.step("Homepage loads and displays correct content", async () => {
      // Navigate to homepage
      await navigateTo(context, "/");
      await context.page.waitForNetworkIdle({ timeout: 5000 });

      // Take screenshot
      await takeScreenshot(context, "homepage-current-state");

      // Check page title
      const title = await context.page.title();
      assertEquals(title, "Bolt Foundry");

      // Check main heading is visible
      const mainHeading = await context.page.evaluate(() => {
        const h1 = document.querySelector("h1");
        return h1?.textContent?.trim() || "";
      });
      assertEquals(
        mainHeading,
        "Understand what your LLM is really doing",
      );

      // Check React hydration status
      const reactStatus = await context.page.evaluate(() => {
        const root = document.querySelector("#root");
        return {
          hasRoot: !!root,
          hasContent: root ? root.innerHTML.length > 50 : false,
        };
      });
      assertEquals(reactStatus.hasRoot, true, "Should have React root element");
      assertEquals(
        reactStatus.hasContent,
        true,
        "React root should have content",
      );

      // Use shared auth helper to check authentication state
      const authState = await verifyAuthState(context);
      logger.info(
        `Homepage auth state: ${
          authState.isAuthenticated ? "Authenticated" : "Not authenticated"
        }`,
      );

      // Verify auth UI elements are present - check nav bar or any auth-related elements
      const authUICheck = await context.page.evaluate(() => {
        const bodyText = document.body.textContent || "";
        const buttons = Array.from(document.querySelectorAll("button"));
        const links = Array.from(document.querySelectorAll("a"));
        return {
          hasLoginButton: buttons.some((btn) =>
            btn.textContent?.includes("Login")
          ),
          hasLoginLink: links.some((link) =>
            link.textContent?.includes("Login")
          ),
          hasAuthText: bodyText.includes("Login") ||
            bodyText.includes("Sign In"),
          hasLogoutButton: buttons.some((btn) =>
            btn.textContent?.includes("Logout")
          ),
        };
      });

      const hasAuthUI = authState.hasLogoutButton ||
        authUICheck.hasLoginButton ||
        authUICheck.hasLoginLink ||
        authUICheck.hasAuthText;

      logger.info(`Auth UI check: ${JSON.stringify(authUICheck)}`);
      assertEquals(hasAuthUI, true, "Auth UI elements should be visible");
    });

    await t.step("Verify page resources loaded correctly", async () => {
      // Check what resources were loaded
      const resources = await context.page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll("script[src]"));
        const links = Array.from(document.querySelectorAll("link[href]"));
        return {
          scriptCount: scripts.length,
          cssCount: links.filter((l) =>
            l.getAttribute("rel") === "stylesheet"
          ).length,
          hasRoot: !!document.querySelector("#root"),
        };
      });

      assert(resources.scriptCount > 0, "Should have loaded JavaScript files");
      assert(resources.cssCount > 0, "Should have loaded CSS files");
      assert(resources.hasRoot, "Should have root element for React");

      logger.info(
        `Loaded ${resources.scriptCount} scripts and ${resources.cssCount} stylesheets`,
      );
    });
  } finally {
    await teardownE2ETest(context);
  }
});
