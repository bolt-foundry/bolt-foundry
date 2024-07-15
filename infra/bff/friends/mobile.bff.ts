import { register } from "infra/bff/mod.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";

register("mobile", "Starts the mobile dev environment", async (args) => {
  const commandArray = [
    "yarn",
    "run",
    "expo",
    "start",
    "--localhost",
    "-p",
    "443",
    "--https",
    "--go",
  ];
  // deno-lint-ignore no-console
  console.log(`Running command: ${commandArray.join(" ")}`);
  const env = Deno.env.toObject();
  const cwd = `${Deno.env.get("BF_PATH") ?? Deno.cwd()}/mobile/expoApp`;

  const cmd = new Deno.Command(commandArray[0], {
    args: commandArray.slice(1),
    stdout: "inherit",
    stderr: "inherit",
    cwd,
    env,
  });

  const process = cmd.spawn();
  const { code, success } = await process.output();

  if (success) {
    // deno-lint-ignore no-console
    console.log(`Command succeeded: ${commandArray.join(" ")}`);
  } else {
    // deno-lint-ignore no-console
    console.error(
      `Command failed with code ${code}: ${commandArray.join(" ")}`,
    );
  }

  return code;
});
