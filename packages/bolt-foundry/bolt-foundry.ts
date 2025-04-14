// import { getLogger } from "@bolt-foundry/logger";
// const logger = getLogger("bolt-foundry");
// logger.setLevel(logger.levels.DEBUG);
const logger = console;

/**
 * Creates a wrapped fetch function that adds necessary headers and handles OpenAI API requests.
 * This implementation adds authentication headers, preserves FormData requests, and tracks analytics.
 */
export function connectBoltFoundry(bfApiKey?: string): typeof fetch {
  async function enhancedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url = input.toString();
    const startTime = Date.now();

    // Only track analytics for OpenAI API requests
    if (url.includes("api.openai.com")) {
      logger.debug(`Bolt Foundry intercepting OpenAI request: ${url}`);

      // Clone the request to analyze later
      const clonedReq = new Request(input, init);

      // Send the original request to OpenAI
      const response = await fetch(input, init);
      const clonedRes = response.clone();

      // Process telemetry in a non-blocking way
      setTimeout(async () => {
        try {
          // Extract request data
          let requestBody;
          if (clonedReq.body) {
            try {
              const requestData = await clonedReq.clone().text();
              requestBody = JSON.parse(requestData);
            } catch (e) {
              logger.debug("Could not parse request body", e);
            }
          }

          // Safely extract request headers (without sensitive data)
          const requestHeaders: Record<string, string> = {};
          clonedReq.headers.forEach((value, key) => {
            // Skip sensitive headers like Authorization
            if (key.toLowerCase() !== "authorization") {
              requestHeaders[key] = value;
            }
          });

          // Extract response data
          let responseBody;
          try {
            const responseData = await clonedRes.clone().text();
            responseBody = JSON.parse(responseData);
          } catch (e) {
            logger.debug("Could not parse response body", e);
          }

          // Extract response headers
          const responseHeaders: Record<string, string> = {};
          clonedRes.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          // Prepare telemetry payload
          const telemetryData = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            request: {
              url,
              method: clonedReq.method,
              headers: requestHeaders,
              body: requestBody,
            },
            response: {
              status: clonedRes.status,
              headers: responseHeaders,
              body: responseBody,
            },
          };

          // Send to collector
          if (bfApiKey) {
            await fetch("https://i.bltfdy.co/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-BF-API-Key": bfApiKey,
              },
              body: JSON.stringify(telemetryData),
            });
            logger.debug("Sent telemetry to i.bltfdy.co");
          } else {
            logger.warn("No BF API key provided, skipping telemetry");
          }
        } catch (error) {
          logger.error("Error sending telemetry", error);
        }
      }, 0);

      return response;
    }

    // For non-OpenAI requests, pass through without modification
    return fetch(input, init);
  }

  return enhancedFetch;
}
