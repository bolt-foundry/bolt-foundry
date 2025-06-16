#! /usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import {
  type Card,
  card,
  makeCardBuilder,
  makeDeckBuilder,
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
    id: "Clean drinking water",
    score: 3,
  });
  assertEquals(needsCards[0].samples![1], {
    id: "Contaminated water",
    score: -3,
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
  assertEquals(result[1].samples![0], { id: "Good example", score: 2 });
  assertEquals(result[1].samples![1], { id: "Bad example", score: -2 });
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
  assertEquals(samples[0], { id: "Excellent example", score: 3 });
  assertEquals(samples[1], { id: "Good example", score: 2 });
  assertEquals(samples[2], { id: "Okay example", score: 1 });
  assertEquals(samples[3], { id: "Neutral example", score: 0 });
  assertEquals(samples[4], { id: "Poor example", score: -1 });
  assertEquals(samples[5], { id: "Bad example", score: -2 });
  assertEquals(samples[6], { id: "Terrible example", score: -3 });
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
    result[0].samples![0].id,
    "I'll help you solve this step by step",
  );
  assertEquals(result[0].samples![0].score, 3);
  assertEquals(result[0].samples![4].id, "Not my problem");
  assertEquals(result[0].samples![4].score, -3);
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
  assertEquals(result[0].samples![0].score, 3);
  assertEquals(result[0].samples![1].score, -2);
});

// Array pattern tests for Phase 1 implementation
Deno.test("Array pattern - basic spec with array of samples", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Be helpful", {
      samples: [
        { id: "I'll help you solve this step by step", score: 3 },
        { id: "Let me assist you with that", score: 2 },
        { id: "Figure it out yourself", score: -2 },
      ],
    })
    .getCards();

  assertEquals(result.length, 1);
  assertEquals(result[0].value, "Be helpful");
  assertEquals(result[0].samples?.length, 3);
  assertEquals(result[0].samples![0], {
    id: "I'll help you solve this step by step",
    score: 3,
  });
  assertEquals(result[0].samples![1], {
    id: "Let me assist you with that",
    score: 2,
  });
  assertEquals(result[0].samples![2], {
    id: "Figure it out yourself",
    score: -2,
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
        { id: "Excellent response", score: 3 },
        { id: "Good response", score: 2 },
        { id: "Okay response", score: 1 },
        { id: "Neutral response", score: 0 },
        { id: "Poor response", score: -1 },
        { id: "Bad response", score: -2 },
        { id: "Terrible response", score: -3 },
      ],
    })
    .getCards();

  assertEquals(result[0].samples?.length, 7);
  assertEquals(result[0].samples![0].score, 3);
  assertEquals(result[0].samples![6].score, -3);
});

Deno.test("Array pattern - mixed with builder pattern in same CardBuilder", () => {
  const builder = makeCardBuilder();
  const result = builder
    .spec("Uses builder", {
      samples: (s) => s.sample("Builder example", 2),
    })
    .spec("Uses array", {
      samples: [
        { id: "Array example 1", score: 1 },
        { id: "Array example 2", score: -1 },
      ],
    })
    .getCards();

  assertEquals(result.length, 2);

  // First spec uses builder
  assertEquals(result[0].value, "Uses builder");
  assertEquals(result[0].samples?.length, 1);
  assertEquals(result[0].samples![0].id, "Builder example");

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
          id: "This is a great example",
          score: 3,
          description: "Shows ideal behavior",
        },
        {
          id: "This is problematic",
          score: -2,
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
            { id: "I understand how frustrating that must be", score: 3 },
            { id: "That's your problem", score: -3 },
          ],
        })),
  );

  const personality = (result.value as Array<Card>)[0];
  const empathy = (personality.value as Array<Card>)[0];

  assertEquals(empathy.value, "empathy");
  assertEquals(empathy.samples?.length, 2);
  assertEquals(
    empathy.samples![0].id,
    "I understand how frustrating that must be",
  );
  assertEquals(empathy.samples![0].score, 3);
});

// Tests for rendering samples as sub-bullets
Deno.test("DeckBuilder - renders spec with samples as sub-bullets", () => {
  const deck = makeDeckBuilder("test-deck")
    .spec("Be helpful to users", {
      samples: [
        {
          id: "sample1",
          score: 3,
          userMessage: "How do I reset my password?",
          assistantResponse:
            "I'll guide you through the password reset process step by step.",
        },
        {
          id: "sample2",
          score: -2,
          userMessage: "How do I reset my password?",
          assistantResponse: "Figure it out yourself.",
        },
      ],
    });

  const result = deck.render();
  const systemMessage = result.messages[0].content as string;

  // Should render samples as nested bullets
  assertEquals(systemMessage.includes("Be helpful to users"), true);
  assertEquals(systemMessage.includes("  - (+3 example):"), true);
  assertEquals(
    systemMessage.includes(
      "    - **User Message**: How do I reset my password?",
    ),
    true,
  );
  assertEquals(
    systemMessage.includes(
      "    - **Assistant Response**: I'll guide you through the password reset process step by step.",
    ),
    true,
  );
  assertEquals(systemMessage.includes("  - (-2 example):"), true);
  assertEquals(
    systemMessage.includes(
      "    - **Assistant Response**: Figure it out yourself.",
    ),
    true,
  );
});

Deno.test("DeckBuilder - renders multiple specs with mixed samples", () => {
  const deck = makeDeckBuilder("test-deck")
    .spec("First spec without samples")
    .spec("Second spec with samples", {
      samples: [
        {
          id: "good-example",
          score: 2,
          userMessage: "What's the weather?",
          assistantResponse: "I'll check the current weather for you.",
        },
      ],
    })
    .spec("Third spec without samples");

  const result = deck.render();
  const systemMessage = result.messages[0].content as string;

  // First spec should have no sub-bullets
  assertEquals(systemMessage.includes("First spec without samples"), true);

  // Second spec should have samples as sub-bullets
  assertEquals(systemMessage.includes("Second spec with samples"), true);
  assertEquals(systemMessage.includes("  - (+2 example):"), true);

  // Third spec should have no sub-bullets
  assertEquals(systemMessage.includes("Third spec without samples"), true);
});

Deno.test("DeckBuilder - renders nested cards with samples", () => {
  const deck = makeDeckBuilder("test-deck")
    .card("guidelines", (c) =>
      c.spec("Be respectful", {
        samples: [
          {
            id: "respectful",
            score: 3,
            userMessage: "You're wrong!",
            assistantResponse:
              "I understand you disagree. Let me reconsider your perspective.",
          },
        ],
      }));

  const result = deck.render();
  const systemMessage = result.messages[0].content as string;

  assertEquals(systemMessage.includes("<guidelines>"), true);
  assertEquals(systemMessage.includes("  Be respectful"), true);
  assertEquals(systemMessage.includes("    - (+3 example):"), true);
  assertEquals(
    systemMessage.includes("      - **User Message**: You're wrong!"),
    true,
  );
  assertEquals(
    systemMessage.includes(
      "      - **Assistant Response**: I understand you disagree. Let me reconsider your perspective.",
    ),
    true,
  );
  assertEquals(systemMessage.includes("</guidelines>"), true);
});

Deno.test("DeckBuilder - handles samples without userMessage/assistantResponse fields", () => {
  const deck = makeDeckBuilder("test-deck")
    .spec("Basic spec", {
      samples: [
        { id: "Just a simple sample", score: 1 },
      ],
    });

  const result = deck.render();
  const systemMessage = result.messages[0].content as string;

  // Should still render the rating but no user/assistant messages
  assertEquals(systemMessage.includes("Basic spec"), true);
  assertEquals(systemMessage.includes("  - (+1 example):"), true);
  // Should not include User Message or Assistant Response lines
  assertEquals(systemMessage.includes("**User Message**"), false);
  assertEquals(systemMessage.includes("**Assistant Response**"), false);
});

Deno.test("DeckBuilder - renders samples with zero and negative ratings", () => {
  const deck = makeDeckBuilder("test-deck")
    .spec("Quality examples", {
      samples: [
        {
          id: "neutral",
          score: 0,
          userMessage: "Test",
          assistantResponse: "Neutral response",
        },
        {
          id: "poor",
          score: -1,
          userMessage: "Test",
          assistantResponse: "Poor response",
        },
        {
          id: "terrible",
          score: -3,
          userMessage: "Test",
          assistantResponse: "Terrible response",
        },
      ],
    });

  const result = deck.render();
  const systemMessage = result.messages[0].content as string;

  // Score 0 should be filtered out
  assertEquals(systemMessage.includes("  - (+0 example):"), false);
  assertEquals(systemMessage.includes("  - (-1 example):"), true);
  assertEquals(systemMessage.includes("  - (-3 example):"), true);
});

Deno.test("DeckBuilder - ignores samples on leads", () => {
  // Since leads can't have samples via the API, we'll test that the rendering
  // logic properly distinguishes between specs and leads
  const deck = makeDeckBuilder("test-deck")
    .lead("This is a lead")
    .spec("This is a spec with samples", {
      samples: [
        {
          id: "spec-sample",
          score: 2,
          userMessage: "Test",
          assistantResponse: "Response",
        },
      ],
    });

  const result = deck.render();
  const systemMessage = result.messages[0].content as string;

  // Lead should be rendered without any samples
  assertEquals(systemMessage.includes("This is a lead\n"), true);

  // Spec samples should be rendered
  assertEquals(systemMessage.includes("This is a spec with samples\n"), true);
  assertEquals(systemMessage.includes("  - (+2 example):"), true);
  assertEquals(systemMessage.includes("    - **User Message**: Test"), true);
  assertEquals(
    systemMessage.includes("    - **Assistant Response**: Response"),
    true,
  );
});
