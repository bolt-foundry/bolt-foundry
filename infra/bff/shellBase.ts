import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";

export async function runShellCommand(
  commandArray: Array<string>,
): Promise<number> {
  // deno-lint-ignore no-console
  console.log(`Running command: ${commandArray.join(" ")}`);
  const stopSpinner = startSpinner();
  const cwd = Deno.env.get("BFF_ROOT") ?? Deno.cwd();

  const cmd = new Deno.Command(commandArray[0], {
    args: commandArray.slice(1),
    stdout: "inherit",
    stderr: "inherit",
    cwd,
  });

  const process = cmd.spawn();
  const { code, success } = await process.output();
  stopSpinner();

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
