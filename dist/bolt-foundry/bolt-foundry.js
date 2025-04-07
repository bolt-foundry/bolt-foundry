import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger("bolt-foundry");
logger.setLevel(logger.levels.DEBUG);
function createOpenAIFetch(options) {
  let posthogClient = options.posthogClient;
  async function trackLlmEvent(req, res, startTime) {
    if (!posthogClient && options.posthogApiKey) {
      const { PostHog } = await import("posthog-node");
      posthogClient = new PostHog(options.posthogApiKey, {
        host: options.posthogHost,
      });
    }
    if (!posthogClient) {
      logger.warn("PostHog client not available, skipping LLM event tracking");
      return;
    }
    try {
      const now = Date.now();
      const latency = (now - startTime) / 1e3;
      const url = req.url.toString();
      const urlPath = url.split("api.openai.com")[1] || "";
      const parts = urlPath.split("/").filter(Boolean);
      const endpoint = parts.length > 1
        ? parts.slice(1).join(".")
        : parts[0] || url;
      const requestClone = req.clone();
      let requestBody;
      let responseBody;
      if (requestClone.body) {
        try {
          const requestData = await requestClone.text();
          requestBody = JSON.parse(requestData);
        } catch (e) {
          logger.debug("Could not parse request body", e);
        }
      }
      try {
        const responseClone = res.clone();
        const responseData = await responseClone.text();
        responseBody = JSON.parse(responseData);
      } catch (e) {
        logger.debug("Could not parse response body", e);
      }
      const properties = {
        "$ai_provider": "openai",
        "$ai_latency": latency,
        "$ai_http_status": res.status,
        "$ai_base_url": "https://api.openai.com/v1",
        "$ai_is_error": res.status >= 400,
      };
      if (res.status >= 400 && responseBody?.error) {
        properties["$ai_error"] = responseBody.error;
      }
      if (requestBody?.model) {
        properties["$ai_model"] = requestBody.model;
      }
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
      if (
        responseBody?.usage?.prompt_tokens &&
        responseBody?.usage?.completion_tokens
      ) {
        properties["$ai_total_tokens"] = responseBody.usage.prompt_tokens +
          responseBody.usage.completion_tokens;
      }
      if (requestBody?.model && responseBody?.usage) {
        properties["$ai_cost"] = calculateLlmCost(
          requestBody.model,
          responseBody.usage.prompt_tokens || 0,
          responseBody.usage.completion_tokens || 0,
        );
      }
      posthogClient.capture({
        event: "$ai_generation",
        distinctId: "bolt-foundry",
        properties,
      });
      logger.debug(`Tracked LLM event: ${endpoint}`, {
        latency,
        status: res.status,
      });
    } catch (error) {
      logger.error(`Error tracking LLM event`, error);
    }
  }
  function calculateLlmCost(model, inputTokens, outputTokens) {
    const pricing = {
      "gpt-4o": { input: 25e-4, output: 0.01 },
      "gpt-3.5-turbo": { input: 1e-3, output: 2e-3 },
    };
    const modelPricing = pricing[model] || pricing["gpt-3.5-turbo"];
    const inputCost = inputTokens / 1e3 * modelPricing.input;
    const outputCost = outputTokens / 1e3 * modelPricing.output;
    return inputCost + outputCost;
  }
  async function enhancedFetch(input, init) {
    const url = input.toString();
    const startTime = Date.now();
    if (url.includes("api.openai.com")) {
      logger.debug(`Bolt Foundry intercepting OpenAI request: ${url}`);
      const newInit = { ...init };
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          const headers = new Headers(init.headers);
          headers.set("Authorization", `Bearer ${options.openAiApiKey}`);
          newInit.headers = headers;
        } else if (typeof init.headers === "object") {
          newInit.headers = {
            ...init.headers,
            Authorization: `Bearer ${options.openAiApiKey}`,
          };
        }
      } else {
        newInit.headers = {
          Authorization: `Bearer ${options.openAiApiKey}`,
        };
      }
      logger.debug("Added authorization header to OpenAI request");
      const clonedReq = new Request(input, newInit);
      const response = await fetch(input, newInit);
      const clonedRes = response.clone();
      await trackLlmEvent(clonedReq, clonedRes, startTime);
      return response;
    }
    logger.debug(`Bolt Foundry passing through request: ${url}`);
    return fetch(input, init);
  }
  return enhancedFetch;
}
export { createOpenAIFetch };
