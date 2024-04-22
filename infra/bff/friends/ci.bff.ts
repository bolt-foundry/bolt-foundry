// Import runShellCommand from shellBase.ts
import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "ci",
  "runs all of our CI tests and fails if they fail.",
  async () => {
    const commands = [["deno", "test", "--cached-only", "-A"], [
      "deno",
      "fmt",
      "--check",
      "packages",
      "infra",
    ], [
      "deno",
      "lint",
    ], ["bff", "check"]];
    for (const command of commands) {
      const code = await runShellCommand(command);
      if (code !== 0) {
        // deno-lint-ignore no-console
        console.error(`CI failed on command: ${command.join(" ")}`);
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
