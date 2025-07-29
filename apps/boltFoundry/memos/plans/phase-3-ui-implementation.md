# Phase 3 UI Implementation Plan - Simple Deck List Interface

_Implementation memo for Phase 3 of RLHF pipeline - Simple deck list → detail
view workflow_

**Date**: 2025-07-20\
**Status**: Planning\
**Prerequisites**: Phase 2 (Sample Collection) completion

## Executive Summary

This memo outlines the simplified implementation plan for Phase 3 of the RLHF
pipeline, focusing on building a straightforward deck list interface similar to
EvalForge. The MVP prioritizes a simple workflow: list of decks → click deck →
open detail view for sample review. This approach allows for iterative
development and immediate user value while building toward more complex features
later.

## Phase 3 MVP Requirements Analysis

### Core UI Architecture

**Simple Deck List Layout**

- Main view: List of available deck slugs
- Click interaction: Click deck slug → opens detail view for that deck
- Detail view: Full-screen or modal view for sample review and deck management

**MVP Workflow Requirements**

**3.1 Deck List View**

- Display all available deck slugs in a simple list format
- Click any deck slug to open detail view
- Minimal, focused interface

**3.2 Deck Detail View**

- Show samples that need human review/feedback
- Display AI evaluation vs human feedback when available
- Forms for providing human feedback on samples
- Return to deck list when done

**3.3 Progressive Enhancement**

- Start with basic list → detail workflow
- Add features iteratively (filters, search, batch operations)
- Build toward more complex workflows once foundation is solid

## Current Implementation Status

### ✅ **COMPLETED FOUNDATIONS (80% of Phase 3)**

**Data Model (100% Complete)**

- `BfGraderResult` with score, explanation, reasoningProcess fields
- `BfSampleFeedback` with human correction capabilities
- `BfSample` with completionData storage
- `BfGrader` with auto-generation from system prompts
- `BfDeck` with existing deck data
- Full relationship patterns using BfEdge connections

**UI Component Foundation (80% Complete)**

- `BfDsForm` with context-driven validation
- `BfDsButton` for feedback actions
- `BfDsTextArea` for explanation input
- `BfDsButton` for action handling
- `BfDsTabs` for organizing interfaces
- `BfDsCallout` for status and result display

**Recent Progress (Phase 2 Completion)**

- BfDeck has existing deck data available for querying
- `analyzeSystemPrompt` service integrated in deck creation lifecycle
- BfSample has existing sample data for review
- GraphQL mutations functional for deck and sample management

### ✅ **UPDATED STATUS (July 2025)**

**Deck Slug System (COMPLETED)**

- ✅ `slug` field in BfDeck with `orgslug_deckslug` format
- ✅ Deck lookup by slug query in GraphQL
- ✅ Auto-generated slugs for stable API identifiers
- ✅ Telemetry endpoint with deck deduplication via slug

**Sample Collection System (COMPLETED)**

- ✅ MVP telemetry endpoint at `/api/telemetry`
- ✅ Automatic deck creation from telemetry metadata
- ✅ Sample submission via `connectBoltFoundry` wrapper (in progress)
- ✅ Authentication via `bf+{orgId}` API key format

**GraphQL Schema (COMPLETED)**

- ✅ All RLHF types exposed in GraphQL with proper `id: ID!` fields
- ✅ GraphQL queries available for deck and sample data
- ✅ `deck(slug: String)` query for slug-based lookups
- ✅ Generated Isograph types ready for component development

### ❌ **MISSING COMPONENTS (10% of Phase 3)**

**Auto-Evaluation Service (5% of Phase 3)**

- Service to automatically evaluate samples on submission
- Integration with telemetry endpoint to trigger AI evaluation
- Adaptation of existing aibff evaluation logic

**Chat + Cards UI (5% of Phase 3)**

- Navigation sidebar with collapsible behavior
- Conversation view with AI assistant
- Detail view that opens when cards are clicked
- Card interaction system with proper state management

## Implementation Architecture

### Backend Dependencies

**Status Update**: Most backend services are now implemented via telemetry
endpoint in `apps/boltfoundry-com/handlers/telemetry.ts`

- ✅ **Deck Slug System**: Implemented with auto-generated slugs for stable API
  identifiers
- ✅ **Sample Collection**: Telemetry endpoint creates BfSample records
  automatically
- ❌ **Auto-Evaluation Service**: Still needs AI evaluation on sample submission
- ❌ **Disagreement Detection**: Still needs threshold-based AI/human
  disagreement queries

### Revised Architecture - Telemetry-First Approach

**Key Insight**: Decks are created automatically via telemetry, not manually via
UI. The UI should focus on reviewing and providing feedback on existing samples.

**Production Flow**:

1. **Deck Creation**: Automatic via `connectBoltFoundry` telemetry
2. **Sample Collection**: Automatic via telemetry endpoint
3. **AI Evaluation**: Triggered on sample submission (planned)
4. **Human Review**: Via UI for feedback and disagreement resolution

**Testing UI Focus**: Build minimal isograph-based interface to test the human
feedback loop on samples created via telemetry.

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
- Human feedback form with simple input fields
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

### Phase 1: Basic Deck List (1-2 days)

**Task 1.1: Backend Data Setup**

- [ ] Add mock deck data to GraphQL queries
- [ ] Ensure BfDeck has slug field for deck identification
- [ ] Create simple deck list query in RlhfInterface

**Task 1.2: Deck List Component**

- [ ] Build simple deck slug list view with BfDs components
- [ ] Display only deck slugs
- [ ] Add click handlers for deck selection
- [ ] Test deck list rendering and interactions

### Phase 2: Deck Detail View (1-2 days)

**Task 2.1: Detail View State**

- [ ] Add state management for selected deck
- [ ] Implement view switching (list ↔ detail)
- [ ] Add navigation back to deck list

**Task 2.2: Sample Review Interface**

- [ ] Create basic sample display in detail view
- [ ] Add sample feedback form with BfDs components
- [ ] Implement sample submission workflow
- [ ] Test detail view interactions

### Phase 3: Polish and Testing (1 day)

**Task 3.1: Integration Testing**

- [ ] Test complete workflow: deck list → detail → sample review → back to list
- [ ] Verify data flow and state management
- [ ] Test error handling and edge cases

**Task 3.2: UI Polish**

- [ ] Add basic styling without Tailwind
- [ ] Ensure responsive behavior
- [ ] Add loading states and user feedback

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
- [ ] Simple feedback form with clear input fields
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
- **BfDs Components**: Form, textarea, button, tabs, callout components

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
