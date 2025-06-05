#!/usr/bin/env -S bff test

import { assertEquals, assertRejects } from "@std/assert";
import { stub } from "@std/testing/mock";
import { runEval } from "../eval.ts";

Deno.test("eval - should run end-to-end evaluation with mock API", async () => {
  // Stub fetch to return a predictable score
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            choices: [{
              message: {
                content: JSON.stringify({
                  score: 2,
                  notes: "Test evaluation passed",
                }),
              },
            }],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
  );

  try {
    const results = await runEval({
      inputFile: new URL("./test-data.jsonl", import.meta.url).pathname,
      graderFile: new URL("./test-deck.ts", import.meta.url).pathname,
      model: "openai/gpt-4o",
    });

    // Should have processed 1 sample from test-data.jsonl
    assertEquals(results.length, 1);

    // Check result structure
    const firstResult = results[0];
    assertEquals(firstResult.model, "openai/gpt-4o");
    assertEquals(firstResult.id, "test-1");
    assertEquals(firstResult.iteration, 1);
    assertEquals(firstResult.score, 2);
    assertEquals(firstResult.output.notes, "Test evaluation passed");
    assertEquals(typeof firstResult.latencyInMs, "number");

    // Verify fetch was called with OpenRouter URL
    assertEquals(fetchStub.calls.length, 1);
    const firstCall = fetchStub.calls[0];
    assertEquals(
      firstCall.args[0],
      "https://openrouter.ai/api/v1/chat/completions",
    );
  } finally {
    fetchStub.restore();
  }
});

Deno.test("eval - should handle missing input file", async () => {
  // Stub file read to throw not found error
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.reject(new Deno.errors.NotFound("file not found")),
  );

  try {
    await assertRejects(
      async () => {
        await runEval({
          inputFile: "./nonexistent.jsonl",
          graderFile: "./examples/json-validator.ts",
          model: "openai/gpt-4o",
        });
      },
      Error,
      "No such file",
    );
  } finally {
    readTextFileStub.restore();
  }
});

Deno.test("eval - should handle invalid grader file", async () => {
  // Stub file read to succeed for input file
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () =>
      Promise.resolve(
        '{"id":"test","userMessage":"test","assistantResponse":"test"}',
      ),
  );

  // Stub stat to throw not found for grader file
  const statStub = stub(
    Deno,
    "stat",
    (path: string | URL) => {
      if (path.toString().includes("nonexistent-grader")) {
        return Promise.reject(new Deno.errors.NotFound("file not found"));
      }
      return Promise.resolve({ isFile: true } as Deno.FileInfo);
    },
  );

  try {
    await assertRejects(
      async () => {
        await runEval({
          inputFile: "./valid.jsonl",
          graderFile: "./nonexistent-grader.ts",
          model: "openai/gpt-4o",
        });
      },
      Error,
      "No such file",
    );
  } finally {
    readTextFileStub.restore();
    statStub.restore();
  }
});
