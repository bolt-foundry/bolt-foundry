#! /usr/bin/env -S bff test

import { assert, assertEquals, assertExists } from "@std/assert";
import { assertSpyCalls, stub } from "@std/testing/mock";
import {
  connectBoltFoundry,
  type TelemetryData,
} from "@bolt-foundry/bolt-foundry";
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

Deno.test("connectBoltFoundry should extract bfMetadata and send to telemetry", async () => {
  const mockResponse = {
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
  };

  // Type for OpenAI request with optional bfMetadata
  type OpenAIRequestWithBfMetadata = OpenAI.ChatCompletionCreateParams & {
    bfMetadata?: TelemetryData["bfMetadata"];
  };

  let openaiRequestBody: OpenAIRequestWithBfMetadata | null = null;
  let telemetryRequestBody: TelemetryData | null = null;

  // Create a stub for global fetch that captures request bodies
  const fetchStub = stub(
    globalThis,
    "fetch",
    (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      // For telemetry endpoint, capture the request body
      if (url.includes("i.bltfdy.co")) {
        telemetryRequestBody = init?.body
          ? (JSON.parse(init.body as string) as TelemetryData)
          : null;
        return Promise.resolve(new Response("OK", { status: 200 }));
      }

      // For OpenAI API, capture the request body and return mock response
      if (url.includes("api.openai.com")) {
        openaiRequestBody = init?.body
          ? (JSON.parse(init.body as string) as OpenAIRequestWithBfMetadata)
          : null;
        return Promise.resolve(
          new Response(
            JSON.stringify(mockResponse),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        );
      }

      return Promise.resolve(new Response("Not Found", { status: 404 }));
    },
  );

  // Create an OpenAI client with our custom fetch function
  const openai = new OpenAI({
    apiKey: "test-api-key",
    fetch: connectBoltFoundry("test-bf-key"),
  });

  // Make a request with bfMetadata
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: "Hello, world!",
      },
    ],
    // @ts-expect-error - Adding bfMetadata to the request
    bfMetadata: {
      deckName: "test-deck",
      deckContent: "# Test Deck\n\nThis is a test deck.",
      contextVariables: { userId: "test-user", feature: "chat" },
    },
  });

  // Verify response
  assertEquals(completion.choices[0].message.role, "assistant");
  assertExists(completion.choices[0].message.content);

  // Wait for async operations to settle
  await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

  // Verify bfMetadata was stripped from OpenAI request
  assert(
    !openaiRequestBody!.bfMetadata,
    "bfMetadata should be stripped from OpenAI request",
  );

  // Verify bfMetadata was sent to telemetry
  assert(
    telemetryRequestBody!.bfMetadata,
    "bfMetadata should be present in telemetry",
  );
  assertEquals(telemetryRequestBody!.bfMetadata!.deckName, "test-deck");
  assertEquals(
    telemetryRequestBody!.bfMetadata!.deckContent,
    "# Test Deck\n\nThis is a test deck.",
  );
  assertEquals(
    telemetryRequestBody!.bfMetadata!.contextVariables.userId,
    "test-user",
  );

  // Clean up the stub
  fetchStub.restore();
});

Deno.test("connectBoltFoundry should work normally without bfMetadata", async () => {
  const mockResponse = {
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
  };

  let telemetryRequestBody: TelemetryData | null = null;

  // Create a stub for global fetch
  const fetchStub = stub(
    globalThis,
    "fetch",
    (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      // For telemetry endpoint, capture the request body
      if (url.includes("i.bltfdy.co")) {
        telemetryRequestBody = init?.body
          ? (JSON.parse(init.body as string) as TelemetryData)
          : null;
        return Promise.resolve(new Response("OK", { status: 200 }));
      }

      // For OpenAI API, return mock response
      if (url.includes("api.openai.com")) {
        return Promise.resolve(
          new Response(
            JSON.stringify(mockResponse),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        );
      }

      return Promise.resolve(new Response("Not Found", { status: 404 }));
    },
  );

  // Create an OpenAI client with our custom fetch function
  const openai = new OpenAI({
    apiKey: "test-api-key",
    fetch: connectBoltFoundry("test-bf-key"),
  });

  // Make a normal request without bfMetadata
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

  // Wait for async operations to settle
  await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

  // Verify telemetry was sent without bfMetadata
  assert(
    !telemetryRequestBody!.bfMetadata,
    "bfMetadata should not be present in telemetry",
  );

  // Clean up the stub
  fetchStub.restore();
});
