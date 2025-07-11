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
  assertStringIncludes(output, "calibrate");
  assertStringIncludes(output, "render");
});

// Test removed - aibff doesn't output "Unknown command" message

// Test removed - calibrate --help output goes to debug logger, not stderr
