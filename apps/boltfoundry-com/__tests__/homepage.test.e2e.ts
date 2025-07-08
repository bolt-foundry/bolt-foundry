import { assert } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "./helpers.ts";

const logger = getLogger(import.meta);

Deno.test("Homepage displays GitHub stars with Hello World message", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Navigate to homepage
    await navigateTo(context, "/");

    // Take screenshot of initial load
    await context.takeScreenshot("homepage-initial-load");

    // Wait for GitHub stars data to load
    // This will wait for text that matches "Hello World - bolt-foundry/bolt-foundry has [number] stars"
    await context.page.waitForFunction(() => {
      const bodyText = document.body.textContent || "";
      const githubStarsPattern =
        /Hello World - bolt-foundry\/bolt-foundry has \d+ stars/;
      return githubStarsPattern.test(bodyText);
    }, { timeout: 15000 }); // 15 second timeout to allow for GitHub API call

    // Get the actual text content
    const pageText = await context.page.evaluate(() =>
      document.body.textContent || ""
    );

    // Assert the basic structure is correct
    assert(
      pageText.includes("Hello World - bolt-foundry/bolt-foundry has"),
      `Expected page to contain "Hello World - bolt-foundry/bolt-foundry has" but got: ${pageText}`,
    );

    assert(
      pageText.includes("stars"),
      `Expected page to contain "stars" but got: ${pageText}`,
    );

    // Extract and validate the star count is a number
    const match = pageText.match(
      /Hello World - bolt-foundry\/bolt-foundry has (\d+) stars/,
    );
    assert(match, `Expected to find star count pattern in: ${pageText}`);

    const starCount = parseInt(match[1], 10);
    assert(
      !isNaN(starCount) && starCount > 0,
      `Expected star count to be a positive number, got: ${match[1]}`,
    );

    logger.info(`✅ Homepage test passed with ${starCount} GitHub stars`);

    // Take final screenshot
    await context.takeScreenshot("homepage-test-completed");
  } catch (error) {
    logger.error("❌ Homepage test failed:", error);
    await context.takeScreenshot("homepage-test-error");
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
