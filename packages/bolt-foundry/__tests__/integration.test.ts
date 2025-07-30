#!/usr/bin/env -S bft test

/**
 * Integration test for SDK metadata collection
 *
 * This test verifies the complete flow from deck loading through telemetry capture,
 * matching the integration test outlined in the implementation memo.
 */

import { assertEquals, assertExists } from "@std/assert";
import { BfClient } from "../BfClient.ts";
import { readLocalDeck } from "../deck.ts";

// Test helper functions
async function createTempDeckFile(content: string): Promise<string> {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/invoice-extraction.deck.md`;
  await Deno.writeTextFile(deckPath, content);
  return deckPath;
}

async function cleanup(path: string): Promise<void> {
  const dir = path.substring(0, path.lastIndexOf("/"));
  await Deno.remove(dir, { recursive: true });
}

// Mock fetch for testing
const originalFetch = globalThis.fetch;
let fetchCalls: Array<{ url: string; options?: RequestInit }> = [];

function mockFetch(responseMap: Map<string, Response>) {
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    fetchCalls.push({ url, options: init });

    const response = responseMap.get(url);
    if (response) return response;

    // Check for pattern matches
    for (const [pattern, resp] of responseMap.entries()) {
      if (url.includes(pattern)) return resp;
    }

    return new Response("Not found", { status: 404 });
  };
}

Deno.test("SDK flow - deck loading with lazy creation and telemetry", async () => {
  fetchCalls = [];

  // Setup mock responses
  const responses = new Map<string, Response>([
    // Deck doesn't exist
    [
      "https://boltfoundry.com/api/decks/invoice-extraction",
      new Response(null, { status: 404 }),
    ],
    // Deck creation succeeds
    [
      "https://boltfoundry.com/api/decks",
      new Response(JSON.stringify({ id: "invoice-extraction" }), {
        status: 201,
      }),
    ],
    // OpenAI completion
    [
      "https://api.openai.com/v1/chat/completions",
      new Response(JSON.stringify({
        id: "chatcmpl-123",
        choices: [{
          message: { role: "assistant", content: "Invoice processed" },
        }],
        usage: { total_tokens: 25 },
      })),
    ],
    // Telemetry endpoint
    [
      "https://boltfoundry.com/api/telemetry",
      new Response(null, { status: 200 }),
    ],
  ]);

  mockFetch(responses);

  let deckPath = "";

  try {
    // 1. Load deck with lazy creation
    deckPath = await createTempDeckFile(`# Invoice Extraction

Extract key fields from invoices.

Given an invoice, extract:
- Invoice number
- Amount
- Date
- Vendor name`);

    // Set API key for deck creation
    Deno.env.set("BF_API_KEY", "bf+test-key");

    const deck = await readLocalDeck(deckPath);

    // Verify deck check and creation
    const deckCheckCall = fetchCalls.find((c) =>
      c.url.includes("/api/decks/invoice-extraction") &&
      !c.options?.method
    );
    assertExists(deckCheckCall);

    const deckCreateCall = fetchCalls.find((c) =>
      c.url.includes("/api/decks") &&
      c.options?.method === "POST"
    );
    assertExists(deckCreateCall);

    // 2. Render with metadata
    const completion = deck.render(
      { invoice: "INV-001", amount: "$1,200" },
      { temperature: 0.1, model: "gpt-4" }, // OpenAI params override
      { attributes: { invoiceImage: "base64..." } },
    );

    assertEquals(completion.bfMetadata?.deckId, "invoice-extraction");
    assertEquals(completion.bfMetadata?.contextVariables, {
      invoice: "INV-001",
      amount: "$1,200",
    });
    assertEquals(completion.bfMetadata?.attributes, {
      invoiceImage: "base64...",
    });
    assertEquals(completion.temperature, 0.1);

    // 3. Use with telemetry
    const bfClient = BfClient.create({ apiKey: "bf+test" });

    // Simulate OpenAI client usage pattern
    const response = await bfClient.fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-test",
        },
        body: JSON.stringify(completion),
      },
    );

    // Wait for async telemetry
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify API response
    assertEquals(response.status, 200);
    const responseData = await response.json();
    assertEquals(responseData.id, "chatcmpl-123");

    // Verify telemetry was sent
    const telemetryCall = fetchCalls.find((c) =>
      c.url.includes("/api/telemetry")
    );
    assertExists(telemetryCall);

    // Verify metadata was included in telemetry
    const telemetryBody = JSON.parse(telemetryCall.options?.body as string);
    assertEquals(telemetryBody.bfMetadata, completion.bfMetadata);
    assertEquals(telemetryBody.provider, "openai");
    assertEquals(telemetryBody.model, completion.model);

    // Verify metadata was stripped from OpenAI request
    const openaiCall = fetchCalls.find((c) => c.url.includes("openai.com"));
    assertExists(openaiCall);
    const openaiBody = JSON.parse(openaiCall.options?.body as string);
    assertEquals(openaiBody.bfMetadata, undefined);
    assertEquals(openaiBody.temperature, 0.1); // But other params preserved
  } finally {
    globalThis.fetch = originalFetch;
    Deno.env.delete("BF_API_KEY");
    if (deckPath) {
      await cleanup(deckPath);
    }
  }
});

/**
 * Test without telemetry - verify no BfClient usage still works
 */
Deno.test("SDK flow - deck rendering without telemetry", async () => {
  fetchCalls = [];

  const deckPath = await createTempDeckFile(`# Simple Deck
Just a simple test deck.`);

  try {
    // Load deck without API key (no lazy creation)
    const deck = await readLocalDeck(deckPath);

    // Render without telemetry
    const completion = deck.render(
      { test: "value" },
      { model: "gpt-3.5-turbo" },
      { captureTelemetry: false },
    );

    // Should have rendered correctly
    assertEquals(completion.model, "gpt-3.5-turbo");
    assertEquals(completion.bfMetadata, undefined); // No metadata due to captureTelemetry: false

    // Direct fetch (no BfClient) should work fine
    // This simulates using OpenAI directly without telemetry
    assertEquals(typeof completion.messages, "object");
    assertEquals(Array.isArray(completion.messages), true);
  } finally {
    await cleanup(deckPath);
  }
});

/**
 * Test streaming request behavior
 */
Deno.test("SDK flow - streaming requests skip telemetry", async () => {
  fetchCalls = [];

  const responses = new Map<string, Response>([
    [
      "https://api.openai.com/v1/chat/completions",
      new Response("data: {'delta': {'content': 'Hi'}}\n\n", {
        headers: { "Content-Type": "text/event-stream" },
      }),
    ],
  ]);

  mockFetch(responses);

  try {
    const bfClient = BfClient.create({ apiKey: "bf+test" });

    const streamingRequest = {
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello" }],
      stream: true,
      bfMetadata: {
        deckId: "test",
        contextVariables: { test: "value" },
      },
    };

    await bfClient.fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify(streamingRequest),
    });

    // Wait for any potential async operations
    await new Promise((resolve) => setTimeout(resolve, 30));

    // Should only have OpenAI call, no telemetry due to streaming
    assertEquals(fetchCalls.length, 1);
    assertEquals(
      fetchCalls[0].url,
      "https://api.openai.com/v1/chat/completions",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
