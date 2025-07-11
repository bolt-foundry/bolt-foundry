#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "@bfmono/infra/bff/shellBase.ts";

const logger = getLogger(import.meta);

async function getCurrentStack(): Promise<Array<string>> {
  const { stdout } = await runShellCommandWithOutput(
    [
      "sl",
      "log",
      "-r",
      ".::",
      "--template",
      "{node}\n",
    ],
    {},
    true,
    true,
  );
  return stdout.split("\n").filter(Boolean);
}

async function getCommitTitle(commit: string): Promise<string> {
  const { stdout } = await runShellCommandWithOutput(
    [
      "sl",
      "log",
      "-r",
      commit,
      "--template",
      "{desc|firstline}",
    ],
    {},
    true,
    true,
  );
  return stdout.trim();
}

export async function testStack(): Promise<number> {
  try {
    // Run build first to check for changes
    const buildResult = await runShellCommand(
      [
        "bff",
        "build",
      ],
      undefined,
      {},
      true,
      true,
    );

    if (buildResult !== 0) {
      logger.error("Build failed");
      return 1;
    }

    // Check for any changes after build
    const { stdout: hasChanges } = await runShellCommandWithOutput(
      [
        "sl",
        "status",
        "-m",
      ],
      {},
      true,
      true,
    );

    if (hasChanges.trim()) {
      logger.error(
        "Build produced uncommitted changes. Please commit these changes first.",
      );
      return 1;
    }

    const commits = await getCurrentStack();
    let hasErrors = false;

    for (const commit of commits) {
      const title = await getCommitTitle(commit);
      logger.info(`testing commit: ${title}`);

      const gotoResult = await runShellCommand(
        [
          "sl",
          "goto",
          commit,
        ],
        undefined,
        {},
        true,
        true,
      );

      if (gotoResult !== 0) {
        hasErrors = true;
        continue;
      }

      const testResult = await runShellCommand(
        [
          "deno",
          "test",
          "-A",
        ],
        undefined,
        {},
        true,
        true,
      );

      if (testResult !== 0) {
        hasErrors = true;
      }
    }

    return hasErrors ? 1 : 0;
  } catch (error) {
    logger.error("Error running tests:", error);
    return 1;
  }
}

register(
  "testStack",
  "Run tests on each commit in the current stack",
  testStack,
);
