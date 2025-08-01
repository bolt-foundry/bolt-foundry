# Telemetry API Documentation

The Bolt Foundry telemetry API collects LLM interaction data for RLHF
(Reinforcement Learning from Human Feedback) workflows. This API automatically
creates decks and samples from telemetry data.

## Endpoint

```
POST /api/telemetry
```

## Authentication

All requests must include an API key in the `x-bf-api-key` header:

```
x-bf-api-key: bf+{orgId}
```

The API key format is `bf+` followed by your organization ID.

## Request Body

The API accepts JSON payloads with the following structure:

```typescript
interface TelemetryData {
  timestamp: string; // ISO timestamp
  duration: number; // Request duration in milliseconds
  provider: string; // LLM provider ("openai", "anthropic", "mistral", etc.)
  providerApiVersion: string; // API version (e.g., "v1")
  sessionId?: string; // Optional session tracking
  userId?: string; // Optional user tracking
  request: {
    url: string;
    method: string;
    headers: Record<string, string>; // Request headers (sensitive headers excluded)
    body: unknown; // Request payload
  };
  response: {
    status: number;
    headers: Record<string, string>; // Response headers
    body: unknown; // Response payload
  };
  bfMetadata?: { // Optional Bolt Foundry metadata
    deckName: string; // Name of the deck/prompt
    deckContent: string; // Full prompt content
    contextVariables: Record<string, unknown>; // Context data
  };
}
```

## Response

### Success Response

```json
{
  "success": true,
  "deckId": "bf_deck_12345",
  "sampleId": "bf_sample_67890"
}
```

### Success Response (No Deck Metadata)

```json
{
  "success": true,
  "message": "Telemetry processed without deck metadata"
}
```

### Error Responses

#### 401 - Missing API Key

```json
{
  "error": "API key required"
}
```

#### 401 - Invalid API Key

```json
{
  "error": "Invalid API key"
}
```

#### 400 - Invalid JSON

```json
{
  "error": "Invalid JSON"
}
```

#### 405 - Method Not Allowed

```json
{
  "error": "Method not allowed"
}
```

#### 500 - Internal Server Error

```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

## Behavior

### Without `bfMetadata`

When telemetry is sent without the `bfMetadata` field:

- The API acknowledges the telemetry
- No deck or sample is created
- Returns success response with message

### With `bfMetadata`

When telemetry includes `bfMetadata`:

- The API checks for an existing deck with the same name (by slug)
- If found, uses the existing deck
- If not found, creates a new deck with:
  - `name`: From `bfMetadata.deckName`
  - `systemPrompt`: From `bfMetadata.deckContent`
  - `description`: Auto-generated description
  - `slug`: Generated from deck name and organization ID
- Creates a new sample containing:
  - Complete request/response data
  - Provider and timing information
  - Context variables
  - Collection method: "telemetry"

## Example Usage

### With cURL

```bash
curl -X POST https://your-domain.com/api/telemetry \
  -H "Content-Type: application/json" \
  -H "x-bf-api-key: bf+your-org-id" \
  -d '{
    "timestamp": "2025-01-15T10:30:00.000Z",
    "duration": 1250,
    "provider": "openai",
    "providerApiVersion": "v1",
    "sessionId": "session-123",
    "userId": "user-456",
    "request": {
      "url": "https://api.openai.com/v1/chat/completions",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello"}]
      }
    },
    "response": {
      "status": 200,
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "choices": [{"message": {"content": "Hello! How can I help you today?"}}]
      }
    },
    "bfMetadata": {
      "deckName": "helpful-assistant",
      "deckContent": "You are a helpful assistant. Be concise and clear.",
      "contextVariables": {
        "userName": "Alice"
      }
    }
  }'
```

### With the Bolt Foundry SDK

The SDK automatically sends telemetry when configured:

```typescript
import { BfClient } from "@bolt-foundry/bolt-foundry";
import OpenAI from "openai";

const bf = BfClient.create({
  apiKey: "bf+your-org-id", // Automatically sends telemetry
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bf.fetch, // This wrapper sends telemetry automatically
});

// All OpenAI calls will now send telemetry data
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello" }],
});
```

## Security & Privacy

- **API Key Security**: API keys are validated but not logged
- **Header Filtering**: Sensitive headers (like `Authorization`) are excluded
  from telemetry
- **Non-blocking**: Telemetry processing happens asynchronously
- **Error Handling**: Failures don't affect the original LLM request

## Rate Limits

Currently, there are no enforced rate limits, but this may change in the future.

## Related Documentation

- [Bolt Foundry SDK](../../packages/bolt-foundry/README.md)
- [RLHF Workflows](./rlhf-workflows.md) (if available)
- [Deck System](./deck-system.md)
