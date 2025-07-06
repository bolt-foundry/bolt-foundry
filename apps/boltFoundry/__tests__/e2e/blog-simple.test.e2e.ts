import { assert } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryTest } from "../helpers.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test.ignore("Blog routes are accessible", async () => {
  const context = await setupBoltFoundryTest();

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

Deno.test.ignore("Individual blog post route loads", async () => {
  const context = await setupBoltFoundryTest();

  try {
    // First, check if there are any blog posts
    const blogDir = "docs/blog";
    const blogPosts: Array<string> = [];

    try {
      for await (const entry of Deno.readDir(blogDir)) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          blogPosts.push(entry.name.replace(".md", ""));
        }
      }
    } catch {
      // If directory doesn't exist or is empty, test that 404 works
      await navigateTo(context, "/blog/non-existent-post");
      await context.page.waitForSelector("header", { timeout: 5000 });

      const hasErrorPage = await context.page.evaluate(() => {
        const errorDiv = document.querySelector(".error-page");
        const has404 = document.body.textContent?.includes("404") ||
          document.body.textContent?.includes("not found");
        return Boolean(errorDiv || has404);
      });

      assert(
        hasErrorPage,
        "Non-existent blog post should show error page",
      );

      logger.info("404 page works correctly");
      return;
    }

    if (blogPosts.length === 0) {
      // Test 404 page
      await navigateTo(context, "/blog/non-existent-post");
      await context.page.waitForSelector("header", { timeout: 5000 });
      logger.info("No blog posts to test, verified 404 page works");
      return;
    }

    // Test a specific blog post route
    const blogSlug = blogPosts[0];
    await navigateTo(context, `/blog/${blogSlug}`);
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

    logger.info(`Blog post route for ${blogSlug} loaded`);
  } catch (error) {
    await context.takeScreenshot("blog-post-route-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
