#! /usr/bin/env -S bff test
import { assertEquals, assertObjectMatch } from "@std/assert";
import { calculateLlmCost, trackLlmEvent } from "../llm-event-tracker.ts";
import type { JSONValue } from "@bfmono/apps/bfDb/bfDb.ts";
import type { PostHog } from "posthog-node";
import type {
  OpenAIRequestBody,
  OpenAIResponseBody,
  TelemetryData,
} from "@bfmono/packages/bolt-foundry/bolt-foundry.ts";

type PostHogEvent = {
  event: string;
  distinctId?: string;
  properties: Record<string, JSONValue>;
  groups?: Record<string, string>;
};

// Create a mock for the PostHog client
class MockPostHog {
  events: Array<PostHogEvent> = [];
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

Deno.test("trackLlmEvent captures and sends OpenAI chat completion analytics correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock request and response objects
  const mockRequestBody = {
    model: "gpt-4o",
    messages: [
      { role: "user", content: "Hello" },
    ],
    temperature: 0.7,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: { type: "text" },
    reasoning_effort: 0.5,
    user: "test-user-id",
  };

  const mockResponseBody = {
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677825464,
    model: "gpt-4o",
    system_fingerprint: "fp_44709d6fcb",
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
      reasoning_tokens: 5,
      cache_read_input_tokens: 0,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content: "Hello there!",
        },
        finish_reason: "stop",
        index: 0,
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
    provider: "openai",
    providerApiVersion: "v1",
    sessionId: "test-session-123",
    userId: "test-user-456",
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
  assertEquals(capturedEvent.event, "$ai_generation");

  // Check that PostHog properties include the expected AI schema properties
  const properties = capturedEvent.properties;
  // Check basic properties without nested objects
  assertObjectMatch(properties, {
    "$ai_provider": "openai",
    "$ai_model": "gpt-4o",
    "$ai_api_type": "chat",
    "$ai_input_tokens": 10,
    "$ai_output_tokens": 20,
    "$ai_total_tokens": 30,
    "$ai_response_id": "chatcmpl-123",
    "$ai_is_error": false,
    "$ai_http_status": 200,
    "$ai_base_url": "https://api.openai.com/v1",
    "$ai_reasoning_tokens": 5,
    "$ai_cache_read_input_tokens": 0,
    "endpoint": "chat.completions",
    "success": true,
    "request_method": "POST",
  });

  // Check model parameters separately with proper type assertion
  const modelParams = properties["$ai_model_parameters"] as Record<
    string,
    JSONValue
  >;
  assertEquals(modelParams.temperature, 0.7);
  assertEquals(modelParams.max_tokens, 150);
  assertEquals(modelParams.top_p, 1);
  assertEquals(modelParams.frequency_penalty, 0);
  assertEquals(modelParams.presence_penalty, 0);
  assertEquals(modelParams.message_count, 1);
  assertObjectMatch(modelParams.response_format as Record<string, JSONValue>, {
    type: "text",
  });
  assertEquals(modelParams.reasoning_effort, 0.5);
  assertEquals(modelParams.user, "test-user-id");

  // Verify trace ID and input/output fields are present
  assertEquals(typeof properties.$ai_trace_id, "string");
  assertEquals(Array.isArray(properties.$ai_input), true);
  assertEquals(Array.isArray(properties.$ai_output_choices), true);

  // Verify cost calculation is included and is reasonable
  assertEquals(typeof properties.cost, "number");
  // gpt-4o costs: $0.0025 per 1K input tokens, $0.01 per 1K output tokens
  // so 10 input tokens ($0.000025) + 20 output tokens ($0.0002) = $0.000225
  const expectedCost = 0.000225;
  assertEquals(
    Math.abs((properties.cost as number) - expectedCost) < 0.0001,
    true,
  );
});

Deno.test("trackLlmEvent handles OpenAI embedding requests correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock embedding request and response
  const mockRequestBody = {
    model: "text-embedding-3-large",
    input: "The food was delicious and the service was excellent.",
    dimensions: 768,
    encoding_format: "float",
    user: "embedding-user",
  };

  const mockResponseBody = {
    object: "list",
    data: [
      {
        object: "embedding",
        embedding: [0.0023064255, -0.009327292 /* ...more values... */],
        index: 0,
      },
    ],
    model: "text-embedding-3-large",
    usage: {
      prompt_tokens: 10,
      total_tokens: 10,
    },
  };

  // Create telemetry data for embedding request
  const telemetryData: TelemetryData = {
    request: {
      url: "https://api.openai.com/v1/embeddings",
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
    duration: 500, // 0.5 seconds
    timestamp: new Date().toISOString(),
    provider: "openai",
    providerApiVersion: "v1",
  };

  // Call the function with embedding data
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
  );

  // Assert that PostHog capture was called with correct parameters
  assertEquals(mockPosthog.events.length, 1);

  const capturedEvent = mockPosthog.events[0];
  assertEquals(capturedEvent.event, "$ai_embedding");

  // Check embedding-specific properties
  const properties = capturedEvent.properties;
  assertObjectMatch(properties, {
    "$ai_provider": "openai",
    "$ai_model": "text-embedding-3-large",
    "$ai_api_type": "embedding",
    "$ai_input_tokens": 10,
    "$ai_total_tokens": 10,
    "$ai_is_error": false,
    "$ai_latency": 0.5,
    "endpoint": "embeddings",
  });

  // Check model parameters separately
  const modelParams = properties["$ai_model_parameters"] as Record<
    string,
    JSONValue
  >;
  assertEquals(modelParams.dimensions, 768);
  assertEquals(modelParams.encoding_format, "float");
  assertEquals(modelParams.user, "embedding-user");

  // Verify cost calculation is correct for embeddings
  // text-embedding-3-large costs $0.00013 per 1K tokens
  // so 10 tokens = $0.0000013
  const expectedCost = 0.0000013;
  assertEquals(
    Math.abs((properties.cost as number) - expectedCost) < 0.0000001,
    true,
  );
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
      param: null,
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
      body: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }],
      } as OpenAIRequestBody,
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
    provider: "openai",
    providerApiVersion: "v1",
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
  assertEquals(properties["$ai_error"], mockErrorResponseBody.error);
  assertEquals(properties["$ai_provider"], "openai");
  assertEquals(properties["$ai_api_type"], "chat");
});

Deno.test("trackLlmEvent respects privacy mode", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock request and response objects
  const mockRequestBody = {
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: "Private content that shouldn't be sent" },
    ],
    temperature: 0.7,
  };

  const mockResponseBody = {
    id: "chatcmpl-456",
    object: "chat.completion",
    created: 1677825464,
    model: "gpt-4-turbo",
    usage: {
      prompt_tokens: 15,
      completion_tokens: 25,
      total_tokens: 40,
      reasoning_tokens: 8,
      cache_read_input_tokens: 2,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content: "Private response that shouldn't be sent",
        },
        finish_reason: "stop",
        index: 0,
      },
    ],
  };

  // Create telemetry data
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
    duration: 1500,
    timestamp: new Date().toISOString(),
    sessionId: "private-session-123",
    userId: "private-user-456",
    provider: "openai",
    providerApiVersion: "v1",
  };

  // Call the function with privacy mode enabled
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
    { privacyMode: true },
  );

  // Assert that PostHog was called
  assertEquals(mockPosthog.events.length, 1);

  const capturedEvent = mockPosthog.events[0];
  const properties = capturedEvent.properties;

  // Check that sensitive data is not included
  assertEquals(properties["$ai_input"], undefined);
  assertEquals(properties["$ai_output_choices"], undefined);

  // But metadata should still be included
  assertEquals(properties["$ai_model"], "gpt-4-turbo");
  assertEquals(properties["$ai_input_tokens"], 15);
  assertEquals(properties["$ai_output_tokens"], 25);
  assertEquals(properties["$ai_total_tokens"], 40);
  assertEquals(properties["$ai_reasoning_tokens"], 8);
  assertEquals(properties["$ai_cache_read_input_tokens"], 2);
});

Deno.test("trackLlmEvent handles custom options correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock request and response objects
  const mockRequestBody = {
    model: "claude-3-sonnet",
    messages: [
      { role: "user", content: "Hello" },
    ],
    temperature: 0.5,
    top_p: 0.9,
    user: "user-abc123",
  };

  const mockResponseBody = {
    id: "chatcmpl-789",
    usage: {
      prompt_tokens: 5,
      completion_tokens: 10,
      total_tokens: 15,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content: "Hi there!",
        },
        finish_reason: "stop",
      },
    ],
  };

  // Create telemetry data with provider-specific information
  const telemetryData: TelemetryData = {
    request: {
      url: "https://api.anthropic.com/v1/messages",
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
    duration: 800,
    timestamp: new Date().toISOString(),
    provider: "anthropic",
    providerApiVersion: "v1",
  };

  // Custom options
  const customOptions = {
    distinctId: "test_user_123",
    traceId: "custom_trace_456",
    groups: { organization: "org_789" },
    additionalProperties: {
      conversation_id: "conv_101112",
      custom_metadata: { category: "greeting" },
    },
  };

  // Call the function with custom options
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
    customOptions,
  );

  // Assert that PostHog was called
  assertEquals(mockPosthog.events.length, 1);

  const capturedEvent = mockPosthog.events[0];

  // Verify distinctId was used
  assertEquals(capturedEvent.distinctId, "test_user_123");

  // Verify groups were included
  assertEquals(capturedEvent.groups, { organization: "org_789" });

  // Verify custom traceId and additional properties
  const properties = capturedEvent.properties;
  assertEquals(properties["$ai_trace_id"], "custom_trace_456");
  assertEquals(properties["conversation_id"], "conv_101112");
  assertEquals(
    (properties["custom_metadata"] as Record<string, JSONValue>).category,
    "greeting",
  );

  // Verify provider info was passed correctly
  assertEquals(properties["$ai_provider"], "anthropic");

  // Verify model parameters were captured
  const modelParams = properties["$ai_model_parameters"] as Record<
    string,
    JSONValue
  >;
  assertEquals(modelParams.temperature, 0.5);
  assertEquals(modelParams.top_p, 0.9);
  assertEquals(modelParams.user, "user-abc123");
});

Deno.test("trackLlmEvent handles tools/functions correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock request with tools
  const mockRequestBody = {
    model: "gpt-4o",
    messages: [
      { role: "user", content: "What's the weather in New York?" },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Get the current weather in a given location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["celsius", "fahrenheit"],
                description: "The unit of temperature to use",
              },
            },
            required: ["location"],
          },
        },
      },
    ],
    temperature: 0.7,
  };

  const mockResponseBody = {
    id: "chatcmpl-abc123",
    object: "chat.completion",
    created: 1677825464,
    model: "gpt-4o",
    usage: {
      prompt_tokens: 25,
      completion_tokens: 35,
      total_tokens: 60,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content: null,
          tool_calls: [
            {
              id: "call_abc123",
              type: "function",
              function: {
                name: "get_weather",
                arguments: '{"location":"New York, NY","unit":"fahrenheit"}',
              },
            },
          ],
        },
        finish_reason: "tool_calls",
        index: 0,
      },
    ],
  };

  // Create telemetry data with tools
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
    duration: 1200,
    timestamp: new Date().toISOString(),
    provider: "openai",
    providerApiVersion: "v1",
  };

  // Call the function
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
  );

  // Assert that PostHog was called
  assertEquals(mockPosthog.events.length, 1);

  const capturedEvent = mockPosthog.events[0];
  const properties = capturedEvent.properties;

  // Verify tools were captured correctly
  assertEquals(Array.isArray(properties["$ai_tools"]), true);
  const tools = properties["$ai_tools"] as Array<JSONValue>;
  // We need to compare each tool since direct comparison might not work
  mockRequestBody.tools.forEach((tool, index) => {
    assertObjectMatch(tools[index] as Record<string, JSONValue>, tool);
  });

  // Verify other properties
  assertEquals(properties["$ai_model"], "gpt-4o");
  assertEquals(properties["$ai_api_type"], "chat");
  assertEquals(properties["$ai_input_tokens"], 25);
  assertEquals(properties["$ai_output_tokens"], 35);
  assertEquals(properties["$ai_total_tokens"], 60);
});

Deno.test("trackLlmEvent handles image generation requests correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock image generation request and response
  const mockRequestBody = {
    model: "dall-e-3",
    prompt: "A serene landscape with mountains and a lake at sunset",
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    user: "image-user",
  };

  const mockResponseBody = {
    created: 1677825464,
    data: [
      {
        url: "https://example.com/image.png",
        revised_prompt:
          "A serene landscape with majestic mountains and a crystal clear lake reflecting the vibrant colors of sunset",
      },
    ],
  };

  // Create telemetry data for image generation
  const telemetryData: TelemetryData = {
    request: {
      url: "https://api.openai.com/v1/images/generations",
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
    duration: 3000, // 3 seconds
    timestamp: new Date().toISOString(),
    provider: "openai",
    providerApiVersion: "v1",
  };

  // Call the function
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
  );

  // Assert that PostHog was called
  assertEquals(mockPosthog.events.length, 1);

  const capturedEvent = mockPosthog.events[0];
  assertEquals(capturedEvent.event, "$ai_image_operation");

  // Verify image-specific properties
  const properties = capturedEvent.properties;
  assertObjectMatch(properties, {
    "$ai_provider": "openai",
    "$ai_model": "dall-e-3",
    "$ai_api_type": "image",
    "$ai_latency": 3.0,
    "$ai_is_error": false,
    "endpoint": "images.generations",
  });

  // Check model parameters separately
  const modelParams = properties["$ai_model_parameters"] as Record<
    string,
    JSONValue
  >;
  assertEquals(modelParams.size, "1024x1024");
  assertEquals(modelParams.quality, "standard");
  assertEquals(modelParams.style, "vivid");
  assertEquals(modelParams.user, "image-user");
});

Deno.test("calculateLlmCost provides correct cost estimates", () => {
  // Test OpenAI model pricing
  assertEquals(calculateLlmCost("gpt-4o", 1000, 500), 0.0075); // 1000 * 0.0025/1K + 500 * 0.01/1K
  assertEquals(calculateLlmCost("gpt-3.5-turbo", 1000, 500), 0.002); // 1000 * 0.001/1K + 500 * 0.002/1K
  assertEquals(calculateLlmCost("gpt-4", 1000, 500), 0.06); // 1000 * 0.03/1K + 500 * 0.06/1K

  // Test Anthropic model pricing
  assertEquals(calculateLlmCost("claude-3-opus", 1000, 500), 0.0525); // 1000 * 0.015/1K + 500 * 0.075/1K
  assertEquals(
    calculateLlmCost("claude-3-sonnet", 1000, 500),
    0.010499999999999999,
  ); // 1000 * 0.003/1K + 500 * 0.015/1K
  assertEquals(calculateLlmCost("claude-3.5-sonnet", 1000, 500), 0.014); // 1000 * 0.004/1K + 500 * 0.02/1K
  assertEquals(calculateLlmCost("claude-3.7-sonnet", 1000, 500), 0.0175); // 1000 * 0.005/1K + 500 * 0.025/1K

  // Test embedding model pricing
  assertEquals(calculateLlmCost("text-embedding-3-small", 1000, 0), 0.00002); // 1000 * 0.00002/1K
  assertEquals(calculateLlmCost("text-embedding-3-large", 1000, 0), 0.00013); // 1000 * 0.00013/1K

  // Test Mistral model pricing
  assertEquals(calculateLlmCost("mistral-small", 1000, 500), 0.005); // 1000 * 0.002/1K + 500 * 0.006/1K
  assertEquals(calculateLlmCost("mistral-medium", 1000, 500), 0.02); // 1000 * 0.008/1K + 500 * 0.024/1K

  // Test partial model name matching fallback
  assertEquals(calculateLlmCost("gpt-4-1106-preview", 1000, 500), 0.025); // Should match gpt-4-turbo pricing
  assertEquals(calculateLlmCost("gpt-3.5-turbo-0125", 1000, 500), 0.00125); // Should match specific pricing
  assertEquals(calculateLlmCost("embedding-model-unknown", 1000, 0), 0.00002); // Should default to text-embedding-3-small

  // Test unknown model (defaults to gpt-3.5-turbo pricing)
  assertEquals(calculateLlmCost("unknown-model", 1000, 500), 0.002);
});

Deno.test("trackLlmEvent handles batch operations correctly", async () => {
  // Set up mock PostHog client
  const mockPosthog = new MockPostHog();

  // Mock batch request and response
  const mockRequestBody = {
    requests: [
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }],
      },
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hi there" }],
      },
    ],
  };

  const mockResponseBody = {
    id: "batch-123",
    object: "batch",
    created: 1677825464,
    usage: {
      prompt_tokens: 20,
      completion_tokens: 30,
      total_tokens: 50,
    },
    data: [
      {
        id: "chatcmpl-123",
        choices: [{ message: { content: "Hello there!" } }],
      },
      {
        id: "chatcmpl-124",
        choices: [{ message: { content: "Hi, how can I help you?" } }],
      },
    ],
  };

  // Create telemetry data for batch operation
  const telemetryData: TelemetryData = {
    request: {
      url: "https://api.openai.com/v1/batches",
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
    duration: 2000,
    timestamp: new Date().toISOString(),
    provider: "openai",
    providerApiVersion: "v1",
  };

  // Call the function
  await trackLlmEvent(
    telemetryData,
    mockPosthog as unknown as PostHog,
  );

  // Assert that PostHog was called
  assertEquals(mockPosthog.events.length, 1);

  const capturedEvent = mockPosthog.events[0];
  assertEquals(capturedEvent.event, "$ai_batch_operation");

  // Verify batch-specific properties
  const properties = capturedEvent.properties;
  assertObjectMatch(properties, {
    "$ai_provider": "openai",
    "$ai_model": "gpt-3.5-turbo", // Should extract from first request
    "$ai_api_type": "batch",
    "$ai_input_tokens": 20,
    "$ai_output_tokens": 30,
    "$ai_total_tokens": 50,
    "$ai_response_id": "batch-123",
    "endpoint": "batches",
  });
});
