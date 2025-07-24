#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli/parse-args";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

interface CodebotArgs {
  shell?: boolean;
  exec?: string;
  help?: boolean;
}

async function codebot(args: Array<string>): Promise<number> {
  const parsed = parseArgs(args, {
    boolean: ["shell", "help"],
    string: ["exec"],
    alias: { h: "help" },
  }) as CodebotArgs;

  if (parsed.help) {
    ui.output(`
Usage: bft codebot [OPTIONS]

OPTIONS:
  --shell       Enter container shell
  --exec CMD    Execute command in container
  --help        Show this help message
`);
    return 0;
  }

  if (parsed.shell) {
    const child = new Deno.Command("container", {
      args: ["run", "--rm", "-it", "codebot"],
      stdin: "inherit",
      stdout: "inherit", 
      stderr: "inherit",
    }).spawn();
    
    await child.status;
    return 0;
  }

  if (parsed.exec) {
    const child = new Deno.Command("container", {
      args: ["run", "--rm", "codebot", parsed.exec],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit", 
    }).spawn();
    
    const { success } = await child.status;
    return success ? 0 : 1;
  }

  ui.output("Use --help for usage information");
  return 0;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Run container commands",
  aiSafe: true,
  fn: codebot,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  const result = await codebot(scriptArgs);
  Deno.exit(result);
}