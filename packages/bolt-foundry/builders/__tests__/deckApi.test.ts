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
  assertEquals(cards[0].samples![0].score, 3);
  assertEquals(cards[0].samples![1].score, -3);

  // Second card group
  assertEquals(cards[1].name, "communication");
  const commCards = cards[1].value as Array<Card>;
  assertEquals(commCards[0].samples?.length, 2);
  assertEquals(commCards[1].samples, undefined);
});

Deno.test("DeckBuilder - lead functionality", () => {
  const client = BfClient.create();
  const deck = client.createDeck("pokemon-narrator", (b) => {
    return b
      .lead("This deck creates a narrator for Pokemon adventures")
      .spec("Set scenes in the Pokemon world")
      .lead("The narrator should guide trainers on their journey")
      .card("style", (c) => {
        return c
          .lead("Narrative style guidelines")
          .spec("Descriptive and immersive")
          .spec("Focus on Pokemon and trainer bonds");
      })
      .lead("Remember to make each adventure unique");
  });

  const result = deck.render();
  const systemMessage = result.messages[0].content;

  // Check that leads are included in the rendered output
  assert(typeof systemMessage === "string");
  assert(
    systemMessage.includes(
      "This deck creates a narrator for Pokemon adventures",
    ),
  );
  assert(
    systemMessage.includes(
      "The narrator should guide trainers on their journey",
    ),
  );
  assert(systemMessage.includes("Narrative style guidelines"));
  assert(systemMessage.includes("Remember to make each adventure unique"));
});

Deno.test("DeckBuilder - leads with nested cards", () => {
  const client = BfClient.create();
  const deck = client.createDeck("battle-system", (b) => {
    return b
      .lead("Pokemon battle mechanics guide")
      .card("mechanics", (c) => {
        return c
          .lead("Core battle rules")
          .spec("Type advantages matter")
          .card("status", (s) => {
            return s
              .lead("Status effects in battle")
              .spec("Paralysis reduces speed")
              .lead("Status can turn the tide of battle");
          });
      });
  });

  const cards = deck.getCards();
  assertEquals(cards.length, 2);

  // First item should be the deck lead
  assertEquals(cards[0].lead, "Pokemon battle mechanics guide");
  assertEquals(cards[0].value, "");

  // Second item should be the mechanics card
  assertEquals(cards[1].name, "mechanics");
  const mechanicsCards = cards[1].value as Array<Card>;
  assertEquals(mechanicsCards[0].lead, "Core battle rules");

  // Verify it renders without errors
  const result = deck.render();
  assert(result.messages[0].content);
});

// Array pattern tests for DeckBuilder
Deno.test("DeckBuilder with array pattern samples", () => {
  const client = BfClient.create();
  const deck = client.createDeck("array-pattern-ai", (b) => {
    return b
      .spec("Be helpful and supportive", {
        samples: [
          { id: "I'm here to help you succeed!", score: 3 },
          { id: "Let me guide you through this", score: 2 },
          { id: "You're on your own", score: -3 },
        ],
      })
      .card("responses", (c) => {
        return c
          .spec("Acknowledge user feelings", {
            samples: [
              { id: "I understand this can be frustrating", score: 3 },
              { id: "Whatever", score: -2 },
            ],
          })
          .spec("Provide clear explanations");
      });
  });

  // Check structure
  const cards = deck.getCards();
  assertEquals(cards.length, 2);

  // First spec with array samples
  assertEquals(cards[0].value, "Be helpful and supportive");
  assertEquals(cards[0].samples?.length, 3);
  assertEquals(cards[0].samples![0].id, "I'm here to help you succeed!");
  assertEquals(cards[0].samples![2].score, -3);

  // Nested card with array samples
  const responseCards = cards[1].value as Array<Card>;
  assertEquals(responseCards[0].samples?.length, 2);
  assertEquals(
    responseCards[0].samples![0].id,
    "I understand this can be frustrating",
  );
});

Deno.test("DeckBuilder mixing array and builder patterns", () => {
  const client = BfClient.create();
  const deck = client.createDeck("mixed-patterns", (b) => {
    return b
      .spec("Array pattern spec", {
        samples: [
          { id: "Array example", score: 1 },
        ],
      })
      .spec("Builder pattern spec", {
        samples: (s) => s.sample("Builder example", 2),
      })
      .spec("No samples spec");
  });

  const cards = deck.getCards();
  assertEquals(cards.length, 3);

  // Array pattern
  assertEquals(cards[0].samples?.length, 1);
  assertEquals(cards[0].samples![0].id, "Array example");

  // Builder pattern
  assertEquals(cards[1].samples?.length, 1);
  assertEquals(cards[1].samples![0].id, "Builder example");

  // No samples
  assertEquals(cards[2].samples, undefined);
});

Deno.test("DeckBuilder with empty array samples", () => {
  const client = BfClient.create();
  const deck = client.createDeck("empty-samples", (b) => {
    return b.spec("Empty array spec", {
      samples: [],
    });
  });

  const cards = deck.getCards();
  assertEquals(cards.length, 1);
  assertEquals(cards[0].samples, undefined); // Empty array should not create samples
});

Deno.test("DeckBuilder array samples with descriptions", () => {
  const client = BfClient.create();
  const deck = client.createDeck("descriptive-samples", (b) => {
    return b.spec("Detailed examples", {
      samples: [
        {
          id: "This demonstrates excellent behavior",
          score: 3,
          description: "Gold standard example",
        },
        {
          id: "This should be avoided",
          score: -3,
          description: "Anti-pattern to avoid",
        },
      ],
    });
  });

  const cards = deck.getCards();
  assertEquals(cards[0].samples?.length, 2);
  assertEquals(cards[0].samples![0].description, "Gold standard example");
  assertEquals(cards[0].samples![1].description, "Anti-pattern to avoid");
});
