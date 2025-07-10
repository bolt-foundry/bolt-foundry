# Lead Method Implementation Plan

## Overview

This implementation adds a `.lead()` method to the deck system, enabling authors
to write transitional content between deck elements. Leads provide narrative
flow and context, helping readers understand connections between specs and
cards. In this initial implementation, leads are functionally identical to specs
but provide semantic distinction at the API level.

## Goals

| Goal                   | Description                                       | Success Criteria                                          |
| ---------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| Add `.lead()` method   | Enable transitional content between deck elements | `.lead()` method available on DeckBuilder and CardBuilder |
| Maintain compatibility | Ensure existing decks work unchanged              | All existing deck tests pass without modification         |
| API consistency        | Lead method follows same pattern as spec method   | Same return types and chaining behavior                   |
| Test coverage          | Comprehensive tests for new methods               | Tests verify leads work identically to specs              |

## Anti-Goals

| Anti-Goal             | Reason                                            |
| --------------------- | ------------------------------------------------- |
| Visual distinction    | Initial version treats leads identically to specs |
| Parser updates        | No changes to visualization/parsing in v1         |
| Type discrimination   | Leads and specs are both just string Cards        |
| Special lead features | Keep it simple - just transitional text           |

## Technical Approach

The `.lead()` method will follow the existing pattern of `.spec()`, creating
string Cards with no special markers or type discrimination. This simplified
approach:

- Treats leads as semantically different but technically identical to specs
- Maintains the immutable builder pattern
- Requires no changes to the Card type or rendering logic
- Provides a clean API for authors while keeping implementation minimal

## Components

| Status | Component          | Purpose                                                     |
| ------ | ------------------ | ----------------------------------------------------------- |
| [ ]    | CardBuilder.lead() | Add lead method to CardBuilder interface and implementation |
| [ ]    | DeckBuilder.lead() | Add lead method to DeckBuilder interface and implementation |
| [ ]    | Builder tests      | Test that lead() creates string Cards correctly             |
| [ ]    | Example updates    | Show `.lead()` usage in examples                            |

## Technical Decisions

| Decision                     | Reasoning                                          | Alternatives Considered                              |
| ---------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Leads as string Cards        | Simplest implementation, no new types needed       | Special lead type or marker (unnecessary complexity) |
| No visual distinction        | Keeps v1 scope minimal                             | Parser/renderer updates (future enhancement)         |
| Identical to spec internally | Reduces code changes and complexity                | Type discrimination (over-engineering)               |
| Semantic API difference      | Provides author clarity without backend complexity | Just use spec() for everything (poor semantics)      |

## Implementation Details

### Interface Updates

```typescript
// Add to CardBuilder interface
export type CardBuilder = {
  spec(value: string): CardBuilder;
  spec(value: string, options: SpecOptions): CardBuilder;
  card(name: string, builder: (c: CardBuilder) => CardBuilder): CardBuilder;
  lead(value: string): CardBuilder; // NEW
  getCards(): Array<Card>;
};

// Add to DeckBuilder interface
export type DeckBuilder = {
  readonly name: string;
  spec(value: string): DeckBuilder;
  spec(value: string, options: SpecOptions): DeckBuilder;
  card(name: string, builder: (c: CardBuilder) => CardBuilder): DeckBuilder;
  lead(value: string): DeckBuilder; // NEW
  context(builder: (c: ContextBuilder) => ContextBuilder): DeckBuilder;
  getCards(): Array<Card>;
  getContext(): Array<ContextVariable>;
  render(options?: RenderOptions): ChatCompletionCreateParams;
};
```

### Implementation

```typescript
// In makeCardBuilder - add lead method
lead(value: string) {
  const valueCard: Card = { value };
  return makeCardBuilder([...cards, valueCard]);
},

// In makeDeckBuilder - add lead method  
lead(value: string) {
  const valueCard: Card = { value };
  return makeDeckBuilder(
    name,
    [...cards, valueCard],
    contextVariables,
  );
},
```

## Next Steps

| Question                   | How to Explore                                |
| -------------------------- | --------------------------------------------- |
| Future visual distinction? | Consider in v2 after gathering usage patterns |
| Lead-specific features?    | Wait for user feedback on v1                  |
| Documentation needs?       | Update guides after implementation            |

## Test Plan

Following TDD practices:

1. Write failing tests for `.lead()` on CardBuilder
2. Write failing tests for `.lead()` on DeckBuilder
3. Implement both methods
4. Verify leads render identically to specs
5. Add example showing lead usage

## Files to Modify

1. `packages/bolt-foundry/builders/builders.ts` - Add lead methods to builders
2. `packages/bolt-foundry/builders/__tests__/builders.test.ts` - Test lead
   methods
3. `packages/bolt-foundry/builders/examples/deckExample.ts` - Add lead examples
4. `packages/bolt-foundry/builders/examples/simpleDeckExample.ts` - Show basic
   lead usage
