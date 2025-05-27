#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { BfClient } from "../BfClient.ts";

Deno.test("BfClient.create - creates client instance", () => {
  const client = BfClient.create();
  assert(client instanceof BfClient);
  assert(typeof client.fetch === "function");
});

Deno.test("BfClient.create - accepts config options", () => {
  const client = BfClient.create({
    apiKey: "test-key",
    collectorEndpoint: "https://test.endpoint",
  });
  assert(client instanceof BfClient);
});

Deno.test("BfClient.createCard - creates card specification", () => {
  const client = BfClient.create();

  const card = client.createCard("test-card", (b) => b);

  assertEquals(card.name, "test-card");
});

Deno.test("BfClient.createCard - creates card with specs", () => {
  const client = BfClient.create();

  const card = client.createCard(
    "pokemon-trainer",
    (b) =>
      b.specs("role", (r) => r.spec("You are an experienced Pokemon trainer"))
        .spec("Optimistic")
        .specs("skills", (s) =>
          s.spec("Reading Pokemon emotions")
            .spec("Strategic battle planning")),
  );

  assertEquals(card.name, "pokemon-trainer");

  const specs = card.getSpecs();
  assertEquals(specs.length, 3);
  assertEquals(specs[0].name, "role");
  assertEquals(specs[1].value, "Optimistic");
  assertEquals(specs[2].name, "skills");
});

Deno.test("BfClient.createCard - renders to OpenAI format", () => {
  const client = BfClient.create();

  const card = client.createCard(
    "test-card",
    (b) =>
      b.spec("You are a helpful assistant")
        .specs("traits", (t) =>
          t.spec("Patient")
            .spec("Clear communicator")),
  );

  const result = card.render({ model: "gpt-4" });

  assertEquals(result.model, "gpt-4");
  assertEquals(result.messages[0].role, "system");

  // Content can be string or array, check for string case
  const content = result.messages[0].content;
  assert(typeof content === "string");
  assert(content.includes("You are a helpful assistant"));
  assert(content.includes("Patient"));
  assert(content.includes("Clear communicator"));
});

Deno.test("BfClient.createCard - creates card with context", () => {
  const client = BfClient.create();

  const card = client.createCard(
    "customer-support",
    (b) =>
      b.spec("You are a customer support agent")
        .context((c) =>
          c.string("customerName", "What is the customer's name?")
            .string("issue", "What is the customer's issue?")
            .boolean("isPriority", "Is this a priority customer?")
        ),
  );

  const context = card.getContext();
  assertEquals(context.length, 3);
  assertEquals(context[0].name, "customerName");
  assertEquals(context[1].name, "issue");
  assertEquals(context[2].name, "isPriority");
});

Deno.test("BfClient.createCard - renders card with context values", () => {
  const client = BfClient.create();

  const card = client.createCard(
    "assistant",
    (b) =>
      b.spec("You are a helpful assistant")
        .context((c) =>
          c.string("userName", "What is the user's name?")
            .number("userAge", "What is the user's age?")
            .object("preferences", "What are the user's preferences?")
        ),
  );

  const result = card.render({
    model: "gpt-3.5-turbo",
    context: {
      userName: "Alice",
      userAge: 25,
      preferences: { theme: "dark", notifications: true },
    },
  });

  assertEquals(result.model, "gpt-3.5-turbo");
  assertEquals(result.messages.length, 7);

  // Check system message
  assertEquals(result.messages[0].role, "system");
  assertEquals(result.messages[0].content, "You are a helpful assistant");

  // Check context Q&A pairs
  assertEquals(result.messages[1].role, "assistant");
  assertEquals(result.messages[1].content, "What is the user's name?");
  assertEquals(result.messages[2].role, "user");
  assertEquals(result.messages[2].content, "Alice");

  assertEquals(result.messages[3].role, "assistant");
  assertEquals(result.messages[3].content, "What is the user's age?");
  assertEquals(result.messages[4].role, "user");
  assertEquals(result.messages[4].content, "25");

  assertEquals(result.messages[5].role, "assistant");
  assertEquals(result.messages[5].content, "What are the user's preferences?");
  assertEquals(result.messages[6].role, "user");
  assertEquals(
    result.messages[6].content,
    '{"theme":"dark","notifications":true}',
  );
});
