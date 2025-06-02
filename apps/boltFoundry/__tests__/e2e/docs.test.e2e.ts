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

    // Verify specific content from the quickstart.mdx is rendered
    assert(
      bodyText?.includes("Welcome to Bolt Foundry"),
      "Page should contain 'Welcome to Bolt Foundry' text",
    );

    assert(
      bodyText?.includes("Installation"),
      "Page should contain 'Installation' section",
    );

    assert(
      bodyText?.includes("Your First Structured Prompt"),
      "Page should contain 'Your First Structured Prompt' section",
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

    // Wait for the page to load (should show error page)
    await context.page.waitForSelector("body", { timeout: 5000 });

    // Take screenshot
    await context.takeScreenshot("docs-page-non-existent");

    // Check that the page shows an error
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    assert(
      bodyText?.includes("Documentation page not found") ||
        bodyText?.includes("Error") ||
        bodyText?.includes("404"),
      "Page should show an error for non-existent document",
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

Deno.test("Docs page loads README.md by default when no slug provided", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to /docs/ without a slug
    await navigateTo(context, "/docs");

    // Wait for the page to load
    await context.page.waitForSelector(".docs-container", { timeout: 5000 });

    // Take screenshot
    await context.takeScreenshot("docs-default-readme");

    // Check that the page shows content from README.md
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    assert(
      bodyText?.includes("Bolt Foundry") ||
        bodyText?.includes("Documentation") ||
        bodyText?.includes("README"),
      "Default docs page should show README.md content",
    );

    logger.info("Docs default page (README) test completed successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("docs-default-error");
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

      // Get the actual content
      const bodyText = await context.page.evaluate(() => {
        return document.body.textContent || "";
      });

      // Verify content loaded based on the document
      if (docSlug === "CHANGELOG") {
        // CHANGELOG.md is empty, so just check that the page loaded
        assert(
          bodyText.length > 0,
          `Docs page for ${docSlug} should load`,
        );
      } else if (docSlug === "STATUS") {
        assert(
          bodyText.includes("Bolt Foundry Project Status"),
          `Docs page for ${docSlug} should contain expected content`,
        );
      } else if (docSlug === "business-vision") {
        assert(
          bodyText.includes("Revenue model"),
          `Docs page for ${docSlug} should contain expected content`,
        );
      }

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
