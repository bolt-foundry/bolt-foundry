# Phase 3 UI Implementation Plan - Chat + Cards RLHF Interface

_Implementation memo for Phase 3 of RLHF pipeline - Chat + cards UI with AI
assistant and contextual cards_

**Date**: 2025-07-16\
**Status**: Implementation Ready\
**Prerequisites**: Phase 2 (Sample Collection) completion

## Executive Summary

This memo outlines the implementation plan for Phase 3 of the RLHF pipeline,
focusing on building a chat + cards interface for AI-assisted grading and human
feedback correction. The MVP prioritizes essential workflow functionality with a
chat-driven approach and contextual card interactions. The implementation
leverages existing RLHF data models (100% complete) and comprehensive UI
components (80% foundation ready).

## Phase 3 MVP Requirements Analysis

### Core UI Architecture

**Chat + Cards Layout**

- Navigation sidebar: Collapsible navigation (hidden when detail view is open,
  can be opened as drawer overlay)
- Conversation view: Chat conversation with AI assistant (always visible,
  shrinks when detail view opens)
- Detail view: Opens when cards are clicked, takes up majority of screen space
- Card interaction: Click card → opens detail view, shrinks conversation view,
  hides navigation sidebar
- Drawer mode: When detail view is open, navigation sidebar opens as overlay
  drawer on top

**MVP Workflow Requirements**

**3.1 Chat-Driven Workflow**

- AI assistant conversation in conversation view guides user through RLHF tasks
- Assistant generates cards during conversation (deck cards, sample cards, etc.)
- User interacts with assistant to manage decks, review samples, handle
  disagreements
- Cards provide quick access to detail views when clicked

**3.2 Card-Based Interactions**

- Deck cards: Show deck name, grader count, sample count
- Sample cards: Show sample content, AI evaluation, need for human review
- Disagreement cards: Show AI vs human evaluation conflicts
- Click any card → opens detail view with forms and actions

**3.3 Assistant-Guided Operations**

- Create decks through chat conversation
- Review inbox samples with assistant guidance
- Handle "samples out of whack" with assistant recommendations
- API integration with `orgslug_deckslug` format for external sample submission

## Current Implementation Status

### ✅ **COMPLETED FOUNDATIONS (80% of Phase 3)**

**Data Model (100% Complete)**

- `BfGraderResult` with score, explanation, reasoningProcess fields
- `BfSampleFeedback` with human correction capabilities
- `BfSample` with completionData storage and `submitSample` mutation
- `BfGrader` with auto-generation from system prompts
- `BfDeck` with `createDeck` mutation and auto-grader generation
- Full relationship patterns using BfEdge connections

**UI Component Foundation (80% Complete)**

- `BfDsForm` with context-driven validation
- `BfDsRadio` for -3 to +3 score selection
- `BfDsTextArea` for explanation input
- `BfDsButton` for action handling
- `BfDsTabs` for organizing interfaces
- `BfDsCallout` for status and result display

**Recent Progress (Phase 2 Completion)**

- BfDeck has `createDeck` mutation with auto-grader generation
- `analyzeSystemPrompt` service integrated in deck creation lifecycle
- BfSample has `submitSample` mutation for API integration
- GraphQL mutations functional for deck and sample management

### ❌ **MISSING COMPONENTS (20% of Phase 3)**

**Deck Slug System (10% of Phase 3)**

- `slug` field in BfDeck for stable API identifiers
- `orgslug_deckslug` format for external API integration
- Lookup mechanism for finding decks by slug

**Auto-Evaluation Service (5% of Phase 3)**

- Service to automatically evaluate samples on submission
- Integration with `submitSample` mutation to trigger AI evaluation
- Adaptation of existing aibff evaluation logic

**Chat + Cards UI (5% of Phase 3)**

- Navigation sidebar with collapsible behavior
- Conversation view with AI assistant
- Detail view that opens when cards are clicked
- Card interaction system with proper state management

## Implementation Architecture

### Backend Dependencies

**Prerequisites**: Backend services detailed in
`/apps/boltfoundry-com/memos/plans/markdown-deck-sample-collection.md`

- **Deck Slug System**: Auto-generated slugs for stable API identifiers
- **Auto-Evaluation Service**: AI evaluation on sample submission
- **Disagreement Detection**: Threshold-based AI/human disagreement queries

### Frontend Components

#### 1. Layout Context and State Management

**Location**: `/apps/boltFoundry/contexts/LayoutContext.tsx`

**LayoutContext.tsx**:

```typescript
interface LayoutState {
  navigationSidebar: "hidden" | "visible" | "drawer";
  detailView: {
    isOpen: boolean;
    type?: "sample" | "deck" | "disagreement";
    data?: any;
  };
  conversationView: {
    isCompact: boolean;
  };
}

interface LayoutContextValue {
  state: LayoutState;
  actions: {
    openDetailView: (type: string, data: any) => void;
    closeDetailView: () => void;
    toggleNavigationSidebar: () => void;
    openNavigationDrawer: () => void;
    closeNavigationDrawer: () => void;
  };
}
```

**Benefits of LayoutContext**:

- Centralized state management for all layout modes
- Eliminates prop drilling across components
- Predictable state transitions
- Easy to test and debug layout behavior
- Clean component interfaces

#### 2. Chat + Cards Layout Components

**Location**: `/apps/boltFoundry/components/layout/`

**MainLayout.tsx**:

```typescript
interface MainLayoutProps {
  // No layout state props - uses LayoutContext
}

// Component uses LayoutContext to manage all layout states
```

**ConversationView.tsx**:

```typescript
interface ConversationViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  // Uses LayoutContext for onCardClick and isCompact state
}
```

**DetailView.tsx**:

```typescript
interface DetailViewProps {
  // Uses LayoutContext for type, data, and onClose
}
```

**NavigationSidebar.tsx**:

```typescript
interface NavigationSidebarProps {
  onNavigate: (path: string) => void;
  // Uses LayoutContext for visibility, mode, and onClose
}
```

#### 3. Card Components

**Location**: `/apps/boltFoundry/components/cards/`

**DeckCard.tsx**:

```typescript
interface DeckCardProps {
  deck: BfDeck;
  graderCount: number;
  sampleCount: number;
  onClick: (deck: BfDeck) => void;
}
```

**Component Structure**:

- Compact card showing deck name, stats, status
- Click → opens detailed deck view with grader list
- Generated by assistant during conversation
- Embedded in chat area as assistant responses

**SampleCard.tsx**:

```typescript
interface SampleCardProps {
  sample: BfSample;
  aiResult?: BfGraderResult;
  needsReview: boolean;
  onClick: (sample: BfSample) => void;
}
```

**DisagreementCard.tsx**:

```typescript
interface DisagreementCardProps {
  sample: BfSample;
  aiResult: BfGraderResult;
  humanFeedback: BfSampleFeedback;
  scoreDifference: number;
  onClick: (disagreement: DisagreementData) => void;
}
```

#### 4. Detail View Components

**Location**: `/apps/boltFoundry/components/details/`

**SampleDetailView.tsx**:

```typescript
interface SampleDetailViewProps {
  sample: BfSample;
  aiResult?: BfGraderResult;
  onSubmitFeedback: (feedback: FeedbackData) => Promise<void>;
  onClose: () => void;
}
```

**Component Structure**:

- Full-screen detail view replacing content area
- Show sample conversation data
- Display AI evaluation (score, explanation, reasoning)
- Human feedback form with -3 to +3 score selection
- Close button to return to cards view

**DeckDetailView.tsx**:

```typescript
interface DeckDetailViewProps {
  deck: BfDeck;
  graders: BfGrader[];
  samples: BfSample[];
  onClose: () => void;
}
```

**DisagreementDetailView.tsx**:

```typescript
interface DisagreementDetailViewProps {
  sample: BfSample;
  aiResult: BfGraderResult;
  humanFeedback: BfSampleFeedback;
  onUpdate: (feedback: FeedbackData) => Promise<void>;
  onClose: () => void;
}
```

### Routing and Navigation

**Add to `/apps/boltFoundry/routes.ts`**:

```typescript
export const appRoutes: RouteMap = new Map([
  // ... existing routes
  ["/rlhf", { Component: RlhfChatInterface }],
  ["/rlhf/decks", { Component: RlhfChatInterface, context: "decks" }],
  ["/rlhf/inbox", { Component: RlhfChatInterface, context: "inbox" }],
  ["/rlhf/analyze", { Component: RlhfChatInterface, context: "analyze" }],
]);
```

**Chat-Driven Application**:

- All views use the same `RlhfChatInterface` component
- Navigation sidebar provides context switching
- Chat assistant guides user through different workflows
- Cards generated based on current context and conversation

## Implementation Tasks

### Sprint 1: UI Components (2-3 days)

**Task 1.1: Layout Context and State Management**

- [ ] Create `LayoutContext.tsx` with centralized layout state management
- [ ] Implement state transitions for all layout modes (sidebar, drawer, detail
      view)
- [ ] Add proper TypeScript interfaces for layout state and actions

**Task 1.2: Chat + Cards Layout**

- [ ] Create `MainLayout.tsx` that consumes LayoutContext
- [ ] Create `ConversationView.tsx` with LayoutContext integration
- [ ] Create `DetailView.tsx` with LayoutContext integration
- [ ] Create `NavigationSidebar.tsx` with LayoutContext integration

**Task 1.3: Card Components**

- [ ] Create `DeckCard.tsx` for deck overview cards
- [ ] Create `SampleCard.tsx` for sample review cards
- [ ] Create `DisagreementCard.tsx` for disagreement cards
- [ ] Implement card click handlers and transitions

**Task 1.4: Detail View Components**

- [ ] Create `SampleDetailView.tsx` with feedback form
- [ ] Create `DeckDetailView.tsx` with grader information
- [ ] Create `DisagreementDetailView.tsx` for disagreement review
- [ ] Implement form validation and close functionality

### Sprint 2: Integration and Testing (1-2 days)

**Task 2.1: Chat Interface Integration**

- [ ] Create `RlhfChatInterface.tsx` main component
- [ ] Implement chat message handling and assistant integration
- [ ] Add card generation logic based on conversation context
- [ ] Connect all components with proper data flow and state management

**Task 2.2: End-to-End Testing**

- [ ] Test complete workflow: create deck → submit sample → AI evaluation →
      human feedback
- [ ] Test UI responsiveness and accessibility
- [ ] Verify card interactions and layout transitions

## Success Criteria

### MVP Functional Requirements

- [ ] AI automatically evaluates samples and stores results
- [ ] Humans can review samples in inbox and provide feedback
- [ ] System shows disagreements between AI and human evaluations
- [ ] All evaluations are organization-scoped and secure

### Technical Requirements

- [ ] Chat + cards UI with assistant-driven workflow
- [ ] Components follow existing BfDs design system patterns
- [ ] GraphQL integration using existing Isograph patterns
- [ ] AI assistant integration for card generation and guidance
- [ ] Service integrates with existing LLM cost tracking and telemetry
- [ ] Simple but extensible architecture for future enhancements

### User Experience Requirements

- [ ] Clean, focused interface prioritizing essential workflow
- [ ] Intuitive chat-driven interactions with AI assistant
- [ ] Smooth card-to-detail view transitions with navigation sidebar hiding
- [ ] Intuitive -3 to +3 scoring interface with visual feedback
- [ ] Fast loading and responsive interactions
- [ ] Keyboard navigation support

## Risk Analysis

### Technical Risks

**Low Risk**: Chat + cards UI implementation

- **Mitigation**: Leverage existing BfDs components and patterns

**Medium Risk**: AI assistant integration for card generation

- **Mitigation**: Start with simple card generation rules, enhance with AI later

### Dependencies

- **Backend Services**: Deck slug system, auto-evaluation service, disagreement
  detection (see
  `/apps/boltfoundry-com/memos/plans/markdown-deck-sample-collection.md`)
- **Existing RLHF data model**: Already implemented and tested
- **BfDs Components**: Form, radio, textarea, button, tabs, callout components

## Future Considerations (Post-MVP)

### Planned Enhancements

- **Advanced AI Assistant**: More sophisticated conversation handling and
  context awareness
- **Advanced Analytics**: Dashboard with performance metrics and trends
- **Batch Operations**: Bulk sample processing and evaluation
- **Suggested Fixes**: Automated recommendations for grader improvements
- **Advanced Grader Editing**: UI for updating grader criteria and rubrics

### Scalability Considerations

- **Evaluation Queue**: Background processing for high-volume evaluation
- **Caching Strategy**: AI evaluation results cached to avoid duplicate
  processing
- **Database Performance**: Existing BfNode indexing supports large-scale
  queries

## Implementation Timeline

**Total Estimated Time**: 3-4 days

**Sprint 1** (Days 1-3): Chat + cards UI components and layout **Sprint 2**
(Days 4): Integration and testing

**Backend Prerequisites**: Implemented via
`/apps/boltfoundry-com/memos/plans/markdown-deck-sample-collection.md`

**MVP Deliverables**:

- Chat + cards interface with AI assistant guidance
- Card-based interactions for decks, samples, and disagreements
- Detail views with navigation sidebar hiding
- Chat-driven workflow for deck management and sample review

**Future Enhancements** (Post-MVP):

- Advanced AI assistant capabilities and conversation memory
- Advanced analytics and dashboards
- Batch operations and bulk actions
- Suggested fixes and automated recommendations
- Advanced grader editing and versioning

## Technical Notes

### Code Organization

- Follow existing monorepo patterns for component location
- Use established testing frameworks and utilities
- Maintain consistency with existing GraphQL and routing patterns
- Apply existing accessibility standards

### Performance Optimization

- Implement lazy loading for large lists
- Use existing debouncing patterns for form inputs
- Cache evaluation results to avoid redundant AI calls
- Optimize database queries with proper indexing

### Error Handling

- Follow existing error handling patterns with BfDsCallout
- Implement graceful degradation for AI service failures
- Provide clear user feedback for validation errors
- Log errors for debugging and monitoring

This implementation plan provides a focused MVP approach for Phase 3,
prioritizing essential workflow functionality while building a solid foundation
for future enhancements. The chat + cards interface ensures a familiar and
intuitive user experience while leveraging existing infrastructure and patterns.
