import HyperDx from "https://esm.sh/@hyperdx/browser@0.19.3";
import { createLogger } from "aws/logs/mod.ts";
import getBfGraphId from "aws/lib/getBfGraphId.ts";
const logPosthog = createLogger("posthog", "debug");
const logPosthogError = createLogger("posthog", "error");
const logFrontend = createLogger("posthog:frontend", "debug");
const logFrontendError = createLogger("posthog:frontend", "error");
const logBackend = createLogger("posthog:backend", "debug");
const logBackendError = createLogger("posthog:backend", "error");

// @ts-expect-error #techdebt
let frontendClient;
// @ts-expect-error #techdebt
let backendClient: PostHogBackend;

function getConfigurationVariable(configVar: string) {
  if (typeof Deno !== "undefined") {
    return Deno.env.get(configVar);
  }
  // @ts-expect-error no index signature so this errors
  return globalThis.__ENVIRONMENT__ && globalThis.__ENVIRONMENT__[configVar];
}

export async function shutdownBackend() {
  await backendClient?.shutdownAsync();
}

export async function startupBackend() {
  const POSTHOG_API_KEY = getConfigurationVariable("POSTHOG_API_KEY");
  const POSTHOG_HOST = getConfigurationVariable("POSTHOG_HOST") ??
    "https://app.posthog.com";
  const { PostHog } = await import("npm:posthog-node");
  backendClient = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    // @ts-expect-error #techdebt
    fetch,
  });
  return { backendClient };
}

export function getCurrentClients() {
  // @ts-expect-error #techdebt
  return { frontendClient, backendClient };
}

export async function ensurePosthogClientIsSetUp(
  distinctId?: string,
  featureFlagsBootstrap?: unknown,
): Promise<{
  // @ts-expect-error #techdebt
  frontendClient?: PostHogFrontend;
  // @ts-expect-error #techdebt
  backendClient?: PostHogBackend;
  HyperDx?: typeof HyperDx;
}> {
  // @ts-expect-error #techdebt
  if (frontendClient || backendClient) {
    // @ts-expect-error #techdebt
    return { frontendClient, backendClient };
  }
  const POSTHOG_API_KEY = getConfigurationVariable("POSTHOG_API_KEY");
  const POSTHOG_HOST = getConfigurationVariable("POSTHOG_HOST") ??
    "https://app.posthog.com";
  if (!POSTHOG_API_KEY) {
    logPosthogError("No API key found for Posthog");
    return {};
  }

  if (typeof Deno === "undefined") {
    const { posthog } = await import("https://esm.sh/posthog-js@1.95.1");
    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_HOST,
      bootstrap: {
        distinctId,
        // @ts-expect-error #techdebt
        featureFlags: featureFlagsBootstrap,
      },
    });
    frontendClient = posthog;
    // @ts-expect-error We're currently loading intercom on the window lol™
    if (window.Intercom) {
      // @ts-expect-error We're currently loading intercom on the window lol™
      window.Intercom("boot", {
        api_base: "https://api-iam.intercom.io",
        app_id: "sgx3ukey",
      });
    }

    HyperDx.init({
      // @ts-expect-error __ENVIRONMENT__ is not typed.
      apiKey: globalThis.__ENVIRONMENT__.HYPERDX_API_KEY,
      service: "bf-frontend",
      consoleCapture: true,
    });
    if (distinctId) {
      HyperDx.setGlobalAttributes({
        userId: distinctId,
      });
    }

    return { frontendClient, HyperDx };
  }
  if (backendClient) {
    return { backendClient };
  }

  return getCurrentClients();
}

/**
 * @example
 *
 * ```ts
 *
 * captureEvent("person", "signed up", {plan: 'lol'}, currentViewer.bf_graph_id)
 *
 * ```
 */
export async function captureEvent(
  eventObject: string,
  eventVerb: string,
  properties?: Record<string, unknown>,
  personBfGraphId?: string,
) {
  const { backendClient, frontendClient } = await ensurePosthogClientIsSetUp();
  logPosthog("Capturing event", {
    eventObject,
    eventVerb,
    properties,
    personBfGraphId,
  });
  const eventName = `${eventObject} ${eventVerb}`;
  if (backendClient) {
    if (!personBfGraphId) {
      logBackendError(
        "Couldn't capture event because no bf_graph_id provided.",
        {
          eventObject,
          eventVerb,
          properties,
        },
      );
      return;
    }
    backendClient.capture({
      distinctId: personBfGraphId,
      event: eventName,
    });
    logBackend("Captured event", {
      eventObject,
      eventVerb,
      properties,
    });
  }
  if (frontendClient) {
    let bfGraphId = personBfGraphId;
    // get bf_graph_id from id because it's hard to get just the bf_graph_id from the frontend
    if (personBfGraphId?.startsWith("Person")) {
      bfGraphId = getBfGraphId(personBfGraphId);
    }
    if (personBfGraphId) {
      frontendClient.identify(bfGraphId);
    }
    frontendClient.capture(eventName, properties);
    logFrontend("Captured event", {
      eventObject,
      eventVerb,
      properties,
    });
  }
  if (HyperDx) {
    // @ts-expect-error properties aren't typed the way hyperdx expects, hopefully that's fine.
    HyperDx.addAction(eventName, properties);
    // deno-lint-ignore no-console
    console.debug(eventName, properties);
  }
}

export async function identifyPerson(id?: string) {
  if (!id) {
    return;
  }
  const { backendClient, frontendClient } = await ensurePosthogClientIsSetUp();
  if (frontendClient) {
    const personBfGraphId = getBfGraphId(id);
    return frontendClient.identify(personBfGraphId);
  } else if (backendClient) {
    return logBackend("Tried to identify a person on the backend");
  }
  logPosthogError("Tried to identify a person but no client was set up");
}

export async function updatePersonProperties(
  personBfGraphId: string,
  properties: Record<string, unknown>,
) {
  const { backendClient, frontendClient } = await ensurePosthogClientIsSetUp();
  if (frontendClient) {
    return logFrontendError("Tried to update a person on the frontend");
  } else if (backendClient) {
    return backendClient?.identify({ distinctId: personBfGraphId, properties });
  }
  logPosthogError("Tried to update a person but no client was set up");
}

export async function capturePageview(_location?: string) {
  const { backendClient, frontendClient } = await ensurePosthogClientIsSetUp();
  if (frontendClient) {
    return frontendClient.capture("$pageview");
  } else if (backendClient) {
    return logBackendError("Tried to capture a pageview on the backend");
  }
  logPosthogError("Tried to capture a pageview but no client was set up");
}
