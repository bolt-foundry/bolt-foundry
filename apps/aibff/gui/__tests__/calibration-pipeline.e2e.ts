#!/usr/bin/env -S deno test -A

/**
 * E2E test for the complete calibration pipeline happy path
 *
 * Tests the full workflow:
 * 1. Set system prompt
 * 2. Run test conversation
 * 3. Save conversation result
 * 4. Navigate to calibration tab
 * 5. Score saved result (+3 to -3)
 * 6. Verify item moves to Ground Truth
 * 7. Edit score in Ground Truth
 * 8. Remove item from Ground Truth
 */

import { delay } from "@std/async";
import { teardownE2ETest } from "@bfmono/infra/testing/e2e/setup.ts";
import { setupAibffGuiTest } from "./helpers.ts";

Deno.test("Complete calibration pipeline happy path", async () => {
  const context = await setupAibffGuiTest();

  try {
    // Step 1: Navigate to aibff GUI
    await context.page.goto(context.baseUrl);
    await context.page.waitForFunction(() => document.title === "aibff GUI", {
      timeout: 10000,
    });

    await context.takeScreenshot("pipeline-start");

    // Step 2: Set up system prompt
    // console.log("Setting up system prompt...");

    // Wait for System Prompt section to be visible and expanded
    await context.page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((btn) => btn.textContent?.includes("System Prompt"));
    }, { timeout: 15000 });

    // Click to expand System Prompt section if not already expanded
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const systemPromptBtn = buttons.find((btn) =>
        btn.textContent?.includes("System Prompt")
      );
      if (systemPromptBtn) systemPromptBtn.click();
    });
    await delay(500);

    // Set system prompt
    const systemPromptText =
      "You are a helpful assistant that provides clear, concise answers about science topics.";
    await context.page.waitForSelector(
      'textarea[placeholder*="You are a helpful assistant"]',
      {
        timeout: 10000,
      },
    );

    await context.page.click(
      'textarea[placeholder*="You are a helpful assistant"]',
    );
    await context.page.keyboard.down("Meta");
    await context.page.keyboard.press("a");
    await context.page.keyboard.up("Meta");
    await context.page.type(
      'textarea[placeholder*="You are a helpful assistant"]',
      systemPromptText,
    );

    await context.takeScreenshot("system-prompt-set");

    // Step 3: Run test conversation
    // console.log("Running test conversation...");

    // Find and click in the message input
    await context.page.waitForSelector(
      'textarea[placeholder*="Type your message"]',
      {
        timeout: 10000,
      },
    );

    const testMessage = "What is photosynthesis?";
    await context.page.click('textarea[placeholder*="Type your message"]');
    await context.page.type(
      'textarea[placeholder*="Type your message"]',
      testMessage,
    );

    // Send the message
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendBtn = buttons.find((btn) => btn.textContent?.includes("Send"));
      if (sendBtn) sendBtn.click();
    });

    // Wait for AI response to complete
    await delay(5000); // Give time for streaming response

    // Look for a response that contains scientific content
    await context.page.waitForFunction(() => {
      const messages = document.querySelectorAll('[class*="message"]');
      return messages.length >= 2; // User message + AI response
    }, { timeout: 15000 });

    await context.takeScreenshot("conversation-complete");

    // Step 4: Save the conversation result
    // console.log("Saving conversation result...");

    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const saveBtn = buttons.find((btn) =>
        btn.textContent?.includes("Save Result")
      );
      if (saveBtn) saveBtn.click();
    });
    await delay(1000); // Wait for save to complete

    await context.takeScreenshot("result-saved");

    // Step 5: Navigate to Calibration section
    // console.log("Navigating to calibration section...");

    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const calibrationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Calibration")
      );
      if (calibrationBtn) calibrationBtn.click();
    });
    await delay(500);

    // Make sure we're on the Saved Results tab
    await context.page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.some((btn) => btn.textContent?.includes("Saved Results"));
    }, { timeout: 5000 });

    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const savedResultsBtn = buttons.find((btn) =>
        btn.textContent?.includes("Saved Results")
      );
      if (savedResultsBtn) savedResultsBtn.click();
    });
    await delay(500);

    await context.takeScreenshot("calibration-saved-results");

    // Step 6: Verify saved result appears as a card
    // console.log("Verifying saved result card appears...");

    // Look for the calibration card with our test message
    await context.page.waitForFunction(() => {
      const cards = document.querySelectorAll(
        '[style*="backgroundColor"][style*="#2a2b2c"]',
      );
      return Array.from(cards).some((card) =>
        card.textContent?.includes("What is photosynthesis?")
      );
    }, { timeout: 10000 });

    // Step 7: Score the result with +2 (Good)
    // console.log("Scoring the result...");

    // Find and click the +2 score button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const plusTwoBtn = buttons.find((btn) => btn.textContent?.includes("+2"));
      if (plusTwoBtn) {
        plusTwoBtn.click();
      } else {
        throw new Error("No +2 score button found");
      }
    });
    await delay(2000); // Wait for scoring to complete and item to move

    await context.takeScreenshot("result-scored");

    // Step 8: Verify item moved to Ground Truth tab
    // console.log("Verifying item moved to Ground Truth...");

    // Click Ground Truth tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const groundTruthBtn = buttons.find((btn) =>
        btn.textContent?.includes("Ground Truth")
      );
      if (groundTruthBtn) groundTruthBtn.click();
    });
    await delay(500);

    // Verify the item appears in Ground Truth with score +2
    await context.page.waitForFunction(() => {
      const groundTruthCards = document.querySelectorAll(
        '[style*="backgroundColor"][style*="#2a2b2c"]',
      );
      return Array.from(groundTruthCards).some((card) =>
        card.textContent?.includes("What is photosynthesis?") &&
        card.textContent?.includes("+2")
      );
    }, { timeout: 10000 });

    await context.takeScreenshot("ground-truth-verified");

    // Step 9: Edit the score in Ground Truth
    // console.log("Testing score editing...");

    // Click Edit button
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const editBtn = buttons.find((btn) => btn.textContent?.includes("Edit"));
      if (editBtn) editBtn.click();
    });
    await delay(500);

    // Change score to +3
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const plusThreeBtn = buttons.find((btn) =>
        btn.textContent?.includes("+3")
      );
      if (plusThreeBtn) {
        plusThreeBtn.click();
      } else {
        throw new Error("No +3 button found in edit mode");
      }
    });
    await delay(1000);

    // Verify score changed to +3
    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("+3 - Excellent");
    }, { timeout: 5000 });

    await context.takeScreenshot("score-edited");

    // Step 10: Test removal (optional - comment out to preserve data)
    // console.log("Testing item removal...");

    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const removeBtn = buttons.find((btn) =>
        btn.textContent?.includes("Remove")
      );
      if (removeBtn) removeBtn.click();
    });
    await delay(1000);

    // Verify item was removed
    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("No ground truth examples yet");
    }, { timeout: 5000 });

    await context.takeScreenshot("item-removed");

    // Step 11: Verify Saved Results tab is now empty
    // console.log("Verifying Saved Results tab is empty...");

    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const savedResultsBtn = buttons.find((btn) =>
        btn.textContent?.includes("Saved Results")
      );
      if (savedResultsBtn) savedResultsBtn.click();
    });
    await delay(500);

    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("No saved results yet");
    }, { timeout: 5000 });

    await context.takeScreenshot("pipeline-complete");

    // console.log("✅ Calibration pipeline test completed successfully!");
  } catch (error) {
    await context.takeScreenshot("pipeline-error");
    // console.error("❌ Pipeline test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Calibration workflow with multiple results", async () => {
  const context = await setupAibffGuiTest();

  try {
    // Navigate to GUI
    await context.page.goto(context.baseUrl);
    await context.page.waitForFunction(() => document.title === "aibff GUI", {
      timeout: 10000,
    });

    // Set system prompt
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const systemPromptBtn = buttons.find((btn) =>
        btn.textContent?.includes("System Prompt")
      );
      if (systemPromptBtn) systemPromptBtn.click();
    });
    await delay(500);

    const systemPrompt = "You are an AI that answers questions about animals.";
    await context.page.waitForSelector(
      'textarea[placeholder*="You are a helpful assistant"]',
    );
    await context.page.click(
      'textarea[placeholder*="You are a helpful assistant"]',
    );
    await context.page.keyboard.down("Meta");
    await context.page.keyboard.press("a");
    await context.page.keyboard.up("Meta");
    await context.page.type(
      'textarea[placeholder*="You are a helpful assistant"]',
      systemPrompt,
    );

    // Create multiple test conversations
    const testQuestions = [
      "What do cats eat?",
      "How do birds fly?",
      "Where do fish live?",
    ];

    for (let i = 0; i < testQuestions.length; i++) {
      // console.log(`Creating conversation ${i + 1}...`);

      // Send message
      await context.page.click('textarea[placeholder*="Type your message"]');
      await context.page.keyboard.down("Meta");
      await context.page.keyboard.press("a");
      await context.page.keyboard.up("Meta");
      await context.page.type(
        'textarea[placeholder*="Type your message"]',
        testQuestions[i],
      );
      await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const sendBtn = buttons.find((btn) =>
          btn.textContent?.includes("Send")
        );
        if (sendBtn) sendBtn.click();
      });

      // Wait for response
      await delay(3000);

      // Save result
      await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const saveBtn = buttons.find((btn) =>
          btn.textContent?.includes("Save Result")
        );
        if (saveBtn) saveBtn.click();
      });
      await delay(1000);
    }

    // Go to calibration
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const calibrationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Calibration")
      );
      if (calibrationBtn) calibrationBtn.click();
    });
    await delay(500);

    // Verify we have 3 saved results
    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("Saved Results (3)");
    }, { timeout: 5000 });

    // Score them with different scores
    const scores = ["+3", "+1", "-2"];

    for (let i = 0; i < scores.length; i++) {
      // console.log(`Scoring result ${i + 1} with ${scores[i]}...`);

      await context.page.evaluate((score) => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const scoreBtn = buttons.find((btn) =>
          btn.textContent?.includes(score)
        );
        if (scoreBtn) scoreBtn.click();
      }, scores[i]);
      await delay(1500);
    }

    // Verify all moved to Ground Truth
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const groundTruthBtn = buttons.find((btn) =>
        btn.textContent?.includes("Ground Truth")
      );
      if (groundTruthBtn) groundTruthBtn.click();
    });
    await delay(500);

    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("Ground Truth (3)");
    }, { timeout: 5000 });

    // Verify Saved Results is now empty
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const savedResultsBtn = buttons.find((btn) =>
        btn.textContent?.includes("Saved Results")
      );
      if (savedResultsBtn) savedResultsBtn.click();
    });
    await delay(500);

    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("Saved Results (0)");
    }, { timeout: 5000 });

    await context.takeScreenshot("multiple-results-complete");

    // console.log("✅ Multiple results workflow test completed!");
  } finally {
    await teardownE2ETest(context);
  }
});
