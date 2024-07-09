#! /usr/bin/env -S deno run -A
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
type Handler = (
  request: Request,
) => Promise<Response> | Response;

const routes = new Map<string, Handler>();

routes.set("/bff", () => {
  return new Response("hi", {
    headers: {
      "content-type": "text/html",
    },
  });
});

routes.set("/extension.json", async () => {
  const ext = await Deno.readTextFile("extension.json");
  return new Response(ext, {
    headers: {
      "content-type": "application/json",
    },
  });
});

const defaultRoute = () => {
  return new Response("Not found", { status: 404 });
};

Deno.serve(async (req) => {
  const incomingUrl = new URL(req.url);
  logger.info(
    `Incoming request: ${req.method} ${incomingUrl.pathname}`,
  );
  const handler = routes.get(incomingUrl.pathname) ?? defaultRoute;
  return await handler(req);
});
