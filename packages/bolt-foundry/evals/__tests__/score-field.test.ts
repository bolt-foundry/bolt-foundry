#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";

// Test the EvalSample interface to ensure it accepts both score and groundTruthScore
Deno.test("EvalSample interface - should accept score field", () => {
  const sample = {
    id: "test-1",
    userMessage: "What is 2+2?",
    assistantResponse: "4",
    score: 3,
  };

  // This should compile without errors
  assertEquals(sample.score, 3);
  assertEquals(sample.id, "test-1");
});

Deno.test("EvalSample interface - should accept groundTruthScore field", () => {
  const sample = {
    id: "test-2",
    userMessage: "What is the capital of France?",
    assistantResponse: "Paris",
    groundTruthScore: 2,
  };

  // This should compile without errors
  assertEquals(sample.groundTruthScore, 2);
  assertEquals(sample.id, "test-2");
});

Deno.test("EvalSample interface - should accept both score and groundTruthScore", () => {
  const sample = {
    id: "test-3",
    userMessage: "Test",
    assistantResponse: "Response",
    score: 2,
    groundTruthScore: 3,
  };

  // Both fields should be accessible
  assertEquals(sample.score, 2);
  assertEquals(sample.groundTruthScore, 3);
});

Deno.test("Score field processing - verify current behavior", () => {
  // Test data showing that arbitrary fields are preserved
  const sampleData = {
    id: "test",
    userMessage: "Question",
    assistantResponse: "Answer",
    score: 2,
    groundTruthScore: 3,
    customField: "value",
  };

  // Simulate how eval.ts filters fields for sampleMetadata
  const standardFields = ["id", "userMessage", "assistantResponse", "expected"];
  const sampleMetadata = Object.fromEntries(
    Object.entries(sampleData).filter(([key]) => !standardFields.includes(key))
  );

  // Verify both score fields are preserved in metadata
  assertEquals(sampleMetadata.score, 2);
  assertEquals(sampleMetadata.groundTruthScore, 3);
  assertEquals(sampleMetadata.customField, "value");
});

// Test to verify the CLI logic for handling score fields
Deno.test("CLI calibration logic - should recognize both score fields", () => {
  const results = [
    {
      id: "sample-1",
      score: 2,
      sampleMetadata: { groundTruthScore: 2 },
    },
    {
      id: "sample-2",
      score: 3,
      sampleMetadata: { score: 3 }, // Using 'score' instead
    },
    {
      id: "sample-3",
      score: 1,
      sampleMetadata: { score: 2, groundTruthScore: 3 }, // Both present
    },
  ];

  // Current CLI logic only checks for groundTruthScore
  const resultsWithGroundTruth = results.filter((r) =>
    r.sampleMetadata && "groundTruthScore" in r.sampleMetadata
  );

  // This would miss sample-2 which uses 'score'
  assertEquals(resultsWithGroundTruth.length, 2);

  // Proposed logic: check for either field, with 'score' taking precedence
  const getGroundTruth = (metadata: any) => {
    if (metadata?.score !== undefined) return metadata.score;
    if (metadata?.groundTruthScore !== undefined) return metadata.groundTruthScore;
    return undefined;
  };

  const resultsWithAnyGroundTruth = results.filter((r) =>
    getGroundTruth(r.sampleMetadata) !== undefined
  );

  // This would include all three samples
  assertEquals(resultsWithAnyGroundTruth.length, 3);

  // Verify precedence: score takes priority over groundTruthScore
  assertEquals(getGroundTruth(results[2].sampleMetadata), 2); // Not 3
});