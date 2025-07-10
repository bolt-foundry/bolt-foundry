#! /usr/bin/env -S bft test

import {
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
} from "@std/assert";
import { dirname, fromFileUrl } from "@std/path";

const __dirname = dirname(fromFileUrl(import.meta.url));
const bftDir = dirname(__dirname);

Deno.test("bin/bft: executes commands with arguments", async () => {
  const proc = new Deno.Command("deno", {
    args: ["run", "--allow-all", "./bin/bft.ts", "echo", "hello", "world"],
    cwd: bftDir,
    env: { ...Deno.env.toObject(), LD_AUDIT: "" },
  });
  const { code, stdout } = await proc.output();
  assertEquals(code, 0);
  const output = new TextDecoder().decode(stdout);
  assertStringIncludes(output, "hello world");
});

Deno.test("bin/bft: returns error for unknown command", async () => {
  const proc = new Deno.Command("deno", {
    args: ["run", "--allow-all", "./bin/bft.ts", "unknownCommand"],
    cwd: bftDir,
    env: { ...Deno.env.toObject(), LD_AUDIT: "" },
  });
  const { code, stderr } = await proc.output();
  assertNotEquals(code, 0);
  const error = new TextDecoder().decode(stderr);
  assertStringIncludes(error.toLowerCase(), "unknown");
});

Deno.test("bin/bft: shows help when no arguments provided", async () => {
  const proc = new Deno.Command("deno", {
    args: ["run", "--allow-all", "./bin/bft.ts"],
    cwd: bftDir,
    env: { ...Deno.env.toObject(), LD_AUDIT: "" },
  });
  const { code, stdout } = await proc.output();
  assertEquals(code, 0);
  const output = new TextDecoder().decode(stdout);
  // Should show help text
  assertStringIncludes(output.toLowerCase(), "usage");
});

Deno.test("bin/bft: handles command failures gracefully", async () => {
  // Assuming there's a command that can fail, like 'test' with a failing test
  const proc = new Deno.Command("deno", {
    args: ["run", "--allow-all", "./bin/bft.ts", "test", "nonexistent.test.ts"],
    cwd: bftDir,
    env: { ...Deno.env.toObject(), LD_AUDIT: "" },
  });
  const { code } = await proc.output();
  // Should return non-zero exit code but not crash
  assertNotEquals(code, 0);
});
