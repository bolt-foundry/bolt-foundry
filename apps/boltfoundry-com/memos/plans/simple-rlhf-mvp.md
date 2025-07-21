# Simple RLHF MVP Implementation Plan

_Minimal viable implementation for human feedback on AI evaluations_

**Date**: 2025-07-21\
**Status**: Milestone 1 Complete - Backend Demo Data ✅\
**Next**: Milestone 2 - Frontend Form UI

## Executive Summary

This plan outlines the absolute minimum implementation needed to validate the
core RLHF value proposition: humans providing feedback on AI evaluations.
Instead of building a complex chat+cards interface, we focus on a single
feedback form that demonstrates the complete workflow with hardcoded test data.

## MVP Scope: Single Feedback Form

### Core Workflow

1. **Display hardcoded sample data** (conversation + AI evaluation)
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
- **Organization scoping**: All RLHF entities properly scoped with multi-tenant
  support
- **Comprehensive testing**: 12/12 tests passing including E2E and integration
  tests
- **✅ DEMO DATA AUTO-CREATION**: BfOrganization.afterCreate() hook creates demo
  deck with filesystem integration

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
- **Data integration**: Frontend needs to connect to backend via Isograph
  queries

### ✅ **DEMO DATA STRATEGY**

Instead of hardcoded frontend data, we're implementing **automatic demo data
creation**:

- **Demo deck**: Customer Support Response Evaluator (markdown-based)
- **Auto-creation**: BfOrganization.afterCreate() hook creates demo content when
  new orgs are created via Google OAuth
- **Complete workflow**: 4 sample conversations + AI evaluations + 1 human
  feedback example
- **Realistic data**: Actual customer support scenarios with meaningful
  evaluations

**Demo Content Structure**:

1. **Customer Support Demo Deck** - Evaluates helpfulness, professionalism,
   accuracy
2. **4 Sample Conversations** - Billing, technical, returns, subscription
   scenarios
3. **AI Evaluations** - Realistic scores and explanations for all samples
4. **1 Human Feedback** - Example feedback on first sample showing disagreement
   with AI

This approach gives new users immediate, realistic content to explore the RLHF
workflow.

## Implementation Plan - Milestone-Based Approach

### ✅ Milestone 1: Backend Demo Data (COMPLETED)

**Implemented BfOrganization.afterCreate() lifecycle hook**:

- ✅ BfOrganization.afterCreate() calls addDemoDeck() method
- ✅ BfDeck.readPropsFromFile() loads deck content from filesystem
- ✅ Integration with bolt-foundry package for deck file reading
- ✅ Demo deck creation uses existing customer-support-demo.deck.md content
- ✅ Schema changes: BfDeck systemPrompt → content field for better semantics
- ✅ BfSample name field added for better identification
- ✅ All tests updated and passing (12/12)

**Benefits Achieved**:

- ✅ Every new organization gets immediate demo content
- ✅ No manual setup required
- ✅ Realistic workflow demonstration ready for frontend
- ✅ Backend infrastructure complete for frontend integration

### Milestone 2: Frontend Form UI (NEXT)

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

```typescript
// Query.RlhfInterface.ts - Main RLHF interface with data fetching
export const Query_RlhfInterface = iso(`
  field Query.RlhfInterface {
    deck(slug: $slug) {
      name
      samples {
        id
        completionData
        graderResults {
          id
          graderName
          score
          explanation
        }
      }
    }
  }
`)(function RlhfInterface({ data }) {
  // Component renders with auto-fetched GraphQL data
  // No manual prop passing or hardcoded interfaces needed
  return <FeedbackForm deck={data.deck} />;
});
```

This eliminates the need for hardcoded TypeScript interfaces - Isograph
automatically handles data fetching and typing based on the GraphQL schema.

### Step 3: Update RlhfInterface with Demo Data Query

```typescript
// In apps/boltfoundry-com/components/RlhfInterface.tsx
const HARDCODED_SAMPLE = {
  conversation: [
    { role: "user", content: "How do I center a div in CSS?" },
    {
      role: "assistant",
      content:
        "You can use flexbox: display: flex; justify-content: center; align-items: center;",
    },
  ],
};

const HARDCODED_AI_RESULT = {
  score: 2,
  explanation: "Good technical accuracy, could be more comprehensive",
  reasoningProcess: "Evaluated correctness and completeness...",
};
```

### Step 4: Wire Up Form Submission

- Connect form to submitFeedback mutation
- Add success/error handling
- Display submission result

## File Structure

```
apps/boltfoundry-com/
├── components/
│   ├── RlhfInterface.tsx              # Main component (update with Isograph query)
│   └── FeedbackForm.tsx               # New feedback form component
└── memos/plans/
    └── simple-rlhf-mvp.md            # This file

apps/bfDb/nodeTypes/rlhf/
├── BfSampleFeedback.ts                # Add submitFeedback mutation
└── demo-decks/
    └── customer-support-demo.deck.md  # Demo deck content (✅ created)

apps/bfDb/nodeTypes/
└── BfOrganization.ts                  # Add afterCreate() hook for auto-demo creation
```

## Technical Specifications

### Hardcoded Test Data

```typescript
interface HardcodedSample {
  id: string;
  conversation: Array<{ role: "user" | "assistant"; content: string }>;
  deckSlug: string;
}

interface HardcodedGraderResult {
  id: string;
  graderName: string;
  score: number; // -3 to +3
  explanation: string;
  reasoningProcess: string;
}

interface FeedbackData {
  score: number; // -3 to +3
  explanation: string;
}
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

## Success Metrics

### Functional

- [ ] Form renders with hardcoded data
- [ ] Radio buttons work for score selection (-3 to +3)
- [ ] Textarea accepts explanation input
- [ ] Form validation prevents invalid submissions
- [ ] Successful submission shows confirmation
- [ ] Data persists in database

### Technical

- [ ] Uses existing BfDs components consistently
- [ ] Follows Isograph GraphQL patterns
- [ ] Error handling for network failures
- [ ] Loading states during submission
- [ ] Responsive design works on mobile

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

- **[RLHF Pipeline Implementation Plan](../../../boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md)** -
  Complete backend status and data model
- **[Phase 3 UI Implementation Plan](./phase-3-ui-implementation.md)** -
  Original complex chat+cards interface plan
- **[BfNode Lifecycle Hooks](../../bfDb/classes/BfNode.ts:573-574)** -
  afterCreate and beforeCreate hook definitions
- **[BfDeck afterCreate Example](../../bfDb/nodeTypes/rlhf/BfDeck.ts:75-83)** -
  Reference implementation for lifecycle hooks

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

- **[Customer Support Demo Deck](../../bfDb/nodeTypes/rlhf/demo-decks/customer-support-demo.deck.md)** -
  Main demo deck structure
- **[Demo Graders](../../bfDb/nodeTypes/rlhf/demo-decks/graders/)** - Individual
  grader specifications
- **[Sample Conversations](../../bfDb/nodeTypes/rlhf/demo-decks/customer-support-samples.toml)** -
  Realistic test data

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
