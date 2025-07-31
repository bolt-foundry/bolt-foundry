#! /usr/bin/env -S deno run -A

import { friendMap } from "@bfmono/infra/bff/bff.ts";
import {
  disableAllLogging,
  getLogger,
} from "@bfmono/packages/logger/logger.ts";
import { dirname, join } from "@std/path";

const logger = getLogger(import.meta);

async function findProjectRoot(): Promise<string> {
  let current = Deno.cwd();
  while (true) {
    try {
      const gitDir = join(current, ".git");
      const stat = await Deno.stat(gitDir);
      if (stat.isDirectory) {
        return current;
      }
    } catch (_err) {
      // keep going
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return Deno.cwd();
}
if (import.meta.main) {
  // Check for --silent flag
  const silentIndex = Deno.args.indexOf("--silent");
  if (silentIndex !== -1) {
    disableAllLogging();
    // Remove --silent from args so it doesn't interfere with commands
    Deno.args.splice(silentIndex, 1);
  }

  // 1) Force us to run from top-level directory
  const rootDir = await findProjectRoot();
  if (rootDir !== Deno.cwd()) {
    logger.info(`Switching working directory to: ${rootDir}`);
    Deno.chdir(rootDir);
  }

  // 2) Then load environment files, scan "friends"
  const friendsUrl = new URL(import.meta.resolve("infra/bff/friends"));
  const envFiles = [".env", ".env.awscreds", ".env.lambdas"];
  for (const envFile of envFiles) {
    const envUrl = new URL(envFile, `file://${Deno.cwd()}/`);
    try {
      const env = await Deno.readTextFile(envUrl);
      for (const line of env.split("\n")) {
        const [key, value] = line.split("=");
        if (key && value) Deno.env.set(key, value);
      }
    } catch (_error) {
      // ignore
    }
  }

  for await (const friend of Deno.readDir(friendsUrl.pathname)) {
    if (friend.name.endsWith(".bff.ts")) {
      try {
        await import(`infra/bff/friends/${friend.name}`);
      } catch (e) {
        logger.error(`Error importing ${friend.name}`, e);
      }
    }
  }

  const token = Deno.args[0] ?? "help";
  if (!token) {
    logger.error("bff: no command or file given");
    Deno.exit(1);
  }

  // 1️⃣ File-path first
  const stat = await Deno.stat(token).catch(() => null);
  if (stat?.isFile) {
    const { code } = await new Deno.Command("deno", {
      args: ["run", "-A", token, ...Deno.args.slice(1)],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    }).output();
    Deno.exit(code);
  }

  // 2️⃣ Otherwise fall back to the internal command registry
  const friend = friendMap.get(token);
  if (friend) {
    Deno.exit(await friend.command(Deno.args.slice(1)));
  } else {
    logger.error(`Unknown command: ${token}`);
    Deno.exit(1);
  }
}
