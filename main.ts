#! /usr/bin/env -S deno run -A
import { clientRenderer } from "packages/clientRenderer/clientRenderer.ts";
import { getLogger } from "deps.ts";
import { routes as appRoutes } from "packages/client/components/App.tsx";
import { handler as graphQlHandler } from "packages/graphql/graphql.ts";
import { getGoogleOauthUrl } from "lib/googleOauth.ts";

const logger = getLogger(import.meta);
enum DeploymentTypes {
  "WEB" = "WEB",
  "WORKER" = "WORKER",
}
type Handler = (
  request: Request,
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

routes.set("/google/oauth/start", (req) => {
  const redirectable = getGoogleOauthUrl(req);
  // create temporary redirect response 302
  return new Response(null, {
    status: 302,
    headers: {
      location: redirectable,
    },
  })
})

routes.set("/google/oauth/end", (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get("code");
  const body = `<html><body><script>window.opener.resolveGoogleAuth("${code}")</script></body></html>`;
  return new Response(body, {
    headers: {
      "content-type": "text/html",
    }
  });
});


routes.set("/graphql", graphQlHandler);

const defaultRoute = () => {
  return new Response("Not found", { status: 404 });
};

const deploymentType = Deno.env.get("DEPLOYMENT_TYPE") ??
  DeploymentTypes.WORKER;

if (deploymentType === DeploymentTypes.WEB) {
  Deno.serve(async (req) => {
    const incomingUrl = new URL(req.url);
    logger.info(
      `Incoming request: ${req.method} ${incomingUrl.pathname}`,
    );
    const handler = routes.get(incomingUrl.pathname) ?? defaultRoute;
    return await handler(req);
  });
}
