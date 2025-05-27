import { assertEquals } from "@std/assert";
import { createCard } from "../cardBuilder.ts";
import type { Spec } from "../builders.ts";

Deno.test("createCard API - basic usage", () => {
  const card = createCard(
    "my-card",
    (b) =>
      b.specs("persona", (p) =>
        p.specs("needs", (n) =>
          n.spec("water", {
            samples: (s) => s.sample("positive", 3).sample("negative", -3),
          }))),
  );

  assertEquals(card.name, "my-card");
  assertEquals(card.specs.length, 1);
  assertEquals(card.specs[0].name, "persona");

  const personaValue = card.specs[0].value as Array<Spec>;
  assertEquals(personaValue[0].name, "needs");

  const needsValue = personaValue[0].value as Array<Spec>;
  assertEquals(needsValue[0].value, "water");
  assertEquals(needsValue[0].samples?.length, 2);
  assertEquals(needsValue[0].samples![0], { text: "positive", rating: 3 });
  assertEquals(needsValue[0].samples![1], { text: "negative", rating: -3 });
});

Deno.test("createCard API - simple specs", () => {
  const card = createCard("assistant", (b) =>
    b.specs("capabilities", (c) =>
      c.spec("natural language processing")
        .spec("code generation")));

  assertEquals(card.name, "assistant");
  assertEquals(card.specs.length, 1);
  assertEquals(card.specs[0].name, "capabilities");
  assertEquals((card.specs[0].value as Array<Spec>).length, 2);
});

Deno.test("createCard API - complex nested structure", () => {
  const card = createCard(
    "data-analyzer",
    (b) =>
      b.specs("tools", (t) =>
        t.specs("programming", (p) =>
          p.spec("python", {
            samples: (s) => s.sample("Latest version with type hints", 3),
          })
            .spec("r", {
              samples: (s) => s.sample("Good for statistical analysis", 2),
            }))
          .specs("databases", (d) =>
            d.spec("postgresql")
              .spec("mongodb"))),
  );

  assertEquals(card.name, "data-analyzer");
  assertEquals(card.specs.length, 1);
  assertEquals(card.specs[0].name, "tools");

  const tools = card.specs[0].value as Array<Spec>;
  assertEquals(tools.length, 2);
  assertEquals(tools[0].name, "programming");
  assertEquals(tools[1].name, "databases");
});

