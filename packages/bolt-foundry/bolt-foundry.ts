import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger("bolt-foundry");

/**
 * PostHog client interface
 */
export interface PostHogClient {
  capture: (
    eventName: string,
    distinctId: string,
    properties: Record<string, unknown>,
  ) => unknown;
}

/**
 * Options for OpenAI API configuration
 */
export type OpenAiOptions = {
  /**
   * The OpenAI API key to use for authentication
   */
  openAiApiKey: string;
  /**
   * Optional PostHog client for analytics tracking
   */
  posthogClient?: PostHogClient;
  /**
   * Optional PostHog API key (alternative to providing a client)
   */
  posthogApiKey?: string;
  /**
   * Optional PostHog host URL (defaults to app.posthog.com)
   */
  posthogHost?: string;
};

/**
 * Creates a wrapped fetch function that adds necessary headers and handles OpenAI API requests.
 * This implementation adds authentication headers, preserves FormData requests, and tracks analytics.
 */
export function createOpenAIFetch(options: OpenAiOptions): typeof fetch & {
  trackLlmEvent: (
    eventName: string,
    properties: Record<string, unknown>,
  ) => Promise<void>;
} {
  // Initialize PostHog client if API key is provided
  let posthogClient = options.posthogClient;

  if (!posthogClient && options.posthogApiKey) {
    // Simple implementation to handle direct PostHog API calls when no client is provided
    posthogClient = {
      capture: (
        eventName: string,
        distinctId: string,
        properties: Record<string, unknown>,
      ) => {
        const url = options.posthogHost || "https://us.i.posthog.com";
        return fetch(`${url}/capture/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: options.posthogApiKey,
            event: eventName,
            distinct_id: distinctId,
            properties,
            timestamp: new Date().toISOString(),
          }),
        });
      },
    };
  }

  // Function to track LLM events
  const trackLlmEvent = async (
    eventName: string,
    properties: Record<string, unknown>,
  ) => {
    if (!posthogClient) {
      logger.debug("PostHog client not configured, skipping event tracking");
      return;
    }

    try {
      logger.debug(`Tracking LLM event: ${eventName}`);
      // Use a consistent distinct ID for LLM events or extract from properties if available
      const distinctId = (properties.distinct_id as string) ||
        (properties.$ai_trace_id as string) ||
        `llm-event-${Date.now()}`;

      // Remove distinct_id from properties if it exists as it's passed separately
      const { distinct_id: _distinct_id, ...otherProperties } =
        properties as Record<string, unknown>;

      await posthogClient.capture(eventName, distinctId, {
        timestamp: new Date().toISOString(),
        ...otherProperties,
      });
    } catch (error) {
      logger.error(`Error tracking LLM event: ${error}`);
    }
  };

  // Enhanced fetch function with analytics
  const enhancedFetch: typeof fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = input.toString();
    const startTime = Date.now();

    // Only add auth headers and track analytics for OpenAI API requests
    if (url.includes("api.openai.com")) {
      logger.debug(`Bolt Foundry intercepting OpenAI request: ${url}`);

      // Extract endpoint from URL path (e.g., "chat.completions" from "/v1/chat/completions")
      const urlPath = url.split("api.openai.com")[1] || "";
      const parts = urlPath.split("/").filter(Boolean);
      const endpoint = parts.length > 1
        ? parts.slice(1).join(".")
        : (parts[0] || url);

      // Create a new init object to avoid modifying the original
      const newInit = { ...init };

      // Handle headers differently based on their type
      if (init?.headers) {
        // If headers is already a Headers object
        if (init.headers instanceof Headers) {
          const headers = new Headers(init.headers);
          headers.set("Authorization", `Bearer ${options.openAiApiKey}`);
          newInit.headers = headers;
        } // If headers is a plain object
        else if (typeof init.headers === "object") {
          newInit.headers = {
            ...init.headers,
            Authorization: `Bearer ${options.openAiApiKey}`,
          };
        }
      } else {
        // No headers provided, create new ones
        newInit.headers = {
          Authorization: `Bearer ${options.openAiApiKey}`,
        };
      }

      logger.debug("Added authorization header to OpenAI request");

      // Get request body data for analytics
      let requestBody: Record<string, unknown> | null = null;

      try {
        if (newInit.body && typeof newInit.body === "string") {
          try {
            requestBody = JSON.parse(newInit.body);
          } catch (_e) {
            // Not JSON, ignore
          }
        }

        // Make the request
        const response = await fetch(input, newInit);
        const responseTime = Date.now() - startTime;

        // Clone response to avoid consuming it
        const responseClone = response.clone();

        // Track the API call
        if (posthogClient) {
          try {
            // Try to parse the response JSON for token usage
            const responseData = await responseClone.json();

            // Track API call with token usage if available
            await trackLlmEvent("$ai_generation", {
              $ai_trace_id: `trace-${Date.now()}`,
              $ai_model: requestBody?.model || "unknown",
              $ai_provider: "openai",
              $ai_input: newInit.body ? newInit.body : null,
              $ai_input_tokens: responseData.usage?.prompt_tokens || 0,
              $ai_output_choices: JSON.stringify(responseData.choices) || null,
              $ai_output_tokens: responseData.usage?.completion_tokens || 0,
              $ai_latency: responseTime / 1000, // Convert to seconds
              $ai_http_status: response.status,
              $ai_base_url: url.split("/v1")[0],
              $ai_is_error: false,
              // Additional properties
              endpoint,
              url,
              response_time_ms: responseTime,
              total_tokens: responseData.usage?.total_tokens,
            });

            // Return a reconstructed response since we consumed the original
            return new Response(JSON.stringify(responseData), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          } catch (_e) {
            // If we can't parse the response, just track the basics
            await trackLlmEvent("$ai_generation", {
              endpoint,
              url,
              $ai_model: requestBody?.model || "unknown",
              $ai_provider: "openai",
              $ai_input: newInit.body ? newInit.body : null,
              $ai_input_tokens: 0,
              $ai_output_choices: null,
              $ai_output_tokens: 0,
              $ai_latency: responseTime / 1000, // Convert to seconds
              $ai_http_status: response.status,
              $ai_base_url: url.split("/v1")[0],
              $ai_is_error: false,
              response_time_ms: responseTime,
            });
          }
        }

        return response;
      } catch (error) {
        // Track API errors using PostHog AI format
        if (posthogClient) {
          await trackLlmEvent("$ai_generation", {
            $ai_trace_id: `error-${Date.now()}`,
            $ai_model: requestBody?.model || "unknown",
            $ai_provider: "openai",
            $ai_input: newInit.body ? newInit.body : null,
            $ai_input_tokens: 0,
            $ai_output_choices: null,
            $ai_output_tokens: 0,
            $ai_latency: (Date.now() - startTime) / 1000, // Convert to seconds
            $ai_http_status: 0, // No status code available for network errors
            $ai_base_url: url.split("/v1")[0],
            $ai_is_error: true,
            $ai_error: (error as Error).toString(),
            // Additional properties
            endpoint,
            url,
            response_time_ms: Date.now() - startTime,
          });
        }
        throw error;
      }
    }

    // For non-OpenAI requests, pass through without modification
    logger.debug(`Bolt Foundry passing through request: ${url}`);
    return fetch(input, init);
  };

  // Attach the tracking function to the fetch function
  const enhancedFetchWithTracking = Object.assign(enhancedFetch, {
    trackLlmEvent,
  });

  return enhancedFetchWithTracking;
}
