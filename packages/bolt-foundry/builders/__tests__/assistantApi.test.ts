#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { BfClient } from "../../BfClient.ts";

Deno.test("BfClient.createAssistant - basic creation", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant(
    "pokemon-trainer",
    (b) => b,
  );
  assertEquals(assistant.name, "pokemon-trainer");
});

Deno.test("AssistantSpec.render - returns OpenAI format", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant(
    "pokemon-professor",
    (b) => b,
  );
  const result = assistant.render();

  // Should have required OpenAI fields
  assert(result.model);
  assert(Array.isArray(result.messages));
  assertEquals(result.messages[0].role, "system");
});

Deno.test("AssistantSpec.render - merges user options", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant(
    "gym-leader",
    (b) => b,
  );

  const result = assistant.render({
    model: "gpt-4",
    temperature: 0.7,
    messages: [{ role: "user", content: "I challenge you to a battle!" }],
  });

  assertEquals(result.model, "gpt-4");
  assertEquals(result.temperature, 0.7);
  assert(result.messages.length >= 2); // System + user message
});

Deno.test("Builders are immutable - return new instances", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant("ash-ketchum", (b) => {
    const original = b;
    const afterSpecs = b.specs(
      "character",
      (s) => s.spec("A determined Pokemon trainer from Pallet Town"),
    );
    const afterMoreSpecs = afterSpecs.specs(
      "rules",
      (s) => s.spec("Never give up on catching them all"),
    );

    // Each method should return a new instance
    assert(original !== afterSpecs, "specs() should return new instance");
    assert(afterSpecs !== afterMoreSpecs, "specs() should return new instance");

    return afterMoreSpecs;
  });

  assertEquals(assistant.name, "ash-ketchum");
});

Deno.test("Specs builder stores persona information", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant("professor-oak", (b) => {
    return b.specs("character", (s) => {
      return s.spec(
        "A knowledgeable Pokemon researcher who gives new trainers their first Pokemon",
      );
    });
  });

  const result = assistant.render();
  const systemMessage = result.messages[0].content;

  // System message should include persona description
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("A knowledgeable Pokemon researcher"));
});

Deno.test("Specs builder stores traits", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant("nurse-joy", (b) => {
    return b.specs("personality", (s) => {
      return s
        .spec("Caring and compassionate")
        .spec("Always puts Pokemon health first");
    });
  });

  const result = assistant.render();
  const systemMessage = result.messages[0].content;

  // System message should include traits
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("Caring and compassionate"));
  assert(systemMessage.includes("Pokemon health first"));
});

Deno.test("Specs builder stores constraints", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant("officer-jenny", (b) => {
    return b.specs("rules", (s) => {
      return s
        .spec("Always follow Pokemon League regulations")
        .spec("Protect trainers and Pokemon from harm");
    });
  });

  const result = assistant.render();
  const systemMessage = result.messages[0].content;

  // System message should include constraints
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("Pokemon League regulations"));
  assert(systemMessage.includes("Protect trainers and Pokemon"));
});

Deno.test("Assistant with multiple spec groups", () => {
  const client = BfClient.create();
  const assistant = client.createAssistant("elite-four-champion", (b) => {
    return b
      .specs("character", (s) => {
        return s.spec(
          "An undefeated Pokemon champion who has mastered all types",
        );
      })
      .specs("personality", (s) => {
        return s
          .spec("Confident but respectful")
          .spec("Encourages growth in challengers");
      })
      .specs("rules", (s) => {
        return s
          .spec("Battle with honor and strategy")
          .spec("Help trainers understand type advantages");
      });
  });

  const result = assistant.render();
  const systemMessage = result.messages[0].content;

  // Should include all spec groups
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("undefeated Pokemon champion"));
  assert(systemMessage.includes("Confident but respectful"));
  assert(systemMessage.includes("Encourages growth"));
  assert(systemMessage.includes("Battle with honor"));
  assert(systemMessage.includes("type advantages"));
});
