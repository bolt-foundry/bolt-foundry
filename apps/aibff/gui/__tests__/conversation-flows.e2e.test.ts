#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { exists } from "@std/fs";
import { extract as extractFrontmatter } from "@std/front-matter/toml";
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

// Shared test utilities
async function waitForChatInterface(context: E2ETestContext) {
  await context.page.waitForFunction(
    () => {
      // Check if the textarea is present
      const textarea = document.querySelector(
        'textarea[placeholder="Type a message..."]',
      );
      // Check if send button is present
      const buttons = Array.from(document.querySelectorAll("button"));
      const hasSendButton = buttons.some((button) =>
        button.textContent === "Send"
      );
      return textarea && hasSendButton;
    },
    { timeout: 5000 },
  );
}

async function sendMessage(context: E2ETestContext, message: string) {
  await context.page.type('textarea[placeholder="Type a message..."]', message);

  await context.page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const sendButton = buttons.find((btn) => btn.textContent === "Send");
    if (sendButton) {
      (sendButton as HTMLButtonElement).click();
    }
  });

  // Wait for the message to appear
  await context.page.waitForFunction(
    (msg) => {
      const divs = Array.from(document.querySelectorAll("div"));
      return divs.some((div) => div.textContent === msg);
    },
    { timeout: 5000 },
    message,
  );
}

async function getConversationId(
  context: E2ETestContext,
): Promise<string | null> {
  return await context.page.evaluate(() => {
    const hash = globalThis.location.hash;
    const match = hash.match(/\/chat\/(conv-[^\/]+)/);
    return match ? match[1] : null;
  });
}

// Main test suite
Deno.test("aibff GUI conversation flows", async (t) => {
  const serverPort = 3015;

  // Clean up any existing conversations directory
  try {
    await Deno.remove("conversations", { recursive: true });
  } catch {
    // Directory might not exist
  }

  // Start the server once for all tests
  const serverProcess = await startGuiServer(serverPort);

  // Setup Puppeteer once for all tests
  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
    headless: true,
  });

  try {
    await t.step("creates new conversation and updates URL", async () => {
      // Navigate to home page
      await context.page.goto(context.baseUrl, {
        waitUntil: "networkidle2",
      });

      // Should redirect to a new conversation URL
      await context.page.waitForFunction(
        () => globalThis.location.hash.includes("/chat/conv-"),
        { timeout: 5000 },
      );

      const conversationId = await getConversationId(context);
      assert(conversationId, "Should have conversation ID in URL");
      assert(
        conversationId.match(/^conv-\d+-[a-z0-9]+$/),
        "Conversation ID should match expected format",
      );

      // Should see greeting message
      await waitForChatInterface(context);

      // No loading message should be visible for new conversation
      const hasLoadingMessage = await context.page.evaluate(() => {
        return document.body.textContent?.includes("Loading conversation...");
      });
      assertEquals(
        hasLoadingMessage,
        false,
        "Should not show loading message for new conversation",
      );
    });

    await t.step("persists conversations to disk", async () => {
      // Get current conversation ID
      const conversationId = await getConversationId(context);
      assert(conversationId, "Should have conversation ID");

      // Send a test message
      const testMessage = "Can you help me test persistence?";
      await sendMessage(context, testMessage);

      // Wait for AI response to start and be saved
      await delay(3000);

      // Verify the conversation file was saved
      const conversationsDir = new URL(
        import.meta.resolve("@bfmono/tmp/conversations"),
      ).pathname;
      let conversationFile = `${conversationsDir}/${conversationId}.md`;
      let fileExists = await exists(conversationFile);

      if (!fileExists) {
        // Try .toml extension for backwards compatibility
        conversationFile = `${conversationsDir}/${conversationId}.toml`;
        fileExists = await exists(conversationFile);
      }

      if (!fileExists) {
        logger.warn(
          `Conversation file not found. This test requires OPENROUTER_API_KEY to be set.`,
        );
        return; // Skip the rest of this test step
      }

      // Read and parse the conversation file
      const content = await Deno.readTextFile(conversationFile);

      if (conversationFile.endsWith(".md")) {
        // Parse markdown format
        const { attrs, body } = extractFrontmatter<{
          id: string;
          created_at: string;
          updated_at: string;
        }>(content);

        assertEquals(
          attrs.id,
          conversationId,
          "Frontmatter should contain correct conversation ID",
        );
        assert(attrs.created_at, "Should have created_at timestamp");
        assert(attrs.updated_at, "Should have updated_at timestamp");

        // Check that both user and assistant messages are in the body
        assert(body.includes("## User"), "Should have User section");
        assert(body.includes("## Assistant"), "Should have Assistant section");
        assert(body.includes(testMessage), "Should contain the test message");
        // Note: The initial assistant greeting is dynamically generated from assistant.deck.md
        // so we just check that there is some assistant content
        const assistantSectionIndex = body.indexOf("## Assistant");
        const assistantContent = body.substring(assistantSectionIndex);
        assert(
          assistantContent.length > 50,
          "Should have assistant content in the conversation",
        );
      }
    });

    await t.step("loads existing conversation from URL", async () => {
      // Get the current conversation ID and send a unique message
      const originalId = await getConversationId(context);
      assert(originalId, "Should have original conversation ID");

      const uniqueMessage = "Testing conversation loading functionality";
      await sendMessage(context, uniqueMessage);
      await delay(2000); // Let it save

      // Navigate to home (should create a new conversation)
      await context.page.goto(context.baseUrl + "#/", {
        waitUntil: "networkidle2",
      });

      await context.page.waitForFunction(
        () => globalThis.location.hash.includes("/chat/conv-"),
        { timeout: 5000 },
      );

      const newId = await getConversationId(context);
      assert(newId !== originalId, "Should have created a new conversation");

      // Navigate back to the original conversation
      await context.page.goto(`${context.baseUrl}#/chat/${originalId}`, {
        waitUntil: "networkidle2",
      });

      // Wait for loading to complete
      await context.page.waitForFunction(
        () => !document.body.textContent?.includes("Loading conversation..."),
        { timeout: 5000 },
      );

      // Verify the unique message is displayed
      await context.page.waitForFunction(
        (msg) => {
          const divs = Array.from(document.querySelectorAll("div"));
          return divs.some((div) => div.textContent === msg);
        },
        { timeout: 5000 },
        uniqueMessage,
      );

      // Verify greeting is also there
      await waitForChatInterface(context);
    });

    await t.step("shows error for non-existent conversation", async () => {
      const fakeId = "conv-12345-nonexistent";
      await context.page.goto(`${context.baseUrl}#/chat/${fakeId}`, {
        waitUntil: "networkidle2",
      });

      // Wait a bit for error state or redirect
      await delay(1000);

      // Check for error message
      const hasError = await context.page.evaluate((id) => {
        const text = document.body.textContent || "";
        return text.includes("Conversation Not Found") && text.includes(id);
      }, fakeId);

      if (hasError) {
        // Verify error UI elements
        const hasStartButton = await context.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          return buttons.some((btn) =>
            btn.textContent === "Start New Conversation"
          );
        });
        assert(hasStartButton, "Should show Start New Conversation button");
      } else {
        // App might redirect to a new conversation instead
        const currentId = await getConversationId(context);
        assert(
          currentId !== fakeId,
          "Should not stay on invalid conversation ID",
        );
      }
    });

    await t.step("handles page reload without race conditions", async () => {
      // Create a fresh conversation
      await context.page.goto(context.baseUrl, {
        waitUntil: "networkidle2",
      });

      await context.page.waitForFunction(
        () => globalThis.location.hash.includes("/chat/conv-"),
        { timeout: 5000 },
      );

      const conversationId = await getConversationId(context);
      await waitForChatInterface(context);

      // Send a message
      const reloadTestMessage = "Testing reload functionality";
      await sendMessage(context, reloadTestMessage);
      await delay(2000); // Let it save

      // Reload the page
      await context.page.reload({ waitUntil: "networkidle2" });

      // URL should remain the same
      const idAfterReload = await getConversationId(context);
      assertEquals(
        idAfterReload,
        conversationId,
        "Conversation ID should remain after reload",
      );

      // No persistent loading message
      await context.page.waitForFunction(
        () => !document.body.textContent?.includes("Loading conversation..."),
        { timeout: 5000 },
      );

      // Messages should still be visible
      await context.page.waitForFunction(
        (msg) => {
          const divs = Array.from(document.querySelectorAll("div"));
          return divs.some((div) => div.textContent === msg);
        },
        { timeout: 5000 },
        reloadTestMessage,
      );

      // Test rapid reloads
      for (let i = 0; i < 3; i++) {
        await context.page.reload({ waitUntil: "networkidle2" });
        await delay(500);
      }

      // Should still be functional
      const finalId = await getConversationId(context);
      assertEquals(
        finalId,
        conversationId,
        "Should maintain conversation after rapid reloads",
      );
    });

    await t.step("navigates from error state to new conversation", async () => {
      // Navigate to a non-existent conversation
      const nonExistentId = "conv-99999-doesnotexist";
      await context.page.goto(`${context.baseUrl}#/chat/${nonExistentId}`, {
        waitUntil: "networkidle2",
      });

      // Wait for potential error state
      await delay(1000);

      // Check if error is shown
      const hasError = await context.page.evaluate(() => {
        return document.body.textContent?.includes("Conversation Not Found");
      });

      if (hasError) {
        // Click Start New Conversation button
        await context.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const startButton = buttons.find((btn) =>
            btn.textContent === "Start New Conversation"
          );
          if (startButton) {
            (startButton as HTMLButtonElement).click();
          }
        });

        // Should navigate to a new conversation
        await context.page.waitForFunction(
          (badId) => {
            const hash = globalThis.location.hash;
            return hash.includes("/chat/conv-") && !hash.includes(badId);
          },
          { timeout: 5000 },
          nonExistentId,
        );

        const newId = await getConversationId(context);
        assert(
          newId && newId !== nonExistentId,
          "Should have navigated to new conversation",
        );

        // Should see greeting in new conversation
        await waitForChatInterface(context);
      }
    });

    logger.info("All conversation flow tests completed successfully");
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

    // Clean up test conversations
    try {
      await Deno.remove("conversations", { recursive: true });
    } catch {
      // Directory might not exist
    }
  }
});
