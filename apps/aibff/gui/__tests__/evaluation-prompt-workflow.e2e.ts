#!/usr/bin/env -S deno test -A

/**
 * E2E test for evaluation prompt workflow using deck grader format
 *
 * Tests the full evaluation workflow:
 * 1. Set system prompt and create test conversations
 * 2. Score results to create ground truth data
 * 3. Create evaluation prompt using deck grader format
 * 4. Verify integration between ground truth and evaluation prompt
 * 5. Test evaluation prompt validation and formatting
 */

import { delay } from "@std/async";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);
import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";

const SAMPLE_GRADER_DECK = `# Content Quality Grader

![grader base deck](../../grader-base/grader-base.deck.md)

## Specific Task

You are evaluating whether AI assistant responses provide accurate, helpful, and well-structured information on the given topic.

## Scoring Guide

- **+3 (Excellent)**: Completely accurate, comprehensive, well-structured with clear explanations
- **+2 (Good)**: Accurate with good detail, minor gaps in explanation
- **+1 (Adequate)**: Mostly accurate, basic level of detail, acceptable structure
- **0 (Invalid/Ungradeable)**: Cannot determine quality due to invalid input or unclear context
- **-1 (Poor)**: Minor inaccuracies, lacks detail, poor structure
- **-2 (Very Poor)**: Significant inaccuracies, confusing or misleading
- **-3 (Terrible)**: Completely wrong, harmful, or opposite of helpful

## Context

Focus on evaluating factual accuracy, clarity of explanation, and usefulness to the user.

![ground truth samples](./ground-truth-samples.deck.toml)`;

Deno.test("Evaluation prompt workflow with deck grader format", async () => {
  const context = await setupE2ETest({
    baseUrl: "http://localhost:3001",
  });

  try {
    // Step 1: Navigate to aibff GUI
    await context.page.goto(context.baseUrl);
    await context.page.waitForFunction(() => document.title === "aibff GUI", {
      timeout: 10000,
    });

    await context.takeScreenshot("eval-workflow-start");

    // Step 2: Set up system prompt and create test data
    logger.debug("Setting up system prompt and test data...");

    // Expand System Prompt section
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
      "You are an educational assistant that explains scientific concepts clearly and accurately.";
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
      systemPromptText,
    );

    // Step 3: Create multiple test conversations for evaluation
    logger.debug("Creating test conversations...");

    const testQuestions = [
      "Explain how photosynthesis works",
      "What causes earthquakes?",
      "How do vaccines work?",
    ];

    for (let i = 0; i < testQuestions.length; i++) {
      logger.debug(`Creating conversation ${i + 1}: ${testQuestions[i]}`);

      // Send message
      await context.page.click('textarea[placeholder*="Type your message"]');
      await context.page.keyboard.down("Meta");
      await context.page.keyboard.press("a");
      await context.page.keyboard.up("Meta");
      await context.page.type(
        'textarea[placeholder*="Type your message"]',
        testQuestions[i],
      );

      // Send the message
      await context.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const sendBtn = buttons.find((btn) =>
          btn.textContent?.includes("Send")
        );
        if (sendBtn) sendBtn.click();
      });

      // Wait for AI response
      await delay(4000);

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

    await context.takeScreenshot("test-conversations-created");

    // Step 4: Score results to create ground truth data
    logger.debug("Creating ground truth data...");

    // Navigate to Calibration section
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const calibrationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Calibration")
      );
      if (calibrationBtn) calibrationBtn.click();
    });
    await delay(500);

    // Ensure we're on Saved Results tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const savedResultsBtn = buttons.find((btn) =>
        btn.textContent?.includes("Saved Results")
      );
      if (savedResultsBtn) savedResultsBtn.click();
    });
    await delay(500);

    // Verify we have 3 saved results
    await context.page.waitForFunction(() => {
      const content = document.body.textContent || "";
      return content.includes("Saved Results (3)");
    }, { timeout: 10000 });

    // Score the results with different scores
    const scores = ["+3", "+2", "+1"];

    for (let i = 0; i < scores.length; i++) {
      logger.debug(`Scoring result ${i + 1} with ${scores[i]}...`);

      await context.page.evaluate((score) => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const scoreBtn = buttons.find((btn) =>
          btn.textContent?.includes(score)
        );
        if (scoreBtn) scoreBtn.click();
      }, scores[i]);
      await delay(2000);
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

    await context.takeScreenshot("ground-truth-created");

    // Step 5: Create evaluation prompt using deck grader format
    logger.debug("Creating evaluation prompt with deck grader format...");

    // Navigate to Evaluation section
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const evaluationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Evaluation")
      );
      if (evaluationBtn) evaluationBtn.click();
    });
    await delay(500);

    // Ensure we're on Eval Prompt tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const evalPromptBtn = buttons.find((btn) =>
        btn.textContent?.includes("Eval Prompt")
      );
      if (evalPromptBtn) evalPromptBtn.click();
    });
    await delay(500);

    // Find and populate the evaluation prompt textarea
    await context.page.waitForSelector(
      'textarea[placeholder*="Evaluation prompt"]',
    );

    await context.page.click('textarea[placeholder*="Evaluation prompt"]');
    await context.page.keyboard.down("Meta");
    await context.page.keyboard.press("a");
    await context.page.keyboard.up("Meta");
    await context.page.type(
      'textarea[placeholder*="Evaluation prompt"]',
      SAMPLE_GRADER_DECK,
    );

    await context.takeScreenshot("eval-prompt-created");

    // Step 6: Verify the evaluation prompt is properly formatted
    logger.debug("Verifying evaluation prompt formatting...");

    // Check that the deck format is preserved
    await context.page.waitForFunction(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const evalTextarea = textareas.find((ta) =>
        ta.placeholder?.includes("Evaluation prompt")
      );
      if (!evalTextarea) return false;

      const value = (evalTextarea as HTMLTextAreaElement).value;
      return value.includes("# Content Quality Grader") &&
        value.includes("![grader base deck]") &&
        value.includes("## Scoring Guide") &&
        value.includes("+3 (Excellent)") &&
        value.includes("![ground truth samples]");
    }, { timeout: 5000 });

    // Step 7: Test switching between Eval Prompt and Run Eval tabs
    logger.debug("Testing evaluation tab navigation...");

    // Switch to Run Eval tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const runEvalBtn = buttons.find((btn) =>
        btn.textContent?.includes("Run Eval")
      );
      if (runEvalBtn) runEvalBtn.click();
    });
    await delay(500);

    // Verify Run Eval tab is active
    await context.page.waitForSelector(
      'textarea[placeholder*="Evaluation execution"]',
    );

    // Switch back to Eval Prompt tab
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const evalPromptBtn = buttons.find((btn) =>
        btn.textContent?.includes("Eval Prompt")
      );
      if (evalPromptBtn) evalPromptBtn.click();
    });
    await delay(500);

    // Verify our evaluation prompt is still there
    await context.page.waitForFunction(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const evalTextarea = textareas.find((ta) =>
        ta.placeholder?.includes("Evaluation prompt")
      );
      if (!evalTextarea) return false;

      const value = (evalTextarea as HTMLTextAreaElement).value;
      return value.includes("# Content Quality Grader");
    }, { timeout: 5000 });

    await context.takeScreenshot("eval-tab-navigation-complete");

    // Step 8: Verify data persistence by refreshing the page
    logger.debug("Testing data persistence...");

    // Refresh the page
    await context.page.reload();
    await context.page.waitForFunction(() => document.title === "aibff GUI", {
      timeout: 10000,
    });

    // Navigate back to evaluation section
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const evaluationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Evaluation")
      );
      if (evaluationBtn) evaluationBtn.click();
    });
    await delay(500);

    // Verify evaluation prompt was persisted
    await context.page.waitForFunction(() => {
      const textareas = Array.from(document.querySelectorAll("textarea"));
      const evalTextarea = textareas.find((ta) =>
        ta.placeholder?.includes("Evaluation prompt")
      );
      if (!evalTextarea) return false;

      const value = (evalTextarea as HTMLTextAreaElement).value;
      return value.includes("# Content Quality Grader") &&
        value.includes("![grader base deck]");
    }, { timeout: 10000 });

    // Also verify ground truth data is still there
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const calibrationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Calibration")
      );
      if (calibrationBtn) calibrationBtn.click();
    });
    await delay(500);

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

    await context.takeScreenshot("data-persistence-verified");

    logger.debug("✅ Evaluation prompt workflow test completed successfully!");
  } catch (error) {
    await context.takeScreenshot("eval-workflow-error");
    logger.error("❌ Evaluation workflow test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Evaluation prompt format validation", async () => {
  const context = await setupE2ETest({
    baseUrl: "http://localhost:3001",
  });

  try {
    await context.page.goto(context.baseUrl);
    await context.page.waitForFunction(() => document.title === "aibff GUI", {
      timeout: 10000,
    });

    // Navigate to Evaluation section
    await context.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const evaluationBtn = buttons.find((btn) =>
        btn.textContent?.includes("Evaluation")
      );
      if (evaluationBtn) evaluationBtn.click();
    });
    await delay(500);

    // Test various deck formats
    const testFormats = [
      {
        name: "Basic grader deck",
        content: `# Simple Grader

![grader base deck](../../grader-base/grader-base.deck.md)

## Task
Evaluate responses for clarity.

## Scoring
- +3: Very clear
- -3: Very unclear`,
      },
      {
        name: "Grader with context variables",
        content: `# Advanced Grader

![grader base deck](../../grader-base/grader-base.deck.md)

## Task
Evaluate technical accuracy.

![context variables](./context.deck.toml)`,
      },
      {
        name: "Grader with samples",
        content: `# Sample-based Grader

![grader base deck](../../grader-base/grader-base.deck.md)

## Task
Evaluate based on examples.

![ground truth samples](./samples.deck.toml)`,
      },
    ];

    for (const testFormat of testFormats) {
      logger.debug(`Testing format: ${testFormat.name}`);

      // Clear and set new content
      await context.page.click('textarea[placeholder*="Evaluation prompt"]');
      await context.page.keyboard.down("Meta");
      await context.page.keyboard.press("a");
      await context.page.keyboard.up("Meta");
      await context.page.type(
        'textarea[placeholder*="Evaluation prompt"]',
        testFormat.content,
      );

      // Wait for auto-save
      await delay(1000);

      // Verify content is preserved
      await context.page.waitForFunction(
        (content) => {
          const textareas = Array.from(document.querySelectorAll("textarea"));
          const evalTextarea = textareas.find((ta) =>
            ta.placeholder?.includes("Evaluation prompt")
          );
          if (!evalTextarea) return false;

          const value = (evalTextarea as HTMLTextAreaElement).value;
          return value.includes(content);
        },
        { timeout: 5000 },
        testFormat.content.split("\n")[0],
      ); // Check first line
    }

    await context.takeScreenshot("format-validation-complete");

    logger.debug("✅ Format validation test completed successfully!");
  } catch (error) {
    await context.takeScreenshot("format-validation-error");
    logger.error("❌ Format validation test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
