#! /usr/bin/env -S bff

// ./infra/bff/friends/__tests__/toEval.test.ts
import { assertEquals, assertStringIncludes } from "@std/assert";
import { join } from "@std/path";
import { emptyDir } from "@std/fs";
import { toEvalCommand } from "infra/bff/friends/toEval.bff.ts";

Deno.test("toEval - basic single file conversion", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    // Create test input file
    const inputFile = join(testDir, "test.md");
    const inputContent = "# Test Document\n\nThis is a test document.";
    await Deno.writeTextFile(inputFile, inputContent);

    // Create output file path
    const outputFile = join(testDir, "output.jsonl");

    // Run the command
    const result = await toEvalCommand([
      inputFile,
      outputFile,
      "Please analyze:",
    ]);
    assertEquals(result, 0);

    // Read and verify output
    const output = await Deno.readTextFile(outputFile);
    const lines = output.trim().split("\n");
    assertEquals(lines.length, 1);

    const sample = JSON.parse(lines[0]);
    assertEquals(sample.score, null);
    assertEquals(sample.id, "test-md");
    assertEquals(sample.description, null);
    assertEquals(sample.assistantResponse, inputContent);
    assertEquals(sample.userMessage, `Please analyze:\n\n${inputContent}`);

    // Verify key ordering
    const keys = Object.keys(sample);
    assertEquals(keys, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - directory with multiple files", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    // Create test input files
    const doc1 = join(testDir, "doc1.txt");
    const doc2 = join(testDir, "doc2.md");
    const doc3 = join(testDir, "doc3.json"); // Should be ignored

    await Deno.writeTextFile(doc1, "First document");
    await Deno.writeTextFile(doc2, "Second document");
    await Deno.writeTextFile(doc3, '{"ignored": true}');

    // Create output file path
    const outputFile = join(testDir, "output.jsonl");

    // Run the command
    const result = await toEvalCommand([testDir, outputFile, "Extract info:"]);
    assertEquals(result, 0);

    // Read and verify output
    const output = await Deno.readTextFile(outputFile);
    const lines = output.trim().split("\n");
    assertEquals(lines.length, 2); // Only .txt and .md files

    const samples = lines.map((line) => JSON.parse(line));

    // Check first sample
    const sample1 = samples.find((s) => s.id === "doc1-txt");
    assertEquals(sample1.score, null);
    assertEquals(sample1.description, null);
    assertEquals(sample1.assistantResponse, "First document");
    assertEquals(sample1.userMessage, "Extract info:\n\nFirst document");

    // Check second sample
    const sample2 = samples.find((s) => s.id === "doc2-md");
    assertEquals(sample2.score, null);
    assertEquals(sample2.description, null);
    assertEquals(sample2.assistantResponse, "Second document");
    assertEquals(sample2.userMessage, "Extract info:\n\nSecond document");

    // Verify key ordering for both samples
    const keys1 = Object.keys(sample1);
    assertEquals(keys1, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
    const keys2 = Object.keys(sample2);
    assertEquals(keys2, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - appends to existing file", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    // Create existing output file with one entry
    const outputFile = join(testDir, "output.jsonl");
    const existingEntry = {
      score: 1,
      id: "existing",
      description: "Existing entry",
      userMessage: "Existing question",
      assistantResponse: "Existing response",
    };
    await Deno.writeTextFile(outputFile, JSON.stringify(existingEntry) + "\n");

    // Create test input file
    const inputFile = join(testDir, "new.md");
    await Deno.writeTextFile(inputFile, "New content");

    // Run the command
    const result = await toEvalCommand([inputFile, outputFile, "Process:"]);
    assertEquals(result, 0);

    // Read and verify output
    const output = await Deno.readTextFile(outputFile);
    const lines = output.trim().split("\n");
    assertEquals(lines.length, 2); // Original + new

    // Verify original is preserved
    const firstSample = JSON.parse(lines[0]);
    assertEquals(firstSample.id, "existing");

    // Verify new entry
    const secondSample = JSON.parse(lines[1]);
    assertEquals(secondSample.id, "new-md");
    assertEquals(secondSample.description, null);
    assertEquals(secondSample.assistantResponse, "New content");
    assertEquals(secondSample.userMessage, "Process:\n\nNew content");

    // Verify key ordering
    const keys = Object.keys(secondSample);
    assertEquals(keys, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - handles subdirectories", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    // Create nested structure
    const subDir = join(testDir, "subdir");
    await Deno.mkdir(subDir);

    const file1 = join(testDir, "root.md");
    const file2 = join(subDir, "nested.txt");

    await Deno.writeTextFile(file1, "Root content");
    await Deno.writeTextFile(file2, "Nested content");

    const outputFile = join(testDir, "output.jsonl");

    // Run the command
    const result = await toEvalCommand([testDir, outputFile, "Analyze:"]);
    assertEquals(result, 0);

    // Read and verify output
    const output = await Deno.readTextFile(outputFile);
    const lines = output.trim().split("\n");
    assertEquals(lines.length, 2);

    const samples = lines.map((line) => JSON.parse(line));

    // Check IDs reflect the structure
    const rootSample = samples.find((s) => s.id === "root-md");
    const nestedSample = samples.find((s) => s.id === "subdir-nested-txt");

    assertEquals(rootSample.description, null);
    assertEquals(nestedSample.description, null);

    // Verify key ordering
    const keysRoot = Object.keys(rootSample);
    assertEquals(keysRoot, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
    const keysNested = Object.keys(nestedSample);
    assertEquals(keysNested, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - error handling for missing arguments", async () => {
  const result = await toEvalCommand([]);
  assertEquals(result, 1);
});

Deno.test("toEval - error handling for non-existent input", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    const outputFile = join(testDir, "output.jsonl");
    const result = await toEvalCommand([
      "/non/existent/path",
      outputFile,
      "Test:",
    ]);
    assertEquals(result, 1);
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - error handling for wrong file type", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    // Create a non-txt/md file
    const inputFile = join(testDir, "test.json");
    await Deno.writeTextFile(inputFile, '{"test": true}');

    const outputFile = join(testDir, "output.jsonl");

    // Run the command - should fail
    const result = await toEvalCommand([inputFile, outputFile, "Test:"]);
    assertEquals(result, 1);
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - handles empty directory", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    const outputFile = join(testDir, "output.jsonl");

    // Run on empty directory
    const result = await toEvalCommand([testDir, outputFile, "Test:"]);
    assertEquals(result, 1); // Should fail with no files
  } finally {
    await emptyDir(testDir);
  }
});

Deno.test("toEval - preserves special characters in content", async () => {
  const testDir = await Deno.makeTempDir({ prefix: "toEval_test_" });

  try {
    // Create file with special characters
    const inputFile = join(testDir, "special.md");
    const specialContent =
      'Test with "quotes" and\nnewlines\nand {"json": true}';
    await Deno.writeTextFile(inputFile, specialContent);

    const outputFile = join(testDir, "output.jsonl");

    // Run the command
    const result = await toEvalCommand([inputFile, outputFile, "Process:"]);
    assertEquals(result, 0);

    // Read and verify output
    const output = await Deno.readTextFile(outputFile);
    const sample = JSON.parse(output.trim());

    assertEquals(sample.description, null);
    assertEquals(sample.assistantResponse, specialContent);
    assertEquals(sample.userMessage, `Process:\n\n${specialContent}`);

    // Verify key ordering
    const keys = Object.keys(sample);
    assertEquals(keys, [
      "score",
      "id",
      "description",
      "assistantResponse",
      "userMessage",
    ]);
  } finally {
    await emptyDir(testDir);
  }
});
