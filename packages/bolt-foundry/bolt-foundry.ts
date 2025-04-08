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
  let posthogClient: PostHog;

  async function trackLlmEvent(req: Request, res: Response, startTime: number) {
    // Initialize PostHog client if API key is provided and client isn't
    if (!posthogClient && bfApiKey) {
      const { PostHog } = await import("posthog-node");
      posthogClient = new PostHog(bfApiKey);
    }
    // Ensure PostHog client is available
    if (!posthogClient) {
      logger.warn("Api client not available, skipping LLM event tracking");
      return;
    }

    try {
      const now = Date.now();
      const latency = (now - startTime) / 1000; // Convert to seconds for PostHog
      const url = req.url.toString();
      const urlPath = url.split("api.openai.com")[1] || "";
      const parts = urlPath.split("/").filter(Boolean);
      const endpoint = parts.length > 1
        ? parts.slice(1).join(".")
        : (parts[0] || url);

      // Clone the request to read its body without modifying the original
      const requestClone = req.clone();
      let requestBody;
      let responseBody;

      // Get the request body if possible
      if (requestClone.body) {
        try {
          const requestData = await requestClone.text();
          requestBody = JSON.parse(requestData);
        } catch (e) {
          logger.debug("Could not parse request body", e);
        }
      }

      // Get the response body if possible
      try {
        const responseClone = res.clone();
        const responseData = await responseClone.text();
        responseBody = JSON.parse(responseData);
      } catch (e) {
        logger.debug("Could not parse response body", e);
      }

      // Prepare properties according to PostHog LLM observability schema
      const properties: Record<string, unknown> = {
        "$ai_provider": "openai",
        "$ai_latency": latency,
        "$ai_http_status": res.status,
        "$ai_base_url": "https://api.openai.com/v1",
        "$ai_is_error": res.status >= 400,
      };

      // Add error information if applicable
      if (res.status >= 400 && responseBody?.error) {
        properties["$ai_error"] = responseBody.error;
      }

      // Add model information if available
      if (requestBody?.model) {
        properties["$ai_model"] = requestBody.model;
      }

      // For chat completions
      properties["$ai_input"] = requestBody?.messages;

      if (responseBody?.usage?.prompt_tokens) {
        properties["$ai_input_tokens"] = responseBody.usage.prompt_tokens;
      }

      if (responseBody?.usage?.completion_tokens) {
        properties["$ai_output_tokens"] = responseBody.usage.completion_tokens;
      }

      if (responseBody?.choices) {
        properties["$ai_output_choices"] = responseBody.choices;
      }

      // Add model parameters
      if (
        requestBody?.temperature || requestBody?.max_tokens ||
        requestBody?.top_p
      ) {
        properties["$ai_model_parameters"] = {
          temperature: requestBody.temperature,
          max_tokens: requestBody.max_tokens,
          top_p: requestBody.top_p,
        };
      }

      if (responseBody?.id) {
        properties["$ai_response_id"] = responseBody.id;
      }

      // Calculate total tokens if needed
      if (
        responseBody?.usage?.prompt_tokens &&
        responseBody?.usage?.completion_tokens
      ) {
        properties["$ai_total_tokens"] = responseBody.usage.prompt_tokens +
          responseBody.usage.completion_tokens;
      }

      // Calculate approximate cost if possible
      if (requestBody?.model && responseBody?.usage) {
        // This is a simplified calculation and should be improved with actual pricing
        properties["$ai_cost"] = calculateLlmCost(
          requestBody.model,
          responseBody.usage.prompt_tokens || 0,
          responseBody.usage.completion_tokens || 0,
        );
      }

      posthogClient.capture({
        event: "$ai_generation",
        distinctId: "bolt-foundry",
        properties: properties,
      });

      logger.debug(`Tracked LLM event: ${endpoint}`, {
        latency,
        status: res.status,
      });
    } catch (error) {
      logger.error(`Error tracking LLM event`, error);
    }
  }

  // Helper function to calculate approximate LLM cost
  function calculateLlmCost(
    model: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const pricing: Record<string, { input: number; output: number }> = {
      "gpt-4o": { input: 0.0025, output: 0.010 },
      "gpt-3.5-turbo": { input: 0.0010, output: 0.0020 },
    };

    // Default to gpt-3.5-turbo pricing if model not found
    const modelPricing = pricing[model] || pricing["gpt-3.5-turbo"];

    const inputCost = (inputTokens / 1000) * modelPricing.input;
    const outputCost = (outputTokens / 1000) * modelPricing.output;

    return inputCost + outputCost;
  }
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
      setTimeout(() => trackLlmEvent(clonedReq, clonedRes, startTime), 0);
      return response;
    }

    // For non-OpenAI requests, pass through without modification
    logger.debug(`Bolt Foundry passing through request: ${url}`);
    return fetch(input, init);
  }

  return enhancedFetch;
}
