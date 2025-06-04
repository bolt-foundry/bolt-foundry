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
      deckFile: new URL("./test-deck.ts", import.meta.url).pathname,
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
          deckFile: "./examples/json-validator.ts",
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

Deno.test("eval - should handle invalid deck file", async () => {
  // Stub file read to succeed for input file
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () =>
      Promise.resolve(
        '{"id":"test","userMessage":"test","assistantResponse":"test"}',
      ),
  );

  // Stub stat to throw not found for deck file
  const statStub = stub(
    Deno,
    "stat",
    (path: string | URL) => {
      if (path.toString().includes("nonexistent-deck")) {
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
          deckFile: "./nonexistent-deck.ts",
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

// Phase 2 tests: Score naming unification
Deno.test("eval - should accept samples with groundTruthScore field", async () => {
  const sampleWithGroundTruth = {
    id: "test-ground-truth",
    userMessage: "What is 2+2?",
    assistantResponse: "2+2 equals 4",
    groundTruthScore: 3,
  };

  // Stub file operations
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(JSON.stringify(sampleWithGroundTruth)),
  );

  const statStub = stub(
    Deno,
    "stat",
    () => Promise.resolve({ isFile: true } as Deno.FileInfo),
  );

  // Stub fetch
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
                  score: 3,
                  notes: "Correct answer",
                }),
              },
            }],
          }),
          { status: 200 },
        ),
      ),
  );

  try {
    const results = await runEval({
      inputFile: "./test-ground-truth.jsonl",
      deckFile: new URL("./test-deck.ts", import.meta.url).pathname,
      model: "openai/gpt-4o",
    });

    assertEquals(results.length, 1);
    assertEquals(results[0].score, 3);
    
    // Verify groundTruthScore is preserved in sampleMetadata
    assertEquals(results[0].sampleMetadata?.groundTruthScore, 3);
  } finally {
    readTextFileStub.restore();
    statStub.restore();
    fetchStub.restore();
  }
});

Deno.test("eval - should accept samples with score field as alias for groundTruthScore", async () => {
  const sampleWithScore = {
    id: "test-score",
    userMessage: "What is the capital of France?",
    assistantResponse: "The capital of France is Paris",
    score: 2,
  };

  // Stub file operations
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(JSON.stringify(sampleWithScore)),
  );

  const statStub = stub(
    Deno,
    "stat",
    () => Promise.resolve({ isFile: true } as Deno.FileInfo),
  );

  // Stub fetch
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
                  notes: "Good response",
                }),
              },
            }],
          }),
          { status: 200 },
        ),
      ),
  );

  try {
    const results = await runEval({
      inputFile: "./test-score.jsonl",
      deckFile: new URL("./test-deck.ts", import.meta.url).pathname,
      model: "openai/gpt-4o",
    });

    assertEquals(results.length, 1);
    assertEquals(results[0].score, 2);
    
    // TODO: Once implemented, verify score is converted to groundTruthScore internally
    // assertEquals(results[0].sampleMetadata?.score, 2);
  } finally {
    readTextFileStub.restore();
    statStub.restore();
    fetchStub.restore();
  }
});

Deno.test("eval - should handle both score and groundTruthScore in same batch", async () => {
  const mixedSamples = [
    {
      id: "sample-1",
      userMessage: "Hello",
      assistantResponse: "Hi there!",
      groundTruthScore: 2,
    },
    {
      id: "sample-2",
      userMessage: "Goodbye",
      assistantResponse: "See you later!",
      score: 1,
    },
    {
      id: "sample-3",
      userMessage: "Thanks",
      assistantResponse: "You're welcome!",
      // No ground truth score
    },
  ];

  const jsonlContent = mixedSamples.map(s => JSON.stringify(s)).join("\n");

  // Stub file operations
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(jsonlContent),
  );

  const statStub = stub(
    Deno,
    "stat",
    () => Promise.resolve({ isFile: true } as Deno.FileInfo),
  );

  // Stub fetch to return different scores
  let callCount = 0;
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => {
      const scores = [2, 1, 0];
      const response = new Response(
        JSON.stringify({
          choices: [{
            message: {
              content: JSON.stringify({
                score: scores[callCount],
                notes: `Evaluation ${callCount + 1}`,
              }),
            },
          }],
        }),
        { status: 200 },
      );
      callCount++;
      return Promise.resolve(response);
    },
  );

  try {
    const results = await runEval({
      inputFile: "./test-mixed.jsonl",
      deckFile: new URL("./test-deck.ts", import.meta.url).pathname,
      model: "openai/gpt-4o",
    });

    assertEquals(results.length, 3);
    
    // First sample has groundTruthScore
    assertEquals(results[0].sampleMetadata?.groundTruthScore, 2);
    
    // Second sample has score (will be converted to groundTruthScore when implemented)
    // TODO: Update assertion when implementation is complete
    assertEquals(results[1].sampleMetadata?.score, 1);
    
    // Third sample has neither
    assertEquals(results[2].sampleMetadata?.groundTruthScore, undefined);
    assertEquals(results[2].sampleMetadata?.score, undefined);
  } finally {
    readTextFileStub.restore();
    statStub.restore();
    fetchStub.restore();
  }
});

Deno.test("eval - score field should take precedence over groundTruthScore if both present", async () => {
  const sampleWithBoth = {
    id: "test-both",
    userMessage: "Test",
    assistantResponse: "Response",
    score: 2,
    groundTruthScore: 3, // This should be ignored
  };

  // Stub file operations
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(JSON.stringify(sampleWithBoth)),
  );

  const statStub = stub(
    Deno,
    "stat",
    () => Promise.resolve({ isFile: true } as Deno.FileInfo),
  );

  // Stub fetch
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
                  score: 1,
                  notes: "Test",
                }),
              },
            }],
          }),
          { status: 200 },
        ),
      ),
  );

  try {
    const results = await runEval({
      inputFile: "./test-both.jsonl",
      deckFile: new URL("./test-deck.ts", import.meta.url).pathname,
      model: "openai/gpt-4o",
    });

    assertEquals(results.length, 1);
    
    // TODO: When implemented, verify that score (2) takes precedence over groundTruthScore (3)
    // For now, both fields should be preserved in metadata
    assertEquals(results[0].sampleMetadata?.score, 2);
    assertEquals(results[0].sampleMetadata?.groundTruthScore, 3);
  } finally {
    readTextFileStub.restore();
    statStub.restore();
    fetchStub.restore();
  }
});

Deno.test("eval - should preserve arbitrary fields in sampleMetadata", async () => {
  const sampleWithMetadata = {
    id: "test-metadata",
    userMessage: "Question",
    assistantResponse: "Answer",
    score: 1,
    category: "math",
    difficulty: "easy",
    tags: ["arithmetic", "basic"],
    customField: { nested: "value" },
  };

  // Stub file operations
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(JSON.stringify(sampleWithMetadata)),
  );

  const statStub = stub(
    Deno,
    "stat",
    () => Promise.resolve({ isFile: true } as Deno.FileInfo),
  );

  // Stub fetch
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
                  score: 1,
                  notes: "Test",
                }),
              },
            }],
          }),
          { status: 200 },
        ),
      ),
  );

  try {
    const results = await runEval({
      inputFile: "./test-metadata.jsonl",
      deckFile: new URL("./test-deck.ts", import.meta.url).pathname,
      model: "openai/gpt-4o",
    });

    assertEquals(results.length, 1);
    
    // All non-standard fields should be in sampleMetadata
    assertEquals(results[0].sampleMetadata?.score, 1);
    assertEquals(results[0].sampleMetadata?.category, "math");
    assertEquals(results[0].sampleMetadata?.difficulty, "easy");
    assertEquals(results[0].sampleMetadata?.tags, ["arithmetic", "basic"]);
    assertEquals(results[0].sampleMetadata?.customField, { nested: "value" });
  } finally {
    readTextFileStub.restore();
    statStub.restore();
    fetchStub.restore();
  }
});
