#! /usr/bin/env -S deno run --allow-net=localhost,0.0.0.0,127.0.0.1 --allow-env --allow-read --allow-run=sl,op

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { toolRoutes } from "@bfmono/apps/boltFoundry/routes.ts";
import { addTools } from "@bfmono/infra/bff/tools.ts";
import type { Handler } from "@bfmono/apps/web/web.tsx";
import { renderToString } from "react-dom/server";
import * as React from "react";
import { matchRouteWithParams } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";

const logger = getLogger(import.meta);

const routes = new Map<string, Handler>();

// Add tool routes
addTools(routes);
for (const entry of toolRoutes.entries()) {
  const [path, { Component }] = entry;

  const nextUrl = renderToString(React.createElement(Component));
  routes.set(path, async function ToolRoute(_req, routeParams) {
    const ENVIRONMENT = {
      nextUrl,
      routeParams,
    };
    const extensionPath = import.meta.resolve(
      "infra/replit-extension/extension.js",
    );
    const extensionCode = await Deno.readTextFile(
      new URL(extensionPath),
    );

    return new Response(
      `
      <!DOCTYPE html>
      <body>
        <div class="updatable">
        not yet
        </div>
        <script>
        window.ENVIRONMENT = ${JSON.stringify(ENVIRONMENT)};
        </script>
        <script type="module">
        ${extensionCode}
        </script>
      </body>
      </html>
    `,
      { headers: { "content-type": "text/html" } },
    );
  });
}

function matchRoute(pathWithParams: string): [Handler, Record<string, string>] {
  const match = matchRouteWithParams(pathWithParams);
  const matchedHandler = routes.get(match.pathTemplate);
  const routeParams = match.routeParams;

  return [matchedHandler || proxyRoute || defaultRoute, routeParams];
}

const proxyRoute: Handler = async (req: Request): Promise<Response> => {
  // Check if GitHub code file exists
  try {
    await Deno.readTextFile("./tmp/ghcode");
    // If the file exists, return the default route response
    return defaultRoute();
  } catch {
    // File doesn't exist, proceed with proxy
    const url = new URL(req.url);
    url.hostname = "localhost"; // replace with the hostname of the target server
    url.port = "8000"; // replace with the port of the target server
    try {
      const response = await fetch(url.toString(), {
        method: req.method,
        headers: req.headers,
        body: req.method !== "GET" && req.method !== "HEAD"
          ? req.body
          : undefined,
        redirect: "manual",
      });
      logger.debug(response);
      return response;
    } catch (_) {
      // If the proxy doesn't respond, show "backend hasn't responded" page
      return backendNotRespondingPage(req);
    }
  }
};

function backendNotRespondingPage(req: Request) {
  const incomingUrl = new URL(req.url);
  const baseRetry = 1000;
  const maxRetry = 10000;
  const retryParam = incomingUrl.searchParams.get("retry");
  const currentRetry = Math.min(
    retryParam ? parseInt(retryParam, 10) : baseRetry,
    maxRetry,
  );
  const currentRetrySec = (currentRetry / 1000).toFixed(1);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Backend not responding</title>
    </head>
    <body style="font-family: sans-serif; margin: 20px;">
      <h3>Backend hasn't responded. Trying again in ${currentRetrySec}s...</h3>
      <script>
        (function() {
          setTimeout(() => {
            const url = new URL(window.location.href);
            const path = url.pathname + url.search.replace(/[?&]retry=\d+/, '');
            fetch(url.pathname)
              .then(response => {
                if (response.ok) {
                  window.location.href = path;
                } else {
                  const nextRetry = Math.min(${currentRetry} * 1.5, ${maxRetry});
                  const separator = path.includes('?') ? '&' : '?';
                  window.location.href = path + separator + 'retry=' + nextRetry;
                }
              })
              .catch(() => {
                const nextRetry = Math.min(${currentRetry} * 1.5, ${maxRetry});
                const separator = path.includes('?') ? '&' : '?';
                window.location.href = path + separator + 'retry=' + nextRetry;
              });
          }, ${currentRetry});
        })();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}

const defaultRoute = async () => {
  let githubCode = "";
  try {
    githubCode = await Deno.readTextFile("./tmp/ghcode");
  } catch {
    // File doesn't exist, ignore
  }

  const githubCodeHtml = githubCode
    ? `
    <div style="position: fixed; top: 10px; right: 10px; background: #f0f0f0; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p>GitHub Device Code: <strong>${githubCode}</strong></p>
      <button onclick="navigator.clipboard.writeText('${githubCode}').then(() => { this.textContent = 'Copied!'; setTimeout(() => { this.textContent = 'Click to Copy Code'; }, 2000); });" style="margin: 10px 0; padding: 5px 10px; border-radius: 3px; border: 1px solid #ccc; cursor: pointer;">
        Click to Copy Code
      </button><br>
      <a href="https://github.com/login/device" target="_blank" style="color: #0366d6; text-decoration: none;">
        Click here to complete GitHub login
      </a>
    </div>
  `
    : "";

  return new Response(githubCodeHtml, {
    headers: { "content-type": "text/html" },
  });
};

const port = 9999;

if (import.meta.main) {
  Deno.serve({ port }, async (req) => {
    const timer = performance.now();
    try {
      const incomingUrl = new URL(req.url);
      const [matchedHandler, routeParams] = matchRoute(incomingUrl.pathname);
      const res = await matchedHandler(req, routeParams);
      const perf = performance.now() - timer;
      const perfInMs = Math.round(perf);
      logger.debug(
        `[${
          new Date().toISOString()
        }] [${req.method}] ${res.status} ${incomingUrl} ${
          req.headers.get("content-type")
        } (${perfInMs}ms)`,
      );
      return res;
    } catch (err) {
      logger.error("Error handling request:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  });
}
