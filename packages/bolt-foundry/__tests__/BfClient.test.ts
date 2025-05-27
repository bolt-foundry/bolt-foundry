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
