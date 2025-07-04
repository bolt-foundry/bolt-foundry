#!/usr/bin/env -S deno test -A

/**
 * Debug test to manually walk through the calibration flow step by step
 * This helps us understand what selectors actually work
 */

import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

Deno.test("Manual debug calibration flow", async () => {
  const context = await setupE2ETest({
    baseUrl: "http://localhost:3001",
  });

  try {
    // Navigate to GUI
    await context.page.goto(context.baseUrl);
    await context.page.waitForFunction(() => document.title === "aibff GUI", {
      timeout: 10000,
    });

    await context.takeScreenshot("00-initial-load");

    // Wait for loading to complete - look for the chat interface
    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return !content.includes("Loading conversation") ||
        document.querySelector('input[placeholder*="Type a message"]') ||
        document.querySelector('textarea[placeholder*="Type a message"]');
    }, { timeout: 15000 });

    await context.takeScreenshot("01-loaded");

    logger.debug("✅ Page loaded successfully");

    // Debug: Check what elements are actually on the page
    const allTextareas = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      return textareas.map((ta) => ({
        placeholder: ta.placeholder,
        visible: ta.offsetParent !== null,
        value: ta.value,
      }));
    });

    logger.debug("📝 Found textareas:", allTextareas);

    const allButtons = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.map((btn) => ({
        text: btn.textContent?.trim(),
        visible: btn.offsetParent !== null,
      })).filter((btn) => btn.text && btn.text.length > 0);
    });

    logger.debug("🔘 Found buttons:", allButtons.slice(0, 10)); // First 10 buttons

    // System Prompt section should already be expanded, let's work with existing textareas
    logger.debug(
      "🖱️ System Prompt section is already visible, using existing textareas",
    );
    await context.takeScreenshot("02-system-prompt-visible");

    // Try to find and use the system prompt textarea
    const systemPromptFound = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const systemPromptTA = textareas.find((ta) =>
        ta.placeholder.includes("helpful assistant") ||
        ta.placeholder.includes("system prompt") ||
        ta.placeholder.includes("assistant")
      );

      if (systemPromptTA && systemPromptTA.offsetParent !== null) {
        systemPromptTA.focus();
        systemPromptTA.value = "You are a helpful science tutor.";
        systemPromptTA.dispatchEvent(new Event("input", { bubbles: true }));
        systemPromptTA.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      return false;
    });

    logger.debug("📝 System prompt set:", systemPromptFound);
    await delay(1000);
    await context.takeScreenshot("03-system-prompt-set");

    // Try to use the message input at the bottom
    logger.debug("💬 Trying to send a test message...");

    const messageInput = await context.page.evaluate(() => {
      // Look for message input - could be input or textarea
      const inputs = Array.from(document.querySelectorAll("input, textarea"));
      const messageInput = inputs.find((input) => {
        const element = input as HTMLInputElement | HTMLTextAreaElement;
        return element.placeholder?.includes("Type a message") ||
          element.placeholder?.includes("message") ||
          element.placeholder?.toLowerCase().includes("type");
      });

      if (messageInput && (messageInput as HTMLElement).offsetParent !== null) {
        const element = messageInput as HTMLInputElement | HTMLTextAreaElement;
        element.focus();
        element.value = "What is photosynthesis?";
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      return false;
    });

    logger.debug("💬 Message typed:", messageInput);
    await delay(500);
    await context.takeScreenshot("04-message-typed");

    // Try to click Send button
    const sendClicked = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendBtn = buttons.find((btn) =>
        btn.textContent?.trim() === "Send" ||
        btn.textContent?.includes("Send")
      );

      if (sendBtn && sendBtn.offsetParent !== null) {
        sendBtn.click();
        return true;
      }
      return false;
    });

    logger.debug("📤 Send clicked:", sendClicked);
    await delay(2000); // Wait for response
    await context.takeScreenshot("05-message-sent");

    // Look for AI response
    await context.page.waitForFunction(() => {
      const messages = document.querySelectorAll(
        '[data-role="assistant"], .message, [class*="message"]',
      );
      return messages.length > 0;
    }, { timeout: 10000 });

    await context.takeScreenshot("06-response-received");

    // Try to find "Save Result" button
    const saveResultFound = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((btn) =>
        btn.textContent?.includes("Save Result") ||
        btn.textContent?.includes("Save")
      );
    });

    logger.debug("💾 Save Result button found:", saveResultFound);

    if (saveResultFound) {
      await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const saveBtn = buttons.find((btn) =>
          btn.textContent?.includes("Save Result")
        );
        if (saveBtn) saveBtn.click();
      });

      await delay(1000);
      await context.takeScreenshot("07-result-saved");
    }

    // Try to navigate to Calibration section
    logger.debug("🔬 Trying to open Calibration section...");

    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const calibrationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Calibration")
      );
      if (calibrationBtn) calibrationBtn.click();
    });

    await delay(1000);
    await context.takeScreenshot("08-calibration-opened");

    // Look for tabs within calibration
    const calibrationTabs = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons
        .filter((btn) =>
          btn.textContent?.includes("Saved Results") ||
          btn.textContent?.includes("Ground Truth")
        )
        .map((btn) => btn.textContent?.trim());
    });

    logger.debug("📊 Calibration tabs found:", calibrationTabs);

    await context.takeScreenshot("09-calibration-tabs");

    logger.debug("✅ Manual debug flow completed!");
  } catch (error) {
    await context.takeScreenshot("error-debug");
    logger.error("❌ Debug flow failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
