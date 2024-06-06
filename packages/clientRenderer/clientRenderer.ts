import { getLogger, React } from "deps.ts";
import { ReactDOMServer } from "packages/clientRenderer/deps.ts";
import { BaseComponent } from "packages/clientRenderer/BaseComponent.tsx";
import { Client } from "packages/client/Client.tsx";
import { getEnvironment } from "packages/clientRenderer/relayEnvironment.ts";
import {
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { FeatureFlags, FeatureVariants } from "packages/features/list.ts";
import { matchRouteWithParams } from "packages/client/contexts/RouterContext.tsx";
import { getContextFromRequest } from "packages/bfDb/getCurrentViewer.ts";

const logger = getLogger(import.meta);

const importableEnvironmentVariables = [
  "GOOGLE_OAUTH_CLIENT_ID",
];

async function clientRendererMain(
  request: Request,
): Promise<Response> {
  const { pathname } = new URL(request.url);
  const environment: Record<string, string | undefined> = {
    pathname,
  };
  importableEnvironmentVariables.forEach((key) => {
    if (key != null) {
      environment[key] = Deno.env.get(key);
    }
  });
  const queryParamsObj = new URLSearchParams(request.url);
  const queryParams = Object.fromEntries(queryParamsObj.entries());
  const {params: routeParams} = matchRouteWithParams(pathname);

  const clientEnvironment = {
    initialPath: pathname,
    ...environment,
    featureFlags: {},
    featureVariants: {},
    routeParams,
    queryParams,
  };
  
  const serverRelayEnvironment = getEnvironment();

  const serverEnvironment = {
    ...clientEnvironment,
    serverRelayEnvironment,
    POSTHOG_API_KEY: Deno.env.get("POSTHOG_API_KEY") ?? "",
    GOOGLE_OAUTH_CLIENT_ID: Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") ?? "",
    featureFlags: {} as FeatureFlags,
    featureVariants: {} as FeatureVariants,
    GOOGLE_DEVELOPER_API_KEY: Deno.env.get("GOOGLE_DEVELOPER_API_KEY") ?? "",
    content: "", 
    phBootstrap: {},
    IS_SERVER_RENDERING: true,
  };
  // this is the "frozen in time" render that gets built on the client.
  const serverRenderedClientElement = React.createElement(
    Client,
    serverEnvironment,
    null,
  );
  // this inserts the render into "basecomponent" which is an html template
  // client environment is what we pass to the rehydrate step.
  const el = React.createElement(
    BaseComponent,
    { environment: clientEnvironment },
    serverRenderedClientElement,
  );
  // We then stream down the content as soon as a request comes in.
  const stream = await ReactDOMServer.renderToReadableStream(el);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

async function redirectIfNotLoggedIn(request: Request, _routeParams: unknown) {
  const deploymentEnvironment = Deno.env.get("BF_ENV") ?? "DEVELOPMENT";
  const redirectDomain = Deno.env.get("BF_AUTH_REDIRECT_DOMAIN") ??
    "boltfoundry.wtf";
  const { hostname } = new URL(request.url);
  const loggedInRedirectUrl = deploymentEnvironment === "DEVELOPMENT"
    ? `https://${redirectDomain}/login?hostname=${hostname}`
    : "/login";

  const { bfCurrentViewer, responseHeaders } = await getContextFromRequest(
    request,
  );

  if (bfCurrentViewer instanceof BfCurrentViewerAccessToken) {
    const clientRendererResponse = await clientRendererMain(request);
    clientRendererResponse.headers.append(
      "Set-Cookie",
      responseHeaders.get("Set-Cookie") ?? "",
    );
    return clientRendererResponse;
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: loggedInRedirectUrl,
    },
  });
}

export function clientRenderer(allowLoggedOut = false) {
  if (allowLoggedOut) {
    return clientRendererMain;
  }
  return redirectIfNotLoggedIn;
}
