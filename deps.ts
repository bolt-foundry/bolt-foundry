// @deno-types="https://esm.sh/v135/@types/react-relay@16.0.6/index.d.ts";
export * as ReactRelay from "react-relay";
// @deno-types="https://esm.sh/v135/@types/relay-runtime@14.1.23/index.d.ts";
import * as RelayRuntime from "relay-runtime";
// @deno-types="https://esm.sh/v135/@types/react@18.2.38/index.d.ts";
import * as React from "react";
export * as rxjs from "https://esm.sh/rxjs@7.8.1";
export { RelayRuntime };
RelayRuntime.RelayFeatureFlags.ENABLE_RELAY_RESOLVERS = true;

// log stuff and random exports

// @deno-types="https://esm.sh/v135/loglevel@1.9.1/index.d.ts";
import log from "https://esm.sh/loglevel@1.9.1";
import chalk from "https://esm.sh/chalk@5.3.0";
import logLevelPrefixPlugin from "https://esm.sh/loglevel-plugin-prefix@0.8.4";
chalk.level = 3;

export { React };

log.setDefaultLevel(log.levels.INFO);

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

if (!isBrowser()) {
  const defaultLogLevelString = Deno.env.get("LOG_LEVEL") ?? "INFO";
  const defaultLogLevel =
    log.levels[defaultLogLevelString as keyof typeof log.levels];
  log.setDefaultLevel(defaultLogLevel);
  logLevelPrefixPlugin.reg(log);
  logLevelPrefixPlugin.apply(log, {
    template: "%n - %l: ",
    levelFormatter(level) {
      const LEVEL = level.toUpperCase() as keyof typeof colors;
      return colors[LEVEL](LEVEL);
    },
    nameFormatter(name) {
      return name || "global";
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
  const relativePathname = url.pathname.split(Deno.cwd())[1];
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

export type Maybe<T> = T | null | undefined;
