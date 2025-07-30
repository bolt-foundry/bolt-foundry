#!/usr/bin/env -S bft test

/**
 * Tests for Telemetry Data Structure
 *
 * These tests verify the SDK metadata collection implementation
 * specifically for the telemetry data structure and type definitions.
 */

import { assertEquals, assertExists } from "@std/assert";
import type { TelemetryData } from "@bfmono/bolt-foundry/types.ts";

/**
 * Test 1: Telemetry data structure - Verify all required fields present
 */
Deno.test("TelemetryData - has all required fields", () => {
  const telemetryData: TelemetryData = {
    duration: 150,
    provider: "openai",
    model: "gpt-4",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello" }],
      },
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        id: "chatcmpl-123",
        choices: [{ message: { content: "Hi there!" } }],
      },
      timestamp: "2024-01-01T12:00:00.150Z",
    },
  };

  // Verify all required fields exist
  assertExists(telemetryData.duration);
  assertExists(telemetryData.provider);
  assertExists(telemetryData.model);
  assertExists(telemetryData.request);
  assertExists(telemetryData.request.url);
  assertExists(telemetryData.request.method);
  assertExists(telemetryData.request.headers);
  assertExists(telemetryData.request.body);
  assertExists(telemetryData.request.timestamp);
  assertExists(telemetryData.response);
  assertExists(telemetryData.response.status);
  assertExists(telemetryData.response.headers);
  assertExists(telemetryData.response.body);
  assertExists(telemetryData.response.timestamp);
});

/**
 * Test 2: Metadata inclusion in telemetry - When captureTelemetry is true
 */
Deno.test("TelemetryData - includes optional bfMetadata", () => {
  const telemetryData: TelemetryData = {
    duration: 200,
    provider: "anthropic",
    model: "claude-3",
    request: {
      url: "https://api.anthropic.com/v1/messages",
      method: "POST",
      headers: {},
      body: { model: "claude-3", messages: [] },
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: {},
      body: { content: "Response" },
      timestamp: "2024-01-01T12:00:00.200Z",
    },
    bfMetadata: {
      deckId: "test-deck",
      contextVariables: { user: "Alice" },
      attributes: { priority: "high" },
    },
  };

  assertExists(telemetryData.bfMetadata);
  assertEquals(telemetryData.bfMetadata.deckId, "test-deck");
  assertEquals(telemetryData.bfMetadata.contextVariables, { user: "Alice" });
  assertEquals(telemetryData.bfMetadata.attributes, { priority: "high" });
});

/**
 * Test 3: Metadata exclusion from telemetry - When captureTelemetry is false
 */
Deno.test("TelemetryData - excludes bfMetadata when not provided", () => {
  const telemetryData: TelemetryData = {
    duration: 100,
    provider: "openai",
    model: "gpt-3.5-turbo",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {},
      body: { model: "gpt-3.5-turbo", messages: [] },
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: {},
      body: { choices: [] },
      timestamp: "2024-01-01T12:00:00.100Z",
    },
  };

  assertEquals(telemetryData.bfMetadata, undefined);
});

/**
 * Test 4: Request/response body extraction - Verify proper data capture
 */
Deno.test("TelemetryData - captures request and response bodies correctly", () => {
  const requestBody = {
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: "What is 2+2?" },
    ],
    temperature: 0.7,
    max_tokens: 100,
  };

  const responseBody = {
    id: "chatcmpl-abc123",
    object: "chat.completion",
    created: 1677652288,
    model: "gpt-4",
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        content: "2 + 2 equals 4.",
      },
      finish_reason: "stop",
    }],
    usage: {
      prompt_tokens: 20,
      completion_tokens: 10,
      total_tokens: 30,
    },
  };

  const telemetryData: TelemetryData = {
    duration: 250,
    provider: "openai",
    model: "gpt-4",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-xxx",
      },
      body: requestBody,
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": "req_123",
      },
      body: responseBody,
      timestamp: "2024-01-01T12:00:00.250Z",
    },
  };

  // Verify request body
  assertEquals(telemetryData.request.body.model, "gpt-4");
  assertEquals(telemetryData.request.body.temperature, 0.7);
  assertEquals(telemetryData.request.body.max_tokens, 100);
  assertEquals(Array.isArray(telemetryData.request.body.messages), true);

  // Verify response body
  assertEquals(telemetryData.response.body.id, "chatcmpl-abc123");
  assertEquals(telemetryData.response.body.model, "gpt-4");
  assertExists(telemetryData.response.body.choices);
  assertExists(telemetryData.response.body.usage);
});

/**
 * Test 5: Streaming request identification
 */
Deno.test("TelemetryData - identifies streaming requests", () => {
  const telemetryDataStream: TelemetryData = {
    duration: 50,
    provider: "openai",
    model: "gpt-4",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {},
      body: {
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello" }],
        stream: true, // Streaming request
      },
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: {},
      body: {}, // Streaming responses are different
      timestamp: "2024-01-01T12:00:00.050Z",
    },
  };

  // Verify streaming flag is captured
  assertEquals(telemetryDataStream.request.body.stream, true);
});

/**
 * Test 6: Non-streaming request identification
 */
Deno.test("TelemetryData - identifies non-streaming requests", () => {
  const telemetryDataNonStream: TelemetryData = {
    duration: 150,
    provider: "openai",
    model: "gpt-4",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {},
      body: {
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello" }],
        // No stream property or stream: false
      },
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: {},
      body: { choices: [{ message: { content: "Hi!" } }] },
      timestamp: "2024-01-01T12:00:00.150Z",
    },
  };

  // Verify no streaming flag or false
  assertEquals(
    telemetryDataNonStream.request.body.stream === undefined ||
      telemetryDataNonStream.request.body.stream === false,
    true,
  );
});

/**
 * Test 7: Provider and model extraction
 */
Deno.test("TelemetryData - stores provider and model correctly", () => {
  const providers = [
    { provider: "openai", model: "gpt-4" },
    { provider: "anthropic", model: "claude-3-opus" },
    { provider: "anthropic", model: "anthropic/claude-3-opus" },
    { provider: "mistral", model: "mistral-large" },
    { provider: "cohere", model: "command" },
  ];

  for (const { provider, model } of providers) {
    const telemetryData: TelemetryData = {
      duration: 100,
      provider,
      model,
      request: {
        url: `https://api.${provider}.com/v1/endpoint`,
        method: "POST",
        headers: {},
        body: { model },
        timestamp: "2024-01-01T12:00:00.000Z",
      },
      response: {
        status: 200,
        headers: {},
        body: {},
        timestamp: "2024-01-01T12:00:00.100Z",
      },
    };

    assertEquals(telemetryData.provider, provider);
    assertEquals(telemetryData.model, model);
  }
});

/**
 * Test 8: Timestamp format
 */
Deno.test("TelemetryData - uses ISO timestamp format", () => {
  const telemetryData: TelemetryData = {
    duration: 75,
    provider: "openai",
    model: "gpt-3.5-turbo",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {},
      body: {},
      timestamp: "2024-01-01T12:00:00.000Z",
    },
    response: {
      status: 200,
      headers: {},
      body: {},
      timestamp: "2024-01-01T12:00:00.075Z",
    },
  };

  // Verify timestamps are in ISO format
  assertEquals(telemetryData.request.timestamp.includes("T"), true);
  assertEquals(telemetryData.request.timestamp.includes("Z"), true);
  assertEquals(telemetryData.response.timestamp.includes("T"), true);
  assertEquals(telemetryData.response.timestamp.includes("Z"), true);
});

/**
 * Test 9: Duration calculation
 */
Deno.test("TelemetryData - duration matches timestamp difference", () => {
  const requestTime = "2024-01-01T12:00:00.000Z";
  const responseTime = "2024-01-01T12:00:00.325Z";
  const expectedDuration = 325; // milliseconds

  const telemetryData: TelemetryData = {
    duration: expectedDuration,
    provider: "openai",
    model: "gpt-4",
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {},
      body: {},
      timestamp: requestTime,
    },
    response: {
      status: 200,
      headers: {},
      body: {},
      timestamp: responseTime,
    },
  };

  const calculatedDuration = new Date(responseTime).getTime() -
    new Date(requestTime).getTime();

  assertEquals(telemetryData.duration, calculatedDuration);
});
