#!/usr/bin/env -S bft test

/**
 * Tests for lazy deck creation feature in readLocalDeck function
 *
 * These tests verify the SDK metadata collection implementation
 * specifically for checking and creating decks via the Bolt Foundry API.
 */

import { assertEquals, assertExists } from "@std/assert";
import { clearDeckCache, readLocalDeck } from "@bfmono/bolt-foundry/deck.ts";

/**
 * Test utilities
 */
async function createTempDeckFile(
  content: string,
  filename = "test.deck.md",
): Promise<string> {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/${filename}`;
  await Deno.writeTextFile(deckPath, content);
  return deckPath;
}

async function cleanup(path: string): Promise<void> {
  try {
    const dir = path.substring(0, path.lastIndexOf("/"));
    await Deno.remove(dir, { recursive: true });
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Mock fetch setup
 */
const originalFetch = globalThis.fetch;
let fetchCalls: Array<{ url: string; options?: RequestInit }> = [];

interface MockResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

function setupMockFetch(responses: Map<string | RegExp, MockResponse>) {
  fetchCalls = [];
  clearDeckCache(); // Clear cache on each test setup

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const method = init?.method || "GET";
    const key = `${method}:${url}`;

    fetchCalls.push({ url: key, options: init });

    // Check exact matches first
    let response = responses.get(key) || responses.get(url);

    // If no exact match, check regex patterns
    if (!response) {
      for (const [pattern, resp] of responses.entries()) {
        if (pattern instanceof RegExp && pattern.test(key)) {
          response = resp;
          break;
        }
        if (typeof pattern === "string" && key.includes(pattern)) {
          response = resp;
          break;
        }
      }
    }

    if (response) {
      return new Response(
        response.body ? JSON.stringify(response.body) : null,
        {
          status: response.status,
          headers: response.headers,
        },
      );
    }

    return new Response("Not found", { status: 404 });
  };
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
  fetchCalls = [];
}

/**
 * Helper to create deck content with embeds
 */
function createDeckWithEmbeds(_tempDir: string): {
  deckContent: string;
  embedContent: string;
  expectedProcessedContent: string;
} {
  const embedContent = `## Embedded Behavior

Always be helpful and professional.`;

  const deckContent = `# Test Deck

![behavior](./behavior.md)

Main deck content.`;

  const expectedProcessedContent = `# Test Deck

## Embedded Behavior

Always be helpful and professional.

Main deck content.`;

  return { deckContent, embedContent, expectedProcessedContent };
}

/**
 * Test 1: Deck existence check - Mock API to return 404, verify deck creation call
 */
Deno.test("readLocalDeck - creates deck when API returns 404", async () => {
  const content = `# Invoice Extraction Deck

Extract invoice data with high accuracy.`;

  const deckPath = await createTempDeckFile(content, "invoice.deck.md");

  try {
    // Set up environment and mocks
    Deno.env.set("BF_API_KEY", "test-api-key");
    Deno.env.set("BF_API_ENDPOINT", "https://boltfoundry.com/api");

    const responses = new Map<string, MockResponse>([
      ["GET:https://boltfoundry.com/api/decks/invoice", { status: 404 }],
      ["POST:https://boltfoundry.com/api/decks", {
        status: 201,
        body: { id: "invoice" },
      }],
    ]);

    setupMockFetch(responses);

    // Execute
    const deck = await readLocalDeck(deckPath);

    // Verify deck was created successfully
    assertEquals(deck.deckId, "invoice");
    assertEquals(deck.markdownContent, content);

    // Verify API calls
    const getCall = fetchCalls.find((call) =>
      call.url === "GET:https://boltfoundry.com/api/decks/invoice"
    );
    assertExists(getCall);
    assertEquals(getCall.options?.headers?.["x-bf-api-key"], "test-api-key");

    const postCall = fetchCalls.find((call) =>
      call.url === "POST:https://boltfoundry.com/api/decks"
    );
    assertExists(postCall);
    assertEquals(postCall.options?.method, "POST");
    assertEquals(postCall.options?.headers?.["x-bf-api-key"], "test-api-key");
    assertEquals(
      postCall.options?.headers?.["Content-Type"],
      "application/json",
    );

    // Verify POST body
    const postBody = JSON.parse(postCall.options?.body as string);
    assertEquals(postBody.id, "invoice");
    assertEquals(postBody.content, content);
    assertEquals(postBody.processedContent, content); // No embeds, so same as content
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    Deno.env.delete("BF_API_ENDPOINT");
    await cleanup(deckPath);
  }
});

/**
 * Test 2: Deck already exists - Mock API to return 200, verify no creation call
 */
Deno.test("readLocalDeck - skips creation when deck already exists", async () => {
  const content = `# Customer Service Deck

Help customers effectively.`;

  const deckPath = await createTempDeckFile(
    content,
    "customer-service.deck.md",
  );

  try {
    Deno.env.set("BF_API_KEY", "test-api-key");

    const responses = new Map<string, MockResponse>([
      ["GET:https://boltfoundry.com/api/decks/customer-service", {
        status: 200,
        body: { id: "customer-service", content: content },
      }],
    ]);

    setupMockFetch(responses);

    // Execute
    const deck = await readLocalDeck(deckPath);

    // Verify deck loaded successfully
    assertEquals(deck.deckId, "customer-service");

    // Verify only GET call was made, no POST
    const getCalls = fetchCalls.filter((call) => call.url.includes("GET:"));
    assertEquals(getCalls.length, 1);

    const postCalls = fetchCalls.filter((call) => call.url.includes("POST:"));
    assertEquals(postCalls.length, 0);
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    await cleanup(deckPath);
  }
});

/**
 * Test 3: Cache behavior - Load same deck twice, verify only one API check
 */
Deno.test("readLocalDeck - caches deck existence to avoid repeated API calls", async () => {
  const content = `# Analytics Deck

Analyze user behavior patterns.`;

  const deckPath = await createTempDeckFile(content, "analytics.deck.md");

  try {
    Deno.env.set("BF_API_KEY", "test-api-key");

    const responses = new Map<string, MockResponse>([
      ["GET:https://boltfoundry.com/api/decks/analytics", { status: 200 }],
    ]);

    setupMockFetch(responses);

    // First load
    const deck1 = await readLocalDeck(deckPath);
    assertEquals(deck1.deckId, "analytics");

    // Count API calls after first load
    const firstLoadCalls = fetchCalls.length;
    assertEquals(firstLoadCalls, 1);

    // Second load - should use cache
    const deck2 = await readLocalDeck(deckPath);
    assertEquals(deck2.deckId, "analytics");

    // Verify no additional API calls were made
    assertEquals(fetchCalls.length, firstLoadCalls);
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    await cleanup(deckPath);
  }
});

/**
 * Test 4: Deck creation failure - Mock API error, verify graceful handling
 */
Deno.test("readLocalDeck - handles API errors gracefully", async () => {
  const content = `# Error Test Deck

This deck will fail to create in the API.`;

  const deckPath = await createTempDeckFile(content, "error-test.deck.md");

  try {
    Deno.env.set("BF_API_KEY", "test-api-key");

    const responses = new Map<string, MockResponse>([
      ["GET:https://boltfoundry.com/api/decks/error-test", { status: 404 }],
      ["POST:https://boltfoundry.com/api/decks", {
        status: 500,
        body: { error: "Internal server error" },
      }],
    ]);

    setupMockFetch(responses);

    // Should not throw, just log warning
    const deck = await readLocalDeck(deckPath);

    // Deck should still be loaded locally
    assertEquals(deck.deckId, "error-test");
    assertEquals(deck.markdownContent, content);

    // Verify both GET and POST were attempted
    const getCall = fetchCalls.find((call) =>
      call.url.includes("GET:") && call.url.includes("error-test")
    );
    assertExists(getCall);

    const postCall = fetchCalls.find((call) => call.url.includes("POST:"));
    assertExists(postCall);
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    await cleanup(deckPath);
  }
});

/**
 * Test 5: Deck with embeds - Verify processedContent includes resolved files
 */
Deno.test("readLocalDeck - sends processedContent with resolved embeds", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    // Create embedded file
    const { deckContent, embedContent, expectedProcessedContent } =
      createDeckWithEmbeds(tempDir);

    await Deno.writeTextFile(`${tempDir}/behavior.md`, embedContent);
    await Deno.writeTextFile(`${tempDir}/complex.deck.md`, deckContent);

    Deno.env.set("BF_API_KEY", "test-api-key");

    const responses = new Map<string, MockResponse>([
      ["GET:https://boltfoundry.com/api/decks/complex", { status: 404 }],
      ["POST:https://boltfoundry.com/api/decks", {
        status: 201,
        body: { id: "complex" },
      }],
    ]);

    setupMockFetch(responses);

    // Execute
    const deck = await readLocalDeck(`${tempDir}/complex.deck.md`);

    // Verify deck properties
    assertEquals(deck.deckId, "complex");
    assertEquals(deck.markdownContent, deckContent);

    // Verify POST call includes processedContent
    const postCall = fetchCalls.find((call) =>
      call.url === "POST:https://boltfoundry.com/api/decks"
    );
    assertExists(postCall);

    const postBody = JSON.parse(postCall.options?.body as string);
    assertEquals(postBody.id, "complex");
    assertEquals(postBody.content, deckContent);
    assertEquals(postBody.processedContent, expectedProcessedContent);
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * Test 6: No API key - Verify no API calls are made
 */
Deno.test("readLocalDeck - skips API calls when no API key is configured", async () => {
  const content = `# No API Deck

This deck won't check the API.`;

  const deckPath = await createTempDeckFile(content, "no-api.deck.md");

  try {
    // Ensure no API key is set
    Deno.env.delete("BF_API_KEY");

    setupMockFetch(new Map());

    // Execute
    const deck = await readLocalDeck(deckPath);

    // Verify deck loaded without API calls
    assertEquals(deck.deckId, "no-api");
    assertEquals(deck.markdownContent, content);
    assertEquals(fetchCalls.length, 0);
  } finally {
    restoreFetch();
    await cleanup(deckPath);
  }
});

/**
 * Test 7: Custom API endpoint - Verify custom endpoint is used
 */
Deno.test("readLocalDeck - uses custom API endpoint from options", async () => {
  const content = `# Custom Endpoint Deck

Testing custom API endpoint.`;

  const deckPath = await createTempDeckFile(content, "custom-endpoint.deck.md");

  try {
    const customEndpoint = "https://custom.boltfoundry.com/api";

    const responses = new Map<string, MockResponse>([
      [`GET:${customEndpoint}/decks/custom-endpoint`, { status: 404 }],
      [`POST:${customEndpoint}/decks`, {
        status: 201,
        body: { id: "custom-endpoint" },
      }],
    ]);

    setupMockFetch(responses);

    // Execute with custom options
    const deck = await readLocalDeck(deckPath, {
      apiKey: "custom-key",
      apiEndpoint: customEndpoint,
    });

    // Verify correct endpoint was used
    assertEquals(deck.deckId, "custom-endpoint");

    const getCall = fetchCalls.find((call) =>
      call.url.includes(customEndpoint) && call.url.includes("GET:")
    );
    assertExists(getCall);
    assertEquals(getCall.options?.headers?.["x-bf-api-key"], "custom-key");
  } finally {
    restoreFetch();
    await cleanup(deckPath);
  }
});

/**
 * Test 8: Network timeout - Verify timeout handling
 */
Deno.test("readLocalDeck - handles network timeouts gracefully", async () => {
  const content = `# Timeout Test Deck

This will test timeout handling.`;

  const deckPath = await createTempDeckFile(content, "timeout.deck.md");

  try {
    Deno.env.set("BF_API_KEY", "test-api-key");

    // Mock fetch that simulates timeout
    globalThis.fetch = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      throw new Error("Network timeout");
    };

    // Should not throw, deck should load locally
    const deck = await readLocalDeck(deckPath);

    assertEquals(deck.deckId, "timeout");
    assertEquals(deck.markdownContent, content);
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    await cleanup(deckPath);
  }
});

/**
 * Test 9: Deck ID extraction from nested paths
 */
Deno.test("readLocalDeck - extracts deckId correctly from nested paths", async () => {
  const content = `# Nested Deck

Testing nested path handling.`;

  const tempDir = await Deno.makeTempDir();
  const nestedDir = `${tempDir}/customer/decks/subfolder`;
  await Deno.mkdir(nestedDir, { recursive: true });

  const deckPath = `${nestedDir}/invoice-processor.deck.md`;
  await Deno.writeTextFile(deckPath, content);

  try {
    const deck = await readLocalDeck(deckPath);

    // Should extract only filename without path or extension
    assertEquals(deck.deckId, "invoice-processor");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * Test 10: Multiple decks with same ID - Verify cache works per deck ID
 */
Deno.test("readLocalDeck - cache is keyed by deck ID not file path", async () => {
  const content1 = `# Invoice Deck 1`;
  const content2 = `# Invoice Deck 2`;

  const path1 = await createTempDeckFile(content1, "invoice.deck.md");
  const tempDir2 = await Deno.makeTempDir();
  const path2 = `${tempDir2}/invoice.deck.md`;
  await Deno.writeTextFile(path2, content2);

  try {
    Deno.env.set("BF_API_KEY", "test-api-key");

    const responses = new Map<string, MockResponse>([
      ["GET:https://boltfoundry.com/api/decks/invoice", { status: 200 }],
    ]);

    setupMockFetch(responses);

    // Load first deck
    const deck1 = await readLocalDeck(path1);
    assertEquals(deck1.markdownContent, content1);

    // Load second deck with same ID from different location
    const deck2 = await readLocalDeck(path2);
    assertEquals(deck2.markdownContent, content2);

    // Should only have made one API call due to cache
    const getCalls = fetchCalls.filter((call) =>
      call.url.includes("GET:") && call.url.includes("/invoice")
    );
    assertEquals(getCalls.length, 1);
  } finally {
    restoreFetch();
    Deno.env.delete("BF_API_KEY");
    await cleanup(path1);
    await cleanup(path2);
  }
});
