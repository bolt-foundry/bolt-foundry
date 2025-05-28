#!/usr/bin/env -S bff test

import { assert } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("renders interactive demo page with React components", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the interactive demo page
    await navigateTo(context, "/docs/interactive-demo");

    // Take screenshot after initial page load
    await context.takeScreenshot("interactive-demo-initial");

    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if the page contains expected content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify page loaded with interactive content
    assert(
      bodyText?.includes("Interactive Demo"),
      "Page should contain Interactive Demo heading"
    );
    
    assert(
      bodyText?.includes("Interactive Counter"),
      "Page should contain the counter component"
    );

    // Test counter interactivity
    const initialCount = await context.page.evaluate(() => {
      const counterText = document.body.textContent || '';
      const match = counterText.match(/Count: (\d+)/);
      return match ? parseInt(match[1]) : null;
    });

    assert(
      initialCount === 0,
      "Counter should start at 0"
    );

    // Click the increment button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const incrementButton = buttons.find(btn => btn.textContent === 'Increment');
      if (incrementButton) {
        (incrementButton as HTMLButtonElement).click();
      }
    });

    // Wait a bit for state update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if counter incremented
    const newCount = await context.page.evaluate(() => {
      const counterText = document.body.textContent || '';
      const match = counterText.match(/Count: (\d+)/);
      return match ? parseInt(match[1]) : null;
    });

    assert(
      newCount === 1,
      `Counter should increment to 1, but got ${newCount}`
    );

    // Take screenshot after interaction
    await context.takeScreenshot("interactive-demo-after-click");

    logger.info(`Interactive demo test passed - counter incremented from ${initialCount} to ${newCount}`);
  } finally {
    await teardownE2ETest(context);
  }
});