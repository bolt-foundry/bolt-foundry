import { getLogger } from "packages/logger/logger.ts";
import { ReactDOMServer } from "packages/clientRenderer/deps.ts";
import { BaseComponent } from "packages/clientRenderer/BaseComponent.tsx";
import { Client } from "packages/client/Client.tsx"; // "new client"
import { getEnvironment } from "packages/clientRenderer/relayEnvironment.ts";
import {
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { FeatureFlags, FeatureVariants } from "packages/features/list.ts";
import { matchRouteWithParams, type RouterProviderProps } from "packages/client/contexts/RouterContext.tsx";
import { getContextFromRequest } from "packages/bfDb/getCurrentViewer.ts";
import * as React from 'react';
import type { AppEnvironmentProps } from "packages/client/contexts/AppEnvironmentContext.tsx";
const _logger = getLogger(import.meta);


const importableEnvironmentVariables = [
  "GOOGLE_OAUTH_CLIENT_ID",
  "POSTHOG_API_KEY",
  "FB_DOMAIN_AUTH_ID",
  "META_PIXEL_ID",
  "HUBSPOT_API_KEY",
  "CLEARBIT_API_KEY",
  "BF_ENV",
  "LIVEKIT_TEST_TOKEN",
  "LIVEKIT_URL"
];

type EnvironmentVars = {
  [K in typeof importableEnvironmentVariables[number]]?: string;
};

async function clientRendererMain(
  request: Request,
): Promise<Response> {
  const { pathname } = new URL(request.url);
  const environment: EnvironmentVars = {
    pathname,
  };
  importableEnvironmentVariables.forEach((key) => {
    if (key != null) {
      environment[key] = Deno.env.get(key);
    }
  });
  const queryParamsObj = new URLSearchParams(request.url);
  const queryParams = Object.fromEntries(queryParamsObj.entries());
  const { params: routeParams } = matchRouteWithParams(pathname);

  const clientEnvironment = {
    initialPath: pathname,
    ...environment,
    featureFlags: {},
    featureVariants: {},
    routeParams,
    queryParams,
  };

  const serverRelayEnvironment = getEnvironment();

  // @ts-expect-error dynamic adding of the environment variables
  const serverEnvironment: AppEnvironmentProps & RouterProviderProps & { IS_SERVER_RENDERING: boolean } = {
    ...clientEnvironment,
    serverRelayEnvironment,
    featureFlags: {} as FeatureFlags,
    featureVariants: {} as FeatureVariants,
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
