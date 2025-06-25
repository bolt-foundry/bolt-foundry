#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("aibff gui --dev loads successfully with BfDsLiteButton", async () => {
  // Start GUI dev server
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", "3006", "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const process = command.spawn();

  try {
    // Wait for server to be ready
    const maxRetries = 50; // 5 seconds with 100ms delay
    let serverReady = false;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch("http://localhost:3006/health");
        await response.body?.cancel();
        if (response.ok) {
          serverReady = true;
          break;
        }
      } catch {
        // Server not ready yet
      }
      await delay(100);
    }

    assertEquals(serverReady, true, "Server should start successfully");

    // Setup Puppeteer e2e test
    const context = await setupE2ETest({
      baseUrl: "http://localhost:3006",
      headless: true, // Run headless in tests
    });

    try {
      // Navigate to the GUI
      await context.page.goto(context.baseUrl, {
        waitUntil: "networkidle2",
      });

      // Take initial screenshot
      await context.takeScreenshot("aibff-gui-initial");

      // Wait for content to load
      await context.page.waitForSelector("h1");

      // Wait a bit more for React to hydrate
      await delay(500);

      const title = await context.page.title();
      logger.info(`Page title: ${title}`);
      assertEquals(title, "Vite + React + TS");

      // Check for both buttons
      const originalButton = await context.page.$("button[type='button']");
      assert(originalButton, "Original button should exist");

      // Debug: Log all button texts
      const buttonTexts = await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.map((btn) => btn.textContent);
      });
      logger.info("Found buttons:", buttonTexts);

      // Check for BfDsLiteButton by its text content
      const bfdsButtonExists = await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("BfDs count"));
      });

      if (!bfdsButtonExists) {
        // Log page content for debugging
        const pageContent = await context.page.content();
        logger.info("Page content length:", pageContent.length);

        // Check if there's an error message
        const errorText = await context.page.evaluate(() => {
          const errorElement = document.querySelector(".error") ||
            document.querySelector("[data-error]") ||
            document.body.querySelector("pre");
          return errorElement?.textContent;
        });
        if (errorText) {
          logger.error("Error on page:", errorText);
        }
      }

      assert(bfdsButtonExists, "BfDsLiteButton should exist");

      // Get initial count
      const initialCount = await context.page.evaluate(() => {
        const button = Array.from(document.querySelectorAll("button"))
          .find((btn) => btn.textContent?.includes("count is"));
        return button?.textContent?.match(/count is (\d+)/)?.[1];
      });
      assertEquals(initialCount, "0", "Initial count should be 0");

      // Click the BfDsLiteButton using evaluate
      await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const bfdsButton = buttons.find((btn) =>
          btn.textContent?.includes("BfDs count")
        );
        if (bfdsButton) {
          (bfdsButton as HTMLButtonElement).click();
        }
      });

      // Wait a bit for state to update
      await delay(100);

      // Check that both buttons show count 1
      const countAfterClick = await context.page.evaluate(() => {
        const button = Array.from(document.querySelectorAll("button"))
          .find((btn) => btn.textContent?.includes("count is"));
        return button?.textContent?.match(/count is (\d+)/)?.[1];
      });
      assertEquals(countAfterClick, "1", "Count should be 1 after clicking");

      // Verify BfDsLiteButton also shows count 1
      const bfdsCountAfterClick = await context.page.evaluate(() => {
        const button = Array.from(document.querySelectorAll("button"))
          .find((btn) => btn.textContent?.includes("BfDs count"));
        return button?.textContent?.match(/BfDs count is (\d+)/)?.[1];
      });
      assertEquals(
        bfdsCountAfterClick,
        "1",
        "BfDs button should also show count 1",
      );

      // Take screenshot after interaction
      await context.takeScreenshot("aibff-gui-after-click");

      logger.info("aibff GUI e2e test completed successfully");
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("aibff-gui-error");
      logger.error("Test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  } finally {
    // Cleanup dev server
    try {
      process.kill();

      // Close the streams to prevent leaks
      if (process.stdout) {
        await process.stdout.cancel();
      }
      if (process.stderr) {
        await process.stderr.cancel();
      }

      await process.status;
    } catch {
      // Process may have already exited
    }
  }
});
