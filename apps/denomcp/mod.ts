#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

import { MCPServer } from "./mcp-server.ts";

// Handle graceful shutdown
let server: MCPServer | null = null;

async function shutdown() {
  if (server) {
    await server.close();
  }
  Deno.exit(0);
}

// Register signal handlers
Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);

// Start server
try {
  server = new MCPServer();
  await server.start();
} catch (e) {
  console.error("Failed to start MCP server:", e);
  Deno.exit(1);
}
