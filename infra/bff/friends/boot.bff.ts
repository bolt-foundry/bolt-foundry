import { register } from "infra/bff/mod.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";

register(
  "boot",
  "initializes the repl with applicable options when the repl boots up",
  async () => {
    await runShellCommand(["bff"]);
    return await 0;
  },
);
