#! /usr/bin/env -S bff e2e

import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";
import type { Dialog } from "puppeteer-core";

// End-to-end test: verifies that the boltFoundry.com app loads successfully
// and the bfDs button integration works correctly.
// Steps:
// 1. Navigate to the home page
// 2. Verify page loads with expected content
// 3. Find and click the bfDs button
// 4. Verify the alert appears
// 5. Take screenshots for debugging

const logger = getLogger(import.meta);

Deno.test("boltFoundry.com app happy path", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    logger.info("Starting boltFoundry.com happy path test");

    // 1️⃣ Navigate to the home page
    await navigateTo(context, "/");
    await context.takeScreenshot("home-initial");

    // 2️⃣ Wait for page to load and verify expected content
    await context.page.waitForSelector("h1", { timeout: 10_000 });

    // Verify main heading
    const heading = await context.page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1?.textContent;
    });

    if (heading !== "Bolt Foundry") {
      throw new Error(`Expected heading "Bolt Foundry" but got "${heading}"`);
    }

    // Verify description text
    const description = await context.page.evaluate(() => {
      const p = document.querySelector("p");
      return p?.textContent;
    });

    if (
      !description?.includes("Open-source platform for reliable LLM systems")
    ) {
      throw new Error(
        `Expected description about LLM systems but got "${description}"`,
      );
    }

    // 3️⃣ Find and verify the bfDs button
    await context.page.waitForSelector("button", { timeout: 10_000 });

    const buttonText = await context.page.evaluate(() => {
      const button = document.querySelector("button");
      return button?.textContent;
    });

    if (!buttonText?.includes("Test bfDs Button")) {
      throw new Error(
        `Expected button text "Test bfDs Button" but got "${buttonText}"`,
      );
    }

    await context.takeScreenshot("button-visible");

    // 4️⃣ Set up dialog handler for the alert
    let alertMessage = "";
    context.page.on("dialog", async (dialog: Dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Click the button
    await context.page.click("button");

    // Wait a moment for the alert to appear and be handled
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 5️⃣ Verify the alert appeared with correct message
    if (!alertMessage.includes("BfDs integration working!")) {
      throw new Error(
        `Expected alert "BfDs integration working!" but got "${alertMessage}"`,
      );
    }

    await context.takeScreenshot("test-complete");
    logger.info("boltFoundry.com happy path test completed successfully");
  } catch (error) {
    await context.takeScreenshot("test-error");

    // Log current page state for debugging
    const pageState = await context.page.evaluate(() => {
      return {
        url: globalThis.location.href,
        title: document.title,
        bodyText: document.body.innerText.substring(0, 500),
        buttonExists: !!document.querySelector("button"),
        headingText: document.querySelector("h1")?.textContent,
      };
    });

    logger.error("boltFoundry.com happy path test failed", {
      error: error instanceof Error ? error.message : String(error),
      pageState,
      timestamp: new Date().toISOString(),
    });

    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
