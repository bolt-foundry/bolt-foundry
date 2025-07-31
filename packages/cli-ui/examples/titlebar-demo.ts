#!/usr/bin/env -S deno run
/**
 * Demo of titlebar utilities from @bolt-foundry/cli-ui
 */

import {
  clearTitlebar,
  createTitlebarUpdater,
  supportsTitlebar,
  ui,
  updateTitlebar,
} from "../cli-ui.ts";

async function demo() {
  ui.info("Terminal Titlebar Demo");
  ui.info("====================");

  // Check if terminal supports titlebar updates
  if (!supportsTitlebar()) {
    ui.warn("Your terminal doesn't appear to support titlebar updates");
    ui.info("Try running in a different terminal emulator");
    return;
  }

  ui.info("Your terminal supports titlebar updates!");
  ui.output("");

  // Basic title update
  ui.info("Setting title to 'Demo Application'...");
  await updateTitlebar("Demo Application");
  await sleep(2000);

  // Clear title
  ui.info("Clearing title...");
  await clearTitlebar();
  await sleep(1000);

  // Using a prefixed updater
  ui.info("Using a prefixed titlebar updater...");
  const titlebar = createTitlebarUpdater("MyApp");

  await titlebar.update("Starting up...");
  await sleep(1500);

  await titlebar.update("Loading configuration...");
  await sleep(1500);

  await titlebar.update("Ready!");
  await sleep(1500);

  await titlebar.clear();
  ui.output("");
  ui.info("Demo complete!");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run the demo
if (import.meta.main) {
  await demo();
}
