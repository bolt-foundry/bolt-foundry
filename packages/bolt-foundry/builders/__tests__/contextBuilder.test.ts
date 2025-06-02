import { assertEquals } from "@std/assert";
import { makeContextBuilder, makeDeckBuilder } from "../builders.ts";

Deno.test("ContextBuilder - creates string context variable", () => {
  const builder = makeContextBuilder();
  const result = builder.string("name", "What is your name?");

  const variables = result.getVariables();
  assertEquals(variables.length, 1);
  assertEquals(variables[0], {
    name: "name",
    type: "string",
    question: "What is your name?",
  });
});

Deno.test("ContextBuilder - creates number context variable", () => {
  const builder = makeContextBuilder();
  const result = builder.number("age", "How old are you?");

  const variables = result.getVariables();
  assertEquals(variables.length, 1);
  assertEquals(variables[0], {
    name: "age",
    type: "number",
    question: "How old are you?",
  });
});

Deno.test("ContextBuilder - creates boolean context variable", () => {
  const builder = makeContextBuilder();
  const result = builder.boolean("isPremium", "Are you a premium user?");

  const variables = result.getVariables();
  assertEquals(variables.length, 1);
  assertEquals(variables[0], {
    name: "isPremium",
    type: "boolean",
    question: "Are you a premium user?",
  });
});

Deno.test("ContextBuilder - creates object context variable", () => {
  const builder = makeContextBuilder();
  const result = builder.object("preferences", "What are your preferences?");

  const variables = result.getVariables();
  assertEquals(variables.length, 1);
  assertEquals(variables[0], {
    name: "preferences",
    type: "object",
    question: "What are your preferences?",
  });
});

Deno.test("ContextBuilder - chains multiple context variables", () => {
  const builder = makeContextBuilder()
    .string("name", "What is your name?")
    .number("age", "How old are you?")
    .boolean("subscriber", "Are you a subscriber?")
    .object("settings", "What are your settings?");

  const variables = builder.getVariables();
  assertEquals(variables.length, 4);
  assertEquals(variables[0].name, "name");
  assertEquals(variables[1].name, "age");
  assertEquals(variables[2].name, "subscriber");
  assertEquals(variables[3].name, "settings");
});

Deno.test("DeckBuilder - adds context variables", () => {
  const card = makeDeckBuilder("test-card")
    .spec("Be helpful")
    .context((c) =>
      c.string("userName", "What is the user's name?")
        .number("userAge", "What is the user's age?")
    );

  const context = card.getContext();
  assertEquals(context.length, 2);
  assertEquals(context[0].name, "userName");
  assertEquals(context[1].name, "userAge");
});

Deno.test("DeckBuilder - renders with context", () => {
  const card = makeDeckBuilder("assistant")
    .spec("You are a helpful assistant")
    .context((c) =>
      c.string("userName", "What is the user's name?")
        .number("userAge", "What is the user's age?")
    );

  const result = card.render({
    context: {
      userName: "Alice",
      userAge: 30,
    },
  });

  assertEquals(result.messages.length, 5);

  // System message
  assertEquals(result.messages[0].role, "system");
  assertEquals(result.messages[0].content, "You are a helpful assistant");

  // Context Q&A pairs
  assertEquals(result.messages[1].role, "assistant");
  assertEquals(result.messages[1].content, "What is the user's name?");
  assertEquals(result.messages[2].role, "user");
  assertEquals(result.messages[2].content, "Alice");
  assertEquals(result.messages[3].role, "assistant");
  assertEquals(result.messages[3].content, "What is the user's age?");
  assertEquals(result.messages[4].role, "user");
  assertEquals(result.messages[4].content, "30");
});

Deno.test("DeckBuilder - omits missing context variables", () => {
  const card = makeDeckBuilder("assistant")
    .spec("You are a helpful assistant")
    .context((c) =>
      c.string("userName", "What is the user's name?")
        .number("userAge", "What is the user's age?")
        .boolean("isPremium", "Are you a premium user?")
    );

  const result = card.render({
    context: {
      userName: "Bob",
      // userAge and isPremium are omitted
    },
  });

  assertEquals(result.messages.length, 3);

  // System message
  assertEquals(result.messages[0].role, "system");
  assertEquals(result.messages[0].content, "You are a helpful assistant");

  // Only provided context
  assertEquals(result.messages[1].role, "assistant");
  assertEquals(result.messages[1].content, "What is the user's name?");
  assertEquals(result.messages[2].role, "user");
  assertEquals(result.messages[2].content, "Bob");
});

Deno.test("DeckBuilder - renders object context as JSON", () => {
  const card = makeDeckBuilder("assistant")
    .spec("You are a helpful assistant")
    .context((c) => c.object("preferences", "What are your preferences?"));

  const result = card.render({
    context: {
      preferences: { theme: "dark", language: "en" },
    },
  });

  assertEquals(result.messages.length, 3);
  assertEquals(result.messages[2].role, "user");
  assertEquals(result.messages[2].content, '{"theme":"dark","language":"en"}');
});

Deno.test("DeckBuilder - renders boolean context", () => {
  const card = makeDeckBuilder("assistant")
    .spec("You are a helpful assistant")
    .context((c) => c.boolean("isPremium", "Are you a premium user?"));

  const result = card.render({
    context: {
      isPremium: true,
    },
  });

  assertEquals(result.messages.length, 3);
  assertEquals(result.messages[2].role, "user");
  assertEquals(result.messages[2].content, "true");
});

Deno.test("DeckBuilder - handles null values in context", () => {
  const card = makeDeckBuilder("assistant")
    .spec("You are a helpful assistant")
    .context((c) => c.object("data", "What is the data?"));

  const result = card.render({
    context: {
      data: null,
    },
  });

  assertEquals(result.messages.length, 3);
  assertEquals(result.messages[2].role, "user");
  assertEquals(result.messages[2].content, "null");
});

Deno.test("DeckBuilder - maintains immutability with context", () => {
  const base = makeDeckBuilder("base")
    .spec("Base spec");

  const withContext = base.context((c) =>
    c.string("name", "What is your name?")
  );

  assertEquals(base.getContext().length, 0);
  assertEquals(withContext.getContext().length, 1);
});
