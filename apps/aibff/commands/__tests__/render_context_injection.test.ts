import { assertEquals, assertThrows } from "@std/assert";
import { extractContextFromMarkdown, renderDeck } from "../render.ts";
import { createCapturingUI, ui } from "@bfmono/packages/tui/tui.ts";

// Helper function to create a temporary deck file
async function createTempDeckFile(content: string): Promise<string> {
  const tempFile = await Deno.makeTempFile({ suffix: ".md" });
  await Deno.writeTextFile(tempFile, content);
  return tempFile;
}

// Helper to assert condition
function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

// extractContextFromMarkdown tests
Deno.test("extractContextFromMarkdown - should parse markdown link syntax with alt text", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  const markdown = `# Test Deck
![Configuration](config.toml)

This is the deck content.`;

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"
description = "The user's name"
type = "string"`,
  );

  try {
    const extractedContext = extractContextFromMarkdown(markdown, deckPath);

    assertEquals(Object.keys(extractedContext).length, 1);
    assertEquals(
      extractedContext.userName.assistantQuestion,
      "What is your name?",
    );
    assertEquals(extractedContext.userName.default, "Alice");
    assertEquals(extractedContext.userName.description, "The user's name");
    assertEquals(extractedContext.userName.type, "string");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should skip non-TOML files", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/settings.txt`;

  const markdown = `![Settings](settings.txt)`;
  await Deno.writeTextFile(
    configPath,
    `[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "sk-123"`,
  );

  try {
    const extractedContext = extractContextFromMarkdown(markdown, deckPath);

    // Should skip the .txt file and return empty context
    assertEquals(Object.keys(extractedContext).length, 0);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should resolve relative paths from deck location", async () => {
  const tempDir = await Deno.makeTempDir();
  const subDir = `${tempDir}/decks`;
  await Deno.mkdir(subDir);

  const deckPath = `${subDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  const markdown = `![Config](../config.toml)`;
  await Deno.writeTextFile(
    configPath,
    `[contexts.test]
assistantQuestion = "Test question?"
default = "value"`,
  );

  try {
    const extractedContext = extractContextFromMarkdown(markdown, deckPath);

    assertEquals(Object.keys(extractedContext).length, 1);
    assertEquals(extractedContext.test.assistantQuestion, "Test question?");
    assertEquals(extractedContext.test.default, "value");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should fail if assistantQuestion is missing", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  const markdown = `![Config](config.toml)`;
  await Deno.writeTextFile(
    configPath,
    `[contexts.badContext]
default = "value"
description = "Missing assistantQuestion"`,
  );

  try {
    assertThrows(
      () => extractContextFromMarkdown(markdown, deckPath),
      Error,
      "missing required 'assistantQuestion' field",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should extract context without default values", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  const markdown = `![Config](config.toml)`;
  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
description = "No default value"

[contexts.apiKey]
assistantQuestion = "What is your API key?"
type = "string"`,
  );

  try {
    const extractedContext = extractContextFromMarkdown(markdown, deckPath);

    assertEquals(Object.keys(extractedContext).length, 2);
    assertEquals(extractedContext.userName.default, undefined);
    assertEquals(extractedContext.apiKey.default, undefined);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should handle duplicate variables with warning", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const config1Path = `${tempDir}/config1.toml`;
  const config2Path = `${tempDir}/config2.toml`;

  const markdown = `![Config1](config1.toml)
![Config2](config2.toml)`;

  await Deno.writeTextFile(
    config1Path,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"`,
  );

  await Deno.writeTextFile(
    config2Path,
    `[contexts.userName]
assistantQuestion = "What is your user name?"
default = "Bob"`,
  );

  // Capture warnings using cliui
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };
  Object.assign(ui, captureUI);

  try {
    const extractedContext = extractContextFromMarkdown(markdown, deckPath);

    // Should keep the last definition
    assertEquals(extractedContext.userName.default, "Bob");
    assertEquals(
      extractedContext.userName.assistantQuestion,
      "What is your user name?",
    );

    // Should have warned about duplicate
    const warnings = captureUI.captured
      .filter((m) => m.type === "warn")
      .map((m) => m.message);
    assert(
      warnings.some((w) => w.includes("Context variable 'userName'")),
      "Should warn about duplicate context variable",
    );
  } finally {
    Object.assign(ui, originalUI);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should fail immediately on missing file", () => {
  const deckPath = "/non/existent/test.deck.md";
  const markdown = `![Config](missing.toml)`;

  assertThrows(
    () => extractContextFromMarkdown(markdown, deckPath),
    Error,
    "File not found",
  );
});

Deno.test("extractContextFromMarkdown - should fail immediately on malformed TOML", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/bad.toml`;

  const markdown = `![Config](bad.toml)`;
  await Deno.writeTextFile(
    configPath,
    `[contexts.test
assistantQuestion = "Missing closing bracket"`,
  );

  try {
    assertThrows(
      () => extractContextFromMarkdown(markdown, deckPath),
      Error,
      "Invalid TOML",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("extractContextFromMarkdown - should silently ignore non-context sections", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  const markdown = `![Config](config.toml)`;
  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[settings]
theme = "dark"
fontSize = 14

[other.nested]
value = true`,
  );

  try {
    const extractedContext = extractContextFromMarkdown(markdown, deckPath);

    // Should only extract contexts section
    assertEquals(Object.keys(extractedContext).length, 1);
    assertEquals(extractedContext.userName.default, "Alice");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

// renderDeck function tests
Deno.test("renderDeck function - should remove embeds from system message", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;
  const textPath = `${tempDir}/notes.txt`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Config](config.toml)
![Notes](notes.txt)

This is the content.`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.test]
assistantQuestion = "Test?"
default = "value"`,
  );

  // Create a text file (non-markdown) that should be removed from output
  await Deno.writeTextFile(textPath, "These are some notes");

  try {
    const result = await renderDeck(deckPath, {});

    // System message should not contain ![...] embeds
    const systemMsg = result.messages[0];
    assertEquals(systemMsg.role, "system");
    assert(
      !systemMsg.content.includes("!["),
      "System message should not contain embeds",
    );
    assert(
      systemMsg.content.includes("This is the content"),
      "System message should contain deck content",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("renderDeck function - should add context Q&A in correct format", async () => {
  const deckPath = await createTempDeckFile("# Test");
  const result = await renderDeck(deckPath, {
    userName: "Alice",
    apiKey: "sk-123",
  });

  // Basic structure check
  assert(result.messages.length >= 1, "Should have at least system message");
  assertEquals(result.messages[0].role, "system");

  await Deno.remove(deckPath);
});

Deno.test("renderDeck function - should skip context values without definitions", async () => {
  const deckPath = await createTempDeckFile("# Test");

  // Capture warnings using cliui
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };
  Object.assign(ui, captureUI);

  try {
    const result = await renderDeck(deckPath, {
      unknownVar: "should be ignored",
    });

    // Should only have system message
    assertEquals(result.messages.length, 1);
    assertEquals(result.messages[0].role, "system");

    // Should warn about unrequested variable
    const warnings = captureUI.captured
      .filter((m) => m.type === "warn")
      .map((m) => m.message);
    assert(
      warnings.some((w) => w.includes("unknownVar")),
      "Should warn about unrequested context variable",
    );
  } finally {
    Object.assign(ui, originalUI);
    await Deno.remove(deckPath);
  }
});

Deno.test("renderDeck function - should return complete OpenAI request object", async () => {
  const deckPath = await createTempDeckFile("# Test Deck");
  const result = await renderDeck(deckPath, {});

  assert("messages" in result, "Should have messages property");
  assert(Array.isArray(result.messages), "Messages should be an array");
  assert(result.messages.length > 0, "Should have at least one message");

  await Deno.remove(deckPath);
});

Deno.test("renderDeck function - should spread openAiCompletionOptions last", async () => {
  const deckPath = await createTempDeckFile("# Test");
  const customOptions = {
    temperature: 0.7,
    max_tokens: 1000,
    custom_field: "test",
  };

  const result = await renderDeck(deckPath, {}, customOptions);

  assertEquals(result.temperature, 0.7);
  assertEquals(result.max_tokens, 1000);
  assertEquals(result.custom_field, "test");
  assert("messages" in result, "Should still have messages");

  await Deno.remove(deckPath);
});

// deck rendering with no context tests
Deno.test("deck rendering with no context - should handle decks with no file references", async () => {
  const deckPath = await createTempDeckFile(`# Simple Deck

This is a simple deck with no external references.

## Section

Some content here.`);

  const result = await renderDeck(deckPath, {});

  assertEquals(result.messages.length, 1);
  assertEquals(result.messages[0].role, "system");
  assert(
    result.messages[0].content.includes("Simple Deck"),
    "Should include deck content",
  );

  await Deno.remove(deckPath);
});

// multiple context variables tests
Deno.test("multiple context variables - should handle multiple variables from different files", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const config1Path = `${tempDir}/users.toml`;
  const config2Path = `${tempDir}/api.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Multi-config deck
![Users](users.toml)
![API](api.toml)

Content here.`,
  );

  await Deno.writeTextFile(
    config1Path,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[contexts.userRole]
assistantQuestion = "What is your role?"
default = "developer"`,
  );

  await Deno.writeTextFile(
    config2Path,
    `[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "default-key"

[contexts.apiEndpoint]
assistantQuestion = "What is the API endpoint?"
default = "https://api.example.com"`,
  );

  try {
    const result = await renderDeck(deckPath, {
      userName: "Bob",
      userRole: "admin",
      apiKey: "sk-custom",
      apiEndpoint: "https://api.custom.com",
    });

    // Should have system + 4 Q&A pairs (8 messages total)
    assertEquals(result.messages.length, 9);

    // Check that all context values are included
    const messages = result.messages;
    const userNameIdx = messages.findIndex(
      (m) => m.role === "assistant" && m.content === "What is your name?",
    );
    assert(userNameIdx !== -1, "Should find userName question");
    assertEquals(messages[userNameIdx + 1].content, "Bob");

    const apiKeyIdx = messages.findIndex(
      (m) => m.role === "assistant" && m.content === "What is your API key?",
    );
    assert(apiKeyIdx !== -1, "Should find apiKey question");
    assertEquals(messages[apiKeyIdx + 1].content, "sk-custom");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

// render command integration tests
Deno.test("render command integration - should output JSON with context Q&A pairs", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Configuration](config.toml)

This is the deck content.`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "sk-default"`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stdout
  // deno-lint-ignore no-console
  const originalLog = console.log;
  let output = "";
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  try {
    await renderCommand.run([deckPath]);

    // Parse the JSON output
    const result = JSON.parse(output);

    // Check structure
    assert(result.messages, "Should have messages array");
    assert(result.messages.length >= 5, "Should have system + 2 Q&A pairs");

    // Check system message
    assertEquals(result.messages[0].role, "system");
    assert(
      result.messages[0].content.includes("Test Deck"),
      "System message should include deck title",
    );

    // Check context Q&A pairs
    assertEquals(result.messages[1].role, "assistant");
    assertEquals(result.messages[1].content, "What is your name?");
    assertEquals(result.messages[2].role, "user");
    assertEquals(result.messages[2].content, "Alice");

    assertEquals(result.messages[3].role, "assistant");
    assertEquals(result.messages[3].content, "What is your API key?");
    assertEquals(result.messages[4].role, "user");
    assertEquals(result.messages[4].content, "sk-default");
  } finally {
    // deno-lint-ignore no-console
    console.log = originalLog;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should warn for missing default values", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Configuration](config.toml)`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
description = "User's display name"
type = "string"`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stdout and stderr using cliui
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };
  Object.assign(ui, captureUI);

  try {
    await renderCommand.run([deckPath]);

    // Should still produce valid JSON
    const output = captureUI.captured
      .filter((m) => m.type === "output")
      .map((m) => m.message)
      .join("\n");
    const result = JSON.parse(output);
    assert(result.messages, "Should produce valid output");

    // Should warn about missing default
    const warnings = captureUI.captured
      .filter((m) => m.type === "warn")
      .map((m) => m.message)
      .join("\n");
    const infos = captureUI.captured
      .filter((m) => m.type === "info")
      .map((m) => m.message)
      .join("\n");

    assert(
      warnings.includes("Context variable 'userName' has no default value"),
      "Should warn about missing default",
    );
    assert(
      infos.includes("Description: User's display name"),
      "Should show description in info",
    );
    assert(
      infos.includes("Type: string"),
      "Should show type in info",
    );
  } finally {
    Object.assign(ui, originalUI);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should load context from --context-file", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;
  const contextPath = `${tempDir}/context.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Configuration](config.toml)

This is the deck content.`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "default-key"`,
  );

  // Create context file with overrides
  await Deno.writeTextFile(
    contextPath,
    `userName = "Bob"
apiKey = "secret-key-123"`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stdout
  // deno-lint-ignore no-console
  const originalLog = console.log;
  let output = "";
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Mock Deno.exit
  const originalExit = Deno.exit;
  // @ts-ignore - mocking Deno API
  Deno.exit = () => {
    throw new Error("exit");
  };

  try {
    try {
      await renderCommand.run([deckPath, "--context-file", contextPath]);
    } catch (_e) {
      // Ignore exit error
    }

    // Parse the JSON output - render outputs pure JSON
    const result = JSON.parse(output);
    assert(result.messages, "Should have messages array");

    // Find the context Q&A pairs
    const userNameQ = result.messages.find(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What is your name?",
    );
    const userNameA = result.messages[result.messages.indexOf(userNameQ) + 1];

    const apiKeyQ = result.messages.find(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What is your API key?",
    );
    const apiKeyA = result.messages[result.messages.indexOf(apiKeyQ) + 1];

    // Assert context values were overridden
    assertEquals(userNameA.content, "Bob");
    assertEquals(apiKeyA.content, "secret-key-123");
  } finally {
    // deno-lint-ignore no-console
    console.log = originalLog;
    Deno.exit = originalExit;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should handle missing --context-file with error", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const nonExistentPath = `${tempDir}/missing-context.toml`;

  await Deno.writeTextFile(deckPath, `# Test Deck\n\nContent.`);

  const { renderCommand } = await import("../render.ts");

  // Capture stderr
  // deno-lint-ignore no-console
  const originalErr = console.error;
  let errorOutput = "";
  // deno-lint-ignore no-console
  console.error = (msg: string) => {
    errorOutput += msg + "\n";
  };

  // Mock Deno.exit
  const originalExit = Deno.exit;
  let exitCode: number | undefined;
  // @ts-ignore - mocking Deno API
  Deno.exit = (code?: number) => {
    exitCode = code;
    throw new Error(`Deno.exit(${code})`);
  };

  try {
    try {
      await renderCommand.run([deckPath, "--context-file", nonExistentPath]);
    } catch (e) {
      // Ignore exit error
      if (!(e instanceof Error) || !e.message.includes("Deno.exit")) throw e;
    }

    assertEquals(exitCode, 1);
    assert(
      errorOutput.includes("Error: Context file not found:"),
      "Should report missing file error",
    );
    assert(
      errorOutput.includes(nonExistentPath),
      "Should include the missing file path",
    );
  } finally {
    // deno-lint-ignore no-console
    console.error = originalErr;
    Deno.exit = originalExit;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should handle invalid TOML in --context-file", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const contextPath = `${tempDir}/invalid-context.toml`;

  await Deno.writeTextFile(deckPath, `# Test Deck\n\nContent.`);

  // Write invalid TOML
  await Deno.writeTextFile(
    contextPath,
    `[invalid toml
userName = "Bob"
missing closing bracket`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stderr using cliui
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };
  Object.assign(ui, captureUI);

  // Mock Deno.exit
  const originalExit = Deno.exit;
  let exitCode: number | undefined;
  // @ts-ignore - mocking Deno API
  Deno.exit = (code?: number) => {
    exitCode = code;
    throw new Error(`Deno.exit(${code})`);
  };

  try {
    try {
      await renderCommand.run([deckPath, "--context-file", contextPath]);
    } catch (e) {
      // Ignore exit error
      if (!(e instanceof Error) || !e.message.includes("Deno.exit")) throw e;
    }

    assertEquals(exitCode, 1);

    const errorOutput = captureUI.captured
      .filter((m) => m.type === "error")
      .map((m) => m.message)
      .join("\n");
    assert(
      errorOutput.includes("Parsing context file:"),
      "Should report TOML parsing error",
    );
  } finally {
    Object.assign(ui, originalUI);
    Deno.exit = originalExit;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should override deck defaults with --context-file values", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;
  const contextPath = `${tempDir}/context.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Configuration](config.toml)

Testing override behavior.`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "default-key"

[contexts.temperature]
assistantQuestion = "What temperature?"
default = 0.7
type = "number"`,
  );

  // Context file only overrides some values
  await Deno.writeTextFile(
    contextPath,
    `userName = "Charlie"
temperature = 0.9`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stdout
  // deno-lint-ignore no-console
  const originalLog = console.log;
  let output = "";
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  try {
    await renderCommand.run([deckPath, "--context-file", contextPath]);

    // Parse the JSON output - render outputs pure JSON, but might have "Loaded context from:" message first
    const result = JSON.parse(output);

    // Find the context Q&A pairs
    const messages = result.messages;
    const userNameIdx = messages.findIndex(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What is your name?",
    );
    const apiKeyIdx = messages.findIndex(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What is your API key?",
    );
    const tempIdx = messages.findIndex(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What temperature?",
    );

    // Check overridden values
    assertEquals(messages[userNameIdx + 1].content, "Charlie");
    assertEquals(messages[tempIdx + 1].content, "0.9");
    // Check non-overridden value keeps default
    assertEquals(messages[apiKeyIdx + 1].content, "default-key");
  } finally {
    // deno-lint-ignore no-console
    console.log = originalLog;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should handle multiple context variables from --context-file", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;
  const contextPath = `${tempDir}/context.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Multi-variable Test
![Configuration](config.toml)`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.var1]
assistantQuestion = "Question 1?"
default = "default1"

[contexts.var2]
assistantQuestion = "Question 2?"
default = "default2"

[contexts.var3]
assistantQuestion = "Question 3?"
default = "default3"

[contexts.var4]
assistantQuestion = "Question 4?"
default = "default4"

[contexts.var5]
assistantQuestion = "Question 5?"
default = "default5"`,
  );

  // Override all values
  await Deno.writeTextFile(
    contextPath,
    `var1 = "value1"
var2 = "value2"
var3 = "value3"
var4 = "value4"
var5 = "value5"`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stdout
  // deno-lint-ignore no-console
  const originalLog = console.log;
  let output = "";
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  try {
    await renderCommand.run([deckPath, "--context-file", contextPath]);

    // Parse the JSON output - render outputs pure JSON, but might have "Loaded context from:" message first
    const result = JSON.parse(output);

    // Verify all values were overridden
    const messages = result.messages;
    for (let i = 1; i <= 5; i++) {
      const qIdx = messages.findIndex(
        (m: { role: string; content: string }) =>
          m.role === "assistant" && m.content === `Question ${i}?`,
      );
      assertEquals(messages[qIdx + 1].content, `value${i}`);
    }
  } finally {
    // deno-lint-ignore no-console
    console.log = originalLog;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should handle empty --context-file", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;
  const contextPath = `${tempDir}/empty-context.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Configuration](config.toml)`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "DefaultName"`,
  );

  // Empty context file
  await Deno.writeTextFile(contextPath, "");

  const { renderCommand } = await import("../render.ts");

  // Capture stdout
  // deno-lint-ignore no-console
  const originalLog = console.log;
  let output = "";
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  try {
    await renderCommand.run([deckPath, "--context-file", contextPath]);

    // Parse the JSON output - render outputs pure JSON, but might have "Loaded context from:" message first
    const result = JSON.parse(output);

    // Should use defaults since context file is empty
    const messages = result.messages;
    const qIdx = messages.findIndex(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What is your name?",
    );
    assertEquals(messages[qIdx + 1].content, "DefaultName");
  } finally {
    // deno-lint-ignore no-console
    console.log = originalLog;
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command integration - should handle context file with extra variables not in deck", async () => {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const configPath = `${tempDir}/config.toml`;
  const contextPath = `${tempDir}/context.toml`;

  await Deno.writeTextFile(
    deckPath,
    `# Test Deck
![Configuration](config.toml)`,
  );

  await Deno.writeTextFile(
    configPath,
    `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"`,
  );

  // Context file has extra variables
  await Deno.writeTextFile(
    contextPath,
    `userName = "Bob"
extraVar1 = "ignored"
extraVar2 = 123
notInDeck = true`,
  );

  const { renderCommand } = await import("../render.ts");

  // Capture stdout
  // deno-lint-ignore no-console
  const originalLog = console.log;
  let output = "";
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  try {
    await renderCommand.run([deckPath, "--context-file", contextPath]);

    // Parse the JSON output - render outputs pure JSON, but might have "Loaded context from:" message first
    const result = JSON.parse(output);

    // Should only use userName, ignore others
    const messages = result.messages;
    assertEquals(messages.length, 3); // system + 1 Q&A pair

    const qIdx = messages.findIndex(
      (m: { role: string; content: string }) =>
        m.role === "assistant" && m.content === "What is your name?",
    );
    assertEquals(messages[qIdx + 1].content, "Bob");

    // Extra variables should be silently ignored (no Q&A pairs for them)
    const hasExtraVars = messages.some(
      (m: { role?: string; content?: string }) =>
        m.content &&
        (m.content.includes("extraVar") || m.content.includes("notInDeck")),
    );
    assertEquals(hasExtraVars, false);
  } finally {
    // deno-lint-ignore no-console
    console.log = originalLog;
    await Deno.remove(tempDir, { recursive: true });
  }
});
