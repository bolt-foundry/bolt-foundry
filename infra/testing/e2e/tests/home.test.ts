import { assertEquals } from "@std/assert";
import { navigateTo, setupE2ETest, teardownE2ETest } from "../setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Home page loads successfully", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the home page
    await navigateTo(context, "/");

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

    logger.info("Home page test completed successfully");
  } catch (error) {
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
