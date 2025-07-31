#!/usr/bin/env -S deno run -A
/**
 * Test the terminal titlebar functionality
 */

import { parseArgs } from "@std/cli";
import {
  clearTitlebar,
  createTitlebarUpdater,
  supportsTitlebar,
  ui,
  updateTitlebar,
} from "@bfmono/packages/cli-ui/cli-ui.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["help", "demo", "clear", "check"],
  string: ["set"],
  alias: { h: "help" },
});

// Support positional argument as shorthand for --set
// BFT passes the command name as the first argument, so we need the second one
const positionalTitle = flags._?.[1]?.toString() || flags._?.[0]?.toString();
if (positionalTitle && positionalTitle !== "titlebar" && !flags.set && !flags.clear && !flags.demo && !flags.check) {
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
  Deno.exit(0);
}

// Check terminal support
if (
  flags.check || (!flags.demo && !flags.flash && !flags.set && !flags.clear)
) {
  const supported = supportsTitlebar();
  ui.info(`Terminal titlebar support: ${supported ? "✅ YES" : "❌ NO"}`);

  // Always show terminal details for debugging
  ui.info("Terminal details:");
  ui.info(`  TERM: ${Deno.env.get("TERM") || "(not set)"}`);
  ui.info(`  TERM_PROGRAM: ${Deno.env.get("TERM_PROGRAM") || "(not set)"}`);
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

  if (!flags.demo && !flags.flash && !flags.set && !flags.clear) {
    Deno.exit(0);
  }
}

// Set title
if (flags.set) {
  ui.info(`Setting titlebar to: "${flags.set}"`);
  await updateTitlebar(flags.set);
  ui.info("Titlebar updated");
  Deno.exit(0);
}

// Clear title
if (flags.clear) {
  ui.info("Clearing titlebar...");
  await clearTitlebar();
  ui.info("Titlebar cleared");
  Deno.exit(0);
}

// Run demo
if (flags.demo) {
  ui.info("🎭 Terminal Titlebar Demo");
  ui.info("========================");

  if (!supportsTitlebar()) {
    ui.warn("Your terminal doesn't support titlebar updates!");
    ui.info("The demo will run but you won't see the title changes.");
    ui.output("");
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Basic updates
  ui.info("1️⃣  Basic title updates:");

  ui.info("   Setting title to 'BFT Demo'...");
  await updateTitlebar("BFT Demo");
  await sleep(2000);

  ui.info("   Changing to 'Processing Files...'");
  await updateTitlebar("Processing Files...");
  await sleep(2000);

  ui.info("   Clearing title...");
  await clearTitlebar();
  await sleep(1000);

  ui.output("");

  // Prefixed updater
  ui.info("2️⃣  Using a prefixed updater:");
  const bft = createTitlebarUpdater("bft");

  ui.info("   Starting build process...");
  await bft.update("Initializing...");
  await sleep(1500);

  await bft.update("Compiling TypeScript...");
  await sleep(1500);

  await bft.update("Running tests...");
  await sleep(1500);

  await bft.update("Building bundles...");
  await sleep(1500);

  await bft.update("✅ Build complete!");
  await sleep(2000);

  await bft.clear();

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
