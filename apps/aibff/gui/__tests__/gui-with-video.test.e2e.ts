#!/usr/bin/env -S deno test -A

import { assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { setupAibffGuiTest } from "./helpers.ts";
import {
  smoothClickText,
  smoothType,
} from "@bfmono/infra/testing/video-recording/smooth-ui.ts";

const logger = getLogger(import.meta);

Deno.test(
  "aibff GUI video demo with new tab structure",
  async () => {
    const context = await setupAibffGuiTest();
    let stopVideoRecording: (() => Promise<unknown>) | null = null;

    try {
      // Start video recording
      logger.info("Starting video recording...");
      stopVideoRecording = await context.startTimeBasedVideoRecording(
        "aibff-gui-demo",
        20, // 20 FPS
        {
          outputFormat: "mp4",
          quality: "high",
        },
      );

      // Navigate to the GUI
      await navigateTo(context, "/");

      // Wait for the loading to complete and UI to be ready
      await context.page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
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

      // Wait for React to hydrate and all components to load
      await delay(2000);

      const title = await context.page.title();
      logger.info(`Page title: ${title}`);
      assertEquals(title, "aibff GUI");

      // Take initial screenshot
      await context.takeScreenshot("video-demo-01-initial");

      // Demo: Check for consolidated tabs (System Prompt, Calibration, Eval)
      await delay(1000);

      // Click on System Prompt tab (should already be active) using smooth mouse
      await smoothClickText(context, "System Prompt");
      await delay(1000);
      await context.takeScreenshot("video-demo-02-system-prompt-tab");

      // Demo: Expand System Prompt accordion section
      await smoothClickText(context, "System Prompt");
      await delay(1500);
      await context.takeScreenshot("video-demo-03-system-prompt-expanded");

      // Demo: Type in System Prompt with smooth interactions
      const systemPromptText =
        "You are a helpful AI assistant that provides clear, accurate responses and can call tools to help users.";
      await smoothType(
        context,
        'textarea[placeholder*="helpful assistant"]',
        systemPromptText,
        { charDelay: 60, clickFirst: true, clearFirst: true },
      );
      await delay(1000);
      await context.takeScreenshot("video-demo-04-system-prompt-typed");

      // Demo: Expand Input Variables section
      await smoothClickText(context, "Input Variables");
      await delay(1500);
      await context.takeScreenshot("video-demo-05-input-variables-expanded");

      // Demo: Switch to Calibration tab using smooth mouse
      await smoothClickText(context, "Calibration");
      await delay(1500);
      await context.takeScreenshot("video-demo-06-calibration-tab");

      // Demo: Switch to Eval tab using smooth mouse
      await smoothClickText(context, "Eval");
      await delay(1500);
      await context.takeScreenshot("video-demo-07-eval-tab");

      // Demo: Expand Eval Prompt Configuration (check if it's already expanded)
      await delay(500);
      const isEvalPromptExpanded = await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const evalPromptButton = buttons.find((btn) =>
          btn.textContent?.includes("Eval Prompt Configuration")
        );
        return evalPromptButton !== undefined;
      });

      if (isEvalPromptExpanded) {
        await smoothClickText(context, "Eval Prompt Configuration");
        await delay(1500);
      }
      await context.takeScreenshot("video-demo-08-eval-prompt-expanded");

      // Demo: Go back to System Prompt tab and test conversation
      await smoothClickText(context, "System Prompt");
      await delay(1000);

      // Demo: Expand Test Conversation section
      await smoothClickText(context, "Test Conversation");
      await delay(1500);
      await context.takeScreenshot("video-demo-09-test-conversation-expanded");

      // Demo: Send a test message
      const testMessage =
        "Please update the input samples to include: 'test sample 1' and 'test sample 2'";
      await context.page.focus('textarea[placeholder="Type a message..."]');
      await delay(500);

      // Type the message slowly for better video visibility
      for (const char of testMessage) {
        await context.page.type(
          'textarea[placeholder="Type a message..."]',
          char,
        );
        await delay(50); // 50ms between characters
      }
      await delay(1000);
      await context.takeScreenshot("video-demo-10-message-typed");

      // Click send button
      await smoothClickText(context, "Send");
      await delay(1000);

      logger.info("Message sent, waiting for AI response with tool call...");

      // Wait for AI response (look for tool call execution)
      await context.page.waitForFunction(
        () => {
          const messages = Array.from(document.querySelectorAll("*"));
          const toolMessages = messages.filter((el) =>
            el.textContent?.includes("updateInputSamples") ||
            el.textContent?.includes("Executing tool calls") ||
            el.textContent?.includes("tool")
          );
          return toolMessages.length > 0;
        },
        { timeout: 30000 },
      );

      await delay(2000);
      await context.takeScreenshot("video-demo-11-ai-response");

      // Final pause to show the completed interface
      await delay(3000);
      await context.takeScreenshot("video-demo-12-final");

      logger.info("Video demo completed successfully");
    } catch (error) {
      await context.takeScreenshot("video-demo-error");
      logger.error("Video demo failed:", error);
      throw error;
    } finally {
      // Stop video recording
      if (stopVideoRecording) {
        logger.info("Stopping video recording...");
        const videoResult = await stopVideoRecording();
        if (
          videoResult && typeof videoResult === "object" &&
          "videoPath" in videoResult
        ) {
          const result = videoResult as { videoPath: string; fileSize: number };
          logger.info(
            `Video saved: ${result.videoPath} (${result.fileSize} bytes)`,
          );
        }
      }

      await teardownE2ETest(context);
    }
  },
);
