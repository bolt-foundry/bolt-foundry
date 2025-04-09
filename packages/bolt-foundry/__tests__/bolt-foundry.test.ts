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

  // Create a stub for global fetch that returns the mock response
  using fetchStub = stub(
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

    user: "test-user-id",
  }, createBfMetadata({ store: false }));

  // Verify response
  assertEquals(completion.choices[0].message.role, "assistant");
  assertExists(completion.choices[0].message.content);

  // Verify fetch was called correctly
  assertSpyCalls(fetchStub, 1);

  // Verify the URL and headers were correct in the fetch call
  const fetchCall = fetchStub.calls[0];
  assert(fetchCall.args[0].toString().includes("/chat/completions"));
});
