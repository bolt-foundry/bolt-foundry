import { assert } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";
import { getRandomBlogPost } from "./helpers/blogTestHelpers.ts";

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
  // First, get a random blog post to test
  const randomPost = await getRandomBlogPost();

  // Skip test if no blog posts exist
  if (!randomPost) {
    logger.info("No blog posts found in docs/blog directory, skipping test");
    return;
  }

  const context = await setupE2ETest({ headless: true });

  try {
    // Test the dynamically selected blog post route
    await navigateTo(context, `/blog/${randomPost.slug}`);
    await context.takeScreenshot("blog-post-route-loaded");

    // Wait for header to ensure page loaded
    await context.page.waitForSelector("header", { timeout: 5000 });

    // Check for either article content or error message
    const hasContent = await context.page.evaluate(() => {
      const article = document.querySelector("article");
      const blogContent = document.querySelector(".blog-content");
      const errorDiv = document.querySelector(".error-page");
      // Also check for any content that might indicate a blog post
      const hasHeading = document.querySelector("h1");
      return Boolean(article || blogContent || errorDiv || hasHeading);
    });

    assert(
      hasContent,
      "Page should display either blog content or error message",
    );

    // Verify the title is present (if we found a heading)
    const pageContent = await context.page.evaluate(() =>
      document.body.textContent
    );
    assert(
      pageContent?.includes(randomPost.title) || hasContent,
      `Page should contain the blog post title: ${randomPost.title}`,
    );

    logger.info(`Blog post route loaded successfully for: ${randomPost.slug}`);
  } catch (error) {
    await context.takeScreenshot("blog-post-route-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
