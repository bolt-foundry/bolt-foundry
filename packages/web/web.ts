#! /usr/bin/env -S deno run -A

import { clientRenderer } from "packages/clientRenderer/clientRenderer.ts";
import { getLogger } from "packages/logger/logger.ts";
import { routes as appRoutes } from "packages/client/components/App.tsx";
import { getHeaders } from "infra/watcher/ingest.ts";
import { workerList } from "infra/build/workerList.ts";
import { handler as graphQlHandler } from "packages/graphql/graphql.ts";
import { getGoogleOauthUrl } from "lib/googleOauth.ts";
import { getContextFromRequest } from "packages/bfDb/getCurrentViewer.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { serveDir } from "@std/http";

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

for (const workerPathWithoutLeadingSlash of workerList) {
  const workerPath = "/" + workerPathWithoutLeadingSlash;
  routes.set(workerPath, async (_request, _routeParams) => {
    const filePath = workerPath.replace("packages/", "build/").replace(
      ".ts",
      ".js",
    );
    try {
      const fileContent = await Deno.readTextFile(
        new URL(import.meta.resolve(filePath)),
      );
      return new Response(fileContent, {
        headers: { "content-type": "application/javascript" },
      });
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return defaultRoute();
      }
      throw e;
    }
  });
}

routes.set("/resources/:filename+", (req, routeParams) => {
  return serveDir(req);
});
routes.set("/build/:filename+", (req, routeParams) => {
  return serveDir(req);
});

routes.set("/login", (...args) => {
  const [req] = args;
  const url = new URL(req.url);
  const credential = url.searchParams.get("credential");
  const dontRedirect = credential || Deno.env.get("BF_ENV") !== "DEVELOPMENT" ||
    Deno.env.get("DONT_REDIRECT_TO_LOGIN_SERVER");
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
  const shouldRedirect = deploymentEnvironment === DeploymentEnvs.DEVELOPMENT &&
    !Deno.env.get("DONT_REDIRECT_TO_LOGIN_SERVER");
  if (shouldRedirect) {
    const redirectDomain = Deno.env.get("BF_AUTH_REDIRECT_DOMAIN") ??
      "boltfoundry.wtf";
    const url = new URL(req.url);
    const hostname = url.hostname;
    // deno-lint-ignore no-console
    console.log(
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
    // deno-lint-ignore no-console
    console.log(`Redirecting to ${requestUrl.toString()}`);
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
routes.set("/aws-graphql", async (req) => {
  const { bfCurrentViewer } = await getContextFromRequest(req);
  if (!(bfCurrentViewer instanceof BfCurrentViewerAccessToken)) {
    throw new Error("no thanks.");
  }

  const headersFromGraphql = await getHeaders();
  const {
    headers,
    body,
    cache,
    credentials,
    method,
    mode,
    integrity,
    keepalive,
    redirect,
    referrer,
    referrerPolicy,
    signal,
  } = req;
  const combinedHeaders = new Headers(headers);
  combinedHeaders.set("cookie", headersFromGraphql.get("cookie") ?? "");
  const proxyUrl = "https://justin.boltfoundry.wtf/graphql";
  const proxiedRequest = new Request(proxyUrl, {
    body, // request body
    cache, // request cache mode
    credentials, // request credentials
    headers: combinedHeaders, // request headers
    integrity, // subresource integrity value
    keepalive, // keepalive flag
    method, // HTTP method (GET, POST, etc.)
    mode, // request mode (e.g., cors, no-cors, same-origin)
    redirect, // redirect mode
    referrer, // referrer URL
    referrerPolicy, // referrer policy
    signal, // AbortSignal to abort the request
  });
  return fetch(proxiedRequest);
});

routes.set("/og-graphql", (req) => {
  const proxyUrl = "https://justin.boltfoundry.wtf/graphql";
  const {
    headers,
    body,
    cache,
    credentials,
    method,
    mode,
    integrity,
    keepalive,
    redirect,
    referrer,
    referrerPolicy,
    signal,
  } = req;
  const combinedHeaders = new Headers(headers);
  const proxiedRequest = new Request(proxyUrl, {
    body, // request body
    cache, // request cache mode
    credentials, // request credentials
    headers: combinedHeaders, // request headers
    integrity, // subresource integrity value
    keepalive, // keepalive flag
    method, // HTTP method (GET, POST, etc.)
    mode, // request mode (e.g., cors, no-cors, same-origin)
    redirect, // redirect mode
    referrer, // referrer URL
    referrerPolicy, // referrer policy
    signal, // AbortSignal to abort the request
  });

  return fetch(proxiedRequest);
});

const defaultRoute = () => {
  return new Response("Not found", { status: 404 });
};

logger.info("Ready to serve");

Deno.serve(async (req) => {
  const incomingUrl = new URL(req.url);

  logger.info(
    `[${new Date().toISOString()}] [${req.method}] ${incomingUrl} ${
      req.headers.get("content-type")
    }`,
  );

  // Attempt to match routes with optional URL params
  const pathWithParams = incomingUrl.pathname.split("?")[0];
  const routeParams: Record<string, string> = {};
  let matchedHandler = routes.get(pathWithParams);
  if (!matchedHandler) {
    // If no direct match, try matching with optional params
    for (const [routePath, routeHandler] of routes) {
      const regexPath = routePath.replace(/\/:\w+\??\+?/g, (match) => {
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
  const res = await matchedHandler(req, routeParams);
  return res;
});
