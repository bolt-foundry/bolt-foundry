#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net --watch

import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";
import { renderToReadableStream } from "react-dom/server";
import { ServerRenderedPage } from "./server/components/ServerRenderedPage.tsx";
import App from "./src/App.tsx";

const logger = getLogger(import.meta);

// Parse command line arguments
const flags = parseArgs(Deno.args, {
  string: ["port", "mode", "vite-port"],
  default: {
    port: "3000",
    mode: "production",
  },
});

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
    handler: () => {
      const healthInfo = {
        status: "OK",
        timestamp: new Date().toISOString(),
        mode: isDev ? "development" : "production",
        port: port,
        uptime: Math.floor(performance.now() / 1000) + " seconds",
      };
      return new Response(JSON.stringify(healthInfo, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  },
];

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  // Try to match against defined routes
  for (const route of routes) {
    if (route.pattern.test(url)) {
      return await route.handler();
    }
  }

  // In dev mode, proxy to Vite for frontend assets
  if (isDev && vitePort) {
    try {
      const viteUrl =
        `http://localhost:${vitePort}${url.pathname}${url.search}`;
      const viteResponse = await fetch(viteUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      // Create new headers to avoid immutable headers issue
      const headers = new Headers();
      viteResponse.headers.forEach((value, key) => {
        // Skip hop-by-hop headers
        if (
          !["connection", "keep-alive", "transfer-encoding"].includes(
            key.toLowerCase(),
          )
        ) {
          headers.set(key, value);
        }
      });

      return new Response(viteResponse.body, {
        status: viteResponse.status,
        statusText: viteResponse.statusText,
        headers,
      });
    } catch (error) {
      logger.error("Error proxying to Vite:", error);
      return new Response("Error proxying to Vite dev server", {
        status: 502,
      });
    }
  }

  // Handle static assets first
  if (url.pathname.startsWith("/static/")) {
    const staticPath = new URL(import.meta.resolve("./static")).pathname;
    const filePath = url.pathname.replace("/static/", "");
    const fullPath = `${staticPath}/${filePath}`;

    try {
      const file = await Deno.open(fullPath);
      const stat = await file.stat();

      // Determine content type
      let contentType = "application/octet-stream";
      if (filePath.endsWith(".html")) contentType = "text/html";
      else if (filePath.endsWith(".js")) {
        contentType = "application/javascript";
      } else if (filePath.endsWith(".css")) contentType = "text/css";
      else if (filePath.endsWith(".json")) contentType = "application/json";
      else if (filePath.endsWith(".svg")) contentType = "image/svg+xml";
      else if (filePath.endsWith(".png")) contentType = "image/png";
      else if (filePath.endsWith(".ico")) contentType = "image/x-icon";

      return new Response(file.readable, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": stat.size.toString(),
        },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response("Not Found", { status: 404 });
      }
      throw error;
    }
  }

  // API routes should return 404 if not found
  if (url.pathname.startsWith("/api/")) {
    return new Response("Not Found", { status: 404 });
  }

  // For all other routes, render the React app with SSR
  const environment = {
    mode: isDev ? "development" : "production",
    port: port,
  };

  const element = (
    <ServerRenderedPage environment={environment}>
      <App />
    </ServerRenderedPage>
  );

  try {
    const stream = await renderToReadableStream(element);
    return new Response(stream, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    logger.error("Error rendering React app:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

// Start the server
const server = Deno.serve({ port }, handler);

logger.println(`BoltFoundry.com server running at http://localhost:${port}`);
logger.println(`Mode: ${isDev ? "development" : "production"}`);
if (isDev && vitePort) {
  logger.println(
    `Proxying frontend requests to Vite at http://localhost:${vitePort}`,
  );
}

// Wait for server to finish
await server.finished;
