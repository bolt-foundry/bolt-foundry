
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Creates a wrapped fetch function that doesn't modify any behavior.
 * This is a minimal implementation with no functionality.
 * 
 * @param openAiApiKey - The OpenAI API key (unused)
 * @param posthogApiKey - The PostHog API key (unused)
 * @returns A wrapped fetch function that just passes through to the original fetch
 */
export function connectToOpenAi(
  openAiApiKey: string,
  posthogApiKey: string,
): typeof fetch {
  // Just return a simple pass-through implementation
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Log the call
    logger.debug("Bolt Foundry fetch called (no-op implementation)");
    // Pass through to the original fetch without modification
    return fetch(input, init);
  };
}
