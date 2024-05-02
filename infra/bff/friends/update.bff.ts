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
      "replitbf-git-askpass",
      "Password for 'https://token@github.com': ",
    ]);
    await runShellCommand(["sl", "pull"], { GH_TOKEN: ghToken });
    await runShellCommand(["sl", "goto", "main"], { GH_TOKEN: ghToken });
    return 0;
  },
);

register(
  "deploy",
  "Pulls changes down. WILL OVERWRITE ANY CURRENT CHANGES.",
  async () => {
    console.log(
      "This command will overwrite any changes you have made to the current branch. ctrl + c now. You have 5 seconds",)
    await runShellCommand(['sleep', '5']);
    const ghToken = await runShellCommandWithOutput([
      "replit-git-askpass",
      "Password for 'https://token@github.com': ",
    ]);
    await runShellCommand(["sl", "pull"], { GH_TOKEN: ghToken });
    await runShellCommand(["sl", "goto", "main", "--clean"], { GH_TOKEN: ghToken });
    return 0;
  },
);