#! /usr/bin/env -S bff test
import { assertEquals, assertObjectMatch } from "@std/assert";
import { trackLlmEvent } from "../llm-event-tracker.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";
import type { PostHog } from "posthog-node";

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

  // Create mock Request with body
  const mockRequest = new Request(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockRequestBody),
    },
  );

  // Create mock Response with body
  const mockResponse = new Response(JSON.stringify(mockResponseBody), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Mock Request and Response clone methods
  const originalClone = Request.prototype.clone;
  const originalResponseClone = Response.prototype.clone;
  const originalText = Response.prototype.text;
  const originalRequestText = Request.prototype.text;

  // Stub Request.clone
  Request.prototype.clone = function () {
    return this;
  };

  // Stub Request.text
  Request.prototype.text = function () {
    return Promise.resolve(JSON.stringify(mockRequestBody));
  };

  // Stub Response.clone
  Response.prototype.clone = function () {
    return this;
  };

  // Stub Response.text
  Response.prototype.text = function () {
    return Promise.resolve(JSON.stringify(mockResponseBody));
  };

  try {
    // Set a fixed starting time for deterministic testing
    const startTime = Date.now() - 1000; // 1 second ago

    // Call the function under test
    await trackLlmEvent(
      mockRequest,
      mockResponse,
      startTime,
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
  } finally {
    // Restore original methods
    Request.prototype.clone = originalClone;
    Request.prototype.text = originalRequestText;
    Response.prototype.clone = originalResponseClone;
    Response.prototype.text = originalText;
  }
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

  // Create mock Request
  const mockRequest = new Request(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "gpt-3.5-turbo" }),
    },
  );

  // Create mock error Response
  const mockErrorResponse = new Response(
    JSON.stringify(mockErrorResponseBody),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // Stub methods
  const originalClone = Request.prototype.clone;
  const originalResponseClone = Response.prototype.clone;
  const originalText = Response.prototype.text;
  const originalRequestText = Request.prototype.text;

  Request.prototype.clone = function () {
    return this;
  };

  Request.prototype.text = function () {
    return Promise.resolve(JSON.stringify({ model: "gpt-3.5-turbo" }));
  };

  Response.prototype.clone = function () {
    return this;
  };

  Response.prototype.text = function () {
    return Promise.resolve(JSON.stringify(mockErrorResponseBody));
  };

  try {
    const startTime = Date.now() - 500;

    // Call the function under test with error response
    await trackLlmEvent(
      mockRequest,
      mockErrorResponse,
      startTime,
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
  } finally {
    // Restore original methods
    Request.prototype.clone = originalClone;
    Request.prototype.text = originalRequestText;
    Response.prototype.clone = originalResponseClone;
    Response.prototype.text = originalText;
  }
});
