#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";

const mainScript = new URL("../main.ts", import.meta.url).pathname;

Deno.test("aibff should show help when no command provided", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", mainScript],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  assertStringIncludes(output, "Usage: aibff <command>");
  assertStringIncludes(output, "Available commands:");
  assertStringIncludes(output, "eval");
  assertStringIncludes(output, "Evaluate grader decks against sample prompts");
});

Deno.test("aibff should handle unknown command", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", mainScript, "unknown"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  assertEquals(code, 1);
  assertStringIncludes(error, "Unknown command 'unknown'");
});

Deno.test("aibff should delegate to eval command", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", mainScript, "eval", "--help"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  // The eval command shows help when called with --help
  assertStringIncludes(output, "Usage: aibff eval");
});
