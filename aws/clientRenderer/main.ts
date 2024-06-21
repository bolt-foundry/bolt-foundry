import Client from "aws/client/main.tsx";
import render from "aws/clientRenderer/renderer.ts";
import { React, ReactDOMServer } from "aws/clientRenderer/deps.ts";
import getEnvironment from "aws/clientRenderer/relay-environment.ts";
import {
  matchRouteWithParams,
  registeredRoutes,
} from "aws/client/contexts/RouterContext.tsx";

import { createLogger } from "aws/logs/mod.ts";
import {
  featureFlags as defaultFeatureFlags,
  featureVariants as defaultFeatureVariants,
} from "aws/features/list.ts";

const log = createLogger("clientRenderer", "info");
log("starting clientRenderer");
const BFF_ROOT = Deno.env.get("BFF_ROOT") ?? "/bf/.";

// const staticRoutes = new Map<Route, Handler>();

async function streamToString(readableStream: ReadableStream) {
  const reader = readableStream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      result += decoder.decode(value);
    }

    return result;
  } finally {
    reader.releaseLock();
  }
}

// const defaultRoute = async (request?: APIGatewayEvent) => {
//   log(`couldn't find ${request?.path}`);
//   log(staticRoutes.keys());
//   const body = await Deno.readTextFile(
//     new URL(import.meta.resolve("resources/static/404.html")),
//   );
//   return {
//     statusCode: 404,
//     headers: {
//       "Content-Type": "text/html",
//     },
//     body,
//   };
// };

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
}

export const theAwsApp = async (
  request: Request,
): Promise<Response> => {
  const currentUrl = new URL(request.url);
  const initialPath = currentUrl.pathname
  const currentViewer = {};
  const currentViewerProps = { id: "" };
  const { params: routeParams } = matchRouteWithParams(initialPath);
  const queryParams = currentUrl.searchParams;

  let featureVariants = defaultFeatureVariants;
  let featureFlags = defaultFeatureFlags;
  let phBootstrap = {};
  
  // @ts-expect-error #techdebt
  const { contentType, contentSlug } = routeParams;

  let content = null;
  if (contentType && contentSlug) {
    content = await Deno.readTextFile(
      `${BFF_ROOT}/content/${contentType}/${contentSlug}.mdx`,
    );
  }
  if (contentType && !contentSlug) {
    content = await Deno.readTextFile(
      `${BFF_ROOT}/content/${contentType}/index.mdx`,
    );
  }

  if (initialPath == "/open-mic") {
    content = await Deno.readTextFile(
      `${BFF_ROOT}/content/index.mdx`,
    );
  }

  const environment = {
    initialPath,
    routeParams,
    queryParams,
    HUBSPOT_PORTAL_ID: Deno.env.get("HUBSPOT_PORTAL_ID") ?? "",
    CONTACT_FORM_ID: Deno.env.get("CONTACT_FORM_ID") ?? "",
    WS_DOMAIN_NAME: Deno.env.get("WS_DOMAIN_NAME") ??
      `ws.${Deno.env.get("DOMAIN_NAME")}`,
    currentViewer: currentViewerProps,
    POSTHOG_API_KEY: Deno.env.get("POSTHOG_API_KEY") ?? "",
    HYPERDX_API_KEY: Deno.env.get("HYPERDX_API_KEY") ?? "",
    GOOGLE_OAUTH_CLIENT_ID: Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") ?? "",
    GOOGLE_DEVELOPER_API_KEY: Deno.env.get("GOOGLE_DEVELOPER_API_KEY") ?? "",
    phBootstrap,
    featureFlags,
    featureVariants,
    content,
  };
  // log("flags", featureFlags, featureVariants);
  const serverRelayEnvironment = getEnvironment(currentViewer);
  const serverEnvironment = {
    ...environment,
    serverRelayEnvironment,
    POSTHOG_API_KEY: undefined,
  };

  const clientElement = React.createElement(Client, serverEnvironment, null);

  const reactRenderedStream = await ReactDOMServer.renderToReadableStream(
    clientElement,
  );
  const reactRendered = await streamToString(reactRenderedStream);

  return new Response(render(reactRendered, environment), {
    headers: {
      "Content-Type": "text/html",
    }
  })
};

