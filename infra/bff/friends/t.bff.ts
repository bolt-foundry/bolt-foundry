import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function tCommand(options: string[]): Promise<number> {
  logger.info("Running tests via 't' command with --no-check flag...");

  // Add --no-check flag by default if it's not already included
  if (!options.includes("--no-check")) {
    options = ["--no-check", ...options];
  }

  // Pass all arguments to the test command
  const result = await runShellCommand(["bff", "test", ...options]);

  return result;
}

register(
  "t",
  "Shortcut for 'bff test'",
  tCommand,
);
