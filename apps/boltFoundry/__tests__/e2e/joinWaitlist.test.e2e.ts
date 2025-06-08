#! /usr/bin/env -S bff e2e

import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

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
Deno.test("User can join the waitlist successfully", async () => {
  const context = await setupE2ETest();

  try {
    // 1️⃣  Navigate to the home page
    await navigateTo(context, "/");
    await context.takeScreenshot("waitlist‑home‑initial");

    // 2️⃣  Wait for and scroll to the waitlist form
    const formSelector = '[data-testid="waitlist-form"]';
    await context.page.waitForSelector(formSelector, { timeout: 10_000 });
    await context.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, formSelector);
    await context.takeScreenshot("waitlist‑form‑visible");

    // 3️⃣  Fill the form fields with test data (use dry run email format)
    await context.page.type("#bfDsFormInput-name", "Test User");
    await context.page.type("#bfDsFormInput-email", "test.dryrun@example.com");
    await context.page.type("#bfDsFormInput-company", "Bolt Foundry");
    await context.takeScreenshot("waitlist‑form‑filled");

    // 4️⃣  Submit the form via the submit button
    const submitSelector = "[data-bf-testid='waitlist-submit']";
    await context.page.click(submitSelector);

    // 5️⃣  Wait for the success message (form should be replaced)
    // The form should disappear and be replaced with a thank you message
    await context.page.waitForSelector(formSelector, {
      hidden: true,
      timeout: 10_000,
    });

    // Look for the success message text
    await context.page.waitForFunction(
      () =>
        document.body.textContent?.includes("Thanks for joining the waitlist!"),
      { timeout: 10_000 },
    );

    await context.takeScreenshot("waitlist‑success");
    logger.info("Join waitlist flow completed successfully");
  } catch (error) {
    await context.takeScreenshot("waitlist‑error");
    logger.error("Join waitlist e2e test failed", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
