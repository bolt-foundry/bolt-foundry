#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import {
  smoothClick,
  smoothHover,
  smoothMoveTo,
} from "@bfmono/infra/testing/video-recording/smooth-mouse.ts";
import { setupAibffGuiTest } from "./helpers.ts";

const logger = getLogger(import.meta);

Deno.test(
  "aibff GUI loads successfully with routing and Isograph",
  async () => {
    const context = await setupAibffGuiTest();

    // Start time-based video recording for smoother framerate
    const stopRecording = await context.startTimeBasedVideoRecording(
      "aibff-gui-test",
      24, // Target 24 FPS for smooth recording
      {
        outputFormat: "mp4",
        quality: "medium",
        deleteFrames: true,
      },
    );

    try {
      // Navigate to the GUI
      await navigateTo(context, "/");

      // Take initial screenshot
      await context.takeScreenshot("aibff-gui-initial");

      // Wait for the loading to complete and UI to be ready
      await context.page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
          // Wait for loading to complete (no "Loading conversation..." text)
          return !bodyText.includes("Loading conversation...");
        },
        { timeout: 10000 },
      );

      // Wait for content to load - look for the "New Conversation" header
      await context.page.waitForFunction(
        () => {
          const elements = Array.from(document.querySelectorAll("*"));
          return elements.some((el) =>
            el.textContent?.trim() === "New Conversation"
          );
        },
        { timeout: 10000 },
      );

      // Wait a bit more for React to hydrate and all components to load
      // Add some smooth mouse movements to show UI exploration
      await delay(1000);

      // Smoothly explore the UI for better video content
      logger.info("Exploring UI with smooth mouse movements...");

      // Hover over the "New Conversation" header
      try {
        await context.page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("*"));
          const header = elements.find((el) =>
            el.textContent?.trim() === "New Conversation"
          );
          if (header) {
            header.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
        await delay(300);
        // Move mouse to center of page first, then to various UI elements
        await smoothMoveTo(context.page, 640, 200, 800);
        await delay(500);
      } catch (_error) {
        logger.debug(
          "Could not find New Conversation header for smooth movement",
        );
      }

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

      // Check that the WorkflowPanel with correct tabs exists
      const hasWorkflowPanel = await context.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("*"));
        return elements.some((el) =>
          el.textContent?.includes("Input Variables") ||
          el.textContent?.includes("System Prompt") ||
          el.textContent?.includes("Eval Prompt")
        );
      });
      assert(hasWorkflowPanel, "Should show workflow panel with correct tabs");

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

      // Test tool calling functionality with smooth mouse movements
      logger.info(
        "Testing tool call functionality with smooth mouse interactions...",
      );

      // Smooth hover over the textarea first
      await smoothHover(
        context.page,
        'textarea[placeholder="Type a message..."]',
      );
      await delay(500);

      // Smooth click to focus on textarea
      await smoothClick(
        context.page,
        'textarea[placeholder="Type a message..."]',
      );
      await delay(500);

      // Type a message that should trigger updateInputSamples tool
      const testMessage =
        "Please update the input samples to include: 'test sample 1' and 'test sample 2'";
      await context.page.type(
        'textarea[placeholder="Type a message..."]',
        testMessage,
        { delay: 50 }, // Add typing delay for more realistic video
      );

      // Take screenshot before sending
      await context.takeScreenshot("aibff-gui-before-send");

      // Smooth hover over send button
      const _sendButtonSelector =
        'button[aria-label*="Send"], button:contains("Send")';

      // Find and smoothly click the send button
      const sendButtonExists = await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((button) => button.textContent === "Send");
      });

      if (sendButtonExists) {
        // Use smooth hover and click for send button
        await context.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const sendButton = buttons.find((button) =>
            button.textContent === "Send"
          );
          if (sendButton) {
            sendButton.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });

        await delay(500);

        // Try to use smooth click on the send button
        try {
          await smoothClick(context.page, 'button[type="submit"]');
        } catch {
          // Fallback to finding button by text content
          await context.page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"));
            const sendButton = buttons.find((button) =>
              button.textContent === "Send"
            );
            if (sendButton) sendButton.click();
          });
        }
      } else {
        logger.warn("Send button not found, skipping click");
      }

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

      // Stop video recording and get the result
      const videoResult = await stopRecording();
      if (videoResult) {
        logger.info(`Video recording completed: ${videoResult.videoPath}`);
        logger.info(
          `Video stats: ${videoResult.duration}s, ${videoResult.frameCount} frames, ${videoResult.fileSize} bytes`,
        );
      }
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("aibff-gui-error");
      logger.error("Test failed:", error);

      // Still try to save the video on error for debugging
      try {
        const videoResult = await stopRecording();
        if (videoResult) {
          logger.info(`Error video saved: ${videoResult.videoPath}`);
        }
      } catch (videoError) {
        logger.warn("Failed to save error video:", videoError);
      }

      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  },
);
