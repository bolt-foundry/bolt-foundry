#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import type { Command } from "../../commands/types.ts";

Deno.test("Command interface should have required properties", () => {
  const mockCommand: Command = {
    name: "test",
    description: "Test command",
    run: async () => {},
  };

  assertEquals(mockCommand.name, "test");
  assertEquals(mockCommand.description, "Test command");
  assertEquals(typeof mockCommand.run, "function");
});

Deno.test("Command run function should accept args array", async () => {
  let receivedArgs: Array<string> = [];

  const mockCommand: Command = {
    name: "test",
    description: "Test command",
    run: (args: Array<string>) => {
      receivedArgs = args;
      return Promise.resolve();
    },
  };

  await mockCommand.run(["arg1", "arg2"]);
  assertEquals(receivedArgs, ["arg1", "arg2"]);
});
