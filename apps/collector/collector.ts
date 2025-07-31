#! /usr/bin/env -S deno run --allow-net=0.0.0.0,us.i.posthog.com --allow-env --watch

import {
  getConfigurationVariable,
  warmSecrets,
} from "@bolt-foundry/get-configuration-var";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { Handler } from "@bfmono/lib/types/Handler.ts";
import { handleRequest } from "./handleRequest.ts";
import { PostHog } from "posthog-node";
import { trackLlmEvent } from "@bfmono/apps/collector/llm-event-tracker.ts";

const logger = getLogger(import.meta);

await warmSecrets();

// Define routes for the collector service
function registerCollectorRoutes(): Map<string, Handler> {
  const routes = new Map<string, Handler>();
  let appPosthog: PostHog | null = null;
  const appPosthogApiKey = getConfigurationVariable(
    "POSTHOG_API_KEY",
  );
  if (appPosthogApiKey) {
    appPosthog = new PostHog(appPosthogApiKey);
  }
  // API endpoint for collecting data
  routes.set("/", async function collectHandler(req) {
    logger.info("Received collect request");
    try {
      const contentType = req.headers.get("content-type");
      const bfApiKey = req.headers.get("x-bf-api-key");
      const isBfRequest = contentType?.includes("application/json") && bfApiKey;
      let payload;
      let userPosthog: PostHog | null = null;

      if (isBfRequest) {
        const posthogApiKey = bfApiKey?.replace("bf+", "");
        userPosthog = new PostHog(posthogApiKey);
        payload = await req.json();
        logger.info("Received Bolt Foundry request for ", bfApiKey);
        logger.debug("Received data:", payload);
        appPosthog?.capture({
          distinctId: bfApiKey,
          event: "sample collected",
        });
        await trackLlmEvent(payload, userPosthog);
      } else {
        payload = await req.text();
        logger.debug("Received text data");
      }

      await Promise.all([appPosthog?.flush(), userPosthog?.flush()]);

      return new Response(JSON.stringify({ success: true }), {
        headers: { "content-type": "application/json" },
      });
    } catch (err) {
      logger.error("Error processing collect request:", err);
      return new Response(
        JSON.stringify({ success: false, error: (err as Error).message }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }
  });

  return routes;
}

// Default route handler for 404s
function defaultCollectorRoute(): Response {
  return new Response("Collector endpoint not found", { status: 404 });
}

// Main request handler wrapper
async function handleCollectorRequest(req: Request): Promise<Response> {
  const routes = registerCollectorRoutes();
  return await handleRequest(req, routes, defaultCollectorRoute);
}

// Use a different port from the web service
const port = Number(getConfigurationVariable("COLLECTOR_PORT") ?? 8001);

// Start the server if this is the main module
if (import.meta.main) {
  logger.info(`Starting Collector service on port ${port}...`);
  Deno.serve({ port }, handleCollectorRequest);
}

export {
  defaultCollectorRoute,
  handleCollectorRequest,
  registerCollectorRoutes,
};
