import { getLogger } from "@bolt-foundry/logger";
import { PostHog } from "posthog-node";

const logger = getLogger(import.meta);

import type { TelemetryData } from "packages/bolt-foundry/bolt-foundry.ts";

/**
 * Logs LLM-related events to console and sends data to PostHog
 * @param telemetryData The serialized telemetry data containing request, response and duration
 * @param apiKeyOrPostHogClient Either a PostHog API key or a PostHog client instance
 */
export async function trackLlmEvent(
  telemetryData: TelemetryData,
  apiKeyOrPostHogClient?: string | PostHog,
): Promise<void> {
  try {
    const { request: requestData, response: responseData, duration } =
      telemetryData;

    const latency = duration / 1000; // Convert to seconds
    const url = requestData.url;
    const urlPath = url.split("api.openai.com")[1] || "";
    const parts = urlPath.split("/").filter(Boolean);
    const endpoint = parts.length > 1
      ? parts.slice(1).join(".")
      : (parts[0] || url);

    // Get data from the serialized request and response
    const requestBody = requestData.body;
    const responseBody = responseData.body;

    // Check if response is a successful completion (not an error)
    const isSuccessfulResponse = responseData.status < 400 &&
      "usage" in responseBody &&
      responseBody.usage !== undefined;

    // Calculate total tokens if available
    let totalTokens = 0;
    if (
      isSuccessfulResponse &&
      responseBody.usage?.prompt_tokens &&
      responseBody.usage?.completion_tokens
    ) {
      totalTokens = responseBody.usage.prompt_tokens +
        responseBody.usage.completion_tokens;
    }

    // Calculate approximate cost if possible
    let cost = 0;
    if (requestBody?.model && isSuccessfulResponse && responseBody.usage) {
      cost = calculateLlmCost(
        requestBody.model,
        responseBody.usage.prompt_tokens || 0,
        responseBody.usage.completion_tokens || 0,
      );
    }

    // Log basic information about the request
    logger.info(`LLM request to ${endpoint}`, {
      model: requestBody?.model,
      latency: latency.toFixed(2) + "s",
      status: responseData.status,
      prompt_tokens: responseBody?.usage?.prompt_tokens,
      completion_tokens: responseBody?.usage?.completion_tokens,
      total_tokens: totalTokens,
      cost: cost.toFixed(6),
      success: responseData.status < 400,
    });

    // Send telemetry using PostHog
    try {
      // Initialize or use existing PostHog client
      let client: PostHog;

      if (
        typeof apiKeyOrPostHogClient === "object" &&
        apiKeyOrPostHogClient !== null
      ) {
        // Use the provided PostHog client instance
        client = apiKeyOrPostHogClient;
      } else {
        // Initialize a new PostHog client with the provided API key or default
        client = new PostHog(
          typeof apiKeyOrPostHogClient === "string"
            ? apiKeyOrPostHogClient
            : "phc_anonymous",
          {
            host: "https://i.bltfdy.co", // PostHog instance URL
            flushAt: 1, // Send event immediately
            flushInterval: 0, // Disable automatic flushing
          },
        );
      }

      // Generate a consistent distinct ID based on some properties of the request
      // This is simplified; in production you'd want a more robust ID strategy
      const distinctId = `llm_${requestBody?.model || "unknown"}_${Date.now()}`;

      // Check if response is a successful completion (not an error)
      const isSuccessfulResponse = responseData.status < 400 &&
        "usage" in responseBody &&
        responseBody.usage !== undefined;

      // Prepare PostHog event with proper AI properties following PostHog conventions
      client.capture({
        distinctId,
        event: "llm_api_request",
        properties: {
          // PostHog AI schema properties
          "$ai_provider": "openai",
          "$ai_model": requestBody?.model,
          "$ai_input_tokens": isSuccessfulResponse
            ? responseBody.usage?.prompt_tokens
            : undefined,
          "$ai_output_tokens": isSuccessfulResponse
            ? responseBody.usage?.completion_tokens
            : undefined,
          "$ai_total_tokens": totalTokens,
          "$ai_latency": latency,
          "$ai_response_id": isSuccessfulResponse ? responseBody.id : undefined,
          "$ai_is_error": responseData.status >= 400,
          "$ai_http_status": responseData.status,

          // Custom properties
          "url": url,
          "endpoint": endpoint,
          "timestamp": new Date().toISOString(),
          "cost": cost,
          "success": responseData.status < 400,
          "model_parameters": {
            temperature: requestBody?.temperature,
            max_tokens: requestBody?.max_tokens,
            top_p: requestBody?.top_p,
          },
        },
      });

      // Flush events to ensure they're sent immediately
      await client.flush();
      logger.debug("Sent telemetry to PostHog");
    } catch (error) {
      logger.debug("Error sending telemetry to PostHog", error);
    }
  } catch (error) {
    logger.error(`Error logging LLM event`, error);
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
