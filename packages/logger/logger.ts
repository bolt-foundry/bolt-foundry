// log stuff and random exports

import log from "loglevel";
import chalk from "chalk";
import logLevelPrefixPlugin from "loglevel-plugin-prefix";
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
    // Iterate through the stack to find the first valid call from user code
    for (let i = 0; i < stack.length; i++) {
      const line = stack[i];
      if (
        !line.includes("/node_modules/") && // Skip over node_module calls
        !line.includes("loglevel-plugin-prefix.mjs") &&  // Skip logging library
        !line.includes("getCallerInfo") &&  // Ignore utility function
        !line.includes("Object.nameFormatter") // Skip inside logger formatting
      ) {
        const match = line.match(/at (.+):(\d+):(\d+)/);
        if (match) {
          // Return the line number
          return `:${match[2]}`;
        }
      }
    }
  }

  return "unknown:0";
}

if (!isBrowser()) {
  const defaultLogLevelString = Deno.env.get("LOG_LEVEL") ?? "INFO";
  const defaultLogLevel =
    log.levels[defaultLogLevelString as keyof typeof log.levels];
  log.setDefaultLevel(defaultLogLevel);
  logLevelPrefixPlugin.reg(log);
  let previousPath = "";
  logLevelPrefixPlugin.apply(log, {
    template: "%n%l:",
    levelFormatter(level) {
      const LEVEL = level.toUpperCase() as keyof typeof colors;
      return colors[LEVEL](LEVEL);
    },
    nameFormatter(name) {
      const callerInfo = getCallerInfo();
      const currentPath = `${name || "global"}${callerInfo}`;
      if (currentPath !== previousPath) {
        previousPath = currentPath;
        return chalk.dim(`↱ ${currentPath}\n`);
      }
      return "";
    },
    timestampFormatter(date) {
      return date.toISOString();
    },
  });
}

export function isBrowser() {
  return typeof Deno === "undefined";
}

export function getLogger(importMeta: ImportMeta | string) {
  if (typeof importMeta === "string") {
    return log.getLogger(importMeta);
  }
  const url = new URL(importMeta.url);
  if (isBrowser()) {
    return log.getLogger(url.pathname);
  }
  // get relative url and remove leading slash
  const relativePathname = url.pathname.split(Deno.env.get("BF_PATH") ?? "")[1];
  const pathName = relativePathname
    ? relativePathname.replace(/^\//, "")
    : url.pathname;
  const logger = log.getLogger(pathName);
  const defaultLogLevelString = Deno.env.get("LOG_LEVEL") ?? "INFO";
  const defaultLogLevel =
    log.levels[defaultLogLevelString as keyof typeof log.levels];
  logger.setDefaultLevel(defaultLogLevel);
  return logger;
}

