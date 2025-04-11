#!/usr/bin/env -S bff test

import { assertEquals, assertRejects, assertExists } from "@std/assert";

Deno.test("OpenAI mock should have the proper structure", async () => {
  const { OpenAI } = await import("@openai/openai");

  // Test that the mock can be instantiated with an API key
  const mockOpenAI = new OpenAI({ apiKey: "fake-key" });

  // Verify the structure matches the actual OpenAI SDK
  assertEquals(typeof mockOpenAI, "object");
  assertEquals(typeof mockOpenAI.chat, "object");
  assertEquals(typeof mockOpenAI.chat.completions, "object");
  assertEquals(typeof mockOpenAI.chat.completions.create, "function");

});

Deno.test("OpenAI mock completions API should reject with proper error", async () => {
  const { OpenAI } = await import("@openai/openai");
  const mockOpenAI = new OpenAI({ apiKey: "fake-key" });

  // Test that attempting to use the mock client rejects with an error
  await assertRejects(
    () =>
      mockOpenAI.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello world" }],
      }),
    Error,
    "No AI API keys configured",
  );
});

Deno.test("OpenAI mock should return responses with valid API key", async () => {
  const { OpenAI } = await import("@openai/openai");
  const mockOpenAI = new OpenAI({ apiKey: "valid-api-key" });

  // Test chat completions API
  const chatCompletion = await mockOpenAI.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello world" }],
  });

  assertEquals(chatCompletion.object, "chat.completion");
  assertEquals(chatCompletion.choices.length, 1);
  assertEquals(chatCompletion.choices[0].message.role, "assistant");
  assertExists(chatCompletion.choices[0].message.content);
  assertEquals(chatCompletion.choices[0].finish_reason, "stop");


});
