import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export async function ci() {
  try {
    const commands = [
      // ["deno", "lint"],
      // ["deno", "fmt", "--check"],
      ["deno", "test", "--cached-only", "-A"],
    ];

    for (const command of commands) {
      const code = await runShellCommand(command);
      if (code !== 0) {
        logger.error(`CI failed on command: ${command.join(" ")}`);
        return code;
      }
    }

    return 0;
  } catch (error) {
    logger.error("CI failed with error:", error);
    return 1;
  }
}

register(
  "ci",
  "runs all of our CI tests and fails if they fail.",
  ci,
);

register(
  "cifix",
  "runs all of our CI tests and fixes them if they fail.",
  async () => {
    await runShellCommand(["fmt"]);
    return runShellCommand(["task", "ci"]);
  },
);
