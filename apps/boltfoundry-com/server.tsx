#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net --watch

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { parseArgs } from "@std/cli";
import { getLogger } from "@bolt-foundry/logger";
import { renderToReadableStream } from "react-dom/server";
import { ServerRenderedPage } from "./server/components/ServerRenderedPage.tsx";
import App from "./src/App.tsx";
import { appRoutes, isographAppRoutes } from "./routes.ts";
import { createApiRoutes } from "./apiRoutes.ts";
import { getIsographEnvironment } from "./server/isographEnvironment.ts";

const logger = getLogger(import.meta);

// Types for Vite manifest
interface ViteManifestEntry {
  file: string;
  css?: Array<string>;
}

interface ViteManifest {
  [key: string]: ViteManifestEntry;
}

// Read Vite manifest to get asset paths
async function loadAssetPaths(
  isDev: boolean,
): Promise<{ cssPath?: string; jsPath: string }> {
  if (isDev) {
    // In dev mode, these paths aren't used since Vite handles everything
    const devPaths = {
      cssPath: undefined,
      jsPath: "/dev-not-used", // Vite handles all assets in dev mode
    };
    logger.info("Using dev asset paths (not used - Vite handles everything)");
    return devPaths;
  }

  try {
    const manifestUrl = import.meta.resolve(
      "./static/build/.vite/manifest.json",
    );
    const manifestPath = new URL(manifestUrl).pathname;
    const manifestData = await Deno.readFile(manifestPath);
    const manifestText = new TextDecoder().decode(manifestData);
    const manifest: ViteManifest = JSON.parse(manifestText);

    const entry = manifest["ClientRoot.tsx"];
    if (entry) {
      const jsPath = `/static/build/${entry.file}`;
      const cssPath = entry.css?.[0]
        ? `/static/build/${entry.css[0]}`
        : undefined;

      logger.info(`Loaded assets: CSS=${cssPath || "none"}, JS=${jsPath}`);
      return { cssPath, jsPath };
    }
  } catch (error) {
    logger.warn("Failed to read Vite manifest:", error);
  }

  // Fallback to hardcoded paths
  const fallback = {
    cssPath: undefined,
    jsPath: "/static/build/ClientRoot.js",
  };
  logger.info("Using fallback asset paths");
  return fallback;
}

// Check if a path should be handled by React routing
function shouldHandleWithReact(pathname: string): boolean {
  // Check exact matches first
  if (isographAppRoutes.has(pathname) || appRoutes.has(pathname)) {
    return true;
  }

  // Check for parameterized routes (basic implementation)
  for (const [routePath] of [...isographAppRoutes, ...appRoutes]) {
    if (routePath.includes(":")) {
      // Simple parameterized route matching
      const routePattern = routePath.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(pathname)) {
        return true;
      }
    }
  }

  return false;
}

// Parse command line arguments
const flags = parseArgs(Deno.args, {
  string: ["port", "mode", "vite-port"],
  default: {
    port: "8000",
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

// Load asset paths at startup
const assetPaths = await loadAssetPaths(isDev);

// Create API routes
const apiRoutes = createApiRoutes({ isDev, port });

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  // Try to match against API routes
  for (const route of apiRoutes) {
    if (route.pattern.test(url)) {
      return await route.handler(request);
    }
  }

  // Check if this should be handled by React routing
  if (shouldHandleWithReact(url.pathname)) {
    // In dev mode, let Vite handle all UI routes
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

    // Production mode: Handle with React SSR
    const environment = {
      mode: isDev ? "development" : "production",
      port: port,
      currentPath: url.pathname,
      GOOGLE_OAUTH_CLIENT_ID: getConfigurationVariable(
        "GOOGLE_OAUTH_CLIENT_ID",
      ),
    };

    // Create server-side Isograph environment
    const isographServerEnvironment = getIsographEnvironment(request);

    const element = (
      <ServerRenderedPage environment={environment} assetPaths={assetPaths}>
        <App
          initialPath={url.pathname}
          IS_SERVER_RENDERING
          isographServerEnvironment={isographServerEnvironment}
          mode={environment.mode}
          port={environment.port}
          currentPath={environment.currentPath}
        />
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
  }

  // In dev mode, proxy to Vite for frontend assets (but not React routes)
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
    const filePath = url.pathname.replace("/static/", "");

    try {
      const assetUrl = import.meta.resolve(`./static/${filePath}`);

      // Convert file:// URL to path for Deno.readFile
      const assetPath = new URL(assetUrl).pathname;
      const fileData = await Deno.readFile(assetPath);

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

      return new Response(fileData, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileData.length.toString(),
        },
      });
    } catch {
      logger.error(`❌ Static asset not found: ${filePath}`);
      logger.error(
        `   Resolved URL: ${import.meta.resolve(`./static/${filePath}`)}`,
      );

      // Log what's actually available in the static directory
      try {
        const staticDirUrl = import.meta.resolve("./static");
        const staticDirPath = new URL(staticDirUrl).pathname;
        const entries = [];
        for await (const entry of Deno.readDir(staticDirPath)) {
          entries.push(`${entry.isDirectory ? "DIR" : "FILE"}: ${entry.name}`);
        }
        logger.error(`   Available in static/: ${entries.join(", ")}`);
      } catch (dirError) {
        logger.error(`   Cannot read static directory: ${dirError}`);
      }

      return new Response("Not Found", { status: 404 });
    }
  }

  // API routes should return 404 if not found
  if (url.pathname.startsWith("/api/")) {
    return new Response("Not Found", { status: 404 });
  }

  // For all other unknown routes, return 404
  return new Response("Not Found", { status: 404 });
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
