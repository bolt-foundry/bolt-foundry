#! /usr/bin/env -S bff

// File: infra/bff/shellBase.ts

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { register } from "@bfmono/infra/bff/bff.ts";
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
  inheritOutput = true,
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
    stdout: inheritOutput ? "inherit" : "piped",
    stderr: inheritOutput ? "inherit" : "piped",
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

  return code;
}

/**
 * Revised runShellCommandWithOutput that returns
 * an object { stdout, code, success }.
 */
export async function runShellCommandWithOutput(
  commandArray: Array<string>,
  additionalEnv: Record<string, string> = {},
  useSpinner = true,
  silent = false,
): Promise<{ stdout: string; code: number; success: boolean; stderr: string }> {
  const env = { ...Deno.env.toObject(), ...additionalEnv };

  if (!silent) {
    logger.info(`Running command: ${commandArray.join(" ")}`);
  }
  let stopSpinner: (() => void) | undefined;
  if (useSpinner) {
    stopSpinner = startSpinner();
  }

  // Use BF_PATH or fallback to current directory
  const cwd = getConfigurationVariable("BF_PATH") ?? Deno.cwd();

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
  if (stopSpinner) stopSpinner();

  const stdoutString = new TextDecoder().decode(stdout);
  const stderrString = new TextDecoder().decode(stderr);

  if (!silent) {
    logger.info(stdoutString);
    logger.warn(stderrString);
    if (success) {
      logger.info(`Command succeeded: ${commandArray.join(" ")}`);
    } else {
      logger.error(
        `Command failed with code ${code}: ${commandArray.join(" ")}`,
      );
    }
  }

  return { stdout: stdoutString, code, success, stderr: stderrString };
}

/**
 * Optional convenience function that registers a friend to run a simple shell command.
 */
export function registerShellCommand(
  name: string,
  description: string,
  commandArray: Array<string>,
  useSpinner = true,
) {
  const shellCommand = (args: Array<string>) => {
    return runShellCommand(
      [...commandArray, ...args],
      undefined,
      {},
      useSpinner,
    );
  };
  register(name, description, shellCommand);
  return shellCommand;
}
