#! /usr/bin/env -S deno run --allow-net --allow-env

import { getLogger } from "packages/logger/logger.ts";
import { handleDesksRequest } from "../desks/desks.ts";
import { setupThanksBot } from "../thanksbot/thanksbot.ts";

const logger = getLogger(import.meta);

// Get port from environment variable or use 5000 as default
const port = Number(Deno.env.get("PORT") ?? 5000);

// Request handler
function handleRequest(req: Request): Response {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);

  // Parse the URL to get the pathname
  const url = new URL(req.url);
  const path = url.pathname;

  // Route /desks requests to the Desks application
  if (path.startsWith("/desks")) {
    return handleDesksRequest(req);
  }

  // Default response for other routes
  return new Response("Hello World", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// Start the server and ThanksBot
if (import.meta.main) {
  logger.info(`Starting internalbf app on port ${port}`);
  // Start ThanksBot in the background
  setupThanksBot();
  // Start the HTTP server
  Deno.serve({ port, hostname: "0.0.0.0" }, handleRequest);
}
