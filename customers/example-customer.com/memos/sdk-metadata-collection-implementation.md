# Bolt Foundry SDK Metadata Collection Implementation Memo

**Status**: Ready for Implementation\
**Goal**: Enable automatic deck metadata collection in SDK telemetry for RLHF
sample attribution

## Executive Summary

This memo outlines the implementation plan for enhancing the bolt-foundry SDK to
automatically collect and transmit deck metadata with telemetry data. This
enables automatic linking of AI completion samples to their originating RLHF
decks without manual sample creation.

## Problem Statement

Currently, when using the bolt-foundry SDK for AI completions:

1. Telemetry captures request/response data but loses deck context
2. Samples cannot be automatically linked to specific Bolt Foundry decks
3. Manual sample creation is required with deck metadata
4. No way to associate completions with their originating evaluation criteria

## Solution Overview

Add optional metadata collection to the SDK:

- **Lazy deck creation**: Check/create deck via API when loading from disk
- **Automatic by default**: Telemetry captured unless explicitly disabled
- **Transparent metadata flow**: Pass metadata with OpenAI requests
- **Automatic extraction**: Fetch wrapper extracts and strips metadata before
  forwarding
- **Zero latency overhead**: Telemetry runs asynchronously without blocking API
  responses

## Technical Design

### 1. Lazy Deck Creation

```typescript
import { Deck } from "./deck.ts";

// Default API endpoint
const DEFAULT_API_ENDPOINT = "https://boltfoundry.com/api";

// Cache for deck existence checks
const deckCache = new Set<string>();

// Enhanced deck loading with lazy creation
async function readLocalDeck(path: string, options?: {
  apiKey?: string;
  apiEndpoint?: string;
}): Promise<Deck> {
  // Read the file content
  const markdownContent = await Deno.readTextFile(path);

  // Extract deckId from filename only (not the full path)
  // e.g., "decks/customer/invoice.deck.md" -> "invoice"
  const filename = path.split("/").pop() || "";
  const deckId = filename.replace(".deck.md", "");

  const deck = new Deck(deckId, markdownContent, path);

  // Get API configuration
  const apiKey = options?.apiKey || Deno.env.get("BF_API_KEY");
  const apiEndpoint = options?.apiEndpoint || Deno.env.get("BF_API_ENDPOINT") ||
    DEFAULT_API_ENDPOINT;

  // Check if deck exists in API (cached after first check)
  if (apiKey && !deckCache.has(deckId)) {
    try {
      const response = await fetch(`${apiEndpoint}/decks/${deckId}`, {
        headers: { "x-bf-api-key": apiKey },
      });

      if (response.status === 404) {
        // Process includes to get full deck content
        const { processedContent } = deck.processMarkdownIncludes(
          markdownContent,
          path,
        );

        // Create deck if it doesn't exist
        await fetch(`${apiEndpoint}/decks`, {
          method: "POST",
          headers: {
            "x-bf-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: deckId,
            content: markdownContent,
            processedContent: processedContent, // Full content with embeds resolved
          }),
        });
      }

      deckCache.add(deckId);
    } catch (error) {
      // Don't fail deck loading if API is unavailable
      console.warn(`Failed to check/create deck: ${error}`);
    }
  }

  return deck;
}
```

Note:

- The `processMarkdownIncludes` method already exists in the Deck class and
  handles embedded files
- The `options` parameter is optional, so existing code like
  `await readLocalDeck("./deck.md")` continues to work
- Lazy deck creation only happens if an API key is configured
- The render method signature change (adding third parameter) is not backward
  compatible, but this is acceptable

### 2. Deck Render Enhancement

```typescript
import type { OpenAI } from '@openai/openai';

// Use OpenAI's ChatCompletionCreateParams type
type ChatCompletionCreateParams = OpenAI.Chat.ChatCompletionCreateParams;

// Enhanced deck.render() signature and output
interface BfOptions {
  captureTelemetry?: boolean; // Default: true (only matters when using BfClient)
  attributes?: Record<string, JSONValue>; // Additional data for UI display
}

type RenderOutput = ChatCompletionCreateParams & {
  bfMetadata?: BfMetadata; // NEW: Optional metadata
}

interface BfMetadata {
  deckId: string;             // Deck ID (from filename) for sample attribution
  contextVariables: Record<string, JSONValue>; // Render parameters (JSON-serializable)
  attributes?: Record<string, JSONValue>; // Additional data for UI display (not sent to LLM)
}

// Implementation
deck.render(
  contextVariables: Record<string, JSONValue>,
  openaiParams?: Partial<ChatCompletionCreateParams>,
  bfOptions?: BfOptions
): ChatCompletionCreateParams { // Return type appears standard to TypeScript
  // ... existing render logic to create base output with default messages ...
  const output: RenderOutput = {
    messages,
    // ... other properties
  };
  
  // Merge OpenAI params if provided (this may override messages)
  if (openaiParams) {
    Object.assign(output, openaiParams);
  }
  
  // Include metadata unless explicitly disabled
  if (bfOptions?.captureTelemetry !== false) {
    output.bfMetadata = {
      deckId: this.deckId,
      contextVariables: contextVariables,
      attributes: bfOptions?.attributes
    };
  }
  
  return output as unknown as ChatCompletionCreateParams;
}
```

### 3. BfClient Fetch Wrapper

```typescript
import type { OpenAI } from '@openai/openai';
import type { ChatCompletion } from '@openai/openai/resources/chat/completions';

// Use OpenAI's ChatCompletionCreateParams type
type ChatCompletionCreateParams = OpenAI.Chat.ChatCompletionCreateParams;

// Note: BfMetadata interface is defined in section 2 above

// Create a wrapped type that includes our metadata
type ChatCompletionCreateParamsWithMetadata = ChatCompletionCreateParams & {
  bfMetadata?: BfMetadata;
};

// Default telemetry endpoint
const DEFAULT_TELEMETRY_ENDPOINT = "https://boltfoundry.com/api/telemetry";

// BfClient provides telemetry capture via custom fetch
interface BfClientConfig {
  apiKey: string; // Standard BF API key (bf+{posthogApiKey} format is deprecated)
  collectorEndpoint?: string;
}

class BfClient {
  public readonly fetch: typeof fetch;
  private readonly apiKey: string;
  private readonly telemetryEndpoint: string;

  constructor(config: BfClientConfig) {
    this.apiKey = config.apiKey;
    this.telemetryEndpoint = config.collectorEndpoint || DEFAULT_TELEMETRY_ENDPOINT;
    
    // Create wrapped fetch that captures telemetry
    this.fetch = this.createWrappedFetch();
  }

  static create(config: BfClientConfig): BfClient {
    return new BfClient(config);
  }

  private createWrappedFetch(): typeof fetch {
    return (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const requestTimestamp = new Date().toISOString();
      
      // Capture request body before making the request
      let requestBody: ChatCompletionCreateParams | undefined;
      let isStreamingRequest = false;
      
      let bfMetadata: BfMetadata | undefined;
      
      if (init?.body && typeof init.body === 'string') {
        try {
          const parsedBody = JSON.parse(init.body);
          // Extract bfMetadata if present
          if (parsedBody && typeof parsedBody === 'object') {
            const { bfMetadata: metadata, ...cleanBody } = parsedBody as ChatCompletionCreateParamsWithMetadata;
            requestBody = cleanBody;
            bfMetadata = metadata;
            
            // Check if it's a streaming request
            if ('stream' in cleanBody) {
              isStreamingRequest = cleanBody.stream === true;
            }
            
            // Update the request to remove bfMetadata
            init = {
              ...init,
              body: JSON.stringify(cleanBody)
            };
          }
        } catch {
          // Keep requestBody as undefined on parse error
        }
      }

      // Start the actual request immediately (don't await)
      const responsePromise = fetch(input, init);
      
      // Handle telemetry asynchronously if not streaming
      if (requestBody && !isStreamingRequest) {
        // Set up telemetry recording that will run when response is ready
        responsePromise.then(response => {
          const responseTimestamp = new Date().toISOString();
          
          // Fire and forget - run telemetry in background
          this.recordTelemetry({
            url,
            requestBody,
            bfMetadata,
            requestTimestamp,
            response: response.clone(), // Clone so we don't interfere with the original
            responseTimestamp,
            headers: init?.headers,
            method: init?.method,
          }).catch(error => {
            console.warn('Telemetry recording failed:', error);
          });
        }).catch(() => {
          // Ignore fetch errors for telemetry purposes
        });
      }
      
      // Return the promise immediately
      return responsePromise;
    };
  }
  
  private async recordTelemetry(data: {
    url: string;
    requestBody: ChatCompletionCreateParams;
    bfMetadata?: BfMetadata;
    requestTimestamp: string;
    response: Response;
    responseTimestamp: string;
    headers?: HeadersInit;
    method?: string;
  }) {
    try {
      // Read response body
      const responseBody = await data.response.json() as ChatCompletion;
      
      // Extract model and provider
      const model = data.requestBody.model || 'unknown';
      const provider = model.includes('/') 
        ? model.split('/')[0]
        : this.extractProvider(data.url);
      
      const duration = new Date(data.responseTimestamp).getTime() - 
                     new Date(data.requestTimestamp).getTime();
      
      // Send telemetry data
      await fetch(this.telemetryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bf-api-key': this.apiKey,
        },
        body: JSON.stringify({
          duration,
          provider,
          model,
          request: {
            url: data.url,
            method: data.method || 'POST',
            headers: data.headers as Record<string, string> || {},
            body: data.requestBody,
            timestamp: data.requestTimestamp,
          },
          response: {
            status: data.response.status,
            headers: Object.fromEntries(data.response.headers.entries()),
            body: responseBody,
            timestamp: data.responseTimestamp,
          },
          bfMetadata: data.bfMetadata,
        }),
      });
    }
  }
  
  private extractProvider(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      // Extract middle part of domain: api.openai.com -> openai
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        // Get the part before the TLD (com, ai, etc)
        return parts[parts.length - 2];
      }
      return hostname;
    } catch {
      return 'unknown';
    }
  }
}
```

### 4. Telemetry Data Structure

```typescript
// Enhanced telemetry payload
interface TelemetryData {
  duration: number; // Computed: response.timestamp - request.timestamp
  provider: string; // LLM provider (extracted from URL or model)
  model: string; // Model name (extracted from request body)

  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: ChatCompletionCreateParams;
    timestamp: string; // When request was sent
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: ChatCompletion;
    timestamp: string; // When response was received
  };

  // Optional metadata for RLHF attribution
  bfMetadata?: BfMetadata;
}
```

## Implementation Plan

### Phase 1: Core SDK Changes

#### 1.1 Lazy Deck Creation

##### Tests

- [ ] Test deck existence check - Mock API to return 404, verify deck creation
      call
- [ ] Test deck already exists - Mock API to return 200, verify no creation call
- [ ] Test cache behavior - Load same deck twice, verify only one API check
- [ ] Test deck creation failure - Mock API error, verify graceful handling
- [ ] Test deck with embeds - Verify processedContent includes resolved files

##### Implementation

- [ ] Add deck existence check to readLocalDeck
- [ ] Implement API call to create deck if it doesn't exist
- [ ] Use deck.processMarkdownIncludes to resolve embedded files
- [ ] Cache deck existence to avoid repeated API calls
- [ ] Store deck ID for use in metadata

#### 1.2 BfClient Fetch Wrapper

##### Tests

- [ ] Test fetch wrapper creation - Verify custom fetch is properly bound
- [ ] Test metadata extraction - Pass request with bfMetadata, verify extraction
- [ ] Test clean request forwarding - Verify bfMetadata stripped from OpenAI
      call
- [ ] Test streaming request skip - Verify no telemetry for stream:true
- [ ] Test async execution - Verify response returns before telemetry completes
- [ ] Test provider extraction from URL - Test various LLM API domains
- [ ] Test provider extraction from model - Test "anthropic/claude-3" format

##### Implementation

- [ ] Implement custom fetch wrapper in BfClient
- [ ] Extract bfMetadata from request body and strip it
- [ ] Implement provider extraction from URL/model
- [ ] Set up async telemetry recording without blocking response

#### 1.3 Deck Render Enhancement

##### Tests

- [ ] Test metadata inclusion - render with default BfOptions
- [ ] Test metadata exclusion - render with captureTelemetry:false
- [ ] Test attributes handling - Verify attributes passed through correctly
- [ ] Test contextVariables capture - Verify first param becomes
      contextVariables
- [ ] Test OpenAI params merging - Verify second param merges correctly
- [ ] Test undefined middle parameter - Verify can skip OpenAI params

##### Implementation

- [ ] Add BfOptions interface with captureTelemetry and attributes fields
- [ ] Enhance deck.render() signature to accept three parameters
- [ ] Update RenderOutput interface to include optional bfMetadata
- [ ] Implement OpenAI params merging and metadata extraction

#### 1.4 Telemetry Data Structure

##### Tests

- [ ] Test telemetry data structure - Verify all required fields present
- [ ] Test metadata inclusion in telemetry - When captureTelemetry is true
- [ ] Test metadata exclusion from telemetry - When captureTelemetry is false
- [ ] Test request/response body extraction - Verify proper data capture

##### Implementation

- [ ] Define TelemetryData interface with proper types
- [ ] Include optional bfMetadata field in telemetry structure
- [ ] Ensure proper typing for OpenAI request/response bodies
- [ ] Support both streaming and non-streaming request identification

### Phase 2: Telemetry Integration

#### 2.1 Telemetry Data Enhancement

##### Tests

- [ ] Test successful telemetry submission - Mock telemetry endpoint, verify
      payload
- [ ] Test telemetry failure handling - Mock 500 error, verify no impact on API
      call
- [ ] Test telemetry payload structure - Verify all required fields present
- [ ] Test backward compatibility - Existing telemetry consumers still work

##### Implementation

- [ ] Add optional bfMetadata field to TelemetryData interface
- [ ] Update client-side telemetry collection to capture metadata from request
      context
- [ ] Implement simple conditional metadata inclusion logic
- [ ] Ensure backward compatibility with existing telemetry consumers
- [ ] Enhance server-side telemetry handler to process metadata and create RLHF
      samples with deck attribution

#### 2.2 Client-Side Integration

##### Tests

- [ ] Test metadata in telemetry payload - Verify bfMetadata included
- [ ] Test missing metadata - Verify telemetry works without metadata
- [ ] Test response cloning - Verify original response untouched
- [ ] Test error response handling - Verify telemetry captures failed requests

##### Implementation

- [ ] Implement fetch interception in BfClient to capture metadata
- [ ] Ensure metadata is extracted before sending to OpenAI
- [ ] Record telemetry with metadata when present
- [ ] Handle edge cases (missing metadata, malformed data)

### Phase 3: Integration Testing

#### 3.1 End-to-End Integration Test

##### Test

```typescript
// packages/bolt-foundry/__tests__/integration.test.ts
import { assertEquals, assertExists } from "@std/assert";
import { BfClient } from "../BfClient.ts";
import { readLocalDeck } from "../deck/readLocalDeck.ts";
import { OpenAI } from "@openai/openai";

// Test helper functions
async function createTempDeckFile(content: string): Promise<string> {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/invoice-extraction.deck.md`;
  await Deno.writeTextFile(deckPath, content);
  return deckPath;
}

async function cleanup(path: string): Promise<void> {
  const dir = path.substring(0, path.lastIndexOf("/"));
  await Deno.remove(dir, { recursive: true });
}

// Mock fetch for testing
const originalFetch = globalThis.fetch;
let fetchCalls: Array<{ url: string; options?: RequestInit }> = [];

function mockFetch(responseMap: Map<string, Response>) {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    fetchCalls.push({ url, options: init });

    const response = responseMap.get(url);
    if (response) return response;

    // Check for pattern matches
    for (const [pattern, resp] of responseMap.entries()) {
      if (url.includes(pattern)) return resp;
    }

    return new Response("Not found", { status: 404 });
  };
}

Deno.test("SDK flow - deck loading with lazy creation and telemetry", async () => {
  fetchCalls = [];

  // Setup mock responses
  const responses = new Map<string, Response>([
    // Deck doesn't exist
    [
      "https://boltfoundry.com/api/decks/invoice-extraction",
      new Response(null, { status: 404 }),
    ],
    // Deck creation succeeds
    [
      "POST:https://boltfoundry.com/api/decks",
      new Response(JSON.stringify({ id: "invoice-extraction" }), {
        status: 201,
      }),
    ],
    // OpenAI completion
    [
      "https://api.openai.com/v1/chat/completions",
      new Response(JSON.stringify({
        choices: [{ message: { content: "Invoice processed" } }],
      })),
    ],
    // Telemetry endpoint
    [
      "https://boltfoundry.com/api/telemetry",
      new Response(null, { status: 200 }),
    ],
  ]);

  mockFetch(responses);

  try {
    // 1. Load deck with lazy creation
    const deckPath = await createTempDeckFile(`# Invoice Extraction
    
Extract key fields from invoices.`);

    const deck = await readLocalDeck(deckPath);

    // Verify deck check and creation
    const deckCheckCall = fetchCalls.find((c) =>
      c.url.includes("/api/decks/invoice-extraction") &&
      c.options?.method !== "POST"
    );
    assertExists(deckCheckCall);

    // 2. Render with metadata
    const completion = deck.render(
      { invoice: "INV-001" },
      undefined, // No OpenAI params override
      { attributes: { invoiceImage: "base64..." } },
    );

    assertEquals(completion.bfMetadata?.deckId, "invoice-extraction");
    assertEquals(completion.bfMetadata?.contextVariables, {
      invoice: "INV-001",
    });
    assertEquals(completion.bfMetadata?.attributes, {
      invoiceImage: "base64...",
    });

    // 3. Use with telemetry
    const bfClient = BfClient.create({ apiKey: "bf+test" });
    const openai = new OpenAI({
      apiKey: "test-key",
      fetch: bfClient.fetch,
    });

    await openai.chat.completions.create(completion);

    // Verify telemetry was sent
    const telemetryCall = fetchCalls.find((c) =>
      c.url.includes("/api/telemetry")
    );
    assertExists(telemetryCall);

    // Verify metadata was included in telemetry
    const telemetryBody = JSON.parse(telemetryCall.options?.body as string);
    assertEquals(telemetryBody.bfMetadata, completion.bfMetadata);

    // Verify metadata was stripped from OpenAI request
    const openaiCall = fetchCalls.find((c) => c.url.includes("openai.com"));
    assertExists(openaiCall);
    const openaiBody = JSON.parse(openaiCall.options?.body as string);
    assertEquals(openaiBody.bfMetadata, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    await cleanup(deckPath);
  }
});
```

##### Implementation

- [ ] Create integration test suite
- [ ] Mock deck API and telemetry endpoints
- [ ] Test complete flow from deck load through telemetry capture
- [ ] Verify metadata flows correctly through the system
- [ ] Test error scenarios and edge cases

## API Examples

### With Telemetry (Metadata Automatically Included)

```typescript
import { BfClient, readLocalDeck } from "@bfmono/bolt-foundry";
import { OpenAI } from "@openai/openai";
import type { OpenAI as OpenAITypes } from "@openai/openai";

// Using BfClient for telemetry - metadata flows automatically
const bfClient = BfClient.create({
  apiKey: "bf-your-api-key", // Note: bf+{posthogApiKey} format is deprecated
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch, // This enables telemetry capture
});

const deck = await readLocalDeck("./deck.md");
const completion = deck.render(
  { input: "data" },
  // Using defaults: no OpenAI overrides, telemetry enabled
);
// completion includes bfMetadata automatically

const response = await openai.chat.completions.create(completion);
// Telemetry captures request/response WITH metadata
```

### Without Telemetry (No BfClient)

```typescript
import { readLocalDeck } from "@bfmono/bolt-foundry";
import { OpenAI } from "@openai/openai";
import type { OpenAI as OpenAITypes } from "@openai/openai";

// No telemetry - using OpenAI directly
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // No custom fetch - no telemetry
});

const deck = await readLocalDeck("./invoice-extraction.deck.md");
const completion = deck.render(
  { invoice: "INV-12345" }, // Context variables
  { temperature: 0.1 }, // OpenAI overrides
  { attributes: { invoiceImage: "base64..." } }, // BF options
);
// completion still has bfMetadata, but it won't be captured

const response = await openai.chat.completions.create(completion);
// No telemetry, metadata is ignored by OpenAI
```

### Appending to Existing Conversation

```typescript
import { BfClient, readLocalDeck } from "@bfmono/bolt-foundry";
import { OpenAI } from "@openai/openai";
import type { OpenAI as OpenAITypes } from "@openai/openai";

const bfClient = BfClient.create({
  apiKey: "bf-your-api-key",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch,
});

// Existing conversation
const existingMessages = [
  { role: "user", content: "Hello" },
  { role: "assistant", content: "Hi! How can I help?" },
  { role: "user", content: "Process this invoice for me" },
];

const deck = await readLocalDeck("./invoice-extraction.deck.md");
const completion = deck.render(
  { invoice: "INV-001" },
  { messages: existingMessages }, // Override default messages
  { attributes: { invoiceImage: "base64..." } },
);
// completion.messages === existingMessages (unchanged)
// completion.bfMetadata still included for telemetry

const response = await openai.chat.completions.create(completion);
```

### Disabling Metadata for Sensitive Data

```typescript
import { BfClient, readLocalDeck } from "@bfmono/bolt-foundry";
import { OpenAI } from "@openai/openai";
import type { OpenAI as OpenAITypes } from "@openai/openai";

// Even with telemetry enabled, you can opt-out of metadata for sensitive operations
const bfClient = BfClient.create({
  apiKey: "bf-your-api-key",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch,
});

const deck = await readLocalDeck("./my-deck.md");
const completion = deck.render(
  { data: "sensitive" },
  undefined, // No OpenAI overrides
  { captureTelemetry: false }, // Explicitly opt-out for sensitive data
);
// completion.bfMetadata is undefined

const response = await openai.chat.completions.create(completion);
// Telemetry captures request/response but WITHOUT metadata
```

## Known Limitations

### Streaming Support

- **Limitation**: Telemetry and metadata collection only work with non-streaming
  requests
- **Behavior**: For streaming requests (stream: true), the SDK will silently
  skip telemetry capture and metadata collection
- **No errors**: The request will proceed normally without telemetry
- **Future enhancement**: Automatic streaming support may be added in a future
  version

## Performance Considerations

- **Memory**: ~1-2KB additional data per completion
- **Network**: ~1-2KB added to telemetry payload
- **Latency**: 0 (telemetry runs asynchronously)

## Infrastructure Considerations

### API Endpoints

- **Deck Management**: `/api/decks` endpoint needs to be implemented for
  checking/creating decks (does not currently exist)
  - Will use standard `x-bf-api-key` header authentication
  - GET `/api/decks/:deckId` - Check if deck exists (404 if not)
  - POST `/api/decks` - Create new deck with id, content, and processedContent
- **Telemetry Ingestion**: `/api/telemetry` endpoint must handle increased
  volume

## Security Considerations

### Sensitive Data Handling

- **Context Variables**: May contain sensitive render parameters
- **Opt-out Control**: Per-render disable for sensitive operations
- **Data Retention**: Follow network delete patterns from bfDb

### Recommendations

- **Use Overrides**: Disable metadata completely for renders with sensitive data
- **Access Control**: Leverage existing org-scoped telemetry access

## Error Handling

### Malformed Deck Files

- **Robust Parsing**: Handle decks without clear names/structure
- **Error Logging**: Log issues for debugging without failing completions

## File Changes Required

### Core SDK Files

- `packages/bolt-foundry/BfClient.ts` - Add metadata configuration and context
  management
- `packages/bolt-foundry/deck/Deck.ts` - Enhance render method with selective
  metadata
- `packages/bolt-foundry/telemetry/TelemetryCollector.ts` - Add client-side
  metadata handling
- `packages/bolt-foundry/types/index.ts` - Add interface definitions
- `apps/boltfoundry-com/handlers/telemetry.ts` - Enhance server-side telemetry
  to process metadata and create samples with deck attribution

### Test Files

- `packages/bolt-foundry/__tests__/BfClient.test.ts` - Client configuration
  tests
- `packages/bolt-foundry/__tests__/Deck.test.ts` - Render enhancement tests
- `packages/bolt-foundry/__tests__/Telemetry.test.ts` - End-to-end telemetry
  tests
- `packages/bolt-foundry/__tests__/MetadataCollection.integration.test.ts` - New
  integration tests

### Documentation Files

- `packages/bolt-foundry/README.md` - Usage examples, migration guide, and
  streaming limitations
- `docs/sdk/metadata-collection.md` - Detailed metadata collection guide
  including non-streaming requirement

## Success Criteria

### MVP Requirements

- [ ] BfClient provides custom fetch that captures telemetry
- [ ] deck.render() includes bfMetadata when captureTelemetry: true
- [ ] Per-render control works correctly
- [ ] Sample attribution works in RLHF pipeline

### Quality Gates

- [ ] All unit tests pass
- [ ] Integration tests demonstrate end-to-end functionality
- [ ] Documentation covers all usage patterns

## Non-Goals

### Advanced Metadata

- **Model Information**: Capture model parameters from completions
- **Performance Metrics**: Include render time and complexity metrics
- **Metadata Validation**: Schema validation for custom metadata

### Integration Features

- **Async Processing**: Queue metadata processing for large volumes
- **Metadata Analytics**: Built-in analytics for deck usage patterns
- **A/B Testing**: Metadata-driven experimental configurations
- **Compliance**: Enhanced data governance for regulated industries

## Dependencies

### Internal Dependencies

- `packages/bolt-foundry/bolt-foundry.ts` - Core SDK types and utilities
- `apps/bfDb/nodeTypes/rlhf/BfSample.ts` - Sample creation with metadata
- Telemetry endpoint at `apps/boltfoundry-com/handlers/telemetry.ts`

### External Dependencies

- No new external dependencies required
- Leverages existing TypeScript, Deno runtime
- Compatible with current JSR and npm package ecosystem

---

## Appendix: Related Files

### SDK Core Files

- `packages/bolt-foundry/BfClient.ts` - Main SDK client
- `packages/bolt-foundry/deck/readLocalDeck.ts` - Deck loading utilities
- `packages/bolt-foundry/types/TelemetryTypes.ts` - Telemetry interfaces

### RLHF Integration Files

- `apps/bfDb/nodeTypes/rlhf/BfSample.ts` - Sample model with completionData
- `apps/boltfoundry-com/handlers/telemetry.ts` - Telemetry ingestion endpoint
- `customers/example-customer.com/memos/telemetry-and-rlhf-implementation.md` -
  Parent implementation memo

### Testing References

- `packages/bolt-foundry/__tests__/` - Existing SDK test patterns
- `apps/bfDb/nodeTypes/rlhf/__tests__/` - RLHF testing patterns
- `infra/bft/tasks/test.bft.deck.md` - Test execution via BFT
