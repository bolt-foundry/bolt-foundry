#!/usr/bin/env -S deno run --allow-read --allow-run

import { parseArgs } from "@std/cli";
import { getLogger, startSpinner } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const args = parseArgs(Deno.args, {
  string: ["from", "to"],
  boolean: ["help"],
  default: {
    to: "HEAD",
  },
});

if (args.help || !args.from) {
  logger.println(
    "Usage: create-release-notes.ts --from <tag/commit> [--to <tag/commit>]",
  );
  logger.println(
    "Example: create-release-notes.ts --from aibff-v0.1.0 --to HEAD",
  );
  Deno.exit(args.help ? 0 : 1);
}

async function getGitLog(from: string, to: string): Promise<Array<string>> {
  const cmd = new Deno.Command("git", {
    args: ["log", `${from}..${to}`, "--oneline", "--", "apps/aibff/"],
    stdout: "piped",
  });

  const { stdout, success } = await cmd.output();
  if (!success) {
    throw new Error("Failed to get git log");
  }

  const output = new TextDecoder().decode(stdout);
  return output.trim().split("\n").filter(Boolean);
}

function categorizeCommits(commits: Array<string>): {
  features: Array<string>;
  fixes: Array<string>;
  other: Array<string>;
} {
  const features: Array<string> = [];
  const fixes: Array<string> = [];
  const other: Array<string> = [];

  for (const commit of commits) {
    const message = commit.substring(8); // Remove commit hash

    if (
      message.toLowerCase().includes("feat:") ||
      message.toLowerCase().includes("feature:")
    ) {
      features.push(message);
    } else if (
      message.toLowerCase().includes("fix:") ||
      message.toLowerCase().includes("bug:")
    ) {
      fixes.push(message);
    } else {
      other.push(message);
    }
  }

  return { features, fixes, other };
}

try {
  logger.println(`Generating release notes from ${args.from} to ${args.to}...`);

  const stopSpinner = startSpinner();
  const commits = await getGitLog(args.from, args.to);
  const { features, fixes, other } = await categorizeCommits(commits);
  stopSpinner();

  // Using stdout directly for release notes output
  const output: Array<string> = [];
  output.push("\n## What's Changed\n");

  if (features.length > 0) {
    output.push("### 🚀 Features");
    features.forEach((f) => output.push(`- ${f}`));
    output.push("");
  }

  if (fixes.length > 0) {
    output.push("### 🐛 Bug Fixes");
    fixes.forEach((f) => output.push(`- ${f}`));
    output.push("");
  }

  if (other.length > 0) {
    output.push("### 📦 Other Changes");
    other.forEach((o) => output.push(`- ${o}`));
    output.push("");
  }

  output.push(
    `**Full Changelog**: https://github.com/{owner}/{repo}/compare/${args.from}...${args.to}`,
  );

  // Write to stdout
  await Deno.stdout.write(new TextEncoder().encode(output.join("\n")));
} catch (error) {
  logger.printErr(`Error generating release notes: ${error.message}`);
  Deno.exit(1);
}
