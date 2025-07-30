import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";

const logger = getLogger(import.meta);

Deno.test("Blog page loads successfully", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording
    const stopRecording = await context.startVideoRecording("blog-page-demo");

    // Navigate to the blog page
    await navigateTo(context, "/blog");

    // Wait for content to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Basic assertions to verify the page loaded
    const title = await context.page.title();
    logger.info("Page title:", title);

    // Verify we're on the blog page
    assertEquals(title, "Blog");

    // Verify the page content is present
    const pageContent = await context.page.evaluate(() =>
      document.body.textContent
    );
    assert(pageContent, "Page should have content");

    // Check if the blog header is present
    const hasBlogHeader = pageContent.includes("Blog Posts");
    assert(hasBlogHeader, "Blog page should have 'Blog Posts' header");

    // Check if blog navigation is active
    const blogNavActive = await context.page.evaluate(() => {
      const blogButton = Array.from(document.querySelectorAll("button, a"))
        .find((el) => el.textContent?.trim() === "Blog");
      return blogButton?.classList.contains("bf-ds-button--primary") || false;
    });
    logger.info("Blog navigation active:", blogNavActive);

    // Check if blog posts are loaded
    const blogPosts = await context.page.evaluate(() => {
      const articles = document.querySelectorAll("article.blog-post-preview");
      return articles.length;
    });
    logger.info("Number of blog posts found:", blogPosts);
    assert(blogPosts > 0, "Should have at least one blog post");

    // Check if blog post elements have correct structure
    const firstPostDetails = await context.page.evaluate(() => {
      const firstPost = document.querySelector("article.blog-post-preview");
      if (!firstPost) return null;

      const title = firstPost.querySelector("h2")?.textContent;
      const metadata = firstPost.querySelector(".metadata")?.textContent;
      const excerpt = firstPost.querySelector("p")?.textContent;
      const readMoreLink = firstPost.querySelector("a[href^='/blog/']");

      return {
        hasTitle: !!title,
        hasMetadata: !!metadata,
        hasExcerpt: !!excerpt,
        hasReadMoreLink: !!readMoreLink,
        title,
      };
    });

    logger.info("First post details:", firstPostDetails);
    assert(firstPostDetails, "Should have first post details");
    assert(firstPostDetails.hasTitle, "Blog post should have title");
    assert(firstPostDetails.hasMetadata, "Blog post should have metadata");
    assert(
      firstPostDetails.hasReadMoreLink,
      "Blog post should have read more link",
    );

    // Check if blog CSS is loaded
    const blogStylesLoaded = await context.page.evaluate(() => {
      const blogMain = document.querySelector(".blog-main");
      if (!blogMain) return false;

      const styles = globalThis.getComputedStyle(blogMain);
      // Check if blog styles are applied (not default values)
      return styles.padding !== "0px" || styles.margin !== "0px";
    });
    logger.info("Blog styles loaded:", blogStylesLoaded);

    // Take a screenshot for comparison
    await context.takeScreenshot("blog-page-loaded");

    // Stop video recording
    const videoResult = await stopRecording();
    if (videoResult) {
      logger.info("Video recorded:", videoResult.videoPath);
    }

    logger.info("Blog page loaded successfully");
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Blog navigation from homepage works", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording
    const stopRecording = await context.startVideoRecording(
      "blog-navigation-demo",
    );

    // Start at homepage
    await navigateTo(context, "/");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Click on Blog navigation button
    await context.page.evaluate(() => {
      const blogButton = Array.from(document.querySelectorAll("button, a"))
        .find((el) => el.textContent?.trim() === "Blog");
      if (blogButton instanceof HTMLElement) {
        blogButton.click();
      }
    });

    // Wait for navigation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify we're on the blog page
    const url = context.page.url();
    assert(url.endsWith("/blog"), `Should navigate to /blog, got ${url}`);

    // Verify blog content loaded
    const hasBlogContent = await context.page.evaluate(() => {
      const blogHeader = document.body.textContent?.includes("Blog Posts");
      const articles = document.querySelectorAll("article.blog-post-preview");
      return blogHeader && articles.length > 0;
    });
    assert(hasBlogContent, "Blog page should load after navigation");

    // Take a screenshot of the blog page after navigation
    await context.takeScreenshot("blog-navigation-success");

    // Stop video recording
    const videoResult = await stopRecording();
    if (videoResult) {
      logger.info("Video recorded:", videoResult.videoPath);
    }

    logger.info("Blog navigation successful");
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Blog post links are properly formatted", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording for the link test
    const stopRecording = await context.startVideoRecording("blog-links-demo");

    // Navigate to the blog page
    await navigateTo(context, "/blog");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Take screenshot of blog list
    await context.takeScreenshot("blog-links-initial");

    // Check all blog post links
    const postLinks = await context.page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("article a[href^='/blog/']"),
      );
      return links.map((link) => ({
        href: link.getAttribute("href"),
        text: link.textContent,
      }));
    });

    logger.info("Found blog post links:", postLinks);
    assert(postLinks.length > 0, "Should have blog post links");

    // Verify each link has proper format
    for (const link of postLinks) {
      assert(link.href?.startsWith("/blog/"), "Links should start with /blog/");
      assert(
        link.href && link.href.length > 6,
        "Links should have slug after /blog/",
      );
    }

    // Check that clicking a blog post link shows coming soon message
    if (postLinks.length > 0) {
      await context.page.click(`a[href="${postLinks[0].href}"]`);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Take screenshot of individual blog post page
      await context.takeScreenshot("blog-individual-post");

      const hasComingSoon = await context.page.evaluate(() =>
        document.body.textContent?.includes("Individual blog posts coming soon")
      );
      assert(
        hasComingSoon,
        "Should show coming soon message for individual posts",
      );
    }

    // Stop video recording
    const videoResult = await stopRecording();
    if (videoResult) {
      logger.info("Video recorded:", videoResult.videoPath);
    }

    logger.info("Blog post links properly formatted");
  } finally {
    await teardownE2ETest(context);
  }
});
