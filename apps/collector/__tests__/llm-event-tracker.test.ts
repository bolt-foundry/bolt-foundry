#! /usr/bin/env -S bff test
import { assertEquals, assertObjectMatch } from "@std/assert";
import { trackLlmEvent } from "../llm-event-tracker.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";
import type { PostHog } from "posthog-node";
import type {
  OpenAIRequestBody,
  OpenAIResponseBody,
  TelemetryData,
} from "packages/bolt-foundry/bolt-foundry.ts";

type PostHogEvent = {
  event: string;
  properties: Record<string, JSONValue>;
};
// Create a mock for the PostHog client
class MockPostHog {
  events: PostHogEvent[] = [];
  flushed = false;

  capture(event: PostHogEvent) {
    this.events.push(event);
    return true;
  }

  flush() {
    this.flushed = true;
    return Promise.resolve(true);
  }
}

Deno.test("trackLlmEvent captures and sends analytics data correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock request and response objects
  const mockRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Hello" },
    ],
    temperature: 0.7,
    max_tokens: 150,
  };

  const mockResponseBody = {
    id: "chatcmpl-123",
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content: "Hello there!",
        },
        finish_reason: "stop",
      },
    ],
  };

  // Create telemetry data object
  const telemetryData: TelemetryData = {
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: mockRequestBody as unknown as OpenAIRequestBody,
    },
    response: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: mockResponseBody as unknown as OpenAIResponseBody,
    },
    duration: 1000, // 1 second
    timestamp: new Date().toISOString(),
  };

  // Call the function under test
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
  );

  // Assert that PostHog capture was called with correct parameters
  assertEquals(mockPosthog.events.length, 1);
  assertEquals(mockPosthog.flushed, true);

  const capturedEvent = mockPosthog.events[0];
  assertEquals(capturedEvent.event, "llm_api_request");

  // Check that PostHog properties include the expected AI schema properties
  const properties = capturedEvent.properties;
  assertObjectMatch(properties, {
    "$ai_provider": "openai",
    "$ai_model": "gpt-3.5-turbo",
    "$ai_input_tokens": 10,
    "$ai_output_tokens": 20,
    "$ai_total_tokens": 30,
    "$ai_response_id": "chatcmpl-123",
    "$ai_is_error": false,
    "$ai_http_status": 200,
  });

  // Verify cost calculation is included
  assertEquals(typeof properties.cost, "number");
});

Deno.test("trackLlmEvent handles API errors correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock error response
  const mockErrorResponseBody = {
    error: {
      message: "Invalid API key",
      type: "authentication_error",
      code: "invalid_api_key",
    },
  };

  // Create telemetry data object with error
  const telemetryData: TelemetryData = {
    request: {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { model: "gpt-3.5-turbo" } as OpenAIRequestBody,
    },
    response: {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: mockErrorResponseBody as unknown as OpenAIResponseBody,
    },
    duration: 500, // 0.5 seconds
    timestamp: new Date().toISOString(),
  };

  // Call the function under test with error response
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
  );

  // Assert that PostHog was called with error information
  assertEquals(mockPosthog.events.length, 1);
  assertEquals(mockPosthog.flushed, true);

  // Verify error information in captured event
  const capturedEvent = mockPosthog.events[0];
  const properties = capturedEvent.properties;
  assertEquals(properties["$ai_is_error"], true);
  assertEquals(properties["$ai_http_status"], 401);
  assertEquals(properties.success, false);
});
