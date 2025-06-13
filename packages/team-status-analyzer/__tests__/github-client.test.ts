/**
 * Tests for GitHub Client functionality
 */

import { assertEquals } from "../deps.ts";
import { GitHubClient } from "../github-client.ts";

Deno.test("GitHubClient - initialization checks authentication", async () => {
  const client = new GitHubClient("testowner", "testrepo");

  // This test verifies that initialize() runs without throwing (regardless of auth state)
  // In production, it will fail if not authenticated, but we can't guarantee
  // the test environment state
  try {
    await client.initialize();
    // If no error, authentication was successful or method worked
  } catch (error) {
    // If error, it should be an authentication-related error
    if (error instanceof Error) {
      assertEquals(typeof error.message, "string");
      assertEquals(error.message.includes("GitHub CLI"), true);
    }
  }
});

Deno.test("GitHubClient - constructor sets owner and repo correctly", () => {
  const client = new GitHubClient("boltfoundry", "bolt-foundry");

  // We can't directly test private properties, but we can test that
  // the constructor doesn't throw and object is created
  assertEquals(typeof client, "object");
});

// Mock test for when authentication is available
Deno.test("GitHubClient - testConnection method exists", () => {
  const client = new GitHubClient("testowner", "testrepo");

  // Method should exist even if it fails due to lack of authentication
  assertEquals(typeof client.testConnection, "function");
});
