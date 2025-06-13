/**
 * Tests for PR Parser functionality
 */

import { assertEquals, assertExists } from "../deps.ts";
import { PRParser } from "../pr-parser.ts";
import type { GitHubPR } from "../types.ts";

const mockPR: GitHubPR = {
  number: 123,
  title: "Add new public API feature for user authentication",
  body:
    "This PR implements OAuth2 authentication flow for external users with breaking changes",
  user: { login: "testuser" },
  created_at: "2025-06-12T10:00:00Z",
  updated_at: "2025-06-12T12:00:00Z",
  merged_at: "2025-06-12T12:00:00Z",
  state: "closed",
  draft: false,
  labels: [{ name: "feature", color: "green" }],
  head: { sha: "abc123" },
  base: { ref: "main" },
};

Deno.test("PRParser - parseWorkItem categorizes PRs correctly", () => {
  const parser = new PRParser();
  const workItem = parser.parseWorkItem(mockPR);

  assertEquals(workItem.prNumber, 123);
  assertEquals(
    workItem.title,
    "Add new public API feature for user authentication",
  );
  assertEquals(workItem.category, "feature");
  assertEquals(workItem.author, "testuser");
  assertExists(workItem.createdAt);
  assertExists(workItem.mergedAt);
});

Deno.test("PRParser - detects high impact for external-facing features", () => {
  const parser = new PRParser();
  const workItem = parser.parseWorkItem(mockPR);

  assertEquals(workItem.impact, "high");
  assertExists(workItem.externalRelevance);
});

Deno.test("PRParser - categorizes bug fix correctly", () => {
  const parser = new PRParser();
  const bugFixPR = {
    ...mockPR,
    title: "Fix critical memory leak in authentication service",
    body: "Resolves issue with memory not being freed after logout",
  };

  const workItem = parser.parseWorkItem(bugFixPR);
  assertEquals(workItem.category, "bugfix");
});

Deno.test("PRParser - detects major updates", () => {
  const parser = new PRParser();
  const majorUpdatePR = {
    ...mockPR,
    title: "Breaking change: Rewrite core API endpoints",
    body: "This is a breaking change that requires migration",
  };

  const workItem = parser.parseWorkItem(majorUpdatePR);

  // Check that major update flags are detected
  assertExists(workItem.majorUpdateFlags);
  assertEquals(workItem.majorUpdateFlags.includes("breaking-change"), true);
});
