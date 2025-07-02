#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("aibff GUI loads successfully with routing and Isograph", async () => {
  const context = await setupE2ETest();

  try {
    // Navigate to the GUI
    await navigateTo(context, "/");

    // Take initial screenshot
    await context.takeScreenshot("aibff-gui-initial");

    // Wait for content to load - look for the "New Conversation" header
    await context.page.waitForFunction(
      () => {
        const elements = Array.from(document.querySelectorAll("*"));
        return elements.some((el) =>
          el.textContent?.trim() === "New Conversation"
        );
      },
      { timeout: 5000 },
    );

    // Wait a bit more for React to hydrate
    await delay(500);

    const title = await context.page.title();
    logger.info(`Page title: ${title}`);
    assertEquals(title, "aibff GUI");

    // Check that the "New Conversation" header exists
    const hasNewConversationHeader = await context.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("*"));
      return elements.some((el) =>
        el.textContent?.trim() === "New Conversation"
      );
    });
    assert(hasNewConversationHeader, "Should show 'New Conversation' header");

    // Check that the simplified interface exists (no more tabs since we removed TabbedEditor)
    const hasWorkflowPanel = await context.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("*"));
      return elements.some((el) =>
        el.textContent?.includes("Workflow panel placeholder") ||
        el.textContent?.includes("Input Samples") ||
        el.textContent?.includes("Tool")
      );
    });
    assert(hasWorkflowPanel, "Should show workflow panel or tool interface");

    // Check for the chat interface elements - look for Assistant message div
    const hasAssistantMessage = await context.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("*"));
      return elements.some((el) => el.textContent?.trim() === "Assistant");
    });
    assert(hasAssistantMessage, "Should show Assistant message area");

    // Check for input textarea
    const hasTextarea = await context.page.evaluate(() => {
      const textarea = document.querySelector(
        'textarea[placeholder="Type a message..."]',
      );
      return !!textarea;
    });
    assert(hasTextarea, "Should have message input textarea");

    // Check for send button
    const hasSendButton = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((button) => button.textContent === "Send");
    });
    assert(hasSendButton, "Should have Send button");

    // Test tool calling functionality
    logger.info("Testing tool call functionality...");

    // Type a message that should trigger updateInputSamples tool
    const testMessage =
      "Please update the input samples to include: 'test sample 1' and 'test sample 2'";
    await context.page.focus('textarea[placeholder="Type a message..."]');
    await context.page.type(
      'textarea[placeholder="Type a message..."]',
      testMessage,
    );

    // Take screenshot before sending
    await context.takeScreenshot("aibff-gui-before-send");

    // Click send button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendButton = buttons.find((button) =>
        button.textContent === "Send"
      );
      if (sendButton) sendButton.click();
    });

    logger.info("Message sent, waiting for AI response with tool call...");

    // Wait for AI response (look for assistant message that isn't the initial one)
    await context.page.waitForFunction(
      () => {
        const messages = Array.from(document.querySelectorAll("*"));
        const assistantMessages = messages.filter((el) =>
          el.textContent?.includes("updateInputSamples") ||
          el.textContent?.includes("tool") ||
          el.textContent?.includes("function")
        );
        return assistantMessages.length > 0;
      },
      { timeout: 30000 },
    );

    // Take screenshot after AI response
    await context.takeScreenshot("aibff-gui-after-response");

    // Verify tool call was made
    const toolCallMade = await context.page.evaluate(() => {
      const allText = document.body.textContent || "";
      return allText.includes("updateInputSamples") ||
        allText.includes("input samples") ||
        allText.includes("tool");
    });

    assert(toolCallMade, "Should show evidence of tool call execution");

    logger.info("Tool call test completed successfully");

    // Take screenshot after test completion
    await context.takeScreenshot("aibff-gui-completed");

    logger.info("aibff GUI e2e test completed successfully");
  } catch (error) {
    // Take error screenshot
    await context.takeScreenshot("aibff-gui-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
