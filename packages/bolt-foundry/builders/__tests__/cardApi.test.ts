#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { BfClient } from "../../BfClient.ts";
import type { Spec } from "../builders.ts";

Deno.test("BfClient.createCard - basic creation", () => {
  const client = BfClient.create();
  const card = client.createCard(
    "pokemon-trainer",
    (b) => b,
  );
  assertEquals(card.name, "pokemon-trainer");
});

Deno.test("CardSpec.render - returns OpenAI format", () => {
  const client = BfClient.create();
  const card = client.createCard(
    "pokemon-professor",
    (b) => b,
  );
  const result = card.render();

  // Should have required OpenAI fields
  assert(result.model);
  assert(Array.isArray(result.messages));
  assertEquals(result.messages[0].role, "system");
});

Deno.test("CardSpec.render - merges user options", () => {
  const client = BfClient.create();
  const card = client.createCard(
    "gym-leader",
    (b) => b,
  );

  const result = card.render({
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
  const card = client.createCard("ash-ketchum", (b) => {
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

  assertEquals(card.name, "ash-ketchum");
});

Deno.test("Specs builder stores persona information", () => {
  const client = BfClient.create();
  const card = client.createCard("professor-oak", (b) => {
    return b.specs("character", (s) => {
      return s.spec(
        "A knowledgeable Pokemon researcher who gives new trainers their first Pokemon",
      );
    });
  });

  const result = card.render();
  const systemMessage = result.messages[0].content;

  // System message should include persona description
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("A knowledgeable Pokemon researcher"));
});

Deno.test("Specs builder stores traits", () => {
  const client = BfClient.create();
  const card = client.createCard("nurse-joy", (b) => {
    return b.specs("personality", (s) => {
      return s
        .spec("Caring and compassionate")
        .spec("Always puts Pokemon health first");
    });
  });

  const result = card.render();
  const systemMessage = result.messages[0].content;

  // System message should include traits
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("Caring and compassionate"));
  assert(systemMessage.includes("Pokemon health first"));
});

Deno.test("Specs builder stores constraints", () => {
  const client = BfClient.create();
  const card = client.createCard("officer-jenny", (b) => {
    return b.specs("rules", (s) => {
      return s
        .spec("Always follow Pokemon League regulations")
        .spec("Protect trainers and Pokemon from harm");
    });
  });

  const result = card.render();
  const systemMessage = result.messages[0].content;

  // System message should include constraints
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("Pokemon League regulations"));
  assert(systemMessage.includes("Protect trainers and Pokemon"));
});

Deno.test("Card with multiple spec groups", () => {
  const client = BfClient.create();
  const card = client.createCard("elite-four-champion", (b) => {
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

  const result = card.render();
  const systemMessage = result.messages[0].content;

  // System message should include all groups
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("undefeated Pokemon champion"));
  assert(systemMessage.includes("Confident but respectful"));
  assert(systemMessage.includes("Battle with honor"));
  assert(systemMessage.includes("type advantages"));
});

Deno.test("Card with samples - structure and rendering", () => {
  const client = BfClient.create();
  const card = client.createCard("helpful-ai", (b) => {
    return b
      .spec("You are a helpful AI assistant", {
        samples: (s) =>
          s.sample("I'd be happy to help you with that!", 3)
            .sample("I don't know, figure it out yourself", -3),
      })
      .specs("communication", (s) => {
        return s
          .spec("Use clear language", {
            samples: (sam) =>
              sam.sample("Let me explain this step by step...", 3)
                .sample("It's complicated", -2),
          })
          .spec("Be patient with users");
      });
  });

  // Check the structure
  const specs = card.getSpecs();
  assertEquals(specs.length, 2);

  // First spec has samples
  assertEquals(specs[0].value, "You are a helpful AI assistant");
  assertEquals(specs[0].samples?.length, 2);
  assertEquals(specs[0].samples![0].rating, 3);
  assertEquals(specs[0].samples![1].rating, -3);

  // Second spec group
  assertEquals(specs[1].name, "communication");
  const commSpecs = specs[1].value as Array<Spec>;
  assertEquals(commSpecs[0].samples?.length, 2);
  assertEquals(commSpecs[1].samples, undefined);

  // Verify it renders without errors
  const result = card.render();
  assert(result.messages[0].content);
});
