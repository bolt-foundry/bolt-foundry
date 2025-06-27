/**
 * CLI UI output utilities for consistent console output across Bolt Foundry tools.
 *
 * This module provides a clean separation between UI output (info, warnings, errors)
 * and actual command output that might be piped or processed.
 */

// deno-lint-ignore-file no-console
// This file is specifically for console output utilities

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
export interface UIOutput {
  /** Print an informational message to stderr */
  info: (message: string) => void;
  /** Print a warning message to stderr */
  warn: (message: string) => void;
  /** Print an error message to stderr */
  error: (message: string) => void;
  /** Print actual output to stdout (for piping) */
  output: (message: string) => void;
  /** Print debug message if DEBUG env var is set */
  debug: (message: string) => void;
}

/** Default UI implementation using console */
export const ui: UIOutput = {
  info: (message: string) => {
    // Write to stderr so it doesn't interfere with piped output
    console.error(message);
  },

  warn: (message: string) => {
    console.error(`Warning: ${message}`);
  },

  error: (message: string) => {
    console.error(`Error: ${message}`);
  },

  output: (message: string) => {
    // This goes to stdout for piping
    console.log(message);
  },

  debug: (message: string) => {
    if (getConfigurationVariable("DEBUG")) {
      console.error(`[DEBUG] ${message}`);
    }
  },
};

/** Create a prefixed UI instance */
export function createPrefixedUI(prefix: string): UIOutput {
  return {
    info: (message: string) => ui.info(`[${prefix}] ${message}`),
    warn: (message: string) => ui.warn(`[${prefix}] ${message}`),
    error: (message: string) => ui.error(`[${prefix}] ${message}`),
    output: (message: string) => ui.output(message), // No prefix for output
    debug: (message: string) => ui.debug(`[${prefix}] ${message}`),
  };
}

/** Create a silent UI instance (useful for testing) */
export function createSilentUI(): UIOutput {
  return {
    info: () => {},
    warn: () => {},
    error: () => {},
    output: () => {},
    debug: () => {},
  };
}

/** Create a capturing UI instance (useful for testing) */
export function createCapturingUI(): UIOutput & {
  captured: Array<{ type: keyof UIOutput; message: string }>;
} {
  const captured: Array<{ type: keyof UIOutput; message: string }> = [];

  return {
    captured,
    info: (message: string) => captured.push({ type: "info", message }),
    warn: (message: string) => captured.push({ type: "warn", message }),
    error: (message: string) => captured.push({ type: "error", message }),
    output: (message: string) => captured.push({ type: "output", message }),
    debug: (message: string) => captured.push({ type: "debug", message }),
  };
}
