// import { getLogger } from "@bolt-foundry/logger";
import type { PostHog } from "posthog-node";
// const logger = getLogger("bolt-foundry");
// logger.setLevel(logger.levels.DEBUG);
const logger = console;

/**
 * Creates a wrapped fetch function that adds necessary headers and handles OpenAI API requests.
 * This implementation adds authentication headers, preserves FormData requests, and tracks analytics.
 */
export function connectBoltFoundry(bfApiKey?: string): typeof fetch {
  let posthogClient: PostHog | undefined;

  // Enhanced fetch function with analytics
  async function enhancedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url = input.toString();
    const startTime = Date.now();

    // Only add auth headers and track analytics for OpenAI API requests
    if (url.includes("api.openai.com")) {
      logger.debug(`Bolt Foundry intercepting OpenAI request: ${url}`);

      logger.debug("Added authorization header to OpenAI request");
      const clonedReq = new Request(input, init);
      const response = await fetch(input, init);
      const clonedRes = response.clone();

      // Initialize PostHog client if needed
      if (!posthogClient && bfApiKey) {
        try {
          const { PostHog } = await import("posthog-node");
          posthogClient = new PostHog(bfApiKey);
        } catch (e) {
          logger.warn("Failed to initialize PostHog client", e);
        }
      }

      setTimeout(
        () =>
          trackLlmEvent(
            clonedReq,
            clonedRes,
            startTime,
            bfApiKey,
            posthogClient,
          ),
        0,
      );
      return response;
    }

    // For non-OpenAI requests, pass through without modification
    logger.debug(`Bolt Foundry passing through request: ${url}`);
    return fetch(input, init);
  }

  return enhancedFetch;
}

// Temporary function until we finish moving code to llm-event-tracker.ts
async function trackLlmEvent(
  req: Request,
  res: Response,
  startTime: number,
  bfApiKey?: string,
  posthogClient?: PostHog,
) {
  const { trackLlmEvent: tracker } = await import("./llm-event-tracker.ts");
  await tracker(req, res, startTime, posthogClient, bfApiKey);
}
