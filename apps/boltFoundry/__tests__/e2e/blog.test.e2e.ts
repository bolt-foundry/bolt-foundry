import { assert } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Blog list page at /blog shows all blog posts", async () => {
  const context = await setupE2ETest({ headless: true });

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
    await context.page.waitForSelector(".blog-post-preview", { timeout: 5000 });

    // Count the number of blog posts
    const postCount = await context.page.evaluate(() =>
      document.querySelectorAll(".blog-post-preview").length
    );

    assert(
      postCount > 0,
      `Should have at least one blog post, found ${postCount}`,
    );

    // Check for specific blog post titles we know exist
    assert(
      bodyText?.includes("The Future of DevOps"),
      "Should show 'The Future of DevOps' post",
    );

    assert(
      bodyText?.includes("Quantum Computing for Developers"),
      "Should show 'Quantum Computing for Developers' post",
    );

    // Check for navigation elements
    const blogLinks = await context.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[href^='/blog/']"));
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
    await teardownE2ETest(context);
  }
});

Deno.test("Can navigate from blog list to individual post", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the blog list page
    await navigateTo(context, "/blog");

    // Wait for blog posts to load
    await context.page.waitForSelector(".blog-post-preview", { timeout: 5000 });

    // Click on the first blog post link
    await context.page.click(
      ".blog-post-preview:first-child a[href^='/blog/']",
    );

    // Wait for navigation and content to load
    await context.page.waitForSelector("article", { timeout: 5000 });

    // Verify we're on a blog post page (URL should have changed)
    const currentUrl = context.page.url();
    assert(
      currentUrl.includes("/blog/") && currentUrl !== context.baseUrl + "/blog",
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
    await teardownE2ETest(context);
  }
});

Deno.test("Can read blog post at /blog/hello-world-2025-06-01", async () => {
  const context = await setupE2ETest();

  try {
    // Navigate to the blog post
    await navigateTo(context, "/blog/hello-world-2025-06-01");

    // Take screenshot after navigation
    await context.takeScreenshot("blog-post-loaded");

    // Wait for content to fully render
    await context.page.waitForSelector("h1", { timeout: 5000 });

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

Deno.test("Blog post shows proper date formatting", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to a blog post with a known date
    await navigateTo(context, "/blog/2025-06-future-of-devops");

    // Wait for content to load
    await context.page.waitForSelector("article", { timeout: 5000 });

    // Check for date in the content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    assert(
      bodyText?.includes("June 30, 2025"),
      "Should display formatted date",
    );

    await context.takeScreenshot("blog-date-format");

    logger.info("Blog post date formatting verified");
  } catch (error) {
    await context.takeScreenshot("blog-date-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Blog list shows post excerpts", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the blog list
    await navigateTo(context, "/blog");

    // Wait for blog posts to load
    await context.page.waitForSelector(".blog-post-preview", { timeout: 5000 });

    // Check that excerpts are displayed
    const excerpts = await context.page.evaluate(() => {
      const previews = document.querySelectorAll(".blog-post-preview p");
      return Array.from(previews).map((p) => p.textContent || "");
    });

    assert(
      excerpts.length > 0,
      "Should have post excerpts",
    );

    assert(
      excerpts.some((excerpt) => excerpt.length > 50),
      "Excerpts should have meaningful content",
    );

    await context.takeScreenshot("blog-excerpts");

    logger.info("Blog list excerpts verified");
  } catch (error) {
    await context.takeScreenshot("blog-excerpts-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
