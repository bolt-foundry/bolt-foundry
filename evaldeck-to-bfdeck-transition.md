# Transition Plan: EvalDeck → BfDeck System

## Context

PR 1670 created placeholder Eval* nodes while waiting for BfDb RLHF
implementation. Now that the real RLHF system exists in BfDb, we can remove the
placeholders and use the proper nodes:

- `EvalDeck` (placeholder) → `BfDeck` (real)
- `EvalGrader` (placeholder) → `BfGrader` (real)
- `EvalGradingSample` (placeholder) → `BfSample` (real) + `BfGraderResult` (AI
  evaluations)

## Target State

Use the existing RLHF system that's already built and tested:

- `BfDeck` - Evaluation decks
- `BfGrader` - Grading criteria
- `BfSample` - LLM interaction samples
- `BfGraderResult` - AI evaluation results
- `BfSampleFeedback` - Human feedback

## Transition Steps

### 1. Remove Duplicate Node Types

Delete from PR 1670:

- `apps/bfDb/nodeTypes/EvalDeck.ts`
- `apps/bfDb/nodeTypes/EvalGrader.ts`
- `apps/bfDb/nodeTypes/EvalGradingSample.ts`

### 2. Update Frontend Components

Replace references in PR 1670:

```typescript
// OLD: import { EvalDeck } from "..."
// NEW:
import { BfDeck } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfDeck.ts";
import { BfSample } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfSample.ts";
import { BfGrader } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfGrader.ts";
```

### 3. Update GraphQL Queries

The existing RLHF nodes are already exposed via GraphQL:

```typescript
// Query decks
export const CurrentViewer_DeckList = iso(`
  field CurrentViewer.DeckList @component {
    organization {
      bfDecks(first: 10) {
        edges {
          node {
            id
            name
            description
            DeckCard
          }
        }
      }
    }
  }
`);

// Query samples for a deck
export const BfDeck_SampleList = iso(`
  field BfDeck.SampleList @component {
    id
    name
    bfSamples(first: 20) {
      edges {
        node {
          id
          completionData
          SampleCard
        }
      }
    }
  }
`);
```

### 4. Add Missing Mutations

The only missing piece is the `submitFeedback` mutation:

```typescript
// Add to BfSampleFeedback.ts
.mutation("submitFeedback", {
  args: (a) => a
    .nonNull.string("sampleId")
    .nonNull.int("score")
    .nonNull.string("explanation"),
  returns: "BfSampleFeedback",
  resolve: async (_src, args, ctx) => {
    const sample = await BfSample.findX(ctx.currentViewer, args.sampleId);
    return sample.createTargetNode(BfSampleFeedback, {
      score: args.score,
      explanation: args.explanation
    });
  }
})
```

### 5. Update UI Components

Map PR 1670 components to use RLHF data:

```typescript
// DeckList.tsx
- const { evalDecks } = useEvalContext();
+ // Use Isograph to load BfDecks
+ const { data } = useResult(CurrentViewer.DeckList);

// GradingInbox.tsx  
- const samples = mockGradingSamples;
+ // Load real samples from selected deck
+ const { data } = useResult(BfDeck.SampleList, { deckId });
```

### 6. Data Flow Integration

Connect to the telemetry → RLHF pipeline:

1. SDK sends telemetry with `bfMetadata` (PR 1668)
2. Telemetry endpoint creates BfDeck + BfSample
3. Graders evaluate samples → BfGraderResult
4. Frontend loads samples via GraphQL (PR 1670)
5. Humans submit feedback → BfSampleFeedback

## Benefits

- Reuse existing, tested RLHF infrastructure
- Data automatically flows from SDK → UI
- No duplicate node types to maintain
- Grader system already implemented
- Demo data creation already works

## Timeline

1. Update PR 1670 to remove Eval* nodes
2. Create Isograph components for BfDeck/BfSample
3. Add submitFeedback mutation
4. Test with real telemetry data
