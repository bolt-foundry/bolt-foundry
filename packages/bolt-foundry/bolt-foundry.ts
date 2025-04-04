import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger(import.meta);

/**
 * Options for OpenAI API configuration
 */
export type OpenAiOptions = {
  /**
   * The OpenAI API key to use for authentication
   */
  openAiApiKey: string;
  /**
   * Optional PostHog client for analytics
   */
  posthogClient?: PosthogClient;
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
 * Interface for PostHog client
 */
export type PosthogClient = {
  capture: (
    eventName: string,
    properties: Record<string, unknown>,
  ) => unknown;
};

/**
 * Creates a fetch wrapper specifically for OpenAI API calls that adds
 * authentication and optional logging.
 *
 * @param options Configuration options including the OpenAI API key. If not provided,
 *                values will be read from environment variables.
 * @returns A fetch wrapper function that can be passed to OpenAI client
 */
export function createOpenAiFetch(
  options?: Partial<OpenAiOptions>,
): typeof fetch & {
  trackLlmEvent: (
    eventName: string,
    properties: Record<string, unknown>,
  ) => Promise<void>;
} {
  const {
    openAiApiKey = Deno.env.get("OPENAI_API_KEY") || "",
    posthogClient,
    posthogApiKey = Deno.env.get("POSTHOG_API_KEY"),
    posthogHost = "https://us.i.posthog.com",
  } = options || {};

  // Manual LLM event tracking function
  const trackLlmEvent = async (
    eventName: string,
    properties: Record<string, unknown>,
  ) => {
    try {
      // Add timestamp if not present
      if (!properties.timestamp) {
        properties.timestamp = new Date().toISOString();
      }

      if (posthogClient) {
        // Use provided PostHog client
        await posthogClient.capture(eventName, properties);
      } else if (posthogApiKey) {
        // Send directly to PostHog API
        await fetch(`${posthogHost}/capture/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: posthogApiKey,
            event: eventName,
            properties,
          }),
        });
      }
    } catch (error) {
      logger.error("Error tracking LLM event:", error);
    }
  };

  // Create a function to track analytics
  const trackAnalytics = async (
    endpoint: string,
    model: string,
    responseTime: number,
    responseData?: Record<string, unknown>,
  ) => {
    try {
      const now = new Date();
      const analyticsData = {
        endpoint,
        model,
        timestamp: now.toISOString(),
        response_time_ms: responseTime,
      };

      // Add token usage if available
      if (responseData?.usage && typeof responseData.usage === "object") {
        const usage = responseData.usage as Record<string, unknown>;
        Object.assign(analyticsData, {
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
        });
      }

      // Use the trackLlmEvent function for consistency
      await trackLlmEvent("openai_api_call", analyticsData);
    } catch (error) {
      logger.error("Error tracking analytics:", error);
    }
  };

  // Create the fetch wrapper function with the additional trackLlmEvent method
  const fetchWrapper = function boltFoundryFetch(
    url: RequestInfo | URL,
    options?: RequestInit,
  ) {
    logger.setLevel(logger.levels.DEBUG);

    // Clone options to avoid mutating the original
    const modifiedOptions = options ? { ...options } : {};

    // Check if this is an OpenAI API request
    const isOpenAiRequest = url.toString().includes("api.openai.com");
    let model = "unknown";
    let endpoint = "unknown";

    if (isOpenAiRequest) {
      // Add Authorization header with API key
      modifiedOptions.headers = {
        ...modifiedOptions.headers,
        "authorization": `Bearer ${openAiApiKey}`,
      };

      logger.debug("Added OpenAI API key to authorization header");

      // Extract endpoint from URL
      const urlString = url.toString();
      // Match the full path after the version number, like "chat/completions"
      const match = urlString.match(/\/v\d+\/([^?]+)/);
      if (match && match[1]) {
        // Convert slashes to dots for consistency with test expectations
        endpoint = match[1].replace(/\//g, ".");
      }

      // If there's a request body and it's not FormData, log it for debugging
      if (
        modifiedOptions.body &&
        !(modifiedOptions.body instanceof FormData) &&
        typeof modifiedOptions.body === "string"
      ) {
        try {
          // Parse the request body
          const body = JSON.parse(modifiedOptions.body);
          model = body.model || "unknown";

          logger.debug(
            `OpenAI API request to ${url.toString()} with model: ${model}`,
          );

          // Don't modify the model - just keep the original
          modifiedOptions.body = JSON.stringify(body);
        } catch (error) {
          logger.error("Error parsing request body:", error);
        }
      }
    }

    logger.debug(`Fetching ${url}`, { method: options?.method });

    // Track the start time for response time calculation
    const startTime = Date.now();

    // Make the request, but wrap it for analytics tracking
    return fetch(url, modifiedOptions).then(async (response) => {
      const responseTime = Date.now() - startTime;

      // For OpenAI requests, track analytics
      if (isOpenAiRequest && (posthogClient || posthogApiKey)) {
        // Clone the response
        const clonedResponse = response.clone();

        try {
          // Parse the response
          const responseData = await clonedResponse.json();

          // Track the API call
          trackAnalytics(endpoint, model, responseTime, responseData);
        } catch (error) {
          logger.error(
            "Error processing OpenAI response for analytics:",
            error,
          );
        }
      }

      return response;
    });
  };

  // Add the trackLlmEvent method to the function
  fetchWrapper.trackLlmEvent = trackLlmEvent;

  return fetchWrapper;
}

// For backward compatibility
export const connectToOpenAi = createOpenAiFetch;
