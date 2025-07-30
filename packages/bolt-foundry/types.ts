/**
 * Metadata for Bolt Foundry SDK telemetry
 */
export interface BfMetadata {
  deckId: string;
  contextVariables: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

/**
 * Bolt Foundry options for deck rendering
 */
export interface BfOptions {
  captureTelemetry?: boolean; // Default: true (only matters when using BfClient)
  attributes?: Record<string, unknown>; // Additional data for UI display
}

/**
 * Enhanced telemetry payload
 */
export interface TelemetryData {
  duration: number; // Computed: response.timestamp - request.timestamp
  provider: string; // LLM provider (extracted from URL or model)
  model: string; // Model name (extracted from request body)

  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: Record<string, unknown>; // ChatCompletionCreateParams
    timestamp: string; // When request was sent
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: Record<string, unknown>; // ChatCompletion
    timestamp: string; // When response was received
  };

  // Optional metadata for RLHF attribution
  bfMetadata?: BfMetadata;
}
