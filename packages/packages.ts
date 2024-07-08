#! /usr/bin/env -S deno run -A

function createWorker(entrypointPath: string) {
  const worker = new Worker(
    import.meta.resolve(entrypointPath),
    { type: "module", name: entrypointPath },
  )
  return worker
}


const entrypointPath = Deno.env.get("BF_ENTRYPOINT");
if (entrypointPath === undefined) {
  throw new Error("Must define BF_ENTRYPOINT environment variable");
}
if (entrypointPath.includes('⚡️')) {
  const entrypointPaths = entrypointPath.split('⚡️');
  for (const entrypointPath of entrypointPaths) {
    createWorker(entrypointPath);
  }
} else {
  createWorker(entrypointPath);
}


// // Listen for SIGTERM signal and log a message
// Deno.addSignalListener("SIGTERM", () => {
//   console.log("SIGTERM signal received. Shutting down.");
// });

// Deno.addSignalListener("SIGINT", () => {
//   console.log("SIGINT signal received. Shutting down.");
// })

// Deno.addSignalListener("SIGHUP", () => {
//   console.log("SIGHUP signal received. Shutting down.");
// })