#!/usr/bin/env -S bft test

/**
 * Tests for Deck render enhancement
 *
 * These tests verify the SDK metadata collection implementation
 * specifically for the Deck class render method enhancement.
 */

import { assertEquals } from "@std/assert";
import { Deck } from "@bfmono//workspace/packages/bolt-foundry/deck.ts";
import type { BfOptions } from "@bfmono//workspace/packages/bolt-foundry/types.ts";

/**
 * Test 1: Metadata inclusion - render with default BfOptions
 */
Deno.test("Deck.render - includes metadata by default", () => {
  const deck = new Deck("test-deck", "# Test Deck", "/path/to/test.deck.md");

  const result = deck.render(
    { userName: "Alice", count: 5 },
  );

  // Should include bfMetadata by default
  assertEquals(result.bfMetadata?.deckId, "test-deck");
  assertEquals(result.bfMetadata?.contextVariables, {
    userName: "Alice",
    count: 5,
  });
  assertEquals(result.bfMetadata?.attributes, undefined);

  // Should still have messages
  assertEquals(Array.isArray(result.messages), true);
  assertEquals(result.messages.length > 0, true);
});

/**
 * Test 2: Metadata exclusion - render with captureTelemetry:false
 */
Deno.test("Deck.render - excludes metadata when captureTelemetry is false", () => {
  const deck = new Deck("test-deck", "# Test Deck", "/path/to/test.deck.md");

  const result = deck.render(
    { userName: "Bob" },
    undefined,
    { captureTelemetry: false },
  );

  // Should not include bfMetadata
  assertEquals(result.bfMetadata, undefined);

  // Should still have messages
  assertEquals(Array.isArray(result.messages), true);
});

/**
 * Test 3: Attributes handling - Verify attributes passed through correctly
 */
Deno.test("Deck.render - includes attributes when provided", () => {
  const deck = new Deck(
    "invoice-deck",
    "# Invoice Processing",
    "/path/to/invoice.deck.md",
  );

  const attributes = {
    invoiceImage: "base64_encoded_image_data",
    source: "email",
    priority: "high",
  };

  const result = deck.render(
    { invoiceId: "INV-001" },
    undefined,
    { attributes },
  );

  // Should include attributes in metadata
  assertEquals(result.bfMetadata?.deckId, "invoice-deck");
  assertEquals(result.bfMetadata?.contextVariables, { invoiceId: "INV-001" });
  assertEquals(result.bfMetadata?.attributes, attributes);
});

/**
 * Test 4: contextVariables capture - Verify first param becomes contextVariables
 */
Deno.test("Deck.render - captures contextVariables from first parameter", () => {
  const deck = new Deck("greeting", "# Greeting Bot", "/greeting.deck.md");

  const contextVars = {
    userName: "Charlie",
    timeOfDay: "morning",
    temperature: 0.7,
    nested: { data: "value" },
  };

  const result = deck.render(contextVars);

  assertEquals(result.bfMetadata?.contextVariables, contextVars);
  assertEquals(result.bfMetadata?.contextVariables.userName, "Charlie");
  assertEquals(result.bfMetadata?.contextVariables.nested, { data: "value" });
});

/**
 * Test 5: OpenAI params merging - Verify second param merges correctly
 */
Deno.test("Deck.render - merges OpenAI params correctly", () => {
  const deck = new Deck("chat", "# Chat Assistant", "/chat.deck.md");

  const openaiParams = {
    temperature: 0.5,
    max_tokens: 1000,
    presence_penalty: 0.6,
    messages: [
      { role: "user", content: "Previous message" },
      { role: "assistant", content: "Previous response" },
    ],
  };

  const result = deck.render(
    { topic: "science" },
    openaiParams,
  );

  // Should merge OpenAI params
  assertEquals(result.temperature, 0.5);
  assertEquals(result.max_tokens, 1000);
  assertEquals(result.presence_penalty, 0.6);

  // Messages should be replaced by OpenAI params
  assertEquals(result.messages, openaiParams.messages);

  // Should still have metadata
  assertEquals(result.bfMetadata?.deckId, "chat");
  assertEquals(result.bfMetadata?.contextVariables, { topic: "science" });
});

/**
 * Test 6: Undefined middle parameter - Verify can skip OpenAI params
 */
Deno.test("Deck.render - handles undefined OpenAI params", () => {
  const deck = new Deck("summary", "# Summarizer", "/summary.deck.md");

  const result = deck.render(
    { text: "Long text to summarize" },
    undefined,
    { attributes: { length: "short" } },
  );

  // Should include metadata with attributes
  assertEquals(result.bfMetadata?.deckId, "summary");
  assertEquals(result.bfMetadata?.contextVariables, {
    text: "Long text to summarize",
  });
  assertEquals(result.bfMetadata?.attributes, { length: "short" });

  // Should have default messages from deck
  assertEquals(Array.isArray(result.messages), true);
});

/**
 * Test 7: All parameters together
 */
Deno.test("Deck.render - handles all three parameters correctly", () => {
  const deck = new Deck("analysis", "# Data Analysis", "/analysis.deck.md");

  const contextVars = { dataset: "sales_2024" };
  const openaiParams = {
    temperature: 0.2,
    model: "gpt-4",
  };
  const bfOptions: BfOptions = {
    captureTelemetry: true,
    attributes: {
      chartType: "bar",
      format: "json",
    },
  };

  const result = deck.render(contextVars, openaiParams, bfOptions);

  // Check all aspects
  assertEquals(result.temperature, 0.2);
  assertEquals(result.model, "gpt-4");
  assertEquals(result.bfMetadata?.deckId, "analysis");
  assertEquals(result.bfMetadata?.contextVariables, contextVars);
  assertEquals(result.bfMetadata?.attributes, bfOptions.attributes);
});

/**
 * Test 8: Empty context variables
 */
Deno.test("Deck.render - handles empty context variables", () => {
  const deck = new Deck("simple", "# Simple Deck", "/simple.deck.md");

  const result = deck.render({});

  assertEquals(result.bfMetadata?.deckId, "simple");
  assertEquals(result.bfMetadata?.contextVariables, {});
  assertEquals(result.bfMetadata?.attributes, undefined);
});

/**
 * Test 9: Complex nested attributes
 */
Deno.test("Deck.render - handles complex nested attributes", () => {
  const deck = new Deck("complex", "# Complex Deck", "/complex.deck.md");

  const result = deck.render(
    { query: "test" },
    undefined,
    {
      attributes: {
        user: {
          id: "123",
          preferences: {
            theme: "dark",
            language: "en",
          },
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: "1.0.0",
        },
      },
    },
  );

  // Verify nested attributes are preserved
  assertEquals(result.bfMetadata?.attributes?.user?.preferences?.theme, "dark");
  assertEquals(result.bfMetadata?.attributes?.metadata?.version, "1.0.0");
});

/**
 * Test 10: Backward compatibility - render with old signature
 */
Deno.test("Deck.render - maintains backward compatibility with two params", () => {
  const deck = new Deck("legacy", "# Legacy Deck", "/legacy.deck.md");

  // Old style: render(params, context)
  const result = deck.render(
    { input: "data" },
    { context: { additionalInfo: "test" } },
  );

  // Should work but interpret second param as OpenAI params
  assertEquals(result.context, { additionalInfo: "test" });

  // Should still add metadata by default
  assertEquals(result.bfMetadata?.deckId, "legacy");
  assertEquals(result.bfMetadata?.contextVariables, { input: "data" });
});
