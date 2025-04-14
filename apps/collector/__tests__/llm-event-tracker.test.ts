#! /usr/bin/env -S bff test

import { calculateLlmCost, trackLlmEvent } from "../llm-event-tracker.ts";
import { assertEquals } from "@std/assert/equals";
import { restore, stub } from "@std/testing/mock";

Deno.test("calculateLlmCost - should calculate correct cost for gpt-4o", () => {
  const inputTokens = 1000;
  const outputTokens = 500;
  const cost = calculateLlmCost("gpt-4o", inputTokens, outputTokens);

  // 1000 input tokens at $0.0025 per 1000 tokens = $0.0025
  // 500 output tokens at $0.010 per 1000 tokens = $0.005
  // Total expected: $0.0075
  assertEquals(cost, 0.0075);
});

Deno.test("calculateLlmCost - should calculate correct cost for gpt-3.5-turbo", () => {
  const inputTokens = 2000;
  const outputTokens = 1000;
  const cost = calculateLlmCost("gpt-3.5-turbo", inputTokens, outputTokens);

  // 2000 input tokens at $0.0010 per 1000 tokens = $0.002
  // 1000 output tokens at $0.0020 per 1000 tokens = $0.002

  // Total expected: $0.004
  assertEquals(cost, 0.004);
});

Deno.test("calculateLlmCost - should use default pricing for unknown models", () => {
  const inputTokens = 1000;
  const outputTokens = 500;
  const cost = calculateLlmCost("unknown-model", inputTokens, outputTokens);

  // Should default to gpt-3.5-turbo pricing
  // 1000 input tokens at $0.0010 per 1000 tokens = $0.001
  // 500 output tokens at $0.0020 per 1000 tokens = $0.001
  // Total expected: $0.002
  assertEquals(cost, 0.002);
});

Deno.test("trackLlmEvent - should send telemetry to PostHog", async () => {
  // Create the stub
  stub(globalThis, "fetch", (url, options) => {
    // Only intercept PostHog calls
    if (url === "https://i.bltfdy.co/api/collect") {
      // Verify the request contains expected properties
      const body = JSON.parse(options?.body as string);

      // Ensure required fields are present
      assertEquals(typeof body.timestamp, "string");
      assertEquals(typeof body.latency, "number");
      assertEquals(typeof body.url, "string");
      assertEquals(typeof body.success, "boolean");

      // Model info should be included if available
      if (body.model) {
        assertEquals(typeof body.model, "string");
      }

      // Cost should be a number
      if (body.cost !== undefined) {
        assertEquals(typeof body.cost, "number");
      }

      // Check headers
      const headers = options?.headers as Record<string, string>;
      assertEquals(headers["Content-Type"], "application/json");
      assertEquals(headers["X-BF-API-Key"], "test-api-key");

      return Promise.resolve(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    // Pass through other requests
    return fetch(url, options);
  });

  try {
    // Create mock request and response
    const mockRequest = new Request(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-test", // This should be sanitized
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello" }],
        }),
      },
    );

    const mockResponse = new Response(
      JSON.stringify({
        id: "chatcmpl-123",
        object: "chat.completion",
        model: "gpt-3.5-turbo",
        usage: {
          prompt_tokens: 5,
          completion_tokens: 10,
          total_tokens: 15,
        },
        choices: [
          {
            message: {
              role: "assistant",
              content: "Hello! How can I help you today?",
            },
          },
        ],
      }),
      { status: 200 },
    );

    // Track the event
    const startTime = Date.now() - 500; // 500ms ago
    await trackLlmEvent(mockRequest, mockResponse, startTime, "test-api-key");

    // Since mockFetch asserts the structure, if we reach here without errors, the test passed
  } finally {
    // Restore original fetch
    restore();
  }
});
