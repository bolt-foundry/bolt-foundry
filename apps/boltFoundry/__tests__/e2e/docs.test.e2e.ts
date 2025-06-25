import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Docs getting-started page renders markdown content", async () => {
  const context = await setupE2ETest();

  try {
    // Navigate to the getting-started docs page
    await navigateTo(context, "/docs/getting-started");

    // Wait for the page to load
    await context.page.waitForSelector("body", { timeout: 5000 });

    // Take screenshot after initial page load
    await context.takeScreenshot("docs-getting-started-page");

    // Check if the page contains expected content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify the page loaded successfully
    assertEquals(
      typeof bodyText,
      "string",
      "Page body should contain text",
    );

    // Verify the page has content
    assert(
      bodyText && bodyText.length > 200,
      "Page should contain substantial content",
    );

    // Verify no error messages
    assert(
      !bodyText?.includes("Documentation page not found"),
      "Page should not show error message",
    );

    logger.info("Docs getting-started page test completed successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("docs-getting-started-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Docs page handles non-existent document", async () => {
  const context = await setupE2ETest();

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
  const context = await setupE2ETest();

  try {
    // Navigate to /docs/ without a slug
    await navigateTo(context, "/docs");

    // Wait for the page to load
    await context.page.waitForSelector("body", { timeout: 5000 });

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
  const context = await setupE2ETest();

  try {
    // Get list of docs from the docs/guides directory
    const docsDir = "docs/guides";
    const files: Array<string> = [];

    for await (const entry of Deno.readDir(docsDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        // Remove file extension for the slug
        const slug = entry.name.replace(/\.md$/, "");
        files.push(slug);
      }
    }

    // Sort files to ensure consistent ordering
    files.sort();

    // Test first 3 and last 3 files (or all if less than 6)
    const filesToTest = files.length <= 6
      ? files
      : [...files.slice(0, 3), ...files.slice(-3)];

    logger.info(
      `Testing ${filesToTest.length} docs: ${filesToTest.join(", ")}`,
    );

    for (const docSlug of filesToTest) {
      // Navigate to the docs page
      await navigateTo(context, `/docs/${docSlug}`);

      // Wait for content to load
      await context.page.waitForSelector("body", { timeout: 5000 });

      // Get the rendered page content
      const bodyText = await context.page.evaluate(() => {
        return document.body.textContent || "";
      });

      // Check that the page has loaded with content
      assert(
        bodyText.length > 200,
        `Docs page for ${docSlug} should have substantial content (got ${bodyText.length} characters)`,
      );

      // Verify no error messages
      const hasError = bodyText.includes("Documentation page not found") ||
        bodyText.includes("Error loading") ||
        bodyText.includes("404") ||
        bodyText.includes("Page not found");
      assert(
        !hasError,
        `Docs page for ${docSlug} should not contain error messages`,
      );

      // Check that markdown was rendered (look for common HTML elements)
      const hasRenderedContent = await context.page.evaluate(() => {
        const article = document.querySelector("article.prose");
        if (!article) return false;

        // Check for common markdown-rendered elements
        return article.querySelector("h1, h2, h3") !== null ||
          article.querySelector("p") !== null ||
          article.querySelector("ul, ol") !== null ||
          article.querySelector("pre, code") !== null;
      });

      assert(
        hasRenderedContent,
        `Docs page for ${docSlug} should contain rendered markdown elements`,
      );

      logger.info(
        `Docs page ${docSlug} loaded successfully with ${bodyText.length} characters`,
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
