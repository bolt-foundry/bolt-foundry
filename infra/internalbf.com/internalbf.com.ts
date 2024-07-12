#! /usr/bin/env -S deno run -A
import { clientRenderer } from "infra/internalbf.com/clientRenderer/clientRenderer.ts";
import { getLogger } from "deps.ts";
import { routes as appRoutes } from "infra/internalbf.com/client/components/App.tsx";
import { handler as graphQlHandler } from "infra/graphql/graphql.ts";
import { getGoogleOauthUrl } from "lib/googleOauth.ts";

const logger = getLogger(import.meta);
export enum DeploymentTypes {
  WEB = "WEB",
  INTERNAL = "INTERNAL",
}

export enum DeploymentEnvs {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}
type Handler = (
  request: Request,
  routeParams: Record<string, string>,
) => Promise<Response> | Response;

const routes = new Map<string, Handler>();

for (const entry of appRoutes.entries()) {
  const [path, { allowLoggedOut }] = entry;
  routes.set(path, clientRenderer(allowLoggedOut));
}

routes.set("/resources/:filename+", async (_req, routeParams) => {
  const { filename } = routeParams;
  try {
    const fileContent = await Deno.readTextFile(
      new URL(import.meta.resolve(`resources/${filename}`)),
    );
    const ext = filename.split(".").pop();
    let contentType = "text/plain";

    if (ext === "css") {
      contentType = "text/css";
    } else if (ext === "js") {
      contentType = "application/javascript";
    }

    return new Response(fileContent, {
      headers: {
        "content-type": contentType,
      },
    });
  } catch (e) {
    return new Response("File not found", { status: 404 });
  }
});

routes.set("/build/:filename+", async (_req, routeParams) => {
  const { filename } = routeParams;
  try {
    const fileContent = await Deno.readTextFile(
      new URL(import.meta.resolve(`build/${filename}`)),
    );
    const ext = filename.split(".").pop();
    let contentType = "text/plain";

    if (ext === "css") {
      contentType = "text/css";
    } else if (ext === "js") {
      contentType = "application/javascript";
    }

    return new Response(fileContent, {
      headers: {
        "content-type": contentType,
      },
    });
  } catch (e) {
    return new Response("File not found", { status: 404 });
  }
});

routes.set("/login", (...args) => {
  const [req] = args;
  const url = new URL(req.url);
  const credential = url.searchParams.get("credential");
  const dontRedirect = credential || Deno.env.get("BF_ENV") !== "DEVELOPMENT";
  if (dontRedirect) {
    return clientRenderer(true)(...args);
  }

  return clientRenderer(false)(...args);
});

routes.set("/logout", () => {
  const headers = new Headers();
  headers.append("Set-Cookie", "BF_AT=; Path=/; Max-Age=0");
  headers.append("Set-Cookie", "BF_RT=; Path=/; Max-Age=0");
  headers.append("location", "/");
  return new Response(null, {
    status: 302,
    headers,
  });
});

routes.set("/google/oauth/start", (req) => {
  const deploymentEnvironment = Deno.env.get("BF_ENV") ?? "DEVELOPMENT";
  const shouldRedirect = deploymentEnvironment === DeploymentEnvs.DEVELOPMENT;
  if (shouldRedirect) {
    const redirectDomain = Deno.env.get("BF_AUTH_REDIRECT_DOMAIN") ??
      "boltfoundry.wtf";
    const url = new URL(req.url);
    const hostname = url.hostname;
    logger.info(
      `Redirecting to https://${redirectDomain}/google/oauth/start?hostname=${hostname}`,
    );
    return new Response(null, {
      status: 302,
      headers: {
        location:
          `https://${redirectDomain}/google/oauth/start?hostname=${hostname}`,
      },
    });
  }
  const requestUrl = new URL(req.url);
  const oauthUrl = getGoogleOauthUrl();
  const hostname = requestUrl.searchParams.get("hostname");

  const headers: Record<string, string> = {
    location: oauthUrl,
  };
  if (hostname) {
    headers["set-cookie"] = `bf_auth_redirect_domain=${hostname};`;
  }
  // create temporary redirect response 302
  return new Response(null, {
    status: 302,
    headers,
  });
});

routes.set("/google/oauth/end", (req) => {
  const cookie = req.headers.get("Cookie");
  const bfAuthRedirectDomainCookie = cookie?.split("; ").find((c) =>
    c.startsWith("bf_auth_redirect_domain=")
  );
  const bfAuthRedirectDomain = bfAuthRedirectDomainCookie?.split("=")[1];
  const requestUrl = new URL(req.url);

  if (bfAuthRedirectDomain) {
    requestUrl.hostname = bfAuthRedirectDomain;
    requestUrl.protocol = "https:";
    logger.info(`Redirecting to ${requestUrl.toString()}`);
    return new Response(null, {
      status: 302,
      headers: {
        location: requestUrl.toString(),
      },
    });
  }

  const code = requestUrl.searchParams.get("code");

  const body = `<html><body><script>
      window.addEventListener("message", (event) => {
        if (event.data === "close") {
          window.close();
        }
      });
      window.opener.postMessage(
        {
          code: "${code}",
        },
        "*",
      );
      </script></body></html>`;
  const headers: Record<string, string> = {
    "content-type": "text/html",
    "Cross-Origin-Opener-Policy": "",
  };

  return new Response(body, {
    headers,
  });
});

routes.set("/graphql", graphQlHandler);

const defaultRoute = () => {
  return new Response("Not found", { status: 404 });
};

Deno.serve(async (req, info) => {
  const tick = performance.now();
  const incomingUrl = new URL(req.url);
  logger.info(
    `Incoming request: ${req.method} ${incomingUrl.pathname}`,
  );
  info.completed.then(() => {
    logger.info(
      `(${
        (performance.now() - tick).toFixed(0)
      }ms) Completed: ${req.method} ${incomingUrl.pathname}`,
    );
  });
  // Attempt to match routes with optional URL params
  const pathWithParams = incomingUrl.pathname.split("?")[0];
  const routeParams: Record<string, string> = {};
  let matchedHandler = routes.get(pathWithParams);
  if (!matchedHandler) {
    // If no direct match, try matching with optional params
    for (const [routePath, routeHandler] of routes) {
      const regexPath = routePath.replace(/:\w+\??\+?/g, (match) => {
        if (match.endsWith("+")) {
          return "(.+)";
        } else if (match.endsWith("?")) {
          return "([^/]*)";
        } else {
          return "([^/]+)";
        }
      }) + "($|/)";
      const match = pathWithParams.match(new RegExp(`^${regexPath}`));
      if (match) {
        const paramNames = (routePath.match(/:\w+\??\+?/g) || []).map((p) =>
          p.substring(1).replace(/[\?\+]/g, "")
        );
        for (let i = 0; i < paramNames.length; i++) {
          routeParams[paramNames[i]] = match[i + 1];
        }
        matchedHandler = routeHandler;
        break;
      }
    }
  }
  // Use the matched handler if found, otherwise use the default route
  matchedHandler = matchedHandler || defaultRoute;
  return await matchedHandler(req, routeParams);
});
