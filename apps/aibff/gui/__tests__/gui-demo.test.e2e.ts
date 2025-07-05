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
  "aibff GUI complete interface demonstration",
  async () => {
    const context = await setupAibffGuiTest();

    // Start time-based video recording for smooth framerate
    const stopRecording = await context.startTimeBasedVideoRecording(
      "aibff-gui-complete-demo",
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

      await delay(1000);
      await context.takeScreenshot("demo-01-initial-load");

      logger.info("🎬 Starting complete aibff GUI demonstration...");

      // === SECTION 1: Initial Interface Overview ===
      logger.info("📋 Section 1: Interface Overview");

      // Smooth pan across the interface
      await smoothMoveTo(context.page, 100, 200, 1500);
      await delay(1000);
      await smoothMoveTo(context.page, 1200, 200, 2000);
      await delay(1000);
      await smoothMoveTo(context.page, 640, 400, 1500);
      await delay(500);

      // === SECTION 2: Workflow Configuration Panels ===
      logger.info("⚙️ Section 2: Workflow Configuration");

      // Open System Prompt section
      await smoothClick(
        context.page,
        '[data-testid="system-prompt-accordion"], button:has-text("System Prompt"), [aria-label*="System Prompt"]',
      );
      await delay(1500);
      await context.takeScreenshot("demo-02-system-prompt-opened");

      // Type in system prompt area
      const systemPromptTextarea = await context.page.$(
        'textarea[placeholder*="system"], textarea[aria-label*="System"], div[role="textbox"]',
      );
      if (systemPromptTextarea) {
        await smoothClick(
          context.page,
          'textarea[placeholder*="system"], textarea[aria-label*="System"], div[role="textbox"]',
        );
        await delay(500);
        await context.page.type(
          'textarea[placeholder*="system"], textarea[aria-label*="System"], div[role="textbox"]',
          "You are an expert AI assistant helping users build comprehensive evaluation workflows. Focus on providing detailed, actionable guidance.",
          { delay: 30 },
        );
        await delay(1000);
      }

      // Open Input Variables section
      try {
        await smoothClick(
          context.page,
          'button:has-text("Input Variables"), [aria-label*="Input Variables"], [data-testid*="input-variables"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-03-input-variables-opened");

        // Interact with input variables if available
        const inputVariablesTextarea = await context.page.$(
          'textarea[placeholder*="input"], textarea[aria-label*="Input"]',
        );
        if (inputVariablesTextarea) {
          await smoothClick(
            context.page,
            'textarea[placeholder*="input"], textarea[aria-label*="Input"]',
          );
          await delay(500);
          await context.page.type(
            'textarea[placeholder*="input"], textarea[aria-label*="Input"]',
            '{"user_query": "How do I optimize my machine learning model?", "context": "production environment"}',
            { delay: 25 },
          );
          await delay(1000);
        }
      } catch (_error) {
        logger.debug("Input Variables section not found or not clickable");
      }

      // === SECTION 3: Test Conversation Interface ===
      logger.info("💬 Section 3: Test Conversation");

      // Find and click on Test Conversation section
      try {
        await smoothClick(
          context.page,
          'button:has-text("Test Conversation"), [aria-label*="Test Conversation"], [data-testid*="test-conversation"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-04-test-conversation-opened");
      } catch (_error) {
        logger.debug("Test Conversation section not found");
      }

      // Interact with the main chat interface
      await smoothHover(
        context.page,
        'textarea[placeholder="Type a message..."], textarea[placeholder*="message"], input[placeholder*="message"]',
      );
      await delay(500);

      await smoothClick(
        context.page,
        'textarea[placeholder="Type a message..."], textarea[placeholder*="message"], input[placeholder*="message"]',
      );
      await delay(800);

      // Type a comprehensive test message
      const demoMessage =
        "Please help me create a comprehensive AI evaluation workflow. I need to test a customer service chatbot that should handle inquiries about product returns, technical support, and billing questions. Can you help me set up proper evaluation criteria and test cases?";

      await context.page.type(
        'textarea[placeholder="Type a message..."], textarea[placeholder*="message"], input[placeholder*="message"]',
        demoMessage,
        { delay: 20 },
      );
      await delay(1500);
      await context.takeScreenshot("demo-05-message-typed");

      // Send the message with smooth interaction
      const sendButtons = await context.page.$$(
        'button:has-text("Send"), button[aria-label*="Send"], button[type="submit"]',
      );
      if (sendButtons.length > 0) {
        await smoothHover(
          context.page,
          'button:has-text("Send"), button[aria-label*="Send"], button[type="submit"]',
        );
        await delay(500);
        await smoothClick(
          context.page,
          'button:has-text("Send"), button[aria-label*="Send"], button[type="submit"]',
        );
        await delay(500);
      }

      logger.info("🤖 Waiting for AI response...");

      // Wait for AI response with longer timeout
      try {
        await context.page.waitForFunction(
          () => {
            const messages = Array.from(document.querySelectorAll("*"));
            return messages.some((el) => {
              const text = el.textContent || "";
              return text.includes("evaluation") ||
                text.includes("workflow") ||
                text.includes("criteria") ||
                text.includes("test cases") ||
                text.length > 200; // Any substantial response
            });
          },
          { timeout: 45000 },
        );
        await delay(2000);
        await context.takeScreenshot("demo-06-ai-response-received");
      } catch (_error) {
        logger.info("AI response timeout - continuing demo");
        await context.takeScreenshot("demo-06-ai-response-timeout");
      }

      // === SECTION 4: Calibration and Saved Results ===
      logger.info("📊 Section 4: Calibration & Results");

      // Navigate to Calibration section
      try {
        await smoothClick(
          context.page,
          'button:has-text("Calibration"), [aria-label*="Calibration"], [data-testid*="calibration"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-07-calibration-opened");

        // Explore calibration interface
        await smoothMoveTo(context.page, 800, 400, 1000);
        await delay(1000);
      } catch (_error) {
        logger.debug("Calibration section not found");
      }

      // Check Saved Results section
      try {
        await smoothClick(
          context.page,
          'button:has-text("Saved Results"), [aria-label*="Saved Results"], [data-testid*="saved-results"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-08-saved-results-opened");
      } catch (_error) {
        logger.debug("Saved Results section not found");
      }

      // === SECTION 5: Evaluation Configuration ===
      logger.info("🔬 Section 5: Evaluation Setup");

      // Open Eval Prompt section
      try {
        await smoothClick(
          context.page,
          'button:has-text("Eval Prompt"), [aria-label*="Eval Prompt"], [data-testid*="eval-prompt"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-09-eval-prompt-opened");

        // Interact with eval prompt if available
        const evalTextarea = await context.page.$(
          'textarea[placeholder*="eval"], textarea[aria-label*="Eval"]',
        );
        if (evalTextarea) {
          await smoothClick(
            context.page,
            'textarea[placeholder*="eval"], textarea[aria-label*="Eval"]',
          );
          await delay(500);
          await context.page.type(
            'textarea[placeholder*="eval"], textarea[aria-label*="Eval"]',
            "Evaluate the response for accuracy, helpfulness, and completeness. Rate on a scale of 1-5 for each criterion.",
            { delay: 25 },
          );
          await delay(1000);
        }
      } catch (_error) {
        logger.debug("Eval Prompt section not found");
      }

      // === SECTION 6: Run Evaluation ===
      logger.info("▶️ Section 6: Run Evaluation");

      try {
        await smoothClick(
          context.page,
          'button:has-text("Run Eval"), [aria-label*="Run Eval"], [data-testid*="run-eval"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-10-run-eval-opened");
      } catch (_error) {
        logger.debug("Run Eval section not found");
      }

      // === SECTION 7: Files and Resources ===
      logger.info("📁 Section 7: Files & Resources");

      try {
        await smoothClick(
          context.page,
          'button:has-text("Files"), [aria-label*="Files"], [data-testid*="files"]',
        );
        await delay(1500);
        await context.takeScreenshot("demo-11-files-opened");
      } catch (_error) {
        logger.debug("Files section not found");
      }

      // === SECTION 8: Final Interface Overview ===
      logger.info("🎯 Section 8: Final Overview");

      // Smooth pan to show the complete interface state
      await smoothMoveTo(context.page, 200, 200, 1000);
      await delay(800);
      await smoothMoveTo(context.page, 1000, 600, 1500);
      await delay(800);
      await smoothMoveTo(context.page, 640, 400, 1000);
      await delay(1000);

      // Final screenshot
      await context.takeScreenshot("demo-12-final-overview");

      // === SECTION 9: Interaction Demonstration ===
      logger.info("🖱️ Section 9: Interactive Elements Demo");

      // Demonstrate various UI interactions
      await smoothMoveTo(context.page, 100, 100, 800);
      await delay(300);
      await smoothMoveTo(context.page, 1200, 100, 1200);
      await delay(300);
      await smoothMoveTo(context.page, 1200, 700, 800);
      await delay(300);
      await smoothMoveTo(context.page, 100, 700, 1200);
      await delay(300);
      await smoothMoveTo(context.page, 640, 360, 1000);
      await delay(1000);

      // Try to interact with any buttons or controls visible
      const allButtons = await context.page.$$("button:not([disabled])");
      if (allButtons.length > 0) {
        logger.info(`Found ${allButtons.length} interactive buttons`);

        // Hover over a few buttons to show interactivity
        for (let i = 0; i < Math.min(3, allButtons.length); i++) {
          try {
            const button = allButtons[i];
            const box = await button.boundingBox();
            if (box) {
              await smoothMoveTo(
                context.page,
                box.x + box.width / 2,
                box.y + box.height / 2,
                600,
              );
              await delay(300);
            }
          } catch (_error) {
            // Continue if button interaction fails
          }
        }
      }

      await delay(2000);
      await context.takeScreenshot("demo-13-interaction-complete");

      logger.info("✅ Complete aibff GUI demonstration finished successfully!");

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
    } catch (_error) {
      // Take error screenshot
      await context.takeScreenshot("demo-error");
      logger.error("Demo failed:", _error);

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
