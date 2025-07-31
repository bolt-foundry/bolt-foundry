import type { E2ETestContext } from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface VideoRecordingOptions {
  quality?: "low" | "medium" | "high";
  framerate?: number;
}

/**
 * Wraps a test function with video recording
 */
export async function withVideoRecording<T>(
  context: E2ETestContext,
  testName: string,
  testFn: (showSubtitle: (text: string) => Promise<void>) => Promise<T>,
  options: VideoRecordingOptions = {},
): Promise<T> {
  const { quality = "high", framerate = 30 } = options;

  const { stop, showSubtitle } = await context.startAnnotatedVideoRecording(
    testName,
    { quality, framerate },
  );

  try {
    const result = await testFn(showSubtitle);

    const videoResult = await stop();
    if (videoResult) {
      logger.info("🎬 Video recorded successfully!");
      logger.info(`   📹 Video: ${videoResult.videoPath}`);
      logger.info(`   📊 Duration: ${videoResult.duration}s`);
      logger.info(`   📏 Size: ${videoResult.fileSize} bytes`);
    }

    return result;
  } catch (error) {
    // Ensure video is stopped even on error
    await stop();
    throw error;
  }
}

/**
 * Takes a screenshot with optional naming
 */
export async function takeScreenshot(
  context: E2ETestContext,
  name: string,
  waitBeforeScreenshot: number = 0,
): Promise<void> {
  if (waitBeforeScreenshot > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitBeforeScreenshot));
  }

  await context.takeScreenshot(name);
  logger.info(`📸 Screenshot taken: ${name}`);
}

/**
 * Takes before and after screenshots for an action
 */
export async function withBeforeAfterScreenshots<T>(
  context: E2ETestContext,
  baseName: string,
  action: () => Promise<T>,
): Promise<T> {
  await takeScreenshot(context, `${baseName}-before`);
  const result = await action();
  await takeScreenshot(context, `${baseName}-after`, 500); // Wait 500ms for UI to settle
  return result;
}
