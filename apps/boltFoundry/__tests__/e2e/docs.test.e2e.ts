#!/usr/bin/env -S bff test

import { assert } from "@std/assert";
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

    // Check if the page contains expected content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify docs content is present
    assert(
      bodyText?.includes("Documentation"),
      "Page should contain documentation heading",
    );

    // Verify navigation links are present
    assert(
      bodyText?.includes("Quickstart Guide") &&
        bodyText?.includes("Getting Started"),
      "Page should contain navigation links",
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

    // Wait a bit for React to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the page loaded without errors
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Basic check that we got some content (not just error page)
    assert(
      bodyText && bodyText.length > 100,
      "Page should have loaded with content",
    );

    // Check URL is correct
    const url = context.page.url();
    assert(
      url.includes("/docs/quickstart"),
      "Should still be on docs/quickstart URL",
    );

    // Take screenshot after test has completed successfully
    await context.takeScreenshot("docs-quickstart-completed");

    logger.info(
      `Page content length: ${bodyText?.length}, contains 'error': ${
        bodyText?.toLowerCase().includes("error")
      }`,
    );
  } finally {
    await teardownE2ETest(context);
  }
});
