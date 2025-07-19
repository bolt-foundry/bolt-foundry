# Markdown-Based Deck Sample Collection Implementation

_Implementation plan for automatic sample collection from markdown-based decks
via telemetry_

## Executive Summary

This plan outlines the implementation of automatic sample collection from
markdown-based decks through telemetry interception. The system will parse local
markdown deck files, generate content-addressable version hashes, and
automatically collect samples when AI APIs are called.

**Deck Sources**: The MVP focuses exclusively on local markdown files using
`readLocalDeck()`. Remote deck retrieval is explicitly out of scope for this
implementation.

## Architecture Overview

### Markdown-First Approach

The system treats markdown files as the source of truth for deck definitions:

1. **Local Development**: Developers work with `.deck.md` files locally
2. **Content Addressing**: Deck versions are identified by content-derived
   hashes
3. **Telemetry Discovery**: Database learns about deck versions through
   telemetry
4. **Sample Association**: Samples are linked to specific deck versions

### Refactoring from aibff

This implementation builds on the existing deck rendering system in aibff:

- **Source**: Refactor core logic from `apps/aibff/commands/render.ts`
- **Target**: Move to shared `packages/bolt-foundry/deck.ts` library
- **Benefits**: Reusable across monorepo, enables new hashing and telemetry
  features
- **Consumers**: Update aibff, team-status-analyzer, and other existing users

### Entity Relationships

```
BfOrganization → BfDeck [1:many]
BfDeck → BfDeckVersion [1:many]
BfDeckVersion → BfSample [1:many]

BfDeck: stable identity (org + deck_id)
BfDeckVersion: immutable snapshot (markdown + version hash)
BfSample: tied to specific deck version
```

### Developer Experience Flow

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

**Object-Based API Design**:

The `Deck` class provides an object-oriented interface with built-in caching:

- **Instance Creation**: `readLocalDeck()` returns a `Deck` instance
- **Parsed Content Cache**: Markdown parsing and element extraction cached on
  first access
- **Hash Computation Cache**: Version hash computed once and cached for reuse
- **Metadata Preservation**: `deck.versionHash`, `deck.deckId`, and
  `deck.markdownContent` available as properties
- **Rendering**: `deck.render(params, context)` generates OpenAI-compatible
  requests with `bfMetadata`

## MVP Scope and Anti-Goals

### In Scope for MVP

- **Local markdown files only** - `readLocalDeck()` for filesystem-based deck
  loading
- **Positional hashing** - Content-addressable version identification
- **Telemetry-based discovery** - Automatic deck version creation from API usage
- **Sample collection** - Link API interactions to specific deck versions

### Explicitly Out of Scope

- **Remote deck retrieval** - No database-hosted deck loading (`fetchDeck()`)
- **Deck editing UI** - Web-based markdown editing interfaces
- **Real-time collaboration** - Multi-user deck editing workflows
- **Version management UI** - Visual diff and history interfaces

## Implementation Files

### Core Implementation

- `packages/bolt-foundry/deck.ts` - Main Deck class with parsing, hashing, and
  rendering (refactored from aibff)
- `packages/bolt-foundry/bolt-foundry.ts` - Enhanced fetch wrapper
- `apps/bfDb/nodeTypes/rlhf/BfDeck.ts` - Deck node type
- `apps/bfDb/nodeTypes/rlhf/BfDeckVersion.ts` - Deck version node type
- `apps/boltfoundry-com/handlers/telemetry.ts` - Telemetry endpoint

### Test Files

- `packages/bolt-foundry/__tests__/deck.test.ts` - Deck class tests (parsing,
  hashing, rendering)
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
- `apps/aibff/commands/render.ts` - Source of deck rendering logic to refactor

## Development Commands

- **Test runner**: `bft test` - Run all tests
- **Linting**: `bft lint` - TypeScript linting and formatting
- **Development server**:
  `timeout 10 bft app boltfoundry-com --dev --port 4000 &` - Start dev tools in
  background

## Current Status

This plan covers Phases 2 and 3 (telemetry integration and testing) which
represent completed or current work. **Phase 1** (database schema and markdown
processing) is approximately **60% complete** with significant existing
implementations that need refactoring and enhancement. Details can be found
under "Next Steps" at the bottom of this document.

## Phase 2: Telemetry Integration

### Overview

Phase 2 connects the deck system to the telemetry pipeline, enabling automatic
sample collection when developers use decks in their API calls.

### Enhanced Fetch Wrapper

**connectBoltFoundry() Updates**:

- Strips `bfMetadata` before sending to OpenAI
- Preserves `bfMetadata` in telemetry data
- Sends to collector endpoint with API key authentication

**Provider Support Updates**:

- Remove Mistral support (no longer needed)
- Add OpenRouter support for multi-model access
- Continue supporting OpenAI and Anthropic

### Rendering and Metadata

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

### Telemetry Endpoint

**Location**: `/api/telemetry` endpoint in boltfoundry-com

**Functionality**:

1. Validates API key via `CurrentViewer.createFromRequest()`
2. Extracts `bfMetadata` from telemetry data
3. Finds or creates `BfDeck` and `BfDeckVersion` from metadata
4. Creates `BfSample` nodes linked to specific deck versions
5. Sets `collectionMethod: "telemetry"` for automatic samples

### Database Patterns

- **Immutable Versions**: Never modify existing deck versions
- **Content Discovery**: Create versions on first telemetry hit
- **Relationship Tracking**: Link samples to specific versions
- **Query Optimization**: Index on version hashes for fast lookups

### Phase 2 Implementation Tasks

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

### Phase 2 Success Criteria

- [ ] Telemetry endpoint creates samples linked to deck versions
- [ ] Enhanced fetch wrapper preserves bfMetadata in telemetry
- [ ] Provider support updated (remove Mistral, add OpenRouter)

## Phase 3: Testing and Validation

### Overview

Phase 3 ensures the complete pipeline works end-to-end and establishes
comprehensive testing coverage for reliability.

### Testing Strategy

#### Unit Tests

- **Markdown parsing** - Card/lead/embed extraction
- **Hash generation** - Positional hash calculations
- **Deck rendering** - OpenAI request generation
- **Telemetry transformation** - Data format conversion

#### Integration Tests

- **End-to-end telemetry flow** - Complete pipeline from markdown to sample
- **Deck version discovery** - First-time deck creation via telemetry
- **Sample association** - Correct linking to deck versions
- **Error handling** - Malformed markdown, network failures

#### Performance Tests

- **Markdown parsing** - Large deck processing
- **Hash generation** - Efficient calculation
- **Telemetry throughput** - Handle expected volume
- **Database operations** - Efficient sample creation

### Auto-Evaluation Service

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

### Disagreement Detection

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

### Phase 3 Implementation Tasks

- [ ] Test complete deck.render() → telemetry → sample creation flow
- [ ] Test markdown parsing and hash generation
- [ ] Test deck version discovery and creation
- [ ] Test error scenarios and edge cases

### Phase 3 Success Criteria

- [ ] End-to-end flow working: markdown → render → telemetry → sample
- [ ] Comprehensive error handling and monitoring
- [ ] Performance testing passed
- [ ] Documentation updated

## Next Steps

This is the work that we should focus on. Above provides context, but below here
is the work we're trying to complete right now.

### Phase 1: Database Schema and Markdown Processing

#### Overview

Phase 1 establishes the foundational data structures and deck processing logic
by refactoring existing aibff functionality into a shared library with added
hashing capabilities.

**Implementation Strategy**: Test-driven cleanroom implementation approach.
Write comprehensive tests based on existing aibff behavior, then implement clean
new code in the shared package. This ensures we understand the full scope of
requirements while building a maintainable foundation for versioning
enhancements.

#### Database Schema

**BfDeck - ✅ FULLY IMPLEMENTED**:

- **Location**: `apps/bfDb/nodeTypes/rlhf/BfDeck.ts`
- **Status**: Production-ready with GraphQL mutations, organization scoping
- **Features**: Auto-generates graders, integrates with RLHF evaluation system
- **Schema**: `name`, `systemPrompt`, `description`, `slug` fields implemented

**BfDeckVersion - ❌ NOT IMPLEMENTED**:

```typescript
interface BfDeckVersionProps {
  versionHash: string; // Content-derived hash
  markdownContent: string; // Original markdown
  parsedElements: ParsedElement[]; // Cards/leads/embeds with hashes
}
```

This is the missing component needed for content-addressable deck versioning.

#### Deck Version Hashing

**Positional Hash Generation**:

- Parse markdown into elements (cards, leads, embeds)
- Generate positional hashes: `hash(element_content + previous_position_hash)`
- Derive deck version hash from all positional hashes
- Changes cascade through subsequent elements

**Content Addressability**:

- Same markdown content always produces same hash
- Different versions create different hashes
- Efficient change detection and diffing

#### Markdown Processing - ✅ SOPHISTICATED LOGIC EXISTS

**Current Implementation** in `apps/aibff/commands/render.ts`:

- **`processMarkdownIncludes()`**: Recursive include processing, tool extraction
- **`extractContextFromMarkdown()`**: TOML context variable definitions
- **`renderDeck()`**: Complete OpenAI request generation with Q&A pairs
- **Tool System**: Parses OpenAI function definitions from TOML frontmatter
- **Sample Management**: Extracts conversation samples for calibration
- **Validation**: Tool name uniqueness, context variable validation

**❌ NEEDS REFACTORING**: Currently in aibff app, needs move to shared package

**❌ CONSUMER ANTI-PATTERN**: `packages/team-status-analyzer` imports from aibff
app

**🔄 DUPLICATE IMPLEMENTATION**: `infra/bft/tasks/deck.bft.ts` has separate
logic

#### Hash Generation Patterns

- **Deterministic**: Same content always produces same hash
- **Cascading**: Changes affect all subsequent elements
- **Efficient**: Fast lookups and change detection
- **Collision-Resistant**: Use SHA-256 for hash generation

#### Phase 1 Implementation Tasks

**Priority 1: Test-Driven Cleanroom Implementation**

##### 1.1 Implement Clean Deck Package ✅ COMPLETED

- [x] Create `packages/bolt-foundry/deck.ts` with clean object-oriented
      implementation
- [x] Implement `Deck` class using test-driven approach:
  - [x] Internal markdown processing with caching (includes, context, tools)
  - [x] `render()` method for OpenAI request generation
  - [x] Properties: `deckId`, `markdownContent`, `deckPath` (versionHash
        pending)
- [x] Implement `readLocalDeck()` function that returns `Deck` instances
- [x] Ensure all tests pass before proceeding
- [x] Add TypeScript types and proper error handling

##### 1.2 Replace Existing Usage

- [ ] Update `packages/team-status-analyzer/ai-summarizer.ts` to use new package
- [ ] Update aibff internal imports (`commands/repl.ts`, `gui/guiServer.ts`)
- [ ] Verify existing functionality works with new implementation
- [ ] Run aibff tests to ensure no regressions
- [ ] Consider consolidating `infra/bft/tasks/deck.bft.ts` logic

**Priority 2: Add Versioning System**

##### 1.3 Database Schema Enhancement

- [x] ~~Create `BfDeck` node type~~ **ALREADY IMPLEMENTED** at
      `apps/bfDb/nodeTypes/rlhf/BfDeck.ts`
- [ ] Create `BfDeckVersion` node type
      (`apps/bfDb/nodeTypes/rlhf/BfDeckVersion.ts`)
- [x] ~~Create comprehensive test suite~~ **EXISTS** for BfDeck

##### 1.4 Enhanced Deck Processing

- [ ] Add positional hash generation to the refactored parsing logic
- [ ] Create object-based `Deck` class with `.render()` method for local
      markdown files
- [ ] Implement caching of parsed markdown and computed hashes in Deck instances
- [ ] Add `readLocalDeck()` function that returns `Deck` instances

#### Phase 1 Success Criteria

**Priority 1 Complete:**

- [x] Comprehensive test suite covers all existing aibff deck behavior
- [x] Clean implementation in `packages/bolt-foundry/deck.ts` passes all tests
- [ ] `packages/team-status-analyzer` no longer imports from aibff app
- [ ] All existing deck functionality works from shared package
- [ ] Aibff tests pass with new implementation

**Priority 2 Complete:**

- [ ] Markdown parsing generates consistent positional hashes
- [ ] `readLocalDeck()` loads and renders local markdown files
- [ ] Deck versions are properly created and stored

## Future Enhancements

### Remote Deck Management

- **Database-hosted decks** - Store and retrieve deck definitions from database
- **Deck editor** - Web-based markdown editing interface
- **Version management** - Track deck evolution over time
- **Collaboration** - Multi-user deck editing workflows

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

---

# Current Project

## Create Comprehensive Test Suite

- [ ] Study existing aibff behavior to understand all edge cases and
      requirements
- [ ] Create `packages/bolt-foundry/__tests__/deck.test.ts` with comprehensive
      test coverage:
  - [ ] Markdown include processing (recursive, different file types)
  - [ ] Context extraction from TOML files
  - [ ] Tool extraction from frontmatter
  - [ ] Sample extraction for calibration
  - [ ] OpenAI request generation with proper message structure
  - [ ] Error handling for missing files, malformed TOML, etc.
- [ ] Create test fixtures with representative .deck.md and .toml files
- [ ] Document expected behavior for each function based on aibff analysis
- [ ] Use `// @ts-expect-error - $EXPLANATION` for any TypeScript errors from
      unscaffolded dependencies
