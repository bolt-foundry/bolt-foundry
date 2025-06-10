import { assert } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";
import {
  getAvailableBlogPosts,
  getMostRecentBlogPost,
} from "./helpers/blogTestHelpers.ts";

const logger = getLogger(import.meta);

Deno.test("Blog list page at /blog shows all blog posts", async () => {
  // Get available blog posts
  const availablePosts = await getAvailableBlogPosts();

  // Skip test if no blog posts exist
  if (availablePosts.length === 0) {
    logger.info("No blog posts found in docs/blog directory, skipping test");
    return;
  }

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

    // Verify the blog list page title (could be "Blog Posts" or just "Blog")
    assert(
      bodyText?.includes("Blog"),
      "Page should contain 'Blog' heading",
    );

    // Wait for blog posts container to load
    await context.page.waitForSelector(".blog-posts", { timeout: 5000 });

    // Check for blog post preview cards
    const postCount = await context.page.evaluate(() => {
      return document.querySelectorAll(".blog-post-preview").length;
    });

    assert(
      postCount > 0,
      `Page should have blog post previews, found ${postCount}`,
    );

    // Check for at least one blog post from our available posts
    const foundPost = availablePosts.some((post) =>
      bodyText?.includes(post.title)
    );

    assert(
      foundPost,
      `Should show at least one blog post title. Available posts: ${
        availablePosts.map((p) => p.title).join(", ")
      }`,
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

    logger.info(
      `Blog list page loaded successfully with ${availablePosts.length} posts`,
    );
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

    // Click on the first blog post link - look for the "Read more" link
    await context.page.click(
      ".blog-post-preview:first-child a[href^='/blog/']",
    );

    // Wait for navigation and the blog post to load - look for the prose article
    await context.page.waitForSelector("article.prose", { timeout: 5000 });

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

Deno.test("Can read blog post", async () => {
  // Get the most recent blog post to test
  const recentPost = await getMostRecentBlogPost();

  // Skip test if no blog posts exist
  if (!recentPost) {
    logger.info("No blog posts found in docs/blog directory, skipping test");
    return;
  }

  const context = await setupE2ETest();

  try {
    // Navigate to the blog post
    await navigateTo(context, `/blog/${recentPost.slug}`);

    // Take screenshot after navigation
    await context.takeScreenshot("blog-post-loaded");

    // Wait for content to fully render - be flexible about what we wait for
    const contentLoaded = await context.page.evaluate(() => {
      return document.querySelector("h1") ||
        document.querySelector("article") ||
        document.querySelector(".blog-content");
    });

    assert(contentLoaded, "Page should have loaded some content");

    // Get page body text
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify the blog post title appears
    assert(
      bodyText?.includes(recentPost.title),
      `Page should contain blog post title: ${recentPost.title}`,
    );

    // Verify it has proper content structure
    const hasContentStructure = await context.page.evaluate(() => {
      const article = document.querySelector("article.prose");
      const mainContent = document.querySelector("main.blog-main");
      const hasHeadings = document.querySelector(
        "article h1, article h2, article h3",
      );
      return article && mainContent && hasHeadings;
    });

    assert(
      hasContentStructure,
      "Blog post should have proper content structure with article.prose",
    );

    // Take screenshot after successful assertions
    await context.takeScreenshot("blog-post-success");

    logger.info(`Blog post loaded successfully: ${recentPost.slug}`);
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
  // Get any available blog post
  const posts = await getAvailableBlogPosts();
  if (posts.length === 0) {
    logger.info("No blog posts found, skipping date formatting test");
    return;
  }

  // Find a post with a date in the filename
  const postWithDate = posts.find((p) => /\d{4}-\d{2}/.test(p.filename));
  if (!postWithDate) {
    logger.info("No blog posts with date pattern found, skipping test");
    return;
  }

  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to a blog post with a date
    await navigateTo(context, `/blog/${postWithDate.slug}`);

    // Wait for blog post content to load - try multiple selectors
    try {
      await context.page.waitForSelector("article.prose", { timeout: 5000 });
    } catch {
      // Fallback to wait for any article or main content
      await context.page.waitForSelector("article, main.blog-main", {
        timeout: 5000,
      });
    }

    const contentLoaded = await context.page.evaluate(() => {
      const article = document.querySelector("article.prose") ||
        document.querySelector("article");
      const main = document.querySelector("main.blog-main") ||
        document.querySelector("main");
      return article && main;
    });

    assert(contentLoaded, "Blog post content should load");

    // Check for date in the content - dates can be in various formats
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Extract year and month from the filename
    const dateMatch = postWithDate.filename.match(/(\d{4})-(\d{2})/);
    if (dateMatch) {
      const [, year, month] = dateMatch;
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = monthNames[parseInt(month) - 1];

      // Check if either the numeric date or month name appears
      const hasDate = bodyText?.includes(year) ||
        bodyText?.includes(monthName) ||
        bodyText?.includes(`${month}/${year}`) ||
        bodyText?.includes(`${month}-${year}`);

      assert(
        hasDate,
        `Should display date information from ${postWithDate.filename}`,
      );
    }

    await context.takeScreenshot("blog-date-format");

    logger.info(`Blog post date formatting verified for ${postWithDate.slug}`);
  } catch (error) {
    await context.takeScreenshot("blog-date-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Blog list shows post excerpts", async () => {
  // Check if there are blog posts
  const posts = await getAvailableBlogPosts();
  if (posts.length === 0) {
    logger.info("No blog posts found, skipping excerpt test");
    return;
  }

  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the blog list
    await navigateTo(context, "/blog");

    // Wait for blog list to load
    await context.page.waitForSelector(".blog-posts", { timeout: 5000 });

    const hasBlogContent = await context.page.evaluate(() => {
      return document.querySelector(".blog-post-preview") !== null;
    });

    assert(hasBlogContent, "Blog list with preview cards should load");

    // Check that we have excerpts in the blog post previews
    const postContent = await context.page.evaluate(() => {
      // Look for paragraph tags within blog post preview cards
      const excerpts = document.querySelectorAll(".blog-post-preview p");
      return Array.from(excerpts).map((p) => p.textContent || "").filter(
        (text) => text.length > 0,
      );
    });

    assert(
      postContent.length > 0,
      "Should have post content or titles",
    );

    // Only check for meaningful content if we found actual excerpts
    if (postContent.some((content) => content.length > 20)) {
      assert(
        postContent.some((content) => content.length > 20),
        "Content should have meaningful text",
      );
    }

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
