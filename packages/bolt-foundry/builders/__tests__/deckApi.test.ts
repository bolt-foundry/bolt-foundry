#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { BfClient } from "../../BfClient.ts";
import type { Card } from "../builders.ts";

Deno.test("BfClient.createDeck - basic creation", () => {
  const client = BfClient.create();
  const deck = client.createDeck(
    "pokemon-trainer",
    (b) => b,
  );
  assertEquals(deck.name, "pokemon-trainer");
});

Deno.test("DeckSpec.render - returns OpenAI format", () => {
  const client = BfClient.create();
  const deck = client.createDeck(
    "pokemon-professor",
    (b) => b,
  );
  const result = deck.render();

  // Should have required OpenAI fields
  assert(result.model);
  assert(Array.isArray(result.messages));
  assertEquals(result.messages[0].role, "system");
});

Deno.test("DeckSpec.render - merges user options", () => {
  const client = BfClient.create();
  const deck = client.createDeck(
    "gym-leader",
    (b) => b,
  );

  const result = deck.render({
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
  const deck = client.createDeck("ash-ketchum", (b) => {
    const original = b;
    const afterCards = b.card(
      "character",
      (c) => c.spec("A determined Pokemon trainer from Pallet Town"),
    );
    const afterMoreCards = afterCards.card(
      "rules",
      (c) => c.spec("Never give up on catching them all"),
    );

    // Each method should return a new instance
    assert(original !== afterCards, "card() should return new instance");
    assert(afterCards !== afterMoreCards, "card() should return new instance");

    return afterMoreCards;
  });

  assertEquals(deck.name, "ash-ketchum");
});

Deno.test("Cards builder stores persona information", () => {
  const client = BfClient.create();
  const deck = client.createDeck("professor-oak", (b) => {
    return b.card("character", (c) => {
      return c.spec(
        "A knowledgeable Pokemon researcher who gives new trainers their first Pokemon",
      );
    });
  });

  const result = deck.render();
  const systemMessage = result.messages[0].content;

  // System message should include persona description
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("A knowledgeable Pokemon researcher"));
});

Deno.test("Cards builder stores traits", () => {
  const client = BfClient.create();
  const deck = client.createDeck("nurse-joy", (b) => {
    return b.card("personality", (c) => {
      return c
        .spec("Caring and compassionate")
        .spec("Always puts Pokemon health first");
    });
  });

  const result = deck.render();
  const systemMessage = result.messages[0].content;

  // System message should include traits
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("Caring and compassionate"));
  assert(systemMessage.includes("Pokemon health first"));
});

Deno.test("Cards builder stores constraints", () => {
  const client = BfClient.create();
  const deck = client.createDeck("officer-jenny", (b) => {
    return b.card("rules", (c) => {
      return c
        .spec("Always follow Pokemon League regulations")
        .spec("Protect trainers and Pokemon from harm");
    });
  });

  const result = deck.render();
  const systemMessage = result.messages[0].content;

  // System message should include constraints
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("Pokemon League regulations"));
  assert(systemMessage.includes("Protect trainers and Pokemon"));
});

Deno.test("Deck with multiple card groups", () => {
  const client = BfClient.create();
  const deck = client.createDeck("elite-four-champion", (b) => {
    return b
      .card("character", (c) => {
        return c.spec(
          "An undefeated Pokemon champion who has mastered all types",
        );
      })
      .card("personality", (c) => {
        return c
          .spec("Confident but respectful")
          .spec("Encourages growth in challengers");
      })
      .card("rules", (c) => {
        return c
          .spec("Battle with honor and strategy")
          .spec("Help trainers understand type advantages");
      });
  });

  const result = deck.render();
  const systemMessage = result.messages[0].content;

  // System message should include all groups
  assert(typeof systemMessage === "string");
  assert(systemMessage.includes("undefeated Pokemon champion"));
  assert(systemMessage.includes("Confident but respectful"));
  assert(systemMessage.includes("Battle with honor"));
  assert(systemMessage.includes("type advantages"));
});

Deno.test("Deck with samples - structure and rendering", () => {
  const client = BfClient.create();
  const deck = client.createDeck("helpful-ai", (b) => {
    return b
      .spec("You are a helpful AI assistant", {
        samples: (s) =>
          s.sample("I'd be happy to help you with that!", 3)
            .sample("I don't know, figure it out yourself", -3),
      })
      .card("communication", (c) => {
        return c
          .spec("Use clear language", {
            samples: (sam) =>
              sam.sample("Let me explain this step by step...", 3)
                .sample("It's complicated", -2),
          })
          .spec("Be patient with users");
      });
  });

  // Check the structure
  const cards = deck.getCards();
  assertEquals(cards.length, 2);

  // First card has samples
  assertEquals(cards[0].value, "You are a helpful AI assistant");
  assertEquals(cards[0].samples?.length, 2);
  assertEquals(cards[0].samples![0].rating, 3);
  assertEquals(cards[0].samples![1].rating, -3);

  // Second card group
  assertEquals(cards[1].name, "communication");
  const commCards = cards[1].value as Array<Card>;
  assertEquals(commCards[0].samples?.length, 2);
  assertEquals(commCards[1].samples, undefined);

  // Verify it renders without errors
  const result = deck.render();
  assert(result.messages[0].content);
});
