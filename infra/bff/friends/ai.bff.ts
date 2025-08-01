#! /usr/bin/env -S bff

import { friendMap, register } from "@bfmono/infra/bff/bff.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function aiCommand(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    // Show available commands
    logger.info("Available BFF commands:");
    logger.info("");

    const commands = Array.from(friendMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));

    if (commands.length === 0) {
      logger.info("No commands available.");
      return 0;
    }

    // Compute the maximum length of command names
    const longestNameLength = commands.reduce(
      (max, [name]) => Math.max(max, name.length),
      0,
    );

    for (const [name, { description }] of commands) {
      logger.info(`  ${name.padEnd(longestNameLength + 2)} ${description}`);
    }

    logger.info("");
    logger.info("Usage: bff ai <command> [options]");
    return 0;
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  const friend = friendMap.get(commandName);

  if (!friend) {
    logger.error(`Unknown command: ${commandName}`);
    logger.info("Use 'bff ai' to see available commands");
    return 1;
  }

  // TODO: Implement new safety mechanism if needed
  // For now, all commands are considered safe

  logger.info(`Running command: ${commandName}`);
  return await friend.command(commandArgs);
}

register(
  "ai",
  "Run BFF commands or list available commands",
  aiCommand,
  [
    {
      option: "[command]",
      description: "Command to run. If not provided, lists all commands.",
    },
    {
      option: "[...args]",
      description: "Arguments to pass to the command.",
    },
  ],
);
