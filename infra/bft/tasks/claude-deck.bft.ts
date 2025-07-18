#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { join } from "@std/path";
import { existsSync } from "@std/fs";

async function claudeDeck(args: Array<string>): Promise<number> {
  if (args.length === 0 || args.includes("--help")) {
    ui.info(
      "Usage: bft claude-deck <deck.md> [context-file] [claude-options...]",
    );
    ui.info("");
    ui.info("Run a deck file with Claude Code");
    ui.info("");
    ui.info("Arguments:");
    ui.info("  <deck.md>        Path to the deck file to run");
    ui.info("  [context-file]   Optional TOML file with context values");
    ui.info("  [claude-options] Additional options to pass to Claude Code");
    ui.info("");
    ui.info("Examples:");
    ui.info("  bft claude-deck ./commit.bft.deck.md");
    ui.info(
      "  bft claude-deck ./commit.bft.deck.md --context-file context.toml",
    );
    ui.info("  bft claude-deck ./commit.bft.deck.md --print");
    return 0;
  }

  const deckPath = args[0];

  // Check if deck file exists
  if (!existsSync(deckPath)) {
    ui.error(`Deck file not found: ${deckPath}`);
    return 1;
  }

  // Build aibff render command
  const renderArgs = ["aibff", "render", deckPath, "--format", "markdown"];

  // Look for context file in remaining args
  const contextFileIndex = args.findIndex((arg) => arg === "--context-file");
  if (contextFileIndex !== -1 && contextFileIndex + 1 < args.length) {
    renderArgs.push("--context-file", args[contextFileIndex + 1]);
  }

  // Extract Claude Code options (everything except deck path and context file args)
  const claudeArgs: Array<string> = [];
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--context-file") {
      i++; // Skip the next argument (the context file path)
      continue;
    }
    claudeArgs.push(args[i]);
  }

  try {
    // Run aibff render to get markdown
    const renderProcess = new Deno.Command("bft", {
      args: renderArgs,
      stdout: "piped",
      stderr: "piped",
    });

    const renderResult = await renderProcess.output();

    if (renderResult.code !== 0) {
      const errorText = new TextDecoder().decode(renderResult.stderr);
      ui.error(`Failed to render deck: ${errorText}`);
      return 1;
    }

    const markdownContent = new TextDecoder().decode(renderResult.stdout);

    // Run Claude Code with the markdown content as an argument
    const claudeProcess = new Deno.Command("claude", {
      args: [...claudeArgs, markdownContent],
      stdout: "inherit",
      stderr: "inherit",
    });

    const claudeResult = await claudeProcess.output();

    return claudeResult.code;
  } catch (error) {
    ui.error(`Failed to run deck with Claude Code: ${error}`);
    return 1;
  }
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Run a deck file with Claude Code",
  aiSafe: true,
  fn: claudeDeck,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2); // Skip "run" and script name
  Deno.exit(await claudeDeck(scriptArgs));
}
