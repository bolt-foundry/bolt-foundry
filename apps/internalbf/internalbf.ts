#! /usr/bin/env -S deno run --allow-net --allow-env

import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Get port from environment variable or use 5000 as default
const port = Number(Deno.env.get("PORT") ?? 5000);

// Simple request handler
function handleRequest(req: Request): Response {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);
  return new Response("Hello World", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// Start the server
if (import.meta.main) {
  logger.info(`Starting internalbf app on port ${port}`);
  Deno.serve({ port, hostname: "0.0.0.0" }, handleRequest);
}
