# Markdown-Based Deck Sample Collection Implementation

_Implementation plan for automatic sample collection from markdown-based decks
via telemetry_

## Executive Summary

This plan outlines the implementation of automatic sample collection from
markdown-based decks through telemetry interception. The system will parse local
markdown deck files, generate content-addressable version hashes, and
automatically collect samples when AI APIs are called.

**Deck Sources**: The system supports both local markdown files
(`readLocalDeck()`) and remote deck retrieval (`fetchDeck()`). The MVP focuses
on local markdown files, with remote deck management as a future enhancement.

## Implementation Status

### ✅ **MVP Telemetry Endpoint Complete** (July 2025)

**What's Built:**

- **Telemetry Handler** (`apps/boltfoundry-com/handlers/telemetry.ts`) -
  Processes telemetry data and creates BfDeck/BfSample records
- **API Routes Structure** (`apps/boltfoundry-com/apiRoutes.ts`) - Clean
  separation of API routes from React routes
- **Integration Tests**
  (`apps/boltfoundry-com/__tests__/telemetry.integration.test.ts`) - Full test
  suite with 7 passing tests
- **Server Integration** - Added `/api/telemetry` endpoint to boltfoundry-com
  server

**What's Working:**

- ✅ API key authentication (`bf+{orgId}` format)
- ✅ JSON parsing and validation
- ✅ Error handling (missing API key, invalid JSON, wrong HTTP method)
- ✅ Deck creation from telemetry metadata (simplified - creates new deck each
  time)
- ✅ Sample creation with telemetry data stored as JSON
- ✅ Proper HTTP responses and status codes
- ✅ Database integration with BfOrganization, BfDeck, and BfSample nodes

**Simplified for MVP:**

- **No content-addressable hashing** - Skipped positional hash generation for
  now
- **No BfDeckVersion entity** - Using simplified deck creation pattern
- **No deck deduplication** - Creates new deck for each telemetry request
- **Basic authentication** - Simple `bf+{orgId}` API key format

**Current Limitations:**

- Organizations must exist in database (normal for production, but requires
  setup for testing)
- No deck versioning or content-addressable identification
- No deck deduplication or conflict resolution

### 🔄 **Next Steps for Full Implementation:**

1. **Enhanced Telemetry Integration** - Update
   `packages/bolt-foundry/bolt-foundry.ts` to support `bfMetadata`
2. **Deck Loading Functions** - Implement `readLocalDeck()` and `fetchDeck()`
3. **Content-Addressable Hashing** - Add positional hash generation system
4. **BfDeckVersion Entity** - Implement proper versioning system
5. **Provider Updates** - Remove Mistral, add OpenRouter support

## Architecture Overview

### Markdown-First Approach

The system treats markdown files as the source of truth for deck definitions:

1. **Local Development**: Developers work with `.deck.md` files locally
2. **Content Addressing**: Deck versions are identified by content-derived
   hashes
3. **Telemetry Discovery**: Database learns about deck versions through
   telemetry
4. **Sample Association**: Samples are linked to specific deck versions

### Entity Relationships

```
BfOrganization → BfDeck [1:many]
BfDeck → BfDeckVersion [1:many]
BfDeckVersion → BfSample [1:many]

BfDeck: stable identity (org + deck_id)
BfDeckVersion: immutable snapshot (markdown + version hash)
BfSample: tied to specific deck version
```

## Technical Specifications

### 1. Deck Version Hashing

**Positional Hash Generation**:

- Parse markdown into elements (cards, leads, embeds)
- Generate positional hashes: `hash(element_content + previous_position_hash)`
- Derive deck version hash from all positional hashes
- Changes cascade through subsequent elements

**Content Addressability**:

- Same markdown content always produces same hash
- Different versions create different hashes
- Efficient change detection and diffing

### 2. Database Schema

**BfDeck**:

```typescript
interface BfDeckProps {
  name: string; // Human-readable name
  systemPrompt: string; // Evaluation criteria for graders
  description: string; // Detailed description
  deckId: string; // Logical identifier (e.g., filename without extension)
  slug: string; // URL-friendly identifier for API (orgslug_deckslug format)
}
```

**BfDeckVersion**:

```typescript
interface BfDeckVersionProps {
  versionHash: string; // Content-derived hash
  markdownContent: string; // Original markdown
  parsedElements: ParsedElement[]; // Cards/leads/embeds with hashes
}
```

### 3. Developer Experience Flow

**Local Development**:

1. **Setup telemetry**: `const fetch = connectBoltFoundry(apiKey)`
2. **Create OpenAI client**: `const openai = new OpenAI({ fetch })`
3. **Load local markdown deck**:
   `const deck = await readLocalDeck("customer-service.deck.md")`
4. **Render with deck**:
   `const params = deck.render({ messages: [...] }, { context: { userId: "123", feature: "chat" } })`
5. **API call**:
   `const completion = await openai.chat.completions.create(params)`
6. **Automatic sample collection**: Sample saved to deck version via telemetry
   interception

### 4. Rendering and Metadata

**deck.render() Output**:

```typescript
{
  messages: [
    { role: "system", content: "Combined deck content" },
    { role: "assistant", content: "What is your name?" },
    { role: "user", content: "Alice" }
  ],
  tools: [...], // OpenAI function definitions if present
  model: "gpt-4",
  bfMetadata: {
    deckId: "customer-service", // From filename or manual ID
    deckVersionHash: "abc123def456", // Derived from positional hashes
    markdownContent: "# Customer Service\n...", // Original markdown
    contextVariables: { userId: "123", feature: "chat" },
    parsedElements: [...] // Cards/leads/embeds with positional hashes
  }
}
```

### 5. Telemetry Integration

**Enhanced connectBoltFoundry()**:

- Strips `bfMetadata` before sending to OpenAI
- Preserves `bfMetadata` in telemetry data
- Sends to collector endpoint with API key authentication

**Provider Support**:

- Remove Mistral support (no longer needed)
- Add OpenRouter support for multi-model access
- Continue supporting OpenAI and Anthropic

**Telemetry Endpoint**: Add `/api/telemetry` endpoint to boltfoundry-com that:

1. Validates API key via `CurrentViewer.createFromRequest()`
2. Extracts `bfMetadata` from telemetry data
3. Finds or creates `BfDeck` and `BfDeckVersion` from metadata
4. Creates `BfSample` nodes linked to specific deck versions
5. Sets `collectionMethod: "telemetry"` for automatic samples

### 6. Auto-Evaluation Service

**Location**: `/apps/bfDb/services/autoEvaluationService.ts`

**Core Functions**:

```typescript
interface AutoEvaluationService {
  evaluateSampleOnSubmission(
    sample: BfSample,
    deck: BfDeck,
  ): Promise<BfGraderResult[]>;
  adaptAibffEvaluationLogic(
    sample: BfSample,
    grader: BfGrader,
  ): Promise<BfGraderResult>;
}
```

**Implementation**:

- Integrate with existing `submitSample` mutation
- Adapt existing aibff evaluation logic from `apps/aibff/commands/calibrate.ts`
- Create BfGraderResult entities with proper relationships
- Add error handling and logging

### 7. Disagreement Detection

**Core Queries**:

```typescript
// Find samples where AI score differs significantly from human score
// Simple threshold-based detection for MVP
const DISAGREEMENT_THRESHOLD = 2; // |ai_score - human_score| >= 2
```

**Implementation**:

- Add GraphQL queries for finding AI/human disagreements
- Create simple scoring threshold for "out of whack" samples
- Add database indexes for efficient disagreement queries

## Implementation Plan

### Phase 1: Markdown Parsing and Hashing

#### 1.1 Database Schema

- [ ] Create `BfDeck` node type (`apps/bfDb/nodeTypes/rlhf/BfDeck.ts`)
- [ ] Create `BfDeckVersion` node type
      (`apps/bfDb/nodeTypes/rlhf/BfDeckVersion.ts`)
- [ ] Add GraphQL mutations for deck/version management
- [ ] Create comprehensive test suite

#### 1.2 Markdown Processing

- [ ] Implement markdown parser with positional hash generation
      (`packages/bolt-foundry/deck-parser.ts`)
- [ ] Create `readLocalDeck()` function for local markdown files
      (`packages/bolt-foundry/deck-loader.ts`)
- [ ] Add `fetchDeck()` function stub for remote deck retrieval
      (`packages/bolt-foundry/deck-loader.ts`)
- [ ] Implement deck rendering with bfMetadata generation

### Phase 2: Telemetry Integration

#### 2.1 Enhanced Fetch Wrapper

- [ ] Update `connectBoltFoundry()` to strip `bfMetadata` before OpenAI calls
      (`packages/bolt-foundry/bolt-foundry.ts`)
- [ ] Update provider detection: Remove Mistral, add OpenRouter
      (`packages/bolt-foundry/bolt-foundry.ts`)
- [ ] Preserve `bfMetadata` in telemetry data for deck version association

#### 2.2 Telemetry Endpoint

- [ ] Add `/api/telemetry` route to boltfoundry-com
- [ ] Implement telemetry data transformation with `bfMetadata` extraction
- [ ] Find/create `BfDeck` and `BfDeckVersion` from telemetry metadata
- [ ] Create `BfSample` nodes linked to specific deck versions
- [ ] Create error handling and response patterns

### Phase 3: End-to-End Testing

- [ ] Test complete deck.render() → telemetry → sample creation flow
- [ ] Test markdown parsing and hash generation
- [ ] Test deck version discovery and creation
- [ ] Test error scenarios and edge cases

## Technical Patterns

### Markdown Processing

- **Recursive Parsing**: Handle nested cards, leads, and embeds
- **Context Injection**: Convert context variables to Q&A message pairs
- **Tool Extraction**: Parse OpenAI function definitions from frontmatter
- **Content Cleaning**: Remove embeds from system messages

### Hash Generation

- **Deterministic**: Same content always produces same hash
- **Cascading**: Changes affect all subsequent elements
- **Efficient**: Fast lookups and change detection
- **Collision-Resistant**: Use SHA-256 for hash generation

### Database Patterns

- **Immutable Versions**: Never modify existing deck versions
- **Content Discovery**: Create versions on first telemetry hit
- **Relationship Tracking**: Link samples to specific versions
- **Query Optimization**: Index on version hashes for fast lookups

## Testing Strategy

### Unit Tests

- **Markdown parsing** - Card/lead/embed extraction
- **Hash generation** - Positional hash calculations
- **Deck rendering** - OpenAI request generation
- **Telemetry transformation** - Data format conversion

### Integration Tests

- **End-to-end telemetry flow** - Complete pipeline from markdown to sample
- **Deck version discovery** - First-time deck creation via telemetry
- **Sample association** - Correct linking to deck versions
- **Error handling** - Malformed markdown, network failures

### Performance Tests

- **Markdown parsing** - Large deck processing
- **Hash generation** - Efficient calculation
- **Telemetry throughput** - Handle expected volume
- **Database operations** - Efficient sample creation

## Future Enhancements

### Remote Deck Management

- **fetchDeck() implementation** - Retrieve decks from database
- **Deck editor** - Web-based markdown editing
- **Version management** - Track deck evolution over time
- **Collaboration** - Multi-user deck editing

### Advanced Features

- **Content hashing** - Stable element references for editing
- **Edit history** - Track changes and migrations
- **Diff visualization** - Show changes between versions
- **Automated testing** - Validate deck changes with samples

### Performance Optimizations

- **Parsing cache** - Cache parsed deck structures
- **Incremental hashing** - Only recalculate changed elements
- **Batch operations** - Process multiple samples efficiently
- **Background processing** - Async telemetry processing

## Implementation Files

### Core Implementation

- `packages/bolt-foundry/deck-parser.ts` - Markdown parsing and hash generation
- `packages/bolt-foundry/deck-loader.ts` - Local and remote deck loading
- `packages/bolt-foundry/bolt-foundry.ts` - Enhanced fetch wrapper
- `apps/bfDb/nodeTypes/rlhf/BfDeck.ts` - Deck node type
- `apps/bfDb/nodeTypes/rlhf/BfDeckVersion.ts` - Deck version node type
- `apps/boltfoundry-com/handlers/telemetry.ts` - Telemetry endpoint

### Test Files

- `packages/bolt-foundry/__tests__/deck-parser.test.ts` - Parsing tests
- `packages/bolt-foundry/__tests__/deck-loader.test.ts` - Loading tests
- `packages/bolt-foundry/__tests__/bolt-foundry.test.ts` - Fetch wrapper tests
- `apps/bfDb/nodeTypes/rlhf/__tests__/BfDeck.test.ts` - Deck tests
- `apps/bfDb/nodeTypes/rlhf/__tests__/BfDeckVersion.test.ts` - Version tests
- `apps/boltfoundry-com/__tests__/telemetry.test.ts` - Integration tests

### Supporting Files

- `apps/boltfoundry-com/services/telemetryTransformer.ts` - Data transformation
- `packages/bolt-foundry/types/deck.ts` - TypeScript type definitions

### Existing Files Referenced

- `packages/bolt-foundry/bolt-foundry.ts:92-210` - Current fetch wrapper
- `packages/bolt-foundry/bolt-foundry.ts:45-63` - TelemetryData type
- `apps/bfDb/nodeTypes/rlhf/BfSample.ts` - Sample storage

## Development Commands

- **Test runner**: `bft test` - Run all tests
- **Build system**: `bft build` - Full project build
- **Development**: `bft devTools` - Start development environment
- **Linting**: `bft lint` - TypeScript linting and formatting

## Success Criteria

### Phase 1 Complete

- [ ] Markdown parsing generates consistent positional hashes
- [ ] `readLocalDeck()` loads and renders local markdown files
- [ ] Deck versions are properly created and stored

### Phase 2 Complete

- [ ] Telemetry endpoint creates samples linked to deck versions
- [ ] Enhanced fetch wrapper preserves bfMetadata in telemetry
- [ ] Provider support updated (remove Mistral, add OpenRouter)

### Phase 3 Complete

- [ ] End-to-end flow working: markdown → render → telemetry → sample
- [ ] Comprehensive error handling and monitoring
- [ ] Performance testing passed
- [ ] Documentation updated
