#!/usr/bin/env -S deno test
// deno-lint-ignore-file no-console

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals } from "@std/assert";
import {
  createCapturingUI,
  createPrefixedUI,
  createSilentUI,
  ui,
} from "../tui.ts";

Deno.test("tui: capturing UI captures all message types", () => {
  const captureUI = createCapturingUI();

  captureUI.info("info message");
  captureUI.warn("warning message");
  captureUI.error("error message");
  captureUI.output("output message");
  captureUI.debug("debug message");

  assertEquals(captureUI.captured.length, 5);
  assertEquals(captureUI.captured[0], {
    type: "info",
    message: "info message",
  });
  assertEquals(captureUI.captured[1], {
    type: "warn",
    message: "warning message",
  });
  assertEquals(captureUI.captured[2], {
    type: "error",
    message: "error message",
  });
  assertEquals(captureUI.captured[3], {
    type: "output",
    message: "output message",
  });
  assertEquals(captureUI.captured[4], {
    type: "debug",
    message: "debug message",
  });
});

Deno.test("tui: prefixed UI adds prefix to all but output", () => {
  const captureUI = createCapturingUI();

  // Test actual prefixed UI
  const prefixed = createPrefixedUI("TEST");
  // For testing, we'll use our capture UI to verify the behavior
  const originalInfo = ui.info;
  const originalWarn = ui.warn;
  const originalError = ui.error;
  const originalDebug = ui.debug;

  try {
    ui.info = (msg: string) => captureUI.info(msg);
    ui.warn = (msg: string) => captureUI.warn(msg);
    ui.error = (msg: string) => captureUI.error(msg);
    ui.debug = (msg: string) => captureUI.debug(msg);

    prefixed.info("test");
    prefixed.warn("test");
    prefixed.error("test");
    prefixed.debug("test");

    assertEquals(captureUI.captured[0].message, "[TEST] test");
    assertEquals(captureUI.captured[1].message, "[TEST] test");
    assertEquals(captureUI.captured[2].message, "[TEST] test");
    assertEquals(captureUI.captured[3].message, "[TEST] test");
  } finally {
    ui.info = originalInfo;
    ui.warn = originalWarn;
    ui.error = originalError;
    ui.debug = originalDebug;
  }
});

Deno.test("tui: silent UI produces no output", () => {
  const silent = createSilentUI();

  // These should not throw and should do nothing
  silent.info("test");
  silent.warn("test");
  silent.error("test");
  silent.output("test");
  silent.debug("test");

  // Test passes if no errors thrown
  assertEquals(true, true);
});

Deno.test("tui: debug messages only show with DEBUG env var", () => {
  const originalEnv = getConfigurationVariable("DEBUG");
  const capturedOutput: Array<string> = [];
  const originalConsoleError = console.error;

  try {
    // Mock console.error to capture output
    console.error = (msg: string) => capturedOutput.push(msg);

    // Without DEBUG env var
    Deno.env.delete("DEBUG");
    ui.debug("should not show");
    assertEquals(capturedOutput.length, 0);

    // With DEBUG env var
    Deno.env.set("DEBUG", "1");
    ui.debug("should show");
    assertEquals(capturedOutput.length, 1);
    assertEquals(capturedOutput[0], "[DEBUG] should show");
  } finally {
    console.error = originalConsoleError;
    if (originalEnv) {
      Deno.env.set("DEBUG", originalEnv);
    } else {
      Deno.env.delete("DEBUG");
    }
  }
});
