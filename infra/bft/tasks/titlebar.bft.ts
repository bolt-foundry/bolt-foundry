#!/usr/bin/env -S bft run
/**
 * Test the terminal titlebar functionality
 */

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import type { TaskDefinition } from "../bft.ts";
import { parseArgs } from "@std/cli";
import {
  clearTitlebar,
  createTitlebarUpdater,
  supportsTitlebar,
  ui,
  updateTitlebar,
} from "@bfmono/packages/tui/tui.ts";

async function titlebar(args: Array<string>): Promise<number> {
  const flags = parseArgs(args, {
    boolean: ["help", "demo", "clear", "check"],
    string: ["set"],
    alias: { h: "help" },
  });

  // Support positional argument as shorthand for --set
  const positionalTitle = flags._?.[0]?.toString();
  if (
    positionalTitle && !flags.set && !flags.clear && !flags.demo && !flags.check
  ) {
    flags.set = positionalTitle;
  }

  if (flags.help) {
    ui.output(`
Usage: bft titlebar [TITLE] [OPTIONS]

Test terminal titlebar functionality from the cli-ui package.

ARGUMENTS:
  TITLE               Set the titlebar to this title (shorthand for --set)

OPTIONS:
  --demo              Run the full demo sequence
  --set TITLE         Set the titlebar to a specific title
  --clear             Clear the titlebar
  --check             Check if terminal supports titlebar updates
  --help, -h          Show this help message

EXAMPLES:
  bft titlebar "Building..."          # Set title (shorthand)
  bft titlebar --check                # Check terminal support
  bft titlebar --set "Building..."    # Set title (explicit)
  bft titlebar --clear                # Clear the title
  bft titlebar --demo                 # Run the demo
`);
    return 0;
  }

  // Check terminal support
  if (
    flags.check || (!flags.demo && !flags.set && !flags.clear)
  ) {
    const supported = supportsTitlebar();
    ui.info(`Terminal titlebar support: ${supported ? "✅ YES" : "❌ NO"}`);

    // Always show terminal details for debugging
    ui.info("Terminal details:");
    ui.info(`  TERM: ${getConfigurationVariable("TERM") || "(not set)"}`);
    ui.info(
      `  TERM_PROGRAM: ${
        getConfigurationVariable("TERM_PROGRAM") || "(not set)"
      }`,
    );
    ui.info(`  isTerminal: ${Deno.stdout.isTerminal()}`);

    if (!supported) {
      ui.info("");
      ui.info("Your terminal doesn't appear to support titlebar updates.");
      ui.info("Try running in a different terminal emulator like:");
      ui.info("  - iTerm2, Terminal.app (macOS)");
      ui.info("  - xterm, gnome-terminal, konsole (Linux)");
      ui.info("  - Windows Terminal, ConEmu (Windows)");
      ui.info("  - Alacritty, Kitty, WezTerm, Ghostty");
    }

    if (!flags.demo && !flags.set && !flags.clear) {
      return 0;
    }
  }

  // Set title
  if (flags.set) {
    ui.info(`Setting titlebar to: "${flags.set}"`);
    await updateTitlebar(flags.set);
    ui.info("Titlebar updated");
    return 0;
  }

  // Clear title
  if (flags.clear) {
    ui.info("Clearing titlebar...");
    await clearTitlebar();
    ui.info("Titlebar cleared");
    return 0;
  }

  // Run demo
  if (flags.demo) {
    await runDemo();
    return 0;
  }

  return 0;
}

// Demo function
async function runDemo() {
  ui.info("🎯 Terminal Titlebar Demo");
  ui.info("Watch your terminal's title bar during this demo!");
  ui.output("");

  // Simple updates
  ui.info("1️⃣  Simple updates:");
  const updates = [
    "Building...",
    "Testing...",
    "Deploying...",
    "Complete! 🎉",
  ];

  for (const update of updates) {
    await updateTitlebar(update);
    ui.info(`   Setting: "${update}"`);
    await sleep(1500);
  }

  ui.output("");

  // Loading animation
  ui.info("2️⃣  Loading animation:");
  const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const loadingUpdater = createTitlebarUpdater("Loading");

  for (let i = 0; i < 20; i++) {
    const frame = spinner[i % spinner.length];
    await loadingUpdater.update(`Loading ${frame}`);
    ui.info(`   ${frame} Loading...`);
    await sleep(100);
  }

  await loadingUpdater.clear();
  ui.output("");

  // Progress indicator
  ui.info("3️⃣  Progress indicator:");
  const progress = createTitlebarUpdater("Progress");

  for (let i = 0; i <= 100; i += 10) {
    await progress.update(`${i}% complete`);
    ui.info(
      `   Progress: ${"█".repeat(i / 10)}${"░".repeat(10 - i / 10)} ${i}%`,
    );
    await sleep(300);
  }

  await progress.clear();

  ui.output("");
  ui.info("✨ Demo complete!");
  ui.info("The titlebar has been restored to its default state.");
}

// Utility function for demo delays
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Test terminal titlebar functionality",
  fn: titlebar,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  // Skip "run" and script name from args
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await titlebar(scriptArgs));
}
