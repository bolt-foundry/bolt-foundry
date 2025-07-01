#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("aibff gui --dev loads successfully with routing and Isograph", async () => {
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
    headless: true, // Run headless in tests
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
          text === "Grader Deck" || text === "Ground Truth" || text === "Notes"
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
    assert(tabLabels.includes("Ground Truth"), "Should have Ground Truth tab");
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
    assert(inputSamplesTabClicked, "Should be able to click Input Samples tab");
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
      // Close the streams first
      await serverProcess.stdout.cancel();
      await serverProcess.stderr.cancel();

      // Then kill the process
      serverProcess.kill();
      await serverProcess.status;
    } catch {
      // Process may have already exited
    }
  }
});
