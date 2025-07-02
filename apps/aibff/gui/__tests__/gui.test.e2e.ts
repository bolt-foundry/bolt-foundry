#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("replaceFileContent API endpoint works correctly", async () => {
  // Start the aibff gui dev server
  const serverPort = 3007;
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", String(serverPort), "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const serverProcess = command.spawn();

  // Wait for server to be ready
  let serverReady = false;
  const maxRetries = 50; // 5 seconds with 100ms delay

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

  try {
    // Test 1: Create a new conversation first
    const conversationId = `conv-${Date.now()}-test`;
    logger.info(`Testing with conversation ID: ${conversationId}`);

    // Wait a moment for the server to fully initialize
    await delay(500);

    // Test 2: Write a file using the API endpoint
    const testContent =
      "# Test File\n\nThis is a test file created by e2e test.";
    const writeResponse = await fetch(
      `http://localhost:${serverPort}/api/conversations/${conversationId}/files/notes/write`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: testContent }),
      },
    );

    if (!writeResponse.ok) {
      const errorText = await writeResponse.text();
      throw new Error(
        `Write request failed: ${writeResponse.status} ${errorText}`,
      );
    }

    const writeResult = await writeResponse.json();
    logger.info("Write result:", writeResult);

    assertEquals(writeResult.success, true, "Write operation should succeed");
    assertEquals(
      writeResult.filename,
      "notes.md",
      "Should map 'notes' to 'notes.md'",
    );

    // Test 3: Read the file back to verify it was written
    await delay(200); // Small delay to ensure file is written

    const readResponse = await fetch(
      `http://localhost:${serverPort}/api/conversations/${conversationId}/files/notes.md`,
    );

    assertEquals(
      readResponse.ok,
      true,
      `Read request failed: ${readResponse.status}`,
    );

    const readResult = await readResponse.json();
    assertEquals(
      readResult.content,
      testContent,
      "File content should match what was written",
    );

    // Test 4: Test grader-deck path mapping
    const graderContent = "# Grader Deck\n\nThis is a test grader deck.";
    const graderWriteResponse = await fetch(
      `http://localhost:${serverPort}/api/conversations/${conversationId}/files/grader-deck/write`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: graderContent }),
      },
    );

    assertEquals(
      graderWriteResponse.ok,
      true,
      "Grader deck write should succeed",
    );

    const graderWriteResult = await graderWriteResponse.json();
    assertEquals(
      graderWriteResult.filename,
      "grader-deck.md",
      "Should map 'grader-deck' to 'grader-deck.md'",
    );

    // Test 5: Read back grader deck
    const graderReadResponse = await fetch(
      `http://localhost:${serverPort}/api/conversations/${conversationId}/files/grader-deck.md`,
    );

    assertEquals(
      graderReadResponse.ok,
      true,
      "Grader deck read should succeed",
    );

    const graderReadResult = await graderReadResponse.json();
    assertEquals(
      graderReadResult.content,
      graderContent,
      "Grader deck content should match",
    );

    // Test 6: Test error handling - missing content
    const errorResponse = await fetch(
      `http://localhost:${serverPort}/api/conversations/${conversationId}/files/test/write`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Missing content
      },
    );

    assertEquals(
      errorResponse.status,
      400,
      "Should return 400 for missing content",
    );
    await errorResponse.body?.cancel(); // Consume the body

    // Test 7: Test method not allowed
    const methodErrorResponse = await fetch(
      `http://localhost:${serverPort}/api/conversations/${conversationId}/files/test/write`,
      {
        method: "GET", // Wrong method
      },
    );

    assertEquals(
      methodErrorResponse.status,
      405,
      "Should return 405 for wrong method",
    );
    await methodErrorResponse.body?.cancel(); // Consume the body

    logger.info("All replaceFileContent API tests passed!");
  } finally {
    // Cleanup: kill the server process and close streams
    try {
      serverProcess.kill("SIGTERM");
      await serverProcess.stdout.cancel();
      await serverProcess.stderr.cancel();
      await serverProcess.status;
    } catch (error) {
      logger.warn("Error during cleanup:", error);
    }
  }
});

Deno.test.ignore(
  "aibff gui --dev loads successfully with routing and Isograph",
  async () => {
    // Start the aibff gui dev server
    const serverPort = 3006;
    const command = new Deno.Command("aibff", {
      args: ["gui", "--dev", "--port", String(serverPort), "--no-open"],
      stdout: "piped",
      stderr: "piped",
    });

    const serverProcess = command.spawn();

    // Wait for server to be ready
    let serverReady = false;
    const maxRetries = 50; // 5 seconds with 100ms delay

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
      baseUrl: "http://localhost:3006",
    });

    try {
      // Navigate to the GUI
      await context.page.goto(context.baseUrl, {
        waitUntil: "networkidle2",
      });

      // Add comprehensive error logging
      context.page.on("pageerror", (error) => {
        logger.error("Page error:", error.message);
      });

      context.page.on("console", async (msg) => {
        if (msg.type() === "error") {
          logger.error("Console error:", msg.text());
          // Try to get more details about the error
          for (let i = 0; i < msg.args().length; i++) {
            try {
              const arg = msg.args()[i];
              const properties = await arg.getProperties();
              // deno-lint-ignore no-explicit-any
              const errorDetails: any = {};
              for (const [key, value] of properties) {
                try {
                  errorDetails[key] = await value.jsonValue();
                } catch {
                  errorDetails[key] = "Unable to serialize";
                }
              }
              logger.error(`  Error details:`, errorDetails);
            } catch (e) {
              logger.error(`  Could not get error details: ${e}`);
            }
          }
        }
      });

      // Check for any script errors
      const scriptErrors = await context.page.evaluate(() => {
        // deno-lint-ignore no-explicit-any
        return (window as any).__SCRIPT_ERRORS__ || [];
      });
      if (scriptErrors.length > 0) {
        logger.error("Script errors:", scriptErrors);
      }

      // Take initial screenshot
      await context.takeScreenshot("aibff-gui-initial");

      // Debug: Check what's on the page
      const pageContent = await context.page.content();
      logger.debug("Page HTML length:", pageContent.length);

      // Debug: Check for any error messages
      const bodyText = await context.page.evaluate(() =>
        document.body?.textContent || "No body"
      );
      logger.debug("Body text:", bodyText.substring(0, 200));

      // Debug: Check if root div exists
      const rootExists = await context.page.evaluate(() => {
        return !!document.getElementById("root");
      });
      logger.debug("Root div exists:", rootExists);

      // Debug: Check for React rendering
      const rootContent = await context.page.evaluate(() => {
        const root = document.getElementById("root");
        return root ? root.innerHTML : "No root div";
      });
      logger.debug("Root content:", rootContent.substring(0, 200));

      // Check for module load errors
      const moduleErrors = await context.page.evaluate(() => {
        // deno-lint-ignore no-explicit-any
        return (window as any).__vite_ssr_dynamic_import_support__ === false;
      });
      logger.debug("Module import issues:", moduleErrors);

      // Check for any Isograph errors
      const isographCheck = await context.page.evaluate(() => {
        try {
          // Check if iso function exists
          const scripts = Array.from(document.querySelectorAll("script"));
          const srcScripts = scripts.filter((s) => s.src).map((s) => s.src);
          return {
            scriptCount: scripts.length,
            srcScripts,
            // deno-lint-ignore no-explicit-any
            hasIso: typeof (window as any).iso !== "undefined",
          };
        } catch (e) {
          return { error: (e as Error).message };
        }
      });
      logger.debug("Isograph check:", isographCheck);

      // Wait a bit more for React to render
      await delay(2000);

      // Check again after delay
      const rootContentAfterDelay = await context.page.evaluate(() => {
        const root = document.getElementById("root");
        return root ? root.innerHTML : "No root div";
      });
      logger.debug(
        "Root content after delay:",
        rootContentAfterDelay.substring(0, 200),
      );

      // Check if error was displayed
      const errorContent = await context.page.evaluate(() => {
        const errorH1 = document.querySelector("h1");
        const errorPre = document.querySelector("pre");
        return {
          hasError: errorH1?.textContent === "Error",
          errorMessage: errorPre?.textContent || null,
          bodyHTML: document.body.innerHTML.substring(0, 500),
        };
      });
      logger.debug("Error check:", errorContent);

      // Wait for content to load - look for the "New Conversation" header
      await context.page.waitForFunction(
        () => {
          const elements = Array.from(document.querySelectorAll("*"));
          return elements.some((el) =>
            el.textContent?.trim() === "New Conversation"
          );
        },
        { timeout: 5000 },
      );

      // Wait a bit more for React to hydrate
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

      // Check that the chat interface tabs exist
      const tabLabels = await context.page.evaluate(() => {
        // Look for tab-like elements that contain the expected text
        const elements = Array.from(document.querySelectorAll("*"));
        const tabs = [];
        for (const el of elements) {
          const text = el.textContent?.trim();
          if (
            text === "Input Samples" || text === "Actor Deck" ||
            text === "Grader Deck" || text === "Ground Truth" ||
            text === "Notes"
          ) {
            tabs.push(text);
          }
        }
        return [...new Set(tabs)]; // Remove duplicates
      });
      logger.info("Found tab labels:", tabLabels);
      assert(
        tabLabels.includes("Input Samples"),
        "Should have Input Samples tab",
      );
      assert(tabLabels.includes("Actor Deck"), "Should have Actor Deck tab");
      assert(tabLabels.includes("Grader Deck"), "Should have Grader Deck tab");
      assert(
        tabLabels.includes("Ground Truth"),
        "Should have Ground Truth tab",
      );
      assert(tabLabels.includes("Notes"), "Should have Notes tab");

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

      // Test tab interaction by clicking on Input Samples tab
      const inputSamplesTabClicked = await context.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("*"));
        const inputSamplesTab = elements.find((el) =>
          el.textContent?.trim() === "Input Samples"
        );
        if (inputSamplesTab && inputSamplesTab instanceof HTMLElement) {
          inputSamplesTab.click();
          return true;
        }
        return false;
      });
      assert(
        inputSamplesTabClicked,
        "Should be able to click Input Samples tab",
      );
      await delay(100);

      // Take screenshot after interaction
      await context.takeScreenshot("aibff-gui-after-click");

      logger.info("aibff GUI e2e test completed successfully");
    } catch (error) {
      // Take error screenshot
      await context.takeScreenshot("aibff-gui-error");
      logger.error("Test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);

      // Stop the server process and close streams
      try {
        // Kill the process first
        serverProcess.kill("SIGTERM");

        // Streams will be closed automatically when process exits

        // Wait for process to exit with timeout
        const statusPromise = serverProcess.status;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Process cleanup timeout")), 5000)
        );

        await Promise.race([statusPromise, timeoutPromise]);
      } catch (error) {
        logger.debug("Error cleaning up server process:", error);
        // Force kill if graceful shutdown failed
        try {
          serverProcess.kill("SIGKILL");
        } catch {
          // Process may already be terminated
        }
      }
    }
  },
);

Deno.test.ignore(
  "debug tool call execution should replace grader deck content",
  async () => {
    // Start the aibff gui dev server
    const serverPort = 3007; // Use different port to avoid conflicts
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

    try {
      // Navigate to the GUI
      await context.page.goto(context.baseUrl, {
        waitUntil: "networkidle2",
      });

      // Wait for initial load - look for React root or any content
      await context.page.waitForFunction(
        () => {
          // Check if React app has loaded by looking for the root element or any meaningful content
          const root = document.getElementById("root");
          if (root && root.children.length > 0) {
            return true;
          }
          // Also check for any elements that might contain our text
          const elements = Array.from(document.querySelectorAll("*"));
          return elements.some((el) =>
            el.textContent?.includes("New Conversation") ||
            el.textContent?.includes("Loading") ||
            el.textContent?.includes("Assistant")
          );
        },
        { timeout: 10000 },
      );

      await delay(500);

      // Wait for the grader-deck.md file to be available in the Files list
      await context.page.waitForFunction(
        () => {
          const elements = Array.from(document.querySelectorAll("*"));
          return elements.some((el) =>
            el.textContent?.includes("grader-deck.md")
          );
        },
        { timeout: 15000 },
      );

      // Click on grader-deck.md file to see initial content
      const graderTabClicked = await context.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("*"));
        const graderFile = elements.find((el) =>
          el.textContent?.trim() === "grader-deck.md"
        );

        if (graderFile && graderFile instanceof HTMLElement) {
          graderFile.click();
          return true;
        }

        return false;
      });

      assert(graderTabClicked, "Should be able to click grader-deck.md file");
      await delay(200);

      // Set up console log capture BEFORE sending the message
      const consoleLogs: Array<string> = [];
      context.page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      // Get initial grader deck content
      const initialGraderContent = await context.page.evaluate(() => {
        const textareas = Array.from(document.querySelectorAll("textarea"));
        const graderTextarea = textareas.find((textarea) =>
          textarea.closest("div")?.textContent?.includes("Grader Deck") ||
          textarea.placeholder?.includes("grader") ||
          textarea.value?.includes("grader") ||
          textarea.getAttribute("data-tab") === "grader"
        );
        return graderTextarea?.value || "";
      });
      logger.info("Initial grader deck content:", initialGraderContent);

      // Find and click the chat textarea
      const chatTextarea = await context.page.$(
        'textarea[placeholder="Type a message..."]',
      );
      assert(chatTextarea, "Should find chat textarea");

      // Type the debug command to test streaming tool calls
      const debugCommand = '⚡️debug⚡️ replaceGraderDeck "lol we did it"';
      await chatTextarea.focus();
      await chatTextarea.type(debugCommand);

      // Find and click send button
      const sendButtonClicked = await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const sendButton = buttons.find((button) =>
          button.textContent === "Send"
        );
        if (sendButton) {
          sendButton.click();
          return true;
        }
        return false;
      });
      assert(sendButtonClicked, "Should find and click Send button");

      // Wait for the streaming to complete and tool calls to be executed
      await delay(15000); // Give more time for the API call and processing

      // Take screenshot for debugging
      await context.takeScreenshot("debug-tool-call-after-send");

      // Check console logs for tool call processing
      const toolCallLogs = consoleLogs.filter((log) =>
        log.includes("tool") || log.includes("Tool") ||
        log.includes("replaceGraderDeck") || log.includes("executeToolCall")
      );
      logger.info("All console logs related to tool calls:", toolCallLogs);

      // Look for specific completion messages
      const hasStreamFinished = consoleLogs.some((log) =>
        log.includes("Stream finished")
      );
      const hasToolCallsExecuted = consoleLogs.some((log) =>
        log.includes("All tool calls processed")
      );
      const hasExecuteToolCall = consoleLogs.some((log) =>
        log.includes("executeToolCall called with")
      );

      logger.info("Tool call execution status:", {
        hasStreamFinished,
        hasToolCallsExecuted,
        hasExecuteToolCall,
        totalLogs: consoleLogs.length,
        toolCallLogsCount: toolCallLogs.length,
      });

      // Go back to grader-deck.md file to check if content changed
      await context.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("*"));
        const graderFile = elements.find((el) =>
          el.textContent?.trim() === "grader-deck.md"
        );
        if (graderFile && graderFile instanceof HTMLElement) {
          graderFile.click();
        }
      });
      await delay(1000); // Wait for UI to update

      // Try multiple times to get updated content, as it might be updating asynchronously
      let updatedGraderContent = "";
      for (let attempt = 0; attempt < 5; attempt++) {
        updatedGraderContent = await context.page.evaluate(() => {
          const textareas = Array.from(document.querySelectorAll("textarea"));
          const graderTextarea = textareas.find((textarea) =>
            textarea.closest("div")?.textContent?.includes("grader-deck.md") ||
            textarea.placeholder?.includes("grader") ||
            textarea.value?.includes("grader") ||
            textarea.getAttribute("data-tab") === "grader"
          );
          return graderTextarea?.value || "";
        });

        logger.info(
          `Attempt ${attempt + 1} - Updated grader deck content:`,
          updatedGraderContent.substring(0, 100),
        );

        if (updatedGraderContent.trim() === "lol we did it") {
          break;
        }

        await delay(2000); // Wait between attempts
      }

      logger.info("Final updated grader deck content:", updatedGraderContent);

      // Verify the tool call successfully updated the grader deck content
      assertEquals(
        updatedGraderContent.trim(),
        "lol we did it",
        "Grader deck content should be updated by debug tool call",
      );
    } catch (error) {
      await context.takeScreenshot("debug-tool-call-error");
      logger.error("Debug tool call test failed:", error);
      throw error;
    } finally {
      await teardownE2ETest(context);

      try {
        // Kill the process first
        serverProcess.kill("SIGTERM");

        // Streams will be closed automatically when process exits

        // Wait for process to exit with timeout
        const statusPromise = serverProcess.status;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Process cleanup timeout")), 5000)
        );

        await Promise.race([statusPromise, timeoutPromise]);
      } catch (error) {
        logger.debug("Error cleaning up server process:", error);
        // Force kill if graceful shutdown failed
        try {
          serverProcess.kill("SIGKILL");
        } catch {
          // Process may already be terminated
        }
      }
    }
  },
);
