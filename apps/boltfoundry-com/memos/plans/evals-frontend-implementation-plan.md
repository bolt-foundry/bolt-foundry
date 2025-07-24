# Evals Frontend Implementation Plan

_Comprehensive plan for implementing the Evals evaluation platform frontend_

**Date**: 2025-07-24\
**Status**: Phase 1 In Progress - BfDs Components Completed\
**Approach**: Incremental component-based development with GraphQL integration

## Executive Summary

This plan outlines the implementation of the Evals frontend, building upon the
existing scaffolding in `Eval.tsx` and the design demonstrated in `home.html`.
The implementation will follow a phased approach, starting with the core
component structure and progressively adding features like GraphQL integration,
state management, and AI-powered chat functionality.

## Current State Analysis

### Existing Assets

1. **Eval.tsx Scaffolding** (Completed)
   - Three-panel responsive layout
   - EvalContext for state management
   - BfDs design system integration
   - Mobile-responsive sidebar behavior

2. **home.html Prototype**
   - Complete UI/UX design with all interactions
   - Sample data and modals
   - Dark theme with CSS variables
   - Demonstrates all planned features

### Key Features to Implement

1. **Decks Management** - CRUD operations for evaluation decks
2. **Grader Configuration** - Create and manage graders within decks
3. **Analysis Dashboard** - Surface disagreements and issues
4. **Chat Interface** - AI-powered resolution assistance
5. **Real-time Updates** - GraphQL subscriptions for live data

## Implementation Phases

### Phase 1: Component Architecture with BfDs Integration (Week 1)

**Goal**: Transform HTML prototype into React components using BfDs design
system

#### Tasks:

1. **Core Layout Components**
   ```
   components/
   ├── Layout/
   │   ├── Header.tsx
   │   ├── LeftSidebar.tsx
   │   ├── RightSidebar.tsx
   │   └── MainContent.tsx
   ├── Decks/
   │   ├── DeckList.tsx
   │   ├── DeckItem.tsx
   │   ├── DeckCreateModal.tsx
   │   └── DeckConfigModal.tsx
   ├── Analyze/
   │   ├── AnalyzeDashboard.tsx
   │   ├── DisagreementCard.tsx
   │   └── ResolutionModal.tsx
   └── Chat/
       ├── ChatInterface.tsx
       ├── ChatMessage.tsx
       └── ChatInput.tsx
   ```

2. **BfDs Components to Create** ✅ COMPLETED
   - **BfDsModal**: Modal wrapper component ✅
     - Overlay backdrop with click-to-close
     - Modal container with header/body/footer
     - Escape key and focus management
     - Size variants (small, medium, large, fullscreen)
   - **BfDsEmptyState**: Empty state component ✅
     - Icon, title, description layout
     - Primary and secondary action buttons
     - Size variants and custom content support
   - **BfDsCard**: Card container component ✅
     - Header, body, footer sections
     - Variants (default, elevated, outlined, flat)
     - Clickable and selected states
   - **BfDsBadge**: Status badge component ✅
     - Color variants with semantic meanings
     - Outlined and filled styles
     - Icon support and removable functionality

3. **BfDs Components to Utilize**
   - `BfDsButton` - All interactive buttons
   - `BfDsIcon` - Icons throughout the UI
   - `BfDsInput` - Form inputs
   - `BfDsTextArea` - Multi-line inputs
   - `BfDsSelect` - Dropdown selections
   - `BfDsTabs` - Tab navigation
   - `BfDsCallout` - Notifications and alerts
   - `BfDsToast` - Temporary notifications
   - `BfDsSpinner` - Loading states
   - `BfDsList` - List displays
   - `BfDsPill` - Tags and status indicators
   - `BfDsToggle` - Toggle switches
   - `BfDsForm` - Form containers

4. **CSS Variable Usage**
   - Use only variables from `bfDsStyle.css`:
     - Colors: `--bfds-primary`, `--bfds-background`, `--bfds-text`, etc.
     - States: `--bfds-hover`, `--bfds-active`, `--bfds-focus`
     - Borders: `--bfds-border`, `--bfds-border-hover`
     - Typography: `--fontFamily`, `--fontFamilyMono`
   - Create `evalStyle.css` inheriting BfDs variables

5. **Context Providers**
   - Extend EvalContext for global state
   - Add deck management context
   - Chat context for conversation state
   - Wrap in `BfDsProvider` for design system features

### Phase 2: GraphQL Integration (Week 2)

**Goal**: Connect to bfDb backend via Isograph

#### Tasks:

1. **Schema Definition**
   ```graphql
   type Deck implements BfNode {
     id: ID!
     name: String!
     systemPrompt: String
     graders: [Grader!]!
     stats: DeckStats!
     status: DeckStatus!
   }

   type Grader implements BfNode {
     id: ID!
     name: String!
     prompt: String!
     settings: GraderSettings!
     examples: [GraderExample!]!
   }

   type Analysis {
     disagreements: [Disagreement!]!
     pendingSamples: [Sample!]!
   }
   ```

2. **Isograph Components**
   ```typescript
   // Create Isograph entrypoints
   iso(`
     Query.DeckList {
       decks {
         id
         name
         stats {
           agreementRate
           totalTests
         }
       }
     }
   `);
   ```

3. **Data Fetching Hooks**
   - useDeckList()
   - useDeck(id)
   - useAnalysisDashboard()
   - useChat()

### Phase 3: Decks Feature Implementation (Week 3)

**Goal**: Complete deck management functionality

#### Features:

1. **Deck List View**
   - Display all decks with stats using `BfDsList`
   - Search with `BfDsInput` component
   - Filter with `BfDsSelect` dropdowns
   - Sort controls using `BfDsButton` variants

2. **Deck Creation Flow**
   - Multi-step wizard using `BfDsModal`
   - System prompt with `BfDsTextArea`
   - Initial grader setup with `BfDsForm`
   - Progress indicator with custom component

3. **Deck Configuration**
   - Edit deck metadata in `BfDsModal`
   - Manage graders with `BfDsList` and `BfDsListItem`
   - Test grader configurations with `BfDsButton`
   - View statistics with `BfDsCard` components

4. **Right Sidebar Integration**
   - Quick deck overview with `BfDsPill` for stats
   - Recent activity using `BfDsList`
   - Quick actions with `BfDsButton` group

### Phase 4: Analysis Dashboard (Week 4)

**Goal**: Implement analysis and disagreement resolution

#### Features:

1. **Disagreement Detection**
   - Real-time disagreement monitoring
   - Severity scoring
   - Trend analysis

2. **Sample Review Interface**
   - Side-by-side comparisons
   - Score visualizations
   - Resolution options

3. **Batch Operations**
   - Bulk resolution actions
   - Export capabilities
   - Reporting features

### Phase 5: Chat Interface (Week 5)

**Goal**: AI-powered assistance and resolution

#### Features:

1. **Chat Integration**
   - Connect to AI backend
   - Context-aware responses
   - Task-specific assistance

2. **Smart Resolution**
   - Automated fix suggestions
   - Grader prompt improvements
   - Example generation

3. **Conversation Management**
   - Save/load conversations
   - Export chat history
   - Share resolution strategies

### Phase 6: Polish and Optimization (Week 6)

**Goal**: Production-ready application

#### Tasks:

1. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - GraphQL query optimization
   - Caching strategies

2. **Testing Suite**
   - Component unit tests
   - Integration tests
   - E2E test scenarios

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

4. **Documentation**
   - User guide
   - API documentation
   - Deployment guide

## Technical Architecture

### State Management

```typescript
// Global state structure
interface AppState {
  user: User;
  decks: Deck[];
  activeView: "decks" | "analyze" | "chat";
  ui: {
    leftSidebarOpen: boolean;
    rightSidebarOpen: boolean;
    rightSidebarContent: string;
    modals: ModalState[];
  };
}
```

### Routing Strategy

```typescript
// Route structure
/                      // Redirect to /decks
/decks                 // Deck list
/decks/:id             // Deck details
/decks/:id/grader/:gid // Grader edit
/analyze               // Analysis dashboard
/chat                  // Chat interface
/chat/:contextId       // Chat with context
```

### Data Flow

1. **GraphQL Queries** → Isograph → React Components
2. **User Actions** → Mutations → Optimistic Updates
3. **Real-time Updates** → Subscriptions → UI Updates

### Design System Integration

#### Component Usage Guidelines

```typescript
// Always use BfDs components
import { BfDsButton } from '@apps/bfDs/components'

// BfDsButton already supports icons
<BfDsButton 
  variant="primary" 
  size="medium" 
  icon="plus"
  onClick={handleClick}
>
  Create Deck
</BfDsButton>
```

#### CSS Guidelines

```css
/* Always use BfDs CSS variables */
.custom-component {
  background: var(--bfds-background);
  color: var(--bfds-text);
  border: 1px solid var(--bfds-border);
}

/* Never hardcode colors */
/* ❌ Bad: background: #141516; */
/* ✅ Good: background: var(--bfds-background); */
```

#### evalStyle.css Usage

- Already exists at `@static/evalStyle.css`
- Already loaded by the application
- Contains eval-specific layouts using BfDs variables
- Existing classes to leverage:
  - `.eval-layout` - Main layout container
  - `.eval-left-sidebar` - Left sidebar styles
  - `.eval-right-sidebar` - Right sidebar styles
  - `.eval-main-area` - Main content area
  - `.eval-nav-buttons` - Navigation button container
  - Responsive behavior already implemented

## Integration Points

### Backend Requirements

1. **bfDb Models**
   - Deck node type
   - Grader node type
   - Analysis service
   - Chat service

2. **GraphQL API**
   - CRUD operations
   - Complex queries
   - Subscriptions
   - File uploads

3. **AI Services**
   - Chat completion API
   - Grader evaluation API
   - Suggestion generation

### Authentication

- Integrate with existing auth system
- Role-based permissions
- API key management

## Success Metrics

1. **Performance**
   - Page load < 2s
   - Interaction latency < 100ms
   - 60fps animations

2. **Usability**
   - Task completion rate > 90%
   - Error rate < 5%
   - User satisfaction > 4.5/5

3. **Code Quality**
   - Test coverage > 80%
   - Zero critical bugs
   - Lighthouse score > 90

## Risk Mitigation

1. **Technical Risks**
   - GraphQL schema changes → Version API
   - Performance issues → Progressive enhancement
   - Browser compatibility → Polyfills

2. **UX Risks**
   - Complex workflows → User testing
   - Feature discoverability → Onboarding
   - Mobile experience → Responsive design

## Progress Update (2025-07-24)

### Completed ✅

- Phase 1: BfDs component creation
  - BfDsModal with full accessibility features
  - BfDsEmptyState with action buttons and size variants
  - BfDsCard with header/footer and interactive states
  - BfDsBadge with semantic colors and removable functionality
  - All components include comprehensive examples and tests
  - CSS variables added for warning and info colors
  - All 44 component tests passing

### Next Steps

1. [x] ~~Review plan with team~~
2. [x] ~~Set up development environment~~
3. [x] ~~Begin Phase 1 BfDs components~~
4. [ ] Create core React component structure for Evals UI
5. [ ] Build Layout components (Header, LeftSidebar, RightSidebar, MainContent)
6. [ ] Build Decks components (DeckList, DeckItem, DeckCreateModal,
       DeckConfigModal)
7. [ ] Create GraphQL schema
8. [ ] Schedule weekly progress reviews

## Conclusion

This implementation plan provides a structured approach to building the Evals
frontend. By following the phased approach and leveraging existing scaffolding,
we can deliver a production-ready application in 6 weeks while maintaining code
quality and user experience standards.
