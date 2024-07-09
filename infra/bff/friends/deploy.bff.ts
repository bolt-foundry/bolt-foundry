import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";

register(
  "deploy",
  "Pulls changes down. WILL OVERWRITE ANY CURRENT CHANGES. WILL ALSO MAKE A GIT COMMIT.",
  async () => {
    const ghToken = await runShellCommandWithOutput([
      "replit-git-askpass",
      "Password for 'https://token@github.com': ",
    ]);
    if (ghToken.trim() === "no GitHub token available") {
      throw new Error("No token, can't proceed.");
    }
    console.log(
      "This command will overwrite any changes you have made to the current branch. ctrl + c now. You have 5 seconds",
    );
    await runShellCommand(["sleep", "5"]);
    await runShellCommand(["sl", "pull"], { GH_TOKEN: ghToken });
    await runShellCommand(["sl", "goto", "main", "--clean"], {
      GH_TOKEN: ghToken,
    });
    console.log(
      "We will automatically make a git commit in 5 seconds. Please cancel if you don't want this."
    );
    await runShellCommand(["sleep", "5"]);
    await runShellCommand(["git", "commit", "-a", "-m", "Deploy"]);
    return 0;
  },
);
