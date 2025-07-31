#!/usr/bin/env -S bff e2e

import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { takeScreenshot, withVideoRecording } from "./shared/video-helpers.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("UI route renders UIDemo component correctly", async (t) => {
  const context = await setupBoltFoundryComTest();

  try {
    await withVideoRecording(
      context,
      "ui-route-demo",
      async (showSubtitle) => {
        await showSubtitle("UI Route - BfDs Design System Demo");

        await t.step(
          "Navigate to UI route and verify basic rendering",
          async () => {
            // Navigate to the /ui route
            await navigateTo(context, "/ui");
            await context.page.waitForNetworkIdle({ timeout: 3000 });

            // Verify the page title
            const title = await context.page.title();
            assertEquals(title, "Bolt Foundry");
            logger.info(`UI page title: ${title}`);

            // Check the current URL
            const currentUrl = await context.page.url();
            assert(currentUrl.includes("/ui"), "Should be on /ui route");
            logger.info(`Current URL: ${currentUrl}`);
          },
        );

        await t.step("Verify UIDemo content is rendered", async () => {
          // Check if the page contains expected UIDemo content
          const pageContent = await context.page.evaluate(() => {
            const bodyText = document.body.textContent || "";
            return {
              hasBfDsDemo: bodyText.includes("BfDs Demo"),
              hasDescription: bodyText.includes(
                "Interactive examples of BfDs design system components",
              ),
              hasButtonExamples: bodyText.includes("Button") &&
                bodyText.includes("Examples"),
              hasPrimaryButton: bodyText.includes("Primary"),
              hasSecondaryButton: bodyText.includes("Secondary"),
              hasTextStyles: bodyText.includes("Text Styles") ||
                bodyText.includes("Typography"),
            };
          });

          // Verify all expected content is present
          assert(
            pageContent.hasBfDsDemo,
            "Page should contain 'BfDs Demo' heading",
          );
          assert(
            pageContent.hasDescription,
            "Page should contain UIDemo description",
          );
          assert(
            pageContent.hasButtonExamples,
            "Page should contain button examples",
          );
          assert(
            pageContent.hasPrimaryButton,
            "Page should contain Primary button",
          );
          assert(
            pageContent.hasSecondaryButton,
            "Page should contain Secondary button",
          );

          logger.info("UIDemo content verified successfully");
        });

        await t.step("Check React hydration and environment", async () => {
          // Check the environment and routing state
          const routingInfo = await context.page.evaluate(() => {
            return {
              pathname: globalThis.location.pathname,
              // @ts-expect-error - Accessing global variable
              environment: globalThis.__ENVIRONMENT__,
              // @ts-expect-error - Accessing global variable
              hasRehydrate: typeof globalThis.__REHYDRATE__ !== "undefined",
              isHydrated: document.querySelector("#root") != null,
            };
          });

          logger.info(`Routing info: ${JSON.stringify(routingInfo, null, 2)}`);
          assertEquals(routingInfo.pathname, "/ui", "Should be on /ui path");
          assert(routingInfo.isHydrated, "React should be hydrated");
        });

        // Take a screenshot to show the UI route
        await takeScreenshot(context, "ui-route-current-state");

        logger.info("UI route test completed successfully");
      },
    );
  } catch (error) {
    await takeScreenshot(context, "ui-route-test-error");
    logger.error("UI route test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
