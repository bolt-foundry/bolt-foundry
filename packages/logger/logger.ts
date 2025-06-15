import log from "loglevel";
import {
  blue,
  cyan,
  dim,
  magenta,
  red,
  stripAnsiCode,
  yellow,
} from "@std/fmt/colors";
import logLevelPrefixPlugin from "loglevel-plugin-prefix";
import { getConfigurationVariable } from "../get-configuration-var/get-configuration-var.ts";

log.setDefaultLevel(log.levels.INFO);

// Global flag to disable all logging
let globalLoggingDisabled = false;

// Functions to control global logging
export function disableAllLogging(): void {
  globalLoggingDisabled = true;
}

export function enableAllLogging(): void {
  globalLoggingDisabled = false;
}

export function isLoggingDisabled(): boolean {
  return globalLoggingDisabled;
}

const colors = {
  TRACE: magenta,
  DEBUG: cyan,
  INFO: blue,
  WARN: yellow,
  ERROR: red,
};

function getCallerInfo() {
  const error = new Error();
  const stack = error.stack?.split("\n");
  if (stack) {
    for (const line of stack) {
      if (
        !line.includes("/node_modules/") &&
        !line.includes("loglevel-plugin-prefix.mjs") &&
        !line.includes("getCallerInfo") &&
        !line.includes("Object.nameFormatter")
      ) {
        const match = line.match(/at (.+):(\d+):(\d+)/);
        if (match) {
          return `:${match[2]}`;
        }
      }
    }
  }
  return "unknown:0";
}

function isBrowser() {
  return typeof Deno === "undefined";
}

// Lazy-loaded debug logger paths
let debugLoggerPaths: Array<string> | null = null;

// Parse debug loggers from environment variable
function getDebugLoggers(): Array<string> {
  if (debugLoggerPaths !== null) {
    return debugLoggerPaths;
  }

  const debugLoggerPathsStr = getConfigurationVariable(
    "ENABLE_SPECIFIC_LOGGERS",
  );

  if (!debugLoggerPathsStr) {
    debugLoggerPaths = [];
    return debugLoggerPaths;
  }

  // Split by comma, semicolon, or space
  debugLoggerPaths = debugLoggerPathsStr
    .split(/[,;\s]+/)
    .map((path) => path.trim())
    .filter((path) => path.length > 0);

  return debugLoggerPaths;
}

// Check if a logger should be set to debug level
function shouldEnableDebugForLogger(loggerName: string): boolean {
  const paths = getDebugLoggers();
  if (paths.length === 0) {
    return false;
  }

  // Check if the logger name matches any pattern in the debug logger paths
  return paths.some((path) => {
    // Exact match
    if (path === loggerName) {
      return true;
    }

    // Wildcard match (e.g., "apps/bfDb/*")
    if (path.endsWith("/*") && loggerName.startsWith(path.slice(0, -2))) {
      return true;
    }

    // Partial path match
    return loggerName.includes(path);
  });
}

// Lazy initialization flag and lock for thread safety
let isLoggerInitialized = false;
let isInitializing = false;

// Initialize logger configuration (thread-safe, synchronous)
function initializeLoggerSync() {
  if (isLoggerInitialized || isBrowser() || isInitializing) {
    return;
  }

  isInitializing = true;
  try {
    const defaultLogLevelString = getConfigurationVariable("LOG_LEVEL") ?? "INFO";
    const defaultLogLevel =
      log.levels[defaultLogLevelString as keyof typeof log.levels];
    log.setDefaultLevel(defaultLogLevel);
    logLevelPrefixPlugin.reg(log);
    logLevelPrefixPlugin.apply(log, {
      template: "%n%l:",
      levelFormatter(level) {
        if (globalLoggingDisabled) return "";
        const LEVEL = level.toUpperCase() as keyof typeof colors;
        return colors[LEVEL](LEVEL);
      },
      nameFormatter(name) {
        if (globalLoggingDisabled) return "";
        const callerInfo = getCallerInfo();
        return `${dim(`↱ ${name || "global"}${callerInfo}\n`)}`;
      },
    });
    isLoggerInitialized = true;
  } finally {
    isInitializing = false;
  }
}

if (!isBrowser()) {
  // Don't initialize at module level - will be done lazily when needed
  // logLevelPrefixPlugin.reg(log);
  // logLevelPrefixPlugin.apply(log, {
  //   template: "%l:",
  //   levelFormatter(level) {
  //     return level.toUpperCase();
  //   },
  //   nameFormatter(name) {
  //     if (name === "github_annotations") return "";
  //     return name ?? "";
  //   },
  //   // Use `_timestamp` so that Deno doesn't warn about unused variable
  //   format(level, name, _timestamp, ...messages) {
  //     if (name === "github_annotations" && level === "error") {
  //       const msg = messages.join(" ");
  //       return `::error::${msg}`;
  //     }
  //     return messages.join(" ");
  //   },
  // });
}

const loggerCache = new Map<string, Logger>();

export function getLogger(importMeta: ImportMeta | string): Logger {
  // Ensure logger is initialized before creating any logger instances
  if (!isLoggerInitialized && !isBrowser()) {
    // Synchronous initialization to avoid breaking API
    initializeLoggerSync();
  }

  let loggerName: string;

  if (typeof importMeta === "string") {
    loggerName = importMeta;
  } else {
    const url = new URL(importMeta.url);
    if (isBrowser()) {
      loggerName = url.pathname;
    } else {
      const relativePathname = url.pathname.split("deno-compile-web/")[1];
      loggerName = relativePathname
        ? relativePathname.replace(/^\//, "")
        : url.pathname;
    }
  }

  if (!loggerCache.has(loggerName)) {
    const newLogger = log.getLogger(loggerName);

    // Set default log level first
    const defaultLogLevelString = getConfigurationVariable("LOG_LEVEL") ??
      "INFO";
    const defaultLogLevel =
      log.levels[defaultLogLevelString as keyof typeof log.levels];
    newLogger.setDefaultLevel(defaultLogLevel);

    // Override with DEBUG level if this specific logger is enabled for debugging
    if (shouldEnableDebugForLogger(loggerName)) {
      newLogger.setLevel(log.levels.DEBUG);
    }

    const extendedLogger = addPrintln(wrapLoggerMethods(newLogger));
    loggerCache.set(loggerName, extendedLogger);
  }

  return loggerCache.get(loggerName)!;
}

// Wrap logger methods to check global disable flag
function wrapLoggerMethods(logger: log.Logger): log.Logger {
  const originalMethods = {
    trace: logger.trace.bind(logger),
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
  };

  logger.trace = (...args: Array<unknown>) => {
    if (!globalLoggingDisabled) originalMethods.trace(...args);
  };
  logger.debug = (...args: Array<unknown>) => {
    if (!globalLoggingDisabled) originalMethods.debug(...args);
  };
  logger.info = (...args: Array<unknown>) => {
    if (!globalLoggingDisabled) originalMethods.info(...args);
  };
  logger.warn = (...args: Array<unknown>) => {
    if (!globalLoggingDisabled) originalMethods.warn(...args);
  };
  logger.error = (...args: Array<unknown>) => {
    if (!globalLoggingDisabled) originalMethods.error(...args);
  };

  return logger;
}

export type Logger = log.Logger & {
  println: (message: string, stripColors?: boolean) => void;
  printErr: (message: string, stripColors?: boolean) => void;
};

function addPrintln(logger: log.Logger): Logger {
  const extendedLogger = logger as Logger;

  extendedLogger.println = (message: string, stripColors = false) => {
    const output = stripColors ? stripAnsiCode(message) : message;
    // deno-lint-ignore no-console
    console.log(output);
  };

  extendedLogger.printErr = (message: string, stripColors = false) => {
    const output = stripColors ? stripAnsiCode(message) : message;
    // deno-lint-ignore no-console
    console.error(output);
  };

  return extendedLogger;
}

export { default as startSpinner } from "./terminalSpinner.ts";
