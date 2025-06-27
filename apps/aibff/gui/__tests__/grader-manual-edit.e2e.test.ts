#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("grader manual edit - user can directly edit grader content", async () => {
  // Start the aibff gui dev server
  const serverPort = 3018;
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

    // Wait for components to render
    await delay(1000);

    // Find and click in the grader textarea
    await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      if (textarea) {
        (textarea as HTMLTextAreaElement).focus();
      }
    });

    // Type a manual grader definition
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

    // Clear any existing content and type new content
    await context.page.evaluate((content) => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      if (textarea) {
        (textarea as HTMLTextAreaElement).value = content;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, manualGraderContent);

    // Verify the content was entered
    const enteredContent = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value || "";
    });

    assertEquals(
      enteredContent,
      manualGraderContent,
      "Grader content should match what was typed",
    );

    // Now send a message in chat to see if AI acknowledges the grader
    const chatMessage =
      "I just wrote a grader definition in the editor. Can you see what I'm working on?";
    await context.page.type(
      'textarea[placeholder="Type a message..."]',
      chatMessage,
    );

    // Click send
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendButton = buttons.find((btn) => btn.textContent === "Send");
      if (sendButton) {
        (sendButton as HTMLButtonElement).click();
      }
    });

    // Wait for response
    await delay(2000);

    // Verify the grader content is still there after sending message
    const graderAfterChat = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value || "";
    });

    assertEquals(
      graderAfterChat,
      manualGraderContent,
      "Grader content should persist after chat interaction",
    );

    // Test that we can append to existing content
    const appendText = "\n\n## Additional Section\nThis was added later.";

    await context.page.evaluate((text) => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      if (textarea) {
        const ta = textarea as HTMLTextAreaElement;
        ta.value += text;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, appendText);

    // Verify the appended content
    const finalContent = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value || "";
    });

    assert(
      finalContent.includes("Additional Section"),
      "Should be able to append to grader content",
    );

    // Take screenshot
    await context.takeScreenshot("grader-manual-edit");

    logger.info("Manual edit test completed successfully");
  } finally {
    await teardownE2ETest(context);

    // Stop the server process
    try {
      await serverProcess.stdout.cancel();
      await serverProcess.stderr.cancel();
      serverProcess.kill();
      await serverProcess.status;
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
