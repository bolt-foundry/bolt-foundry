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

/** Information about a CLI command option */
export interface CommandOption {
  /** The flag name (e.g., "--help") */
  flag: string;
  /** Description of what the option does */
  description: string;
  /** Short alias (e.g., "-h") */
  alias?: string;
  /** Default value if any */
  defaultValue?: string;
}

/** Information about a CLI command example */
export interface CommandExample {
  /** The example command */
  command: string;
  /** Description of what the example does */
  description: string;
}

/** Information about a CLI command */
export interface CommandInfo {
  /** Command name */
  name: string;
  /** Command description */
  description: string;
  /** Usage pattern override (optional) */
  usage?: string;
  /** Available options/flags */
  options?: Array<CommandOption>;
  /** Usage examples */
  examples?: Array<CommandExample>;
  /** Whether this command is AI-safe */
  aiSafe?: boolean;
}

/** Configuration for CLI help system */
export interface CLIHelp {
  /** Name of the CLI tool */
  name: string;
  /** Description of the CLI tool */
  description: string;
  /** Version information */
  version?: string;
  /** Available commands */
  commands: Array<CommandInfo>;
  /** Global options available to all commands */
  globalOptions?: Array<CommandOption>;
}

/** Version information */
export interface VersionInfo {
  /** Version string */
  version: string;
  /** Build timestamp */
  buildTime?: string;
  /** Build commit hash */
  buildCommit?: string;
  /** Additional build metadata */
  buildInfo?: Record<string, string>;
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

/** Format a list of options for display */
export function formatOptions(options: Array<CommandOption>): string {
  if (options.length === 0) return "";

  const maxFlagLength = Math.max(...options.map((opt) => {
    const flagText = opt.alias ? `${opt.flag}, ${opt.alias}` : opt.flag;
    return flagText.length;
  }));

  return options.map((opt) => {
    const flagText = opt.alias ? `${opt.flag}, ${opt.alias}` : opt.flag;
    const padding = " ".repeat(
      Math.max(0, maxFlagLength - flagText.length + 2),
    );
    const defaultText = opt.defaultValue
      ? ` (default: ${opt.defaultValue})`
      : "";
    return `  ${flagText}${padding}${opt.description}${defaultText}`;
  }).join("\n");
}

/** Format a list of commands for display */
export function formatCommandList(commands: Array<CommandInfo>): string {
  if (commands.length === 0) return "";

  const maxNameLength = Math.max(...commands.map((cmd) => cmd.name.length));
  const padding = Math.max(20, maxNameLength + 4);

  return commands.map((cmd) => {
    const nameText = cmd.name.padEnd(padding);
    const aiSafeText = cmd.aiSafe ? " [AI-safe]" : "";
    return `  ${nameText}${cmd.description}${aiSafeText}`;
  }).join("\n");
}

/** Show standardized help for a CLI tool */
export function showHelp(config: CLIHelp, uiOutput: UIOutput = ui): void {
  const usageText = `Usage: ${config.name} <command> [options]`;

  uiOutput.info(usageText);

  if (config.description) {
    uiOutput.info("");
    uiOutput.info(config.description);
  }

  if (config.commands.length > 0) {
    uiOutput.info("");
    uiOutput.info("Commands:");
    uiOutput.info(formatCommandList(config.commands));
  }

  if (config.globalOptions && config.globalOptions.length > 0) {
    uiOutput.info("");
    uiOutput.info("Global Options:");
    uiOutput.info(formatOptions(config.globalOptions));
  }
}

/** Show standardized help for a specific command */
export function showCommandHelp(
  cliName: string,
  command: CommandInfo,
  uiOutput: UIOutput = ui,
): void {
  const usageText = command.usage ||
    `Usage: ${cliName} ${command.name} [options]`;

  uiOutput.info(usageText);

  if (command.description) {
    uiOutput.info("");
    uiOutput.info(command.description);
  }

  if (command.options && command.options.length > 0) {
    uiOutput.info("");
    uiOutput.info("Options:");
    uiOutput.info(formatOptions(command.options));
  }

  if (command.examples && command.examples.length > 0) {
    uiOutput.info("");
    uiOutput.info("Examples:");
    command.examples.forEach((example) => {
      uiOutput.info(`  ${example.command}`);
      uiOutput.info(`    ${example.description}`);
    });
  }
}

/** Show standardized version information */
export function showVersion(
  name: string,
  versionInfo: VersionInfo,
  uiOutput: UIOutput = ui,
): void {
  uiOutput.info(`${name} ${versionInfo.version}`);

  if (versionInfo.buildTime) {
    uiOutput.info(`Built: ${versionInfo.buildTime}`);
  }

  if (versionInfo.buildCommit) {
    uiOutput.info(`Commit: ${versionInfo.buildCommit}`);
  }

  if (versionInfo.buildInfo) {
    Object.entries(versionInfo.buildInfo).forEach(([key, value]) => {
      uiOutput.info(`${key}: ${value}`);
    });
  }
}

/** Standard global options that most CLI tools should support */
export const STANDARD_GLOBAL_OPTIONS: Array<CommandOption> = [
  {
    flag: "--help",
    alias: "-h",
    description: "Show this help message",
  },
  {
    flag: "--version",
    alias: "-v",
    description: "Show version information",
  },
];
