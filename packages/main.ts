#! /usr/bin/env -S deno run -A
import { clientRenderer } from "packages/clientRenderer/clientRenderer.ts";
import { getLogger } from "deps.ts";
import { routes as appRoutes } from "packages/client/components/App.tsx";
import { handler as graphQlHandler } from "packages/graphql/graphql.ts";
import { getGoogleOauthUrl } from "lib/googleOauth.ts";

const logger = getLogger(import.meta);
export enum DeploymentTypes {
  "WEB" = "WEB",
  "WORKER" = "WORKER",
  "DEVELOPMENT" = "DEVELOPMENT",
}

export enum DeploymentEnvs {
  "DEVELOPMENT" = "DEVELOPMENT",
  "STAGING" = "STAGING",
  "PRODUCTION" = "PRODUCTION",
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

routes.set("/login", async (...args) => {
  const deploymentEnvironment = Deno.env.get("BF_ENV") ?? "DEVELOPMENT";
  const redirectDomain = Deno.env.get("BF_AUTH_REDIRECT_DOMAIN") ??
    "boltfoundry.wtf";
  const [req] = args;
  const url = new URL(req.url);
  const hostname = url.hostname;
  const credential = url.searchParams.get("credential");
  if (credential) {
    return clientRenderer(...args);
  }

  switch (deploymentEnvironment) {
    case DeploymentEnvs.DEVELOPMENT: {
      return new Response(null, {
        status: 302,
        headers: {
          location: `https://${redirectDomain}/login?hostname=${hostname}`,
        },
      });
    }
  }

  return clientRenderer(...args);
});

routes.set("/google/oauth/start", (_req) => {
  const redirectable = getGoogleOauthUrl();
  // create temporary redirect response 302
  return new Response(null, {
    status: 302,
    headers: {
      location: redirectable,
    },
  });
});



routes.set("/google/oauth/end", (req) => {
  const deploymentEnvironment = Deno.env.get("BF_ENV") ?? "DEVELOPMENT";
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const body = `<html><body><script>
    window.addEventListener("message", (event) => {
      if (event.data === "close") {
        window.close();
      }
    });
    window.opener.postMessage(
      JSON.stringify({
        code: "${code}",
      }),
      "*",
    );
    </script></body></html>`;
  const headers: Record<string, string> = {
    "content-type": "text/html",
  }
  if (deploymentEnvironment === DeploymentEnvs.DEVELOPMENT) {
    headers["Croos-Origin-Opener-Policy"] = "same-origin-allow-popups";
  }
  return new Response(body, {
    headers,
  });
});

routes.set("/graphql", graphQlHandler);

const defaultRoute = () => {
  return new Response("Not found", { status: 404 });
};

const deploymentType = Deno.env.get("DEPLOYMENT_TYPE") ??
  DeploymentTypes.DEVELOPMENT;

let shouldLaunchWeb = true;
let shouldLaunchWorker = true;

switch (deploymentType) {
  case DeploymentTypes.WEB: {
    shouldLaunchWorker = false;
    break;
  }
  case DeploymentTypes.WORKER: {
    shouldLaunchWeb = false;
    break;
  }
}

if (import.meta.main) {
  if (shouldLaunchWeb) {
    Deno.serve(async (req) => {
      const incomingUrl = new URL(req.url);
      logger.info(
        `Incoming request: ${req.method} ${incomingUrl.pathname}`,
      );
      const handler = routes.get(incomingUrl.pathname) ?? defaultRoute;
      return await handler(req);
    });
  }

  if (shouldLaunchWorker) {
    const _worker = new Worker(
      import.meta.resolve("packages/worker/worker.ts"),
      { type: "module" },
    );
    logger.info("Launched worker");
    if (deploymentType === DeploymentTypes.DEVELOPMENT) {
      const keepaliveLogger = getLogger("workerKeepalive");
      keepaliveLogger.disableAll();
    }
  }
}
