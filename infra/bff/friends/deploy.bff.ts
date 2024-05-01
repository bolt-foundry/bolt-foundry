import { runShellCommand } from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "deploy:prep",
  "Prep for deploy",
  async () => {
    await runShellCommand(["sl", "pull"]);
    await runShellCommand(["sl", "goto", "main", "--clean"]);
    return 0;
  },
);
