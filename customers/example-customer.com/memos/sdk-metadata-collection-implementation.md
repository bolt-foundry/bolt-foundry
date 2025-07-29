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
- **Render-level control**: Per-render option to include metadata
- **Type augmentation**: Extend OpenAI types to accept `bfMetadata`
- **Transparent pass-through**: Metadata flows naturally with API calls

## Technical Design

### 1. Deck Render Enhancement

```typescript
// Enhanced deck.render() signature and output
interface RenderOptions {
  includeBfMetadata?: boolean; // Per-render override
  attributes?: Record<string, JSONValue>; // Additional data for UI display
}

interface RenderOutput {
  messages: Array<{role: string, content: string}>;
  tools?: Array<ToolDefinition>;
  bfMetadata?: BfMetadata; // NEW: Optional metadata
}

interface BfMetadata {
  deckName: string;           // Deck name (from filename) for sample attribution
  contextVariables: Record<string, JSONValue>; // Render parameters (JSON-serializable)
  attributes?: Record<string, JSONValue>; // Additional data for UI display (not sent to LLM)
}

// Implementation
deck.render(params: Record<string, JSONValue>, options?: RenderOptions): RenderOutput

// Simple metadata extraction
function extractMetadata(
  deck: Deck, 
  params: Record<string, JSONValue>,
  options?: RenderOptions
): BfMetadata | undefined {
  if (options?.includeBfMetadata === false) return undefined;
  
  return {
    deckName: deck.name, // Deck name from filename
    contextVariables: params,
    attributes: options?.attributes // Optional supplemental data for UI
  };
}
```

### 2. BfClient Fetch Wrapper

```typescript
import type { 
  ChatCompletionCreateParams,
  ChatCompletion 
} from 'openai/resources/chat/completions';

// Extend OpenAI types to include bfMetadata
declare module 'openai/resources/chat/completions' {
  interface ChatCompletionCreateParams {
    bfMetadata?: BfMetadata;
  }
}

// BfClient provides telemetry capture via custom fetch
interface BfClientConfig {
  apiKey: string;
  collectorEndpoint?: string;
}

class BfClient {
  public readonly fetch: typeof fetch;
  private readonly apiKey: string;
  private readonly telemetryEndpoint: string;

  constructor(config: BfClientConfig) {
    this.apiKey = config.apiKey;
    this.telemetryEndpoint = config.collectorEndpoint || 'https://boltfoundry.com/api/telemetry';
    
    // Create wrapped fetch that captures telemetry
    this.fetch = this.createWrappedFetch();
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
            const { bfMetadata: metadata, ...cleanBody } = parsedBody as ChatCompletionCreateParams;
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
          requestBody = init.body;
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

### 3. Telemetry Data Structure

```typescript
// Enhanced telemetry payload
interface TelemetryData {
  duration: number;           // Computed: response.timestamp - request.timestamp
  provider: string;           // LLM provider (extracted from URL or model)
  model: string;              // Model name (extracted from request body)
  
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: ChatCompletionCreateParams;
    timestamp: string;       // When request was sent
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: ChatCompletion;
    timestamp: string;       // When response was received
  };

  // Optional metadata for RLHF attribution
  bfMetadata?: BfMetadata;
}
```

## Implementation Plan

### Phase 1: Core SDK Changes

#### 1.1 Lazy Deck Creation

- [ ] Add deck existence check to loadDeckFromDisk/readLocalDeck
- [ ] Implement API call to create deck if it doesn't exist
- [ ] Cache deck existence to avoid repeated API calls
- [ ] Store deck name for use in metadata

#### 1.2 BfClient Fetch Wrapper

- [ ] Implement custom fetch wrapper in BfClient
- [ ] Add metadata attachment mechanism
- [ ] Implement LLM API detection logic
- [ ] Set up telemetry collector integration

#### 1.3 Deck Render Enhancement

- [ ] Add RenderOptions interface with includeBfMetadata field
- [ ] Enhance deck.render() signature to accept options parameter
- [ ] Update RenderOutput interface to include optional bfMetadata
- [ ] Implement metadata extraction from deck context

#### 1.4 Metadata Extraction Logic

- [ ] Create BfMetadata interface definition
- [ ] Implement metadata extraction with deckName from filename
- [ ] Store render parameters as contextVariables
- [ ] Support optional attributes for supplemental data

### Phase 2: Telemetry Integration

#### 2.1 Telemetry Data Enhancement

- [ ] Add optional bfMetadata field to TelemetryData interface
- [ ] Update client-side telemetry collection to capture metadata from request
      context
- [ ] Implement simple conditional metadata inclusion logic
- [ ] Ensure backward compatibility with existing telemetry consumers
- [ ] Enhance server-side telemetry handler to process metadata and create RLHF
      samples with deck attribution

#### 2.2 Client-Side Integration

- [ ] Implement fetch interception in BfClient to capture metadata
- [ ] Ensure metadata is extracted before sending to OpenAI
- [ ] Record telemetry with metadata when present
- [ ] Handle edge cases (missing metadata, malformed data)

### Phase 3: Testing & Validation

#### 3.1 Unit Tests

- [ ] Test BfClient configuration with metadata enabled/disabled
- [ ] Test deck.render() with various option combinations
- [ ] Test metadata extraction from different deck types
- [ ] Test conditional inclusion logic with all combinations

#### 3.2 Integration Tests

- [ ] Test end-to-end telemetry flow with metadata
- [ ] Test sample creation from telemetry with deck metadata
- [ ] Test RLHF sample attribution to correct decks
- [ ] Test performance impact of metadata collection

#### 3.3 Backward Compatibility Tests

- [ ] Verify existing SDK usage continues to work unchanged
- [ ] Test telemetry without metadata collection (default behavior)
- [ ] Ensure no breaking changes to existing APIs

## Data Flow Architecture

### Complete Metadata Flow

```typescript
// 0. Deck loading with lazy creation
const deck = await readLocalDeck("./invoice-extraction.deck.md");
// This checks API and creates deck if needed

// 1. Create BfClient and OpenAI client
const bfClient = BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch // Use BfClient's fetch for telemetry
});

// 2. Deck render produces metadata  
const completion = deck.render({ invoice: data }, {
  includeBfMetadata: true,
  attributes: { invoiceImage: imageData } // Optional
});
// completion = { messages, bfMetadata: { deckName, contextVariables, attributes? } }

// 3. Attach metadata before OpenAI call
bfClient.attachMetadata(completion.bfMetadata);

// 4. Make OpenAI call - metadata captured by fetch wrapper
const response = await openai.chat.completions.create({
  messages: completion.messages,
  model: "gpt-4",
  temperature: 0.1,
});

// 5. SDK's wrapped fetch captures both request and metadata
// 6. Telemetry handler creates RLHF sample with deck attribution
```

## API Examples

### Basic Usage (Metadata Disabled - Default)

```typescript
// Default behavior - no metadata collection
const bfClient = BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch
});

const deck = await readLocalDeck("./deck.md");
const completion = deck.render({ input: "data" });
// completion.bfMetadata is undefined

const response = await openai.chat.completions.create({
  messages: completion.messages,
  model: "gpt-4",
});
// telemetry.bfMetadata is undefined
```

### Metadata Collection Enabled

```typescript
// Enable metadata collection at render time
const bfClient = BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch
});

const deck = await readLocalDeck("./invoice-extraction.deck.md");
const completion = deck.render({ invoice: invoiceText }, {
  includeBfMetadata: true, // Enable for this render
  attributes: { invoiceImage: base64Data } // Optional supplemental data
});
// completion.bfMetadata = {
//   deckName: "invoice-extraction",
//   contextVariables: { invoice: invoiceText },
//   attributes: { invoiceImage: base64Data }
// }

// Attach metadata before API call
bfClient.attachMetadata(completion.bfMetadata);

const response = await openai.chat.completions.create({
  messages: completion.messages,
  model: "gpt-4",
  temperature: 0.1,
});
// SDK telemetry captures the metadata
```

### Per-Render Control

```typescript
const deck = await readLocalDeck("./my-deck.md");

// Skip metadata for sensitive operations
const completion1 = deck.render({ data: "sensitive" }, {
  includeBfMetadata: false, // or simply omit the option
});
// completion1.bfMetadata is undefined

// Include metadata for RLHF operations
const completion2 = deck.render({ data: "normal" }, {
  includeBfMetadata: true,
});
// completion2.bfMetadata is included

// When calling OpenAI, attach metadata first
bfClient.attachMetadata(completion2.bfMetadata);

const response = await openai.chat.completions.create({
  messages: completion2.messages,
  model: "gpt-4",
});
```

## Known Limitations

### Streaming Support

- **Non-streaming only**: Metadata collection is not supported for streaming
  completions
- **No telemetry for streaming**: Streaming requests bypass telemetry collection
  entirely
- **TypeScript enforcement**: Streaming interface not extended to prevent
  accidental usage
- **Future enhancement**: Streaming support may be added in a future version

### Workaround for Streaming

If you need both streaming and metadata collection:

1. Use non-streaming for RLHF sample collection
2. Use streaming for production user-facing responses
3. Consider sampling a percentage of non-streaming requests for RLHF

## Migration Strategy

### For Existing SDK Users

- **Zero Breaking Changes**: All existing code continues to work unchanged
- **Opt-in Feature**: Metadata collection is disabled by default
- **Gradual Adoption**: Users can enable metadata collection when ready for RLHF

### For New Integrations

- **Recommended Pattern**: Enable metadata collection for RLHF use cases
- **Documentation**: Clear examples of when to enable/disable metadata
- **Best Practices**: Guidelines for sensitive data handling

## Performance Considerations

### Metadata Collection Overhead

- **Minimal CPU Impact**: Simple object creation and serialization
- **Memory Impact**: ~1-2KB additional data per completion
- **Network Impact**: Metadata adds ~1-2KB to telemetry payload
- **Disk Impact**: Proportional increase in telemetry storage

### Optimization Strategies

- **Lazy Evaluation**: Only extract metadata when needed
- **Caching**: Cache deck metadata for repeated renders
- **Compression**: Leverage existing telemetry compression
- **Batching**: No change to existing telemetry batching

## Security Considerations

### Sensitive Data Handling

- **Context Variables**: May contain sensitive render parameters
- **Opt-out Control**: Per-render disable for sensitive operations
- **Data Retention**: Follow existing telemetry retention policies

### Recommendations

- **Review Context**: Audit contextVariables before enabling globally
- **Use Overrides**: Disable metadata completely for renders with sensitive data
- **Access Control**: Leverage existing org-scoped telemetry access

## Error Handling

### Metadata Extraction Failures

```typescript
// Graceful degradation when metadata extraction fails
try {
  const metadata = extractMetadata(deck, params, options);
  renderOutput.bfMetadata = metadata;
} catch (error) {
  // Log error but don't fail the render
  console.warn("Failed to extract deck metadata:", error);
  // renderOutput.bfMetadata remains undefined
}
```

### Malformed Deck Files

- **Robust Parsing**: Handle decks without clear names/structure
- **Fallback Values**: Use filename when deck name is unavailable
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
- [ ] deck.render() includes bfMetadata when includeBfMetadata: true
- [ ] Metadata attachment mechanism works with any LLM client
- [ ] Backward compatibility maintained (no breaking changes)
- [ ] Per-render control works correctly
- [ ] Sample attribution works in RLHF pipeline

### Quality Gates

- [ ] All unit tests pass
- [ ] Integration tests demonstrate end-to-end functionality
- [ ] Performance impact < 5% overhead (measured via benchmark suite)
- [ ] Documentation covers all usage patterns
- [ ] Security review completed for sensitive data handling
- [ ] RLHF sample attribution verified in staging environment

## Future Enhancements

### Advanced Metadata

- **Model Information**: Capture model parameters from completions
- **Performance Metrics**: Include render time and complexity metrics
- **Custom Metadata**: Allow user-defined metadata fields
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

## Rollout Plan

### Phase 1: Development

- Implement core SDK changes
- Add comprehensive test coverage
- Update documentation and examples

### Phase 2: Internal Testing

- Deploy to staging environment
- Test with example-customer.com invoice extraction
- Validate RLHF sample attribution works correctly

### Phase 3: Production Release

- Deploy to production with feature flag
- Monitor telemetry volume and performance
- Gradual rollout to existing SDK users

### Phase 4: Full Adoption

- Enable by default for new RLHF customers
- Provide migration guidance for existing customers
- Monitor and optimize based on real usage patterns

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
