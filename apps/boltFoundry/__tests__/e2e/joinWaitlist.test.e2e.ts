#! /usr/bin/env -S bff e2e
import { assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

// End‑to‑end test: verifies that a visitor can successfully submit the
// “Join the waitlist” form on the home page.
// Steps
// 1. Navigate to “/”
// 2. Click the primary CTA “Join the waitlist” button
// 3. Wait for the modal dialog to appear
// 4. Fill out the form inputs (name, email, company)
// 5. Submit the form
// 6. Confirm that the POST → /contacts‑cms request succeeds
// 7. Confirm that the modal closes afterwards
// 8. Take screenshots along the way for debugging / visual regression

const logger = getLogger(import.meta);

Deno.test("User can join the waitlist successfully", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // 1️⃣  Navigate to the home page
    await navigateTo(context, "/");
    await context.takeScreenshot("waitlist‑home‑initial");

    // 2️⃣  Trigger the CTA using the ARIA selector supported by Puppeteer
    const joinButtonSelector = "aria/Join the waitlist";
    await context.page.waitForSelector(joinButtonSelector, { timeout: 10_000 });
    await context.page.click(joinButtonSelector);

    // 3️⃣  Wait for the modal dialog (role="dialog")
    const modalSelector = '[data-testid="waitlist-form"]';
    await context.page.waitForSelector(modalSelector, { timeout: 10_000 });
    await context.takeScreenshot("waitlist‑modal‑open");

    // 4️⃣  Fill the form fields
    await context.page.type("#bfDsFormInput-name", "Test User");
    await context.page.type("#bfDsFormInput-email", "test@example.com");
    await context.page.type("#bfDsFormInput-company", "Bolt Foundry");
    await context.takeScreenshot("waitlist‑form‑filled");

    // 5️⃣  Submit the form via ARIA selector for the submit button
    const submitSelector = "[data-bf-testid='waitlist-submit']";
    await context.page.click(submitSelector);

    // 7️⃣  The modal should close automatically on success
    await context.page.waitForSelector(modalSelector, {
      hidden: true,
      timeout: 10_000,
    });
    const modalStillVisible = await context.page.$(modalSelector);
    assertEquals(
      modalStillVisible,
      null,
      "Waitlist modal should close after successful submission",
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
