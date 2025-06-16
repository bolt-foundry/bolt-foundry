import type { Command } from "./types.ts";
import { evalCommand } from "./eval.ts";
import { rebuildCommand } from "./rebuild.ts";

export type CommandRegistry = Map<string, Command>;

const registry: CommandRegistry = new Map();

// Register the eval command
registry.set("eval", evalCommand);

// Register the rebuild command
registry.set("rebuild", rebuildCommand);

export function getCommand(name: string): Command | undefined {
  return registry.get(name);
}

export function getAllCommands(): Array<Command> {
  return Array.from(registry.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
