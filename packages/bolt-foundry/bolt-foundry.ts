import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger(import.meta);

/**
 * Creates a fetch wrapper specifically for OpenAI API calls that adds
 * authentication and optional logging.
 *
 * @param openAiApiKey The OpenAI API key to use for authentication
 * @returns A fetch wrapper function that can be passed to OpenAI client
 */
export function createOpenAiFetch(openAiApiKey: string): typeof fetch {
  return function boltFoundryFetch(
    url: RequestInfo | URL,
    options?: RequestInit,
  ) {
    logger.setLevel(logger.levels.DEBUG);

    // Clone options to avoid mutating the original
    const modifiedOptions = options ? { ...options } : {};

    // Check if this is an OpenAI API request
    if (url.toString().includes("api.openai.com")) {
      // Add Authorization header with API key
      modifiedOptions.headers = {
        ...modifiedOptions.headers,
        "authorization": `Bearer ${openAiApiKey}`,
      };

      logger.debug("Added OpenAI API key to authorization header");

      // If there's a request body and it's not FormData, log it for debugging
      if (
        modifiedOptions.body &&
        !(modifiedOptions.body instanceof FormData) &&
        typeof modifiedOptions.body === "string"
      ) {
        try {
          // Parse the request body
          const body = JSON.parse(modifiedOptions.body);

          logger.debug(
            `OpenAI API request to ${url.toString()} with model: ${
              body.model || "unknown"
            }`,
          );

          // Don't modify the model - just keep the original
          modifiedOptions.body = JSON.stringify(body);
        } catch (error) {
          logger.error("Error parsing request body:", error);
        }
      }
    }

    logger.debug(`Fetching ${url}`, { method: options?.method });
    return fetch(url, modifiedOptions);
  };
}

// For backward compatibility
export const connectToOpenAi = createOpenAiFetch;
