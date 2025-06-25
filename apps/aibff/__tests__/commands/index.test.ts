#!/usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import {
  getAllCommands,
  getCommand,
} from "@bfmono/apps/aibff/commands/index.ts";

Deno.test("getCommand should return calibrate command", () => {
  const calibrateCommand = getCommand("calibrate");
  assertExists(calibrateCommand);
  assertEquals(calibrateCommand.name, "calibrate");
  assertEquals(
    calibrateCommand.description,
    "Calibrate AI models against test samples",
  );
});

Deno.test("getCommand should return undefined for unknown command", () => {
  const unknownCommand = getCommand("unknown");
  assertEquals(unknownCommand, undefined);
});

Deno.test("getAllCommands should return all registered commands", () => {
  const commands = getAllCommands();
  assertEquals(commands.length >= 4, true);
  assertEquals(commands.some((command) => command.name === "calibrate"), true);
  assertEquals(commands.some((command) => command.name === "render"), true);
  assertEquals(commands.some((command) => command.name === "repl"), true);
  assertEquals(commands.some((command) => command.name === "rebuild"), true);
});

Deno.test("getAllCommands should return sorted list by name", () => {
  const commands = getAllCommands();
  const sortedNames = commands.map((c) => c.name).sort();
  const actualNames = commands.map((c) => c.name);
  assertEquals(actualNames, sortedNames);
});
