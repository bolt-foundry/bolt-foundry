#!/usr/bin/env deno

import { getAllCommands, getCommand } from "./commands/index.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BUILD_COMMIT, BUILD_TIME, VERSION } from "./version.ts";

const logger = getLogger(import.meta);

function showHelp(): void {
  logger.println("Usage: aibff <command> [args...]");
  logger.println("\nAvailable commands:");

  const commands = getAllCommands();
  for (const command of commands) {
    logger.println(`  ${command.name.padEnd(12)} ${command.description}`);
  }

  logger.println("\nOptions:");
  logger.println("  --version    Show version information");
  logger.println("  --help       Show this help message");
}

function showVersion(): void {
  logger.println(`aibff ${VERSION}`);
  if (BUILD_TIME !== "development") {
    logger.println(`Built: ${BUILD_TIME}`);
    logger.println(`Commit: ${BUILD_COMMIT}`);
  }
}

async function main(): Promise<void> {
  const args = Deno.args;

  // Handle version flag (check all args, not just first)
  if (args.includes("--version") || args.includes("-v")) {
    showVersion();
    Deno.exit(0);
  }

  // Handle help flag with no command
  if (
    args.length === 0 ||
    (args.length === 1 && (args[0] === "--help" || args[0] === "-h"))
  ) {
    showHelp();
    Deno.exit(0);
  }

  const commandName = args[0];
  const command = getCommand(commandName);

  if (!command) {
    logger.printErr(`Unknown command '${commandName}'`);
    logger.printErr("Run 'aibff --help' for usage information");
    Deno.exit(1);
  }

  // Pass remaining arguments to the command (including --help if present)
  const commandArgs = args.slice(1);
  await command.run(commandArgs);
}

if (import.meta.main) {
  main();
}
