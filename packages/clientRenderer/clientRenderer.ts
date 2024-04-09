import { React } from "deps.ts";
import { ReactDOMServer } from "deps.ts";
import { BaseComponent } from "packages/clientRenderer/BaseComponent.tsx";
import { Client } from "packages/client/Client.tsx";
// import getEnvironment from "packages/clientRenderer/relay-environment.ts";

export async function clientRenderer(
  request: Request,
): Promise<Response> {
  const { pathname } = new URL(request.url);
  const environment = {
    pathname,
  };
  const clientEnvironment = {
    initialPath: pathname,
    ...environment,
    featureFlags: {},
    featureVariants: {},
  };
  // const serverRelayEnvironment = getEnvironment();
  const serverRelayEnvironment = {};
  const serverEnvironment = {
    ...environment,
    serverRelayEnvironment,
    POSTHOG_API_KEY: undefined,
  };
  const serverRenderedClientElement = React.createElement(
    Client,
    serverEnvironment,
    null,
  );
  const el = React.createElement(
    BaseComponent,
    { environment: clientEnvironment },
    serverRenderedClientElement,
  );
  const stream = await ReactDOMServer.renderToReadableStream(el);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
