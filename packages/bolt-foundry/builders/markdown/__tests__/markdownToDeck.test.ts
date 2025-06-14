#! /usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { parseMarkdownToDeck } from "../markdownToDeck.ts";
import { join } from "@std/path";
import type { Card } from "../../builders.ts";

Deno.test("parseMarkdownToDeck - basic deck with name from H1", async () => {
  const markdown = `# My Test Deck

## Card One

- First spec
- Second spec
`;

  const { deck } = await parseMarkdownToDeck(markdown);
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

  const { deck } = await parseMarkdownToDeck(markdown);
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

  const { deck } = await parseMarkdownToDeck(markdown);
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

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  assertEquals(cards.length, 1);
  assertEquals(cards[0].name, "Parent Card");

  const nestedCards = cards[0].value as Array<
    { name: string; value: Array<{ value: string }> }
  >;
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

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  // Should have lead + 2 cards
  assertEquals(cards.length, 3);

  // First item should be the deck lead
  assertEquals(
    cards[0].lead,
    "Some introductory text that should be ignored for now.",
  );
  assertEquals(cards[0].value, "");

  // Second and third should be the cards
  assertEquals(cards[1].name, "Persona");
  assertEquals(cards[2].name, "Behavior");

  // Check nested structure of Persona card
  const personaContent = cards[1].value as Array<{
    name?: string;
    value: unknown;
    lead?: string;
  }>;
  assertEquals(personaContent[0].lead, "You are a helpful assistant.");
  assertEquals(personaContent[1].name, "Background");

  // Check nested structure of Behavior card
  const behaviorContent = cards[2].value as Array<{
    name: string;
    value: unknown;
  }>;
  assertEquals(behaviorContent[0].name, "Communication Style");
});

Deno.test("parseMarkdownToDeck - handles deck without H1", async () => {
  const markdown = `## First Card

- Spec one

## Second Card

- Spec two
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  assertEquals(deck.name, "deck"); // Default name
  assertEquals(deck.getCards().length, 2);
});

Deno.test("parseMarkdownToDeck - handles empty markdown", async () => {
  const { deck } = await parseMarkdownToDeck("");
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

  const { deck } = await parseMarkdownToDeck(markdown);
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

Deno.test("parseMarkdownToDeck - TOML context support", async () => {
  // Create a temporary TOML file for testing
  const tempDir = await Deno.makeTempDir();
  const tomlPath = join(tempDir, "test-context.toml");

  const tomlContent = `
[contexts.userMessage]
type = "string"
question = "What is the user's message?"
description = "The message from the user"

[contexts.maxTokens]
type = "number"
question = "Maximum number of tokens?"
default = 500

[samples.good-example]
userMessage = "Hello"
assistantResponse = "Hi there!"
score = 3
`;

  await Deno.writeTextFile(tomlPath, tomlContent);

  try {
    const markdown = `# Test Deck with TOML

![User context](./test-context.toml)

## Assistant Role

- You are a helpful assistant
- Be concise
`;

    const { deck, samples } = await parseMarkdownToDeck(markdown, tempDir);

    // Check that context variables were added
    const contextVars = deck.getContext();
    assertEquals(contextVars.length, 2);

    // Check first context variable
    assertEquals(contextVars[0].name, "userMessage");
    assertEquals(contextVars[0].type, "string");
    assertEquals(contextVars[0].question, "What is the user's message?");

    // Check second context variable
    assertEquals(contextVars[1].name, "maxTokens");
    assertEquals(contextVars[1].type, "number");
    assertEquals(contextVars[1].question, "Maximum number of tokens?");

    // Check that cards still work
    const cards = deck.getCards();
    assertEquals(cards.length, 1);
    assertEquals(cards[0].name, "Assistant Role");

    // Check that samples were extracted
    assertExists(samples["good-example"]);
    assertEquals(samples["good-example"].userMessage, "Hello");
    assertEquals(samples["good-example"].assistantResponse, "Hi there!");
    assertEquals(samples["good-example"].score, 3);
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("parseMarkdownToDeck - TOML with fragment identifier", async () => {
  // Create a temporary TOML file for testing
  const tempDir = await Deno.makeTempDir();
  const tomlPath = join(tempDir, "contexts.toml");

  const tomlContent = `
[contexts.userMessage]
type = "string"
question = "What is the user's message?"

[contexts.assistantResponse]  
type = "string"
question = "What was the assistant's response?"

[contexts.maxTokens]
type = "number"
question = "Maximum tokens?"
`;

  await Deno.writeTextFile(tomlPath, tomlContent);

  try {
    const markdown = `# Test Deck

![User message context](./contexts.toml#userMessage)

## Grader

- Grade the response
`;

    const { deck } = await parseMarkdownToDeck(markdown, tempDir);

    // Check that only the specified context was added
    const contextVars = deck.getContext();
    assertEquals(contextVars.length, 1);
    assertEquals(contextVars[0].name, "userMessage");
    assertEquals(contextVars[0].type, "string");
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("parseMarkdownToDeck - deck introduction lead after H1", async () => {
  const markdown = `# My Deck

This is an introduction to the deck that explains its purpose.

## First Card

- Some spec
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  // First card should be the lead
  assertEquals(
    cards[0].lead,
    "This is an introduction to the deck that explains its purpose.",
  );
  assertEquals(cards[0].value, "");

  // Second card should be the actual card
  assertEquals(cards[1].name, "First Card");
});

Deno.test("parseMarkdownToDeck - card introduction lead after H2", async () => {
  const markdown = `# Test Deck

## My Card

This lead explains what this card is about.

- First spec
- Second spec
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  assertEquals(cards.length, 1);
  assertEquals(cards[0].name, "My Card");

  const cardContent = cards[0].value as Array<Card>;
  assertEquals(
    cardContent[0].lead,
    "This lead explains what this card is about.",
  );
  assertEquals(cardContent[1].value, "First spec");
  assertEquals(cardContent[2].value, "Second spec");
});

Deno.test("parseMarkdownToDeck - nested card lead after H3", async () => {
  const markdown = `# Test Deck

## Parent Card

### Nested Card

This is a lead for the nested card.

- Nested spec
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  assertEquals(cards.length, 1);
  assertEquals(cards[0].name, "Parent Card");

  const parentContent = cards[0].value as Array<Card>;
  assertEquals(parentContent[0].name, "Nested Card");

  const nestedContent = parentContent[0].value as Array<Card>;
  assertEquals(nestedContent[0].lead, "This is a lead for the nested card.");
  assertEquals(nestedContent[1].value, "Nested spec");
});

Deno.test("parseMarkdownToDeck - jump-out lead after specs", async () => {
  const markdown = `# Test Deck

## My Card

- First spec
- Second spec

This is a jump-out lead that provides transition.
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  assertEquals(cards.length, 1);
  const cardContent = cards[0].value as Array<Card>;
  assertEquals(cardContent.length, 3);
  assertEquals(cardContent[0].value, "First spec");
  assertEquals(cardContent[1].value, "Second spec");
  assertEquals(
    cardContent[2].lead,
    "This is a jump-out lead that provides transition.",
  );
});

Deno.test("parseMarkdownToDeck - jump-out lead vs deck transitional lead", async () => {
  const markdown = `# Test Deck

Some deck-level content before any cards.

## First Card

- Spec one

This is a jump-out lead after specs.

## Second Card

- Spec two
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  assertEquals(cards.length, 3);

  // Deck lead
  assertEquals(cards[0].lead, "Some deck-level content before any cards.");

  // First card should contain the jump-out lead
  assertEquals(cards[1].name, "First Card");
  const firstCardContent = cards[1].value as Array<Card>;
  assertEquals(firstCardContent.length, 2);
  assertEquals(firstCardContent[0].value, "Spec one");
  assertEquals(
    firstCardContent[1].lead,
    "This is a jump-out lead after specs.",
  );

  // Second card
  assertEquals(cards[2].name, "Second Card");
});

Deno.test("parseMarkdownToDeck - complex example with multiple lead types", async () => {
  const markdown = `# Complex Deck

This deck demonstrates all types of leads.

## Main Card

This card has an introduction lead.

### Sub Card

And the sub card has its own lead too.

- A spec in the sub card

This lead jumps out of the sub card.

- Back to main card spec

Transition to next section.

## Another Card

Final card with its lead.

- Final spec
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();

  // Should have deck lead + 2 cards
  assertEquals(cards.length, 3);

  // Deck lead
  assertEquals(cards[0].lead, "This deck demonstrates all types of leads.");

  // Main Card
  assertEquals(cards[1].name, "Main Card");
  const mainContent = cards[1].value as Array<Card>;
  assertEquals(mainContent[0].lead, "This card has an introduction lead.");

  // Sub Card within Main Card
  assertEquals(mainContent[1].name, "Sub Card");
  const subContent = mainContent[1].value as Array<Card>;
  assertEquals(subContent[0].lead, "And the sub card has its own lead too.");
  assertEquals(subContent[1].value, "A spec in the sub card");
  assertEquals(subContent[2].lead, "This lead jumps out of the sub card.");

  // The nested card parsing continues until the next header, so these are still in Sub Card
  assertEquals(subContent[3].value, "Back to main card spec");
  assertEquals(subContent[4].lead, "Transition to next section.");

  // Another Card
  assertEquals(cards[2].name, "Another Card");
  const anotherContent = cards[2].value as Array<Card>;
  assertEquals(anotherContent[0].lead, "Final card with its lead.");
  assertEquals(anotherContent[1].value, "Final spec");
});
