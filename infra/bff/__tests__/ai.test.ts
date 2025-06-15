// infra/bff/__tests__/ai.test.ts

import { assertEquals } from "@std/assert";
import { friendMap, register } from "../bff.ts";
import { aiCommand } from "../friends/ai.bff.ts";

Deno.test("ai command: should list AI-safe commands", async () => {
  // Save current state of friendMap
  const originalFriends = new Map(friendMap);

  try {
    // Register a test AI-safe command
    register("test-safe", "Test safe command", () => 0, [], true);
    // Register a test non-AI-safe command
    register("test-unsafe", "Test unsafe command", () => 0, [], false);

    // Test listing AI-safe commands
    const result = await aiCommand([]);
    assertEquals(result, 0);
  } finally {
    // Restore original state
    friendMap.clear();
    for (const [key, value] of originalFriends) {
      friendMap.set(key, value);
    }
  }
});

Deno.test("ai command: should run AI-safe commands", async () => {
  // Save current state of friendMap
  const originalFriends = new Map(friendMap);

  try {
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
  } finally {
    // Restore original state
    friendMap.clear();
    for (const [key, value] of originalFriends) {
      friendMap.set(key, value);
    }
    // Wait a bit to ensure any async operations complete
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 100);
      Deno.unrefTimer(timer);
    });
  }
});

Deno.test("ai command: should reject non-AI-safe commands", async () => {
  // Save current state of friendMap
  const originalFriends = new Map(friendMap);

  try {
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
  } finally {
    // Restore original state
    friendMap.clear();
    for (const [key, value] of originalFriends) {
      friendMap.set(key, value);
    }
  }
});

Deno.test("ai command: should handle unknown commands", async () => {
  // Test trying to run a command that doesn't exist
  const result = await aiCommand(["nonexistent-command"]);
  assertEquals(result, 1); // Should fail
});
