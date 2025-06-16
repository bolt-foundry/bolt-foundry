# Samples API Refactor Plan: Unify Sample Types

## Overview

Unify the concept of samples across the codebase by:

1. Refactoring the samples API from builder pattern to array pattern
2. Merging the `Sample` type (from builders) and `EvalSample` type (from evals)
   into one unified type
3. Using consistent naming (`score` instead of `rating`/`score`)
4. Removing the `expected` field

## Current State (Two Different Sample Types)

```typescript
// In builders - behavior examples
type Sample = {
  text: string;
  rating: number; // -3 to +3
  description?: string;
};

// In evals - evaluation data
interface EvalSample {
  id?: string;
  userMessage: string;
  assistantResponse: string;
  expected?: string; // to be removed
  score?: number; // to be renamed to 'score'
  [key: string]: unknown; // arbitrary fields will move to metadata
}
```

## Proposed Unified Sample Type

```typescript
interface Sample {
  id?: string;
  userMessage: string;
  assistantResponse: string;
  score?: number; // -3 to +3, replaces both 'rating' and 'score'
  description?: string; // optional notes about the sample
  metadata?: Record<string, unknown>; // arbitrary data for later inspection
}
```

## API Changes

### Current Builder API

```typescript
.spec("Be helpful", {
  samples: (s) =>
    s.sample("I'll help you solve this", 3)
     .sample("Figure it out yourself", -3)
})
```

### New Builder API

```typescript
.spec("Be helpful", {
  samples: [
    { 
      id: "helpful-example-1",  // optional
      userMessage: "How do I solve this?",
      assistantResponse: "I'll help you solve this step by step",
      score: 3,
      metadata: {
        category: "problem-solving",
        tone: "supportive",
        timestamp: "2024-01-15"
      }
    },
    { 
      id: "unhelpful-example-1",  // optional
      userMessage: "How do I solve this?",
      assistantResponse: "Figure it out yourself",
      score: -3,
      description: "Example of dismissive response",
      metadata: {
        category: "problem-solving",
        tone: "dismissive",
        reviewedBy: "qa-team"
      }
    }
  ]
})
```

## Implementation Phases

### Phase 1: Add Array Support Alongside Builder (Non-Breaking) ✅

**Goal**: Support both builder and array patterns temporarily

**Status**: Completed

- [x] Add array support to `SpecOptions` type:
      `samples?: SampleBuilder | Array<Sample>`
- [x] Update `makeCardBuilder` to handle both patterns
- [x] Update `makeDeckBuilder` to handle both patterns
- [x] Write tests for array pattern working alongside builder
  - Added comprehensive tests in `builders.test.ts`
  - Added DeckBuilder tests in `deckApi.test.ts`
  - Tests cover: basic arrays, empty arrays, mixed patterns, descriptions
- [x] Update one example to show array pattern
  - Created `arrayPatternExample.ts` demonstrating both patterns
  - Removed `arrayPatternExample.ts` - focusing on markdown-based approaches
- [x] Land this change - both APIs now work

**Progress Notes**:

- 2025-01-06: Tests written for array pattern support. Tests currently failing
  as expected (TDD approach).
- 2025-01-06: Implementation completed. All tests passing. Example created
  showing both patterns working side-by-side.

### Phase 2: Unify Score Naming in Evals

**Goal**: Standardize on `score` instead of `score`

- [ ] Add `score` as alias for `score` in `EvalSample`
- [ ] Update eval.ts to accept both `score` and `score`
- [ ] Update CLI to use `score` internally
- [ ] Write tests for both field names working
- [ ] Update eval examples to use `score`
- [ ] Land this change - both field names work

### Phase 3: Add Metadata Field Support

**Goal**: Add structured metadata storage

- [ ] Add `metadata?: Record<string, unknown>` to both Sample types
- [ ] Update eval.ts to move arbitrary fields to metadata
- [ ] Write tests for metadata field
- [ ] Update examples to show metadata usage
- [ ] Land this change - metadata field available

### Phase 4: Create Unified Sample Type

**Goal**: Single Sample type for entire codebase

- [ ] Create shared `Sample` interface combining all fields
- [ ] Update builders to import and use shared type
- [ ] Update evals to import and use shared type
- [ ] Remove `expected` field support
- [ ] Write comprehensive tests for unified type
- [ ] Land this change - one Sample type everywhere

### Phase 5: Deprecate Builder Pattern

**Goal**: Mark builder as deprecated, encourage array usage

- [ ] Add deprecation comments to SampleBuilder
- [ ] Update all remaining examples to array pattern
- [ ] Update documentation to show array as primary
- [ ] Land this change - builder still works but deprecated

### Phase 6: Remove Builder Pattern (Breaking Change)

**Goal**: Clean removal of deprecated code

- [ ] Remove SampleBuilder type and implementation
- [ ] Remove makeSampleBuilder function
- [ ] Update SpecOptions to only accept arrays
- [ ] Remove deprecation warnings
- [ ] Final documentation cleanup
- [ ] Land this change - new version with breaking change

## Benefits of Phased Approach

1. **No breaking changes until Phase 6** - Users can adopt gradually
2. **Each phase is independently valuable** - Benefits even if later phases
   delayed
3. **Reduced risk** - Smaller changes are easier to review and debug
4. **Continuous delivery** - Ship improvements as they're ready
5. **User feedback** - Can adjust plan based on real usage
6. **Backward compatibility** - Phases 1-5 maintain existing functionality

## Benefits of Unified Sample Type

1. **Simpler API** - No need to understand builder pattern
2. **More readable** - Array literals are clearer than chained method calls
3. **Better IDE support** - Direct type inference for array elements
4. **Easier testing** - Simple array assertions vs builder state verification
5. **Unified concept** - One `Sample` type works for both behavior examples and
   evaluation data
6. **Optional IDs** - Can track and reference specific samples when needed
7. **Full context** - Samples include both user input and expected response for
   complete examples
8. **Extensible metadata** - Add arbitrary fields for categorization, tracking,
   or analysis

## Migration Example

Before:

```typescript
.spec("Be helpful", {
  samples: (s) =>
    s.sample("I'll help you solve this step by step", 3)
     .sample("Let me assist you with that", 2)
     .sample("Figure it out yourself", -2)
})
```

After:

```typescript
.spec("Be helpful", {
  samples: [
    { text: "I'll help you solve this step by step", rating: 3 },
    { text: "Let me assist you with that", rating: 2 },
    { text: "Figure it out yourself", rating: -2 }
  ]
})
```

## Breaking Changes

This is a breaking change that will require updates to all code using the
samples API. Consider:

1. Providing a migration guide
2. Using a new minor/patch version
3. Potentially supporting both patterns temporarily with deprecation warning

## Version Plan

- Current: Using builder pattern
- Next patch: Switch to array pattern (breaking change)
- Future: Consider supporting both with deprecation on builder
