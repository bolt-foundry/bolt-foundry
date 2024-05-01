import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "update",
  "Pulls changes down",
  async () => {
    await runShellCommand(["sl", "pull"]);
    await runShellCommand(["sl", "goto", "main"]);
    return 0;
  },
);
