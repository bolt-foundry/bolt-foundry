// Import runShellCommand from shellBase.ts
import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

register(
  "ci",
  "runs all of our CI tests and fails if they fail.",
  async () => {
    const commands = [
      ["deno", "test", "--cached-only", "-A"],
      ["deno", "fmt"],
      ["deno", "lint"],
      ["bff", "build"],
    ];
    for (const command of commands) {
      const code = await runShellCommand(command);
      if (code !== 0) {
        logger.error(`CI failed on command: ${command.join(" ")}`);
        return code;
      }
    }
    return 0;
  },
);

register(
  "cifix",
  "runs all of our CI tests and fixes them if they fail.",
  async () => {
    await runShellCommand(["fmt"]);
    return runShellCommand(["task", "ci"]);
  },
);
