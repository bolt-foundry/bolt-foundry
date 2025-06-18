import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: Array<OpenRouterMessage>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  [key: string]: unknown;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterStreamChunk {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

// Get common headers for OpenRouter API
function getHeaders(apiKey: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    "HTTP-Referer": "https://boltfoundry.com",
    "X-Title": "Bolt Foundry AI"
  };
}

// Make a non-streaming request to OpenRouter (returns just the content)
export async function sendToOpenRouter(request: OpenRouterRequest): Promise<string> {
  const response = await sendToOpenRouterWithDetails(request);
  return response.content;
}

// Interface for model pricing from OpenRouter
export interface ModelPricing {
  prompt: number;
  completion: number;
  image?: number;
  request?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  pricing: ModelPricing;
}

// Cache for model pricing to avoid repeated API calls
const modelPricingCache = new Map<string, ModelPricing>();

// Get model pricing information from OpenRouter
export async function getModelPricing(modelId: string): Promise<ModelPricing | null> {
  // Check cache first
  if (modelPricingCache.has(modelId)) {
    return modelPricingCache.get(modelId)!;
  }

  const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://boltfoundry.com",
        "X-Title": "Bolt Foundry AI"
      }
    });

    if (!response.ok) {
      console.error(`Failed to get models: ${response.status}`);
      return null;
    }

    const data = await response.json() as { data: ModelInfo[] };
    
    // Cache all model pricing
    for (const model of data.data) {
      if (model.pricing) {
        modelPricingCache.set(model.id, model.pricing);
      }
    }
    
    return modelPricingCache.get(modelId) || null;
  } catch (error) {
    console.error("Error fetching model pricing:", error);
    return null;
  }
}

// Calculate cost based on token usage and model pricing
export function calculateCost(usage: { prompt_tokens: number; completion_tokens: number }, pricing: ModelPricing): number {
  // Pricing is typically per token, not per million tokens
  const promptCost = usage.prompt_tokens * pricing.prompt;
  const completionCost = usage.completion_tokens * pricing.completion;
  return promptCost + completionCost;
}

// Make a non-streaming request to OpenRouter (returns full response details)
export async function sendToOpenRouterWithDetails(request: OpenRouterRequest): Promise<{
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  id?: string;
  totalCost?: number;
}> {
  const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: getHeaders(apiKey),
    body: JSON.stringify({
      ...request,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json() as OpenRouterResponse;
  
  if (data.choices && data.choices.length > 0) {
    let totalCost: number | undefined;
    
    // Calculate cost based on usage and model pricing
    if (data.usage && request.model) {
      const pricing = await getModelPricing(request.model);
      if (pricing) {
        totalCost = calculateCost(data.usage, pricing);
      }
    }
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      id: data.id,
      totalCost
    };
  }
  
  throw new Error("No response from OpenRouter");
}

// Stream responses from OpenRouter
export async function* streamFromOpenRouter(request: OpenRouterRequest): AsyncGenerator<string> {
  const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: getHeaders(apiKey),
    body: JSON.stringify({
      ...request,
      stream: true
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    
    // Keep the last line in buffer if it's incomplete
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      
      if (trimmed.startsWith("data: ")) {
        try {
          const data = JSON.parse(trimmed.slice(6)) as OpenRouterStreamChunk;
          const content = data.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Ignore parse errors for malformed chunks
        }
      }
    }
  }
}

// Helper to collect all chunks from a stream into a single response
export async function collectStream(request: OpenRouterRequest): Promise<string> {
  let fullResponse = "";
  
  for await (const chunk of streamFromOpenRouter(request)) {
    fullResponse += chunk;
  }
  
  return fullResponse;
}