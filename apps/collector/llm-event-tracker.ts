import { getLogger } from "@bolt-foundry/logger";
import { PostHog } from "posthog-node";

const logger = getLogger(import.meta);

import type { TelemetryData } from "@bfmono/packages/bolt-foundry/bolt-foundry.ts";

/**
 * Logs LLM-related events to console and sends data to PostHog
 * @param telemetryData The serialized telemetry data containing request, response and duration
 * @param apiKeyOrPostHogClient Either a PostHog API key or a PostHog client instance
 * @param options Additional options for tracking
 */
export async function trackLlmEvent(
  telemetryData: TelemetryData,
  apiKeyOrPostHogClient?: string | PostHog,
  options?: {
    distinctId?: string;
    traceId?: string;
    groups?: Record<string, string>;
    additionalProperties?: Record<string, unknown>;
    privacyMode?: boolean;
  },
): Promise<void> {
  try {
    const { request: requestData, response: responseData, duration, provider } =
      telemetryData;

    const latency = duration / 1000; // Convert to seconds (PostHog expects seconds not ms)
    const url = requestData.url;
    const urlPath = url.split("api.openai.com")[1] || "";
    const parts = urlPath.split("/").filter(Boolean);
    const endpoint = parts.length > 1
      ? parts.slice(1).join(".")
      : (parts[0] || url);

    // Get data from the serialized request and response
    const requestBody = requestData.body;
    const responseBody = responseData.body;

    // Determine if this is a token-based API call (completions, chat, embeddings)
    const isTokenBasedApi = endpoint.includes("chat.completions") ||
      endpoint.includes("completions") ||
      endpoint.includes("embeddings");

    // Check if response is a successful completion (not an error)
    const isSuccessfulResponse = responseData.status < 400;

    // Check if we have usage information
    const hasUsage = isSuccessfulResponse &&
      "usage" in responseBody &&
      responseBody.usage !== undefined;

    // Calculate total tokens if available
    let totalTokens = 0;
    let promptTokens = 0;
    let completionTokens = 0;
    let reasoningTokens = 0;
    let cacheReadInputTokens = 0;

    if (hasUsage) {
      // Extract all possible token counts from the usage object
      // #techdebt
      // deno-lint-ignore no-explicit-any
      const usage = responseBody.usage as any;
      promptTokens = usage?.prompt_tokens || 0;
      completionTokens = usage?.completion_tokens || 0;
      reasoningTokens = usage?.reasoning_tokens || 0;
      cacheReadInputTokens = usage?.cache_read_input_tokens || 0;

      // Calculate total tokens
      totalTokens = usage?.total_tokens || (promptTokens + completionTokens);
    }

    // Safely extract model from request body based on API type
    let model: string | undefined;
    if (requestBody && typeof requestBody === "object") {
      if ("model" in requestBody) {
        model = requestBody.model as string;
      } else if ("deployment" in requestBody) {
        model = requestBody.deployment as string;
      }

      // For batch operations, extract model from different locations
      if (
        !model && "requests" in requestBody &&
        Array.isArray(requestBody.requests) && requestBody.requests.length > 0
      ) {
        const firstRequest = requestBody.requests[0];
        if (
          typeof firstRequest === "object" && firstRequest &&
          "model" in firstRequest
        ) {
          model = firstRequest.model as string;
        }
      }
    }

    // Calculate approximate cost if possible
    let cost = 0;
    if (model && hasUsage) {
      cost = calculateLlmCost(
        model,
        promptTokens,
        completionTokens,
      );
    }

    // Techdebt
    // deno-lint-ignore no-explicit-any
    const modelParameters: Record<string, any> = {};

    // Common parameters across different API calls
    if (requestBody) {
      if ("temperature" in requestBody) {
        modelParameters.temperature = requestBody.temperature;
      }
      if ("max_tokens" in requestBody) {
        modelParameters.max_tokens = requestBody.max_tokens;
      }
      if ("top_p" in requestBody) modelParameters.top_p = requestBody.top_p;
      if ("frequency_penalty" in requestBody) {
        modelParameters.frequency_penalty = requestBody.frequency_penalty;
      }
      if ("presence_penalty" in requestBody) {
        modelParameters.presence_penalty = requestBody.presence_penalty;
      }
      if ("user" in requestBody) modelParameters.user = requestBody.user;

      // Chat-specific parameters
      if ("messages" in requestBody) {
        modelParameters.message_count = requestBody.messages?.length;
      }
      if ("response_format" in requestBody) {
        modelParameters.response_format = requestBody.response_format;
      }
      if ("reasoning_effort" in requestBody) {
        modelParameters.reasoning_effort = requestBody.reasoning_effort;
      }

      // Image generation parameters
      if ("size" in requestBody) modelParameters.size = requestBody.size;
      if ("quality" in requestBody) {
        modelParameters.quality = requestBody.quality;
      }
      if ("style" in requestBody) modelParameters.style = requestBody.style;

      // Embedding parameters
      if ("dimensions" in requestBody) {
        modelParameters.dimensions = requestBody.dimensions;
      }
      if ("encoding_format" in requestBody) {
        modelParameters.encoding_format = requestBody.encoding_format;
      }
    }

    // Extract tool calls if present (only available in chat completions)
    let tools;
    if (requestBody && typeof requestBody === "object") {
      if ("tools" in requestBody) {
        tools = requestBody.tools;
      } else if ("functions" in requestBody) {
        tools = requestBody.functions;
      }
    }

    // Determine the API type
    let apiType = "unknown";
    if (endpoint.includes("chat.completions")) apiType = "chat";
    else if (endpoint.includes("completions")) apiType = "completion";
    else if (endpoint.includes("embeddings")) apiType = "embedding";
    else if (endpoint.includes("images")) apiType = "image";
    else if (endpoint.includes("audio")) apiType = "audio";
    else if (endpoint.includes("files")) apiType = "file";
    else if (endpoint.includes("models")) apiType = "model";
    else if (endpoint.includes("moderations")) apiType = "moderation";
    else if (endpoint.includes("batches")) apiType = "batch";
    else if (endpoint.includes("uploads")) apiType = "upload";

    // Log basic information about the request
    logger.info(`LLM request to ${endpoint}`, {
      api_type: apiType,
      model: model,
      latency: latency.toFixed(2) + "s",
      status: responseData.status,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      reasoning_tokens: reasoningTokens,
      total_tokens: totalTokens,
      cost: cost.toFixed(6),
      success: isSuccessfulResponse,
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
            host: "https://us.i.posthog.com", // PostHog instance URL
            flushAt: 1, // Send event immediately
            flushInterval: 0, // Disable automatic flushing
          },
        );
      }

      // Use provided distinctId or generate one
      const distinctId = options?.distinctId ||
        `llm_${model || "unknown"}_${Date.now()}`;

      // Use provided traceId or generate one
      const traceId = options?.traceId ||
        `trace_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      // Determine whether to include sensitive data based on privacy mode
      const privacyMode = options?.privacyMode ?? false;

      // Extract error information if present
      const errorInfo = !isSuccessfulResponse && responseBody &&
          typeof responseBody === "object" && "error" in responseBody
        ? responseBody.error
        : undefined;

      // Build event name based on API type
      let eventName = "$ai_generation";
      if (apiType === "embedding") eventName = "$ai_embedding";
      else if (apiType === "moderation") eventName = "$ai_moderation";
      else if (apiType === "image") eventName = "$ai_image_operation";
      else if (!isTokenBasedApi) eventName = `$ai_${apiType}_operation`;

      const aiInput = (() => {
        if (requestBody && typeof requestBody === "object") {
          if ("messages" in requestBody) {
            return requestBody.messages;
          } else if ("prompt" in requestBody) {
            return requestBody.prompt;
          } else if ("input" in requestBody) {
            return requestBody.input;
          }
        }
        return undefined;
      })();

      // Prepare PostHog event with proper AI properties following PostHog conventions
      client.capture({
        distinctId,
        event: eventName,
        properties: {
          // PostHog AI schema properties
          "$ai_provider": provider || "openai",
          "$ai_model": model,
          "$ai_trace_id": traceId,
          "$ai_api_type": apiType,

          // Include input and output only if privacy mode is off
          ...(privacyMode ? {} : {
            "$ai_input": aiInput,
            "$ai_output_choices":
              isSuccessfulResponse && "choices" in responseBody
                ? responseBody.choices
                : undefined,
          }),

          "$ai_input_tokens": promptTokens || undefined,
          "$ai_output_tokens": completionTokens || undefined,
          "$ai_total_tokens": totalTokens || undefined,
          "$ai_latency": latency,
          "$ai_response_id": isSuccessfulResponse && "id" in responseBody
            ? responseBody.id
            : undefined,
          "$ai_is_error": !isSuccessfulResponse,
          "$ai_http_status": responseData.status,
          "$ai_base_url": "https://api.openai.com/v1",
          "$ai_error": errorInfo,

          // Include additional properties from the PostHog schema
          "$ai_model_parameters": modelParameters,
          "$ai_tools": tools,
          "$ai_reasoning_tokens": reasoningTokens || undefined,
          "$ai_cache_read_input_tokens": cacheReadInputTokens,

          // Custom properties
          "url": url,
          "endpoint": endpoint,
          "timestamp": new Date().toISOString(),
          "cost": cost,
          "success": isSuccessfulResponse,
          "request_method": requestData.method,

          // Include any additional properties provided
          ...(options?.additionalProperties || {}),
        },
        // Include groups if provided
        ...(options?.groups ? { groups: options.groups } : {}),
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
  // Updated pricing model to include more models
  const pricing: Record<string, { input: number; output: number }> = {
    // OpenAI models
    "gpt-4o": { input: 0.0025, output: 0.010 },
    "gpt-3.5-turbo": { input: 0.0010, output: 0.0020 },
    "gpt-4": { input: 0.03, output: 0.06 },
    "gpt-4-turbo": { input: 0.01, output: 0.03 },
    "gpt-4-vision-preview": { input: 0.01, output: 0.03 },
    "gpt-4-0125-preview": { input: 0.01, output: 0.03 },
    "gpt-4-1106-preview": { input: 0.01, output: 0.03 },
    "gpt-4-0613": { input: 0.03, output: 0.06 },
    "gpt-3.5-turbo-0125": { input: 0.0005, output: 0.0015 },
    "gpt-3.5-turbo-instruct": { input: 0.0015, output: 0.0020 },

    // OpenAI embeddings
    "text-embedding-3-small": { input: 0.00002, output: 0.00002 },
    "text-embedding-3-large": { input: 0.00013, output: 0.00013 },
    "text-embedding-ada-002": { input: 0.0001, output: 0.0001 },

    // Anthropic models
    "claude-3-opus": { input: 0.015, output: 0.075 },
    "claude-3-sonnet": { input: 0.003, output: 0.015 },
    "claude-3-haiku": { input: 0.00125, output: 0.00625 },
    "claude-3.5-sonnet": { input: 0.004, output: 0.020 },
    "claude-3.7-sonnet": { input: 0.005, output: 0.025 },

    // Mistral models
    "mistral-small": { input: 0.0020, output: 0.0060 },
    "mistral-medium": { input: 0.0080, output: 0.0240 },
    "mistral-large": { input: 0.0160, output: 0.0480 },
  };

  // Normalize model name for matching
  const normalizedModel = model.toLowerCase();

  // Look for exact match first
  let modelPricing = pricing[normalizedModel];

  // If no exact match, try to find partial match based on model family
  if (!modelPricing) {
    if (normalizedModel.includes("gpt-4-")) {
      modelPricing = pricing["gpt-4-turbo"];
    } else if (normalizedModel.includes("gpt-3.5-")) {
      // Special case for gpt-3.5-turbo-0125
      if (normalizedModel.includes("gpt-3.5-turbo-0125")) {
        modelPricing = pricing["gpt-3.5-turbo-0125"];
      } else {
        modelPricing = pricing["gpt-3.5-turbo"];
      }
    } else if (normalizedModel.includes("embedding")) {
      modelPricing = pricing["text-embedding-3-small"];
    } else if (normalizedModel.includes("claude-3-")) {
      modelPricing = pricing["claude-3-haiku"]; // Use the cheapest as default
    } else {
      // Default to gpt-3.5-turbo pricing if model not found
      modelPricing = pricing["gpt-3.5-turbo"];
    }
  }

  const inputCost = (inputTokens / 1000) * modelPricing.input;
  const outputCost = (outputTokens / 1000) * modelPricing.output;

  return inputCost + outputCost;
}
