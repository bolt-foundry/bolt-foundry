# Simple RLHF MVP Implementation Plan

_Minimal viable implementation for human feedback on AI evaluations_

**Date**: 2025-07-21\
**Status**: Ready for Implementation\
**Approach**: Milestone-based implementation

## Executive Summary

This plan outlines the absolute minimum implementation needed to validate the
core RLHF value proposition: humans providing feedback on AI evaluations.
Instead of building a complex chat+cards interface, we focus on a single
feedback form that demonstrates the complete workflow with realistic demo data
automatically created for each organization.

## MVP Scope: Single Feedback Form

### Core Workflow

1. **Display demo sample data** (conversation + AI evaluation from auto-created
   demo content)
2. **Show AI evaluation results** (score, explanation, reasoning)
3. **Collect human feedback** (score + explanation)
4. **Submit feedback** via GraphQL mutation

### Success Criteria

- [ ] Human can see AI's evaluation of a sample
- [ ] Human can provide their own score (-3 to +3) and explanation
- [ ] Feedback successfully submits to backend
- [ ] Data persists in BfSampleFeedback table

## Current Implementation Status

### ✅ **BACKEND INFRASTRUCTURE (PRODUCTION READY)**

- **Complete RLHF data model**: All 5 node types (BfDeck, BfGrader, BfSample,
  BfGraderResult, BfSampleFeedback) fully implemented and tested
- **Working GraphQL mutations**: `createDeck` and `submitSample` with
  comprehensive test coverage
- **Authentication system**: Google OAuth integration with automatic
  organization creation
- **Score validation**: -3 to +3 range validation in both BfGraderResult and
  BfSampleFeedback
- **Mock prompt analyzer**: Automatically generates realistic graders
  (helpfulness, accuracy, code quality, creativity, clarity)
- **Organization scoping**: All RLHF entities properly scoped with multi-tenant
  support
- **Comprehensive testing**: 12/12 tests passing including E2E and integration
  tests

### ✅ **FRONTEND INFRASTRUCTURE**

- **Authentication-protected route**: `/rlhf` route working with login flow
- **BfDs components**: BfDsForm, BfDsTextArea, BfDsButton, BfDsRadio available
- **Isograph integration**: GraphQL framework properly configured
- **RlhfInterface component**: Basic shell exists at
  `/apps/boltfoundry-com/components/RlhfInterface.tsx`

### ❌ **MISSING COMPONENTS**

- **submitFeedback GraphQL mutation**: Needs to be exposed in BfSampleFeedback
  schema
- **Feedback form UI**: RlhfInterface currently contains only placeholder text
- **Demo data auto-creation**: BfOrganization.afterCreate() hook needs
  implementation
- **Data integration**: Frontend needs to connect to backend via Isograph
  queries

### ✅ **DEMO DATA STRATEGY (COMPLETE)**

**Automatic demo data creation** is fully implemented:

- **Demo deck**: Customer Support Response Evaluator (markdown-based) ✅
- **Auto-creation**: `BfOrganization.createDemoDeck()` called during Google
  OAuth org creation in `CurrentViewer.loginWithGoogleToken()` ✅
- **Complete workflow**: 4 sample conversations with realistic completion data
  ✅
- **Sample data**: Defined in `customer-support-samples.toml` with billing,
  technical, returns, subscription scenarios ✅

**Demo Content Structure** (All Implemented):

1. **Customer Support Demo Deck** - Evaluates helpfulness, professionalism,
   accuracy ✅
2. **4 Sample Conversations** - Billing, technical, returns, subscription
   scenarios with realistic ChatCompletion data ✅
3. **Ground truth scores** - Pre-defined expected scores (1-3 range) for each
   sample ✅
4. **Sample descriptions** - Human-readable explanations for expected quality ✅

This approach gives new users immediate, realistic content to explore the RLHF
workflow.

## Implementation Plan - Milestone-Based Approach

### ~~Milestone 1: Backend Demo Data~~ ✅ **COMPLETE**

**~~Implemented BfOrganization.afterCreate() lifecycle hook~~ Updated to
`CurrentViewer.loginWithGoogleToken()`**:

- ✅ Create customer support demo deck with system prompt
- ✅ Generate 4 realistic conversation samples (billing, technical, returns,
  subscription)
- ✅ Demo content defined in `customer-support-samples.toml` with realistic
  ChatCompletion data
- ⚠️ AI evaluations and human feedback still need to be generated dynamically

**Success Criteria**:

- ✅ New organizations automatically receive demo content on creation via
  `org.createDemoDeck()`
- ✅ Demo deck contains 3 graders (helpfulness, professionalism, accuracy)
- ✅ 4 samples have realistic completion data and ground truth scores
- ⚠️ AI evaluations and human feedback examples need dynamic generation

### Milestone 2: Frontend Form UI

**Build feedback form interface in RlhfInterface.tsx**:

- Implement Isograph GraphQL query to load demo deck data
- Display sample conversation in readable format
- Show AI evaluation with score, explanation, and reasoning
- Create feedback form with score radio buttons (-3 to +3) and explanation
  textarea
- Add form validation and disabled states

**Success Criteria**:

- Form renders with real demo data from GraphQL
- Score selection works with proper validation
- Explanation textarea has minimum character validation
- Form shows loading and error states appropriately

### Milestone 3: GraphQL Integration

**Expose and connect submitFeedback mutation**:

- Add `submitFeedback` mutation to BfSampleFeedback GraphQL schema
- Implement mutation resolver with proper organization scoping
- Connect frontend form to mutation with error handling
- Add success confirmation and form reset after submission

**Success Criteria**:

- submitFeedback mutation works via GraphQL
- Frontend successfully submits feedback and shows confirmation
- Submitted data persists correctly in database
- Error scenarios are handled gracefully

### Milestone 4: End-to-End Validation

**Test complete workflow and polish**:

- Verify complete flow: login → view demo data → submit feedback → verify
  persistence
- Add any missing error handling or loading states
- Ensure mobile responsive design
- Run full test suite and fix any issues

**Success Criteria**:

- Complete RLHF workflow functions end-to-end
- All existing tests continue to pass
- New functionality has appropriate test coverage
- Interface works on mobile devices

## File Structure

```
apps/boltfoundry-com/
├── components/
│   ├── RlhfInterface.tsx              # ✅ EXISTS - Main component (needs UI implementation)
│   ├── RlhfHome.tsx                   # ✅ EXISTS - RLHF home page 
│   └── entrypoints/EntrypointRlhf.ts  # ✅ EXISTS - Authentication routing
└── memos/plans/
    └── simple-rlhf-mvp.md            # ✅ THIS FILE (canonical RLHF plan)

apps/bfDb/nodeTypes/rlhf/
├── BfDeck.ts                          # ✅ COMPLETE - Deck creation with mutations
├── BfGrader.ts                        # ✅ COMPLETE - Evaluation criteria
├── BfSample.ts                        # ✅ COMPLETE - Sample submission with mutations  
├── BfGraderResult.ts                  # ✅ COMPLETE - AI evaluation results
├── BfSampleFeedback.ts                # ⚠️ NEEDS - submitFeedback mutation exposure
└── __tests__/                         # ✅ COMPLETE - Comprehensive test suite (12/12 passing)
    ├── RlhfMutations.integration.test.ts
    ├── RlhfPipelineIntegrationTest.test.ts
    └── RlhfWorkflow.test.ts

apps/bfDb/nodeTypes/
└── BfOrganization.ts                  # ✅ COMPLETE - createDemoDeck() method implemented

apps/bfDb/services/
└── mockPromptAnalyzer.ts              # ✅ EXISTS - Auto-generates graders from system prompts
```

## Technical Specifications

### GraphQL Integration

**Isograph Component Pattern**:

```typescript
// CurrentViewer.DecksList.ts - Component for listing decks
export const CurrentViewer_DecksList = iso(`
  field CurrentViewer.DecksList @component {
    organization {
      decks(first: 10) {
        edges {
          node {
            id
            DecksListItem  # Child component reference for each deck
          }
        }
      }
    }
  }
`)(function DecksList({ data }) {
  const decks = data.organization?.decks.edges || [];
  if (decks.length === 0) return <div>No decks found</div>;

  return (
    <div>
      <h2>Your Evaluation Decks</h2>
      {decks.map((deck) => <deck.node.DecksListItem key={deck.node.id} />)}
    </div>
  );
});

// BfDeck.DecksListItem.ts - Component for individual deck in the list
export const BfDeck_DecksListItem = iso(`
  field BfDeck.DecksListItem @component {
    id
    name
    slug
    DeckSamplesList  # Child component reference
  }
`)(function DecksListItem({ data }) {
  return (
    <div>
      <h3>{data.name} ({data.slug})</h3>
      <data.DeckSamplesList />
    </div>
  );
});

// BfDeck.DeckSamplesList.ts - Component for listing deck samples
export const BfDeck_DeckSamplesList = iso(`
  field BfDeck.DeckSamplesList @component {
    name
    samples(first: 10) {
      edges {
        node {
          id
          DeckSamplesListItem  # Child component reference
        }
      }
    }
  }
`)(function DeckSamplesList({ data }) {
  const samples = data.samples.edges || [];
  if (samples.length === 0) return <div>No samples found</div>;

  return (
    <div>
      <h4>Samples for {data.name}</h4>
      {samples.map((sample) => (
        <sample.node.DeckSamplesListItem key={sample.node.id} />
      ))}
    </div>
  );
});

// BfSample.DeckSamplesListItem.ts - Component for individual sample
export const BfSample_DeckSamplesListItem = iso(`
  field BfSample.DeckSamplesListItem @component {
    id
    name
    completionData
    SampleFeedbackForm  # Child component reference
  }
`)(function DeckSamplesListItem({ data }) {
  const sampleName = data.name || `Sample ${data.id.slice(-8)}`;

  return (
    <div>
      <h5>{sampleName}</h5>
      <data.SampleFeedbackForm />
    </div>
  );
});

// BfGraderResult.GraderResultItem.ts - Component for individual grader results
export const BfGraderResult_GraderResultItem = iso(`
  field BfGraderResult.GraderResultItem @component {
    id
    score
    explanation
    reasoningProcess
    grader {
      id
      graderText
    }
  }
`)(function GraderResultItem({ data }) {
  return (
    <div>
      <h4>AI Evaluation</h4>
      <div>Score: {data.score}</div>
      <div>Explanation: {data.explanation}</div>
      <div>Reasoning: {data.reasoningProcess}</div>
      <div>Grader: {data.grader.graderText}</div>
    </div>
  );
});

// BfSample.SampleFeedbackForm.ts - Component for feedback form
export const BfSample_SampleFeedbackForm = iso(`
  field BfSample.SampleFeedbackForm @component {
    id
    completionData
    graderResults(first: 3) {
      edges {
        node {
          id
          GraderResultItem  # Child component reference
        }
      }
    }
  }
`)(function SampleFeedbackForm({ data }) {
  const graderResults = data.graderResults.edges || [];
  if (graderResults.length === 0) return <div>No evaluations found</div>;

  return (
    <div>
      <h4>Sample Conversation</h4>
      <div>{/* Display conversation from completionData here */}</div>

      <h4>AI Evaluations</h4>
      {graderResults.map((result) => (
        <result.node.GraderResultItem key={result.node.id} />
      ))}

      <h4>Your Feedback</h4>
      {/* Feedback form UI here */}
    </div>
  );
});

// Query.RlhfInterface.ts - Main RLHF interface with Isograph
export const Query_RlhfInterface = iso(`
  field Query.RlhfInterface @component {
    currentViewer {
      DecksList  # Child component reference
    }
  }
`)(function RlhfInterface({ data }) {
  return (
    <div>
      <h1>RLHF Feedback Interface</h1>
      <data.currentViewer.DecksList />
    </div>
  );
});
```

**submitFeedback Mutation (Entrypoint Style)**:

```typescript
// Mutation.SubmitFeedback.ts - Entrypoint mutation for submitting feedback
export const Mutation_SubmitFeedback = iso(`
  field Mutation.SubmitFeedback @component {
    submitFeedback(sampleId: $sampleId, graderId: $graderId, score: $score, explanation: $explanation) {
      id
      score
      explanation
    }
  }
`)(function SubmitFeedback({ data }) {
  // This component can show success state, loading state, etc.
  return (
    <div>
      <p>Feedback submitted successfully!</p>
      <div>ID: {data.submitFeedback.id}</div>
      <div>Score: {data.submitFeedback.score}</div>
    </div>
  );
});
```

### Form Validation

- Score: Required, must be integer between -3 and +3
- Explanation: Required, minimum 10 characters
- Submit button: Disabled until form is valid

### UI Layout

```
┌─────────────────────────────────────┐
│ RLHF Feedback Interface             │
├─────────────────────────────────────┤
│ Sample Conversation:                │
│ User: "How do I center a div?"      │
│ AI: "Use flexbox: display: flex..." │
├─────────────────────────────────────┤
│ AI Evaluation:                      │
│ Score: +2 (Good)                    │
│ Explanation: "Good technical acc... │
│ Reasoning: "Evaluated correctne..." │
├─────────────────────────────────────┤
│ Your Feedback:                      │
│ Score: [Radio buttons -3 to +3]     │
│ Explanation: [Textarea]             │
│ [Submit Feedback] [Reset]           │
└─────────────────────────────────────┘
```

## Success Metrics (Updated for Current State)

### ~~Milestone 1: Backend Demo Data~~ ✅ **COMPLETE**

- [x] ~~BfOrganization.afterCreate()~~ CurrentViewer.loginWithGoogleToken()
      creates demo deck on new org creation
- [x] Demo deck has customer support system prompt and 3 auto-generated graders
- [x] 4 realistic conversation samples with completion data
- [ ] AI evaluations generated for all samples (needs dynamic generation)
- [ ] 1 human feedback example showing disagreement (needs dynamic generation)

### Milestone 2: Frontend Form UI

- [ ] Isograph query loads demo data from GraphQL
- [ ] Sample conversation displays in readable chat format
- [ ] AI evaluation shows score, explanation, and reasoning clearly
- [ ] Score radio buttons (-3 to +3) with proper validation
- [ ] Explanation textarea with minimum character requirement
- [ ] Form shows appropriate loading and error states

### Milestone 3: GraphQL Integration

- [ ] submitFeedback mutation exposed in BfSampleFeedback schema
- [ ] Frontend form connects to mutation with proper error handling
- [ ] Success confirmation and form reset after submission
- [ ] Submitted feedback persists correctly in database

### Milestone 4: End-to-End Validation

- [ ] Complete workflow: login → demo data → submit feedback → persistence
- [ ] All 12 existing backend tests continue to pass
- [ ] Mobile responsive design verified
- [ ] Error scenarios handled gracefully

## Risk Mitigation

### Low Risk Items

- **BfDs components**: Well-established, documented pattern
- **Isograph mutations**: Existing patterns to follow
- **Form validation**: Straightforward with established libraries

### Medium Risk Items

- **GraphQL mutation**: First time adding to BfSampleFeedback
  - _Mitigation_: Follow existing BfDeck/BfSample mutation patterns
- **Hardcoded data structure**: Need to match actual types
  - _Mitigation_: Use existing type definitions from backend

## Future Enhancements (Post-MVP)

### Immediate Next Steps

1. **Real data integration**: Replace hardcoded data with GraphQL queries
2. **Multiple samples**: Browse and review multiple samples
3. **Deck integration**: Select samples from specific decks

### Longer Term

1. **Auto-evaluation**: Trigger AI evaluation on sample submission
2. **Disagreement detection**: Highlight AI vs human score differences
3. **Full chat+cards interface**: Implement comprehensive Phase 3 plan

## Implementation Notes

### Component Architecture

- **Single responsibility**: Each component does one thing well
- **Hardcoded data**: No external dependencies for MVP
- **BfDs consistency**: Use design system throughout
- **Error boundaries**: Graceful degradation on failures

### Development Approach

1. **Start simple**: Get form rendering with static data
2. **Add interaction**: Wire up score selection and text input
3. **Add submission**: Connect to GraphQL mutation
4. **Add feedback**: Success/error messaging
5. **Polish**: Styling and responsive behavior

This MVP approach validates the core value proposition with minimal
implementation effort, providing a solid foundation for future enhancements.

## Appendix: Related Links & References

### Isograph Documentation & Examples

- **[Isograph Quickstart Guide](https://isograph.dev/docs/quickstart/)** - Core
  documentation for getting started
- **[Isograph GitHub Repository](https://github.com/isographlabs/isograph)** -
  Main repository with demos
- **[Pokemon Vite Demo](https://github.com/isographlabs/isograph/tree/main/demos/vite-demo)** -
  Reference implementation showing component patterns
- **[Pet Demo](https://github.com/isographlabs/isograph/tree/main/demos/pet-demo)** -
  NextJS example with local GraphQL API

### Codebase Architecture References

- **[BfNode Lifecycle Hooks](../../bfDb/classes/BfNode.ts)** - afterCreate and
  beforeCreate hook definitions
- **[BfDeck Implementation](../../bfDb/nodeTypes/rlhf/BfDeck.ts)** - Reference
  for GraphQL mutations and lifecycle hooks
- **[Mock Prompt Analyzer](../../bfDb/services/mockPromptAnalyzer.ts)** -
  Auto-generates graders from system prompts

### Component Libraries & Design System

- **[BfDs Design System](../../bfDs/)** - Available components: BfDsForm,
  BfDsTextArea, BfDsButton, BfDsRadio
- **[Existing RlhfInterface](../components/RlhfInterface.tsx)** - Current
  component to be enhanced
- **[React Suspense Patterns](https://react.dev/reference/react/Suspense)** -
  For loading states with Isograph

### GraphQL & Database References

- **[BfSampleFeedback Node](../../bfDb/nodeTypes/rlhf/BfSampleFeedback.ts)** -
  Target node for feedback mutations
- **[BfEdge Relationship System](../../bfDb/classes/BfEdge.ts)** - Database
  relationship patterns (not foreign keys)
- **[GraphQL Mutation Patterns](../../bfDb/nodeTypes/rlhf/BfDeck.ts)** -
  Reference for implementing submitFeedback

### Demo Content & Test Data

- **Demo content will be created programmatically** - Customer support scenarios
  with billing, technical, returns, and subscription conversations
- **Test data examples** - See `/apps/bfDb/nodeTypes/rlhf/__tests__/` for
  realistic sample data patterns

### Development Tools & Commands

- **[BFT Task Runner](../../infra/bft/)** - Use `bft help` to see available
  commands
- **[Deno Configuration](../../deno.jsonc)** - Import maps and workspace setup
- **[Testing Patterns](../../apps/bfDb/nodeTypes/__tests__/)** - Reference for
  writing tests

### Authentication & Organization Context

- **[Google OAuth Integration](../../bfDb/classes/CurrentViewer.ts:110-117)** -
  Organizations auto-created from Google Workspace domain during OAuth
- **[CurrentViewer Context](../../bfDb/classes/CurrentViewer.ts)** - JWT-based
  authentication state with dual-token refresh system
- **[OAuth Configuration](../../boltFoundry/__generated__/configKeys.ts)** -
  GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET environment variables
- **[Session Management](../../bfDb/graphql/utils/graphqlContextUtils.ts)** -
  Secure cookie handling with automatic token refresh
- **[Organization Scoping](../../apps/bfDb/nodeTypes/BfOrganization.ts)** - All
  data access scoped by CurrentViewer.orgBfOid
- **[GraphQL Authentication](../../bfDb/graphql/roots/Query.ts)** -
  currentViewer root field for auth state
- **[Login Flow Testing](../../bfDb/classes/__tests__/CurrentViewer.test.ts)** -
  Complete OAuth flow test examples
