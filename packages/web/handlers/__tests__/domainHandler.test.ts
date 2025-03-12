import { assertEquals } from "@std/assert";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";

// Setup function to create test environment
function setupTest() {
  const originalEnv = Deno.env.get("SERVE_PROJECT");

  // Mock routes for testing
  const mockRoutes = new Map();

  // Create a mock handler for the biglittletech.ai route
  const mockHandler = () =>
    new Response("biglittletech.ai response", { status: 200 });
  mockRoutes.set("/biglittletech.ai", mockHandler);

  return { originalEnv, mockRoutes };
}

// Cleanup function to restore environment
function cleanupTest(originalEnv: string | undefined) {
  // Restore the original environment variable if it existed
  if (originalEnv !== undefined) {
    Deno.env.set("SERVE_PROJECT", originalEnv);
  } else {
    Deno.env.delete("SERVE_PROJECT");
  }
}

Deno.test("handleDomains - should return null for non-matching domains", async () => {
  const { originalEnv, mockRoutes } = setupTest();

  try {
    // Create a test request with a non-matching domain
    const req = new Request("https://example.com/some-path");

    // Call the function
    const result = await handleDomains(req, mockRoutes);

    // Check that no response was returned (null)
    assertEquals(result, null);
  } finally {
    cleanupTest(originalEnv);
  }
});

Deno.test("handleDomains - should handle biglittletech.ai domain from hostname", async () => {
  const { originalEnv, mockRoutes } = setupTest();

  try {
    // Create a test request with the biglittletech.ai domain
    const req = new Request("https://biglittletech.ai/some-path");

    // Call the function
    const result = await handleDomains(req, mockRoutes);

    // Check that the route was matched and the correct response was returned
    assertEquals(await result?.text(), "biglittletech.ai response");
    assertEquals(result?.status, 200);
  } finally {
    cleanupTest(originalEnv);
  }
});

Deno.test("handleDomains - should handle biglittletech.ai domain from SERVE_PROJECT env var", async () => {
  const { originalEnv, mockRoutes } = setupTest();

  try {
    // Set the SERVE_PROJECT environment variable to biglittletech.ai
    Deno.env.set("SERVE_PROJECT", "biglittletech.ai");

    // Create a test request with any domain (should use SERVE_PROJECT)
    const req = new Request("https://example.com/some-path");

    // Call the function
    const result = await handleDomains(req, mockRoutes);

    // Check that the route was matched and the correct response was returned
    assertEquals(await result?.text(), "biglittletech.ai response");
    assertEquals(result?.status, 200);
  } finally {
    cleanupTest(originalEnv);
  }
});

Deno.test("handleDomains - should handle domain with missing route and return 404", async () => {
  const { originalEnv } = setupTest();

  try {
    // Create a new map without the biglittletech.ai route to test 404 case
    const emptyRoutes = new Map();

    // Create a test request with the biglittletech.ai domain
    const req = new Request("https://biglittletech.ai/some-path");

    // Call the function with empty routes
    const result = await handleDomains(req, emptyRoutes);

    // Check that a 404 response was returned
    assertEquals(await result?.text(), "Not found™");
    assertEquals(result?.status, 404);
  } finally {
    cleanupTest(originalEnv);
  }
});
