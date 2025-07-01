#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("aibff gui saves conversation and all tab contents to folder", async () => {
  // Start the aibff gui dev server
  const serverPort = 3008;
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
    baseUrl: `http://localhost:${serverPort}`,
    headless: true,
  });

  let conversationId: string | null = null;

  try {
    // Navigate to the GUI
    await context.page.goto(context.baseUrl, {
      waitUntil: "networkidle2",
    });

    // Wait for content to load
    await context.page.waitForFunction(
      () => {
        const textarea = document.querySelector(
          'textarea[placeholder="Type a message..."]',
        );
        return !!textarea;
      },
      { timeout: 5000 },
    );

    await delay(1000); // Let React hydrate and create conversation

    // Extract conversation ID from URL
    conversationId = await context.page.evaluate(() => {
      const hash = globalThis.location.hash;
      const match = hash.match(/\/chat\/(.+)/);
      return match ? match[1] : null;
    });

    assert(conversationId, "Should have a conversation ID");
    logger.info(`Testing with conversation ID: ${conversationId}`);

    // Take initial screenshot
    await context.takeScreenshot("conversation-save-initial");

    // Send a test message first
    const testMessage = "Create a grader for sentiment analysis";
    await context.page.type(
      'textarea[placeholder="Type a message..."]',
      testMessage,
    );

    // Click send button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendButton = buttons.find((btn) => btn.textContent === "Send");
      if (sendButton) {
        (sendButton as HTMLButtonElement).click();
      }
    });

    // Wait for user message to appear
    await context.page.waitForFunction(
      (msg) => {
        const divs = Array.from(document.querySelectorAll("div"));
        return divs.some((div) => div.textContent === msg);
      },
      { timeout: 5000 },
      testMessage,
    );

    // Wait a bit for AI response to start
    await delay(2000);

    // Fill in all tabs with test content
    const testData = {
      inputSamples:
        '{"text": "This movie is great!", "label": "positive"}\n{"text": "I hate this film.", "label": "negative"}',
      actorDeck: "# Actor Deck\n\nYou are a sentiment analysis assistant.",
      graderDeck:
        "# Grader Deck\n\nRate sentiment: +3 (very positive) to -3 (very negative).",
      groundTruth: "# Ground Truth\n\nSample 1: +2\nSample 2: -2",
    };

    // Fill Input Samples tab (should be active by default)
    await context.page.focus('textarea[placeholder*="samples"]');
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.type(
      'textarea[placeholder*="samples"]',
      testData.inputSamples,
    );

    await delay(200);

    // Switch to Actor Deck tab and fill
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const actorTab = buttons.find((button) =>
        button.textContent === "Actor Deck"
      );
      if (actorTab) {
        (actorTab as HTMLButtonElement).click();
      }
    });

    await delay(200);
    await context.page.focus('textarea[placeholder*="actor"]');
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.type(
      'textarea[placeholder*="actor"]',
      testData.actorDeck,
    );

    await delay(200);

    // Switch to Grader Deck tab and fill
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const graderTab = buttons.find((button) =>
        button.textContent === "Grader Deck"
      );
      if (graderTab) {
        (graderTab as HTMLButtonElement).click();
      }
    });

    await delay(200);
    await context.page.focus('textarea[placeholder*="grader"]');
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.type(
      'textarea[placeholder*="grader"]',
      testData.graderDeck,
    );

    await delay(200);

    // Switch to Ground Truth tab and fill
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const groundTruthTab = buttons.find((button) =>
        button.textContent === "Ground Truth"
      );
      if (groundTruthTab) {
        (groundTruthTab as HTMLButtonElement).click();
      }
    });

    await delay(200);
    await context.page.focus('textarea[placeholder*="truth"]');
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.type(
      'textarea[placeholder*="truth"]',
      testData.groundTruth,
    );

    await delay(200);

    // Take screenshot before saving
    await context.takeScreenshot("conversation-save-before-save");

    // Click Save button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const saveButton = buttons.find((button) =>
        button.textContent === "Save"
      );
      if (saveButton) {
        (saveButton as HTMLButtonElement).click();
      }
    });

    // Wait a bit for save to complete
    await delay(1000);

    // Take screenshot after saving
    await context.takeScreenshot("conversation-save-after-save");

    // Verify the files were created by checking the API response
    const conversationFolder =
      new URL(import.meta.resolve("../conversations")).pathname +
      `/${conversationId}`;

    // Check that all expected files exist
    const expectedFiles = [
      "conversation.md",
      "input-samples.jsonl",
      "actor.deck.md",
      "grader.deck.md",
      "ground-truth.deck.toml",
    ];

    for (const fileName of expectedFiles) {
      const filePath = `${conversationFolder}/${fileName}`;
      try {
        const stat = await Deno.stat(filePath);
        assert(stat.isFile, `${fileName} should be a file`);
        logger.info(`✓ ${fileName} exists`);
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);
        throw new Error(
          `File ${fileName} should exist but doesn't: ${errorMessage}`,
        );
      }
    }

    // Verify file contents
    const conversationMd = await Deno.readTextFile(
      `${conversationFolder}/conversation.md`,
    );
    logger.debug("conversation.md content:", conversationMd);
    // The conversation should have some content (either user message or assistant greeting)
    assert(conversationMd.length > 0, "conversation.md should not be empty");
    // It should contain either a User or Assistant header
    assert(
      conversationMd.includes("## User") ||
        conversationMd.includes("## Assistant"),
      "conversation.md should have User or Assistant header",
    );

    const inputSamplesJsonl = await Deno.readTextFile(
      `${conversationFolder}/input-samples.jsonl`,
    );
    assertEquals(
      inputSamplesJsonl,
      testData.inputSamples,
      "input-samples.jsonl should match",
    );

    const actorDeckMd = await Deno.readTextFile(
      `${conversationFolder}/actor.deck.md`,
    );
    assertEquals(actorDeckMd, testData.actorDeck, "actor.deck.md should match");

    const graderDeckMd = await Deno.readTextFile(
      `${conversationFolder}/grader.deck.md`,
    );
    assertEquals(
      graderDeckMd,
      testData.graderDeck,
      "grader.deck.md should match",
    );

    const groundTruthToml = await Deno.readTextFile(
      `${conversationFolder}/ground-truth.deck.toml`,
    );
    assertEquals(
      groundTruthToml,
      testData.groundTruth,
      "ground-truth.deck.toml should match",
    );

    logger.info("All files saved correctly with expected content");

    // Now test that the content loads back when we refresh the page
    logger.info("Testing content loading after page refresh...");

    // Refresh the page to test loading
    await context.page.reload({ waitUntil: "networkidle2" });

    // Wait for content to load
    await context.page.waitForFunction(
      () => {
        const textarea = document.querySelector(
          'textarea[placeholder="Type a message..."]',
        );
        return !!textarea;
      },
      { timeout: 5000 },
    );

    await delay(1000); // Give time for the load API call to complete

    // Verify Input Samples content is loaded (should be active tab)
    const loadedInputSamples = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const inputSamplesTextarea = textareas.find((textarea) =>
        textarea.placeholder?.includes("samples") ||
        textarea.placeholder?.includes("Input")
      ) as HTMLTextAreaElement;
      return inputSamplesTextarea?.value || "";
    });
    assertEquals(
      loadedInputSamples,
      testData.inputSamples,
      "Input samples should be loaded after refresh",
    );

    // Check Actor Deck tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const actorTab = buttons.find((button) =>
        button.textContent === "Actor Deck"
      );
      if (actorTab) {
        (actorTab as HTMLButtonElement).click();
      }
    });

    await delay(200);

    const loadedActorDeck = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const actorTextarea = textareas.find((textarea) =>
        textarea.placeholder?.includes("actor") ||
        textarea.placeholder?.includes("Actor")
      ) as HTMLTextAreaElement;
      return actorTextarea?.value || "";
    });
    assertEquals(
      loadedActorDeck,
      testData.actorDeck,
      "Actor deck should be loaded after refresh",
    );

    // Check Grader Deck tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const graderTab = buttons.find((button) =>
        button.textContent === "Grader Deck"
      );
      if (graderTab) {
        (graderTab as HTMLButtonElement).click();
      }
    });

    await delay(200);

    const loadedGraderDeck = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const graderTextarea = textareas.find((textarea) =>
        textarea.placeholder?.includes("grader") ||
        textarea.placeholder?.includes("Grader")
      ) as HTMLTextAreaElement;
      return graderTextarea?.value || "";
    });
    assertEquals(
      loadedGraderDeck,
      testData.graderDeck,
      "Grader deck should be loaded after refresh",
    );

    // Check Ground Truth tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const groundTruthTab = buttons.find((button) =>
        button.textContent === "Ground Truth"
      );
      if (groundTruthTab) {
        (groundTruthTab as HTMLButtonElement).click();
      }
    });

    await delay(200);

    const loadedGroundTruth = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const groundTruthTextarea = textareas.find((textarea) =>
        textarea.placeholder?.includes("truth") ||
        textarea.placeholder?.includes("Truth")
      ) as HTMLTextAreaElement;
      return groundTruthTextarea?.value || "";
    });
    assertEquals(
      loadedGroundTruth,
      testData.groundTruth,
      "Ground truth should be loaded after refresh",
    );

    logger.info("All tab contents loaded correctly after page refresh");

    logger.info("Conversation save and load e2e test completed successfully");
  } catch (error) {
    await context.takeScreenshot("conversation-save-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);

    // Clean up test conversation folder if it exists
    if (conversationId) {
      try {
        const conversationFolder =
          new URL(import.meta.resolve("../conversations")).pathname +
          `/${conversationId}`;
        await Deno.remove(conversationFolder, { recursive: true });
        logger.info(`Cleaned up test conversation folder: ${conversationId}`);
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);
        logger.debug(
          `Failed to clean up conversation folder (may not exist): ${errorMessage}`,
        );
      }
    }

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
