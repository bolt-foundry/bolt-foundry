import { assert, assertEquals } from "@std/assert";
import {
  navigateTo,
  teardownE2ETest,
} from "@bfmono/infra/testing/e2e/setup.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { setupBoltFoundryComTest } from "../helpers.ts";

const logger = getLogger(import.meta);

Deno.test("Isograph entrypoint renders with real GraphQL data", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Navigate to the home page
    await navigateTo(context, "/");

    // Wait for page to load and hydrate
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check that the page loaded correctly
    const title = await context.page.title();
    assertEquals(title, "Bolt Foundry", "Page title should be 'Bolt Foundry'");

    // Get the page content
    const bodyText = await context.page.evaluate(() =>
      document.body.textContent
    );

    // Verify basic page structure is present
    assert(
      bodyText?.includes("Bolt Foundry"),
      "Page should contain 'Bolt Foundry' heading",
    );

    assert(
      bodyText?.includes("Coming Soon"),
      "Page should contain 'Coming Soon' text",
    );

    // Verify Isograph component section exists
    assert(
      bodyText?.includes("Hello from Isograph!"),
      "Page should contain 'Hello from Isograph!' heading from Isograph component",
    );

    // These assertions should FAIL initially because we're using fake network requests
    // Once we fix the network requests, these should pass
    assert(
      bodyText?.includes("Message: Hello from GraphQL!"),
      "Isograph component should display real GraphQL message data",
    );

    assert(
      bodyText?.includes("Timestamp: 2025-"),
      "Isograph component should display real GraphQL timestamp data",
    );

    // Verify we're NOT seeing the fake network indicator
    assert(
      !bodyText?.includes("Message: No message"),
      "Should not show 'No message' when GraphQL is working",
    );

    assert(
      !bodyText?.includes("Timestamp: No timestamp"),
      "Should not show 'No timestamp' when GraphQL is working",
    );

    // Test GraphQL endpoint directly to ensure it's working
    const graphqlResponse = await context.page.evaluate(async () => {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              hello {
                message
                timestamp
              }
            }
          `,
        }),
      });
      return await response.json();
    });

    // Verify GraphQL endpoint returns expected data
    assert(
      graphqlResponse?.data?.hello?.message === "Hello from GraphQL!",
      "GraphQL endpoint should return correct message",
    );

    assert(
      graphqlResponse?.data?.hello?.timestamp,
      "GraphQL endpoint should return timestamp",
    );

    logger.info("Isograph integration test completed successfully");
  } catch (error) {
    await context.takeScreenshot("isograph-integration-test-error");
    logger.error("Isograph integration test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});

Deno.test("Isograph component network requests work correctly", async () => {
  const context = await setupBoltFoundryComTest();

  try {
    // Navigate to the home page
    await navigateTo(context, "/");

    // Wait for page to load and hydrate
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Monitor network requests to ensure Isograph is making real GraphQL calls
    const networkRequests = await context.page.evaluate(() => {
      const requests: Array<{ url: string; method: string }> = [];

      // Override fetch to track requests
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (
        url: string | Request,
        options?: RequestInit,
      ) => {
        const urlString = typeof url === "string" ? url : url.url;
        const method = options?.method || "GET";
        requests.push({ url: urlString, method });
        return originalFetch(url, options);
      };

      // Trigger a re-render or component update if possible
      // This should cause Isograph to make a GraphQL request
      return new Promise((resolve) => {
        // Wait a bit for any async operations
        setTimeout(() => {
          resolve(requests);
        }, 1000);
      });
    });

    // Verify that GraphQL requests were made
    const graphqlRequests = networkRequests.filter((req: any) =>
      req.url.includes("/graphql") && req.method === "POST"
    );

    assert(
      graphqlRequests.length > 0,
      "Isograph should make GraphQL POST requests to /graphql endpoint",
    );

    logger.info("Isograph network requests test completed successfully");
  } catch (error) {
    await context.takeScreenshot("isograph-network-test-error");
    logger.error("Isograph network test failed:", error);
    throw error;
  } finally {
    await teardownE2ETest(context);
  }
});
