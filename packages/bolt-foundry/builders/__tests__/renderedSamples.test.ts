#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import { makeDeckBuilder } from "../builders.ts";

Deno.test("DeckBuilder - renderedSamples with footnotes", () => {
  const deck = makeDeckBuilder("Test Deck")
    .spec("A spec with footnote [^sample1] and [^sample2]", {
      samples: [
        {
          id: "sample1",
          score: 2,
          userMessage: "Test user message",
          assistantResponse: "Test assistant response",
        },
        {
          id: "sample2",
          score: 1,
          userMessage: "Another user message",
          assistantResponse: "Another assistant response",
        },
      ],
    });

  // Without renderedSamples, footnotes should not be rendered
  const result1 = deck.render();
  const systemMessage1 = result1.messages.find((m) => m.role === "system");
  const content1 = systemMessage1?.content as string;

  assertEquals(content1.includes("Test user message"), false);
  assertEquals(content1.includes("Another user message"), false);

  // With renderedSamples including sample1, only that footnote should be rendered
  const result2 = deck.render({ renderedSamples: ["sample1"] });
  const systemMessage2 = result2.messages.find((m) => m.role === "system");
  const content2 = systemMessage2?.content as string;

  assertEquals(content2.includes("Test user message"), true);
  assertEquals(content2.includes("Another user message"), false);
});

Deno.test("DeckBuilder - renderedSamples with multiple footnotes", () => {
  const deck = makeDeckBuilder("Test Deck")
    .spec("A spec with multiple footnotes [^sample1] and [^sample2]", {
      samples: [
        {
          id: "sample1",
          score: 2,
          userMessage: "First footnote",
          assistantResponse: "First response",
        },
        {
          id: "sample2",
          score: 1,
          userMessage: "Second footnote",
          assistantResponse: "Second response",
        },
        {
          id: "sample3",
          score: 3,
          userMessage: "Third sample (not footnote)",
          assistantResponse: "Third response",
        },
      ],
    });

  // With renderedSamples including both sample1 and sample2
  const result = deck.render({ renderedSamples: ["sample1", "sample2"] });
  const systemMessage = result.messages.find((m) => m.role === "system");
  const content = systemMessage?.content as string;

  assertEquals(content.includes("First footnote"), true);
  assertEquals(content.includes("Second footnote"), true);
  assertEquals(content.includes("Third sample (not footnote)"), true); // Non-footnote samples always render
});

Deno.test("DeckBuilder - non-footnote samples always render", () => {
  const deck = makeDeckBuilder("Test Deck")
    .spec("A spec without footnotes", {
      samples: [
        {
          id: "sample1",
          score: 2,
          userMessage: "Regular sample",
          assistantResponse: "Regular response",
        },
      ],
    });

  // Without renderedSamples, non-footnote samples should still render
  const result1 = deck.render();
  const systemMessage1 = result1.messages.find((m) => m.role === "system");
  const content1 = systemMessage1?.content as string;

  assertEquals(content1.includes("Regular sample"), true);

  // With renderedSamples, non-footnote samples should still render
  const result2 = deck.render({ renderedSamples: ["other"] });
  const systemMessage2 = result2.messages.find((m) => m.role === "system");
  const content2 = systemMessage2?.content as string;

  assertEquals(content2.includes("Regular sample"), true);
});

Deno.test("DeckBuilder - renderedSamples with nested cards", () => {
  const deck = makeDeckBuilder("Test Deck")
    .card("nested", (c) =>
      c
        .spec("Nested spec with footnote [^nested1]", {
          samples: [
            {
              id: "nested1",
              score: 2,
              userMessage: "Nested sample",
              assistantResponse: "Nested response",
            },
          ],
        }));

  // Without renderedSamples
  const result1 = deck.render();
  const content1 = result1.messages[0].content as string;
  assertEquals(content1.includes("Nested sample"), false);

  // With renderedSamples
  const result2 = deck.render({ renderedSamples: ["nested1"] });
  const content2 = result2.messages[0].content as string;
  assertEquals(content2.includes("Nested sample"), true);
});

Deno.test("DeckBuilder - renderedSamples with score 0 samples", () => {
  const deck = makeDeckBuilder("Test Deck")
    .spec("A spec with footnote [^sample1]", {
      samples: [
        {
          id: "sample1",
          score: 0,
          userMessage: "Zero score sample",
          assistantResponse: "Zero score response",
        },
      ],
    });

  // Score 0 samples should not render even with renderedSamples
  const result = deck.render({ renderedSamples: ["sample1"] });
  const systemMessage = result.messages.find((m) => m.role === "system");
  const content = systemMessage?.content as string;

  assertEquals(content.includes("Zero score sample"), false);
});
