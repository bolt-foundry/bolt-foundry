#!/usr/bin/env -S deno test -A

import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("aibff GUI Test Conversation functionality", async () => {
  const context = await setupE2ETest({
    baseUrl: "http://localhost:4000",
  });

  try {
    await navigateTo(context, "/");

    // Wait for page to load
    await context.page.waitForSelector('[style*="width: 400px"]', {
      timeout: 10000,
    });

    logger.info("Page loaded, starting test conversation workflow");

    // Step 1: First, set up a system prompt
    logger.info("Step 1: Setting up system prompt");

    // Find all buttons and look for System Prompt
    const buttons = await context.page.$$("button");
    let systemPromptButton = null;

    for (const button of buttons) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("System Prompt")) {
        systemPromptButton = button;
        break;
      }
    }

    if (!systemPromptButton) {
      throw new Error("Could not find System Prompt button");
    }

    await systemPromptButton.click();
    await delay(2000); // Wait longer for accordion animation

    // Wait for any textarea to appear (more flexible selector)
    logger.info("Waiting for textarea to appear...");
    const systemPromptTextarea = await context.page.waitForSelector(
      "textarea",
      { timeout: 10000 },
    );

    if (!systemPromptTextarea) {
      throw new Error("Could not find system prompt textarea");
    }

    // Clear any existing content and type our test prompt
    await systemPromptTextarea.evaluate((el) => el.value = "");
    await systemPromptTextarea.type(
      "You are a helpful assistant that responds in exactly 10 words.",
    );
    await delay(1000);

    await context.takeScreenshot("test-conversation-01-system-prompt-set");
    logger.info("System prompt set successfully");

    // Step 2: Navigate to Test Conversation section
    logger.info("Step 2: Opening Test Conversation section");

    // Find all buttons again and look for Test Conversation
    const buttonsStep2 = await context.page.$$("button");
    let testConversationButton = null;

    for (const button of buttonsStep2) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("Test Conversation")) {
        testConversationButton = button;
        break;
      }
    }

    if (!testConversationButton) {
      throw new Error("Could not find Test Conversation button");
    }

    await testConversationButton.click();
    await delay(1000);

    await context.takeScreenshot("test-conversation-02-section-opened");
    logger.info("Test Conversation section opened");

    // Step 3: Send a test message
    logger.info("Step 3: Sending test message");

    // Find the test conversation input textarea
    const testInput = await context.page.waitForSelector(
      'textarea[placeholder*="Type your test message"]',
      { timeout: 5000 },
    );

    if (!testInput) {
      throw new Error("Could not find test conversation input textarea");
    }

    await testInput.type("What is the capital of France?");
    await delay(500);

    await context.takeScreenshot("test-conversation-03-message-typed");

    // Find Send button
    const buttonsStep3 = await context.page.$$("button");
    let sendButton = null;

    for (const button of buttonsStep3) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("Send")) {
        sendButton = button;
        break;
      }
    }

    if (!sendButton) {
      throw new Error("Could not find Send button");
    }

    await sendButton.click();

    logger.info("Message sent, waiting for AI response");
    await delay(2000); // Wait for response to start streaming

    await context.takeScreenshot("test-conversation-04-message-sent");

    // Step 4: Wait for AI response (check for assistant message)
    logger.info("Step 4: Waiting for AI response");

    // Wait for assistant response to appear (look for "Assistant" label)
    let attempts = 0;
    const maxAttempts = 15; // 15 seconds timeout

    while (attempts < maxAttempts) {
      try {
        const assistantMessage = await context.page.$(
          'div:has-text("Assistant")',
        );
        if (assistantMessage) {
          logger.info("Assistant response detected");
          break;
        }
      } catch {
        // Continue waiting
      }

      await delay(1000);
      attempts++;

      if (attempts % 3 === 0) {
        logger.info(
          `Still waiting for response... (${attempts}/${maxAttempts})`,
        );
      }
    }

    await delay(3000); // Wait for response to complete
    await context.takeScreenshot("test-conversation-05-response-received");

    // Step 5: Test the Save Result functionality
    logger.info("Step 5: Testing Save Result functionality");

    // Find Save Result button
    const buttonsStep5 = await context.page.$$("button");
    let saveResultButton = null;

    for (const button of buttonsStep5) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("Save Result")) {
        saveResultButton = button;
        break;
      }
    }

    if (!saveResultButton) {
      logger.warn("Could not find Save Result button");
    } else {
      // Check if Save Result button is enabled (should be since we have messages)
      const isDisabled = await saveResultButton.evaluate((el) =>
        el.hasAttribute("disabled")
      );
      if (isDisabled) {
        logger.warn(
          "Save Result button is disabled - this might indicate no messages were created",
        );
      } else {
        logger.info("Save Result button is enabled, clicking it");
        await saveResultButton.click();
        await delay(1000);
      }
    }

    await context.takeScreenshot("test-conversation-06-save-result-clicked");

    // Step 6: Check Saved Results section
    logger.info("Step 6: Checking Saved Results section");

    // Find Saved Results button
    const buttonsStep6 = await context.page.$$("button");
    let savedResultsButton = null;

    for (const button of buttonsStep6) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("Saved Results")) {
        savedResultsButton = button;
        break;
      }
    }

    if (!savedResultsButton) {
      logger.warn("Could not find Saved Results button");
    } else {
      await savedResultsButton.click();
      await delay(1000);
    }

    await context.takeScreenshot("test-conversation-07-saved-results-opened");

    // Step 7: Test the Clear functionality
    logger.info("Step 7: Testing Clear functionality");

    // Go back to Test Conversation - find it again
    const buttonsStep7 = await context.page.$$("button");
    let testConversationButton2 = null;

    for (const button of buttonsStep7) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("Test Conversation")) {
        testConversationButton2 = button;
        break;
      }
    }

    if (testConversationButton2) {
      await testConversationButton2.click();
      await delay(1000);
    }

    // Find Clear button
    const buttonsStep7b = await context.page.$$("button");
    let clearButton = null;

    for (const button of buttonsStep7b) {
      const text = await button.evaluate((el) => el.textContent?.trim());
      if (text && text.includes("Clear")) {
        clearButton = button;
        break;
      }
    }

    if (!clearButton) {
      logger.warn("Could not find Clear button");
    } else {
      await clearButton.click();
      await delay(1000);
    }

    await context.takeScreenshot("test-conversation-08-cleared");
    logger.info("Clear functionality tested");

    // Step 8: Final screenshot
    await context.takeScreenshot("test-conversation-09-final");

    logger.info("Test conversation functionality test completed successfully!");
  } catch (error) {
    logger.error("Test conversation functionality test failed:", error);
    await context.takeScreenshot("test-conversation-error");
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
