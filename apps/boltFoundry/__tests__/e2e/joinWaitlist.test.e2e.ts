#! /usr/bin/env -S bff e2e

import {
  type E2ETestContext,
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

// End‑to‑end test: verifies that a visitor can successfully submit the
// "Join the waitlist" form on the home page.
// Steps
// 1. Navigate to "/"
// 2. Scroll to the waitlist form section
// 3. Fill out the form inputs (name, email, company)
// 4. Submit the form
// 5. Confirm that the form is replaced with a success message
// 6. Take screenshots along the way for debugging / visual regression

const logger = getLogger(import.meta);

// Flaky b/c it depends on an external service (waitlist API)
Deno.test.ignore("User can join the waitlist successfully", async () => {
  const context = await setupE2ETest();
  const maxRetries = 3;
  let lastError: Error | null = null;

  // Retry logic for handling external API failures
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(
        `Attempting waitlist test (attempt ${attempt}/${maxRetries})`,
      );
      await runWaitlistTest(context);
      await teardownE2ETest(context);
      return; // Success, exit test
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Waitlist test attempt ${attempt} failed`, error);

      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        const retryDelay = 1000 * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  // All retries failed
  await teardownE2ETest(context);
  throw new Error(
    `Waitlist test failed after ${maxRetries} attempts: ${lastError?.message}`,
  );
});

async function runWaitlistTest(context: E2ETestContext) {
  try {
    // 1️⃣  Navigate to the home page
    await navigateTo(context, "/");
    await context.takeScreenshot("waitlist‑home‑initial");

    // 2️⃣  Wait for and scroll to the waitlist form with retry logic
    const formSelector = '[data-testid="waitlist-form"]';

    // Increase timeout and add state check
    await context.page.waitForSelector(formSelector, {
      timeout: 30_000,
      visible: true,
    });

    // Wait for form to be fully interactive
    await context.page.waitForFunction(
      (selector) => {
        const form = document.querySelector(selector);
        const nameInput = document.querySelector("#cfDsFormInput-name");
        const emailInput = document.querySelector("#cfDsFormInput-email");
        const submitButton = document.querySelector(
          "[data-cf-testid='waitlist-submit']",
        );
        return form && nameInput && emailInput && submitButton &&
          !(submitButton as HTMLButtonElement).disabled;
      },
      { timeout: 20_000 },
      formSelector,
    );

    await context.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, formSelector);

    // Add a small delay after scrolling to ensure form is stable
    await new Promise((resolve) => setTimeout(resolve, 500));
    await context.takeScreenshot("waitlist‑form‑visible");

    // 3️⃣  Fill the form fields with test data (use dry run email format)
    // Clear fields first and type with delay to ensure proper input
    const nameInput = "#cfDsFormInput-name";
    const emailInput = "#cfDsFormInput-email";
    const companyInput = "#cfDsFormInput-company";

    await context.page.click(nameInput);
    await context.page.evaluate(
      (selector) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) input.value = "";
      },
      nameInput,
    );
    await context.page.type(nameInput, "Test User", { delay: 50 });

    await context.page.click(emailInput);
    await context.page.evaluate(
      (selector) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) input.value = "";
      },
      emailInput,
    );
    await context.page.type(emailInput, "test.dryrun@example.com", {
      delay: 50,
    });

    await context.page.click(companyInput);
    await context.page.evaluate(
      (selector) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) input.value = "";
      },
      companyInput,
    );
    await context.page.type(companyInput, "Bolt Foundry", { delay: 50 });

    await context.takeScreenshot("waitlist‑form‑filled");

    // 4️⃣  Submit the form via the submit button
    const submitSelector = "[data-cf-testid='waitlist-submit']";

    // Ensure submit button is enabled before clicking
    await context.page.waitForFunction(
      (selector) => {
        const btn = document.querySelector(selector);
        return btn && !(btn as HTMLButtonElement).disabled;
      },
      { timeout: 10_000 },
      submitSelector,
    );

    await context.page.click(submitSelector);

    // 5️⃣  Wait for the success message (form should be replaced)
    // The form should disappear and be replaced with a thank you message
    await context.page.waitForSelector(formSelector, {
      hidden: true,
      timeout: 30_000,
    });

    // Look for the success message text with increased timeout
    await context.page.waitForFunction(
      () =>
        document.body.textContent?.includes("Thanks for joining the waitlist!"),
      { timeout: 30_000 },
    );

    await context.takeScreenshot("waitlist‑success");
    logger.info("Join waitlist flow completed successfully");
  } catch (error) {
    // Enhanced error debugging
    await context.takeScreenshot("waitlist‑error");

    // Log current page content for debugging
    const pageContent = await context.page.evaluate(() => {
      return {
        url: globalThis.location.href,
        title: document.title,
        bodyText: document.body.innerText.substring(0, 500),
        formVisible: !!document.querySelector('[data-testid="waitlist-form"]'),
        submitButtonState: (() => {
          const btn = document.querySelector(
            "[data-cf-testid='waitlist-submit']",
          );
          return btn ? { disabled: (btn as HTMLButtonElement).disabled, text: btn.textContent } : null;
        })(),
        errorMessages: Array.from(
          document.querySelectorAll('.error, [class*="error"]'),
        ).map((el) => el.textContent),
      };
    });

    logger.error("Join waitlist e2e test failed", {
      error: error instanceof Error ? error.message : String(error),
      pageState: pageContent,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}
