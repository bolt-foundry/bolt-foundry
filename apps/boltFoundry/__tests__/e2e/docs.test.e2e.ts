import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Docs quickstart page renders markdown content", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the quickstart docs page
    await navigateTo(context, "/docs/quickstart");

    // Wait for the page to load
    await context.page.waitForSelector("body", { timeout: 5000 });

    // Take screenshot after initial page load
    await context.takeScreenshot("docs-quickstart-page");

    // Check if the page contains expected content from quickstart.mdx
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify the page loaded successfully
    assertEquals(
      typeof bodyText,
      "string",
      "Page body should contain text",
    );

    // Verify specific content from the markdown is rendered
    assert(
      bodyText?.includes("Hello World"),
      "Page should contain 'Hello World' text",
    );

    assert(
      bodyText?.includes("You requested documentation for: quickstart"),
      "Page should contain the quickstart slug reference",
    );

    assert(
      bodyText?.includes("This is a sample markdown document"),
      "Page should contain the sample text",
    );

    logger.info("Docs quickstart page test completed successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("docs-quickstart-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Docs page handles non-existent document", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to a non-existent docs page
    await navigateTo(context, "/docs/non-existent-doc");

    // Wait for docs container to render (since we're returning content for all slugs)
    await context.page.waitForSelector(".docs-container", { timeout: 5000 });

    // Take screenshot
    await context.takeScreenshot("docs-page-non-existent");

    // Check that the page still renders with hello world content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    assert(
      bodyText?.includes("Hello World"),
      "Page should still render with Hello World content",
    );

    assert(
      bodyText?.includes("non-existent-doc"),
      "Page should reference the requested slug",
    );

    logger.info("Docs non-existent page test completed successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("docs-404-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Docs page renders different markdown files", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Test a few different docs pages
    const docsToTest = ["CHANGELOG", "STATUS", "business-vision"];

    for (const docSlug of docsToTest) {
      // Navigate to the docs page
      await navigateTo(context, `/docs/${docSlug}`);

      // Wait for content to load
      await context.page.waitForSelector(".docs-container", { timeout: 5000 });

      // Verify content loaded
      const hasContent = await context.page.evaluate(() => {
        const container = document.querySelector(".docs-container");
        return container && container.textContent &&
          container.textContent.length > 0;
      });

      assertEquals(
        hasContent,
        true,
        `Docs page for ${docSlug} should have content`,
      );

      // Take screenshot
      await context.takeScreenshot(`docs-page-${docSlug}`);

      logger.info(`Docs page ${docSlug} loaded successfully`);
    }
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("docs-multiple-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
