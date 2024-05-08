import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "update",
  "Pulls changes down.",
  async () => {
    const ghToken = await runShellCommandWithOutput([
      "replit-git-askpass",
      "Password for 'https://token@github.com': ",
    ]);
    await runShellCommand(["sl", "pull"], { GH_TOKEN: ghToken });
    await runShellCommand(["sl", "goto", "main"], { GH_TOKEN: ghToken });
    return 0;
  },
);
