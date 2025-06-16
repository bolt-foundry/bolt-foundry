#! /usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import {
  type Card,
  card,
  makeCardBuilder,
  makeSampleBuilder,
} from "../builders.ts";

Deno.test("card API - basic usage", () => {
  const result = card(
    "persona",
    (c) =>
      c.card("needs", (n) =>
        n.spec("water", {
          samples: (s) =>
            s.sample("Clean drinking water", 3)
              .sample("Contaminated water", -3),
        })),
  );

  assertEquals(result.name, "persona");
  assertEquals(Array.isArray(result.value), true);

  const personaCards = result.value as Array<Card>;
  assertEquals(personaCards.length, 1);
  assertEquals(personaCards[0].name, "needs");

  const needsCards = personaCards[0].value as Array<Card>;
  assertEquals(needsCards.length, 1);
  assertEquals(needsCards[0].value, "water");
  assertEquals(needsCards[0].samples?.length, 2);
  assertEquals(needsCards[0].samples![0], {
    text: "Clean drinking water",
    rating: 3,
  });
  assertEquals(needsCards[0].samples![1], {
    text: "Contaminated water",
    rating: -3,
  });
});

Deno.test("CardBuilder - spec with samples", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("basic")
    .spec("with-samples", {
      samples: (s) => s.sample("Good example", 2).sample("Bad example", -2),
    })
    .getCards();

  assertEquals(result.length, 2);
  assertEquals(result[0].value, "basic");
  assertEquals(result[0].samples, undefined);

  assertEquals(result[1].value, "with-samples");
  assertEquals(result[1].samples?.length, 2);
  assertEquals(result[1].samples![0], { text: "Good example", rating: 2 });
  assertEquals(result[1].samples![1], { text: "Bad example", rating: -2 });
});

Deno.test("SampleBuilder - various ratings", () => {
  const builder = makeSampleBuilder();
  const samples = builder
    .sample("Excellent example", 3)
    .sample("Good example", 2)
    .sample("Okay example", 1)
    .sample("Neutral example", 0)
    .sample("Poor example", -1)
    .sample("Bad example", -2)
    .sample("Terrible example", -3)
    .getSamples();

  assertEquals(samples.length, 7);
  assertEquals(samples[0], { text: "Excellent example", rating: 3 });
  assertEquals(samples[1], { text: "Good example", rating: 2 });
  assertEquals(samples[2], { text: "Okay example", rating: 1 });
  assertEquals(samples[3], { text: "Neutral example", rating: 0 });
  assertEquals(samples[4], { text: "Poor example", rating: -1 });
  assertEquals(samples[5], { text: "Bad example", rating: -2 });
  assertEquals(samples[6], { text: "Terrible example", rating: -3 });
});

Deno.test("card API - nested structure", () => {
  const result = card(
    "system",
    (c) =>
      c.card(
        "components",
        (c) =>
          c.card("database", (d) =>
            d.spec("connection", {
              samples: (s) =>
                s.sample("Persistent connection with pooling", 3).sample(
                  "Opening new connection for each query",
                  -3,
                ),
            })),
      ),
  );

  assertEquals(result.name, "system");
  const components = (result.value as Array<Card>)[0];
  assertEquals(components.name, "components");

  const componentsValue = components.value as Array<Card>;
  const database = componentsValue[0];
  assertEquals(database.name, "database");

  const databaseValue = database.value as Array<Card>;
  const connection = databaseValue[0];
  assertEquals(connection.value, "connection");
  assertEquals(connection.samples?.length, 2);
});

Deno.test("Sample system - multiple samples on single spec", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Be helpful", {
      samples: (s) =>
        s.sample("I'll help you solve this step by step", 3)
          .sample("Let me assist you with that", 2)
          .sample("I can try to help", 1)
          .sample("Figure it out yourself", -2)
          .sample("Not my problem", -3),
    })
    .getCards();

  assertEquals(result.length, 1);
  assertEquals(result[0].value, "Be helpful");
  assertEquals(result[0].samples?.length, 5);

  // Verify samples are in order
  assertEquals(
    result[0].samples![0].text,
    "I'll help you solve this step by step",
  );
  assertEquals(result[0].samples![0].rating, 3);
  assertEquals(result[0].samples![4].text, "Not my problem");
  assertEquals(result[0].samples![4].rating, -3);
});

Deno.test("Sample system - specs with and without samples mixed", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Always be honest")
    .spec("Be kind", {
      samples: (s) =>
        s.sample("That must have been difficult for you", 3)
          .sample("Sucks to be you", -3),
    })
    .spec("Stay focused")
    .card("communication", (c) =>
      c.spec("Listen actively", {
        samples: (s) =>
          s.sample("Tell me more about that", 3)
            .sample("Are you done talking yet?", -3),
      })
        .spec("Respond thoughtfully"))
    .getCards();

  assertEquals(result.length, 4);

  // First spec: no samples
  assertEquals(result[0].value, "Always be honest");
  assertEquals(result[0].samples, undefined);

  // Second spec: has samples
  assertEquals(result[1].value, "Be kind");
  assertEquals(result[1].samples?.length, 2);

  // Third spec: no samples
  assertEquals(result[2].value, "Stay focused");
  assertEquals(result[2].samples, undefined);

  // Fourth card: nested with mixed samples
  assertEquals(result[3].name, "communication");
  const commCards = result[3].value as Array<Card>;
  assertEquals(commCards[0].samples?.length, 2);
  assertEquals(commCards[1].samples, undefined);
});

Deno.test("Sample system - empty samples builder", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("No samples here", {
      samples: (s) => s, // Return builder without adding samples
    })
    .getCards();

  assertEquals(result.length, 1);
  assertEquals(result[0].value, "No samples here");
  assertEquals(result[0].samples, undefined); // No samples array created
});

Deno.test("Sample system - card with samples renders correctly", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Be supportive", {
      samples: (s) =>
        s.sample("You're doing great, keep going!", 3)
          .sample("Whatever", -2),
    })
    .getCards();

  // Just verify the structure is correct - rendering is tested elsewhere
  assertEquals(result[0].samples?.length, 2);
  assertEquals(result[0].samples![0].rating, 3);
  assertEquals(result[0].samples![1].rating, -2);
});

// Array pattern tests for Phase 1 implementation
Deno.test("Array pattern - basic spec with array of samples", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Be helpful", {
      samples: [
        { text: "I'll help you solve this step by step", rating: 3 },
        { text: "Let me assist you with that", rating: 2 },
        { text: "Figure it out yourself", rating: -2 },
      ],
    })
    .getCards();

  assertEquals(result.length, 1);
  assertEquals(result[0].value, "Be helpful");
  assertEquals(result[0].samples?.length, 3);
  assertEquals(result[0].samples![0], {
    text: "I'll help you solve this step by step",
    rating: 3,
  });
  assertEquals(result[0].samples![1], {
    text: "Let me assist you with that",
    rating: 2,
  });
  assertEquals(result[0].samples![2], {
    text: "Figure it out yourself",
    rating: -2,
  });
});

Deno.test("Array pattern - empty array creates no samples", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("No samples spec", {
      samples: [],
    })
    .getCards();

  assertEquals(result.length, 1);
  assertEquals(result[0].value, "No samples spec");
  assertEquals(result[0].samples, undefined);
});

Deno.test("Array pattern - samples with various ratings", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Communication style", {
      samples: [
        { text: "Excellent response", rating: 3 },
        { text: "Good response", rating: 2 },
        { text: "Okay response", rating: 1 },
        { text: "Neutral response", rating: 0 },
        { text: "Poor response", rating: -1 },
        { text: "Bad response", rating: -2 },
        { text: "Terrible response", rating: -3 },
      ],
    })
    .getCards();

  assertEquals(result[0].samples?.length, 7);
  assertEquals(result[0].samples![0].rating, 3);
  assertEquals(result[0].samples![6].rating, -3);
});

Deno.test("Array pattern - mixed with builder pattern in same CardBuilder", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Uses builder", {
      samples: (s) => s.sample("Builder example", 2),
    })
    .spec("Uses array", {
      samples: [
        { text: "Array example 1", rating: 1 },
        { text: "Array example 2", rating: -1 },
      ],
    })
    .getCards();

  assertEquals(result.length, 2);

  // First spec uses builder
  assertEquals(result[0].value, "Uses builder");
  assertEquals(result[0].samples?.length, 1);
  assertEquals(result[0].samples![0].text, "Builder example");

  // Second spec uses array
  assertEquals(result[1].value, "Uses array");
  assertEquals(result[1].samples?.length, 2);
});

Deno.test("CardBuilder - lead functionality", () => {
  const builder = makeCardBuilder();
  const result = builder
    .lead("This is an introduction to the card")
    .spec("First spec")
    .lead("This is a transition between specs")
    .spec("Second spec")
    .getCards();

  assertEquals(result.length, 4);

  // First lead
  assertEquals(result[0].lead, "This is an introduction to the card");
  assertEquals(result[0].value, "");

  // First spec
  assertEquals(result[1].value, "First spec");
  assertEquals(result[1].lead, undefined);

  // Second lead
  assertEquals(result[2].lead, "This is a transition between specs");
  assertEquals(result[2].value, "");

  // Second spec
  assertEquals(result[3].value, "Second spec");
  assertEquals(result[3].lead, undefined);
});

Deno.test("CardBuilder - nested cards with leads", () => {
  const result = card("parent", (c) =>
    c.lead("Parent card introduction")
      .spec("Parent spec")
      .card("child", (c) =>
        c.lead("Child card introduction")
          .spec("Child spec")
          .lead("Jump-out lead after child specs"))
      .lead("Another transition at parent level"));

  const parentCards = result.value as Array<Card>;
  assertEquals(parentCards.length, 4);

  // Parent lead
  assertEquals(parentCards[0].lead, "Parent card introduction");

  // Parent spec
  assertEquals(parentCards[1].value, "Parent spec");

  // Child card
  assertEquals(parentCards[2].name, "child");
  const childCards = parentCards[2].value as Array<Card>;
  assertEquals(childCards.length, 3);
  assertEquals(childCards[0].lead, "Child card introduction");
  assertEquals(childCards[1].value, "Child spec");
  assertEquals(childCards[2].lead, "Jump-out lead after child specs");

  // Parent transition
  assertEquals(parentCards[3].lead, "Another transition at parent level");
});

Deno.test("Array pattern - samples with descriptions", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Detailed examples", {
      samples: [
        {
          text: "This is a great example",
          rating: 3,
          description: "Shows ideal behavior",
        },
        {
          text: "This is problematic",
          rating: -2,
          description: "Demonstrates what to avoid",
        },
      ],
    })
    .getCards();

  assertEquals(result[0].samples?.length, 2);
  assertEquals(result[0].samples![0].description, "Shows ideal behavior");
  assertEquals(result[0].samples![1].description, "Demonstrates what to avoid");
});

Deno.test("Array pattern - nested card structure with array samples", () => {
  const result = card(
    "assistant",
    (c) =>
      c.card("personality", (p) =>
        p.spec("empathy", {
          samples: [
            { text: "I understand how frustrating that must be", rating: 3 },
            { text: "That's your problem", rating: -3 },
          ],
        })),
  );

  const personality = (result.value as Array<Card>)[0];
  const empathy = (personality.value as Array<Card>)[0];

  assertEquals(empathy.value, "empathy");
  assertEquals(empathy.samples?.length, 2);
  assertEquals(
    empathy.samples![0].text,
    "I understand how frustrating that must be",
  );
  assertEquals(empathy.samples![0].rating, 3);
});
