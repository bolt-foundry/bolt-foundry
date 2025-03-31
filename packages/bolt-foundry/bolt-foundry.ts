const logger = console;
// Store reference to the original fetch
const originalFetch = fetch;
import { PostHog } from "posthog-node";

export function connectToOpenAi(
  openAiApiKey: string,
  posthogApiKey: string,
): typeof fetch {
  // Initialize PostHog client
  const posthog = new PostHog(posthogApiKey, {
    host: "https://us.i.posthog.com",
  });

  return async function boltFoundryFetch(
    url: RequestInfo | URL,
    options?: RequestInit,
  ) {
    // Clone options to avoid mutating the original
    const modifiedOptions = options ? { ...options } : {};

    // Check if this is an OpenAI API request
    if (url.toString().includes("api.openai.com")) {
      const startTime = Date.now();

      // techdebt lol
      // deno-lint-ignore no-explicit-any
      let originalBody: any = null;

      // Add Authorization header with API key
      modifiedOptions.headers = {
        ...modifiedOptions.headers,
        Authorization: `Bearer ${openAiApiKey}`,
      };
      logger.debug("Added OpenAI API key to authorization header");

      // If there's a request body and it's not FormData, modify the model
      if (
        modifiedOptions.body &&
        !(modifiedOptions.body instanceof FormData) &&
        typeof modifiedOptions.body === "string"
      ) {
        try {
          // Parse the request body
          originalBody = JSON.parse(modifiedOptions.body);

          // Update the model to gpt-3.5-turbo
          originalBody.model = "gpt-3.5-turbo";

          // Stringify the body back
          modifiedOptions.body = JSON.stringify(originalBody);
          logger.debug(`Modified request to use model: gpt-3.5-turbo`);
        } catch (error) {
          logger.error("Error parsing request body:", error);
        }
      }

      logger.debug(`Fetching ${url}`, options, modifiedOptions);

      try {
        // Use the original fetch, not the wrapped one
        const response = await originalFetch(url, modifiedOptions);
        const endTime = Date.now();
        const latency = (endTime - startTime) / 1000; // Convert to seconds

        // Clone the response so we can read the body without consuming it
        const clonedResponse = response.clone();

        // Process the response for analytics WITHOUT awaiting it
        // This allows us to return the response immediately while analytics processes in background
        try {
          const responseData = await clonedResponse.json();

          // Generate a trace ID
          const traceId = `trace_${Date.now()}_${
            Math.random().toString(36).substring(2, 15)
          }`;
          const properties = {
            $ai_trace_id: traceId,
            $ai_model: originalBody?.model || "gpt-3.5-turbo",
            $ai_provider: "openai",
            $ai_input: originalBody?.messages || [],
            $ai_input_tokens: responseData.usage.prompt_tokens,
            $ai_output_choices: responseData.choices,
            $ai_output_tokens: responseData.usage.completion_tokens,
            $ai_latency: latency,
            $ai_http_status: response.status,
            $ai_base_url: "https://api.openai.com/v1",
          };

          logger.debug("POSTHOGGING", properties, responseData);

          // Send analytics to PostHog
          posthog.capture({
            distinctId: originalBody?.user || "anonymous_user",
            event: "$ai_generation",
            properties,
          });

          // Flush in the background
          await posthog.flush().catch((flushError) => {
            logger.error("Error flushing PostHog events:", flushError);
          });
        } catch (error) {
          logger.error("Error processing response for analytics:", error);
        }

        // Return response immediately without waiting for PostHog processing
        return response;
      } catch (error) {
        logger.error("Fetch error:", error);
        throw error;
      }
    } else {
      // For non-OpenAI requests, just use original fetch
      return originalFetch(url, modifiedOptions);
    }
  };
}
