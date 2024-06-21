export const LOG_LEVELS = [
  "verbose",
  "debug",
  "info",
  "warn",
  "error",
] as const;

function getEnvironmentVariable(envVar: string) {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(envVar);
  }
  return localStorage.getItem(envVar);
}

function setEnvironmentVariable(envVar: string, value: string) {
  if (typeof Deno !== "undefined") {
    return Deno.env.set(envVar, value);
  }
  return localStorage.setItem(envVar, value);
}

function getActiveLoggers() {
  const activeLoggers = getEnvironmentVariable("LOGGERS");
  if (activeLoggers) {
    return activeLoggers.split(",");
  }
  return [];
}

function getSiliencedLoggers() {
  const silencedLoggers = getEnvironmentVariable("SILENCED_LOGGERS");
  if (silencedLoggers) {
    return silencedLoggers.split(",");
  }
  return [];
}

function isLoggerActive(name: string) {
  const silencedLoggers = getSiliencedLoggers();
  if (silencedLoggers.includes(name)) {
    return false;
  }
  const activeLoggers = getActiveLoggers();
  if (activeLoggers.length === 0) {
    return true;
  }
  return activeLoggers.includes(name);
}

export function activateLogger(name: string) {
  const activeLoggers = getActiveLoggers();
  if (activeLoggers.includes(name)) {
    return;
  }
  activeLoggers.push(name);
  setEnvironmentVariable("LOGGERS", activeLoggers.join(","));
}

export function deactivateLogger(name: string) {
  const activeLoggers = getActiveLoggers();
  if (!activeLoggers.includes(name)) {
    return;
  }
  const index = activeLoggers.indexOf(name);
  activeLoggers.splice(index, 1);
  setEnvironmentVariable("LOGGERS", activeLoggers.join(","));
}

export function setLogLevel(logLevel: LogLevel) {
  setEnvironmentVariable("LOG_LEVEL", logLevel);
}

export function silenceLogger(name: string) {
  const silencedLoggers = getSiliencedLoggers();
  if (silencedLoggers.includes(name)) {
    return;
  }
  silencedLoggers.push(name);
  setEnvironmentVariable("SILENCED_LOGGERS", silencedLoggers.join(","));
}

export function unsilenceLogger(name: string) {
  const silencedLoggers = getSiliencedLoggers();
  if (!silencedLoggers.includes(name)) {
    return;
  }
  const index = silencedLoggers.indexOf(name);
  silencedLoggers.splice(index, 1);
  setEnvironmentVariable("SILENCED_LOGGERS", silencedLoggers.join(","));
}

type LogLevel = typeof LOG_LEVELS[number];
const defaultLogLevel = getEnvironmentVariable("IS_LOCAL_DEVSERVER")
  ? "debug"
  : "info";
const activeLogLevel =
  (getEnvironmentVariable("LOG_LEVEL") ?? defaultLogLevel) as LogLevel;

if (activeLogLevel === "verbose") {
  // deno-lint-ignore no-console
  console.log("Active BFLog level", activeLogLevel);
  // deno-lint-ignore no-console
  console.log(
    "Active BFLog loggers",
    getActiveLoggers().length > 0 ? getActiveLoggers() : "all",
  );
  // deno-lint-ignore no-console
  console.log(
    "Silenced BFLog loggers",
    getSiliencedLoggers().length > 0 ? getSiliencedLoggers() : "none",
  );
}

export function createBfLogger(importMeta: ImportMeta, logLevel: LogLevel) {
  let bfRootPath = "/app";
  if (typeof Deno !== "undefined") {
    bfRootPath = Deno.env.get("BFF_ROOT") ?? "/app";
  }
  const filename = importMeta.filename ?? importMeta.url;
  const bfRelativePath = filename.replace(bfRootPath, "").replace(
    "file://",
    "",
  );
  return createLogger(bfRelativePath, logLevel);
}

export function createLogger(loggerName: string, logLevel: LogLevel) {
  return (...args: unknown[]) => {
    const activeLogLevel =
      (getEnvironmentVariable("LOG_LEVEL") ?? defaultLogLevel) as LogLevel;

    const loggerMessage = `BFLOG(${loggerName} - ${logLevel}):`;

    // take args and put them all on one line
    const singleLineArgs = args.map((arg) => {
      if (typeof arg === "object") {
        return JSON.stringify(arg);
      }
      return arg;
    }).join(`\\n`);
    if (logLevel === "error") {
      // deno-lint-ignore no-console
      console.error(loggerMessage, singleLineArgs);
      return;
    }
    if (logLevel === "warn") {
      // deno-lint-ignore no-console
      console.warn(loggerMessage, singleLineArgs);
      return;
    }
    if (isLoggerActive(loggerName)) {
      const shouldLog =
        LOG_LEVELS.indexOf(logLevel) >= LOG_LEVELS.indexOf(activeLogLevel);
      if (!shouldLog) {
        return;
      }
      // deno-lint-ignore no-console
      console.log(loggerMessage, singleLineArgs);
    }
  };
}

export function createMetricLogger(loggerName: string, logLevel: LogLevel) {
  return (
    tag: string,
    properties: Record<string, string | number | Array<string | number>>,
  ) => {
    const activeLogLevel =
      (getEnvironmentVariable("LOG_LEVEL") ?? defaultLogLevel) as LogLevel;

    const metricMessage = JSON.stringify({
      ...properties,
      tag,
      loggerName,
      logLevel,
      service: getEnvironmentVariable("AWS_LAMBDA_FUNCTION_NAME"),
      metric: true,
    });
    if (logLevel === "error") {
      // deno-lint-ignore no-console
      console.error(metricMessage);
      return;
    }
    if (logLevel === "warn") {
      // deno-lint-ignore no-console
      console.warn(metricMessage);
      return;
    }
    if (isLoggerActive(loggerName)) {
      const shouldLog =
        LOG_LEVELS.indexOf(logLevel) >= LOG_LEVELS.indexOf(activeLogLevel);
      if (!shouldLog) {
        return;
      }
      // deno-lint-ignore no-console
      console.log(metricMessage);
    }
  };
}

// @ts-expect-error #techdebt
globalThis.BF = {
  activateLogger,
  deactivateLogger,
  setLogLevel,
};
