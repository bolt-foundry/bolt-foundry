import { getLogger } from "@bolt-foundry/logger";
import type { PostHog } from "posthog-node";

const logger = getLogger(import.meta);

/**
 * Tracks LLM-related events and metrics using PostHog
 */
export async function trackLlmEvent(
  req: Request,
  res: Response,
  startTime: number,
  posthogClient?: PostHog,
  bfApiKey?: string,
): Promise<void> {
  // Initialize PostHog client if API key is provided and client isn't initialized
  let client = posthogClient;
  if (!client && bfApiKey) {
    try {
      const { PostHog } = await import("posthog-node");
      client = new PostHog(bfApiKey);
    } catch (e) {
      logger.warn("Failed to initialize PostHog client", e);
      return;
    }
  }

  // Ensure PostHog client is available
  if (!client) {
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

    client.capture({
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

/**
 * Helper function to calculate approximate LLM cost
 */
export function calculateLlmCost(
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
