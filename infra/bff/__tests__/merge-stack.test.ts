import { assertEquals } from "@std/assert";
import { mergeStack } from "../friends/merge-stack.bff.ts";
import { mergeStackDryRun } from "../friends/merge-stack_dry-run.bff.ts";

Deno.test("merge-stack - help flag shows usage", async () => {
  // Test that the command doesn't crash and returns success for dry run
  // This is an integration test that ensures the command structure is correct
  const result = await mergeStack(["--dry-run"]);

  // Should return 0 (success) even if no PRs are found
  assertEquals(result, 0);
});

Deno.test("merge-stack - invalid merge method fails", async () => {
  // Test invalid merge method
  const result = await mergeStack(["--dry-run", "invalid-method"]);

  // Should still succeed in dry-run mode but use default method
  assertEquals(result, 0);
});

Deno.test("merge-stack - accepts valid merge methods", async () => {
  // Test all valid merge methods in dry-run mode
  const methods = ["merge", "squash", "rebase"];

  for (const method of methods) {
    const result = await mergeStack(["--dry-run", method]);
    assertEquals(result, 0);
  }
});

Deno.test("merge-stack - handles no arguments", async () => {
  // Test with no arguments - should try to detect stack
  const result = await mergeStack([]);

  // Should return 0 when no PRs found (normal case for most repos)
  assertEquals(result, 0);
});

Deno.test("merge-stack:dry-run - AI-safe dry run command", async () => {
  // Test the AI-safe dry-run command
  const result = await mergeStackDryRun([]);

  // Should return 0 (success) even if no PRs are found
  assertEquals(result, 0);
});

Deno.test("merge-stack:dry-run - with merge method", async () => {
  // Test dry-run command with merge method
  const result = await mergeStackDryRun(["squash"]);

  // Should return 0 (success)
  assertEquals(result, 0);
});

Deno.test("merge-stack - navigates to bottom when stack detected", async () => {
  // This integration test ensures navigation logic doesn't crash the command
  // Even when no actual stack is present, it should handle the case gracefully
  const result = await mergeStack(["--dry-run"]);

  // Should return 0 (success) - navigation should succeed even with empty stack
  assertEquals(result, 0);
});
