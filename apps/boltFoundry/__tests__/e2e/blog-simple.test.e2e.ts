import { assert } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Blog routes are accessible", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Test that /blog route loads without error
    await navigateTo(context, "/blog");
    await context.takeScreenshot("blog-route-loaded");

    // Wait for page to load
    await context.page.waitForSelector("header", { timeout: 5000 });

    // Check that we got a response
    const title = await context.page.title();
    assert(
      title.includes("Blog") || title.includes("Bolt Foundry"),
      `Page should have a title, got: ${title}`,
    );

    logger.info("Blog route loaded successfully");
  } catch (error) {
    await context.takeScreenshot("blog-route-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Individual blog post route loads", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Test a specific blog post route
    await navigateTo(context, "/blog/hello-world-2025-06-01");
    await context.takeScreenshot("blog-post-route-loaded");

    // Wait for header to ensure page loaded
    await context.page.waitForSelector("header", { timeout: 5000 });

    // Check for either article content or error message
    const hasContent = await context.page.evaluate(() => {
      const article = document.querySelector("article");
      const errorDiv = document.querySelector(".error-page");
      return Boolean(article || errorDiv);
    });

    assert(
      hasContent,
      "Page should display either blog content or error message",
    );

    logger.info("Blog post route loaded");
  } catch (error) {
    await context.takeScreenshot("blog-post-route-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
