#!/usr/bin/env deno

import { getAllCommands, getCommand } from "./commands/index.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BUILD_COMMIT, BUILD_TIME, VERSION } from "./version.ts";

const logger = getLogger(import.meta);

function showHelp(): void {
  logger.info("Usage: aibff <command> [args...]");
  logger.info("\nAvailable commands:");

  const commands = getAllCommands();
  for (const command of commands) {
    logger.info(`  ${command.name.padEnd(12)} ${command.description}`);
  }

  logger.info("\nOptions:");
  logger.info("  --version    Show version information");
  logger.info("  --help       Show this help message");
}

function showVersion(): void {
  logger.info(`aibff ${VERSION}`);
  if (BUILD_TIME !== "development") {
    logger.info(`Built: ${BUILD_TIME}`);
    logger.info(`Commit: ${BUILD_COMMIT}`);
  }
}

async function main(): Promise<void> {
  const args = Deno.args;

  // Handle version flag
  if (args.includes("--version") || args.includes("-v")) {
    showVersion();
    Deno.exit(0);
  }

  // Handle help flag or no args
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    showHelp();
    Deno.exit(0);
  }

  const commandName = args[0];
  const command = getCommand(commandName);

  if (!command) {
    logger.error(`Unknown command '${commandName}'`);
    logger.error("Run 'aibff --help' for usage information");
    Deno.exit(1);
  }

  // Pass remaining arguments to the command
  const commandArgs = args.slice(1);
  await command.run(commandArgs);
}

if (import.meta.main) {
  main();
}
