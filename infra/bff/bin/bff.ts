#! /usr/bin/env -S deno run -A
import { friendMap } from "infra/bff/mod.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

if (import.meta.main) {
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
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // File does not exist, probably b/c it's on github.
        continue;
      } else {
        throw error;
      }
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
  const command = Deno.args[0] ?? "help";
  const friend = friendMap.get(command);

  if (friend) {
    Deno.exit(await friend.command(Deno.args.slice(1)));
  } else {
    // deno-lint-ignore no-console
    console.log(`bff: '${command}' is not a bff command. See 'bff help'.`);
    Deno.exit(1);
  }
}
