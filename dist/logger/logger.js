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
function getDebugLoggers() {
  const debugLoggerPaths2 = getConfigurationVariable("ENABLE_DEBUG_LOGGER");
  if (!debugLoggerPaths2) {
    return [];
  }
  return debugLoggerPaths2.split(/[,;\s]+/).map((path) => path.trim()).filter((
    path,
  ) => path.length > 0);
}
const debugLoggerPaths = getDebugLoggers();
function shouldEnableDebugForLogger(loggerName) {
  if (debugLoggerPaths.length === 0) {
    return false;
  }
  return debugLoggerPaths.some((path) => {
    if (path === loggerName) {
      return true;
    }
    if (path.endsWith("/*") && loggerName.startsWith(path.slice(0, -2))) {
      return true;
    }
    return loggerName.includes(path);
  });
}
if (!isBrowser()) {
  const defaultLogLevelString = getConfigurationVariable("LOG_LEVEL") ?? "INFO";
  const defaultLogLevel = log.levels[defaultLogLevelString];
  log.setDefaultLevel(defaultLogLevel);
  logLevelPrefixPlugin.reg(log);
  logLevelPrefixPlugin.apply(log, {
    template: "%n%l:",
    levelFormatter(level) {
      const LEVEL = level.toUpperCase();
      return colors[LEVEL](LEVEL);
    },
    nameFormatter(name) {
      const callerInfo = getCallerInfo();
      return `${
        chalk.dim(`\u21B1 ${name || "global"}${callerInfo}
`)
      }`;
    },
  });
}
const loggerCache = /* @__PURE__ */ new Map();
function getLogger(importMeta) {
  let loggerName;
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
    const defaultLogLevelString = getConfigurationVariable("LOG_LEVEL") ??
      "INFO";
    const defaultLogLevel = log.levels[defaultLogLevelString];
    newLogger.setDefaultLevel(defaultLogLevel);
    if (shouldEnableDebugForLogger(loggerName)) {
      newLogger.setLevel(log.levels.DEBUG);
    }
    loggerCache.set(loggerName, newLogger);
  }
  return loggerCache.get(loggerName);
}
export { getLogger };
