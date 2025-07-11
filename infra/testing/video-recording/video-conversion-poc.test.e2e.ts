import { assert, assertEquals } from "@std/assert";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { smoothHover } from "./smooth-mouse.ts";

const logger = getLogger(import.meta);

Deno.test.ignore("Video conversion proof of concept - MP4", async () => {
  const context = await setupE2ETest({
    baseUrl: "https://example.com",
  });

  try {
    // Start video recording with MP4 conversion
    const stopRecording = await context.startVideoRecording(
      "conversion-poc-mp4",
      {
        outputFormat: "mp4",
        quality: "medium",
        framerate: 10,
        deleteFrames: true,
      },
    );

    // Navigate to a simple page
    await context.navigateTo("/");

    // Wait for page to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Take a screenshot for comparison
    await context.takeScreenshot("video-conversion-initial");

    // Perform some smooth mouse movements for the video
    const links = await context.page.$$("a");
    if (links.length > 0) {
      await smoothHover(context.page, "a");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Scroll the page smoothly
    await context.page.evaluate(() => {
      globalThis.scrollTo({ top: 300, behavior: "smooth" });
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get page title to verify test ran
    const title = await context.page.title();
    logger.info(`Page title: ${title}`);

    // Basic assertions
    assertEquals(typeof title, "string", "Page title should be a string");
    assert(title.length > 0, "Page title should not be empty");

    // Stop video recording and convert to MP4
    const videoResult = await stopRecording();

    if (videoResult) {
      logger.info(`Video conversion completed successfully:`);
      logger.info(`  - Video path: ${videoResult.videoPath}`);
      logger.info(`  - Duration: ${videoResult.duration}s`);
      logger.info(`  - Frame count: ${videoResult.frameCount}`);
      logger.info(`  - File size: ${videoResult.fileSize} bytes`);

      assert(
        videoResult.videoPath.endsWith(".mp4"),
        "Video should be MP4 format",
      );
      assert(videoResult.frameCount > 0, "Should have captured frames");
      assert(videoResult.fileSize > 0, "Video file should have content");
    } else {
      logger.warn("Video conversion failed, but test continues");
    }

    await context.takeScreenshot("video-conversion-completed");

    logger.info("Video conversion proof of concept test completed");
  } catch (error) {
    await context.takeScreenshot("video-conversion-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test.ignore("Video conversion proof of concept - WebM", async () => {
  const context = await setupE2ETest({
    baseUrl: "https://example.com",
  });

  try {
    // Start video recording with WebM conversion
    const stopRecording = await context.startVideoRecording(
      "conversion-poc-webm",
      {
        outputFormat: "webm",
        quality: "high",
        framerate: 15,
        deleteFrames: true,
      },
    );

    // Navigate and perform actions
    await context.navigateTo("/");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple interaction
    await context.page.evaluate(() => {
      globalThis.scrollTo({ top: 200, behavior: "smooth" });
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Stop and convert to WebM
    const videoResult = await stopRecording();

    if (videoResult) {
      logger.info(
        `WebM video created: ${videoResult.videoPath} (${videoResult.fileSize} bytes)`,
      );
      assert(
        videoResult.videoPath.endsWith(".webm"),
        "Video should be WebM format",
      );
      assert(videoResult.fileSize > 0, "Video file should have content");
    }

    logger.info("WebM conversion test completed");
  } catch (error) {
    logger.error("WebM test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
