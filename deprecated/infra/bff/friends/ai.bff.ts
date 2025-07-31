#! /usr/bin/env -S bff

import { friendMap, register } from "@bfmono/infra/bff/bff.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function aiCommand(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    // Show AI-safe commands
    logger.info("AI-safe BFF commands:");
    logger.info("");

    const commands = Array.from(friendMap.entries())
      .filter(([_, friend]) => friend.aiSafe)
      .sort((a, b) => a[0].localeCompare(b[0]));

    if (commands.length === 0) {
      logger.info("No AI-safe commands available.");
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
    logger.info("Use 'bff ai' to see available AI-safe commands");
    return 1;
  }

  if (!friend.aiSafe) {
    logger.error(`Command '${commandName}' is not marked as AI-safe`);
    logger.info("Use 'bff ai' to see available AI-safe commands");
    return 1;
  }

  logger.info(`Running AI-safe command: ${commandName}`);
  return await friend.command(commandArgs);
}

register(
  "ai",
  "Run only AI-safe BFF commands or list available AI-safe commands",
  aiCommand,
  [
    {
      option: "[command]",
      description:
        "AI-safe command to run. If not provided, lists all AI-safe commands.",
    },
    {
      option: "[...args]",
      description: "Arguments to pass to the AI-safe command.",
    },
  ],
  true, // This command itself is AI-safe
);
