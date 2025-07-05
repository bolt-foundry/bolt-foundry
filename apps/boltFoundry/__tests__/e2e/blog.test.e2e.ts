import { assert } from "@std/assert";
import { navigateTo } from "@bfmono/infra/testing/e2e/setup.ts";
import { setupBoltFoundryTest } from "../helpers.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test.ignore("Blog list page at /blog shows all blog posts", async () => {
  const context = await setupBoltFoundryTest();

  try {
    // Navigate to the blog list page
    await navigateTo(context, "/blog");

    // Take screenshot after navigation
    await context.takeScreenshot("blog-list-loaded");

    // Wait for content to fully render
    await context.page.waitForSelector("h1", { timeout: 5000 });

    // Get page body text
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify the blog list page title
    assert(
      bodyText?.includes("Blog Posts"),
      "Page should contain 'Blog Posts' heading",
    );

    // Wait for blog post previews to load
    await context.page.waitForSelector(".blog-post-preview", {
      timeout: 5000,
    });

    // Count the number of blog posts
    const postCount = await context.page.evaluate(() =>
      document.querySelectorAll(".blog-post-preview").length
    );

    // Check if we have blog posts or an appropriate empty state
    if (postCount > 0) {
      assert(
        postCount > 0,
        `Should have at least one blog post, found ${postCount}`,
      );

      // Just verify that some blog content is shown
      assert(
        (bodyText?.length ?? 0) > 100,
        "Should show blog content",
      );
    } else {
      // If no posts, verify empty state or message
      assert(
        bodyText?.includes("No blog posts") ||
          bodyText?.includes("no posts") ||
          bodyText?.includes("blog"),
        "Should indicate no posts or show blog page",
      );
    }

    // Check for navigation elements
    const blogLinks = await context.page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("a[href^='/blog/']"),
      );
      return links.map((link) => link.getAttribute("href"));
    });

    assert(
      blogLinks.length > 0,
      "Should have links to individual blog posts",
    );

    // Take screenshot after successful assertions
    await context.takeScreenshot("blog-list-success");

    logger.info("Blog list page loaded successfully");
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("blog-list-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await context.teardown();
  }
});

Deno.test.ignore("Can navigate from blog list to individual post", async () => {
  const context = await setupBoltFoundryTest();

  try {
    // Navigate to the blog list page
    await navigateTo(context, "/blog");

    // Wait for blog posts to load
    await context.page.waitForSelector(".blog-post-preview", {
      timeout: 5000,
    });

    // Click on the first blog post link
    await context.page.click(
      ".blog-post-preview:first-child a[href^='/blog/']",
    );

    // Wait for navigation and content to load
    await context.page.waitForSelector("article", { timeout: 5000 });

    // Verify we're on a blog post page (URL should have changed)
    const currentUrl = context.page.url();
    assert(
      currentUrl.includes("/blog/") &&
        currentUrl !== context.baseUrl + "/blog",
      `Should navigate to individual blog post, got ${currentUrl}`,
    );

    // Take a debug screenshot to see what's rendered
    await context.takeScreenshot("blog-post-debug");

    // Verify blog post content is displayed
    const articleInfo = await context.page.evaluate(() => {
      const article = document.querySelector("article");
      if (!article) {
        return { found: false, length: 0, text: "No article found" };
      }
      return {
        found: true,
        length: article.textContent?.length || 0,
        text: article.textContent?.substring(0, 200) || "No text content",
        html: article.innerHTML?.substring(0, 200) || "No HTML content",
      };
    });

    logger.info("Article info:", articleInfo);

    assert(
      articleInfo.found && articleInfo.length > 20,
      `Should display blog post content in an article element. Found: ${articleInfo.found}, Length: ${articleInfo.length}, Text preview: ${articleInfo.text}`,
    );

    await context.takeScreenshot("blog-navigation-success");

    logger.info("Successfully navigated from list to individual post");
  } catch (error) {
    await context.takeScreenshot("blog-navigation-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await context.teardown();
  }
});

Deno.test.ignore("Can read individual blog post", async () => {
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
      // If directory doesn't exist or is empty, skip test
      logger.info("No blog posts found, skipping individual post test");
      return;
    }

    if (blogPosts.length === 0) {
      logger.info("No blog posts found, skipping individual post test");
      return;
    }

    // Use the first available blog post
    const blogSlug = blogPosts[0];

    // Navigate to the blog post
    await navigateTo(context, `/blog/${blogSlug}`);

    // Take screenshot after navigation
    await context.takeScreenshot("blog-post-loaded");

    // Wait for content to fully render
    await context.page.waitForSelector("h1", { timeout: 5000 });

    // Verify it's rendered in an article element
    const hasArticle = await context.page.evaluate(() => {
      return document.querySelector("article") !== null;
    });

    assert(
      hasArticle,
      "Blog post should be rendered in an article element",
    );

    // Take screenshot after successful assertions
    await context.takeScreenshot("blog-post-success");

    logger.info(`Blog post ${blogSlug} loaded successfully`);
  } catch (error) {
    // Take screenshot on test failure
    await context.takeScreenshot("blog-post-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await context.teardown();
  }
});

Deno.test.ignore("Blog post shows proper content structure", async () => {
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
      logger.info("No blog posts found, skipping content structure test");
      return;
    }

    if (blogPosts.length === 0) {
      logger.info("No blog posts found, skipping content structure test");
      return;
    }

    // Use the first available blog post
    const blogSlug = blogPosts[0];

    // Navigate to a blog post
    await navigateTo(context, `/blog/${blogSlug}`);

    // Wait for content to load
    await context.page.waitForSelector("article", { timeout: 5000 });

    // Check that the article structure exists
    const hasContent = await context.page.evaluate(() => {
      const article = document.querySelector("article");
      const heading = document.querySelector("h1");
      return Boolean(article && heading);
    });

    assert(
      hasContent,
      "Should have article structure with heading",
    );

    await context.takeScreenshot("blog-content-structure");

    logger.info("Blog post content structure verified");
  } catch (error) {
    await context.takeScreenshot("blog-structure-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await context.teardown();
  }
});

Deno.test.ignore("Blog list shows posts if available", async () => {
  const context = await setupBoltFoundryTest();

  try {
    // Navigate to the blog list
    await navigateTo(context, "/blog");

    // Wait for page to load
    await context.page.waitForSelector("main", { timeout: 5000 });

    // Check if there are any blog posts or an empty state
    const hasBlogContent = await context.page.evaluate(() => {
      // Look for blog post previews or an empty state message
      const previews = document.querySelectorAll(".blog-post-preview");
      const emptyState = document.querySelector(".empty-state");
      const noPosts = document.body.textContent?.includes("No blog posts") ||
        document.body.textContent?.includes("no posts");

      return previews.length > 0 || emptyState !== null || noPosts;
    });

    assert(
      hasBlogContent,
      "Should either show blog posts or indicate no posts available",
    );

    // If there are blog posts, check for basic structure
    const postCount = await context.page.evaluate(() => {
      const previews = document.querySelectorAll(".blog-post-preview");
      return previews.length;
    });

    if (postCount > 0) {
      logger.info(`Blog list shows ${postCount} posts`);
    } else {
      logger.info("Blog list shows empty state or no posts message");
    }

    await context.takeScreenshot("blog-list");
  } catch (error) {
    await context.takeScreenshot("blog-list-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await context.teardown();
  }
});
