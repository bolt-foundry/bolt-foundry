#! /usr/bin/env -S deno run -A

import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
const isDevelopment = Deno.env.get("BF_ENV") === "DEVELOPMENT";
const isNotDevelopment = !isDevelopment;
export const MULTIPLE_SCRIPT_SEPARATOR = "⚡️";

export function createWorker(entrypointPath: string) {
  function restartWorker() {
    logger.warn(`Worker for ${entrypointPath} exited. Restarting...`);
    createWorker(entrypointPath);
  }

  const worker = new Worker(
    import.meta.resolve(entrypointPath),
    { type: "module", name: entrypointPath },
  );

  // Listen for error events
  worker.onerror = (event) => {
    logger.error(`Worker error in ${entrypointPath}:`, event.message);
    restartWorker();
    // stop the worker from crashing the main thread in non dev environments
    if (isNotDevelopment) {
      event.preventDefault();
    }
  };

  return worker;
}

if (import.meta.main) {
  const entrypointPath = Deno.env.get("BF_ENTRYPOINT");
  if (entrypointPath === undefined) {
    throw new Error("Must define BF_ENTRYPOINT environment variable");
  }
  if (entrypointPath.includes(MULTIPLE_SCRIPT_SEPARATOR)) {
    const entrypointPaths = entrypointPath.split(MULTIPLE_SCRIPT_SEPARATOR);
    for (const entrypointPath of entrypointPaths) {
      createWorker(entrypointPath);
    }
  } else {
    createWorker(entrypointPath);
  }
}

// Listen for SIGTERM signal and log a message
if (isNotDevelopment) {
  Deno.addSignalListener("SIGTERM", () => {
    logger.error("SIGTERM signal received. Shutting down.");
  });

  Deno.addSignalListener("SIGINT", () => {
    logger.error("SIGINT signal received. Shutting down.");
  });

  Deno.addSignalListener("SIGHUP", () => {
    logger.error("SIGHUP signal received. Shutting down.");
  });
}
