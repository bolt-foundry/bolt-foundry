#! /usr/bin/env -S bff test

import { assert, assertEquals, assertExists } from "@std/assert";
import { assertSpyCalls, stub } from "@std/testing/mock";
import { connectBoltFoundry } from "@bolt-foundry/bolt-foundry";
import { OpenAI } from "@openai/openai";

Deno.test("createOpenAIFetch should properly integrate with OpenAI client", async () => {
  // Create a mock response similar to what OpenAI would return
  const mockResponse = {
    id: "mock-id",
    object: "chat.completion",
    created: Date.now(),
    model: "gpt-3.5-turbo",
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
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
  };

  // Create a stub for global fetch that returns appropriate responses
  const fetchStub = stub(
    globalThis,
    "fetch",
    (input: RequestInfo | URL) => {
      const url = input.toString();

      // For telemetry endpoint, return a simple OK response
      if (url.includes("i.bltfdy.co")) {
        return Promise.resolve(new Response("OK", { status: 200 }));
      }

      // For OpenAI API, return the mock response
      return Promise.resolve(
        new Response(
          JSON.stringify(mockResponse),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    },
  );

  // Create an OpenAI client with our custom fetch function
  const openai = new OpenAI({
    apiKey: "test-api-key",
    fetch: connectBoltFoundry("test-bf-key"),
  });

  // Use the OpenAI SDK to make a request
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: "Hello, world!",
      },
    ],
  });

  // Verify response
  assertEquals(completion.choices[0].message.role, "assistant");
  assertExists(completion.choices[0].message.content);

  // Wait a bit for any async operations to settle
  await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

  // We should have 2 calls: OpenAI + telemetry
  assertSpyCalls(fetchStub, 2);

  // Verify the first call was to OpenAI
  const openAICall = fetchStub.calls[0];
  assert(openAICall.args[0].toString().includes("/chat/completions"));

  // Verify the second call was telemetry
  const telemetryCall = fetchStub.calls[1];
  assert(telemetryCall.args[0].toString().includes("i.bltfdy.co"));

  // Clean up the stub to prevent resource leaks
  fetchStub.restore();
});
