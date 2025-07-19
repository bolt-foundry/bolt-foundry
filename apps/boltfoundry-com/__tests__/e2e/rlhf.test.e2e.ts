import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("RLHF page screenshot", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording
    const stopRecording = await context.startVideoRecording("rlhf-demo");

    // Navigate to RLHF page
    await navigateTo(context, "/rlhf");

    // Wait for page to load completely
    await context.page.waitForNetworkIdle({ timeout: 5000 });

    // Wait for React hydration to complete - look for RLHF specific content
    await context.page.waitForFunction(() => {
      return document.querySelector("h1") &&
        document.querySelector("h1")?.textContent?.includes("RLHF");
    }, { timeout: 5000 });

    // Check that page loaded successfully (no 404)
    const pageContent = await context.page.content();
    logger.info("Page title:", await context.page.title());
    logger.info("Page URL:", context.page.url());

    // Extract just the body content for debugging
    const bodyContent = await context.page.evaluate(() =>
      document.body.innerText
    );
    logger.info("Body content:", bodyContent.substring(0, 500));

    // Check for JavaScript errors
    const errors = await context.page.evaluate(() => {
      return globalThis.console?.error || [];
    });
    logger.info("JavaScript errors:", errors);

    if (pageContent.includes("404") || pageContent.includes("Page not found")) {
      throw new Error(
        `RLHF page returned 404 - page not loading correctly. Body: ${
          bodyContent.substring(0, 200)
        }`,
      );
    }

    // Take screenshot
    await context.takeScreenshot("rlhf-page");

    // Stop video recording
    await stopRecording();
  } finally {
    await teardownE2ETest(context);
  }
});
