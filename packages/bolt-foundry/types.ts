// Types for Bolt Foundry SDK

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

export interface BfMetadata {
  deckId: string;
  contextVariables: Record<string, unknown>;
  attributes?: Record<string, JSONValue>;
}

export interface BfOptions {
  captureTelemetry?: boolean;
  attributes?: Record<string, JSONValue>;
}

export interface TelemetryData {
  duration: number;
  provider: string;
  model: string;

  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: unknown;
    timestamp: string;
  };

  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
    timestamp: string;
  };

  bfMetadata?: BfMetadata;
}
