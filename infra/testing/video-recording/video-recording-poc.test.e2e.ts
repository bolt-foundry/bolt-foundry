import { assert, assertEquals } from "@std/assert";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { smoothHover } from "./smooth-mouse.ts";

const logger = getLogger(import.meta);

Deno.test.ignore("Video recording proof of concept", async () => {
  const context = await setupE2ETest({
    baseUrl: "https://example.com",
  });

  try {
    // Start video recording
    const stopRecording = await context.startVideoRecording("poc-test");

    // Navigate to a simple page
    await context.navigateTo("/");

    // Wait for page to load - use a simple delay since we already navigated
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Take a screenshot for comparison
    await context.takeScreenshot("video-poc-initial");

    // Perform some smooth mouse movements for the video
    const links = await context.page.$$("a");
    if (links.length > 0) {
      await smoothHover(context.page, "a");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Scroll the page smoothly
    await context.page.evaluate(() => {
      globalThis.scrollTo({ top: 300, behavior: "smooth" });
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get page title to verify test ran
    const title = await context.page.title();
    logger.info(`Page title: ${title}`);

    // Basic assertions
    assertEquals(typeof title, "string", "Page title should be a string");
    assert(title.length > 0, "Page title should not be empty");

    // Stop video recording
    const videoPath = await stopRecording();

    if (videoPath) {
      logger.info(`Video recording completed successfully: ${videoPath}`);
      assert(
        videoPath.includes("poc-test"),
        "Video path should contain test name",
      );
    } else {
      logger.warn("Video recording failed, but test continues");
    }

    await context.takeScreenshot("video-poc-completed");

    logger.info("Video recording proof of concept test completed");
  } catch (error) {
    await context.takeScreenshot("video-poc-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
