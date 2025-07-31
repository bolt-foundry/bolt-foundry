#! /usr/bin/env -S bft test

/**
 * Comprehensive test suite for deck functionality
 *
 * Tests the core deck system that will be implemented in packages/bolt-foundry/deck.ts
 * Based on existing aibff behavior and requirements from the markdown deck implementation plan.
 *
 * Test-driven development approach: Write tests first, then implement clean Deck class.
 */

import { assert, assertEquals } from "@std/assert";
import { readLocalDeck } from "../bolt-foundry.ts";

/**
 * Test utilities
 */
async function createTempDeckFile(
  content: string,
  filename = "test.deck.md",
): Promise<string> {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/${filename}`;
  await Deno.writeTextFile(deckPath, content);
  return deckPath;
}

async function cleanup(path: string): Promise<void> {
  try {
    await Deno.remove(path, { recursive: true });
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Test 1: Basic deck loading - readLocalDeck() reads a simple markdown file
 */
Deno.test("readLocalDeck - loads simple markdown file", async () => {
  const content = `# Customer Service Assistant

You are a helpful customer service assistant.

## Behavior
- Be polite and professional
- Always ask clarifying questions
- Provide clear solutions`;

  const deckPath = await createTempDeckFile(content);

  try {
    const deck = await readLocalDeck(deckPath);

    // Should return a Deck object
    assert(deck, "readLocalDeck should return a deck object");
    assert(typeof deck === "object", "deck should be an object");
  } finally {
    await cleanup(deckPath);
  }
});

Deno.test("Deck - extracts deckId from filename", async () => {
  const content = `# Customer Service Assistant

You are a helpful customer service assistant.`;

  const deckPath = await createTempDeckFile(
    content,
    "customer-service.deck.md",
  );

  try {
    const deck = await readLocalDeck(deckPath);

    // Should extract deckId from filename (without .deck.md extension)
    assertEquals(deck.deckId, "customer-service");
  } finally {
    await cleanup(deckPath);
  }
});

Deno.test("Deck - stores original markdown content", async () => {
  const content = `# Test Deck

This is the original markdown content.

## Section
- Item 1
- Item 2`;

  const deckPath = await createTempDeckFile(content);

  try {
    const deck = await readLocalDeck(deckPath);

    // Should store the exact original markdown content
    assertEquals(deck.markdownContent, content);
  } finally {
    await cleanup(deckPath);
  }
});

Deno.test("Deck - render returns system message", async () => {
  const content = `# Assistant

You are helpful.`;

  const deckPath = await createTempDeckFile(content);

  try {
    const deck = await readLocalDeck(deckPath);

    const result = deck.render(); // Test calling with no parameters

    // Should return messages array with system message
    assert(Array.isArray(result.messages));
    assertEquals(result.messages.length, 1);
    assertEquals(result.messages[0].role, "system");
    assertEquals(result.messages[0].content, content);
  } finally {
    await cleanup(deckPath);
  }
});

Deno.test("Deck - processes basic markdown includes", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    // Create an included file
    await Deno.writeTextFile(
      `${tempDir}/behavior.md`,
      "Be helpful and patient.",
    );

    // Create main deck that includes the file
    const deckContent = `# Assistant

![behavior](behavior.md)

Additional instructions.`;

    await Deno.writeTextFile(`${tempDir}/main.deck.md`, deckContent);

    const deck = await readLocalDeck(`${tempDir}/main.deck.md`);
    const result = deck.render();

    // Should replace the include with the file content
    const expectedContent = `# Assistant

Be helpful and patient.

Additional instructions.`;

    assertEquals(result.messages[0].content, expectedContent);
  } finally {
    await cleanup(tempDir);
  }
});

Deno.test("Deck - processes recursive markdown includes", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    // Create chain: main → level1 → level2
    await Deno.writeTextFile(`${tempDir}/level2.md`, "Level 2 content");
    await Deno.writeTextFile(
      `${tempDir}/level1.md`,
      "Level 1: ![level2](level2.md)",
    );

    const deckContent = `# Main

![level1](level1.md)

End.`;

    await Deno.writeTextFile(`${tempDir}/main.deck.md`, deckContent);

    const deck = await readLocalDeck(`${tempDir}/main.deck.md`);
    const result = deck.render();

    const expectedContent = `# Main

Level 1: Level 2 content

End.`;

    assertEquals(result.messages[0].content, expectedContent);
  } finally {
    await cleanup(tempDir);
  }
});

Deno.test("Deck - processes basic context from TOML", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    // Create context TOML file
    const contextContent = `[contexts.userName]
assistantQuestion = "What is the user's name?"
type = "string"`;

    await Deno.writeTextFile(`${tempDir}/context.toml`, contextContent);

    // Create deck that references context
    const deckContent = `# Assistant

![context](context.toml)

Be helpful.`;

    await Deno.writeTextFile(`${tempDir}/main.deck.md`, deckContent);

    const deck = await readLocalDeck(`${tempDir}/main.deck.md`);
    const result = deck.render({ context: { userName: "Alice" } });

    // Should have system message + Q&A pair
    assertEquals(result.messages.length, 3);
    assertEquals(result.messages[0].role, "system");
    assertEquals(result.messages[0].content, "# Assistant\n\nBe helpful."); // TOML reference removed
    assertEquals(result.messages[1].role, "assistant");
    assertEquals(result.messages[1].content, "What is the user's name?");
    assertEquals(result.messages[2].role, "user");
    assertEquals(result.messages[2].content, "Alice");
  } finally {
    await cleanup(tempDir);
  }
});

Deno.test("Deck - extracts tools from TOML includes", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    // Create TOML file with tools
    const toolsContent = `[[tools]]
name = "get_weather"
description = "Get current weather"

[tools.parameters]
type = "object"
required = ["location"]

[tools.parameters.properties.location]
type = "string"
description = "City and state"`;

    await Deno.writeTextFile(`${tempDir}/tools.toml`, toolsContent);

    // Create deck that includes tools
    const deckContent = `# Weather Assistant

![tools](tools.toml)

You can help with weather.`;

    await Deno.writeTextFile(`${tempDir}/main.deck.md`, deckContent);

    const deck = await readLocalDeck(`${tempDir}/main.deck.md`);
    const result = deck.render();

    // Should extract tools and remove TOML reference
    assert(result.tools);
    assertEquals(result.tools.length, 1);
    assertEquals(result.tools[0].function.name, "get_weather");
    assertEquals(
      result.messages[0].content,
      "# Weather Assistant\n\nYou can help with weather.",
    );
  } finally {
    await cleanup(tempDir);
  }
});
