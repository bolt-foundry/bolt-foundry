import { assertEquals, assertExists } from "@std/assert";
import { createFoundry } from "../bolt-foundry.ts";
import { createMockOpenAi, MockOpenAi } from "./utils/mock-openai.ts";

Deno.test("createFoundry should properly integrate with OpenAI client", async () => {
  // Setup a mock fetch to capture the request
  let capturedUrl: string | null = null;
  let capturedOptions: RequestInit | null = null;

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = input.toString();
    capturedOptions = init || {};

    // Return a mock response similar to what OpenAI would return
    return new Response(JSON.stringify({
      id: "mock-id",
      object: "chat.completion",
      created: Date.now(),
      model: "gpt-3.5-turbo",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Mock response text"
          },
          finish_reason: "stop"
        }
      ]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  };

  // Replace global fetch with our mock
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch as typeof fetch;

  try {
    // Create a MockOpenAi instance with our createFoundry wrapper
    const openai = createMockOpenAi({
      fetch: createFoundry("test-api-key")
    });

    // Make a request
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // This should be modified to gpt-3.5-turbo by createFoundry
      messages: [
        {
          role: "user",
          content: "Hello, world!"
        }
      ]
    });

    // Verify the request was sent to the correct endpoint
    assertEquals(capturedUrl, "https://api.openai.com/v1/chat/completions");

    // Verify the authorization header was added
    const headers = capturedOptions!.headers as Record<string, string>;
    assertEquals(headers.authorization, "Bearer test-api-key");

    // Verify the model was modified in the request body
    const body = JSON.parse(capturedOptions!.body as string);
    assertEquals(body.model, "gpt-3.5-turbo");

    // Verify we got back a properly structured response
    assertEquals(completion.choices[0].message.role, "assistant");
    assertExists(completion.choices[0].message.content);
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch;
  }
});

Deno.test("createFoundry should not modify non-OpenAI requests", async () => {
  // Setup a mock fetch to capture the request
  let capturedUrl: string | null = null;
  let capturedOptions: RequestInit | null = null;

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = input.toString();
    capturedOptions = init || {};

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  };

  // Replace global fetch
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch as typeof fetch;

  try {
    // Get the wrapper
    const wrapper = createFoundry("test-api-key");

    // Make a non-OpenAI request
    const originalBody = { data: "test data" };
    await wrapper("https://example.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(originalBody)
    });

    // Verify URL
    assertEquals(capturedUrl, "https://example.com/api");

    // Verify body wasn't modified
    const body = JSON.parse(capturedOptions!.body as string);
    assertEquals(body, originalBody);

    // Verify no authorization header was added
    const headers = capturedOptions!.headers as Record<string, string>;
    assertEquals(headers.authorization, undefined);
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch;
  }
});