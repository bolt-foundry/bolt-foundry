#! /usr/bin/env -S deno run -A

import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

function createWorker(entrypointPath: string) {
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
  };

  // Listen for exit events
  worker.onmessage = (event) => {
    if (event.data === "exit") {
      logger.warn(`Worker for ${entrypointPath} requested exit.`);
      restartWorker();
    }
  };

  return worker;
}

const entrypointPath = Deno.env.get("BF_ENTRYPOINT");
if (entrypointPath === undefined) {
  throw new Error("Must define BF_ENTRYPOINT environment variable");
}
if (entrypointPath.includes("⚡️")) {
  const entrypointPaths = entrypointPath.split("⚡️");
  for (const entrypointPath of entrypointPaths) {
    createWorker(entrypointPath);
  }
} else {
  createWorker(entrypointPath);
}

// Listen for SIGTERM signal and log a message
Deno.addSignalListener("SIGTERM", () => {
  logger.error("SIGTERM signal received. Shutting down.");
});

Deno.addSignalListener("SIGINT", () => {
  logger.error("SIGINT signal received. Shutting down.");
})

Deno.addSignalListener("SIGHUP", () => {
  logger.error("SIGHUP signal received. Shutting down.");
})