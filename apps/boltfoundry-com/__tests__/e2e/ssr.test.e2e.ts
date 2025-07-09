import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import { smoothClick } from "@bfmono/infra/testing/video-recording/smooth-ui.ts";

const logger = getLogger(import.meta);

Deno.test("SSR landing page loads and hydrates correctly", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Start video recording with conversion to MP4
    const stopRecording = await context.startVideoRecording(
      "ssr-hydration-demo",
      {
        outputFormat: "mp4" as const,
        framerate: 24,
        quality: "medium" as const,
      },
    );

    // Navigate to the home page
    await navigateTo(context, "/");

    // Remove manual screenshot - let video recording capture naturally

    // Wait for content to ensure page loaded
    const title = await context.page.title();
    logger.info(`Page title: ${title}`);

    // Verify the page title is correct
    assertEquals(title, "Bolt Foundry", "Page title should be 'Bolt Foundry'");

    // Check if the page contains expected server-rendered content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify core landing page content is present
    assert(
      bodyText?.includes("Bolt Foundry"),
      "Page should contain 'Bolt Foundry' heading",
    );

    assert(
      bodyText?.includes("Coming Soon"),
      "Page should contain 'Coming Soon' text",
    );

    assert(
      bodyText?.includes("Phase 1 implementation"),
      "Page should contain Phase 1 implementation text",
    );

    assert(
      bodyText?.includes("Architecture foundation established"),
      "Page should contain architecture foundation text",
    );

    assert(
      bodyText?.includes("© 2025 Bolt Foundry. All rights reserved."),
      "Page should contain copyright footer",
    );

    // Verify SSR-specific elements are present
    const rootElement = await context.page.$("#root");
    assert(rootElement, "Page should have #root element for React hydration");

    // Check that the server rendered the initial HTML structure
    const appElement = await context.page.$(".app");
    assert(appElement, "Page should have .app element from server rendering");

    // Verify that the client bundle script is loaded
    const clientScript = await context.page.evaluate(() => {
      const script = document.querySelector(
        'script[src="/static/build/ClientRoot.js"]',
      );
      return script !== null;
    });
    assert(clientScript, "Page should include ClientRoot.js script");

    // Verify that the __ENVIRONMENT__ global is set up for rehydration
    const hasEnvironment = await context.page.evaluate(() => {
      // @ts-expect-error - Testing runtime global
      return typeof globalThis.__ENVIRONMENT__ === "object";
    });
    assert(
      hasEnvironment,
      "Page should have __ENVIRONMENT__ global for rehydration",
    );

    // Verify the environment contains expected data
    const environment = await context.page.evaluate(() => {
      // @ts-expect-error - Testing runtime global
      return globalThis.__ENVIRONMENT__;
    });
    assert(environment?.mode, "Environment should contain mode");
    assert(environment?.port, "Environment should contain port");

    // Verify that CSS styles are applied correctly
    const headerStyles = await context.page.evaluate(() => {
      const header = document.querySelector(".app-header");
      if (!header) return null;
      const styles = globalThis.getComputedStyle(header);
      return {
        background: styles.background,
        color: styles.color,
        textAlign: styles.textAlign,
      };
    });

    assert(
      headerStyles?.textAlign === "center",
      "Header should be center-aligned",
    );
    assert(
      headerStyles?.color.includes("255, 255, 255") ||
        headerStyles?.color === "white",
      "Header text should be white",
    );

    // Test that the page is interactive (hydration worked)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Give time for hydration

    // Check if the counter is present and has initial value
    const counterText = await context.page.evaluate(() => {
      // Look for the specific paragraph containing "Counter:"
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const counterParagraph = paragraphs.find((p) =>
        p.textContent?.includes("Counter:")
      );
      return counterParagraph?.textContent;
    });
    logger.info(`Counter text found: "${counterText}"`);
    assert(
      counterText?.includes("Counter: 5"),
      `Counter should start at 5 (server-rendered), but found: "${counterText}"`,
    );

    // Find and click the increment button using smooth UI
    const incrementButton = await context.page.$("button");
    assert(
      incrementButton,
      "Increment button should be visible",
    );

    // Click the button to test hydration and interactivity using smooth UI
    await smoothClick(context, "button", { disabled: true });

    // Wait a moment for React to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the counter incremented (proving hydration worked)
    const updatedCounterText = await context.page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const counterParagraph = paragraphs.find((p) =>
        p.textContent?.includes("Counter:")
      );
      return counterParagraph?.textContent;
    });
    assert(
      updatedCounterText?.includes("Counter: 6"),
      "Counter should increment to 6 after button click (hydration working)",
    );

    // Click again to further verify interactivity
    await smoothClick(context, "button", { disabled: true });
    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalCounterText = await context.page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll("p"));
      const counterParagraph = paragraphs.find((p) =>
        p.textContent?.includes("Counter:")
      );
      return counterParagraph?.textContent;
    });
    assert(
      finalCounterText?.includes("Counter: 7"),
      "Counter should increment to 7 after second click",
    );

    // Remove manual screenshot - let video recording capture naturally

    logger.info("SSR landing page test completed successfully");

    // Stop video recording
    const videoResult = await stopRecording();
    if (videoResult) {
      logger.info(`Video saved to: ${videoResult.videoPath}`);
    } else {
      logger.error("Video recording failed: No result returned");
    }
  } catch (error) {
    // Remove manual screenshot on failure - video recording captures everything
    logger.error("SSR test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("SSR serves correct response headers", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Make request and check response headers
    const response = await context.page.goto(context.baseUrl);

    // Verify response is successful
    assertEquals(response?.status(), 200, "Response should be 200 OK");

    // Verify content type is HTML
    const contentType = response?.headers()["content-type"];
    assert(
      contentType?.includes("text/html"),
      "Response should have HTML content type",
    );

    // Get the raw HTML to verify server-side rendering
    const html = await response?.text();

    // Verify that the HTML contains server-rendered content
    assert(
      html?.includes('<div class="app">'),
      "HTML should contain server-rendered app structure",
    );

    assert(
      html?.includes("Bolt Foundry"),
      "HTML should contain server-rendered heading",
    );

    assert(
      html?.includes("Coming Soon"),
      "HTML should contain server-rendered subtitle",
    );

    // Verify that the rehydration script is included
    assert(
      html?.includes("globalThis.__ENVIRONMENT__"),
      "HTML should include environment setup for rehydration",
    );

    logger.info("SSR response headers test completed successfully");
  } catch (error) {
    await context.takeScreenshot("ssr-headers-test-error");
    logger.error("SSR headers test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("SSR handles static assets correctly", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Navigate to the home page first
    await navigateTo(context, "/");

    // Test that CSS is loaded correctly
    const cssResponse = await context.page.goto(
      new URL("/static/index.css", context.baseUrl).toString(),
    );
    assertEquals(
      cssResponse?.status(),
      200,
      "CSS should be served successfully",
    );

    const cssContentType = cssResponse?.headers()["content-type"];
    assert(
      cssContentType?.includes("text/css"),
      "CSS should have correct content type",
    );

    // Test that JavaScript is loaded correctly
    const jsResponse = await context.page.goto(
      new URL("/static/build/ClientRoot.js", context.baseUrl).toString(),
    );
    assertEquals(
      jsResponse?.status(),
      200,
      "JavaScript should be served successfully",
    );

    const jsContentType = jsResponse?.headers()["content-type"];
    assert(
      jsContentType?.includes("javascript"),
      "JavaScript should have correct content type",
    );

    logger.info("SSR static assets test completed successfully");
  } catch (error) {
    await context.takeScreenshot("ssr-assets-test-error");
    logger.error("SSR static assets test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
