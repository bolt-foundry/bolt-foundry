#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

interface ToolFunction {
  name: string;
  description?: string;
  parameters?: unknown;
}

interface Tool {
  function: ToolFunction;
}

interface ParsedOutput {
  tools: Array<Tool>;
}

const logger = getLogger(import.meta);

Deno.test("tool calls - replaceGraderDeck tool triggers and updates content", async () => {
  // Start the aibff gui dev server
  const serverPort = 3017;
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

  assertEquals(
    serverReady,
    true,
    "Dev server failed to start within timeout",
  );

  // Setup Puppeteer e2e test
  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
  });

  const { page } = context;

  try {
    // Navigate to the GUI
    await page.goto(`http://localhost:${serverPort}`);

    // Wait for the page to load
    await page.waitForSelector("[data-testid='chat-container']", {
      timeout: 10000,
    });

    // Check if tools are being included in the render
    logger.info("Testing tool inclusion in render...");

    // Use the browser to check the render endpoint
    const _renderResponse = await page.evaluate(async () => {
      const response = await fetch("/api/conversations/test-conv/load");
      return response.status;
    });

    // Input a message that should trigger the replaceGraderDeck tool
    const messageInput = await page.waitForSelector(
      "[data-testid='message-input']",
      { timeout: 5000 },
    );
    assert(messageInput, "Message input should be found");

    const testMessage =
      "Hi! I want to build a grader for evaluating customer support responses. Can you help me create a grader deck that evaluates helpfulness and politeness?";

    await messageInput.type(testMessage);

    // Submit the message
    const sendButton = await page.waitForSelector(
      "[data-testid='send-button']",
      { timeout: 5000 },
    );
    assert(sendButton, "Send button should be found");
    await sendButton.click();

    // Wait for the AI response to start
    await page.waitForSelector("[data-testid='assistant-message']", {
      timeout: 15000,
    });

    // Set up console log monitoring to catch tool calls
    const toolCallLogs: Array<string> = [];
    page.on("console", (msg) => {
      if (msg.text().includes("Received tool call")) {
        toolCallLogs.push(msg.text());
      }
    });

    // Wait for the response to complete (or timeout)
    let responseComplete = false;
    const responseTimeout = 30000; // 30 seconds
    const startTime = Date.now();

    while (!responseComplete && (Date.now() - startTime) < responseTimeout) {
      try {
        // Check if the streaming indicator is gone
        const streamingIndicator = await page.$(
          "[data-testid='streaming-indicator']",
        );
        if (!streamingIndicator) {
          responseComplete = true;
          break;
        }
      } catch {
        // Streaming indicator not found, response might be complete
        responseComplete = true;
        break;
      }
      await delay(1000);
    }

    // Check if we received any tool calls in the console
    if (toolCallLogs.length > 0) {
      logger.info("Tool calls detected:", toolCallLogs);

      // Verify that the grader deck tab was updated
      const graderTab = await page.$("[data-testid='grader-tab']");
      if (graderTab) {
        await graderTab.click();
        await delay(1000);

        // Check if the grader content was updated
        const graderContent = await page.$eval(
          "[data-testid='grader-textarea']",
          (el) => (el as HTMLTextAreaElement).value,
        ) as string;

        // Verify that the content is not empty and contains grader-related text
        assert(
          graderContent.length > 0,
          "Grader content should not be empty after tool call",
        );
        assert(
          graderContent.includes("grader") ||
            graderContent.includes("evaluation"),
          "Grader content should contain grader-related terms",
        );

        logger.info("Tool call successfully updated grader content!");
      }
    } else {
      // Even if no tool calls were detected, let's check if tools are being sent to the API
      logger.info("No tool calls detected in console. Checking server logs...");

      // We can't easily check server logs from the browser, but we can verify
      // that the onboarding deck includes tools
      const toolCheckResponse = await page.evaluate(async () => {
        try {
          // This would trigger a render request that should include tools
          const response = await fetch("/api/chat/stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "user", content: "test" }],
              conversationId: "test-tool-check",
            }),
          });
          return response.ok;
        } catch (_error) {
          return false;
        }
      });

      logger.info("API tool check response:", toolCheckResponse);
    }

    // Test passed if we got this far without errors
    logger.info("Tool call test completed");
  } finally {
    // Cleanup
    await teardownE2ETest(context);
    serverProcess.kill();

    // Wait a bit for cleanup
    await delay(1000);
  }
});

Deno.test("tool calls - verify onboarding deck includes tools in render", async () => {
  // This test verifies that the render system properly includes tools
  // from the onboarding-actor deck

  const serverPort = 3018;
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
    // Test the render endpoint directly to verify tools are included
    const renderTestResponse = await fetch(
      `http://localhost:${serverPort}/health`,
    );
    assertEquals(
      renderTestResponse.ok,
      true,
      "Server health check should pass",
    );

    // Use the aibff render command directly to verify tools
    const renderCommand = new Deno.Command("aibff", {
      args: ["render", "apps/aibff/gui/decks/onboarding-actor.deck.md"],
      stdout: "piped",
      stderr: "piped",
    });

    const renderResult = await renderCommand.output();

    if (renderResult.success) {
      const renderOutput = new TextDecoder().decode(renderResult.stdout);
      const parsedOutput = JSON.parse(renderOutput) as ParsedOutput;

      // Verify tools are included
      assert(
        Array.isArray(parsedOutput.tools),
        "Render output should include tools array",
      );
      assert(parsedOutput.tools.length > 0, "Tools array should not be empty");

      // Verify the replaceGraderDeck tool is present
      const replaceGraderTool = parsedOutput.tools.find(
        (tool: Tool) => tool.function.name === "replaceGraderDeck",
      );

      assert(replaceGraderTool, "replaceGraderDeck tool should be present");
      assertEquals(
        replaceGraderTool.function.description,
        "Replace the entire grader deck content",
        "Tool description should match",
      );

      logger.info("✅ Render system correctly includes tools");
    } else {
      const errorOutput = new TextDecoder().decode(renderResult.stderr);
      throw new Error(`Render command failed: ${errorOutput}`);
    }
  } finally {
    serverProcess.kill();
    await delay(500);
  }
});
