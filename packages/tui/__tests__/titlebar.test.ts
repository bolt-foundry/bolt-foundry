#!/usr/bin/env -S deno test

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals } from "@std/assert";
import {
  clearTitlebar,
  createTitlebarUpdater,
  supportsTitlebar,
  updateTitlebar,
} from "../titlebar.ts";

Deno.test("titlebar: updateTitlebar writes correct escape sequence", async () => {
  const originalWrite = Deno.stdout.write;
  let capturedData: Uint8Array | undefined;

  try {
    // Mock Deno.stdout.write
    Deno.stdout.write = (data: Uint8Array) => {
      capturedData = data;
      return Promise.resolve(data.length);
    };

    await updateTitlebar("Test Title");

    // Check that the correct escape sequence was written
    const expectedSequence = "\x1b]0;Test Title\x07";
    const actualSequence = new TextDecoder().decode(capturedData);
    assertEquals(actualSequence, expectedSequence);
  } finally {
    Deno.stdout.write = originalWrite;
  }
});

Deno.test("titlebar: clearTitlebar sends empty title", async () => {
  const originalWrite = Deno.stdout.write;
  let capturedData: Uint8Array | undefined;

  try {
    Deno.stdout.write = (data: Uint8Array) => {
      capturedData = data;
      return Promise.resolve(data.length);
    };

    await clearTitlebar();

    const expectedSequence = "\x1b]0;\x07";
    const actualSequence = new TextDecoder().decode(capturedData);
    assertEquals(actualSequence, expectedSequence);
  } finally {
    Deno.stdout.write = originalWrite;
  }
});

Deno.test("titlebar: createTitlebarUpdater adds prefix", async () => {
  const originalWrite = Deno.stdout.write;
  let capturedData: Uint8Array | undefined;

  try {
    Deno.stdout.write = (data: Uint8Array) => {
      capturedData = data;
      return Promise.resolve(data.length);
    };

    const titlebar = createTitlebarUpdater("MyApp");
    await titlebar.update("Loading...");

    const expectedSequence = "\x1b]0;MyApp: Loading...\x07";
    const actualSequence = new TextDecoder().decode(capturedData);
    assertEquals(actualSequence, expectedSequence);
  } finally {
    Deno.stdout.write = originalWrite;
  }
});

Deno.test("titlebar: supportsTitlebar detects terminal support", () => {
  const originalTerm = getConfigurationVariable("TERM");
  const originalTermProgram = getConfigurationVariable("TERM_PROGRAM");
  const originalForceTitlebar = getConfigurationVariable("FORCE_TITLEBAR");
  const originalNoTitlebar = getConfigurationVariable("NO_TITLEBAR");

  try {
    // Clear all env vars first
    Deno.env.delete("TERM");
    Deno.env.delete("TERM_PROGRAM");
    Deno.env.delete("FORCE_TITLEBAR");
    Deno.env.delete("NO_TITLEBAR");

    // Test with FORCE_TITLEBAR
    Deno.env.set("FORCE_TITLEBAR", "1");
    assertEquals(supportsTitlebar(), true);
    Deno.env.delete("FORCE_TITLEBAR");

    // Test with NO_TITLEBAR
    Deno.env.set("NO_TITLEBAR", "1");
    assertEquals(supportsTitlebar(), false);
    Deno.env.delete("NO_TITLEBAR");

    // Test with supported TERM
    Deno.env.set("TERM", "xterm-256color");
    assertEquals(supportsTitlebar(), true);

    // Test with supported TERM_PROGRAM
    Deno.env.set("TERM", "dumb");
    Deno.env.set("TERM_PROGRAM", "vscode");
    assertEquals(supportsTitlebar(), true);

    // Test with unsupported terminal
    Deno.env.set("TERM", "dumb");
    Deno.env.set("TERM_PROGRAM", "unknown");
    assertEquals(supportsTitlebar(), false);
  } finally {
    if (originalTerm) {
      Deno.env.set("TERM", originalTerm);
    } else {
      Deno.env.delete("TERM");
    }

    if (originalTermProgram) {
      Deno.env.set("TERM_PROGRAM", originalTermProgram);
    } else {
      Deno.env.delete("TERM_PROGRAM");
    }

    if (originalForceTitlebar) {
      Deno.env.set("FORCE_TITLEBAR", originalForceTitlebar);
    } else {
      Deno.env.delete("FORCE_TITLEBAR");
    }

    if (originalNoTitlebar) {
      Deno.env.set("NO_TITLEBAR", originalNoTitlebar);
    } else {
      Deno.env.delete("NO_TITLEBAR");
    }
  }
});

Deno.test("titlebar: updateTitlebar handles write errors gracefully", async () => {
  const originalWrite = Deno.stdout.write;

  try {
    // Mock write to throw an error
    Deno.stdout.write = () => {
      throw new Error("Write failed");
    };

    // Should not throw
    await updateTitlebar("Test");

    // Test passes if no error is thrown
    assertEquals(true, true);
  } finally {
    Deno.stdout.write = originalWrite;
  }
});
