
import { getLogger } from "packages/logger/logger.ts";
import { connectToOpenAi } from "../bolt-foundry.ts";
import { createMockOpenAi } from "./utils/mock-openai.ts";
import { assertEquals, assertStringIncludes, assertExists } from "@std/assert";

const logger = getLogger(import.meta);

// Create a global mock environment for testing
const originalFetch = globalThis.fetch;
let mockFetchImplementation: ((input: string, init?: RequestInit) => Promise<Response>) | null = null;

function setupMockFetch(): void {
  mockFetchImplementation = async (url: string, init?: RequestInit): Promise<Response> => {
    logger.debug("Mock fetch called with:", { url, init });

    // Return different responses based on the URL to simulate different API calls
    if (url.includes("openai.com") || url.includes("api.openai")) {
      // Check if Authorization header is set properly
      let authHeader = undefined;
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          authHeader = init.headers.get("Authorization");
        } else {
          // Could be a Record<string, string> or a regular object
          authHeader = (init.headers as Record<string, string>)["Authorization"];
        }
      }
      
      // Mock OpenAI response
      const responseObj = {
        id: "mock-id",
        object: "chat.completion",
        created: Date.now(),
        model: "gpt-3.5-turbo",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Mock response"
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      };

      // Use Auth header in the response so we can assert it was set correctly
      if (authHeader) {
        responseObj.id = `mock-id-with-auth-${authHeader.slice(0, 10)}`;
      }
      
      // Parse request body to check if model was standardized
      let requestBody = {};
      if (init?.body) {
        try {
          if (typeof init.body === "string") {
            requestBody = JSON.parse(init.body);
          }
        } catch (error) {
          logger.error("Failed to parse request body:", error);
        }
      }
      
      // Include the received model in the response for testing
      if (requestBody && 'model' in requestBody) {
        responseObj.model = requestBody.model as string;
      }
      
      return new Response(JSON.stringify(responseObj), {
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
    } 
    else if (url.includes("posthog")) {
      // Mock PostHog analytics response
      return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
    } 
    else {
      // Default mock response for other endpoints
      return new Response(JSON.stringify({ message: "Unhandled mock endpoint" }), {
        status: 404,
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
    }
  };

  // Replace global fetch with our mock
  globalThis.fetch = mockFetchImplementation as typeof fetch;
}

function restoreFetch(): void {
  globalThis.fetch = originalFetch;
  mockFetchImplementation = null;
}

Deno.test("bolt-foundry - interception of OpenAI API calls", async () => {
  try {
    setupMockFetch();
    
    const OPENAI_API_KEY = "test-api-key";
    const POSTHOG_API_KEY = "test-posthog-key";
    
    // Connect to OpenAI with our middleware
    const wrappedFetch = connectToOpenAi(OPENAI_API_KEY, POSTHOG_API_KEY);
    
    // Make a request to OpenAI API
    const response = await wrappedFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", // This should be standardized to gpt-3.5-turbo
        messages: [
          { role: "user", content: "Hello, world!" }
        ]
      })
    });
    
    // The response should be successful
    assertEquals(response.status, 200);
    
    // Parse the response to check our middleware's behavior
    const responseData = await response.json();
    
    // API key should have been added to the authorization header
    assertStringIncludes(responseData.id, "mock-id-with-auth-Bearer test");
    
    // Model should be standardized to gpt-3.5-turbo regardless of what was requested
    assertEquals(responseData.model, "gpt-3.5-turbo");
    
  } finally {
    restoreFetch();
  }
});

Deno.test("bolt-foundry - passes through non-OpenAI requests unchanged", async () => {
  try {
    setupMockFetch();
    
    const OPENAI_API_KEY = "test-api-key";
    const POSTHOG_API_KEY = "test-posthog-key";
    
    // Connect to OpenAI with our middleware
    const wrappedFetch = connectToOpenAi(OPENAI_API_KEY, POSTHOG_API_KEY);
    
    // Make a request to a non-OpenAI API
    const response = await wrappedFetch("https://example.com/api", {
      method: "GET"
    });
    
    // Should return the mocked 404 response for unhandled endpoints
    assertEquals(response.status, 404);
    
    const responseData = await response.json();
    assertEquals(responseData.message, "Unhandled mock endpoint");
    
  } finally {
    restoreFetch();
  }
});

Deno.test("bolt-foundry - captures analytics data for API calls", async () => {
  try {
    setupMockFetch();
    
    // Spy on fetch to track PostHog calls
    let posthogCallDetected = false;
    const originalMockFetch = mockFetchImplementation;
    
    mockFetchImplementation = async (url: string, init?: RequestInit): Promise<Response> => {
      if (url.includes("posthog")) {
        posthogCallDetected = true;
        
        // Inspect the analytics payload
        if (init?.body && typeof init.body === "string") {
          try {
            const payload = JSON.parse(init.body);
            // Validate the required analytics properties
            assertExists(payload.properties?.$ai_model);
            assertExists(payload.properties?.$ai_provider);
            assertExists(payload.properties?.$ai_latency);
          } catch (error) {
            logger.error("Failed to parse PostHog payload:", error);
          }
        }
      }
      
      // Call the original mock implementation
      return originalMockFetch!(url, init);
    };
    
    const OPENAI_API_KEY = "test-api-key";
    const POSTHOG_API_KEY = "test-posthog-key";
    
    // Connect to OpenAI with our middleware
    const wrappedFetch = connectToOpenAi(OPENAI_API_KEY, POSTHOG_API_KEY);
    
    // Make a request to OpenAI API
    await wrappedFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "user", content: "Hello, world!" }
        ]
      })
    });
    
    // Verify that PostHog was called for analytics
    assertEquals(posthogCallDetected, true, "PostHog analytics tracking was not called");
    
  } finally {
    restoreFetch();
  }
});

Deno.test("bolt-foundry - handles API errors gracefully", async () => {
  try {
    setupMockFetch();
    
    // Override mock to simulate an error response
    const originalMockFetch = mockFetchImplementation;
    mockFetchImplementation = async (url: string, init?: RequestInit): Promise<Response> => {
      if (url.includes("openai.com") || url.includes("api.openai")) {
        return new MockResponse(JSON.stringify({
          error: {
            message: "Mock API error",
            type: "invalid_request_error",
            code: "mock_error"
          }
        }), 400);
      }
      
      return originalMockFetch!(url, init);
    };
    
    const OPENAI_API_KEY = "test-api-key";
    const POSTHOG_API_KEY = "test-posthog-key";
    
    // Connect to OpenAI with our middleware
    const wrappedFetch = connectToOpenAi(OPENAI_API_KEY, POSTHOG_API_KEY);
    
    // Make a request to OpenAI API that should error
    const response = await wrappedFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "user", content: "Hello, world!" }
        ]
      })
    });
    
    // Verify the error is passed through properly
    assertEquals(response.status, 400);
    
    const responseData = await response.json();
    assertEquals(responseData.error.message, "Mock API error");
    assertEquals(responseData.error.type, "invalid_request_error");
    
  } finally {
    restoreFetch();
  }
});
