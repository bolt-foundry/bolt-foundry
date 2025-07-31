import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { startSpinner } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Global array to track running child processes
export const runningProcesses: Array<Deno.ChildProcess> = [];

export async function runShellCommand(
  commandArray: Array<string>,
  cwdString = Deno.cwd(),
  additionalEnv: Record<string, string> = {},
  useSpinner = true,
  silent = false,
): Promise<number> {
  const env = { ...Deno.env.toObject(), ...additionalEnv };

  if (!silent) {
    logger.info(`Running command: ${commandArray.join(" ")}`);
  }
  let stopSpinner: (() => void) | undefined;
  if (useSpinner) {
    stopSpinner = startSpinner();
  }

  const cwd = new URL(import.meta.resolve(cwdString));

  const cmd = new Deno.Command(commandArray[0], {
    args: commandArray.slice(1),
    stdout: "inherit",
    stderr: "inherit",
    cwd,
    env,
  });
  const process = cmd.spawn();
  runningProcesses.push(process);

  const { code, success } = await process.output();

  if (stopSpinner) stopSpinner();

  if (!silent) {
    if (success) {
      logger.info(`Command succeeded: ${commandArray.join(" ")}`);
    } else {
      logger.error(
        `Command failed with code ${code}: ${commandArray.join(" ")}`,
      );
    }
  }

  const index = runningProcesses.indexOf(process);
  if (index > -1) {
    runningProcesses.splice(index, 1);
  }

  return code;
}

export async function runShellCommandWithOutput(
  commandArray: Array<string>,
  cwdString = Deno.cwd(),
  additionalEnv: Record<string, string> = {},
): Promise<{
  stdout: string;
  stderr: string;
  code: number;
  success: boolean;
}> {
  const env = { ...Deno.env.toObject(), ...additionalEnv };

  logger.info(`Running command (with output): ${commandArray.join(" ")}`);

  const cwd = new URL(import.meta.resolve(cwdString));

  const cmd = new Deno.Command(commandArray[0], {
    args: commandArray.slice(1),
    stdout: "piped",
    stderr: "piped",
    cwd,
    env,
  });
  const process = cmd.spawn();
  runningProcesses.push(process);

  const { code, success, stdout, stderr } = await process.output();

  const index = runningProcesses.indexOf(process);
  if (index > -1) {
    runningProcesses.splice(index, 1);
  }

  const decoder = new TextDecoder();
  return {
    stdout: decoder.decode(stdout),
    stderr: decoder.decode(stderr),
    code,
    success,
  };
}
