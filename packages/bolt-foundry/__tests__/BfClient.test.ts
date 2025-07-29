#!/usr/bin/env -S bft test

/**
 * Tests for BfClient fetch wrapper
 *
 * These tests verify the SDK metadata collection implementation
 * specifically for the BfClient's telemetry capture functionality.
 */

import { assertEquals, assertExists } from "@std/assert";
import { BfClient } from "@bfmono/bolt-foundry/BfClient.ts";

/**
 * Test utilities
 */
interface MockResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

const originalFetch = globalThis.fetch;
let fetchCalls: Array<
  { url: string; options?: RequestInit; timestamp: number }
> = [];

function setupMockFetch(responses: Map<string, MockResponse>) {
  fetchCalls = [];

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const timestamp = Date.now();

    fetchCalls.push({ url, options: init, timestamp });

    const response = responses.get(url);
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
}

/**
 * Test 1: Fetch wrapper creation - Verify custom fetch is properly bound
 */
Deno.test("BfClient - creates wrapped fetch function", () => {
  const client = BfClient.create({ apiKey: "test-key" });

  assertExists(client.fetch);
  assertEquals(typeof client.fetch, "function");
  assertEquals(client.fetch.name, "fetch"); // Should be a real fetch function
});

/**
 * Test 2: Metadata extraction - Pass request with bfMetadata, verify extraction
 */
Deno.test("BfClient - extracts and strips bfMetadata from request", async () => {
  const responses = new Map<string, MockResponse>([
    ["https://api.openai.com/v1/chat/completions", {
      status: 200,
      body: {
        id: "chat-123",
        choices: [{ message: { content: "Hello" } }],
      },
    }],
    ["https://boltfoundry.com/api/telemetry", { status: 200 }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({ apiKey: "test-key" });

    const requestBody = {
      model: "gpt-4",
      messages: [{ role: "user", content: "Hi" }],
      bfMetadata: {
        deckId: "test-deck",
        contextVariables: { user: "John" },
        attributes: { source: "test" },
      },
    };

    await client.fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    // Wait a bit for async telemetry
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check OpenAI call had metadata stripped
    const openaiCall = fetchCalls.find((call) => call.url.includes("openai"));
    assertExists(openaiCall);
    const openaiBody = JSON.parse(openaiCall.options?.body as string);
    assertEquals(openaiBody.bfMetadata, undefined);
    assertEquals(openaiBody.model, "gpt-4");

    // Check telemetry call included metadata
    const telemetryCall = fetchCalls.find((call) =>
      call.url.includes("telemetry")
    );
    assertExists(telemetryCall);
    const telemetryBody = JSON.parse(telemetryCall.options?.body as string);
    assertEquals(telemetryBody.bfMetadata, requestBody.bfMetadata);
  } finally {
    restoreFetch();
  }
});

/**
 * Test 3: Clean request forwarding - Verify bfMetadata stripped from OpenAI call
 */
Deno.test("BfClient - forwards clean request without bfMetadata", async () => {
  const responses = new Map<string, MockResponse>([
    ["https://api.openai.com/v1/chat/completions", {
      status: 200,
      body: { choices: [{ message: { content: "Response" } }] },
    }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({ apiKey: "test-key" });

    const requestWithMetadata = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test" }],
      bfMetadata: { deckId: "my-deck", contextVariables: {} },
    };

    await client.fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify(requestWithMetadata),
    });

    // Wait for any async telemetry operations
    await new Promise((resolve) => setTimeout(resolve, 10));

    const openaiCall = fetchCalls[0];
    const sentBody = JSON.parse(openaiCall.options?.body as string);

    // Verify metadata was stripped
    assertEquals(sentBody.bfMetadata, undefined);
    // Verify other fields remain
    assertEquals(sentBody.model, "gpt-3.5-turbo");
    assertEquals(sentBody.messages, requestWithMetadata.messages);
  } finally {
    restoreFetch();
  }
});

/**
 * Test 4: Streaming request skip - Verify no telemetry for stream:true
 */
Deno.test("BfClient - skips telemetry for streaming requests", async () => {
  const responses = new Map<string, MockResponse>([
    ["https://api.openai.com/v1/chat/completions", {
      status: 200,
      body: { choices: [{ delta: { content: "Stream" } }] },
    }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({ apiKey: "test-key" });

    const streamingRequest = {
      model: "gpt-4",
      messages: [{ role: "user", content: "Hi" }],
      stream: true,
      bfMetadata: { deckId: "test", contextVariables: {} },
    };

    await client.fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify(streamingRequest),
    });

    // Wait for any async operations
    await new Promise((resolve) => setTimeout(resolve, 20));

    // Should only have OpenAI call, no telemetry
    assertEquals(fetchCalls.length, 1);
    assertEquals(
      fetchCalls[0].url,
      "https://api.openai.com/v1/chat/completions",
    );
  } finally {
    restoreFetch();
  }
});

/**
 * Test 5: Async execution - Verify response returns before telemetry completes
 */
Deno.test("BfClient - returns response before telemetry completes", async () => {
  let _telemetryDelay = 0;

  const responses = new Map<string, MockResponse>([
    ["https://api.openai.com/v1/chat/completions", {
      status: 200,
      body: { choices: [{ message: { content: "Fast" } }] },
    }],
  ]);

  // Custom fetch that delays telemetry endpoint
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const timestamp = Date.now();

    if (url.includes("telemetry")) {
      _telemetryDelay = timestamp;
      await new Promise((resolve) => setTimeout(resolve, 50)); // Delay telemetry
    }

    fetchCalls.push({ url, options: init, timestamp });

    const response = responses.get(url);
    if (response) {
      return new Response(
        response.body ? JSON.stringify(response.body) : null,
        { status: response.status },
      );
    }
    return new Response("Not found", { status: 404 });
  };

  try {
    const client = BfClient.create({ apiKey: "test-key" });

    const startTime = Date.now();
    const response = await client.fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: "Test" }],
        }),
      },
    );
    const responseTime = Date.now();

    // Response should be fast
    assertEquals(response.status, 200);
    const elapsed = responseTime - startTime;
    assertEquals(elapsed < 40, true); // Should return before telemetry delay

    // Wait for telemetry to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify telemetry was eventually called
    const telemetryCall = fetchCalls.find((call) =>
      call.url.includes("telemetry")
    );
    assertExists(telemetryCall);
  } finally {
    restoreFetch();
  }
});

/**
 * Test 6: Provider extraction from URL - Test various LLM API domains
 */
Deno.test("BfClient - extracts provider from URL correctly", async () => {
  const testCases = [
    { url: "https://api.openai.com/v1/chat/completions", expected: "openai" },
    { url: "https://api.anthropic.com/v1/messages", expected: "anthropic" },
    { url: "https://api.cohere.ai/generate", expected: "cohere" },
    {
      url: "https://generativelanguage.googleapis.com/v1/models",
      expected: "googleapis",
    },
    { url: "https://api.mistral.ai/v1/chat/completions", expected: "mistral" },
  ];

  for (const testCase of testCases) {
    fetchCalls = [];

    const responses = new Map<string, MockResponse>([
      [testCase.url, {
        status: 200,
        body: { result: "success" },
      }],
      ["https://boltfoundry.com/api/telemetry", { status: 200 }],
    ]);

    setupMockFetch(responses);

    const client = BfClient.create({ apiKey: "test-key" });

    await client.fetch(testCase.url, {
      method: "POST",
      body: JSON.stringify({ model: "test-model", input: "test" }),
    });

    // Wait for telemetry
    await new Promise((resolve) => setTimeout(resolve, 10));

    const telemetryCall = fetchCalls.find((call) =>
      call.url.includes("telemetry")
    );
    if (telemetryCall) {
      const telemetryBody = JSON.parse(telemetryCall.options?.body as string);
      assertEquals(telemetryBody.provider, testCase.expected);
    }
  }

  restoreFetch();
});

/**
 * Test 7: Provider extraction from model - Test "anthropic/claude-3" format
 */
Deno.test("BfClient - extracts provider from model string", async () => {
  const responses = new Map<string, MockResponse>([
    ["https://openrouter.ai/api/v1/chat/completions", {
      status: 200,
      body: { choices: [{ message: { content: "Response" } }] },
    }],
    ["https://boltfoundry.com/api/telemetry", { status: 200 }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({ apiKey: "test-key" });

    const request = {
      model: "anthropic/claude-3-opus",
      messages: [{ role: "user", content: "Test" }],
    };

    await client.fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify(request),
    });

    // Wait for telemetry
    await new Promise((resolve) => setTimeout(resolve, 10));

    const telemetryCall = fetchCalls.find((call) =>
      call.url.includes("telemetry")
    );
    assertExists(telemetryCall);

    const telemetryBody = JSON.parse(telemetryCall.options?.body as string);
    assertEquals(telemetryBody.provider, "anthropic");
    assertEquals(telemetryBody.model, "anthropic/claude-3-opus");
  } finally {
    restoreFetch();
  }
});

/**
 * Test 8: Custom telemetry endpoint
 */
Deno.test("BfClient - uses custom telemetry endpoint", async () => {
  const customEndpoint = "https://custom.telemetry.com/collect";

  const responses = new Map<string, MockResponse>([
    ["https://api.openai.com/v1/chat/completions", {
      status: 200,
      body: { choices: [{ message: { content: "Test" } }] },
    }],
    [customEndpoint, { status: 200 }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({
      apiKey: "test-key",
      collectorEndpoint: customEndpoint,
    });

    await client.fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: "Test" }],
      }),
    });

    // Wait for telemetry
    await new Promise((resolve) => setTimeout(resolve, 10));

    const telemetryCall = fetchCalls.find((call) =>
      call.url === customEndpoint
    );
    assertExists(telemetryCall);
  } finally {
    restoreFetch();
  }
});

/**
 * Test 9: Telemetry payload structure
 */
Deno.test("BfClient - sends correct telemetry payload structure", async () => {
  const responses = new Map<string, MockResponse>([
    ["https://api.openai.com/v1/chat/completions", {
      status: 200,
      body: {
        id: "chatcmpl-123",
        choices: [{ message: { role: "assistant", content: "Hello!" } }],
        usage: { total_tokens: 50 },
      },
    }],
    ["https://boltfoundry.com/api/telemetry", { status: 200 }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({ apiKey: "bf-test-key" });

    const requestBody = {
      model: "gpt-4",
      messages: [{ role: "user", content: "Hi" }],
      temperature: 0.7,
      bfMetadata: {
        deckId: "greeting",
        contextVariables: { userName: "Alice" },
      },
    };

    await client.fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-test",
      },
      body: JSON.stringify(requestBody),
    });

    // Wait for telemetry
    await new Promise((resolve) => setTimeout(resolve, 10));

    const telemetryCall = fetchCalls.find((call) =>
      call.url.includes("telemetry")
    );
    assertExists(telemetryCall);

    const telemetryPayload = JSON.parse(telemetryCall.options?.body as string);

    // Verify structure
    assertExists(telemetryPayload.duration);
    assertEquals(typeof telemetryPayload.duration, "number");
    assertEquals(telemetryPayload.provider, "openai");
    assertEquals(telemetryPayload.model, "gpt-4");

    // Verify request data (without bfMetadata)
    assertEquals(
      telemetryPayload.request.url,
      "https://api.openai.com/v1/chat/completions",
    );
    assertEquals(telemetryPayload.request.method, "POST");
    assertExists(telemetryPayload.request.headers);
    assertEquals(telemetryPayload.request.body.model, "gpt-4");
    assertEquals(telemetryPayload.request.body.bfMetadata, undefined);
    assertExists(telemetryPayload.request.timestamp);

    // Verify response data
    assertEquals(telemetryPayload.response.status, 200);
    assertExists(telemetryPayload.response.headers);
    assertEquals(telemetryPayload.response.body.id, "chatcmpl-123");
    assertExists(telemetryPayload.response.timestamp);

    // Verify metadata
    assertEquals(telemetryPayload.bfMetadata, requestBody.bfMetadata);

    // Verify API key header
    assertEquals(
      telemetryCall.options?.headers?.["x-bf-api-key"],
      "bf-test-key",
    );
  } finally {
    restoreFetch();
  }
});

/**
 * Test 10: Handle non-JSON request bodies gracefully
 */
Deno.test("BfClient - handles non-JSON request bodies", async () => {
  const responses = new Map<string, MockResponse>([
    ["https://api.example.com/upload", {
      status: 200,
      body: { success: true },
    }],
  ]);

  setupMockFetch(responses);

  try {
    const client = BfClient.create({ apiKey: "test-key" });

    // FormData request
    const formData = new FormData();
    formData.append("file", "content");

    await client.fetch("https://api.example.com/upload", {
      method: "POST",
      body: formData,
    });

    // Should not throw and should pass through unchanged
    assertEquals(fetchCalls.length, 1);
    assertEquals(fetchCalls[0].url, "https://api.example.com/upload");
  } finally {
    restoreFetch();
  }
});
