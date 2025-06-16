import { assertEquals } from "@std/assert";
import { createDeck } from "../deckBuilder.ts";
import type { Card } from "../builders.ts";

Deno.test("createDeck API - basic usage", () => {
  const deck = createDeck(
    "my-deck",
    (b) =>
      b.card("persona", (c) =>
        c.card("needs", (n) =>
          n.spec("water", {
            samples: (s) => s.sample("positive", 3).sample("negative", -3),
          }))),
  );

  assertEquals(deck.name, "my-deck");
  assertEquals(deck.cards.length, 1);
  assertEquals(deck.cards[0].name, "persona");

  const personaValue = deck.cards[0].value as Array<Card>;
  assertEquals(personaValue[0].name, "needs");

  const needsValue = personaValue[0].value as Array<Card>;
  assertEquals(needsValue[0].value, "water");
  assertEquals(needsValue[0].samples?.length, 2);
  assertEquals(needsValue[0].samples![0], { id: "positive", score: 3 });
  assertEquals(needsValue[0].samples![1], { id: "negative", score: -3 });
});

Deno.test("createDeck API - simple cards", () => {
  const deck = createDeck(
    "assistant",
    (b) =>
      b.card("capabilities", (c) =>
        c.spec("natural language processing")
          .spec("code generation")),
  );

  assertEquals(deck.name, "assistant");
  assertEquals(deck.cards.length, 1);
  assertEquals(deck.cards[0].name, "capabilities");
  assertEquals((deck.cards[0].value as Array<Card>).length, 2);
});

Deno.test("createDeck API - complex nested structure", () => {
  const deck = createDeck(
    "data-analyzer",
    (b) =>
      b.card("tools", (c) =>
        c.card("programming", (p) =>
          p.spec("python", {
            samples: (s) => s.sample("Latest version with type hints", 3),
          })
            .spec("r", {
              samples: (s) => s.sample("Good for statistical analysis", 2),
            }))
          .card("databases", (d) =>
            d.spec("postgresql")
              .spec("mongodb"))),
  );

  assertEquals(deck.name, "data-analyzer");
  assertEquals(deck.cards.length, 1);
  assertEquals(deck.cards[0].name, "tools");

  const tools = deck.cards[0].value as Array<Card>;
  assertEquals(tools.length, 2);
  assertEquals(tools[0].name, "programming");
  assertEquals(tools[1].name, "databases");
});
