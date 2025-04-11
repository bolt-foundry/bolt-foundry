#! /usr/bin/env -S bff test
import { assert, assertEquals, assertExists } from "@std/assert";
import { assertSpyCalls, stub } from "@std/testing/mock";
import { connectBoltFoundry } from "@bolt-foundry/bolt-foundry";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

// Import the mocked OpenAI class
import { OpenAI } from "util/mocks/openai.ts";

Deno.test("createOpenAIFetch should properly integrate with OpenAI client", async () => {
  // Create a stub for the fetch function that will be passed to the OpenAI client
  using fetchStub = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(
      new Response(
        JSON.stringify({
          id: `mock-completion-${Date.now()}`,
          object: "chat.completion",
          created: Date.now(),
          model: "gpt-4",
          usage: {
            prompt_tokens: 20,
            completion_tokens: 30,
            total_tokens: 50,
          },
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "This is a mock response from the gpt-4 model.",
              },
              finish_reason: "stop",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ),
  );

  // Create an OpenAI client with our custom fetch function
  const openai = new OpenAI({
    apiKey: "valid-api-key", // Using a key that will be accepted by the mock
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

  // Verify fetch was called correctly
  assertSpyCalls(fetchStub, 1);

  // Verify the URL and headers were correct in the fetch call
  const fetchCall = fetchStub.calls[0];
  assert(fetchCall.args[0].toString().includes("/chat/completions"));
});
