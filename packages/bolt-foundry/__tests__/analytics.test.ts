import { assertEquals, assertExists } from "@std/assert";
import { createOpenAIFetch } from "../bolt-foundry.ts";
import { createMockOpenAi } from "./utils/mock-openai.ts";

// Mock for PostHog
const mockPostHogCapture = {
  capture: (
    eventName: string,
    distinctId: string,
    properties: Record<string, unknown>,
  ) => {
    return { eventName, distinctId, properties };
  },
};

// Test for manual event capture
Deno.test("Manual LLM event capture with metadata", async () => {
  let capturedEventName: string | null = null;
  let capturedProperties: Record<string, unknown> = {};

  // Create a mock PostHog client
  const mockPostHog = {
    ...mockPostHogCapture,
    capture: (
      eventName: string,
      distinctId: string,
      properties: Record<string, unknown>,
    ) => {
      capturedEventName = eventName;
      capturedProperties = properties;
      return mockPostHogCapture.capture(eventName, distinctId, properties);
    },
  };

  // Create OpenAI fetch with PostHog
  const openAiFetch = createOpenAIFetch({
    openAiApiKey: "test-api-key",
    posthogClient: mockPostHog,
  });

  // Manually capture an LLM event with metadata
  const event = "llm_request";
  const properties = {
    prompt: "What is the capital of France?",
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 100,
    user_id: "test-user",
    conversation_id: "test-conversation-id",
    message_id: "test-message-id",
  };

  // Using the utility function in bolt-foundry.ts to manually track an event
  await openAiFetch.trackLlmEvent(event, properties);

  // Verify event was captured
  assertEquals(capturedEventName, event);
  assertEquals(capturedProperties.prompt, properties.prompt);
  assertEquals(capturedProperties.model, properties.model);
  assertEquals(capturedProperties.temperature, properties.temperature);
  assertEquals(capturedProperties.user_id, properties.user_id);
});

Deno.test("PostHog integration should track OpenAI API calls", async () => {
  // Setup a mock fetch to capture the request
  let _capturedUrl: string | null = null;
  let _capturedOptions: RequestInit | null = null;
  let analyticsEventCaptured = false;
  let analyticsProperties: Record<string, unknown> = {};

  const mockFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    _capturedUrl = input.toString();
    _capturedOptions = init || {};

    // Return a mock response similar to what OpenAI would return

    return Promise.resolve(
      new Response(
        JSON.stringify({
          id: "mock-id",
          object: "chat.completion",
          created: Date.now(),
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "Mock response text",
              },
              finish_reason: "stop",
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  };

  // Replace global fetch with our mock
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch as typeof fetch;

  // Create a mock PostHog client
  const mockPostHog = {
    ...mockPostHogCapture,
    capture: (
      eventName: string,
      distinctId: string,
      properties: Record<string, unknown>,
    ) => {
      analyticsEventCaptured = true;
      analyticsProperties = properties;
      return mockPostHogCapture.capture(eventName, distinctId, properties);
    },
  };

  try {
    // Create an OpenAI wrapper with PostHog analytics
    const openAiFetch = createOpenAIFetch({
      openAiApiKey: "test-api-key",
      posthogClient: mockPostHog,
    });

    // Create a MockOpenAi instance with our wrapper
    const openai = createMockOpenAi({
      fetch: openAiFetch,
    });

    Deno.test("Track LLM generation with PostHog AI format", async () => {
      let capturedEventName: string | null = null;
      let capturedProperties: Record<string, unknown> = {};

      // Create a mock PostHog client
      const mockPostHog = {
        ...mockPostHogCapture,
        capture: (
          eventName: string,
          distinctId: string,
          properties: Record<string, unknown>,
        ) => {
          capturedEventName = eventName;
          capturedProperties = properties;
          return mockPostHogCapture.capture(eventName, distinctId, properties);
        },
      };

      // Create OpenAI fetch with PostHog
      const openAiFetch = createOpenAIFetch({
        openAiApiKey: "test-api-key",
        posthogClient: mockPostHog,
      });

      // Sample input/output for the test
      const input = [{
        role: "user",
        content: "Tell me a fun fact about hedgehogs",
      }];
      const output = [{
        role: "assistant",
        content: "Hedgehogs are small mammals with spines on their back.",
      }];

      // Manually capture an LLM generation event using PostHog AI format
      await openAiFetch.trackLlmEvent("$ai_generation", {
        distinct_id: "test-user-123",
        $ai_trace_id: "trace-123456",
        $ai_model: "gpt-4",
        $ai_provider: "openai",
        $ai_input: JSON.stringify(input),
        $ai_input_tokens: 50,
        $ai_output_choices: JSON.stringify(output),
        $ai_output_tokens: 100,
        $ai_latency: 1.23,
        $ai_http_status: 200,
        $ai_base_url: "https://api.openai.com/v1",
        $ai_is_error: false,
        conversation_id: "abc123",
        paid: true,
      });

      // Verify event was captured with the right properties
      assertEquals(capturedEventName, "$ai_generation");
      assertEquals(capturedProperties.$ai_model, "gpt-4");
      assertEquals(capturedProperties.$ai_provider, "openai");
      assertEquals(capturedProperties.$ai_input_tokens, 50);
      assertEquals(capturedProperties.$ai_output_tokens, 100);
      assertEquals(capturedProperties.$ai_latency, 1.23);
      assertEquals(capturedProperties.$ai_trace_id, "trace-123456");
      assertEquals(capturedProperties.conversation_id, "abc123");
      assertEquals(capturedProperties.paid, true);

      // Check that input and output are properly captured
      assertExists(capturedProperties.$ai_input);
      assertExists(capturedProperties.$ai_output_choices);

      // Parse the JSON strings to verify content
      const parsedInput = JSON.parse(capturedProperties.$ai_input as string);
      const parsedOutput = JSON.parse(
        capturedProperties.$ai_output_choices as string,
      );

      assertEquals(parsedInput[0].role, "user");
      assertEquals(
        parsedInput[0].content,
        "Tell me a fun fact about hedgehogs",
      );
      assertEquals(parsedOutput[0].role, "assistant");
      assertEquals(
        parsedOutput[0].content,
        "Hedgehogs are small mammals with spines on their back.",
      );
    });

    // Make a request
    await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Hello, world!",
        },
      ],
    });

    // Verify analytics was captured
    assertEquals(analyticsEventCaptured, true);
    assertExists(analyticsProperties.$ai_model);
    assertExists(analyticsProperties.timestamp);
    assertEquals(analyticsProperties.endpoint, "chat.completions");
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch;
  }
});

Deno.test("Analytics should track token usage and response time", async () => {
  // Setup a mock fetch to capture the request
  let _capturedUrl: string | null = null;
  let _capturedOptions: RequestInit | null = null;
  let analyticsEventCaptured = false;
  let analyticsProperties: Record<string, unknown> = {};

  const mockFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    _capturedUrl = input.toString();
    _capturedOptions = init || {};

    // Return a mock response with token usage information
    return Promise.resolve(
      new Response(
        JSON.stringify({
          id: "mock-id",
          object: "chat.completion",
          created: Date.now(),
          model: "gpt-3.5-turbo",
          usage: {
            prompt_tokens: 10,
            completion_tokens: 15,
            total_tokens: 25,
          },
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "Mock response text",
              },
              finish_reason: "stop",
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  };

  // Replace global fetch with our mock
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch as typeof fetch;

  // Create a mock PostHog client
  const mockPostHog = {
    ...mockPostHogCapture,
    capture: (
      eventName: string,
      distinctId: string,
      properties: Record<string, unknown>,
    ) => {
      analyticsEventCaptured = true;
      analyticsProperties = properties;
      return mockPostHogCapture.capture(eventName, distinctId, properties);
    },
  };

  try {
    // Create an OpenAI wrapper with PostHog analytics
    const openAiFetch = createOpenAIFetch({
      openAiApiKey: "test-api-key",
      posthogClient: mockPostHog,
    });

    // Create a MockOpenAi instance with our wrapper
    const openai = createMockOpenAi({
      fetch: openAiFetch,
    });

    // Make a request
    await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Hello, world!",
        },
      ],
    });

    // Verify token usage was captured
    assertEquals(analyticsEventCaptured, true);
    assertExists(analyticsProperties.$ai_input_tokens);
    assertExists(analyticsProperties.$ai_output_tokens);
    assertExists(analyticsProperties.total_tokens);
    assertExists(analyticsProperties.response_time_ms);
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch;
  }
});

Deno.test("Track LLM error with PostHog AI format", async () => {
  let capturedEventName: string | null = null;
  let capturedProperties: Record<string, unknown> = {};

  // Create a mock PostHog client
  const mockPostHog = {
    ...mockPostHogCapture,
    capture: (
      eventName: string,
      distinctId: string,
      properties: Record<string, unknown>,
    ) => {
      capturedEventName = eventName;
      capturedProperties = properties;
      return mockPostHogCapture.capture(eventName, distinctId, properties);
    },
  };

  // Create OpenAI fetch with PostHog
  const openAiFetch = createOpenAIFetch({
    openAiApiKey: "test-api-key",
    posthogClient: mockPostHog,
  });

  // Sample input for the test
  const input = [{ role: "user", content: "This request will fail" }];
  const errorMessage = "Rate limit exceeded";

  // Manually capture an LLM error event using PostHog AI format
  await openAiFetch.trackLlmEvent("$ai_generation", {
    distinct_id: "test-user-123",
    $ai_trace_id: "error-trace-789",
    $ai_model: "gpt-4",
    $ai_provider: "openai",
    $ai_input: JSON.stringify(input),
    $ai_input_tokens: 25,
    $ai_output_choices: null,
    $ai_output_tokens: 0,
    $ai_latency: 0.45,
    $ai_http_status: 429,
    $ai_base_url: "https://api.openai.com/v1",
    $ai_is_error: true,
    $ai_error: errorMessage,
    conversation_id: "error-conversation-789",
  });

  // Verify event was captured with the right properties
  assertEquals(capturedEventName, "$ai_generation");
  assertEquals(capturedProperties.$ai_model, "gpt-4");
  assertEquals(capturedProperties.$ai_provider, "openai");
  assertEquals(capturedProperties.$ai_http_status, 429);
  assertEquals(capturedProperties.$ai_is_error, true);
  assertEquals(capturedProperties.$ai_error, errorMessage);
  assertEquals(capturedProperties.$ai_trace_id, "error-trace-789");
  assertEquals(capturedProperties.conversation_id, "error-conversation-789");
});

Deno.test("Should work with PostHog API key instead of client", async () => {
  // Setup a mock fetch to capture the request
  const capturedUrls: string[] = [];
  const capturedOptions: Record<string, RequestInit> = {};
  let posthogRequestMade = false;

  const mockFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    capturedUrls.push(url);
    capturedOptions[url] = init || {};

    // If this is a request to PostHog
    if (url.includes("posthog")) {
      posthogRequestMade = true;
      return Promise.resolve(
        new Response(
          JSON.stringify({ status: "success" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    }

    // Otherwise it's an OpenAI request
    return Promise.resolve(
      new Response(
        JSON.stringify({
          id: "mock-id",
          object: "chat.completion",
          created: Date.now(),
          model: "gpt-3.5-turbo",
          usage: {
            prompt_tokens: 10,
            completion_tokens: 15,
            total_tokens: 25,
          },
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "Mock response text",
              },
              finish_reason: "stop",
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  };

  // Replace global fetch with our mock
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch as typeof fetch;

  try {
    // Create an OpenAI wrapper with PostHog API key
    const openAiFetch = createOpenAIFetch({
      openAiApiKey: "test-api-key",
      posthogApiKey: "test-posthog-key",
      posthogHost: "https://app.posthog.com",
    });

    // Create a MockOpenAi instance with our wrapper
    const openai = createMockOpenAi({
      fetch: openAiFetch,
    });

    // Make a request
    await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Hello, world!",
        },
      ],
    });

    // Verify that the fetch was called with OpenAI URL
    assertEquals(
      capturedUrls.some((url) => url.includes("api.openai.com")),
      true,
    );

    // Verify that a PostHog request was made
    assertEquals(posthogRequestMade, true);

    // Verify that PostHog request included the API key
    const posthogUrl = capturedUrls.find((url) => url.includes("posthog"));
    if (posthogUrl) {
      // Check that we're using the correct endpoint
      assertEquals(
        posthogUrl.includes("/capture/"),
        true,
        "Should use the /capture/ endpoint",
      );

      const body = JSON.parse(capturedOptions[posthogUrl].body as string);
      assertEquals(body.api_key, "test-posthog-key");
      assertEquals(
        typeof body.distinct_id,
        "string",
        "Should have a distinct_id",
      );
      assertEquals(typeof body.timestamp, "string", "Should have a timestamp");
      assertEquals(typeof body.event, "string", "Should have an event name");

      // Check LLM observability specific properties if this is an AI event
      if (body.event === "$ai_generation") {
        assertExists(
          body.properties.$ai_model,
          "Should have $ai_model property",
        );
        assertExists(
          body.properties.$ai_provider,
          "Should have $ai_provider property",
        );
        if (!body.properties.$ai_is_error) {
          assertExists(
            body.properties.$ai_input,
            "Should have $ai_input property",
          );
          assertExists(
            body.properties.$ai_input_tokens,
            "Should have $ai_input_tokens property",
          );
          assertExists(
            body.properties.$ai_output_tokens,
            "Should have $ai_output_tokens property",
          );
        }
        assertExists(
          body.properties.$ai_latency,
          "Should have $ai_latency property",
        );
      }
    }
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch;
  }
});
