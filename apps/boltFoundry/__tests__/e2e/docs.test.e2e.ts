#!/usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  setupE2ETest,
  teardownE2ETest,
} from "infra/testing/e2e/setup.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("renders documentation at /docs route", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to the docs page
    await navigateTo(context, "/docs");

    // Take screenshot after initial page load
    await context.takeScreenshot("docs-page-initial");

    // Wait for content to ensure page loaded
    const title = await context.page.title();
    logger.info(`Page title: ${title}`);

    // Check if the page contains expected content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Basic assertion to verify the page loaded successfully
    assertEquals(
      typeof bodyText,
      "string",
      "Page body should contain text",
    );

    // Additional assertion that some content exists
    assertEquals(
      bodyText && bodyText.length > 0,
      true,
      "Page body should not be empty",
    );

    // Verify we're on the docs page (not a 404 or error)
    const url = context.page.url();
    assert(
      url.includes("/docs"),
      "Should be on the docs route"
    );
    
    // Verify docs content is present (this should fail with 404)
    assert(
      bodyText?.includes("Documentation") || bodyText?.includes("Docs"),
      "Page should contain documentation content"
    );

    // Take screenshot after test has completed successfully
    await context.takeScreenshot("docs-page-completed");
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("renders specific documentation page at /docs/quickstart", async () => {
  const context = await setupE2ETest({ headless: true });

  try {
    // Navigate to a specific doc page
    await navigateTo(context, "/docs/quickstart");

    // Take screenshot after initial page load
    await context.takeScreenshot("docs-quickstart-initial");

    // Check if the page loaded without errors
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify content loaded
    assertEquals(
      typeof bodyText,
      "string",
      "Page body should contain text",
    );

    // Verify we're on the correct subpage
    const url = context.page.url();
    assert(
      url.includes("/docs/quickstart"),
      "Should be on the docs/quickstart route"
    );
    
    // Verify quickstart content is present (this should fail with 404)
    assert(
      bodyText?.toLowerCase().includes("quickstart"),
      "Page should contain quickstart content"
    );

    // Take screenshot after test has completed successfully
    await context.takeScreenshot("docs-quickstart-completed");
  } finally {
    await teardownE2ETest(context);
  }
});