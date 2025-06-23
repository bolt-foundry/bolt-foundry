import type { Command } from "./types.ts";
import { calibrateCommand } from "./calibrate.ts";
import { rebuildCommand } from "./rebuild.ts";
import { replCommand } from "./repl.ts";
import { renderCommand } from "./render.ts";
import { web } from "./web.ts";

export type CommandRegistry = Map<string, Command>;

const registry: CommandRegistry = new Map();

// Register the calibrate command
registry.set("calibrate", calibrateCommand);

// Register the rebuild command
registry.set("rebuild", rebuildCommand);

// Register the repl command
registry.set("repl", replCommand);

// Register the render command
registry.set("render", renderCommand);

// Register the web command
registry.set("web", web);

export function getCommand(name: string): Command | undefined {
  return registry.get(name);
}

export function getAllCommands(): Array<Command> {
  return Array.from(registry.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
