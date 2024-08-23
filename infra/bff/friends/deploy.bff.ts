import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { register } from "infra/bff/mod.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

function parseLogInfo(loginfo: string) {
  const lines = loginfo.trim().split("\n");
  const commitHash = lines[0].split("changeset: ")[1];
  const author = lines[1].split("user:")[1].trim();
  const date = lines[2].split("date:    ")[1].trim();
  const summary = lines[3].split("summary: ")[1].trim();
  return { commitHash, author, date, summary };
}

async function land() {
  const ghToken = Deno.env.get("GITHUB_TOKEN") ?? "";
  logger.info(
    "This command will overwrite any changes you have made to the current branch. ctrl + c now. You have 5 seconds",
  );
  await runShellCommand(["sleep", "5"]);
  await runShellCommand(["sl", "pull"], { GH_TOKEN: ghToken });
  await runShellCommand(["sl", "goto", "main", "--clean"], {
    GH_TOKEN: ghToken,
  });
  logger.info(
    "We will automatically make a git commit in 5 seconds. Please cancel if you don't want this.",
  );
  await runShellCommand(["sleep", "5"]);
  const logInfoString = await runShellCommandWithOutput([
    "sl",
    "log",
    "-l",
    "1",
  ]);
  await runShellCommand(["git", "add", "."]);
  const logInfo = parseLogInfo(logInfoString);
  await runShellCommand([
    "git",
    "commit",
    "-a",
    "--author",
    logInfo.author,
    "--date",
    logInfo.date,
    "-m",
    logInfo.summary,
  ]);
  await Deno.remove(Deno.env.get("HISTFILE")!);
  return 0;
}
register(
  "deploy",
  "Deprecated, use land instead",
  land,
);
register(
  "land",
  "Pulls changes down. WILL OVERWRITE ANY CURRENT CHANGES. WILL ALSO MAKE A GIT COMMIT.",
  land,
);
