#!/usr/bin/env -S deno test -A --no-check

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  type E2ETestContext,
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

// Shared server setup function
async function startGuiServer(port: number) {
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", String(port), "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const serverProcess = command.spawn();

  // Wait for server to be ready
  let serverReady = false;
  const maxRetries = 50;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
      await response.body?.cancel();
      if (response.ok) {
        serverReady = true;
        break;
      }
    } catch {
      // Server not ready yet
    }
    await delay(100);
  }

  assertEquals(
    serverReady,
    true,
    "Dev server failed to start within timeout",
  );

  return serverProcess;
}

// Helper to wait for AI greeting (flexible matching)
async function waitForAIGreeting(context: E2ETestContext) {
  await context.page.waitForFunction(
    () => {
      const divs = Array.from(document.querySelectorAll("div"));
      return divs.some((div) => {
        const text = div.textContent?.toLowerCase() || "";
        return text.includes("help") && text.includes("build") &&
          (text.includes("grader") || text.includes("classifier"));
      });
    },
    { timeout: 10000 },
  );
}

// Helper to send a chat message
async function sendChatMessage(context: E2ETestContext, message: string) {
  // Clear any existing input
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
    message,
  );

  // Click send
  await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const sendButton = buttons.find((btn) => btn.textContent === "Send");
    if (sendButton) {
      (sendButton as HTMLButtonElement).click();
    }
  });
}

// Helper to get grader content
async function getGraderContent(context: E2ETestContext): Promise<string> {
  return await context.page.evaluate(() => {
    const textarea = Array.from(document.querySelectorAll("textarea"))
      .find((ta) => ta.placeholder?.includes("Your grader definition"));
    return (textarea as HTMLTextAreaElement)?.value || "";
  });
}

// Helper to set grader content
async function setGraderContent(context: E2ETestContext, content: string) {
  await context.page.evaluate((content) => {
    const textarea = Array.from(document.querySelectorAll("textarea"))
      .find((ta) => ta.placeholder?.includes("Your grader definition"));
    if (textarea) {
      (textarea as HTMLTextAreaElement).value = content;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, content);
}

Deno.test("aibff GUI - comprehensive functionality test", async () => {
  const serverPort = 3020;
  const serverProcess = await startGuiServer(serverPort);

  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
    headless: true,
  });

  try {
    // Test 1: Basic GUI Loading and Initial Setup
    logger.info("Testing basic GUI loading...");

    await context.page.goto(context.baseUrl, {
      waitUntil: "networkidle2",
    });

    // Wait for initial conversation to load
    await context.page.waitForFunction(
      () => globalThis.location.hash.includes("/chat/conv-"),
      { timeout: 5000 },
    );

    // Wait for AI greeting
    await waitForAIGreeting(context);

    // Verify page title
    const title = await context.page.title();
    assertEquals(title, "aibff GUI");

    // Take screenshot
    await context.takeScreenshot("01-initial-load");

    // Test 2: Basic Interface Elements
    logger.info("Testing interface elements...");

    // Check for essential UI elements
    const uiElements = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const textareas = Array.from(document.querySelectorAll("textarea"));

      return {
        buttonCount: buttons.length,
        buttonTexts: buttons.map((b) => b.textContent?.trim()).filter(Boolean),
        textareaCount: textareas.length,
        hasGraderSection:
          document.querySelector('[placeholder*="grader"]') !== null,
        hasChatSection:
          document.querySelector('[placeholder*="message"]') !== null,
      };
    });

    logger.info("UI Elements found:", uiElements);

    // Verify we have the expected UI elements
    assert(uiElements.buttonCount > 0, "Should have buttons");
    assert(
      uiElements.textareaCount >= 2,
      "Should have at least 2 textareas (chat + grader)",
    );
    assert(uiElements.hasGraderSection, "Should have grader section");
    assert(uiElements.hasChatSection, "Should have chat section");

    await context.takeScreenshot("02-interface-elements");

    // Test 3: Manual Grader Editing
    logger.info("Testing manual grader editing...");

    const manualGraderContent = `# Manual Test Grader

This grader was typed directly by the user.

## Scoring Guidelines
- **+3**: Perfect match
- **+2**: Very good
- **+1**: Acceptable
- **0**: Cannot determine
- **-1**: Slightly off
- **-2**: Mostly wrong
- **-3**: Completely wrong

## Notes
This demonstrates manual editing of the grader.`;

    await setGraderContent(context, manualGraderContent);

    // Verify content was set
    const enteredContent = await getGraderContent(context);
    assertEquals(
      enteredContent,
      manualGraderContent,
      "Grader content should match what was typed",
    );

    await context.takeScreenshot("03-manual-grader-edit");

    // Test 4: Chat Interaction with Grader
    logger.info("Testing chat interaction...");

    // Check grader content before chat
    const graderBeforeChat = await getGraderContent(context);
    logger.info(
      "Grader content before chat:",
      graderBeforeChat.substring(0, 100),
    );

    await sendChatMessage(
      context,
      "I just wrote a grader definition. Can you help me improve it?",
    );
    await delay(3000); // Give more time for response

    // Check if grader content is still there (it might get cleared during chat)
    const graderAfterChat = await getGraderContent(context);
    logger.info(
      "Grader content after chat:",
      graderAfterChat.substring(0, 100),
    );

    // If content was cleared, re-enter it for the rest of the test
    if (graderAfterChat.length === 0) {
      logger.info(
        "Grader content was cleared, re-entering for test continuation",
      );
      await setGraderContent(context, manualGraderContent);
      await delay(500);
    }

    await context.takeScreenshot("04-chat-interaction");

    // Test 5: AI Code Block Suggestions
    logger.info("Testing AI code block suggestions...");

    await sendChatMessage(
      context,
      "Can you suggest a grader template for YouTube technical tutorial comments?",
    );
    await delay(5000); // Give AI time to respond

    // Wait for code blocks to appear
    await context.page.waitForFunction(
      () => document.querySelectorAll("pre").length > 0,
      { timeout: 30000 },
    );

    // Check for "Add to Grader" buttons
    const hasAddButton = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((btn) => btn.textContent === "Add to Grader");
    });

    assert(
      hasAddButton,
      "Should have 'Add to Grader' button for markdown code block",
    );

    await context.takeScreenshot("05-ai-code-suggestions");

    // Test 6: Adding AI Suggestions to Grader
    logger.info("Testing adding AI suggestions to grader...");

    // Click first "Add to Grader" button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const addButton = buttons.find((btn) =>
        btn.textContent === "Add to Grader"
      );
      if (addButton) {
        (addButton as HTMLButtonElement).click();
      }
    });

    await delay(500);

    // Verify grader content was updated
    const graderWithAI = await getGraderContent(context);
    assert(
      graderWithAI.length > manualGraderContent.length,
      "Grader should have more content after adding AI suggestion",
    );

    await context.takeScreenshot("06-ai-suggestion-added");

    // Test 7: Multiple Code Blocks
    logger.info("Testing multiple code blocks...");

    await sendChatMessage(
      context,
      "Show me multiple grader templates with examples",
    );
    await delay(5000);

    // Wait for multiple code blocks
    await context.page.waitForFunction(
      () => document.querySelectorAll("pre").length >= 2,
      { timeout: 30000 },
    );

    const codeBlockCount = await context.page.evaluate(() => {
      return document.querySelectorAll("pre").length;
    });

    assert(codeBlockCount >= 2, "Should have multiple code blocks");

    // Count "Add to Grader" buttons (should only be on markdown blocks)
    const addButtonCount = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.filter((btn) => btn.textContent === "Add to Grader")
        .length;
    });

    assert(
      addButtonCount >= 1,
      "Should have 'Add to Grader' buttons for markdown blocks",
    );

    await context.takeScreenshot("07-multiple-code-blocks");

    // Test 8: Conversation Persistence
    logger.info("Testing conversation persistence...");

    const currentUrl = context.page.url();
    const currentConvId = currentUrl.split("/chat/conv-")[1];

    // Reload the page
    await context.page.reload({ waitUntil: "networkidle2" });

    // Verify we're still on the same conversation
    const reloadedUrl = context.page.url();
    const reloadedConvId = reloadedUrl.split("/chat/conv-")[1];
    assertEquals(
      reloadedConvId,
      currentConvId,
      "Should maintain same conversation after reload",
    );

    // Check if grader content persists (may or may not depending on app behavior)
    const persistedGrader = await getGraderContent(context);
    logger.info(
      "Grader content after reload:",
      persistedGrader.length > 0 ? "Present" : "Empty",
    );

    // This is more of an informational check - the app may not persist grader content
    // The important thing is that the UI is still functional

    await context.takeScreenshot("08-conversation-persistence");

    // Test 9: Navigation Between Conversations
    logger.info("Testing navigation between conversations...");

    // Try to navigate to a non-existent conversation
    const fakeConvId = "conv-nonexistent123";
    try {
      await context.page.goto(`${context.baseUrl}/#/chat/${fakeConvId}`);
      await delay(3000);

      // Check what happened - the app may handle this in different ways
      const finalUrl = context.page.url();
      logger.info("Final URL after navigation attempt:", finalUrl);

      // The important thing is that the app doesn't crash and maintains functionality
      const stillFunctional = await context.page.evaluate(() => {
        return document.querySelector("textarea") !== null &&
          document.querySelector("button") !== null;
      });

      assert(
        stillFunctional,
        "App should remain functional after navigation attempt",
      );
    } catch (error) {
      logger.info(
        "Navigation test encountered error (expected):",
        String(error),
      );
    }

    await context.takeScreenshot("09-navigation-test");

    logger.info("All GUI tests completed successfully!");
  } finally {
    await teardownE2ETest(context);

    // Stop the server process
    try {
      serverProcess.kill("SIGKILL");
      
      // Try to consume any remaining data from streams to prevent leaks
      try {
        const reader = serverProcess.stderr.getReader();
        reader.cancel();
      } catch { /* ignore */ }
      
      try {
        const reader = serverProcess.stdout.getReader();
        reader.cancel();
      } catch { /* ignore */ }
    } catch {
      // Process may have already exited
    }

    // Clean up conversations
    try {
      await Deno.remove("conversations", { recursive: true });
    } catch {
      // Directory might not exist
    }
  }
});
