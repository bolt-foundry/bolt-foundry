import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";

export async function runShellCommand(
  commandArray: Array<string>,
  useSpinner = true,
): Promise<number> {
  // deno-lint-ignore no-console
  console.log(`Running command: ${commandArray.join(" ")}`);
  let stopSpinner;
  if (useSpinner) {
    stopSpinner = startSpinner();
  }
  const cwd = Deno.env.get("BF_PATH") ?? Deno.cwd();

  const cmd = new Deno.Command(commandArray[0], {
    args: commandArray.slice(1),
    stdout: "inherit",
    stderr: "inherit",
    cwd,
  });

  const process = cmd.spawn();
  const { code, success } = await process.output();
  stopSpinner ? stopSpinner() : null;

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
}

export async function runShellCommandWithOutput(
  commandArray: Array<string>,
  useSpinner = true,): Promise<string> {
  // deno-lint-ignore no-console
  console.log(`Running command: ${commandArray.join(" ")}`);
  let stopSpinner;
  if (useSpinner) {
    stopSpinner = startSpinner();
  }
  const cwd = Deno.env.get("BF_PATH") ?? Deno.cwd();

  const cmd = new Deno.Command(commandArray[0], {
    args: commandArray.slice(1),
    stdout: "piped",
    stderr: "piped",
    cwd,
  });

  const process = cmd.spawn();
  const { stdout } = await process.output();
  stopSpinner ? stopSpinner() : null;
  return new TextDecoder().decode(stdout);
  }

export function registerShellCommand(
  name: string,
  description: string,
  commandArray: Array<string>,
) {
  const shellCommand = () => {
    return runShellCommand(commandArray);
  };
  register(
    name,
    description,
    shellCommand,
  );
  return shellCommand;
}
