#!/usr/bin/env bft e2e

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import type { VideoConversionOptions as _VideoConversionOptions } from "@bfmono/infra/testing/video-recording/video-converter.ts";
import { setupAibffGuiTest } from "./helpers.ts";
import {
  type smoothClick as _smoothClick,
  smoothClickText,
} from "@bfmono/infra/testing/video-recording/smooth-ui.ts";
import { checkCursorVisibility } from "@bfmono/infra/testing/video-recording/cursor-overlay.ts";

const logger = getLogger(import.meta);

Deno.test(
  "aibff GUI tabbed interface works correctly",
  async () => {
    const context = await setupAibffGuiTest();

    try {
      // Start video recording with conversion to MP4
      const stopRecording = await context.startVideoRecordingWithConversion(
        "aibff-gui-tabs-demo",
        {
          outputFormat: "mp4" as const,
          framerate: 12,
          quality: "medium" as const,
        },
      );

      // Navigate to the GUI
      await navigateTo(context, "/");

      // Take initial screenshot
      await context.takeScreenshot("aibff-gui-tabs-initial");

      // Re-inject cursor overlay after navigation since it gets wiped out
      const { injectCursorOverlay } = await import(
        "@bfmono/infra/testing/video-recording/cursor-overlay.ts"
      );
      await injectCursorOverlay(context.page);

      // Check cursor visibility
      await checkCursorVisibility(context.page);

      // Wait for the loading to complete and UI to be ready
      await context.page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
          return !bodyText.includes("Loading conversation...");
        },
        { timeout: 10000 },
      );

      // Wait for tabs to appear
      await context.page.waitForFunction(
        () => {
          const elements = Array.from(document.querySelectorAll("*"));
          return elements.some((el) =>
            el.textContent?.includes("System Prompt") ||
            el.textContent?.includes("Calibrate") ||
            el.textContent?.includes("Eval") ||
            el.textContent?.includes("Fix")
          );
        },
        { timeout: 10000 },
      );

      // Wait for React to hydrate
      await delay(2000);

      logger.info("Testing tab navigation...");

      // Check that all four tabs exist
      const tabsExist = await context.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("*"));
        const systemPromptTab = elements.some((el) =>
          el.textContent?.includes("System Prompt")
        );
        const calibrateTab = elements.some((el) =>
          el.textContent?.includes("Calibrate")
        );
        const evalTab = elements.some((el) => el.textContent?.includes("Eval"));
        const fixTab = elements.some((el) => el.textContent?.includes("Fix"));

        // Debug: log all text content to understand what's actually in the DOM
        // console.log statements removed for lint compliance

        return { systemPromptTab, calibrateTab, evalTab, fixTab };
      });

      assert(tabsExist.systemPromptTab, "System Prompt tab should exist");
      assert(tabsExist.calibrateTab, "Calibrate tab should exist");
      assert(tabsExist.evalTab, "Eval tab should exist");
      assert(tabsExist.fixTab, "Fix tab should exist");

      // Test clicking on Calibrate tab with smooth UI
      await smoothClickText(context, "Calibrate");
      await delay(1000);
      await context.takeScreenshot("aibff-gui-tabs-calibrate");

      // Test clicking on Eval tab with smooth UI
      await smoothClickText(context, "Eval");
      await delay(1000);
      await context.takeScreenshot("aibff-gui-tabs-eval");

      // Test clicking on Fix tab with smooth UI
      await smoothClickText(context, "Fix");
      await delay(1000);
      await context.takeScreenshot("aibff-gui-tabs-fix");

      // Test clicking back to System Prompt tab with smooth UI
      await smoothClickText(context, "System Prompt");
      await delay(1000);
      await context.takeScreenshot("aibff-gui-tabs-system-prompt");

      // Verify System Prompt tab content is shown
      const systemPromptContentVisible = await context.page.evaluate(() => {
        const allText = document.body.textContent || "";
        return allText.includes("Define the system prompt for the AI") ||
          allText.includes("Input Variables") ||
          allText.includes("Test Conversation");
      });

      assert(
        systemPromptContentVisible,
        "System Prompt tab content should be visible",
      );

      logger.info("Tab navigation test completed successfully");

      // Take final screenshot
      await context.takeScreenshot("aibff-gui-tabs-completed");

      // Stop video recording
      const videoResult = await stopRecording();
      if (videoResult) {
        logger.info(
          `Video recording saved: ${videoResult.videoPath} (${videoResult.duration}s, ${videoResult.fileSize} bytes)`,
        );
      }

      logger.info("aibff GUI tabbed interface test completed successfully");
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("aibff-gui-tabs-error");
      logger.error("Tabbed interface test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);
    }
  },
);

Deno.test.ignore(
  "aibff GUI loads successfully with routing and Isograph",
  async () => {
    const context = await setupAibffGuiTest();

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
      await delay(2000);

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
  },
);
