const logger = console;
function createOpenAIFetch(options) {
  let posthogClient = options.posthogClient;
  async function trackLlmEvent(req, res, startTime) {
    if (!posthogClient && options.posthogApiKey) {
      const { PostHog } = await import("posthog-node");
      posthogClient = new PostHog(options.posthogApiKey, {
        host: options.posthogHost
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
      const endpoint = parts.length > 1 ? parts.slice(1).join(".") : parts[0] || url;
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
        "$ai_is_error": res.status >= 400
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
      if (requestBody?.temperature || requestBody?.max_tokens || requestBody?.top_p) {
        properties["$ai_model_parameters"] = {
          temperature: requestBody.temperature,
          max_tokens: requestBody.max_tokens,
          top_p: requestBody.top_p
        };
      }
      if (responseBody?.id) {
        properties["$ai_response_id"] = responseBody.id;
      }
      if (responseBody?.usage?.prompt_tokens && responseBody?.usage?.completion_tokens) {
        properties["$ai_total_tokens"] = responseBody.usage.prompt_tokens + responseBody.usage.completion_tokens;
      }
      if (requestBody?.model && responseBody?.usage) {
        properties["$ai_cost"] = calculateLlmCost(
          requestBody.model,
          responseBody.usage.prompt_tokens || 0,
          responseBody.usage.completion_tokens || 0
        );
      }
      posthogClient.capture({
        event: "$ai_generation",
        distinctId: "bolt-foundry",
        properties
      });
      logger.debug(`Tracked LLM event: ${endpoint}`, {
        latency,
        status: res.status
      });
    } catch (error) {
      logger.error(`Error tracking LLM event`, error);
    }
  }
  function calculateLlmCost(model, inputTokens, outputTokens) {
    const pricing = {
      "gpt-4o": { input: 25e-4, output: 0.01 },
      "gpt-3.5-turbo": { input: 1e-3, output: 2e-3 }
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
            Authorization: `Bearer ${options.openAiApiKey}`
          };
        }
      } else {
        newInit.headers = {
          Authorization: `Bearer ${options.openAiApiKey}`
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
export {
  createOpenAIFetch
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcGFja2FnZXMvYm9sdC1mb3VuZHJ5L2JvbHQtZm91bmRyeS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHR5cGUgeyBQb3N0SG9nIH0gZnJvbSBcInBvc3Rob2ctbm9kZVwiO1xuY29uc3QgbG9nZ2VyID0gY29uc29sZVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIE9wZW5BSSBBUEkgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgdHlwZSBPcGVuQWlPcHRpb25zID0ge1xuICAvKipcbiAgICogVGhlIE9wZW5BSSBBUEkga2V5IHRvIHVzZSBmb3IgYXV0aGVudGljYXRpb25cbiAgICovXG4gIG9wZW5BaUFwaUtleTogc3RyaW5nO1xuICAvKipcbiAgICogT3B0aW9uYWwgUG9zdEhvZyBjbGllbnQgZm9yIGFuYWx5dGljcyB0cmFja2luZ1xuICAgKi9cbiAgcG9zdGhvZ0NsaWVudD86IFBvc3RIb2c7XG4gIC8qKlxuICAgKiBPcHRpb25hbCBQb3N0SG9nIEFQSSBrZXkgKGFsdGVybmF0aXZlIHRvIHByb3ZpZGluZyBhIGNsaWVudClcbiAgICovXG4gIHBvc3Rob2dBcGlLZXk/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBPcHRpb25hbCBQb3N0SG9nIGhvc3QgVVJMIChkZWZhdWx0cyB0byBhcHAucG9zdGhvZy5jb20pXG4gICAqL1xuICBwb3N0aG9nSG9zdD86IHN0cmluZztcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHdyYXBwZWQgZmV0Y2ggZnVuY3Rpb24gdGhhdCBhZGRzIG5lY2Vzc2FyeSBoZWFkZXJzIGFuZCBoYW5kbGVzIE9wZW5BSSBBUEkgcmVxdWVzdHMuXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIGFkZHMgYXV0aGVudGljYXRpb24gaGVhZGVycywgcHJlc2VydmVzIEZvcm1EYXRhIHJlcXVlc3RzLCBhbmQgdHJhY2tzIGFuYWx5dGljcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9wZW5BSUZldGNoKG9wdGlvbnM6IE9wZW5BaU9wdGlvbnMpOiB0eXBlb2YgZmV0Y2gge1xuICBsZXQgcG9zdGhvZ0NsaWVudDogUG9zdEhvZyB8IHVuZGVmaW5lZCA9IG9wdGlvbnMucG9zdGhvZ0NsaWVudDtcblxuICBhc3luYyBmdW5jdGlvbiB0cmFja0xsbUV2ZW50KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgc3RhcnRUaW1lOiBudW1iZXIpIHtcbiAgICAvLyBJbml0aWFsaXplIFBvc3RIb2cgY2xpZW50IGlmIEFQSSBrZXkgaXMgcHJvdmlkZWQgYW5kIGNsaWVudCBpc24ndFxuICAgIGlmICghcG9zdGhvZ0NsaWVudCAmJiBvcHRpb25zLnBvc3Rob2dBcGlLZXkpIHtcbiAgICAgIGNvbnN0IHsgUG9zdEhvZyB9ID0gYXdhaXQgaW1wb3J0KFwicG9zdGhvZy1ub2RlXCIpO1xuICAgICAgcG9zdGhvZ0NsaWVudCA9IG5ldyBQb3N0SG9nKG9wdGlvbnMucG9zdGhvZ0FwaUtleSwge1xuICAgICAgICBob3N0OiBvcHRpb25zLnBvc3Rob2dIb3N0LFxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIEVuc3VyZSBQb3N0SG9nIGNsaWVudCBpcyBhdmFpbGFibGVcbiAgICBpZiAoIXBvc3Rob2dDbGllbnQpIHtcbiAgICAgIGxvZ2dlci53YXJuKFwiUG9zdEhvZyBjbGllbnQgbm90IGF2YWlsYWJsZSwgc2tpcHBpbmcgTExNIGV2ZW50IHRyYWNraW5nXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgY29uc3QgbGF0ZW5jeSA9IChub3cgLSBzdGFydFRpbWUpIC8gMTAwMDsgLy8gQ29udmVydCB0byBzZWNvbmRzIGZvciBQb3N0SG9nXG4gICAgICBjb25zdCB1cmwgPSByZXEudXJsLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCB1cmxQYXRoID0gdXJsLnNwbGl0KFwiYXBpLm9wZW5haS5jb21cIilbMV0gfHwgXCJcIjtcbiAgICAgIGNvbnN0IHBhcnRzID0gdXJsUGF0aC5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgY29uc3QgZW5kcG9pbnQgPSBwYXJ0cy5sZW5ndGggPiAxXG4gICAgICAgID8gcGFydHMuc2xpY2UoMSkuam9pbihcIi5cIilcbiAgICAgICAgOiAocGFydHNbMF0gfHwgdXJsKTtcblxuICAgICAgLy8gQ2xvbmUgdGhlIHJlcXVlc3QgdG8gcmVhZCBpdHMgYm9keSB3aXRob3V0IG1vZGlmeWluZyB0aGUgb3JpZ2luYWxcbiAgICAgIGNvbnN0IHJlcXVlc3RDbG9uZSA9IHJlcS5jbG9uZSgpO1xuICAgICAgbGV0IHJlcXVlc3RCb2R5O1xuICAgICAgbGV0IHJlc3BvbnNlQm9keTtcblxuICAgICAgLy8gR2V0IHRoZSByZXF1ZXN0IGJvZHkgaWYgcG9zc2libGVcbiAgICAgIGlmIChyZXF1ZXN0Q2xvbmUuYm9keSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlcXVlc3REYXRhID0gYXdhaXQgcmVxdWVzdENsb25lLnRleHQoKTtcbiAgICAgICAgICByZXF1ZXN0Qm9keSA9IEpTT04ucGFyc2UocmVxdWVzdERhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKFwiQ291bGQgbm90IHBhcnNlIHJlcXVlc3QgYm9keVwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBHZXQgdGhlIHJlc3BvbnNlIGJvZHkgaWYgcG9zc2libGVcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQ2xvbmUgPSByZXMuY2xvbmUoKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzcG9uc2VDbG9uZS50ZXh0KCk7XG4gICAgICAgIHJlc3BvbnNlQm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2VEYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKFwiQ291bGQgbm90IHBhcnNlIHJlc3BvbnNlIGJvZHlcIiwgZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgcHJvcGVydGllcyBhY2NvcmRpbmcgdG8gUG9zdEhvZyBMTE0gb2JzZXJ2YWJpbGl0eSBzY2hlbWFcbiAgICAgIGNvbnN0IHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge1xuICAgICAgICBcIiRhaV9wcm92aWRlclwiOiBcIm9wZW5haVwiLFxuICAgICAgICBcIiRhaV9sYXRlbmN5XCI6IGxhdGVuY3ksXG4gICAgICAgIFwiJGFpX2h0dHBfc3RhdHVzXCI6IHJlcy5zdGF0dXMsXG4gICAgICAgIFwiJGFpX2Jhc2VfdXJsXCI6IFwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MVwiLFxuICAgICAgICBcIiRhaV9pc19lcnJvclwiOiByZXMuc3RhdHVzID49IDQwMCxcbiAgICAgIH07XG5cbiAgICAgIC8vIEFkZCBlcnJvciBpbmZvcm1hdGlvbiBpZiBhcHBsaWNhYmxlXG4gICAgICBpZiAocmVzLnN0YXR1cyA+PSA0MDAgJiYgcmVzcG9uc2VCb2R5Py5lcnJvcikge1xuICAgICAgICBwcm9wZXJ0aWVzW1wiJGFpX2Vycm9yXCJdID0gcmVzcG9uc2VCb2R5LmVycm9yO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgbW9kZWwgaW5mb3JtYXRpb24gaWYgYXZhaWxhYmxlXG4gICAgICBpZiAocmVxdWVzdEJvZHk/Lm1vZGVsKSB7XG4gICAgICAgIHByb3BlcnRpZXNbXCIkYWlfbW9kZWxcIl0gPSByZXF1ZXN0Qm9keS5tb2RlbDtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIGNoYXQgY29tcGxldGlvbnNcbiAgICAgIHByb3BlcnRpZXNbXCIkYWlfaW5wdXRcIl0gPSByZXF1ZXN0Qm9keT8ubWVzc2FnZXM7XG5cbiAgICAgIGlmIChyZXNwb25zZUJvZHk/LnVzYWdlPy5wcm9tcHRfdG9rZW5zKSB7XG4gICAgICAgIHByb3BlcnRpZXNbXCIkYWlfaW5wdXRfdG9rZW5zXCJdID0gcmVzcG9uc2VCb2R5LnVzYWdlLnByb21wdF90b2tlbnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZUJvZHk/LnVzYWdlPy5jb21wbGV0aW9uX3Rva2Vucykge1xuICAgICAgICBwcm9wZXJ0aWVzW1wiJGFpX291dHB1dF90b2tlbnNcIl0gPSByZXNwb25zZUJvZHkudXNhZ2UuY29tcGxldGlvbl90b2tlbnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZUJvZHk/LmNob2ljZXMpIHtcbiAgICAgICAgcHJvcGVydGllc1tcIiRhaV9vdXRwdXRfY2hvaWNlc1wiXSA9IHJlc3BvbnNlQm9keS5jaG9pY2VzO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgbW9kZWwgcGFyYW1ldGVyc1xuICAgICAgaWYgKFxuICAgICAgICByZXF1ZXN0Qm9keT8udGVtcGVyYXR1cmUgfHwgcmVxdWVzdEJvZHk/Lm1heF90b2tlbnMgfHxcbiAgICAgICAgcmVxdWVzdEJvZHk/LnRvcF9wXG4gICAgICApIHtcbiAgICAgICAgcHJvcGVydGllc1tcIiRhaV9tb2RlbF9wYXJhbWV0ZXJzXCJdID0ge1xuICAgICAgICAgIHRlbXBlcmF0dXJlOiByZXF1ZXN0Qm9keS50ZW1wZXJhdHVyZSxcbiAgICAgICAgICBtYXhfdG9rZW5zOiByZXF1ZXN0Qm9keS5tYXhfdG9rZW5zLFxuICAgICAgICAgIHRvcF9wOiByZXF1ZXN0Qm9keS50b3BfcCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlQm9keT8uaWQpIHtcbiAgICAgICAgcHJvcGVydGllc1tcIiRhaV9yZXNwb25zZV9pZFwiXSA9IHJlc3BvbnNlQm9keS5pZDtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FsY3VsYXRlIHRvdGFsIHRva2VucyBpZiBuZWVkZWRcbiAgICAgIGlmIChcbiAgICAgICAgcmVzcG9uc2VCb2R5Py51c2FnZT8ucHJvbXB0X3Rva2VucyAmJlxuICAgICAgICByZXNwb25zZUJvZHk/LnVzYWdlPy5jb21wbGV0aW9uX3Rva2Vuc1xuICAgICAgKSB7XG4gICAgICAgIHByb3BlcnRpZXNbXCIkYWlfdG90YWxfdG9rZW5zXCJdID0gcmVzcG9uc2VCb2R5LnVzYWdlLnByb21wdF90b2tlbnMgK1xuICAgICAgICAgIHJlc3BvbnNlQm9keS51c2FnZS5jb21wbGV0aW9uX3Rva2VucztcbiAgICAgIH1cblxuICAgICAgLy8gQ2FsY3VsYXRlIGFwcHJveGltYXRlIGNvc3QgaWYgcG9zc2libGVcbiAgICAgIGlmIChyZXF1ZXN0Qm9keT8ubW9kZWwgJiYgcmVzcG9uc2VCb2R5Py51c2FnZSkge1xuICAgICAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBjYWxjdWxhdGlvbiBhbmQgc2hvdWxkIGJlIGltcHJvdmVkIHdpdGggYWN0dWFsIHByaWNpbmdcbiAgICAgICAgcHJvcGVydGllc1tcIiRhaV9jb3N0XCJdID0gY2FsY3VsYXRlTGxtQ29zdChcbiAgICAgICAgICByZXF1ZXN0Qm9keS5tb2RlbCxcbiAgICAgICAgICByZXNwb25zZUJvZHkudXNhZ2UucHJvbXB0X3Rva2VucyB8fCAwLFxuICAgICAgICAgIHJlc3BvbnNlQm9keS51c2FnZS5jb21wbGV0aW9uX3Rva2VucyB8fCAwLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBwb3N0aG9nQ2xpZW50LmNhcHR1cmUoe1xuICAgICAgICBldmVudDogXCIkYWlfZ2VuZXJhdGlvblwiLFxuICAgICAgICBkaXN0aW5jdElkOiBcImJvbHQtZm91bmRyeVwiLFxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuICAgICAgfSk7XG5cbiAgICAgIGxvZ2dlci5kZWJ1ZyhgVHJhY2tlZCBMTE0gZXZlbnQ6ICR7ZW5kcG9pbnR9YCwge1xuICAgICAgICBsYXRlbmN5LFxuICAgICAgICBzdGF0dXM6IHJlcy5zdGF0dXMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nZ2VyLmVycm9yKGBFcnJvciB0cmFja2luZyBMTE0gZXZlbnRgLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBhcHByb3hpbWF0ZSBMTE0gY29zdFxuICBmdW5jdGlvbiBjYWxjdWxhdGVMbG1Db3N0KFxuICAgIG1vZGVsOiBzdHJpbmcsXG4gICAgaW5wdXRUb2tlbnM6IG51bWJlcixcbiAgICBvdXRwdXRUb2tlbnM6IG51bWJlcixcbiAgKTogbnVtYmVyIHtcbiAgICBjb25zdCBwcmljaW5nOiBSZWNvcmQ8c3RyaW5nLCB7IGlucHV0OiBudW1iZXI7IG91dHB1dDogbnVtYmVyIH0+ID0ge1xuICAgICAgXCJncHQtNG9cIjogeyBpbnB1dDogMC4wMDI1LCBvdXRwdXQ6IDAuMDEwIH0sXG4gICAgICBcImdwdC0zLjUtdHVyYm9cIjogeyBpbnB1dDogMC4wMDEwLCBvdXRwdXQ6IDAuMDAyMCB9LFxuICAgIH07XG5cbiAgICAvLyBEZWZhdWx0IHRvIGdwdC0zLjUtdHVyYm8gcHJpY2luZyBpZiBtb2RlbCBub3QgZm91bmRcbiAgICBjb25zdCBtb2RlbFByaWNpbmcgPSBwcmljaW5nW21vZGVsXSB8fCBwcmljaW5nW1wiZ3B0LTMuNS10dXJib1wiXTtcblxuICAgIGNvbnN0IGlucHV0Q29zdCA9IChpbnB1dFRva2VucyAvIDEwMDApICogbW9kZWxQcmljaW5nLmlucHV0O1xuICAgIGNvbnN0IG91dHB1dENvc3QgPSAob3V0cHV0VG9rZW5zIC8gMTAwMCkgKiBtb2RlbFByaWNpbmcub3V0cHV0O1xuXG4gICAgcmV0dXJuIGlucHV0Q29zdCArIG91dHB1dENvc3Q7XG4gIH1cbiAgLy8gRW5oYW5jZWQgZmV0Y2ggZnVuY3Rpb24gd2l0aCBhbmFseXRpY3NcbiAgYXN5bmMgZnVuY3Rpb24gZW5oYW5jZWRGZXRjaChcbiAgICBpbnB1dDogUmVxdWVzdEluZm8gfCBVUkwsXG4gICAgaW5pdD86IFJlcXVlc3RJbml0LFxuICApOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gICAgY29uc3QgdXJsID0gaW5wdXQudG9TdHJpbmcoKTtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgLy8gT25seSBhZGQgYXV0aCBoZWFkZXJzIGFuZCB0cmFjayBhbmFseXRpY3MgZm9yIE9wZW5BSSBBUEkgcmVxdWVzdHNcbiAgICBpZiAodXJsLmluY2x1ZGVzKFwiYXBpLm9wZW5haS5jb21cIikpIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhgQm9sdCBGb3VuZHJ5IGludGVyY2VwdGluZyBPcGVuQUkgcmVxdWVzdDogJHt1cmx9YCk7XG5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBpbml0IG9iamVjdCB0byBhdm9pZCBtb2RpZnlpbmcgdGhlIG9yaWdpbmFsXG4gICAgICBjb25zdCBuZXdJbml0ID0geyAuLi5pbml0IH07XG5cbiAgICAgIC8vIEhhbmRsZSBoZWFkZXJzIGRpZmZlcmVudGx5IGJhc2VkIG9uIHRoZWlyIHR5cGVcbiAgICAgIGlmIChpbml0Py5oZWFkZXJzKSB7XG4gICAgICAgIC8vIElmIGhlYWRlcnMgaXMgYWxyZWFkeSBhIEhlYWRlcnMgb2JqZWN0XG4gICAgICAgIGlmIChpbml0LmhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKGluaXQuaGVhZGVycyk7XG4gICAgICAgICAgaGVhZGVycy5zZXQoXCJBdXRob3JpemF0aW9uXCIsIGBCZWFyZXIgJHtvcHRpb25zLm9wZW5BaUFwaUtleX1gKTtcbiAgICAgICAgICBuZXdJbml0LmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgICB9IC8vIElmIGhlYWRlcnMgaXMgYSBwbGFpbiBvYmplY3RcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGluaXQuaGVhZGVycyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIG5ld0luaXQuaGVhZGVycyA9IHtcbiAgICAgICAgICAgIC4uLmluaXQuaGVhZGVycyxcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtvcHRpb25zLm9wZW5BaUFwaUtleX1gLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIGhlYWRlcnMgcHJvdmlkZWQsIGNyZWF0ZSBuZXcgb25lc1xuICAgICAgICBuZXdJbml0LmhlYWRlcnMgPSB7XG4gICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke29wdGlvbnMub3BlbkFpQXBpS2V5fWAsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGxvZ2dlci5kZWJ1ZyhcIkFkZGVkIGF1dGhvcml6YXRpb24gaGVhZGVyIHRvIE9wZW5BSSByZXF1ZXN0XCIpO1xuICAgICAgY29uc3QgY2xvbmVkUmVxID0gbmV3IFJlcXVlc3QoaW5wdXQsIG5ld0luaXQpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChpbnB1dCwgbmV3SW5pdCk7XG4gICAgICBjb25zdCBjbG9uZWRSZXMgPSByZXNwb25zZS5jbG9uZSgpO1xuICAgICAgYXdhaXQgdHJhY2tMbG1FdmVudChjbG9uZWRSZXEsIGNsb25lZFJlcywgc3RhcnRUaW1lKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvLyBGb3Igbm9uLU9wZW5BSSByZXF1ZXN0cywgcGFzcyB0aHJvdWdoIHdpdGhvdXQgbW9kaWZpY2F0aW9uXG4gICAgbG9nZ2VyLmRlYnVnKGBCb2x0IEZvdW5kcnkgcGFzc2luZyB0aHJvdWdoIHJlcXVlc3Q6ICR7dXJsfWApO1xuICAgIHJldHVybiBmZXRjaChpbnB1dCwgaW5pdCk7XG4gIH1cblxuICByZXR1cm4gZW5oYW5jZWRGZXRjaDtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICJBQUNBLE1BQU0sU0FBUztBQTRCUixTQUFTLGtCQUFrQixTQUFzQztBQUN0RSxNQUFJLGdCQUFxQyxRQUFRO0FBRWpELGlCQUFlLGNBQWMsS0FBYyxLQUFlLFdBQW1CO0FBRTNFLFFBQUksQ0FBQyxpQkFBaUIsUUFBUSxlQUFlO0FBQzNDLFlBQU0sRUFBRSxR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
