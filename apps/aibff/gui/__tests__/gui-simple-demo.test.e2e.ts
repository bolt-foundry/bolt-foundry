#!/usr/bin/env -S deno test -A

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
  "aibff GUI simple interface demonstration",
  async () => {
    const context = await setupAibffGuiTest();

    // Start time-based video recording for smooth framerate
    const stopRecording = await context.startTimeBasedVideoRecording(
      "aibff-gui-simple-demo",
      24, // Target 24 FPS for smooth recording
      {
        outputFormat: "mp4",
        quality: "high", // Use high quality for demo
        deleteFrames: true,
      },
    );

    try {
      // Navigate to the GUI
      await navigateTo(context, "/");

      // Wait for the loading to complete and UI to be ready
      await context.page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
          return !bodyText.includes("Loading conversation...");
        },
        { timeout: 15000 },
      );

      // Wait for content to load - look for the "New Conversation" header
      await context.page.waitForFunction(
        () => {
          const elements = Array.from(document.querySelectorAll("*"));
          return elements.some((el) =>
            el.textContent?.trim() === "New Conversation"
          );
        },
        { timeout: 15000 },
      );

      await delay(2000);
      await context.takeScreenshot("simple-demo-01-initial-load");

      logger.info("🎬 Starting simple aibff GUI demonstration...");

      // === SECTION 1: Interface Overview ===
      logger.info("📋 Section 1: Interface Overview");

      // Smooth pan across the interface to show layout
      await smoothMoveTo(context.page, 200, 200, 2000);
      await delay(1000);
      await smoothMoveTo(context.page, 1100, 300, 2500);
      await delay(1000);
      await smoothMoveTo(context.page, 800, 600, 2000);
      await delay(1000);
      await smoothMoveTo(context.page, 400, 400, 1500);
      await delay(1000);

      // === SECTION 2: Chat Interface Interaction ===
      logger.info("💬 Section 2: Chat Interface");

      // Focus on the main chat interface
      await smoothMoveTo(context.page, 640, 400, 1000);
      await delay(500);

      // Find and interact with the message input
      const messageInput =
        'textarea[placeholder="Type a message..."], textarea, input[type="text"]';

      try {
        await smoothHover(context.page, messageInput);
        await delay(800);

        await smoothClick(context.page, messageInput);
        await delay(1000);

        // Type a demonstration message
        const demoMessage =
          "Hello! Can you help me set up an AI evaluation workflow for testing a customer service chatbot? I need guidance on creating proper test cases and evaluation criteria.";

        await context.page.type(messageInput, demoMessage, { delay: 40 });
        await delay(2000);
        await context.takeScreenshot("simple-demo-02-message-typed");

        // Send the message
        const sendButton = 'button[type="submit"], button';
        const sendButtons = await context.page.$$(sendButton);

        if (sendButtons.length > 0) {
          // Find the send button by checking button text
          for (const button of sendButtons) {
            const text = await button.evaluate((el) => el.textContent);
            if (
              text?.toLowerCase().includes("send") ||
              text?.toLowerCase().includes("submit")
            ) {
              await smoothHover(context.page, sendButton);
              await delay(500);
              await button.click();
              break;
            }
          }
        }

        await delay(1000);
        logger.info("🤖 Waiting for AI response...");

        // Wait for AI response
        try {
          await context.page.waitForFunction(
            () => {
              const bodyText = document.body.textContent || "";
              return bodyText.length > 1000 ||
                bodyText.includes("evaluation") ||
                bodyText.includes("workflow") ||
                bodyText.includes("I can help") ||
                bodyText.includes("assistant");
            },
            { timeout: 30000 },
          );
          await delay(3000);
          await context.takeScreenshot("simple-demo-03-ai-response");
        } catch (_error) {
          logger.info("AI response timeout - continuing demo");
          await context.takeScreenshot("simple-demo-03-timeout");
        }
      } catch (_error) {
        logger.info("Chat interaction failed, continuing with UI exploration");
        await context.takeScreenshot("simple-demo-02-chat-error");
      }

      // === SECTION 3: UI Exploration ===
      logger.info("🔍 Section 3: UI Exploration");

      // Explore different parts of the interface
      await smoothMoveTo(context.page, 100, 150, 1000);
      await delay(500);
      await smoothMoveTo(context.page, 300, 150, 800);
      await delay(500);
      await smoothMoveTo(context.page, 600, 150, 800);
      await delay(500);
      await smoothMoveTo(context.page, 900, 150, 800);
      await delay(500);
      await smoothMoveTo(context.page, 1200, 150, 800);
      await delay(1000);

      // Explore sidebar or panels
      await smoothMoveTo(context.page, 1200, 400, 1000);
      await delay(800);
      await smoothMoveTo(context.page, 1200, 600, 800);
      await delay(800);

      // Try to click on any buttons we find
      const allButtons = await context.page.$$("button:not([disabled])");
      logger.info(`Found ${allButtons.length} clickable buttons`);

      if (allButtons.length > 0) {
        // Interact with first few buttons to show interface responsiveness
        for (let i = 0; i < Math.min(5, allButtons.length); i++) {
          try {
            const button = allButtons[i];
            const box = await button.boundingBox();
            const text = await button.evaluate((el) =>
              el.textContent?.trim() || ""
            );

            // Skip buttons that might cause navigation or unwanted actions
            if (
              text && !text.toLowerCase().includes("delete") &&
              !text.toLowerCase().includes("remove") &&
              !text.toLowerCase().includes("clear")
            ) {
              if (box && box.x > 0 && box.y > 0) {
                logger.info(`Hovering over button: "${text}"`);
                await smoothMoveTo(
                  context.page,
                  box.x + box.width / 2,
                  box.y + box.height / 2,
                  600,
                );
                await delay(800);

                // Click some buttons to show interactivity
                if (i < 2) {
                  try {
                    await button.click();
                    await delay(1500);
                  } catch (clickError) {
                    logger.debug(`Button click failed: ${clickError}`);
                  }
                }
              }
            }
          } catch (error) {
            logger.debug(`Button interaction failed: ${error}`);
          }
        }
      }

      // === SECTION 4: Final Overview ===
      logger.info("🎯 Section 4: Final Overview");

      // Final smooth pan to show the complete interface
      await smoothMoveTo(context.page, 640, 100, 1000);
      await delay(800);
      await smoothMoveTo(context.page, 640, 300, 1000);
      await delay(800);
      await smoothMoveTo(context.page, 640, 500, 1000);
      await delay(800);
      await smoothMoveTo(context.page, 640, 360, 1000);
      await delay(2000);

      // Take final screenshot
      await context.takeScreenshot("simple-demo-04-final-overview");

      // Add some final smooth movements to showcase the interface
      await smoothMoveTo(context.page, 200, 200, 1500);
      await delay(500);
      await smoothMoveTo(context.page, 1000, 200, 2000);
      await delay(500);
      await smoothMoveTo(context.page, 1000, 600, 1500);
      await delay(500);
      await smoothMoveTo(context.page, 200, 600, 2000);
      await delay(500);
      await smoothMoveTo(context.page, 640, 360, 1500);
      await delay(2000);

      logger.info("✅ Simple aibff GUI demonstration completed successfully!");

      // Get the video result
      const videoResult = await stopRecording();
      if (videoResult) {
        logger.info(`🎥 Demo video completed: ${videoResult.videoPath}`);
        logger.info(
          `📊 Video stats: ${videoResult.duration}s, ${videoResult.frameCount} frames, ${
            Math.round(videoResult.fileSize / 1024)
          }KB`,
        );
      }
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("simple-demo-error");
      logger.error("Demo failed:", error);

      // Still try to save the video on error for debugging
      try {
        const videoResult = await stopRecording();
        if (videoResult) {
          logger.info(`🎥 Error demo video saved: ${videoResult.videoPath}`);
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
