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

**⚠️ Key Dependency:** This implementation assumes user authentication and
organization context are working. If `ctx.getCvForGraphql()` and
`CurrentViewerLoggedIn` are not implemented, authentication setup must be
completed first.

### What Exists

- ✅ Complete RLHF data model (5 BfNode types: BfDeck, BfGrader, BfSample,
  BfGraderResult, BfSampleFeedback)
- ✅ All node types properly registered in GraphQL schema
- ✅ Comprehensive test suite with TDD patterns
- ✅ Mock system prompt analyzer service
  (`apps/bfDb/services/mockPromptAnalyzer.ts`)
- ✅ Database relationships and organization scoping working

### What's Missing

- ❌ **User authentication system (CurrentViewer/organization context)**
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
    const cv = ctx.getCvForGraphql();
    const org = await BfOrganization.findX(cv, cv.orgBfOid);
    return await org.createTargetNode(BfDeck, cv, args);
  }
})
```

**Model Method Implementation:**

```typescript
// In BfDeck class
async afterCreate(cv: CurrentViewerLoggedIn): Promise<void> {
  // 1. Analyze system prompt using mock analyzer
  // 2. Create BfGrader nodes from analysis results
  await this.createGraders(cv);
}

async createGraders(cv: CurrentViewerLoggedIn): Promise<void> {
  // Generate graders based on systemPrompt analysis
}
```

**Business Logic:**

1. **Authentication:** Requires logged-in user with organization context
2. **System Prompt Analysis:** Uses existing
   `mockPromptAnalyzer.analyzeSystemPrompt()`
3. **Grader Generation:** Creates 2-4 BfGrader nodes based on analysis
   (helpfulness, clarity, code quality, accuracy, creativity)

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
    const cv = ctx.getCvForGraphql();
    const deck = await BfDeck.findX(cv, args.deckId);
    return await deck.createTargetNode(BfSample, cv, {
      completionData: args.completionData,
      collectionMethod: args.collectionMethod
    });
  }
})
```

**Business Logic:**

1. **Authentication:** Requires logged-in user with organization context
2. **Sample Creation:** Create BfSample with completion data and metadata
3. **Default Values:** `collectionMethod` defaults to "manual" if not provided

## Technical Architecture

### Authentication and Authorization

**CurrentViewer Integration:**

- All mutations require authenticated user (`CurrentViewerLoggedIn`)
- Organization scoping via `ctx.getCvForGraphql()` and `cv.orgBfOid`
- Automatic node scoping through BfNode metadata

**Error Handling:**

- Standard GraphQL error handling for auth and validation failures

### Data Flow Patterns

**createDeck Flow:**

```
User Request → GraphQL Resolver → BfOrganization.findX() → 
org.createTargetNode(BfDeck) → BfDeck Creation → deck.afterCreate() → 
deck.createGraders() → System Prompt Analysis → BfGrader Generation → Response
```

**submitSample Flow:**

```
User Request → GraphQL Resolver → BfDeck.findX() → 
deck.createTargetNode(BfSample) → BfSample Creation → Response
```

### Integration Points

**Mock System Prompt Analyzer:**

- Import:
  `import { analyzeSystemPrompt } from "../../services/mockPromptAnalyzer.ts"`
- Interface:
  `analyzeSystemPrompt(systemPrompt: string): Promise<AnalysisResult>`
- Output: Array of grader suggestions with names and detailed rubrics

**BfNode Creation Patterns:**

- Follow `createTargetNode()` pattern for relationships

## Testing Strategy

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

Standard GraphQL and BfNode error handling applies. No custom error handling
needed.

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
- [ ] **Verify user authentication and CurrentViewer system is working**
- [ ] **Confirm GraphQL context provides authenticated user access**
- [ ] Review authentication and organization scoping patterns

### Implementation Tasks

- [ ] Add `createDeck` GraphQL mutation that finds org and calls
      `org.createTargetNode(BfDeck)`
- [ ] Add `submitSample` GraphQL mutation that finds deck and calls
      `deck.createTargetNode(BfSample)`
- [ ] Implement `BfDeck.afterCreate()` lifecycle method
- [ ] Add integration tests for both mutations

### Validation

- [ ] Test mutations via GraphQL playground/client
- [ ] Confirm grader generation from system prompts
- [ ] Test end-to-end deck creation → sample submission workflow

### Deployment

- [ ] Run full test suite with `bft test`
- [ ] Verify build passes with `bft build`

## Success Criteria

1. **Functional Requirements:**
   - Users can create decks with auto-generated graders
   - Users can submit samples to existing decks

2. **Integration Requirements:**
   - Works with existing RLHF data model

## Implementation Guide

1. **Write test first** - Create GraphQL integration test for `createDeck`
   mutation
2. **Implement BfDeck.ts** - Add `createDeck` mutation and `afterCreate`
   lifecycle
3. **Write test for samples** - Create GraphQL integration test for
   `submitSample` mutation
4. **Implement BfSample.ts** - Add `submitSample` mutation
5. **Run validation** - Use `bft test`, `bft lint`, `bft build` to verify
