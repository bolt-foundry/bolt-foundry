import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger("bolt-foundry");

/**
 * Options for OpenAI API configuration
 */
export type OpenAiOptions = {
  /**
   * The OpenAI API key to use for authentication
   */
  openAiApiKey: string;
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
 * This implementation adds authentication headers and preserves FormData requests.
 */
export function createOpenAIFetch(options: OpenAiOptions): typeof fetch {
  // Return a fetch wrapper that adds authentication headers for OpenAI requests
  return (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = input.toString();

    // Only add auth headers for OpenAI API requests
    if (url.includes("api.openai.com")) {
      logger.debug(`Bolt Foundry intercepting OpenAI request: ${url}`);

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
      return fetch(input, newInit);
    }

    // For non-OpenAI requests, pass through without modification
    logger.debug(`Bolt Foundry passing through request: ${url}`);
    return fetch(input, init);
  };
}
