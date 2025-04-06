#! /usr/bin/env -S deno run --allow-net --allow-env

import { getLogger } from "../../packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Desks v0.1 - Simple Hello World handler
 *
 * This implementation provides a basic handler for the /desks route
 * that returns a hello world message.
 */
export function handleDesksRequest(req: Request): Response {
  logger.info(`[Desks] Handling request: ${req.url}`);

  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Desks v0.1</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
          }
          h1 {
            color: #333;
          }
          .version {
            color: #666;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to Desks</h1>
        <p>This is the initial implementation (v0.1) of the Desks application.</p>
        <p>Desks provides persistent video communication spaces optimized for iPad.</p>
        <p class="version">Version: 0.1</p>
      </body>
    </html>
  `,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    },
  );
}
