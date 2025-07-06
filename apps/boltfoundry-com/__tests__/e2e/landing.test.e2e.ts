import {
  setupE2ETest,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { assertEquals } from "@std/assert";

Deno.test("boltfoundry-com landing page loads", async () => {
  const context = await setupE2ETest({
    server: "./build/boltfoundry-com",
  });

  try {
    const response = await context.page.goto(`${context.baseUrl}/`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Check that page loads with HTTP 200
    assertEquals(
      response?.status(),
      200,
      `Expected HTTP 200, got: ${response?.status()}`,
    );

    // Take a screenshot for debugging
    await context.takeScreenshot("landing-page-loaded");
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("boltfoundry-com health check works", async () => {
  const context = await setupE2ETest({
    server: "./build/boltfoundry-com",
  });

  try {
    const response = await context.page.goto(`${context.baseUrl}/health`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Check that health endpoint returns HTTP 200
    assertEquals(
      response?.status(),
      200,
      `Expected HTTP 200, got: ${response?.status()}`,
    );

    // Should show "OK" text from our app-server
    const bodyText = await context.page.$eval("body", (el) => el.textContent);
    assertEquals(
      bodyText?.trim(),
      "OK",
      `Expected health check to return 'OK', got: ${bodyText}`,
    );
  } finally {
    await teardownE2ETest(context);
  }
});
