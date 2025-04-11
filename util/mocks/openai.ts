
import { getLogger } from "packages/logger/logger.ts"
const logger = getLogger(import.meta)
/**
 * Mock implementation of the OpenAI API for testing purposes
 * This allows tests to run without making actual API calls to OpenAI
 */

// Define common types to match OpenAI SDK structure
type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
};

type ChatCompletionCreateParams = {
  model: string;
  messages: ChatCompletionRequestMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
};

type ChatCompletion = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    index: number;
    message: ChatCompletionRequestMessage;
    finish_reason: string;
  }[];
};

// Mock OpenAI class implementation
export class OpenAI {
  apiKey: string;
  fetch: typeof fetch;

  constructor(options: { apiKey?: string; fetch?: typeof fetch }) {
    logger.warn("Using mock OpenAI implementation")
    this.apiKey = options.apiKey || "";
    this.fetch = options.fetch || globalThis.fetch;
  }

  chat = {
    completions: {
      create: (_params: ChatCompletionCreateParams): Promise<ChatCompletion> => {
        // Check if API key is configured
        if (!this.apiKey || this.apiKey === "fake-key") {
          return Promise.reject(new Error("No AI API keys configured"));
        }

        // Create a mock response
        return Promise.resolve({
          id: `mock-completion-${Date.now()}`,
          object: "chat.completion",
          created: Date.now(),
          model: _params.model,
          usage: {
            prompt_tokens: 20,
            completion_tokens: 30,
            total_tokens: 50,
          },
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content:
                  `This is a mock response from the ${_params.model} model.`,
              },
              finish_reason: "stop",
            },
          ],
        });
      },
    },
  };

  // Add basic completions API for backwards compatibility
  completions = {
    create: (params: {
      model: string;
      prompt: string | string[];
      max_tokens?: number;
      temperature?: number;
    }) => {
      // Check if API key is configured
      if (!this.apiKey || this.apiKey === "fake-key") {
        return Promise.reject(new Error("No AI API keys configured"));
      }

      const prompt = Array.isArray(params.prompt)
        ? params.prompt[0]
        : params.prompt;

      return Promise.resolve({
        id: `mock-completion-${Date.now()}`,
        object: "text_completion",
        created: Date.now(),
        model: params.model,
        choices: [
          {
            text: `This is a mock completion response for prompt: "${prompt}"`,
            index: 0,
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      });
    },
  };
}

export default {
  OpenAI,
};
