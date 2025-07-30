import { assertEquals } from "@std/assert";
import { register } from "../bff.ts";
import { aiCommand } from "../friends/ai.bff.ts";

Deno.test("ai command: should list AI-safe commands", async () => {
  // Register a test AI-safe command
  register("test-safe", "Test safe command", () => 0, [], true);
  // Register a test non-AI-safe command
  register("test-unsafe", "Test unsafe command", () => 0, [], false);

  // Test listing AI-safe commands
  const result = await aiCommand([]);
  assertEquals(result, 0);
});

Deno.test({
  name: "ai command: should run AI-safe commands",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    // Register a test AI-safe command
    let wasCalled = false;
    register(
      "test-ai-safe",
      "Test AI-safe command",
      () => {
        wasCalled = true;
        return 0;
      },
      [],
      true,
    );

    // Test running an AI-safe command
    const result = await aiCommand(["test-ai-safe"]);
    assertEquals(result, 0);
    assertEquals(wasCalled, true);
  },
});

Deno.test("ai command: should reject non-AI-safe commands", async () => {
  // Register a test non-AI-safe command
  register(
    "test-not-safe",
    "Test non-AI-safe command",
    () => 0,
    [],
    false,
  );

  // Test trying to run a non-AI-safe command
  const result = await aiCommand(["test-not-safe"]);
  assertEquals(result, 1); // Should fail
});

Deno.test("ai command: should handle unknown commands", async () => {
  // Test trying to run a command that doesn't exist
  const result = await aiCommand(["nonexistent-command"]);
  assertEquals(result, 1); // Should fail
});
