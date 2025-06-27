#! /usr/bin/env -S bft test

import { assertEquals, assertNotEquals, assertStringIncludes } from "@std/assert";

Deno.test("bin/bft: can load friends from bff directory", async () => {
  // Test that bft can discover and load .bff.ts files
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["--help"],
    cwd: "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/infra/bft",
  });
  const { code, stdout } = await proc.output();
  assertEquals(code, 0);
  const output = new TextDecoder().decode(stdout);
  // Should show commands from /infra/bff/friends/
  assertStringIncludes(output, "build");
  assertStringIncludes(output, "test");
});

Deno.test("bin/bft: executes commands with arguments", async () => {
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["echo", "hello", "world"],
    cwd: "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/infra/bft",
  });
  const { code, stdout } = await proc.output();
  assertEquals(code, 0);
  const output = new TextDecoder().decode(stdout);
  assertStringIncludes(output, "hello world");
});

Deno.test("bin/bft: returns error for unknown command", async () => {
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["unknownCommand"],
    cwd: "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/infra/bft",
  });
  const { code, stderr } = await proc.output();
  assertNotEquals(code, 0);
  const error = new TextDecoder().decode(stderr);
  assertStringIncludes(error.toLowerCase(), "unknown");
});

Deno.test("bin/bft: shows help when no arguments provided", async () => {
  const proc = new Deno.Command("./bin/bft.ts", {
    cwd: "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/infra/bft",
  });
  const { code, stdout } = await proc.output();
  assertEquals(code, 0);
  const output = new TextDecoder().decode(stdout);
  // Should show help text
  assertStringIncludes(output.toLowerCase(), "usage");
});

Deno.test("bin/bft: handles command failures gracefully", async () => {
  // Assuming there's a command that can fail, like 'test' with a failing test
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["test", "nonexistent.test.ts"],
    cwd: "/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/infra/bft",
  });
  const { code } = await proc.output();
  // Should return non-zero exit code but not crash
  assertNotEquals(code, 0);
});
