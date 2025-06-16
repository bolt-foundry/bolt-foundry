#!/usr/bin/env -S bff test

import { makeGraderDeckBuilder } from "../makeGraderDeckBuilder.ts";

// Test to verify that grader content is appended after user content
Deno.test("makeGraderDeckBuilder appends content in correct order", () => {
  const graderDeck = makeGraderDeckBuilder("test-grader")
    .spec("User spec 1")
    .spec("User spec 2")
    .card("user criteria", (c) =>
      c.spec("User criterion 1")
        .spec("User criterion 2"))
    .context((c) => c.string("customVar", "Custom question?"));

  // Render the deck to see the final output
  const rendered = graderDeck.render({
    model: "test-model",
    context: {
      userMessage: "Test user message",
      assistantResponse: "Test response",
      customVar: "Custom value",
    },
  });

  // Check that the system message has user content before grader content
  const systemMessage = rendered.messages?.[0];
  if (systemMessage?.role !== "system") {
    throw new Error("Expected first message to be system message");
  }

  const content = systemMessage.content as string;

  // Verify user specs come first
  const userSpec1Index = content.indexOf("User spec 1");
  const userSpec2Index = content.indexOf("User spec 2");
  const evalTaskIndex = content.indexOf("evaluation task");

  if (userSpec1Index === -1 || userSpec2Index === -1 || evalTaskIndex === -1) {
    throw new Error("Expected content not found in system message");
  }

  // User specs should come before evaluation task
  if (userSpec1Index > evalTaskIndex || userSpec2Index > evalTaskIndex) {
    throw new Error("User specs should appear before evaluation task");
  }

  // Check context messages order
  const contextMessages = rendered.messages?.slice(1) || [];

  // Find the grader context questions (which should exist)
  const userMessageQuestion = contextMessages.find((m) =>
    m.role === "assistant" && typeof m.content === "string" &&
    m.content.includes("What was the user's original message?")
  );

  const assistantResponseQuestion = contextMessages.find((m) =>
    m.role === "assistant" && typeof m.content === "string" &&
    m.content.includes("What was the assistant's response?")
  );

  if (!userMessageQuestion || !assistantResponseQuestion) {
    throw new Error("Expected grader context questions not found");
  }

  // Verify that grader contexts are present and in order
  const userMessageIndex = contextMessages.indexOf(userMessageQuestion);
  const assistantResponseIndex = contextMessages.indexOf(
    assistantResponseQuestion,
  );

  if (userMessageIndex >= assistantResponseIndex) {
    throw new Error(
      "User message question should come before assistant response question",
    );
  }

  // Test passed - grader content correctly appended after user content
});
