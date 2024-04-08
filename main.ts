#! /usr/bin/env -S deno run -A
import { clientRenderer } from "packages/clientRenderer/clientRenderer.ts";
import { log } from "deps.ts";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: true,
    }),
  },
});

enum DeploymentTypes {
  "WEB" = "WEB",
  "WORKER" = "WORKER",
}
type Environment = Record<string, never>;
type Handler = (
  request: Request,
  environment: Record<string, unknown>,
) => Promise<Response> | Response;

const routes = new Map<string, Handler>();

routes.set("/", clientRenderer);

routes.set("/resources/style.css", async () => {
  const url = new URL(import.meta.resolve("resources/style.css"));
  const style = await Deno.readTextFile(url);
  return new Response(style, {
    headers: {
      "content-type": "text/css",
    },
  });
});

const defaultRoute = () => {
  return new Response("Not found", { status: 404 });
};

const deploymentType = Deno.env.get("DEPLOYMENT_TYPE") ??
  DeploymentTypes.WORKER;

if (deploymentType === DeploymentTypes.WEB) {
  Deno.serve(async (req) => {
    const logger = log
    const incomingUrl = new URL(req.url);
    logger.info(
      `Incoming request: ${req.method} ${incomingUrl.pathname}`,
    );
    const handler = routes.get(incomingUrl.pathname) ?? defaultRoute;
    const environment = {};
    return await handler(req, environment);
  });
}

// import { clientRenderer } from "packages/clientRenderer/main.replit.ts";
// import { startupBackend } from "packages/events/mod.ts";

// routes.set("/", clientRenderer);

// function defaultRoute(request: Request) {
//   return new Response("Hello World!");
// }

// Deno.serve(async (req) => {
//   const headers = req.headers;
//   const isWebsocket = headers.get("Upgrade") === "websocket";
//   const url = new URL(req.url);
//   const path = url.pathname;
//   const handler = routes.get(path);
//   const environment = {};
//   await startupBackend();
//   if (handler) {
//     return await handler(req, environment);
//   }

//   return defaultRoute(req);
// });
