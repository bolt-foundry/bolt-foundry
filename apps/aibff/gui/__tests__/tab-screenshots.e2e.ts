#!/usr/bin/env -S deno test -A

import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupAibffGuiTest } from "./helpers.ts";

const logger = getLogger(import.meta);

Deno.test("aibff GUI accordion screenshots", async () => {
  const context = await setupAibffGuiTest();

  const sections = [
    { id: "input-variables", label: "Input Variables" },
    { id: "system-prompt", label: "System Prompt" },
    { id: "test-conversation", label: "Test Conversation" },
    { id: "saved-results", label: "Saved Results" },
    { id: "calibration", label: "Calibration" },
    { id: "eval-prompt", label: "Eval Prompt" },
    { id: "run-eval", label: "Run Eval" },
    { id: "files", label: "Files" },
  ];

  try {
    await context.navigateTo("/");

    // Wait for page to load
    await context.page.waitForSelector('[style*="width: 400px"]', {
      timeout: 10000,
    });

    // Take initial screenshot
    await context.takeScreenshot("aibff-gui-accordion-initial");
    logger.info("Initial accordion screenshot captured");

    // Get all buttons and try to find accordion section buttons
    const buttons = await context.page.$$("button");
    logger.info(`Found ${buttons.length} buttons on the page`);

    // Take screenshot before clicking anything
    await context.takeScreenshot("aibff-gui-accordion-before-clicks");

    for (let i = 0; i < buttons.length; i++) {
      try {
        const button = buttons[i];
        const text = await button.evaluate((el) => el.textContent?.trim());
        logger.info(`Button ${i}: "${text}"`);

        // Check if this button contains one of our accordion section names
        const matchingSection = sections.find((section) =>
          text && text.includes(section.label)
        );
        if (matchingSection) {
          logger.info(
            `Clicking on accordion section: ${matchingSection.label}`,
          );
          await button.click();
          await delay(1000);
          await context.takeScreenshot(
            `aibff-gui-accordion-${matchingSection.id}`,
          );
          logger.info(
            `Screenshot captured for accordion section: ${matchingSection.label}`,
          );
        }
      } catch (error) {
        logger.error(`Error with button ${i}:`, error);
      }
    }

    // Take final screenshot
    await context.takeScreenshot("aibff-gui-accordion-final");
    logger.info("Final accordion screenshot captured");
  } finally {
    await context.teardown();
  }
});
