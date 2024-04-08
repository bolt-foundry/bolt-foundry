import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";

async function format(args: Array<string>) {
  // deno-lint-ignore no-console
  console.log("running format");
  const stopSpinner = startSpinner();

  const cmd = new Deno.Command("deno", {
    args,
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await cmd.output();
  stopSpinner();
  if (code === 0) {
    // deno-lint-ignore no-console
    console.log("format success!");
    return code;
  }
  // deno-lint-ignore no-console
  console.error("format failed!");
  return code;
}

register(
  "format",
  "runs 'format' on all of our code.",
  async () => await format(["fmt"]),
);
register(
  "f",
  "shortcut to run 'format' on all of our code.",
  async () => await format(["fmt"]),
);
