# RLHF Unified Implementation Plan

_Single source of truth for implementing human feedback on AI evaluations_

**Date**: 2025-07-26\
**Status**: Ready for Implementation\
**Goal**: Build a minimal but complete RLHF feedback interface

## Executive Summary

This plan unifies our RLHF implementation approach, building on the completed
eval scaffolding to create a focused interface for collecting human feedback on
AI evaluations. We prioritize shipping a working MVP that demonstrates the core
value proposition: humans providing feedback on AI-generated evaluations to
improve model performance.

The implementation is organized into four phases that can be completed
sequentially as time permits.

## Current State

### ✅ Completed Infrastructure

1. **Backend RLHF Data Model**
   - All 5 node types implemented: BfDeck, BfGrader, BfSample, BfGraderResult,
     BfSampleFeedback
   - GraphQL mutations exposed: `createDeck`, `submitSample`
   - Auto-creation of demo deck when new organizations are created
   - Mock prompt analyzer generates graders automatically
   - 12/12 backend tests passing

2. **Frontend Scaffolding** (from eval-interface-scaffolding)
   - Three-panel responsive layout (left sidebar, main content, right sidebar)
   - EvalContext for state management
   - BfDs design system integration
   - Mobile-responsive behavior
   - CSS variables and dark theme support

3. **Isograph Setup**
   - Framework configured with `@iso-bfc` import alias
   - Generated files in `__generated__/__isograph/`
   - EntrypointRlhf exists and is properly configured

### ❌ Missing Components

1. **submitFeedback mutation** - Not exposed in BfSampleFeedback GraphQL schema
2. **Data loading** - No Isograph components to fetch decks/samples/evaluations
3. **Feedback form** - No UI implementation in RlhfInterface.tsx
4. **Demo samples** - Demo deck exists but no sample conversations are created

## Implementation Plan

### Phase 1: Backend Completion

**Goal**: Expose submitFeedback mutation and ensure demo data creation

#### Tasks:

1. Add `submitFeedback` mutation to BfSampleFeedback.ts
   ```typescript
   .typedMutation("submitFeedback", {
     args: (a) => a
       .nonNull.id("sampleId")
       .nonNull.int("score")
       .nonNull.string("explanation"),
     returns: "BfSampleFeedback",
     resolve: async (_src, args, ctx) => {
       // Implementation here
     }
   })
   ```

2. Enhance BfOrganization.afterCreate() to create demo samples
   - Load customer-support-samples.toml
   - Create 4 BfSample records with conversation data
   - Generate AI evaluations using existing grader system
   - Add one example human feedback record

### Phase 2: Isograph Data Components

**Goal**: Create components to load RLHF data

#### Components to Create:

1. **CurrentViewer.RlhfDashboard** - Main dashboard component
   ```typescript
   export const CurrentViewer_RlhfDashboard = iso(`
     field CurrentViewer.RlhfDashboard @component {
       organization {
         decks(first: 10) {
           edges {
             node {
               id
               name
               RlhfDeckView
             }
           }
         }
       }
     }
   `)(function RlhfDashboard({ data }) {
     // Implementation
   });
   ```

2. **BfDeck.RlhfDeckView** - Deck with samples
   ```typescript
   export const BfDeck_RlhfDeckView = iso(`
     field BfDeck.RlhfDeckView @component {
       id
       name
       samples(first: 10) {
         edges {
           node {
             id
             RlhfSampleCard
           }
         }
       }
     }
   `)(function RlhfDeckView({ data }) {
     // Implementation
   });
   ```

3. **BfSample.RlhfSampleCard** - Sample with feedback form
   ```typescript
   export const BfSample_RlhfSampleCard = iso(`
     field BfSample.RlhfSampleCard @component {
       id
       completionData
       graderResults(first: 5) {
         edges {
           node {
             id
             score
             explanation
             grader {
               graderText
             }
           }
         }
       }
     }
   `)(function RlhfSampleCard({ data }) {
     // Implementation with feedback form
   });
   ```

### Phase 3: Feedback Form UI

**Goal**: Build the feedback collection interface

#### UI Components:

1. **Update RlhfInterface.tsx**
   - Replace placeholder content with CurrentViewer.RlhfDashboard
   - Use existing eval scaffolding layout pattern

2. **Feedback Form Implementation**
   ```typescript
   const FeedbackForm = ({ sampleId, graderId }) => {
     const [score, setScore] = useState(0);
     const [explanation, setExplanation] = useState("");

     return (
       <BfDsCard>
         <h3>Your Feedback</h3>
         <BfDsRadioGroup
           label="Score"
           options={[
             { value: -3, label: "Strongly Disagree" },
             { value: -2, label: "Disagree" },
             { value: -1, label: "Slightly Disagree" },
             { value: 0, label: "Neutral" },
             { value: 1, label: "Slightly Agree" },
             { value: 2, label: "Agree" },
             { value: 3, label: "Strongly Agree" },
           ]}
           value={score}
           onChange={setScore}
         />
         <BfDsTextArea
           label="Explanation"
           value={explanation}
           onChange={setExplanation}
           minLength={10}
           required
         />
         <BfDsButton onClick={handleSubmit}>
           Submit Feedback
         </BfDsButton>
       </BfDsCard>
     );
   };
   ```

3. **Sample Display**
   - Show conversation from completionData
   - Display AI evaluation (score, explanation, reasoning)
   - Integrate feedback form below

### Phase 4: Integration & Polish

**Goal**: Connect everything and ensure quality

#### Tasks:

1. **Connect submitFeedback mutation**
   - Wire up form submission
   - Add loading states
   - Show success feedback
   - Handle errors gracefully

2. **Testing**
   - Manual testing of complete flow
   - Ensure mobile responsiveness
   - Verify data persistence

3. **Polish**
   - Loading states with BfDsSpinner
   - Empty states with BfDsEmptyState
   - Error handling with BfDsCallout
   - Success toasts with BfDsToast

## Success Criteria

### MVP Requirements

- [ ] User can log in and see demo deck with samples
- [ ] User can view AI evaluations on samples
- [ ] User can submit their own score (-3 to +3) and explanation
- [ ] Feedback persists to database
- [ ] Interface works on mobile devices

### Technical Requirements

- [ ] All components use BfDs design system
- [ ] Follows existing eval scaffolding patterns
- [ ] Uses Isograph for data fetching
- [ ] Proper error handling and loading states

## File Structure

```
apps/boltfoundry-com/
├── components/
│   ├── RlhfInterface.tsx          # Main RLHF interface
│   ├── rlhf/
│   │   ├── RlhfDashboard.tsx      # Dashboard component
│   │   ├── RlhfDeckView.tsx       # Deck view component
│   │   ├── RlhfSampleCard.tsx     # Sample card with feedback
│   │   └── FeedbackForm.tsx       # Feedback form component
│   └── __generated__/             # Isograph components
└── memos/plans/
    └── rlhf-unified-implementation.md  # THIS FILE

apps/bfDb/nodeTypes/rlhf/
├── BfSampleFeedback.ts            # Add submitFeedback mutation
└── demo-decks/
    └── customer-support-samples.toml  # Demo conversation data
```

## Development Approach

1. **Start Simple** - Get basic functionality working first
2. **Use Existing Patterns** - Follow eval scaffolding and BfDs patterns
3. **Ship Incrementally** - Deploy after each phase if possible
4. **Focus on Value** - Prioritize collecting real feedback over perfect UI

## Notes

- This plan supersedes all previous RLHF implementation plans
- Focus is on shipping a working MVP, not comprehensive features
- Can expand later with deck management, analytics, etc.
- Use existing eval scaffolding patterns for consistency
