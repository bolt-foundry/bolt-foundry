/**
 * Utility functions for sanitizing sensitive data like API keys
 */

/**
 * Type definition for request data structure
 */
export type RequestData = {
  headers: Record<string, string>;
  body: Record<string, unknown>;
};

/**
 * Strips OpenAI API keys from request data to prevent accidental logging
 *
 * @param data The request data containing potential API keys
 * @returns A sanitized copy of the data with API keys redacted
 */
export function stripApiKeys(data: RequestData): RequestData {
  const openAiKeyPattern = /sk-[a-zA-Z0-9]{32,}/g;

  // Deep clone the data to avoid modifying the original
  const clonedData = JSON.parse(JSON.stringify(data)) as RequestData;

  // Recursively search and replace API keys
  function redactKeys(obj: Record<string, unknown>): void {
    if (typeof obj !== "object" || obj === null) {
      return;
    }

    for (const key in obj) {
      if (typeof obj[key] === "string") {
        // Redact API keys in strings
        obj[key] = (obj[key] as string).replace(openAiKeyPattern, "[REDACTED]");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively check nested objects
        redactKeys(obj[key] as Record<string, unknown>);
      }
    }
  }

  redactKeys(clonedData);
  return clonedData;
}
