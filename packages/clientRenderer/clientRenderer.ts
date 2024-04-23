import { React } from "deps.ts";
import { ReactDOMServer } from "packages/clientRenderer/deps.ts";
import { BaseComponent } from "packages/clientRenderer/BaseComponent.tsx";
import { Client } from "packages/client/Client.tsx";
import { getEnvironment } from "packages/clientRenderer/relayEnvironment.ts";

const importableEnvironmentVariables = [
  "GOOGLE_OAUTH_CLIENT_ID",
];

export async function clientRenderer(
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
  const clientEnvironment = {
    initialPath: pathname,
    ...environment,
    featureFlags: {},
    featureVariants: {},
  };
  const serverRelayEnvironment = getEnvironment();
  // const serverRelayEnvironment = {};
  const serverEnvironment = {
    ...clientEnvironment,
    serverRelayEnvironment,
    POSTHOG_API_KEY: undefined,
    GOOGLE_OAUTH_CLIENT_ID: undefined,
    featureFlags: {},
    featureVariants: {},
    // Adding the missing properties with assumed placeholder values.
    GOOGLE_DEVELOPER_API_KEY: undefined, // Replace `undefined` with the actual key if available
    content: {}, // Assuming an empty object as default, update it as per your requirements
    currentViewer: null, // Assuming `null`, adjust according to your application's user management logic
    phBootstrap: undefined, // Placeholder, set accordingly
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
