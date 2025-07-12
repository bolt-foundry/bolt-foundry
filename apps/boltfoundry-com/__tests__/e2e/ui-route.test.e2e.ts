import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { smoothClickText } from "@bfmono/infra/testing/video-recording/smooth-ui.ts";

const logger = getLogger(import.meta);

Deno.test("UI route renders UIDemo component correctly", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording
    const stopRecording = await context.startVideoRecording(
      "ui-route-demo",
      {
        outputFormat: "mp4" as const,
        framerate: 24,
        quality: "medium" as const,
      },
    );

    // Navigate to the /ui route
    await navigateTo(context, "/ui");

    // Wait for content to ensure page loaded
    const title = await context.page.title();
    logger.info(`UI page title: ${title}`);

    // Check the current URL
    const currentUrl = await context.page.url();
    logger.info(`Current URL: ${currentUrl}`);

    // Check the environment and routing state
    const routingInfo = await context.page.evaluate(() => {
      return {
        pathname: globalThis.location.pathname,
        // @ts-expect-error - Accessing global variable
        environment: globalThis.__ENVIRONMENT__,
        // @ts-expect-error - Accessing global variable
        hasRehydrate: typeof globalThis.__REHYDRATE__ !== "undefined",
      };
    });
    logger.info(`Routing info: ${JSON.stringify(routingInfo, null, 2)}`);

    // Wait a bit for hydration to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify the page title is correct
    assertEquals(title, "Bolt Foundry", "Page title should be 'Bolt Foundry'");

    // Check if the page contains expected UIDemo content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify UIDemo-specific content is present
    assert(
      bodyText?.includes("BfDs UI Demo"),
      "Page should contain 'BfDs UI Demo' heading",
    );

    assert(
      bodyText?.includes(
        "This is a simple demo of the BfDs design system components",
      ),
      "Page should contain UIDemo description",
    );

    assert(
      bodyText?.includes("Button Component"),
      "Page should contain Button Component section",
    );

    assert(
      bodyText?.includes("Primary Button"),
      "Page should contain Primary Button",
    );

    assert(
      bodyText?.includes("Secondary Button"),
      "Page should contain Secondary Button",
    );

    // Verify interactive counter is present
    const counterText = await context.page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const counterParagraph = paragraphs.find((p) =>
        p.textContent?.includes("Counter:")
      );
      return counterParagraph?.textContent;
    });
    logger.info(`Counter text found: "${counterText}"`);
    assert(
      counterText?.includes("Counter: 5"),
      `Counter should start at 5 in UIDemo, but found: "${counterText}"`,
    );

    // Find and click the increment button using text
    await smoothClickText(context, "Increment", { disabled: true });

    // Wait a moment for React to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the counter incremented
    const updatedCounterText = await context.page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const counterParagraph = paragraphs.find((p) =>
        p.textContent?.includes("Counter:")
      );
      return counterParagraph?.textContent;
    });
    assert(
      updatedCounterText?.includes("Counter: 6"),
      "Counter should increment to 6 after button click in UIDemo",
    );

    // Take a screenshot to show what the UI route looks like
    await context.takeScreenshot("ui-route-current-state");

    logger.info("UI route test completed successfully");

    // Stop video recording
    const videoResult = await stopRecording();
    if (videoResult) {
      logger.info(`Video saved to: ${videoResult.videoPath}`);
    } else {
      logger.error("Video recording failed: No result returned");
    }
  } catch (error) {
    await context.takeScreenshot("ui-route-test-error");
    logger.error("UI route test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
