#!/usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { PostHog } from "posthog-node";

// Create PostHog instance
const posthog = new PostHog("test-api-key", {
  host: "https://app.posthog.com",
  flushAt: 1, // Flush immediately in tests
  flushInterval: 0,
});

// Mock server request and response
const createMockRequest = (options: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}) => {
  const { url, method = "POST", headers = {}, body = {} } = options;

  return new Request(url, {
    method,
    headers: new Headers({
      "Content-Type": "application/json",
      ...headers,
    }),
    body: JSON.stringify(body),
  });
};

Deno.test("handleOpenAIRequest captures and logs API requests to PostHog", async () => {
  // Create a spy on posthog.capture
  const posthogCaptureSpy = spy(posthog, "capture");

  try {
    // Import the module with the handler function
    const { handleRequest } = await import("../collector.ts");

    // Create a mock request
    const mockRequest = createMockRequest({
      url: "http://localhost:8081/collect/request",
      headers: {
        "X-BoltFoundry-API-Key": "test-api-key",
        "X-Original-URL": "https://api.openai.com/v1/completions",
        "X-Original-Method": "POST",
        "X-Request-ID": "test-request-id",
      },
      body: {
        request: {
          model: "text-davinci-003",
          prompt:
            "Translate the following English text to French: 'Hello, how are you?'",
          temperature: 0.3,
        },
        response: {
          id: "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
          object: "text_completion",
          created: 1589478378,
          model: "text-davinci-003",
          choices: [
            {
              text: "\n\nBonjour, comment ça va?",
              index: 0,
              logprobs: null,
              finish_reason: "stop",
            },
          ],
        },
      },
    });

    // Handle the request
    const response = await handleRequest(mockRequest);
    const responseData = await response.json();

    // Assertions
    assertEquals(response.status, 200, "Response status should be 200");
    assertExists(responseData.success, "Response should indicate success");
    assertEquals(
      responseData.request_id,
      "test-request-id",
      "Response should include the request ID",
    );

    // Verify PostHog was called with the right data
    assertSpyCalls(posthogCaptureSpy, 1);

    const captureCall = posthogCaptureSpy.calls[0];
    assertEquals(captureCall.args[0].distinctId, "test-api-user");
    assertEquals(captureCall.args[0].event, "openai_api_request");

    const properties = captureCall.args[0].properties;
    assertEquals(properties?.url, "https://api.openai.com/v1/completions");
    assertEquals(properties?.method, "POST");
    assertExists(properties?.request);
    assertEquals(properties?.request_id, "test-request-id");
  } finally {
    // Restore the original function
    posthogCaptureSpy.restore();
  }
});

Deno.test("handleOpenAIRequest returns 401 when BoltFoundry API key is missing", async () => {
  // Import the module with the handler function
  const { handleRequest } = await import("../collector.ts");

  // Create a mock request without the API key
  const mockRequest = createMockRequest({
    url: "http://localhost:8081/collect/request",
    headers: {
      "X-Original-URL": "https://api.openai.com/v1/completions",
      "X-Original-Method": "POST",
    },
  });

  // Handle the request
  const response = await handleRequest(mockRequest);

  // Assertions
  assertEquals(
    response.status,
    401,
    "Response status should be 401 when API key is missing",
  );
});

Deno.test("handleOpenAIRequest returns 400 when original request details are missing", async () => {
  // Import the module with the handler function
  const { handleRequest } = await import("../collector.ts");

  // Create a mock request without original URL/method
  const mockRequest = createMockRequest({
    url: "http://localhost:8081/collect/request",
    headers: {
      "X-BoltFoundry-API-Key": "test-api-key",
    },
  });

  // Handle the request
  const response = await handleRequest(mockRequest);

  // Assertions
  assertEquals(
    response.status,
    400,
    "Response status should be 400 when original request details are missing",
  );
});
