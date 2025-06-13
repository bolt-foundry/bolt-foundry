#!/usr/bin/env deno

import { getAllCommands, getCommand } from "./commands/index.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

function showHelp(): void {
  logger.info("Usage: aibff <command> [args...]");
  logger.info("\nAvailable commands:");

  const commands = getAllCommands();
  for (const command of commands) {
    logger.info(`  ${command.name.padEnd(12)} ${command.description}`);
  }
}

async function main(): Promise<void> {
  const args = Deno.args;

  if (args.length === 0) {
    showHelp();
    Deno.exit(0);
  }

  const commandName = args[0];
  const command = getCommand(commandName);

  if (!command) {
    logger.error(`Unknown command '${commandName}'`);
    Deno.exit(1);
  }

  // Pass remaining arguments to the command
  const commandArgs = args.slice(1);
  await command.run(commandArgs);
}

if (import.meta.main) {
  main();
}
