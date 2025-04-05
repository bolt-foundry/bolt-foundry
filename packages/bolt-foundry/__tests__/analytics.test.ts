import { createOpenAIFetch } from "../bolt-foundry.ts";
// import { getLogger } from "@bolt-foundry/logger";
import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";
import { PostHog } from "posthog-node";

const posthogClient = new PostHog("test-api-key");
// const logger = getLogger(import.meta);

Deno.test("OpenAI events should follow PostHog AI schema", async () => {
  // Create a mock response for OpenAI
  const mockResponse = {
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677858242,
    model: "gpt-3.5-turbo",
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    },
    choices: [
      {
        message: { role: "assistant", content: "Hi there!" },
        finish_reason: "stop",
        index: 0,
      },
    ],
  };

  // Create a consistent timer to ensure deterministic latency values
  let currentTime = 1000;
  using _dateNowStub = stub(
    Date,
    "now",
    () => {
      // First call returns start time, second call returns end time
      const time = currentTime;
      // Simulate exactly 3ms passed
      currentTime += 3;
      return time;
    },
  );

  // Create a stub for global fetch that returns a proper Response with the mockResponse
  using _fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(
          JSON.stringify(mockResponse),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
  );

  // Create a stub for posthog capture with custom implementation
  using captureStub = stub(
    posthogClient,
    "capture",
    () => {
      // Return implementation doesn't matter, as we're just verifying the call
      return Promise.resolve();
    },
  );

  const interceptionFetch = createOpenAIFetch({
    openAiApiKey: "test-key",
    posthogClient,
  });

  // Act - using direct fetch call pattern instead of Request object
  await interceptionFetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      temperature: 0.7,
      max_tokens: 150,
    }),
  });

  // Assert - Check that required AI schema properties are present and correctly formatted
  assertSpyCalls(captureStub, 1);

  // Validate the full event structure including fixed latency value
  assertSpyCall(captureStub, 0, {
    args: [
      {
        event: "$ai_generation",
        distinctId: "bolt-foundry",
        properties: {
          "$ai_provider": "openai",
          "$ai_model": "gpt-3.5-turbo",
          "$ai_input_tokens": 10,
          "$ai_output_tokens": 20,
          "$ai_total_tokens": 30,
          "$ai_latency": 0.003, // Now we can test the exact value because we've mocked Date.now()
          "$ai_response_id": "chatcmpl-123",
          "$ai_input": [{ role: "user", content: "Hello" }],
          "$ai_output_choices": [
            {
              message: { role: "assistant", content: "Hi there!" },
              finish_reason: "stop",
              index: 0,
            },
          ],
          "$ai_model_parameters": {
            "temperature": 0.7,
            "max_tokens": 150,
            "top_p": undefined,
          },
          "$ai_base_url": "https://api.openai.com/v1",
          "$ai_cost": 0.00005,
          "$ai_http_status": 200,
          "$ai_is_error": false,
        },
      },
    ],
  });
});
