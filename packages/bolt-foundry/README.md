# Bolt Foundry SDK

AI telemetry and analytics for your LLM applications.

## Current Status

This SDK is in early development. Currently provides:

- ✅ **Telemetry wrapper** for OpenAI, Anthropic, and Mistral APIs
- ✅ **Performance tracking** and analytics
- ✅ **Request/response logging** for debugging
- 🚧 **Structured prompt management** (planned)
- 🚧 **Deck system** (planned)

## Installation

```bash
# For Deno projects (recommended)
import { BfClient } from "@bolt-foundry/bfmono";

# For npm projects
npm install @bolt-foundry/bfmono
```

## Quick Start

```typescript
import { BfClient } from "@bolt-foundry/bfmono";
import OpenAI from "openai";

// 1. Create a Bolt Foundry client
const bf = BfClient.create({
  apiKey: process.env.BOLT_FOUNDRY_API_KEY, // Optional: enables telemetry
});

// 2. Use the wrapped fetch with your LLM client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bf.fetch, // Adds telemetry and debugging
});

// 3. Make requests as normal - telemetry is automatic
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "user", content: "Hello, world!" },
  ],
});
```

## Features

### Automatic Telemetry

When you provide a Bolt Foundry API key, the SDK automatically tracks:

- **Request/response data** for all LLM calls
- **Performance metrics** (duration, tokens, costs)
- **Error rates** and debugging information
- **Provider usage** across OpenAI, Anthropic, Mistral

### Multi-Provider Support

The telemetry works with any OpenAI-compatible API:

```typescript
// OpenAI
const openai = new OpenAI({ fetch: bf.fetch });

// Or with other providers using OpenAI format
const anthropic = new OpenAI({
  baseURL: "https://api.anthropic.com/v1",
  fetch: bf.fetch,
});
```

### Session and User Tracking

```typescript
const bf = BfClient.create({
  apiKey: process.env.BOLT_FOUNDRY_API_KEY,
  sessionId: "user-session-123",
  userId: "user-456",
});
```

### Custom Collector Endpoint

```typescript
const bf = BfClient.create({
  apiKey: process.env.BOLT_FOUNDRY_API_KEY,
  collectorEndpoint: "https://your-custom-endpoint.com/telemetry",
});
```

## API Reference

### `BfClient.create(options?)`

Creates a new Bolt Foundry client with telemetry capabilities.

**Parameters:**

- `options.apiKey` (optional): Your Bolt Foundry API key for telemetry
- `options.collectorEndpoint` (optional): Custom telemetry collection endpoint

**Returns:** `BfClient` instance

### `client.fetch`

The wrapped fetch function that adds telemetry to your LLM requests.

**Type:** `typeof fetch`

**Usage:** Pass this to your LLM client's `fetch` option.

## Telemetry Data

When telemetry is enabled, the SDK automatically captures:

```typescript
{
  timestamp: string;           // ISO timestamp
  duration: number;            // Request duration in ms
  provider: string;            // "openai" | "anthropic" | "mistral" | "unknown"
  providerApiVersion: string;  // API version (e.g., "v1")
  sessionId?: string;          // Optional session tracking
  userId?: string;             // Optional user tracking
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;  // Excludes Authorization
    body: OpenAIRequestBody;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: OpenAIResponseBody;
  };
}
```

## Privacy and Security

- **No API keys logged**: Authorization headers are automatically excluded
- **Non-blocking**: Telemetry is sent asynchronously and won't affect your app
  performance
- **Opt-in**: Telemetry only works when you provide a Bolt Foundry API key

## Planned Features

The following features are planned for future releases:

### Structured Prompt Management

```typescript
// Coming soon
const assistant = bf.createDeck("helpful-assistant")
  .spec("You are a helpful assistant")
  .spec("Be concise and clear");
```

### Context Variables

```typescript
// Coming soon
const support = bf.createDeck("support-agent")
  .context((ctx) =>
    ctx
      .string("customerName", "What is the customer's name?")
      .string("issue", "Describe the current issue")
  );
```

### Testable Specs with Samples

```typescript
// Coming soon
const reviewer = bf.createDeck("code-reviewer")
  .spec("Be constructive, not harsh", {
    samples: [/* examples */],
  });
```

## Getting Help

- 📚 [Documentation](../../docs/guides/)
- 💬 [Issues](https://github.com/bolt-foundry/bfmono/issues)

## License

MIT
