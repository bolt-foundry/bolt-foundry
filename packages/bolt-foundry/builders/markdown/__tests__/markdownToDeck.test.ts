#! /usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { parseMarkdownToDeck } from "../markdownToDeck.ts";
import type { DeckBuilder } from "../../builders.ts";

Deno.test("parseMarkdownToDeck - basic deck with name from H1", async () => {
  const markdown = `# My Test Deck

## Card One

- First spec
- Second spec
`;

  const deck = await parseMarkdownToDeck(markdown);
  assertExists(deck);
  assertEquals(deck.name, "My Test Deck");
});

Deno.test("parseMarkdownToDeck - converts H2 headers to parent cards", async () => {
  const markdown = `# Test Deck

## First Card

- Spec in first card

## Second Card  

- Spec in second card
`;

  const deck = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();
  
  assertEquals(cards.length, 2);
  assertEquals(cards[0].name, "First Card");
  assertEquals(cards[1].name, "Second Card");
});

Deno.test("parseMarkdownToDeck - converts bullets to specs", async () => {
  const markdown = `# Test Deck

## My Card

- First specification
- Second specification
- Third specification
`;

  const deck = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();
  
  assertEquals(cards.length, 1);
  const cardValue = cards[0].value as Array<{ value: string }>;
  assertEquals(cardValue.length, 3);
  assertEquals(cardValue[0].value, "First specification");
  assertEquals(cardValue[1].value, "Second specification");
  assertEquals(cardValue[2].value, "Third specification");
});

Deno.test("parseMarkdownToDeck - handles nested headers (H3) as nested cards", async () => {
  const markdown = `# Test Deck

## Parent Card

### Nested Card

- Spec in nested card

### Another Nested Card

- Another spec
`;

  const deck = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();
  
  assertEquals(cards.length, 1);
  assertEquals(cards[0].name, "Parent Card");
  
  const nestedCards = cards[0].value as Array<{ name: string; value: Array<{ value: string }> }>;
  assertEquals(nestedCards.length, 2);
  assertEquals(nestedCards[0].name, "Nested Card");
  assertEquals(nestedCards[1].name, "Another Nested Card");
});

Deno.test("parseMarkdownToDeck - handles mixed content", async () => {
  const markdown = `# Assistant Deck

Some introductory text that should be ignored for now.

## Persona

You are a helpful assistant.

### Background

- Years of experience
- Domain expertise

## Behavior

### Communication Style

- Clear and concise
- Professional tone
`;

  const deck = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();
  
  assertEquals(cards.length, 2);
  assertEquals(cards[0].name, "Persona");
  assertEquals(cards[1].name, "Behavior");
  
  // Check nested structure of first card
  const personaContent = cards[0].value as Array<any>;
  assertEquals(personaContent[0].name, "Background");
  
  // Check nested structure of second card  
  const behaviorContent = cards[1].value as Array<any>;
  assertEquals(behaviorContent[0].name, "Communication Style");
});

Deno.test("parseMarkdownToDeck - handles deck without H1", async () => {
  const markdown = `## First Card

- Spec one

## Second Card

- Spec two
`;

  const deck = await parseMarkdownToDeck(markdown);
  assertEquals(deck.name, "deck"); // Default name
  assertEquals(deck.getCards().length, 2);
});

Deno.test("parseMarkdownToDeck - handles empty markdown", async () => {
  const deck = await parseMarkdownToDeck("");
  assertEquals(deck.name, "deck");
  assertEquals(deck.getCards().length, 0);
});

Deno.test("parseMarkdownToDeck - works with render method", async () => {
  const markdown = `# Test Assistant

## Role

- You are a test assistant
- You help with testing

## Guidelines

- Be accurate
- Be helpful
`;

  const deck = await parseMarkdownToDeck(markdown);
  const rendered = deck.render({ model: "gpt-4" });
  
  assertExists(rendered);
  assertEquals(rendered.model, "gpt-4");
  assertExists(rendered.messages);
  assertEquals(rendered.messages[0].role, "system");
  
  // Check that content includes our specs
  const content = rendered.messages[0].content as string;
  assertExists(content.includes("You are a test assistant"));
  assertExists(content.includes("Be accurate"));
});