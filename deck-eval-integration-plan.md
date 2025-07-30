# Deck and Evaluation System Integration Plan

## Overview

- **PR 1668**: SDK improvements - deck API cleanup, telemetry capture with
  `bfMetadata`
- **PR 1670**: Frontend eval system - GraphQL nodes for evaluation decks and
  grading UI

## The Data Flow

Based on the RLHF implementation docs, here's how data flows through the system:

1. **Customer uses SDK** → SDK captures telemetry with `bfMetadata` (deck info)
2. **Telemetry endpoint** → Creates/finds deck, creates BfSample with LLM data
3. **Graders run** → AI evaluates samples, creates BfGraderResult
4. **Frontend shows samples** → Humans review AI evaluations via GraphQL
5. **Humans provide feedback** → Creates BfSampleFeedback (ground truth)

## Key Integration Points

### 1. SDK Metadata Enhancement (PR 1668)

The SDK needs to include `bfMetadata` in telemetry:

```typescript
// Enhanced deck.render() to include metadata
const completion = deck.render({
  context: { invoice: "..." },
});
// Returns: { messages, tools, bfMetadata }

// BfClient captures this metadata in telemetry
```

### 2. Telemetry → Eval System Bridge

The telemetry endpoint already creates BfSample nodes when `bfMetadata` is
present:

- Uses `bfMetadata.deckName` to find/create BfDeck
- Stores full LLM request/response in BfSample
- Links sample to deck automatically

### 3. EvalDeck vs BfDeck Resolution

PR 1670's `EvalDeck` was a placeholder while BfDb RLHF was being built. Now that
BfDeck exists:

- **Yes**, they represent the same concept (evaluation decks)
- **Yes**, PR 1670 should use BfDeck instead of EvalDeck
- **No**, EvalDeck is not needed - just use BfDeck directly

### 4. Missing Pieces

Both PRs are missing key components:

**From PR 1668**:

- `bfMetadata` inclusion in deck.render() output
- Metadata capture in BfClient telemetry

**From PR 1670**:

- Connection to existing BfDeck/BfSample system
- `submitFeedback` mutation on BfSampleFeedback
- Isograph components to load RLHF data

## Recommended Approach

1. **Align on Node Types**: Use existing `BfDeck`, `BfSample`, etc. from RLHF
   system
2. **Complete SDK Metadata**: Implement `bfMetadata` in PR 1668 as specified
3. **Connect Frontend**: Have PR 1670 query existing RLHF nodes via GraphQL
4. **Add Missing Mutations**: Implement `submitFeedback` for human grading

## Next Steps

- Remove EvalDeck/EvalGrader/EvalGradingSample from PR 1670
- Update PR 1670 to import BfDeck/BfSample/BfGrader from
  `apps/bfDb/nodeTypes/rlhf/`
- Implement `bfMetadata` in deck.render() (PR 1668)
- Add `submitFeedback` mutation to BfSampleFeedback
- Create Isograph components to query BfDeck → BfSample → BfGraderResult
- Test end-to-end flow: SDK → Telemetry → Samples → UI → Feedback
