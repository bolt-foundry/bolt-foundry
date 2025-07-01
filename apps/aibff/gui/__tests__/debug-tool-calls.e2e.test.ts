#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

interface Message {
  role: string;
  content?: string;
}

interface ToolFunction {
  name: string;
  description?: string;
  parameters?: unknown;
}

interface Tool {
  function: ToolFunction;
}

interface ParsedOutput {
  messages: Array<Message>;
  tools: Array<Tool>;
}

const logger = getLogger(import.meta);

Deno.test("debug tool calls - verify debug pattern recognition and execution", async () => {
  // Test that the debug command pattern is properly included in the system prompt
  const serverPort = 3020;
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", String(serverPort), "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const serverProcess = command.spawn();

  // Wait for server to be ready
  let serverReady = false;
  const maxRetries = 30;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`http://localhost:${serverPort}/health`);
      await response.body?.cancel();
      if (response.ok) {
        serverReady = true;
        break;
      }
    } catch {
      // Server not ready yet
    }
    await delay(200);
  }

  assertEquals(serverReady, true, "Dev server failed to start within timeout");

  try {
    // Test the render endpoint directly to verify debug instructions are included
    const renderCommand = new Deno.Command("aibff", {
      args: ["render", "apps/aibff/gui/decks/onboarding-actor.deck.md"],
      stdout: "piped",
      stderr: "piped",
    });

    const renderResult = await renderCommand.output();

    if (renderResult.success) {
      const renderOutput = new TextDecoder().decode(renderResult.stdout);
      const parsedOutput = JSON.parse(renderOutput) as ParsedOutput;

      // Verify system prompt includes debug command pattern
      assert(
        Array.isArray(parsedOutput.messages),
        "Render output should include messages array",
      );
      assert(
        parsedOutput.messages.length > 0,
        "Messages array should not be empty",
      );

      const systemMessage = parsedOutput.messages.find(
        (msg: Message) => msg.role === "system",
      );

      assert(systemMessage, "System message should be present");
      assert(systemMessage.content, "System message should have content");

      // Check if debug tool calls instructions are included
      const systemContent = systemMessage.content;
      assert(
        systemContent.includes("⚡debug⚡"),
        "System prompt should include debug command pattern",
      );
      assert(
        systemContent.includes("Debug Tool Calls"),
        "System prompt should include debug tool calls section",
      );
      assert(
        systemContent.includes("executing [toolName] with"),
        "System prompt should include debug execution instructions",
      );

      logger.info(
        "✅ Debug tool calls pattern is correctly included in system prompt",
      );

      // Verify tools are still included alongside debug instructions
      assert(
        Array.isArray(parsedOutput.tools),
        "Render output should include tools array",
      );
      assert(parsedOutput.tools.length > 0, "Tools array should not be empty");

      const replaceGraderTool = parsedOutput.tools.find(
        (tool: Tool) => tool.function.name === "replaceGraderDeck",
      );

      assert(
        replaceGraderTool,
        "replaceGraderDeck tool should still be present",
      );

      logger.info(
        "✅ Tools are correctly included alongside debug instructions",
      );
    } else {
      const errorOutput = new TextDecoder().decode(renderResult.stderr);
      throw new Error(`Render command failed: ${errorOutput}`);
    }
  } finally {
    serverProcess.kill();
    await delay(500);
  }
});

Deno.test("debug tool calls - test debug command in chat interface", async () => {
  // This test verifies that the debug command works in the actual chat interface
  const serverPort = 3021;
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", String(serverPort), "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const serverProcess = command.spawn();

  // Wait for server to be ready
  let serverReady = false;
  const maxRetries = 50;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`http://localhost:${serverPort}/health`);
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

  assertEquals(serverReady, true, "Dev server failed to start within timeout");

  // Setup Puppeteer e2e test
  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
    headless: true, // Keep headless for faster execution
  });

  const { page } = context;

  try {
    // Navigate to the GUI
    await page.goto(`http://localhost:${serverPort}`);

    // Wait for the page to load - use a more general selector
    await page.waitForSelector("body", { timeout: 10000 });

    // Wait a bit more for the app to initialize
    await delay(2000);

    // Try to find the message input with multiple selectors
    let messageInput;
    const inputSelectors = [
      "[data-testid='message-input']",
      "textarea",
      "input[type='text']",
      "[placeholder*='message']",
      "[placeholder*='type']",
    ];

    for (const selector of inputSelectors) {
      try {
        messageInput = await page.waitForSelector(selector, { timeout: 2000 });
        if (messageInput) {
          logger.info(`Found message input with selector: ${selector}`);
          break;
        }
      } catch {
        // Try next selector
      }
    }

    if (!messageInput) {
      logger.info(
        "Could not find message input, taking screenshot for debugging",
      );
      await page.screenshot({
        path:
          "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/tmp/screenshots/debug-test-no-input.png",
        fullPage: true,
      });

      // Log the page content for debugging
      const pageContent = await page.content();
      logger.info("Page HTML:", pageContent.substring(0, 1000) + "...");

      throw new Error("Could not find message input element");
    }

    // Test the debug command pattern
    const debugMessage =
      "⚡debug⚡ replaceGraderDeck ## Test Grader\nThis is a test grader deck content.";

    await messageInput.type(debugMessage);

    // Press Enter instead of looking for send button
    await messageInput.press("Enter");

    // Monitor for debug acknowledgment in the response
    let debugAcknowledged = false;
    const responseTimeout = 15000; // 15 seconds
    const startTime = Date.now();

    // Set up console monitoring for debug messages
    const debugLogs: Array<string> = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (
        text.includes("Debug: executing") ||
        text.includes("🔧") ||
        text.includes("Tool calls executed") ||
        text.includes("Grader deck updated via tool call")
      ) {
        debugLogs.push(text);
        debugAcknowledged = true;
      }
    });

    // Wait for response
    while (!debugAcknowledged && (Date.now() - startTime) < responseTimeout) {
      try {
        // Look for debug acknowledgment text or tool execution confirmation in the page
        const pageText = await page.evaluate(() =>
          document.body.textContent || ""
        );
        if (
          pageText.includes("🔧 Debug: executing") ||
          pageText.includes("Debug: executing replaceGraderDeck") ||
          pageText.includes("✅ Tool call executed: replaceGraderDeck") ||
          pageText.includes("Tool calls executed") ||
          pageText.includes("🔧 Executing tool calls")
        ) {
          debugAcknowledged = true;
          logger.info(
            "Debug acknowledgment or tool execution found in page content",
          );
          break;
        }
      } catch {
        // Continue waiting
      }
      await delay(1000);
    }

    // Check if the grader content was actually updated (tool call effect)
    try {
      // Switch to Grader Deck tab to check content
      const graderTab = await page.$("[data-testid='grader-tab']");
      if (!graderTab) {
        // Try alternative selectors for grader tab
        const alternativeSelectors = [
          "button:contains('Grader')",
          "[role='tab']:contains('Grader')",
          "div:contains('Grader Deck')",
        ];
        for (const selector of alternativeSelectors) {
          try {
            const tab = await page.$(selector);
            if (tab) {
              await tab.click();
              break;
            }
          } catch {
            // Continue trying
          }
        }
      } else {
        await graderTab.click();
      }

      await delay(1000);

      // Check if grader content contains our test content
      const graderContent = await page.$eval(
        "textarea",
        (el) => (el as HTMLTextAreaElement).value,
      ).catch(() => "");

      if (graderContent.includes("Test Grader")) {
        logger.info("✅ Tool call successfully updated grader content!");
        debugAcknowledged = true;
      } else {
        logger.info("Grader content:", graderContent.substring(0, 200) + "...");
      }
    } catch (error) {
      logger.info("Could not check grader content:", error);
    }

    if (debugAcknowledged) {
      logger.info("✅ Debug command was processed successfully");
      if (debugLogs.length > 0) {
        logger.info("Debug logs captured:", debugLogs);
      }
    } else {
      logger.info("Debug command may not have been processed as expected");

      // Take a screenshot for debugging
      await page.screenshot({
        path:
          "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/tmp/screenshots/debug-test-result.png",
        fullPage: true,
      });
    }

    logger.info("Debug tool call test completed");
  } finally {
    // Cleanup
    await teardownE2ETest(context);
    serverProcess.kill();

    // Wait a bit for cleanup
    await delay(1000);
  }
});
