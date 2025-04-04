import { assert, assertEquals, assertExists } from "@std/assert";
import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";
import { createOpenAIFetch } from "../bolt-foundry.ts";

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

  // Get the wrapper
  const wrapper = createOpenAIFetch({
    openAiApiKey: "test-api-key",
  });

  // Make a request to OpenAI API
  const response = await wrapper("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Hello, world!",
        },
      ],
    }),
  });

  // Verify response
  const responseData = await response.json();
  assertEquals(responseData.choices[0].message.role, "assistant");
  assertExists(responseData.choices[0].message.content);

  // Verify fetch was called correctly
  assertSpyCalls(fetchStub, 1);

  // Verify the URL was correct
  assertSpyCall(fetchStub, 0, {
    args: [
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-api-key",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: "Hello, world!",
            },
          ],
        }),
      },
    ],
  });
});

Deno.test("createOpenAIFetch should not modify FormData requests to OpenAI", async () => {
  // Create a stub for global fetch to capture the request
  using fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
  );

  // Create a spy on FormData.prototype.append to verify it's not modified
  const formDataAppendSpy = stub(
    FormData.prototype,
    "append",
    FormData.prototype.append,
  );

  // Create a wrapper
  const wrapper = createOpenAIFetch({
    openAiApiKey: "test-api-key",
  });

  // Create FormData request
  const formData = new FormData();
  formData.append("file", new Blob(["test content"]), "test.jsonl");
  formData.append("purpose", "fine-tune");

  await wrapper("https://api.openai.com/v1/files", {
    method: "POST",
    body: formData,
  });

  // Verify fetch was called correctly
  assertSpyCalls(fetchStub, 1);

  // Verify FormData.append was called correctly
  assertSpyCalls(formDataAppendSpy, 2);

  // Get the actual call args
  const actualCallArgs = formDataAppendSpy.calls[0].args;

  // Verify field name and filename
  assertEquals(actualCallArgs[0], "file");
  assertEquals(actualCallArgs[2], "test.jsonl");

  // Verify that the second arg is a Blob with the right content
  assert(actualCallArgs[1] instanceof Blob);

  // Convert blob to text and verify content
  const blobText = await new Response(actualCallArgs[1]).text();
  assertEquals(blobText, "test content");
});

Deno.test("createOpenAIFetch should not modify non-OpenAI requests", async () => {
  // Create a stub for global fetch to capture the request
  using fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
  );

  // Get the wrapper
  const wrapper = createOpenAIFetch({
    openAiApiKey: "test-api-key",
  });

  // Make a non-OpenAI request
  const originalBody = { data: "test data" };
  await wrapper("https://example.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(originalBody),
  });

  // Verify fetch was called correctly
  assertSpyCalls(fetchStub, 1);

  // Verify the correct URL was used
  assertSpyCall(fetchStub, 0, {
    args: [
      "https://example.com/api",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(originalBody),
      },
    ],
  });

  // Verify no Authorization header was added
  const call = fetchStub?.calls[0];
  if (call) {
    const headersObject = call.args[1]?.headers;
    if (headersObject instanceof Headers) {
      assertEquals(headersObject.get("Authorization"), undefined);
      assertEquals(headersObject.get("authorization"), undefined);
    }
  }
});
