// deno-lint-ignore-file bolt-foundry/no-env-direct-access
import type { OpenAI } from "@openai/openai";

export { BfClient } from "./BfClient.ts";
export * from "./deck.ts";
export { readLocalDeck } from "./deck.ts";

// Re-export types
export type { BfMetadata, BfOptions, TelemetryData } from "./types.ts";

let logger = console;
const enableLogging = false;
if (!enableLogging) {
  logger = {
    ...console,
    debug: (..._args: Array<unknown>) => {},
    warn: (..._args: Array<unknown>) => {},
    error: (..._args: Array<unknown>) => {},
    info: (..._args: Array<unknown>) => {},
  };
}

export type OpenAIRequestBody =
  | OpenAI.ChatCompletionCreateParams
  | OpenAI.CompletionCreateParams
  | OpenAI.EmbeddingCreateParams
  | OpenAI.ImageGenerateParams
  | OpenAI.ImageEditParams
  | OpenAI.ImageCreateVariationParams
  | OpenAI.ModerationCreateParams
  | OpenAI.BatchCreateParams
  | OpenAI.UploadCreateParams
  | OpenAI.UploadCompleteParams
  | OpenAI.FileCreateParams
  | undefined;

export type OpenAIResponseBody =
  | OpenAI.ChatCompletion
  | OpenAI.Completion
  | OpenAI.CreateEmbeddingResponse
  | OpenAI.ImagesResponse
  | OpenAI.ModerationCreateResponse
  | OpenAI.Batch
  | OpenAI.Upload
  | OpenAI.FileObject
  | OpenAI.FileDeleted
  | OpenAI.Model
  | OpenAI.ModelDeleted;

export type TelemetryData = {
  timestamp: string;
  duration: number;
  provider: string;
  providerApiVersion: string;
  sessionId?: string;
  userId?: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: OpenAIRequestBody;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: OpenAIResponseBody;
  };
};

/**
 * Extract API version from URL path
 * @param url The API URL
 * @returns The API version (e.g., "v1")
 */
function extractApiVersion(url: string): string {
  const versionMatch = url.match(/\/v(\d+)/);
  return versionMatch ? `v${versionMatch[1]}` : "v1"; // Default to v1 if not found
}

/**
 * Determine the API provider from the URL
 * @param url The API URL
 * @returns The provider name (e.g., "openai", "anthropic")
 */
function determineProvider(url: string): string {
  if (url.includes("api.openai.com")) return "openai";
  if (url.includes("api.anthropic.com")) return "anthropic";
  if (url.includes("api.mistral.ai")) return "mistral";
  // Add more providers as needed
  return "unknown";
}

/**
 * Creates a wrapped fetch function that adds necessary headers and handles OpenAI API requests.
 * This implementation adds authentication headers, preserves FormData requests, and tracks analytics.
 */
export function connectBoltFoundry(
  bfApiKey?: string,
  collectorEndpoint: string = Deno.env.get("BFF_COLLECTOR_ENDPOINT") ??
    "https://i.bltfdy.co/",
  options?: {
    sessionId?: string;
    userId?: string;
  },
): typeof fetch {
  async function enhancedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url = input.toString();
    const startTime = Date.now();

    // Only track analytics for API requests we care about
    const provider = determineProvider(url);
    if (provider !== "unknown") {
      logger.debug(`Bolt Foundry intercepting ${provider} request: ${url}`);

      // Clone the request to analyze later
      const clonedReq = new Request(input, init);

      // Send the original request to the API
      const response = await fetch(input, init);
      const clonedRes = response.clone();

      // Process telemetry in a non-blocking way
      Promise.resolve().then(async () => {
        try {
          // Extract request data
          let requestBody: OpenAIRequestBody | undefined;
          if (clonedReq.body) {
            try {
              const requestData = await clonedReq.clone().text();
              requestBody = JSON.parse(requestData) as OpenAIRequestBody;
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

          // Extract API version
          const apiVersion = extractApiVersion(url);

          // Prepare telemetry payload
          const telemetryData: TelemetryData = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            provider: provider,
            providerApiVersion: apiVersion,
            // Include session and user IDs if provided
            ...(options?.sessionId && { sessionId: options.sessionId }),
            ...(options?.userId && { userId: options.userId }),
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
            await fetch(collectorEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-BF-API-Key": bfApiKey,
              },
              body: JSON.stringify(telemetryData),
            });
            logger.debug(`Sent telemetry to ${collectorEndpoint}`);
          } else {
            logger.warn("No BF API key provided, skipping telemetry");
          }
        } catch (error) {
          logger.error("Error sending telemetry", error);
        }
      });

      return response;
    }

    // For non-tracked requests, pass through without modification
    return fetch(input, init);
  }

  return enhancedFetch;
}
