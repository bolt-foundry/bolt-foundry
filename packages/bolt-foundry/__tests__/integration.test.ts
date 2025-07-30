// packages/bolt-foundry/__tests__/integration.test.ts
import { assertEquals, assertExists } from "@std/assert";
import { BfClient, readLocalDeck } from "../BfClient.ts";
import { clearDeckCache } from "../deck.ts";
import { OpenAI } from "@openai/openai";

// Test helper functions
async function createTempDeckFile(
  content: string,
  filename: string = "invoice-extraction.deck.md",
): Promise<string> {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/${filename}`;
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
    if (response) return Promise.resolve(response.clone());

    // Check for pattern matches (for POST requests with specific URLs)
    for (const [pattern, resp] of responseMap.entries()) {
      if (pattern.startsWith("POST:") && init?.method === "POST") {
        const patternUrl = pattern.substring(5);
        if (url === patternUrl) return Promise.resolve(resp.clone());
      } else if (url.includes(pattern)) {
        return Promise.resolve(resp.clone());
      }
    }

    return Promise.resolve(new Response("Not found", { status: 404 }));
  };
}

Deno.test("SDK flow - deck loading with lazy creation and telemetry", async () => {
  fetchCalls = [];
  clearDeckCache(); // Clear the deck cache before test

  // Setup mock responses
  const responses = new Map<string, Response>([
    // Deck doesn't exist
    [
      "https://boltfoundry.com/api/decks/invoice-extraction",
      new Response(null, { status: 404 }),
    ],
    // Deck creation succeeds
    [
      "POST:https://boltfoundry.com/api/decks",
      new Response(JSON.stringify({ id: "invoice-extraction" }), {
        status: 201,
      }),
    ],
    // OpenAI completion
    [
      "https://api.openai.com/v1/chat/completions",
      new Response(
        JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion",
          created: Date.now(),
          model: "gpt-3.5-turbo",
          choices: [{
            index: 0,
            message: {
              role: "assistant",
              content: "Invoice processed",
            },
            finish_reason: "stop",
          }],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 2,
            total_tokens: 12,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    ],
    // Telemetry endpoint
    [
      "https://boltfoundry.com/api/telemetry",
      new Response(
        JSON.stringify({
          success: true,
          deckId: "deck-123",
          sampleId: "sample-456",
        }),
        { status: 200 },
      ),
    ],
  ]);

  mockFetch(responses);

  // Set environment variables for test
  Deno.env.set("BF_API_KEY", "bf+test");

  let deckPath = "";
  try {
    // 1. Load deck with lazy creation
    deckPath = await createTempDeckFile(`# Invoice Extraction
    
Extract key fields from invoices.`);

    const deck = await readLocalDeck(deckPath);

    // Verify deck check and creation
    const deckCheckCall = fetchCalls.find((c) =>
      c.url.includes("/api/decks/invoice-extraction") &&
      c.options?.method !== "POST"
    );
    assertExists(deckCheckCall);
    const deckCheckHeaders = deckCheckCall.options?.headers as Record<
      string,
      string
    >;
    assertEquals(deckCheckHeaders?.["x-bf-api-key"], "bf+test");

    const deckCreateCall = fetchCalls.find((c) =>
      c.url.includes("/api/decks") &&
      c.options?.method === "POST"
    );
    assertExists(deckCreateCall);
    const createBody = JSON.parse(deckCreateCall.options?.body as string);
    assertEquals(createBody.id, "invoice-extraction");
    assertExists(createBody.content);
    assertExists(createBody.processedContent);

    // 2. Render with metadata
    const completion = deck.render({
      context: { invoice: "INV-001" },
      attributes: { invoiceImage: "base64..." },
    });

    assertEquals(completion.bfMetadata?.deckId, "invoice-extraction");
    assertEquals(completion.bfMetadata?.contextVariables, {
      invoice: "INV-001",
    });
    assertEquals(completion.bfMetadata?.attributes, {
      invoiceImage: "base64...",
    });

    // 3. Use with telemetry
    const bfClient = BfClient.create({ apiKey: "bf+test" });
    const openai = new OpenAI({
      apiKey: "test-key",
      fetch: bfClient.fetch,
    });

    await openai.chat.completions.create(completion);

    // Wait a bit for async telemetry to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify telemetry was sent
    const telemetryCall = fetchCalls.find((c) =>
      c.url.includes("/api/telemetry")
    );
    assertExists(telemetryCall);

    // Verify metadata was included in telemetry
    const telemetryBody = JSON.parse(telemetryCall.options?.body as string);
    assertEquals(telemetryBody.bfMetadata, completion.bfMetadata);
    assertExists(telemetryBody.duration);
    assertExists(telemetryBody.provider);
    assertExists(telemetryBody.model);

    // Verify metadata was stripped from OpenAI request
    const openaiCall = fetchCalls.find((c) => c.url.includes("openai.com"));
    assertExists(openaiCall);
    const openaiBody = JSON.parse(openaiCall.options?.body as string);
    assertEquals(openaiBody.bfMetadata, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    Deno.env.delete("BF_API_KEY");
    if (deckPath) await cleanup(deckPath);
  }
});

Deno.test("SDK flow - render without metadata when captureTelemetry is false", async () => {
  const deckPath = await createTempDeckFile(`# Test Deck

Test content.`);

  try {
    const deck = await readLocalDeck(deckPath);

    // Render with captureTelemetry: false
    const completion = deck.render({
      context: { data: "sensitive" },
      captureTelemetry: false,
    });

    // Should not include metadata
    assertEquals(completion.bfMetadata, undefined);

    // Messages should still be included
    assertExists(completion.messages);
    assertEquals(completion.messages[0].role, "system");
  } finally {
    await cleanup(deckPath);
  }
});

Deno.test("SDK flow - deck loading without API key", async () => {
  fetchCalls = [];
  clearDeckCache();

  // Ensure no API key is set
  Deno.env.delete("BF_API_KEY");

  const deckPath = await createTempDeckFile(`# Test Deck

Test content.`);

  try {
    const deck = await readLocalDeck(deckPath);

    // Should load deck without making API calls
    assertEquals(deck.deckId, "invoice-extraction"); // The helper always creates invoice-extraction.deck.md

    // Verify no API calls were made
    const apiCalls = fetchCalls.filter((c) =>
      c.url.includes("boltfoundry.com/api")
    );
    assertEquals(apiCalls.length, 0);
  } finally {
    await cleanup(deckPath);
  }
});

Deno.test("SDK flow - telemetry with streaming request", async () => {
  fetchCalls = [];

  const responses = new Map<string, Response>([
    // OpenAI streaming completion
    [
      "https://api.openai.com/v1/chat/completions",
      new Response('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n', {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    ],
  ]);

  mockFetch(responses);

  try {
    const bfClient = BfClient.create({ apiKey: "bf+test" });
    const openai = new OpenAI({
      apiKey: "test-key",
      fetch: bfClient.fetch,
    });

    await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      stream: true,
      bfMetadata: {
        deckId: "test-deck",
        contextVariables: { test: true },
      },
    } as unknown as OpenAI.Chat.ChatCompletionCreateParams); // Cast needed because OpenAI SDK doesn't know about our metadata extension

    // Wait to ensure no telemetry is sent
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify no telemetry was sent for streaming request
    const telemetryCall = fetchCalls.find((c) =>
      c.url.includes("/api/telemetry")
    );
    assertEquals(telemetryCall, undefined);

    // Verify metadata was still stripped from OpenAI request
    const openaiCall = fetchCalls.find((c) => c.url.includes("openai.com"));
    assertExists(openaiCall);
    const openaiBody = JSON.parse(openaiCall.options?.body as string);
    assertEquals(openaiBody.bfMetadata, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("BfClient.readLocalDeck alias methods", async () => {
  fetchCalls = [];

  // Setup mock responses
  const responses = new Map<string, Response>([
    // Deck exists
    [
      "https://boltfoundry.com/api/decks/test-deck",
      new Response(JSON.stringify({ id: "test-deck" }), { status: 200 }),
    ],
    // Deck update succeeds
    [
      "PUT:https://boltfoundry.com/api/decks/test-deck",
      new Response(null, { status: 200 }),
    ],
  ]);

  mockFetch(responses);

  try {
    const deckPath = await createTempDeckFile(
      `# Test Deck

This is a test deck for alias methods.`,
      "test-deck.deck.md",
    );

    // Clear cache to ensure API call happens
    clearDeckCache();

    // Test 1: Static method
    const deck1 = await BfClient.readLocalDeck(deckPath, {
      apiKey: "bf+test-key",
    });
    assertEquals(deck1.deckId, "test-deck");
    assertEquals(deck1.markdownContent.includes("Test Deck"), true);

    // Verify API was called
    const deckCheckCall1 = fetchCalls.find((c) =>
      c.url.includes("/api/decks/test-deck") &&
      c.options?.method !== "PUT"
    );
    assertExists(deckCheckCall1);

    // Clear cache and calls for next test
    clearDeckCache();
    fetchCalls = [];

    // Test 2: Instance method
    const bfClient = BfClient.create({ apiKey: "bf+test-key" });
    const deck2 = await bfClient.readLocalDeck(deckPath);
    assertEquals(deck2.deckId, "test-deck");
    assertEquals(deck2.markdownContent.includes("Test Deck"), true);

    // Verify API was called with the client's API key
    const deckCheckCall2 = fetchCalls.find((c) =>
      c.url.includes("/api/decks/test-deck") &&
      c.options?.method !== "PUT"
    );
    assertExists(deckCheckCall2);
    assertEquals(
      deckCheckCall2.options?.headers?.["x-bf-api-key"],
      "bf+test-key",
    );

    await cleanup(deckPath);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
