#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function pull(): Promise<number> {
  logger.info("Pulling latest code from sapling...");
  const pullResult = await runShellCommand([
    "sl",
    "pull",
  ]);

  if (pullResult !== 0) {
    return pullResult;
  }

  logger.info("Going to remote/main...");
  const gotoResult = await runShellCommand([
    "sl",
    "goto",
    "remote/main",
  ]);

  if (gotoResult !== 0) {
    return gotoResult;
  }

  logger.info("Installing dependencies...");
  return await runShellCommand([
    "deno",
    "install",
  ]);
}

register("pull", "Pull the latest code from sapling", pull);
