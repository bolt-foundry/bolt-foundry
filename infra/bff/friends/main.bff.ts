import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "main",
  "The primary entry point for the app",
  async () => {
    const cmd = ["./packages/main.ts"];
    return await runShellCommand(cmd, undefined, false);
  },
);
