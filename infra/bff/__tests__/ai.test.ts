import { assertEquals } from "@std/assert";
import { register } from "../bff.ts";
import { aiCommand } from "../friends/ai.bff.ts";

Deno.test("ai command: should list available commands", async () => {
  // Register test commands
  register("test-safe", "Test safe command", () => 0, []);
  register("test-unsafe", "Test unsafe command", () => 0, []);

  // Test listing commands
  const result = await aiCommand([]);
  assertEquals(result, 0);
});

Deno.test({
  name: "ai command: should run commands",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    // Register a test command
    let wasCalled = false;
    register(
      "test-ai-safe",
      "Test command",
      () => {
        wasCalled = true;
        return 0;
      },
      [],
    );

    // Test running a command
    const result = await aiCommand(["test-ai-safe"]);
    assertEquals(result, 0);
    assertEquals(wasCalled, true);
  },
});

Deno.test("ai command: should run all commands (no safety restriction)", async () => {
  // Register a test command (previously would have been non-AI-safe)
  register(
    "test-not-safe",
    "Test command",
    () => 0,
    [],
  );

  // Test running the command - should succeed now that safety check is removed
  const result = await aiCommand(["test-not-safe"]);
  assertEquals(result, 0); // Should succeed
});

Deno.test("ai command: should handle unknown commands", async () => {
  // Test trying to run a command that doesn't exist
  const result = await aiCommand(["nonexistent-command"]);
  assertEquals(result, 1); // Should fail
});
