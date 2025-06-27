#!/usr/bin/env -S deno test -A

import { assert } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("grader code block - AI suggestions can be added to grader", async () => {
  // Use the already running server on port 3001
  const serverPort = 3001;

  // Setup Puppeteer e2e test
  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
    headless: true,
  });

  try {
    // Navigate to home
    await context.page.goto(context.baseUrl, {
      waitUntil: "networkidle2",
    });

    // Wait for initial conversation to load
    await context.page.waitForFunction(
      () => globalThis.location.hash.includes("/chat/conv-"),
      { timeout: 5000 },
    );

    // Wait for the greeting message
    await context.page.waitForFunction(
      () => {
        const divs = Array.from(document.querySelectorAll("div"));
        return divs.some((div) =>
          div.textContent?.includes("Hi! I'm here to help you build a grader")
        );
      },
      { timeout: 5000 },
    );

    // Send a message asking for help with a grader
    const testMessage =
      "I want to build a grader for YouTube comments about technical tutorials";
    await context.page.type(
      'textarea[placeholder="Type a message..."]',
      testMessage,
    );

    // Click send
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendButton = buttons.find((btn) => btn.textContent === "Send");
      if (sendButton) {
        (sendButton as HTMLButtonElement).click();
      }
    });

    // Wait for AI response to start appearing
    await delay(2000);

    // Wait for a code block to appear (AI should suggest a grader template)
    await context.page.waitForFunction(
      () => {
        const preElements = Array.from(document.querySelectorAll("pre"));
        return preElements.length > 0;
      },
      { timeout: 30000 }, // Give AI time to respond
    );

    // Check that "Add to Grader" button exists
    const hasAddButton = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((btn) => btn.textContent === "Add to Grader");
    });

    assert(
      hasAddButton,
      "Should have 'Add to Grader' button for markdown code block",
    );

    // Get the code block content
    const codeBlockContent = await context.page.evaluate(() => {
      const codeElement = document.querySelector("pre code");
      return codeElement?.textContent || "";
    });

    assert(
      codeBlockContent.includes("YouTube"),
      "Code block should contain YouTube-related content",
    );
    logger.info(
      `Code block content preview: ${codeBlockContent.substring(0, 100)}...`,
    );

    // Click "Add to Grader" button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const addButton = buttons.find((btn) =>
        btn.textContent === "Add to Grader"
      );
      if (addButton) {
        (addButton as HTMLButtonElement).click();
      }
    });

    // Give it a moment to update
    await delay(500);

    // Check that the grader editor now contains the content
    const graderContent = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value || "";
    });

    assert(
      graderContent.length > 0,
      "Grader should have content after clicking Add to Grader",
    );
    assert(
      graderContent.includes("YouTube"),
      "Grader content should include suggested template",
    );

    logger.info(
      `Grader content after add: ${graderContent.substring(0, 100)}...`,
    );

    // Send another message to get more suggestions
    const followUpMessage =
      "Can you add some specific examples for technical tutorial comments?";

    // Clear the input first
    await context.page.evaluate(() => {
      const textarea = document.querySelector(
        'textarea[placeholder="Type a message..."]',
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    await context.page.type(
      'textarea[placeholder="Type a message..."]',
      followUpMessage,
    );

    // Click send again
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendButton = buttons.find((btn) => btn.textContent === "Send");
      if (sendButton) {
        (sendButton as HTMLButtonElement).click();
      }
    });

    // Wait for another response
    await delay(2000);

    // Take screenshot showing the interaction
    await context.takeScreenshot("grader-code-block-interaction");

    logger.info("Code block interaction test completed successfully");
  } finally {
    await teardownE2ETest(context);

    // Clean up conversations
    try {
      await Deno.remove("conversations", { recursive: true });
    } catch {
      // Directory might not exist
    }
  }
});
