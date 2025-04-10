#!/usr/bin/env -S deno test -A

import { assertEquals } from "@std/assert";
import { stripApiKeys } from "../utils/sanitize.ts";

// Test that verifies OpenAI keys are not accidentally captured or logged
Deno.test("OpenAI API keys are not captured in logs", () => {
  // Sample API key format for testing
  const sampleKey = "sk-1234567890abcdefghijklmnopqrstuvwxyz";

  // Mock logging or data capture function that should strip API keys
  const capturedData = stripApiKeys({
    headers: {
      "Authorization": `Bearer ${sampleKey}`,
      "Content-Type": "application/json",
    },
    body: {
      query: "What is the capital of France?",
      apiKey: sampleKey,
    },
  });

  // Verify the key is not present in captured data
  assertEquals(capturedData.headers["Authorization"], "Bearer [REDACTED]");
  assertEquals(capturedData.body.apiKey, "[REDACTED]");
});
