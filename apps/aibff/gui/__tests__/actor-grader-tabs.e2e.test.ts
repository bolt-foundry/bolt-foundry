#!/usr/bin/env -S deno test -A

import { assert, assertEquals } from "@std/assert";
import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const logger = getLogger(import.meta);

Deno.test("aibff gui shows all five tabs in right panel", async () => {
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

  // Setup Puppeteer e2e test
  const context = await setupE2ETest({
    baseUrl: `http://localhost:${serverPort}`,
    headless: true,
  });

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

    await delay(500); // Let React hydrate

    // Take initial screenshot
    await context.takeScreenshot("five-tabs-initial");

    // Check that all five tabs are present in the correct order
    const tabsCheck = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const hasInputSamples = buttons.some((button) =>
        button.textContent === "Input Samples"
      );
      const hasActorDeck = buttons.some((button) =>
        button.textContent === "Actor Deck"
      );
      const hasGraderDeck = buttons.some((button) =>
        button.textContent === "Grader Deck"
      );
      const hasGroundTruth = buttons.some((button) =>
        button.textContent === "Ground Truth"
      );
      const hasNotes = buttons.some((button) => button.textContent === "Notes");

      // Check order by getting text content of buttons
      const buttonTexts = buttons.map((b) => b.textContent).filter((t) =>
        t === "Input Samples" || t === "Actor Deck" || t === "Grader Deck" ||
        t === "Ground Truth" || t === "Notes"
      );

      return {
        hasInputSamples,
        hasActorDeck,
        hasGraderDeck,
        hasGroundTruth,
        hasNotes,
        buttonTexts,
        correctOrder: buttonTexts.join(",") ===
          "Input Samples,Actor Deck,Grader Deck,Ground Truth,Notes",
      };
    });

    assert(tabsCheck.hasInputSamples, "Should have Input Samples tab");
    assert(tabsCheck.hasActorDeck, "Should have Actor Deck tab");
    assert(tabsCheck.hasGraderDeck, "Should have Grader Deck tab");
    assert(tabsCheck.hasGroundTruth, "Should have Ground Truth tab");
    assert(tabsCheck.hasNotes, "Should have Notes tab");
    assert(
      tabsCheck.correctOrder,
      `Tabs should be in correct order. Got: ${
        tabsCheck.buttonTexts.join(",")
      }`,
    );

    // Check that Input Samples tab is initially active (default)
    const inputSamplesTabActive = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const inputSamplesTab = buttons.find((button) =>
        button.textContent === "Input Samples"
      );
      return inputSamplesTab?.getAttribute("aria-selected") === "true" ||
        inputSamplesTab?.className?.includes("active");
    });
    assert(
      inputSamplesTabActive,
      "Input Samples tab should be initially active",
    );

    // Check that input samples textarea is visible initially
    const hasInputSamplesTextarea = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      return textareas.some((textarea) =>
        textarea.placeholder?.includes("samples") ||
        textarea.placeholder?.includes("Input")
      );
    });
    assert(
      hasInputSamplesTextarea,
      "Should show input samples textarea initially",
    );

    // Click on Actor Deck tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const actorTab = buttons.find((button) =>
        button.textContent === "Actor Deck"
      );
      if (actorTab) {
        (actorTab as HTMLButtonElement).click();
      }
    });

    await delay(200); // Wait for tab switch

    // Take screenshot after clicking Actor Deck tab
    await context.takeScreenshot("five-tabs-actor-selected");

    // Check that Actor Deck tab is now active
    const actorTabActive = await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const actorTab = buttons.find((button) =>
        button.textContent === "Actor Deck"
      );
      return actorTab?.getAttribute("aria-selected") === "true" ||
        actorTab?.className?.includes("active");
    });
    assert(actorTabActive, "Actor Deck tab should be active after clicking");

    // Check that actor textarea is now visible
    const hasActorTextarea = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      return textareas.some((textarea) =>
        textarea.placeholder?.includes("actor") ||
        textarea.placeholder?.includes("Actor")
      );
    });
    assert(
      hasActorTextarea,
      "Should show actor textarea after clicking Actor Deck tab",
    );

    // Test typing in the Actor textarea
    const actorTestContent = "# Actor Deck\n\nThis is my actor definition.";

    // Find and type in the actor textarea
    const actorTextareaExists = await context.page.evaluate(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      return textareas.some((textarea) =>
        textarea.placeholder?.includes("actor") ||
        textarea.placeholder?.includes("Actor")
      );
    });
    assert(actorTextareaExists, "Actor textarea should exist");

    // Clear and type content using Puppeteer's type method
    await context.page.focus(
      'textarea[placeholder*="actor"], textarea[placeholder*="Actor"]',
    );
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.keyboard.press("Backspace");
    await context.page.type(
      'textarea[placeholder*="actor"], textarea[placeholder*="Actor"]',
      actorTestContent,
    );

    await delay(200);

    // Test Grader Deck tab
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

    // Test typing in the Grader textarea
    const graderTestContent = "# Grader Deck\n\nThis is my grader definition.";
    await context.page.focus(
      'textarea[placeholder*="grader"], textarea[placeholder*="Grader"]',
    );
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.keyboard.press("Backspace");
    await context.page.type(
      'textarea[placeholder*="grader"], textarea[placeholder*="Grader"]',
      graderTestContent,
    );

    await delay(200);

    // Test Ground Truth tab
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

    // Test typing in the Ground Truth textarea
    const groundTruthTestContent = "# Ground Truth\n\nExpected outputs here.";
    await context.page.focus(
      'textarea[placeholder*="truth"], textarea[placeholder*="Truth"]',
    );
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.keyboard.press("Backspace");
    await context.page.type(
      'textarea[placeholder*="truth"], textarea[placeholder*="Truth"]',
      groundTruthTestContent,
    );

    await delay(200);

    // Test Notes tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const notesTab = buttons.find((button) => button.textContent === "Notes");
      if (notesTab) {
        (notesTab as HTMLButtonElement).click();
      }
    });

    await delay(200);

    // Test typing in the Notes textarea
    const notesTestContent =
      "# Notes\n\nThese are my notes shared with the assistant.";
    await context.page.focus(
      'textarea[placeholder*="notes"], textarea[placeholder*="Notes"]',
    );
    await context.page.keyboard.down("Control");
    await context.page.keyboard.press("KeyA");
    await context.page.keyboard.up("Control");
    await context.page.keyboard.press("Backspace");
    await context.page.type(
      'textarea[placeholder*="notes"], textarea[placeholder*="Notes"]',
      notesTestContent,
    );

    await delay(200);

    // Switch back to Actor Deck tab and verify content still persists
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

    // Switch to Notes tab and verify Notes content persists
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const notesTab = buttons.find((button) => button.textContent === "Notes");
      if (notesTab) {
        (notesTab as HTMLButtonElement).click();
      }
    });

    await delay(200);

    // Verify Notes content persists
    const notesContentCheck = await context.page.evaluate((expectedContent) => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const notesTextarea = textareas.find((textarea) =>
        textarea.placeholder?.includes("notes") ||
        textarea.placeholder?.includes("Notes")
      ) as HTMLTextAreaElement;
      return {
        found: !!notesTextarea,
        placeholder: notesTextarea?.placeholder || "not found",
        actualContent: notesTextarea?.value || "empty",
        expectedContent,
        matches: notesTextarea?.value === expectedContent,
      };
    }, notesTestContent);

    logger.debug("Notes content check:", notesContentCheck);
    assert(
      notesContentCheck.matches,
      `Notes content should persist when switching tabs. Expected: "${notesContentCheck.expectedContent}", Got: "${notesContentCheck.actualContent}"`,
    );

    // Take final screenshot
    await context.takeScreenshot("five-tabs-final");

    logger.info("Five tabs e2e test completed successfully");
  } catch (error) {
    await context.takeScreenshot("five-tabs-error");
    logger.error("Test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);

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
