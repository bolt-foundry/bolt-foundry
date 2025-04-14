import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

/**
 * Logs LLM-related events to console and sends data to i.bltfdy.co
 */
export async function trackLlmEvent(
  req: Request,
  res: Response,
  startTime: number,
  bfApiKey?: string,
): Promise<void> {
  try {
    const now = Date.now();
    const latency = (now - startTime) / 1000; // Convert to seconds
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

    // Calculate total tokens if available
    let totalTokens = 0;
    if (
      responseBody?.usage?.prompt_tokens &&
      responseBody?.usage?.completion_tokens
    ) {
      totalTokens = responseBody.usage.prompt_tokens +
        responseBody.usage.completion_tokens;
    }

    // Calculate approximate cost if possible
    let cost = 0;
    if (requestBody?.model && responseBody?.usage) {
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
      status: res.status,
      prompt_tokens: responseBody?.usage?.prompt_tokens,
      completion_tokens: responseBody?.usage?.completion_tokens,
      total_tokens: totalTokens,
      cost: cost.toFixed(6),
      success: res.status < 400,
    });

    if (res.status >= 400 && responseBody?.error) {
      logger.error(
        `LLM request error: ${
          responseBody.error.message || JSON.stringify(responseBody.error)
        }`,
      );
    }

    // Send telemetry to i.bltfdy.co
    try {
      const telemetryData = {
        url,
        timestamp: new Date().toISOString(),
        latency,
        model: requestBody?.model,
        status: res.status,
        tokens: {
          prompt: responseBody?.usage?.prompt_tokens,
          completion: responseBody?.usage?.completion_tokens,
          total: totalTokens,
        },
        cost,
        success: res.status < 400,
      };

      // Fire and forget - don't wait for response
      fetch("https://i.bltfdy.co/api/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-BF-API-Key": bfApiKey || "anonymous",
        },
        body: JSON.stringify(telemetryData),
      }).catch((e) => {
        logger.debug("Failed to send telemetry to i.bltfdy.co", e);
      });
    } catch (error) {
      logger.debug("Error sending telemetry", error);
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
