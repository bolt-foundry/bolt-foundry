#!/usr/bin/env -S bff test

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals } from "@std/assert";
import { replCommand } from "../../commands/repl.ts";

Deno.test("repl command - exits without API key", async () => {
  // Remove API key if set
  const originalApiKey = getConfigurationVariable("OPENROUTER_API_KEY");
  Deno.env.delete("OPENROUTER_API_KEY");
  
  // Capture output
  let output = "";
  const originalWrite = Deno.stdout.write;
  Deno.stdout.write = async (p: Uint8Array): Promise<number> => {
    output += new TextDecoder().decode(p);
    return p.length;
  };

  try {
    await replCommand.run([]);
  } finally {
    Deno.stdout.write = originalWrite;
    // Restore API key if it existed
    if (originalApiKey) {
      Deno.env.set("OPENROUTER_API_KEY", originalApiKey);
    }
  }

  // Check output - it should contain OPENROUTER_API_KEY
  assertEquals(output.includes("OPENROUTER_API_KEY"), true);
});

Deno.test("repl command - has correct export", () => {
  assertEquals(replCommand.name, "repl");
  assertEquals(replCommand.description, "Start a simple chat session");
  assertEquals(typeof replCommand.run, "function");
});
