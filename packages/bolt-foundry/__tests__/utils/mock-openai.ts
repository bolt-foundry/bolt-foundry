
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

type Message = {
  role: string;
  content: string;
};

type CreateChatCompletionRequest = {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  response_format?: {
    type: string;
    schema?: Record<string, unknown>;
  };
  user?: string;
};

type CreateChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: Message;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Creates a mock OpenAI API client for testing.
 * This returns predictable responses without making actual API calls.
 */
export function createMockOpenAi() {
  logger.info("Creating mock OpenAI client");
  
  return {
    chat: {
      completions: {
        create: async (
          params: CreateChatCompletionRequest
        ): Promise<CreateChatCompletionResponse> => {
          logger.debug("Mock OpenAI API call:", params);
          
          // Extract the last user message to base the response on
          const lastUserMessage = [...params.messages]
            .reverse()
            .find(msg => msg.role === "user")?.content || "";
          
          // Generate a simple response
          const mockResponse: CreateChatCompletionResponse = {
            id: `mockid-${Date.now()}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: params.model,
            choices: [
              {
                index: 0,
                message: {
                  role: "assistant",
                  content: generateMockResponse(lastUserMessage, params),
                },
                finish_reason: "stop",
              },
            ],
            usage: {
              prompt_tokens: calculateTokens(params.messages),
              completion_tokens: 50,
              total_tokens: calculateTokens(params.messages) + 50,
            },
          };
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          return mockResponse;
        },
      },
    },
    embeddings: {
      create: async (params: { input: string | string[] }) => {
        logger.debug("Mock embeddings API call:", params);
        
        const input = Array.isArray(params.input) ? params.input : [params.input];
        
        return {
          object: "list",
          data: input.map((text, i) => ({
            object: "embedding",
            embedding: Array(1536).fill(0).map(() => Math.random() * 2 - 1),
            index: i,
          })),
          model: "text-embedding-ada-002",
          usage: {
            prompt_tokens: calculateTokens(input),
            total_tokens: calculateTokens(input),
          },
        };
      },
    },
  };
}

/**
 * Generate a response based on the user's message or schema if provided
 */
function generateMockResponse(
  userMessage: string, 
  params: CreateChatCompletionRequest
): string {
  // If response format with schema is provided, generate a JSON response matching the schema
  if (params.response_format?.type === "json_object" && params.response_format.schema) {
    return generateJsonResponse(userMessage, params.response_format.schema);
  }
  
  // If the message is about tweets or formatting
  if (userMessage.toLowerCase().includes("tweet")) {
    return JSON.stringify({
      suggestions: [
        {
          tweet: "This is a mock tweet suggestion.",
          explanation: "This is a mock explanation for the tweet suggestion."
        },
        {
          tweet: "Here's another tweet suggestion from the mock API.",
          explanation: "This is why this tweet might work better."
        }
      ]
    });
  }
  
  if (userMessage.toLowerCase().includes("blog") || userMessage.toLowerCase().includes("revision")) {
    return JSON.stringify({
      revisions: [
        {
          revisionTitle: "Improve sentence structure",
          original: "The original text that needs revision.",
          instructions: "Shorten sentences and use more active voice.",
          revision: "The revised text with improved structure.",
          explanation: "The sentences were shortened and active voice was used."
        }
      ]
    });
  }
  
  // Default response
  return `Mock response to: "${userMessage}"`;
}

/**
 * Generate a JSON response that matches the provided schema
 */
function generateJsonResponse(userMessage: string, schema: Record<string, unknown>): string {
  // This is a simplified implementation - in a real mock you might want to 
  // analyze the schema more thoroughly to generate appropriate values
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        // If it's an array, create 2 mock items
        result[key] = [generateMockItem(value[0]), generateMockItem(value[0])];
      } else {
        // Recursively handle nested objects
        result[key] = generateJsonResponse(userMessage, value as Record<string, unknown>);
      }
    } else {
      // Handle primitive types
      switch (value) {
        case 'string':
          result[key] = `Mock ${key}`;
          break;
        case 'number':
          result[key] = 42;
          break;
        case 'boolean':
          result[key] = true;
          break;
        default:
          result[key] = null;
      }
    }
  }
  
  return JSON.stringify(result);
}

/**
 * Generate a mock item for an array based on its type
 */
function generateMockItem(type: unknown): unknown {
  if (typeof type === 'object' && type !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(type as Record<string, unknown>)) {
      if (typeof value === 'string') {
        result[key] = `Mock ${key}`;
      } else if (typeof value === 'number') {
        result[key] = 42;
      } else if (typeof value === 'boolean') {
        result[key] = true;
      } else if (Array.isArray(value)) {
        result[key] = [generateMockItem(value[0])];
      } else if (typeof value === 'object' && value !== null) {
        result[key] = generateMockItem(value);
      } else {
        result[key] = null;
      }
    }
    return result;
  }
  
  // Handle primitive types
  if (typeof type === 'string') return "Mock string";
  if (typeof type === 'number') return 42;
  if (typeof type === 'boolean') return true;
  
  return null;
}

/**
 * Simple token calculation (approximate)
 */
function calculateTokens(messages: Message[] | string[]): number {
  let totalLength = 0;
  
  if (Array.isArray(messages)) {
    if (typeof messages[0] === 'string') {
      // String array
      totalLength = (messages as string[]).reduce((sum, msg) => sum + msg.length, 0);
    } else {
      // Message array
      totalLength = (messages as Message[]).reduce((sum, msg) => sum + msg.content.length, 0);
    }
  }
  
  // Approximate token count (4 characters per token is a rough estimate)
  return Math.ceil(totalLength / 4);
}
