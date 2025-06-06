import { assert } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Can read blog post at /blog/hello-world-2025-06-01", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the blog post
    await navigateTo(context, "/blog/hello-world-2025-06-01");

    // Get page body text
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify the blog post content appears
    assert(
      bodyText?.includes("Hello World"),
      "Page should contain 'Hello World' heading",
    );

    assert(
      bodyText?.includes("This is our first blog post"),
      "Page should contain blog post content",
    );

    logger.info("Blog post loaded successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("blog-post-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
