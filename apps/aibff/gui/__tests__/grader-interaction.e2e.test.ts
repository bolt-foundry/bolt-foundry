#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("grader interaction - shows grader editor in right panel", async () => {
  // Start the aibff gui dev server
  const serverPort = 3016;
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

    // Give it a moment to fully render
    await delay(1000);

    // Check that grader editor is visible
    const graderTitle = await context.page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h2"));
      return headings.find((h) => h.textContent === "Grader Definition")
        ?.textContent;
    });

    assertEquals(
      graderTitle,
      "Grader Definition",
      "Grader editor should be visible",
    );

    // Check for the textarea
    const hasTextarea = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      return textareas.some((ta) =>
        ta.placeholder?.includes("Your grader definition will appear here")
      );
    });

    assert(hasTextarea, "Grader textarea should be present");

    // Check for the Save button
    const hasSaveButton = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((btn) => btn.textContent === "Save");
    });

    assert(hasSaveButton, "Save button should be present");

    // Type in the grader editor
    const graderContent = "# Test Grader\n\nThis is a test grader definition.";
    await context.page.evaluate((content) => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      if (textarea) {
        (textarea as HTMLTextAreaElement).value = content;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, graderContent);

    // Verify the content was entered
    const enteredContent = await context.page.evaluate(() => {
      const textarea = Array.from(document.querySelectorAll("textarea"))
        .find((ta) => ta.placeholder?.includes("Your grader definition"));
      return (textarea as HTMLTextAreaElement)?.value;
    });

    assertEquals(
      enteredContent,
      graderContent,
      "Grader content should match what was typed",
    );

    // Take screenshot of the grader editor
    await context.takeScreenshot("grader-editor-visible");

    logger.info("Grader editor test completed successfully");
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
  }
});
