import { getLogger } from "@bolt-foundry/logger";
const logger = getLogger(import.meta);

/**
 * A simplified mock OpenAI client that works with the bolt-foundry tests
 */
export class MockOpenAi {
  private fetchFn: typeof fetch;

  constructor(options: { fetch?: typeof fetch; apiKey?: string } = {}) {
    this.fetchFn = options.fetch || fetch;
    logger.debug("MockOpenAi initialized");

    // Set up the API structure
    this.chat = {
      completions: {
        create: this.createChatCompletion.bind(this),
      },
    };
  }

  // Public API structure mirroring OpenAI SDK
  chat: {
    completions: {
      // deno-lint-ignore no-explicit-any
      create: (params: any) => Promise<any>;
    };
  };

  /**
   * Handle chat completion requests
   */
      // deno-lint-ignore no-explicit-any
  async createChatCompletion(params: any): Promise<any> {
    logger.debug("Mock chat completion called with params:", params);

    // If a custom fetch was provided, use it to make the request
    if (this.fetchFn !== fetch) {
      try {
        const response = await this.fetchFn(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        logger.error("Error making request with custom fetch:", error);
      }
    }

    // Default mock response
    return {
      id: `chatcmpl-${Date.now().toString(36)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: params.model || "gpt-3.5-turbo",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "This is a mock response from MockOpenAi.",
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 50,
        total_tokens: 100,
      },
    };
  }
}

/**
 * Helper function to create a mock OpenAI client
 */
export function createMockOpenAi(
  options: { fetch?: typeof fetch; apiKey?: string } = {},
): MockOpenAi {
  return new MockOpenAi(options);
}
