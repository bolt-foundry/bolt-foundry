#!/usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { getAllCommands, getCommand } from "../../commands/index.ts";

Deno.test("getCommand should return eval command", () => {
  const evalCommand = getCommand("eval");
  assertExists(evalCommand);
  assertEquals(evalCommand.name, "eval");
  assertEquals(
    evalCommand.description,
    "Evaluate grader decks against sample prompts",
  );
});

Deno.test("getCommand should return undefined for unknown command", () => {
  const unknownCommand = getCommand("unknown");
  assertEquals(unknownCommand, undefined);
});

Deno.test("getAllCommands should return all registered commands", () => {
  const commands = getAllCommands();
  assertEquals(commands.length >= 1, true);
  assertEquals(commands.some((command) => command.name === "eval"), true);
});

Deno.test("getAllCommands should return sorted list by name", () => {
  const commands = getAllCommands();
  const sortedNames = commands.map((c) => c.name).sort();
  const actualNames = commands.map((c) => c.name);
  assertEquals(actualNames, sortedNames);
});
