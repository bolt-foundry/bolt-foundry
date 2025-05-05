import log from "loglevel";
import chalk from "chalk";
import logLevelPrefixPlugin from "loglevel-plugin-prefix";
import { getConfigurationVariable } from "../get-configuration-var/get-configuration-var.ts";
chalk.level = 3;

log.setDefaultLevel(log.levels.INFO);

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
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

// Parse debug loggers from environment variable
function getDebugLoggers(): string[] {
  const debugLoggerPaths = getConfigurationVariable("ENABLE_SPECIFIC_LOGGERS");

  if (!debugLoggerPaths) {
    return [];
  }

  // Split by comma, semicolon, or space
  return debugLoggerPaths
    .split(/[,;\s]+/)
    .map((path) => path.trim())
    .filter((path) => path.length > 0);
}

// Store the list of debug-enabled logger paths
const debugLoggerPaths = getDebugLoggers();

// Check if a logger should be set to debug level
function shouldEnableDebugForLogger(loggerName: string): boolean {
  if (debugLoggerPaths.length === 0) {
    return false;
  }

  // Check if the logger name matches any pattern in the debug logger paths
  return debugLoggerPaths.some((path) => {
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

if (!isBrowser()) {
  const defaultLogLevelString = getConfigurationVariable("LOG_LEVEL") ?? "INFO";
  const defaultLogLevel =
    log.levels[defaultLogLevelString as keyof typeof log.levels];
  log.setDefaultLevel(defaultLogLevel);
  logLevelPrefixPlugin.reg(log);
  logLevelPrefixPlugin.apply(log, {
    template: "%n%l:",
    levelFormatter(level) {
      const LEVEL = level.toUpperCase() as keyof typeof colors;
      return colors[LEVEL](LEVEL);
    },
    nameFormatter(name) {
      const callerInfo = getCallerInfo();
      return `${chalk.dim(`↱ ${name || "global"}${callerInfo}\n`)}`;
    },
  });

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

const loggerCache = new Map<string, log.Logger>();

export function getLogger(importMeta: ImportMeta | string): log.Logger {
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
    const defaultLogLevelString = getConfigurationVariable("LOG_LEVEL")
      ? getConfigurationVariable("LOG_LEVEL")
      : "INFO";
    const defaultLogLevel =
      log.levels[defaultLogLevelString as keyof typeof log.levels];
    newLogger.setDefaultLevel(defaultLogLevel);

    // Override with DEBUG level if this specific logger is enabled for debugging
    if (shouldEnableDebugForLogger(loggerName)) {
      newLogger.setLevel(log.levels.DEBUG);
    }

    loggerCache.set(loggerName, newLogger);
  }

  return loggerCache.get(loggerName)!;
}

export type Logger = log.Logger;
