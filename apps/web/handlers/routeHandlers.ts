import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { appRoutes } from "apps/boltFoundry/routes.ts";
import { ServerRenderedPage } from "apps/boltFoundry/server/components/ServerRenderedPage.tsx";
import { AppRoot } from "apps/boltFoundry/AppRoot.tsx";
import { ClientRoot } from "apps/boltFoundry/ClientRoot.tsx";
import { getIsographEnvironment } from "apps/boltFoundry/server/isographEnvironment.ts";
import type { ServerProps } from "apps/boltFoundry/contexts/AppEnvironmentContext.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { getIsographHeaderComponent } from "apps/boltFoundry/components/IsographHeader.tsx";
import type { BfIsographEntrypoint } from "lib/BfIsographEntrypoint.ts";
import { AssemblyAI } from "assemblyai";

const logger = getLogger(import.meta);

const configurationVariableKeys = [
  "POSTHOG_API_KEY",
];

const configurationVariables = configurationVariableKeys.reduce((acc, key) => {
  acc[key] = getConfigurationVariable(key);
  return acc;
}, {} as Record<string, string | undefined>);

export async function handleAppRoute(
  request: Request,
  routeParams: Record<string, string>,
  path: string,
) {
  const reqUrl = new URL(request.url);
  const initialPath = reqUrl.pathname;
  const queryParams = Object.fromEntries(reqUrl.searchParams.entries());
  const isographServerEnvironment = getIsographEnvironment(request);

  const clientEnvironment = {
    initialPath,
    queryParams,
    routeParams,
    path,
    ...configurationVariables,
  };

  const serverEnvironment: ServerProps = {
    ...clientEnvironment,
    IS_SERVER_RENDERING: true,
    isographServerEnvironment,
  };

  const route = appRoutes.get(path);
  const RouteHeaderComponent = route?.Component?.HeaderComponent;
  const HeaderComponent = RouteHeaderComponent ?? AppRoot.HeaderComponent;

  const headerElement = React.createElement(HeaderComponent);

  const appElement = React.createElement(
    ClientRoot,
    serverEnvironment,
    React.createElement(AppRoot),
  );

  const element = React.createElement(
    ServerRenderedPage,
    { headerElement, environment: clientEnvironment },
    appElement,
  );

  const stream = await renderToReadableStream(element);
  return new Response(stream, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function handleIsographRoute(
  request: Request,
  routeParams: Record<string, string>,
  path: string,
  entrypoint: BfIsographEntrypoint,
) {
  const reqUrl = new URL(request.url);
  const initialPath = reqUrl.pathname;
  const queryParams = Object.fromEntries(reqUrl.searchParams.entries());
  const isographServerEnvironment = await getIsographEnvironment(request);
  const featureFlags = {};

  const clientEnvironment = {
    initialPath,
    queryParams,
    routeParams,
    path,
    featureFlags,
    ...configurationVariables,
  };

  const serverEnvironment: ServerProps = {
    ...clientEnvironment,
    IS_SERVER_RENDERING: true,
    isographServerEnvironment,
  };

  // Because this route is isograph-based, we dynamically generate a header component
  const HeaderComponent = getIsographHeaderComponent(
    serverEnvironment,
    entrypoint,
  );
  const headerElement = React.createElement(HeaderComponent);

  const appElement = React.createElement(
    ClientRoot,
    serverEnvironment,
    React.createElement(AppRoot),
  );

  const element = React.createElement(
    ServerRenderedPage,
    { headerElement, environment: clientEnvironment },
    appElement,
  );

  const stream = await renderToReadableStream(element);
  return new Response(stream, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function handleAssemblyAI(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    const client = new AssemblyAI({
      apiKey: getConfigurationVariable("ASSEMBLY_AI_KEY") as string,
    });

    const data = { audio: file };
    const transcript = await client.transcripts.transcribe(data);
    const words = transcript.words;

    return new Response(JSON.stringify(words), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

export function handleLogout() {
  const headers = new Headers();
  headers.set("location", "/");
  headers.set(
    "set-cookie",
    "bfgat=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
  );
  headers.set(
    "set-cookie",
    "bfgrt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
  );
  return new Response(null, {
    status: 302,
    headers,
  });
}
