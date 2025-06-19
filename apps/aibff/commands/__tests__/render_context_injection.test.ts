import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { extractContextFromMarkdown, renderDeck } from "../render.ts";

// Helper function to create a temporary deck file
async function createTempDeckFile(content: string): Promise<string> {
  const tempFile = await Deno.makeTempFile({ suffix: ".md" });
  await Deno.writeTextFile(tempFile, content);
  return tempFile;
}

describe("render context injection", () => {
  describe("extractContextFromMarkdown", () => {
    it("should parse markdown link syntax with alt text", async () => {
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

    it("should skip non-TOML files", async () => {
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

    it("should resolve relative paths from deck location", async () => {
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

    it("should fail if assistantQuestion is missing", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;

      const markdown = `![Config](config.toml)`;
      await Deno.writeTextFile(
        configPath,
        `[contexts.userName]
default = "Alice"
description = "The user's name"`,
      );

      try {
        assertThrows(
          () => {
            extractContextFromMarkdown(markdown, deckPath);
          },
          Error,
          "missing required 'assistantQuestion' field",
        );
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should extract context without default values", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;

      const markdown = `![Config](config.toml)`;
      await Deno.writeTextFile(
        configPath,
        `[contexts.apiKey]
assistantQuestion = "What is your API key?"
description = "API key for authentication"
type = "string"`,
      );

      try {
        const extractedContext = extractContextFromMarkdown(markdown, deckPath);

        assertEquals(
          extractedContext.apiKey.assistantQuestion,
          "What is your API key?",
        );
        assertEquals(
          extractedContext.apiKey.description,
          "API key for authentication",
        );
        assertEquals(extractedContext.apiKey.type, "string");
        assertEquals(extractedContext.apiKey.default, undefined);
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should handle duplicate variables with warning", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const config1Path = `${tempDir}/config1.toml`;
      const config2Path = `${tempDir}/config2.toml`;

      const markdown = `![First](config1.toml)
![Second](config2.toml)`;

      await Deno.writeTextFile(
        config1Path,
        `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"`,
      );

      await Deno.writeTextFile(
        config2Path,
        `[contexts.userName]
assistantQuestion = "What should I call you?"
default = "Bob"`,
      );

      // deno-lint-ignore no-console
      const originalWarn = console.warn;
      const warnings: Array<string> = [];
      // deno-lint-ignore no-console
      console.warn = (msg: string) => {
        warnings.push(msg);
      };

      try {
        const extractedContext = extractContextFromMarkdown(markdown, deckPath);

        // Check warnings
        assertEquals(warnings.length, 4);
        assertEquals(
          warnings[0],
          "Warning: Context variable 'userName' is defined in multiple files:",
        );
        assert(warnings[1].includes("config1.toml"));
        assert(warnings[2].includes("config2.toml"));
        assertEquals(warnings[3], `  Using definition from: ${config2Path}`);

        // Check that last definition wins
        assertEquals(
          extractedContext.userName.assistantQuestion,
          "What should I call you?",
        );
        assertEquals(extractedContext.userName.default, "Bob");
      } finally {
        // deno-lint-ignore no-console
        console.warn = originalWarn;
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should fail immediately on missing file", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;

      const markdown = `![Config](missing.toml)`;

      try {
        assertThrows(
          () => {
            extractContextFromMarkdown(markdown, deckPath);
          },
          Error,
          "File not found",
        );
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should fail immediately on malformed TOML", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;

      const markdown = `![Config](config.toml)`;
      await Deno.writeTextFile(
        configPath,
        `[contexts.test
invalid toml syntax`,
      );

      try {
        assertThrows(
          () => {
            extractContextFromMarkdown(markdown, deckPath);
          },
          Error,
          "Invalid TOML",
        );
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should silently ignore non-context sections", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;

      const markdown = `![Config](config.toml)`;
      await Deno.writeTextFile(
        configPath,
        `[server]
port = 8080
host = "localhost"

[database]
url = "postgres://localhost/db"

[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"`,
      );

      try {
        const extractedContext = extractContextFromMarkdown(markdown, deckPath);

        // Should only extract context section, not other sections
        assertEquals(Object.keys(extractedContext).length, 1);
        assertEquals(
          extractedContext.userName.assistantQuestion,
          "What is your name?",
        );
        assertEquals(extractedContext.userName.default, "Alice");
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });
  });

  describe("renderDeck function", () => {
    it("should remove embeds from system message", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;
      const settingsPath = `${tempDir}/settings.toml`;

      const markdown = `# My Deck
![Config](config.toml)
![Settings](settings.toml)

This is the content.`;

      await Deno.writeTextFile(deckPath, markdown);
      await Deno.writeTextFile(
        configPath,
        `[contexts.test]
assistantQuestion = "Test?"
default = "value"`,
      );
      await Deno.writeTextFile(settingsPath, "[other]\nvalue = 42");

      try {
        const result = renderDeck(deckPath, { test: "value" }, {});
        assertEquals(
          result.messages[0].content,
          "# My Deck\n\n\n\nThis is the content.",
        );
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should add context Q&A in correct format", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;

      const markdown = `System prompt
![Config](config.toml)`;
      const context = {
        userName: "Alice",
        apiKey: "sk-123",
      };

      await Deno.writeTextFile(deckPath, markdown);
      await Deno.writeTextFile(
        configPath,
        `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "sk-123"`,
      );

      try {
        const result = renderDeck(deckPath, context, {});
        assertEquals(result.messages.length, 5);
        assertEquals(result.messages[0], {
          role: "system",
          content: "System prompt",
        });
        assertEquals(result.messages[1], {
          role: "assistant",
          content: "What is your name?",
        });
        assertEquals(result.messages[2], { role: "user", content: "Alice" });
        assertEquals(result.messages[3], {
          role: "assistant",
          content: "What is your API key?",
        });
        assertEquals(result.messages[4], { role: "user", content: "sk-123" });
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should skip context values without definitions", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const configPath = `${tempDir}/config.toml`;

      const markdown = `System prompt
![Config](config.toml)`;
      const context = {
        userName: "Alice",
        unknownVar: "value",
      };

      await Deno.writeTextFile(deckPath, markdown);
      await Deno.writeTextFile(
        configPath,
        `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"`,
      );

      try {
        const result = renderDeck(deckPath, context, {});
        // Should only include Q&A for userName, not unknownVar
        assertEquals(result.messages.length, 3);
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });

    it("should return complete OpenAI request object", async () => {
      const tempFile = await createTempDeckFile("Test");
      try {
        const result = renderDeck(tempFile, {}, {});
        assertEquals(result.messages[0], { role: "system", content: "Test" });
        assert("messages" in result);
      } finally {
        await Deno.remove(tempFile);
      }
    });

    it("should spread openAiCompletionOptions last", async () => {
      const options = {
        model: "gpt-4",
        temperature: 0.7,
        messages: [{ role: "user" as const, content: "Override" }], // This should override generated messages
      };

      const tempFile = await createTempDeckFile("Test");
      try {
        const result = renderDeck(tempFile, {}, options);
        assertEquals(result.model, "gpt-4");
        assertEquals(result.temperature, 0.7);
        assertEquals(result.messages.length, 1); // User's messages override generated ones
        assertEquals(result.messages[0], { role: "user", content: "Override" });
      } finally {
        await Deno.remove(tempFile);
      }
    });
  });

  describe("deck rendering with no context", () => {
    it("should handle decks with no file references", async () => {
      const markdown = `# Simple Deck

Just a plain deck with no context.`;

      const extractedContext = extractContextFromMarkdown(
        markdown,
        "/fake/path/deck.md",
      );
      assertEquals(Object.keys(extractedContext).length, 0);

      const tempFile = await createTempDeckFile(markdown);
      try {
        const result = renderDeck(tempFile, {}, extractedContext);
        assertEquals(result.messages.length, 1);
        assertEquals(result.messages[0].role, "system");
        assertEquals(
          result.messages[0].content,
          "# Simple Deck\n\nJust a plain deck with no context.",
        );
      } finally {
        await Deno.remove(tempFile);
      }
    });
  });

  describe("multiple context variables", () => {
    it("should handle multiple variables from different files", async () => {
      const tempDir = await Deno.makeTempDir();
      const deckPath = `${tempDir}/test.deck.md`;
      const userPath = `${tempDir}/user.toml`;
      const apiPath = `${tempDir}/api.toml`;
      const settingsPath = `${tempDir}/settings.toml`;

      const markdown = `# Multi-context deck
![User Config](user.toml)
![API Config](api.toml)
![Settings](settings.toml)`;

      await Deno.writeTextFile(
        userPath,
        `[contexts.userName]
assistantQuestion = "What is your name?"
default = "Alice"

[contexts.userRole]
assistantQuestion = "What is your role?"
default = "admin"`,
      );

      await Deno.writeTextFile(
        apiPath,
        `[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "sk-123"

[contexts.endpoint]
assistantQuestion = "What API endpoint?"
default = "https://api.example.com"`,
      );

      await Deno.writeTextFile(
        settingsPath,
        `[contexts.temperature]
assistantQuestion = "What temperature?"
default = 0.7
type = "number"`,
      );

      try {
        const extractedContext = extractContextFromMarkdown(markdown, deckPath);

        // Should have 5 context variables
        assertEquals(Object.keys(extractedContext).length, 5);

        // Build context values from defaults
        const contextValues: Record<string, unknown> = {};
        for (const [key, def] of Object.entries(extractedContext)) {
          if (def.default !== undefined) {
            contextValues[key] = def.default;
          }
        }

        // Write the deck file to the temp directory
        await Deno.writeTextFile(deckPath, markdown);
        const result = renderDeck(deckPath, contextValues, {});

        // System message + 5 context vars * 2 messages each = 11 total
        assertEquals(result.messages.length, 11);

        // Verify order matches file reference order
        assertEquals(result.messages[1].content, "What is your name?");
        assertEquals(result.messages[3].content, "What is your role?");
        assertEquals(result.messages[5].content, "What is your API key?");
        assertEquals(result.messages[7].content, "What API endpoint?");
        assertEquals(result.messages[9].content, "What temperature?");
      } finally {
        await Deno.remove(tempDir, { recursive: true });
      }
    });
  });
});

describe("render command integration", () => {
  it("should output JSON with context Q&A pairs", async () => {
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
default = "Alice"`,
    );

    const { renderCommand } = await import("../render.ts");

    // Capture stdout
    // deno-lint-ignore no-console
    const originalLog = console.log;
    let output = "";
    // deno-lint-ignore no-console
    console.log = (msg: string) => {
      output = msg;
    };

    // Mock Deno.exit to prevent test from exiting
    const originalExit = Deno.exit;
    let exitCode: number | undefined;
    // @ts-ignore - mocking Deno API
    Deno.exit = (code?: number) => {
      exitCode = code;
      throw new Error(`Deno.exit(${code})`);
    };

    try {
      try {
        await renderCommand.run([deckPath]);
      } catch (e) {
        // Ignore exit error
        if (!(e instanceof Error) || !e.message.includes("Deno.exit")) throw e;
      }

      assertEquals(exitCode, undefined); // Should not exit on success
      const result = JSON.parse(output);

      assertEquals(result.messages.length, 3);
      assertEquals(result.messages[0].role, "system");
      assertEquals(
        result.messages[0].content,
        "# Test Deck\n\n\nThis is the deck content.",
      );
      assertEquals(result.messages[1].role, "assistant");
      assertEquals(result.messages[1].content, "What is your name?");
      assertEquals(result.messages[2].role, "user");
      assertEquals(result.messages[2].content, "Alice");
    } finally {
      // deno-lint-ignore no-console
      console.log = originalLog;
      Deno.exit = originalExit;
      await Deno.remove(tempDir, { recursive: true });
    }
  });

  it("should warn for missing default values", async () => {
    const tempDir = await Deno.makeTempDir();
    const deckPath = `${tempDir}/test.deck.md`;
    const configPath = `${tempDir}/config.toml`;

    await Deno.writeTextFile(deckPath, `![Config](config.toml)`);
    await Deno.writeTextFile(
      configPath,
      `[contexts.apiKey]
assistantQuestion = "What is your API key?"
description = "API key for authentication"
type = "string"`,
    );

    const { renderCommand } = await import("../render.ts");

    // deno-lint-ignore no-console
    const originalWarn = console.warn;
    const warnings: Array<string> = [];
    // deno-lint-ignore no-console
    console.warn = (msg: string) => {
      warnings.push(msg);
    };

    // deno-lint-ignore no-console
    const originalLog = console.log;
    // deno-lint-ignore no-console
    console.log = () => {}; // Suppress output

    // Mock Deno.exit
    const originalExit = Deno.exit;
    // @ts-ignore - Mocking Deno.exit for testing purposes
    Deno.exit = () => {
      throw new Error("exit");
    };

    try {
      try {
        await renderCommand.run([deckPath]);
      } catch (_e) {
        // Ignore exit error
      }

      assertEquals(warnings.length, 3);
      assertEquals(
        warnings[0],
        "Warning: Context variable 'apiKey' has no default value",
      );
      assertEquals(warnings[1], "  Description: API key for authentication");
      assertEquals(warnings[2], "  Type: string");
    } finally {
      // deno-lint-ignore no-console
      console.warn = originalWarn;
      // deno-lint-ignore no-console
      console.log = originalLog;
      Deno.exit = originalExit;
      await Deno.remove(tempDir, { recursive: true });
    }
  });
});

// Helper to assert condition
function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
