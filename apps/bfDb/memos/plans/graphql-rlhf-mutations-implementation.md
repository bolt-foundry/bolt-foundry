# GraphQL RLHF Mutations Implementation Memo

_Implementation plan for exposing RLHF pipeline functionality via GraphQL
mutations_

**Date:** 2025-07-15\
**Author:** Claude Code\
**Status:** Ready for Implementation

## Executive Summary

This memo outlines the implementation of GraphQL mutations to expose the
existing RLHF (Reinforcement Learning from Human Feedback) data model through
the API. The implementation focuses on two core mutations: `createDeck` for deck
creation with automatic grader generation, and `submitSample` for sample
submission to decks.

## Context and Current State

### What Exists

- ✅ Complete RLHF data model (5 BfNode types: BfDeck, BfGrader, BfSample,
  BfGraderResult, BfSampleFeedback)
- ✅ All node types properly registered in GraphQL schema
- ✅ Comprehensive test suite with TDD patterns
- ✅ Mock system prompt analyzer service
  (`apps/bfDb/services/mockPromptAnalyzer.ts`)
- ✅ Database relationships and organization scoping working

### What's Missing

- ❌ GraphQL mutations for creating and managing RLHF entities
- ❌ API endpoints for deck creation and sample submission
- ❌ End-to-end workflow testing via GraphQL

## Implementation Plan

### Phase 1: Core Mutations (This Implementation)

#### 1.1 BfDeck.createDeck Mutation

**Location:** `apps/bfDb/nodeTypes/rlhf/BfDeck.ts`

**Purpose:** Create a new evaluation deck with auto-generated graders

**GraphQL Signature:**

```graphql
mutation CreateDeck($name: String!, $systemPrompt: String!, $description: String) {
  createDeck(name: $name, systemPrompt: $systemPrompt, description: $description) {
    id
    name
    systemPrompt
    description
  }
}
```

**Implementation Pattern:**

```typescript
.mutation("createDeck", {
  args: (a) => a
    .nonNull.string("name")
    .nonNull.string("systemPrompt")
    .string("description"),
  returns: "BfDeck",
  resolve: async (_src, args, ctx) => {
    // 1. Get current viewer and organization context
    // 2. Analyze system prompt using mock analyzer
    // 3. Create BfDeck with provided arguments
    // 4. Create BfGrader nodes from analysis results
    // 5. Return created BfDeck
  }
})
```

**Business Logic:**

1. **Authentication:** Requires logged-in user with organization context
2. **System Prompt Analysis:** Uses existing
   `mockPromptAnalyzer.analyzeSystemPrompt()`
3. **Grader Generation:** Creates 2-4 BfGrader nodes based on analysis
   (helpfulness, clarity, code quality, accuracy, creativity)
4. **Organization Scoping:** All nodes automatically scoped to
   `CurrentViewer.orgBfOid`

#### 1.2 BfSample.submitSample Mutation

**Location:** `apps/bfDb/nodeTypes/rlhf/BfSample.ts`

**Purpose:** Submit a sample (AI completion) to an existing deck

**GraphQL Signature:**

```graphql
mutation SubmitSample($deckId: String!, $completionData: JSON!, $collectionMethod: String) {
  submitSample(deckId: $deckId, completionData: $completionData, collectionMethod: $collectionMethod) {
    id
    completionData
    collectionMethod
  }
}
```

**Implementation Pattern:**

```typescript
.mutation("submitSample", {
  args: (a) => a
    .nonNull.string("deckId")
    .nonNull.object("completionData")
    .string("collectionMethod"),
  returns: "BfSample",
  resolve: async (_src, args, ctx) => {
    // 1. Get current viewer and organization context
    // 2. Find BfDeck by ID (with organization scoping)
    // 3. Validate deck exists and user has access
    // 4. Create BfSample linked to deck
    // 5. Return created BfSample
  }
})
```

**Business Logic:**

1. **Authentication:** Requires logged-in user with organization context
2. **Deck Validation:** Verify deck exists and belongs to user's organization
3. **Sample Creation:** Create BfSample with completion data and metadata
4. **Default Values:** `collectionMethod` defaults to "manual" if not provided

## Technical Architecture

### Authentication and Authorization

**CurrentViewer Integration:**

- All mutations require authenticated user (`CurrentViewerLoggedIn`)
- Organization scoping via `ctx.getCvForGraphql()` and `cv.orgBfOid`
- Automatic node scoping through BfNode metadata

**Error Handling:**

- Return GraphQL errors for unauthenticated requests
- Return structured errors for validation failures
- Handle organization scoping violations gracefully

### Data Flow Patterns

**createDeck Flow:**

```
User Request → Authentication → System Prompt Analysis → 
BfDeck Creation → BfGrader Generation → Response
```

**submitSample Flow:**

```
User Request → Authentication → Deck Validation → 
BfSample Creation → Response
```

### Integration Points

**Mock System Prompt Analyzer:**

- Import:
  `import { analyzeSystemPrompt } from "../../services/mockPromptAnalyzer.ts"`
- Interface:
  `analyzeSystemPrompt(systemPrompt: string): Promise<AnalysisResult>`
- Output: Array of grader suggestions with names and detailed rubrics

**BfNode Creation Patterns:**

- Use existing organization-scoped creation methods
- Follow `createTargetNode()` pattern for relationships
- Maintain consistent metadata and indexing

## Testing Strategy

### Unit Tests

**BfDeck Mutation Test:** `apps/bfDb/nodeTypes/rlhf/__tests__/BfDeck.test.ts`

```typescript
Deno.test("createDeck mutation creates deck with graders", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({ orgSlug: "test-org" });
    // Test deck creation with grader generation
  });
});
```

**BfSample Mutation Test:**
`apps/bfDb/nodeTypes/rlhf/__tests__/BfSample.test.ts`

```typescript
Deno.test("submitSample mutation creates sample linked to deck", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({ orgSlug: "test-org" });
    // Test sample submission to existing deck
  });
});
```

### Integration Tests

**End-to-End GraphQL Test:**

```typescript
Deno.test("GraphQL RLHF workflow", async () => {
  await withIsolatedDb(async () => {
    // 1. Create deck via GraphQL mutation
    // 2. Verify graders were generated
    // 3. Submit sample via GraphQL mutation
    // 4. Verify sample linked to deck
  });
});
```

### Test Utilities

- Use `makeLoggedInCv()` for authentication setup
- Use `withIsolatedDb()` for database isolation
- Use `testQuery()` for GraphQL mutation testing
- Mock external dependencies as needed

## Error Handling and Edge Cases

### Authentication Errors

- **Unauthenticated requests:** Return GraphQL authentication error
- **Invalid organization:** Return authorization error

### Validation Errors

- **Missing required fields:** Return field validation errors
- **Invalid deck ID:** Return "Deck not found" error
- **Organization mismatch:** Return authorization error

### System Failures

- **Mock analyzer failure:** Return creation error with details
- **Database failures:** Return internal error (logged for debugging)

## Future Considerations

### LLM Integration

- Mock analyzer provides interface for future LLM service replacement
- Async job processing for expensive LLM operations
- Cost tracking and rate limiting for production usage

### Additional Mutations

- `updateDeck` - Modify deck properties
- `batchSubmitSamples` - Bulk sample upload
- `createGraderResult` - AI evaluation results
- `createSampleFeedback` - Human feedback collection

### Query Enhancements

- Connection fields for deck.samples, deck.graders
- Filtering and sorting for sample collections
- Aggregation queries for evaluation metrics

## Implementation Checklist

### Pre-Implementation

- [x] Verify RLHF node types are in GraphQL schema
- [x] Confirm mock analyzer interface and functionality
- [x] Review authentication and organization scoping patterns

### Implementation Tasks

- [ ] Add `createDeck` mutation to BfDeck class
- [ ] Add `submitSample` mutation to BfSample class
- [ ] Implement mutation resolvers with proper error handling
- [ ] Add comprehensive test suite for both mutations

### Validation

- [ ] Test mutations via GraphQL playground/client
- [ ] Verify organization scoping works correctly
- [ ] Confirm grader generation from system prompts
- [ ] Test end-to-end deck creation → sample submission workflow

### Deployment

- [ ] Run full test suite with `bft test`
- [ ] Verify build passes with `bft build`
- [ ] Document API usage patterns for consumers

## Success Criteria

1. **Functional Requirements:**
   - Users can create decks with auto-generated graders
   - Users can submit samples to existing decks
   - All operations respect organization boundaries

2. **Technical Requirements:**
   - Mutations follow existing GraphQL patterns
   - Proper authentication and authorization
   - Comprehensive test coverage
   - Error handling for all edge cases

3. **Integration Requirements:**
   - Works with existing RLHF data model
   - Compatible with current authentication system
   - Maintains database consistency and relationships

## Appendix: Reference Implementation Files

### Core Implementation

- **BfDeck:** `apps/bfDb/nodeTypes/rlhf/BfDeck.ts`
- **BfSample:** `apps/bfDb/nodeTypes/rlhf/BfSample.ts`
- **Mock Analyzer:** `apps/bfDb/services/mockPromptAnalyzer.ts`

### Reference Patterns

- **Authentication:** `apps/bfDb/classes/CurrentViewer.ts`
- **Mutation Examples:** `apps/bfDb/graphql/roots/Waitlist.ts`
- **Testing Patterns:** `apps/bfDb/nodeTypes/rlhf/__tests__/*.test.ts`

### Testing Utilities

- **Test Helpers:** `apps/bfDb/utils/testUtils.ts`
- **GraphQL Testing:** `apps/bfDb/graphql/__tests__/TestHelpers.test.ts`
- **Isolation:** Search for `withIsolatedDb` usage patterns

This implementation provides the foundation for the RLHF GraphQL API while
maintaining simplicity and following established codebase patterns.
