import { assertEquals, assertThrows } from "@std/assert";
import { renderDeck } from "../render.ts";

Deno.test("processMarkdownIncludes - should include basic markdown deck file", async () => {
  const tempDir = await Deno.makeTempDir();
  const mainDeckPath = `${tempDir}/main.deck.md`;
  const includedDeckPath = `${tempDir}/included.deck.md`;

  const mainContent = `# Main Deck
![base deck](included.deck.md)

## Main Content`;

  const includedContent = `# Included Deck

This is included content.`;

  await Deno.writeTextFile(mainDeckPath, mainContent);
  await Deno.writeTextFile(includedDeckPath, includedContent);

  try {
    const result = renderDeck(mainDeckPath, {}, {});

    // The system message should contain both contents combined
    const expectedContent = `# Main Deck
# Included Deck

This is included content.

## Main Content`;

    assertEquals(result.messages[0].role, "system");
    assertEquals(result.messages[0].content, expectedContent);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("processMarkdownIncludes - should handle recursive markdown includes", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckAPath = `${tempDir}/a.deck.md`;
  const deckBPath = `${tempDir}/b.deck.md`;
  const deckCPath = `${tempDir}/c.deck.md`;

  const deckA = `# Deck A
![deck b](b.deck.md)
End of A`;

  const deckB = `# Deck B
![deck c](c.deck.md)
End of B`;

  const deckC = `# Deck C
This is the deepest level.`;

  await Deno.writeTextFile(deckAPath, deckA);
  await Deno.writeTextFile(deckBPath, deckB);
  await Deno.writeTextFile(deckCPath, deckC);

  try {
    const result = renderDeck(deckAPath, {}, {});

    const expectedContent = `# Deck A
# Deck B
# Deck C
This is the deepest level.
End of B
End of A`;

    assertEquals(result.messages[0].content, expectedContent);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("processMarkdownIncludes - should resolve relative paths correctly in includes", async () => {
  const tempDir = await Deno.makeTempDir();
  const subDirA = `${tempDir}/dirA`;
  const subDirB = `${tempDir}/dirB`;
  await Deno.mkdir(subDirA);
  await Deno.mkdir(subDirB);

  const mainDeckPath = `${subDirA}/main.deck.md`;
  const includedDeckPath = `${subDirB}/included.deck.md`;

  const mainContent = `# Main
![included](../dirB/included.deck.md)`;

  const includedContent = `# Included from dirB`;

  await Deno.writeTextFile(mainDeckPath, mainContent);
  await Deno.writeTextFile(includedDeckPath, includedContent);

  try {
    const result = renderDeck(mainDeckPath, {}, {});

    const expectedContent = `# Main
# Included from dirB`;

    assertEquals(result.messages[0].content, expectedContent);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("processMarkdownIncludes - should handle markdown includes with TOML references", async () => {
  const tempDir = await Deno.makeTempDir();
  const mainDeckPath = `${tempDir}/main.deck.md`;
  const baseDeckPath = `${tempDir}/base.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  const mainContent = `# Main Deck
![base](base.deck.md)

## Specific Task`;

  const baseContent = `# Base Deck
![config](config.toml)

Base content here.`;

  const configContent = `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"`;

  await Deno.writeTextFile(mainDeckPath, mainContent);
  await Deno.writeTextFile(baseDeckPath, baseContent);
  await Deno.writeTextFile(configPath, configContent);

  try {
    const result = renderDeck(mainDeckPath, { userName: "Bob" }, {});

    // System message should have markdown content but no file references
    const expectedSystemContent = `# Main Deck
# Base Deck


Base content here.

## Specific Task`;

    assertEquals(result.messages[0].content, expectedSystemContent);

    // Should have context Q&A pairs
    assertEquals(result.messages.length, 3);
    assertEquals(result.messages[1].content, "What is your name?");
    assertEquals(result.messages[2].content, "Bob");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("processMarkdownIncludes - should throw error for missing deck includes", async () => {
  const tempDir = await Deno.makeTempDir();
  const mainDeckPath = `${tempDir}/main.deck.md`;

  const mainContent = `# Main
![missing](missing.deck.md)`;

  await Deno.writeTextFile(mainDeckPath, mainContent);

  try {
    assertThrows(
      () => renderDeck(mainDeckPath, {}, {}),
      Error,
      "File not found",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("processMarkdownIncludes - should include .md files", async () => {
  const tempDir = await Deno.makeTempDir();
  const mainDeckPath = `${tempDir}/main.deck.md`;
  const readmePath = `${tempDir}/readme.md`;

  const mainContent = `# Main
![readme](readme.md)
Content`;

  const readmeContent = `# Readme
This should be included`;

  await Deno.writeTextFile(mainDeckPath, mainContent);
  await Deno.writeTextFile(readmePath, readmeContent);

  try {
    const result = renderDeck(mainDeckPath, {}, {});

    // Should include readme.md content
    assertEquals(
      result.messages[0].content,
      "# Main\n# Readme\nThis should be included\nContent",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("TOML path resolution - should resolve TOML paths relative to the deck that references them", async () => {
  const tempDir = await Deno.makeTempDir();
  const subDirA = `${tempDir}/dirA`;
  const subDirB = `${tempDir}/dirB`;
  await Deno.mkdir(subDirA);
  await Deno.mkdir(subDirB);

  const mainDeckPath = `${subDirA}/main.deck.md`;
  const baseDeckPath = `${subDirB}/base.deck.md`;
  const configPath = `${subDirB}/config.toml`;

  const mainContent = `# Main
![base](../dirB/base.deck.md)`;

  const baseContent = `# Base
![config](./config.toml)`;

  const configContent = `[contexts.test]
assistantQuestion = "Test question?"
default = "value"`;

  await Deno.writeTextFile(mainDeckPath, mainContent);
  await Deno.writeTextFile(baseDeckPath, baseContent);
  await Deno.writeTextFile(configPath, configContent);

  try {
    const result = renderDeck(mainDeckPath, { test: "custom" }, {});

    // Should successfully load config.toml relative to base.deck.md
    assertEquals(result.messages.length, 3);
    assertEquals(result.messages[1].content, "Test question?");
    assertEquals(result.messages[2].content, "custom");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("TOML path resolution - should handle complex nested includes with multiple TOML files", async () => {
  const tempDir = await Deno.makeTempDir();
  const rootDir = `${tempDir}/root`;
  const sharedDir = `${tempDir}/shared`;
  await Deno.mkdir(rootDir);
  await Deno.mkdir(sharedDir);

  const appDeckPath = `${rootDir}/app.deck.md`;
  const baseDeckPath = `${sharedDir}/base.deck.md`;
  const appConfigPath = `${rootDir}/app.toml`;
  const baseConfigPath = `${sharedDir}/base.toml`;

  const appDeck = `# App Deck
![base](../shared/base.deck.md)
![app config](./app.toml)`;

  const baseDeck = `# Base Deck
![base config](./base.toml)`;

  const appConfig = `[contexts.appName]
assistantQuestion = "What is the app name?"
default = "MyApp"`;

  const baseConfig = `[contexts.userName]
assistantQuestion = "What is your name?"
default = "User"

[contexts.apiKey]
assistantQuestion = "What is your API key?"`;

  await Deno.writeTextFile(appDeckPath, appDeck);
  await Deno.writeTextFile(baseDeckPath, baseDeck);
  await Deno.writeTextFile(appConfigPath, appConfig);
  await Deno.writeTextFile(baseConfigPath, baseConfig);

  try {
    const context = {
      userName: "Alice",
      appName: "TestApp",
      apiKey: "sk-123",
    };

    const result = renderDeck(appDeckPath, context, {});

    // Should have all three context variables
    assertEquals(result.messages.length, 7); // system + 3 Q&A pairs

    // Verify the order and content
    const messages = result.messages.slice(1); // Skip system message

    // The order should match the deck structure:
    // 1. base.toml contexts (userName, apiKey) from base.deck.md
    // 2. app.toml contexts (appName) from app.deck.md
    assertEquals(messages[0].content, "What is your name?");
    assertEquals(messages[1].content, "Alice");
    assertEquals(messages[2].content, "What is your API key?");
    assertEquals(messages[3].content, "sk-123");
    assertEquals(messages[4].content, "What is the app name?");
    assertEquals(messages[5].content, "TestApp");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
