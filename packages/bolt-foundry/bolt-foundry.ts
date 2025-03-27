
import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger(import.meta);

export function connectToOpenAi(openAiApiKey: string) {
  return function boltFoundryFetch(
    url: RequestInfo | URL,
    options?: RequestInit,
  ) {
    logger.setLevel(logger.levels.DEBUG);

    // Clone options to avoid mutating the original
    const modifiedOptions = options ? { ...options } : {};

    // Check if this is an OpenAI API request
    if (url.toString().includes('api.openai.com')) {
      // Add Authorization header with API key
      modifiedOptions.headers = {
        ...modifiedOptions.headers,
        'authorization': `Bearer ${openAiApiKey}`,
      };
      
      logger.debug('Added OpenAI API key to authorization header');
      
      // If there's a request body, modify the model
      if (modifiedOptions.body) {
        try {
          // Parse the request body
          const body = JSON.parse(modifiedOptions.body as string);
          
          // Update the model to gpt-3.5-turbo
          body.model = "gpt-3.5-turbo";
          
          // Stringify the body back
          modifiedOptions.body = JSON.stringify(body);
          
          logger.debug(`Modified request to use model: gpt-3.5-turbo`);
        } catch (error) {
          logger.error("Error parsing request body:", error);
        }
      }
    }

    logger.debug(`Fetching ${url}`, options, modifiedOptions);
    return fetch(url, modifiedOptions);
  };
}
