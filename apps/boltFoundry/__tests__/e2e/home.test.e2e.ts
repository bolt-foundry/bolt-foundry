import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test.ignore("Home page loads successfully", async () => {
  const context = await setupE2ETest();

  try {
    // Navigate to the home page
    await navigateTo(context, "/");

    // Take screenshot after initial page load
    await context.takeScreenshot("home-page-initial");

    // Wait for content to ensure page loaded
    const title = await context.page.title();
    logger.info(`Page title: ${title}`);

    // Check if the page contains expected content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Basic assertion to verify the page loaded successfully
    assertEquals(
      typeof bodyText,
      "string",
      "Page body should contain text",
    );

    // Additional assertion that some content exists
    assertEquals(
      bodyText && bodyText.length > 0,
      true,
      "Page body should not be empty",
    );

    assert(
      bodyText?.includes("Foundry"),
      "Page should contain 'Foundry'... probably erroring otherwise",
    );

    // Take screenshot after test has completed successfully
    await context.takeScreenshot("home-page-completed");

    logger.info("Home page test completed successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("home-page-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
