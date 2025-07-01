#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net --watch

import type { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Parse command line arguments
const flags = parseArgs(Deno.args, {
  string: ["port", "mode", "vite-port"],
  boolean: ["help"],
  default: {
    port: "3000",
    mode: "production",
  },
});

if (flags.help) {
  logger.println(`Usage: boltFoundry.com server [OPTIONS]

Bolt Foundry landing page server

Options:
  --port             Specify server port (default: 3000)
  --mode             Server mode: development or production (default: production)  
  --vite-port        Vite dev server port (development mode only)
  --help             Show this help message

Examples:
  ./boltFoundry-com                                    # Run production server on port 3000
  ./boltFoundry-com --port 4000                        # Run on port 4000
  ./boltFoundry-com --mode development --vite-port 5000 # Development mode with Vite proxy`);
  Deno.exit(0);
}

const port = parseInt(flags.port);
if (isNaN(port)) {
  logger.printErr(`Invalid port: ${flags.port}`);
  Deno.exit(1);
}

const isDev = flags.mode === "development";
const vitePort = flags["vite-port"] ? parseInt(flags["vite-port"]) : undefined;

// Define routes using URLPattern
const routes = [
  {
    pattern: new URLPattern({ pathname: "/health" }),
    handler: async (_request: Request) => {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  },
];

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  
  // Check for matching routes
  for (const route of routes) {
    if (route.pattern.test(url)) {
      return await route.handler(request);
    }
  }

  // In development mode, proxy to Vite dev server
  if (isDev && vitePort) {
    try {
      const viteUrl = `http://localhost:${vitePort}${url.pathname}${url.search}`;
      const response = await fetch(viteUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      return response;
    } catch (error) {
      logger.error("Failed to proxy to Vite dev server:", error);
      return new Response("Vite dev server not available", { status: 502 });
    }
  }

  // In production mode, serve static files
  try {
    const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
    const fullPath = new URL(import.meta.resolve(`./dist${filePath}`)).pathname;
    
    try {
      const file = await Deno.readFile(fullPath);
      const ext = filePath.split('.').pop() || '';
      const contentType = getContentType(ext);
      
      return new Response(file, {
        headers: { "Content-Type": contentType },
      });
    } catch {
      // If file not found, serve index.html for SPA routing
      if (filePath !== "/index.html") {
        const indexPath = new URL(import.meta.resolve("./dist/index.html")).pathname;
        const indexFile = await Deno.readFile(indexPath);
        return new Response(indexFile, {
          headers: { "Content-Type": "text/html" },
        });
      }
      throw new Error("Index file not found");
    }
  } catch (error) {
    logger.error("Failed to serve static file:", error);
    return new Response("File not found", { status: 404 });
  }
};

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
  };
  return types[ext] || 'application/octet-stream';
}

// Start the server
logger.println(`Starting boltFoundry.com server on http://localhost:${port}`);
logger.println(`Mode: ${isDev ? "development" : "production"}`);
if (isDev && vitePort) {
  logger.println(`Proxying to Vite dev server on port ${vitePort}`);
}

Deno.serve({ port }, handler);
