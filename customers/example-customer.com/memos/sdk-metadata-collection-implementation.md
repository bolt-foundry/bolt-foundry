# Bolt Foundry SDK Metadata Collection Implementation Memo

**Date**: 2025-07-28  
**Status**: Ready for Implementation  
**Goal**: Enable automatic deck metadata collection in SDK telemetry for RLHF sample attribution

## Executive Summary

This memo outlines the implementation plan for enhancing the bolt-foundry SDK to automatically collect and transmit deck metadata with telemetry data. This enables automatic linking of AI completion samples to their originating RLHF decks without manual sample creation.

## Problem Statement

Currently, when using the bolt-foundry SDK for AI completions:
1. Telemetry captures request/response data but loses deck context
2. Samples cannot be automatically linked to specific Bolt Foundry decks
3. Manual sample creation is required with deck metadata
4. No way to associate completions with their originating evaluation criteria

## Solution Overview

Add optional metadata collection to the SDK:
- **Render-level control**: Per-render option to include metadata
- **Type augmentation**: Extend OpenAI types to accept `bfMetadata`
- **Transparent pass-through**: Metadata flows naturally with API calls

## Technical Design

### 1. OpenAI Type Augmentation

```typescript
// Extend OpenAI's types to accept bfMetadata (non-streaming only)
declare module 'openai' {
  interface ChatCompletionCreateParams {
    bfMetadata?: BfMetadata;
  }
  // Note: ChatCompletionCreateParamsStreaming intentionally not extended
  // Streaming requests do not support metadata collection
}
```

This approach leverages TypeScript's module augmentation to extend OpenAI's types without modifying their code. The OpenAI API ignores unknown properties, so `bfMetadata` passes through safely.

**Important**: Metadata collection is only supported for non-streaming completions. Streaming requests (`stream: true`) will not capture deck metadata.

### 2. Deck Render Enhancement

```typescript
// Enhanced deck.render() signature and output
interface RenderOptions {
  includeBfMetadata?: boolean; // Per-render override
}

interface RenderOutput {
  messages: Array<{role: string, content: string}>;
  tools?: Array<ToolDefinition>;
  bfMetadata?: BfMetadata; // NEW: Optional metadata
}

interface BfMetadata {
  deckId: string;             // Deck database ID for sample attribution
  contextVariables: Record<string, JSONValue>; // Render parameters (JSON-serializable)
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
    deckId: deck.id, // Deck ID is derived from filename (used as slug)
    contextVariables: params
  };
}
```

### 3. BfClient Enhancement

```typescript
// BfClient provides telemetry and metadata support
interface BfClientConfig {
  apiKey: string;
  collectorEndpoint?: string;
}

class BfClient {
  public readonly openai: OpenAI;
  private telemetryCollector: TelemetryCollector;
  
  constructor(config: BfClientConfig) {
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY // User manages their own OpenAI key
    });
    this.telemetryCollector = new TelemetryCollector({
      endpoint: config.collectorEndpoint,
      apiKey: config.apiKey
    });
  }
  
  static create(config: BfClientConfig): BfClient {
    const client = new BfClient(config);
    // Wrap OpenAI's fetch to capture telemetry with metadata
    client.wrapOpenAIFetch();
    return client;
  }
  
  private wrapOpenAIFetch() {
    const originalFetch = this.openai.httpClient.fetch;
    
    this.openai.httpClient.fetch = async (url: string, init: RequestInit) => {
      // Only process JSON requests
      if (typeof init.body !== 'string') {
        return originalFetch(url, init);
      }
      
      const body = JSON.parse(init.body);
      const { bfMetadata, ...cleanBody } = body;
      
      // Skip telemetry for streaming requests
      if (cleanBody.stream === true) {
        return originalFetch(url, init);
      }
      
      // Make request without metadata
      const response = await originalFetch(url, {
        ...init,
        body: JSON.stringify(cleanBody)
      });
      
      // Record telemetry for non-streaming requests
      if (bfMetadata) {
        try {
          // Determine provider from model name or domain
          const model = cleanBody.model || '';
          const provider = model.includes('/') 
            ? model.split('/')[0] 
            : new URL(url).hostname.replace('api.', '').replace('.com', '');
          
          // Clone response before consuming it
          const responseClone = response.clone();
          const responseBody = await responseClone.json();
          
          await this.telemetryCollector.record({
            provider,
            request: {
              url,
              method: init.method || 'POST',
              headers: init.headers as Record<string, string>,
              body: cleanBody,
              timestamp: new Date().toISOString()
            },
            response: {
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
              body: responseBody,
              timestamp: new Date().toISOString()
            },
            bfMetadata
          });
          
          // Return original response (not the consumed clone)
          return response;
        } catch (error) {
          // Telemetry failures should not break API calls - fail silently
          return response;
        }
      }
      
      return response;
    };
  }
}
```

### 4. Telemetry Data Structure

```typescript
// Enhanced telemetry payload
interface TelemetryData {
  provider: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: JSONValue;
    timestamp: string;  // When request was sent
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: JSONValue;
    timestamp: string;  // When response was received
  };
  
  // NEW: Optional metadata
  bfMetadata?: BfMetadata;
}
```

## Implementation Plan

### Phase 1: Core SDK Changes

#### 1.1 Module Augmentation & Client Setup
- [ ] Create TypeScript module augmentation file for OpenAI types
- [ ] Add OpenAI client initialization to BfClient
- [ ] Implement fetch wrapping mechanism to intercept metadata
- [ ] Set up telemetry collector integration

#### 1.2 Deck Render Enhancement
- [ ] Add RenderOptions interface with includeBfMetadata field
- [ ] Enhance deck.render() signature to accept options parameter
- [ ] Update RenderOutput interface to include optional bfMetadata
- [ ] Implement metadata extraction from deck context

#### 1.3 Metadata Extraction Logic
- [ ] Create BfMetadata interface definition
- [ ] Implement simple metadata extraction from deck context
- [ ] Store render parameters as contextVariables

### Phase 2: Telemetry Integration

#### 2.1 Telemetry Data Enhancement
- [ ] Add optional bfMetadata field to TelemetryData interface
- [ ] Update client-side telemetry collection to capture metadata from request context
- [ ] Implement simple conditional metadata inclusion logic
- [ ] Ensure backward compatibility with existing telemetry consumers
- [ ] Enhance server-side telemetry handler to process metadata and create RLHF samples with deck attribution

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
// 1. Client configured with telemetry
const client = BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry"
});

// 2. Deck render produces metadata
const completion = deck.render({ invoice: data }, {
  includeBfMetadata: true
}); 
// completion = { messages, bfMetadata: { deckId, contextVariables } }

// 3. Pass metadata directly in OpenAI call
const response = await client.openai.chat.completions.create({
  messages: completion.messages,
  model: "gpt-4",
  temperature: 0.1,
  bfMetadata: completion.bfMetadata // Type-safe with module augmentation
});

// 4. SDK's wrapped fetch captures both request and metadata
// 5. Telemetry handler creates RLHF sample with deck attribution
```

## API Examples

### Basic Usage (Metadata Disabled - Default)
```typescript
// Default behavior - no metadata collection
const client = BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry"
});

const deck = await readLocalDeck("./deck.md");
const completion = deck.render({ input: "data" });
// completion.bfMetadata is undefined

const response = await client.openai.chat.completions.create({
  messages: completion.messages,
  model: "gpt-4"
  // No bfMetadata field
});
// telemetry.bfMetadata is undefined
```

### Metadata Collection Enabled
```typescript
// Enable metadata collection at render time
const client = BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry"
});

const deck = await readLocalDeck("./invoice-extraction.deck.md");
const completion = deck.render({ invoice: invoiceText }, {
  includeBfMetadata: true // Enable for this render
});
// completion.bfMetadata = {
//   deckId: "bf_deck_12345",
//   contextVariables: { invoice: invoiceText }
// }

const response = await client.openai.chat.completions.create({
  messages: completion.messages,
  model: "gpt-4",
  temperature: 0.1,
  bfMetadata: completion.bfMetadata // Pass metadata directly
});
// SDK telemetry captures the metadata
```

### Per-Render Control
```typescript
const deck = await readLocalDeck("./my-deck.md");

// Skip metadata for sensitive operations
const completion1 = deck.render({ data: "sensitive" }, {
  includeBfMetadata: false // or simply omit the option
});
// completion1.bfMetadata is undefined

// Include metadata for RLHF operations
const completion2 = deck.render({ data: "normal" }, {
  includeBfMetadata: true
});
// completion2.bfMetadata is included

// When calling OpenAI, metadata naturally flows through
const response = await client.openai.chat.completions.create({
  messages: completion2.messages,
  model: "gpt-4",
  bfMetadata: completion2.bfMetadata // Type-safe with module augmentation
});
```

## Known Limitations

### Streaming Support
- **Non-streaming only**: Metadata collection is not supported for streaming completions
- **No telemetry for streaming**: Streaming requests bypass telemetry collection entirely
- **TypeScript enforcement**: Streaming interface not extended to prevent accidental usage
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
- `packages/bolt-foundry/BfClient.ts` - Add metadata configuration and context management
- `packages/bolt-foundry/deck/Deck.ts` - Enhance render method with selective metadata
- `packages/bolt-foundry/telemetry/TelemetryCollector.ts` - Add client-side metadata handling
- `packages/bolt-foundry/types/index.ts` - Add interface definitions
- `apps/boltfoundry-com/handlers/telemetry.ts` - Enhance server-side telemetry to process metadata and create samples with deck attribution

### Test Files
- `packages/bolt-foundry/__tests__/BfClient.test.ts` - Client configuration tests
- `packages/bolt-foundry/__tests__/Deck.test.ts` - Render enhancement tests
- `packages/bolt-foundry/__tests__/Telemetry.test.ts` - End-to-end telemetry tests
- `packages/bolt-foundry/__tests__/MetadataCollection.integration.test.ts` - New integration tests

### Documentation Files
- `packages/bolt-foundry/README.md` - Usage examples, migration guide, and streaming limitations
- `docs/sdk/metadata-collection.md` - Detailed metadata collection guide including non-streaming requirement

## Success Criteria

### MVP Requirements
- [ ] Module augmentation extends OpenAI types to accept bfMetadata
- [ ] deck.render() includes bfMetadata when includeBfMetadata: true
- [ ] BfClient wraps OpenAI fetch to capture metadata in telemetry
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

### Phase 1: Development (Week 1)
- Implement core SDK changes
- Add comprehensive test coverage
- Update documentation and examples

### Phase 2: Internal Testing (Week 2) 
- Deploy to staging environment
- Test with example-customer.com invoice extraction
- Validate RLHF sample attribution works correctly

### Phase 3: Production Release (Week 3)
- Deploy to production with feature flag
- Monitor telemetry volume and performance
- Gradual rollout to existing SDK users

### Phase 4: Full Adoption (Week 4)
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
- `customers/example-customer.com/memos/telemetry-and-rlhf-implementation.md` - Parent implementation memo

### Testing References
- `packages/bolt-foundry/__tests__/` - Existing SDK test patterns
- `apps/bfDb/nodeTypes/rlhf/__tests__/` - RLHF testing patterns
- `infra/bft/tasks/test.bft.deck.md` - Test execution via BFT