#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { boltFoundryClient } from "../builders.ts";

Deno.test("boltFoundryClient.createAssistant - basic creation", () => {
  const assistant = boltFoundryClient.createAssistant(
    "test-assistant",
    (b) => b,
  );
  assertEquals(assistant.name, "test-assistant");
});

Deno.test("AssistantSpec.render - returns OpenAI format", () => {
  const assistant = boltFoundryClient.createAssistant(
    "test-assistant",
    (b) => b,
  );
  const result = assistant.render();

  // Should have required OpenAI fields
  assert(result.model);
  assert(Array.isArray(result.messages));
  assertEquals(result.messages[0].role, "system");
});

Deno.test("AssistantSpec.render - merges user options", () => {
  const assistant = boltFoundryClient.createAssistant(
    "test-assistant",
    (b) => b,
  );

  const result = assistant.render({
    model: "gpt-4",
    temperature: 0.7,
    messages: [{ role: "user", content: "Hello" }],
  });

  assertEquals(result.model, "gpt-4");
  assertEquals(result.temperature, 0.7);
  assert(result.messages.length >= 2); // System + user message
});
