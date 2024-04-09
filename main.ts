#! /usr/bin/env -S deno run -A
import { clientRenderer } from "packages/clientRenderer/clientRenderer.ts";
import * as log from "std/log/mod.ts";
import { routes as appRoutes } from "packages/client/components/App.tsx";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: true,
    }),
    ["bffEsbuild.ts"]: new log.ConsoleHandler("DEBUG", {
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

for (const entry of appRoutes.entries()) {
  const [path] = entry;
  routes.set(path, clientRenderer);
}

routes.set("/resources/style.css", async () => {
  const url = new URL(import.meta.resolve("resources/style.css"));
  const style = await Deno.readTextFile(url);
  return new Response(style, {
    headers: {
      "content-type": "text/css",
    },
  });
});

routes.set("/build/Client.js", async () => {
  const url = new URL(import.meta.resolve("build/Client.js"));
  const style = await Deno.readTextFile(url);
  return new Response(style, {
    headers: {
      "content-type": "application/javascript",
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
    const logger = log;
    const incomingUrl = new URL(req.url);
    logger.info(
      `Incoming request: ${req.method} ${incomingUrl.pathname}`,
    );
    const handler = routes.get(incomingUrl.pathname) ?? defaultRoute;
    return await handler(req);
  });
}
