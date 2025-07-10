import type { Command } from "./types.ts";
import { calibrateCommand } from "./calibrate.ts";
import { guiCommand } from "./gui.ts";
import { rebuildCommand } from "./rebuild.ts";
import { replCommand } from "./repl.ts";
import { renderCommand } from "./render.ts";

export type CommandRegistry = Map<string, Command>;

const registry: CommandRegistry = new Map();

// Register the calibrate command
registry.set("calibrate", calibrateCommand);

// Register the gui command with both "gui" and "web" aliases
registry.set("gui", guiCommand);
registry.set("web", guiCommand);

// Register the rebuild command
registry.set("rebuild", rebuildCommand);

// Register the repl command
registry.set("repl", replCommand);

// Register the render command
registry.set("render", renderCommand);

export function getCommand(name: string): Command | undefined {
  return registry.get(name);
}

export function getAllCommands(): Array<Command> {
  return Array.from(registry.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
