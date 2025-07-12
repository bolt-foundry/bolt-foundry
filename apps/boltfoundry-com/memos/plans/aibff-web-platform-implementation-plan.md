# AIBFF Web Platform Implementation Plan

**Target**: Build web-based aibff functionality within boltfoundry-com app\
**Priority**: High\
**Status**: Planning Phase

## Executive Summary

This memo outlines the implementation plan for building a web-based version of
the aibff (AI Behavior Fast Feedback) functionality within the boltfoundry-com
application. The goal is to create a user-facing platform where users can access
aibff's grader building and evaluation tools through a web interface,
progressing from landing page → Google authentication → aibff workspace →
potential platform adoption.

## Background Analysis

### Source: aibff GUI Architecture

The existing aibff GUI provides a sophisticated grader building workflow with:

**Core Functionality**:

1. **Tabbed Workspace Interface**: System Prompt, Calibrate, Eval, Fix tabs
2. **System Prompt Tab**: Prompt editing, input variables (JSONL), test
   conversations, saved results
3. **Calibrate Tab**: Manual grading interface with +3 to -3 scoring system
4. **Eval Tab**: Grader execution and evaluation tools
5. **Fix Tab**: Outlier analysis and grader refinement

**Technical Foundation**:

- React + Vite + TypeScript with Deno runtime
- File-based conversation persistence (markdown/TOML)
- GraphQL integration via Isograph
- BfDs component library

### Target: boltfoundry-com Integration

The boltfoundry-com application provides the ideal foundation:

**Current Architecture**:

- React 19.1.0 with SSR via Vite + Deno (✅ compatible)
- Isograph GraphQL integration (✅ ready for data layer)
- BfDs design system components (✅ UI consistency)
- Established routing and component patterns

**Integration Advantages**:

- Same technology stack eliminates compatibility issues
- Existing authentication infrastructure ready for Google OAuth
- BfDb integration available for proper data persistence
- Production-ready deployment and testing infrastructure

## Strategic Implementation Approach

### Phase 1: Core Infrastructure & System Prompt Tab

**Goal**: Establish aibff routes, authentication, and implement System Prompt
tab

**Infrastructure Setup**:

1. **Authentication Integration**
   - Implement Google OAuth integration
   - Create user session management
   - Add protected route middleware for `/aibff/*` routes

2. **BfDb Schema Design**
   - Create `AibffProject` node type for grader projects
   - Design conversation and evaluation data models
   - Implement user ownership and future collaboration structure

3. **Route Structure**
   - Create `/aibff` landing page for authenticated users
   - Implement tabbed interface with System Prompt, Calibrate, Eval, Fix tabs
   - Build navigation and workspace layout

**System Prompt Tab Implementation**:

1. **Prompt Editor Component**
   - Rich text editing for system prompts
   - Live preview and validation
   - Save/load functionality with BfDb integration

2. **Input Variables Management**
   - JSONL format input/validation
   - Sample data management interface
   - Import/export capabilities

3. **Test Conversation Area**
   - Basic conversation interface for prompt testing
   - Input sample application and result display
   - Conversation history and results persistence

4. **Saved Results Management**
   - Results storage and retrieval from BfDb
   - Export functionality for analysis
   - Version history for prompt iterations

### Phase 2: Calibrate & Eval Tabs

**Goal**: Implement manual grading and automated evaluation functionality

**Calibrate Tab Features**:

1. **Manual Grading Interface**
   - Sample display and grading UI
   - +3 to -3 scoring system implementation
   - Ground truth data collection and management

2. **Sample Management**
   - Sample import and organization
   - Batch grading workflows
   - Progress tracking and completion indicators

**Eval Tab Features**:

1. **Grader Execution Engine**
   - Integration with AI models for evaluation
   - Batch processing capabilities
   - Real-time progress tracking

2. **Results Analysis**
   - Evaluation metrics and scoring displays
   - Comparison tools for different grader versions
   - Export and reporting functionality

### Phase 3: Fix Tab & Advanced Features

**Goal**: Complete the workflow with outlier analysis and optimization tools

**Fix Tab Implementation**:

1. **Outlier Detection**
   - Statistical analysis of grading results
   - Identification of problematic samples
   - Recommendation system for improvements

2. **Grader Refinement Tools**
   - Prompt optimization suggestions
   - A/B testing framework for grader versions
   - Performance tracking and iteration management

**Platform Enhancement**:

1. **User Experience Polish**
   - Improved navigation and workflow guidance
   - Help system and documentation integration
   - Performance optimization

2. **Collaboration Foundation**
   - User sharing and permissions framework (not active in v1)
   - Project templates and example graders
   - Community features preparation

## Technical Implementation Details

### BfDb Schema Design

```typescript
// Core project entity
interface AibffProject extends BfNode {
  name: string;
  description: string;
  owner: User;
  systemPrompt: string;
  inputSamples: Array<InputSample>;
  evaluationResults: Array<EvaluationResult>;
  graderVersions: Array<GraderVersion>;
}

// Input data for evaluation
interface InputSample extends BfNode {
  content: string;
  metadata: Record<string, unknown>;
  manualGrade?: number; // -3 to +3 scale
  project: AibffProject;
}

// Evaluation results
interface EvaluationResult extends BfNode {
  sample: InputSample;
  graderVersion: GraderVersion;
  score: number;
  reasoning: string;
  timestamp: Date;
}
```

### Route Structure

```typescript
// New routes in boltfoundry-com
"/aibff" → AibffLanding (project list, create new)
"/aibff/project/:id" → AibffWorkspace (tabbed interface)
"/aibff/project/:id/system-prompt" → System Prompt tab
"/aibff/project/:id/calibrate" → Calibrate tab  
"/aibff/project/:id/eval" → Eval tab
"/aibff/project/:id/fix" → Fix tab
```

### Component Architecture

```typescript
// Main workspace component
<AibffWorkspace projectId={id}>
  <TabNavigation />
  <TabContent>
    <SystemPromptTab /> // Phase 1
    <CalibrateTab /> // Phase 2
    <EvalTab /> // Phase 2
    <FixTab /> // Phase 3
  </TabContent>
</AibffWorkspace>;
```

### Authentication Flow

1. User visits landing page
2. Clicks "Try AIBFF" or similar CTA
3. Redirected to Google OAuth flow
4. Upon successful auth, redirected to `/aibff`
5. Can create new projects or access existing ones
6. Full aibff functionality available in workspace

## Risk Assessment and Mitigation

### Technical Risks

1. **BfDb Integration Complexity**: New schema design may require significant
   backend work
   - _Mitigation_: Start with simple schema, iterate based on usage patterns

2. **Authentication Integration**: Google OAuth setup and session management
   - _Mitigation_: Leverage existing patterns from other monorepo apps

3. **UI Complexity**: Tabbed interface with rich functionality
   - _Mitigation_: Reuse BfDs components, implement incrementally

### Product Risks

1. **User Experience Translation**: Desktop tool patterns may not translate well
   to web
   - _Mitigation_: User testing throughout development, responsive design focus

2. **Performance at Scale**: Multiple users creating large evaluation datasets
   - _Mitigation_: Implement pagination, lazy loading, performance monitoring

## Success Metrics

### Technical Metrics

- **System Prompt Tab**: Complete CRUD operations for prompts and samples
- **User Authentication**: Seamless Google OAuth integration
- **Data Persistence**: Reliable BfDb integration with proper relationships
- **Performance**: <2s page load times, responsive UI interactions

### Business Metrics

- **User Adoption**: 50%+ of landing page visitors try the aibff tool
- **Engagement**: 30%+ of users complete at least one grader evaluation
- **Retention**: 25%+ of users return to use tool multiple times
- **Conversion**: 10%+ of aibff users inquire about broader platform

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-3)

- [ ] Set up `/aibff/*` routing structure
- [ ] Implement Google OAuth authentication
- [ ] Design and implement BfDb schema for AibffProject
- [ ] Build tabbed workspace layout
- [ ] Implement System Prompt tab with full functionality

### Phase 2: Core Evaluation (Weeks 4-6)

- [ ] Implement Calibrate tab with manual grading
- [ ] Build Eval tab with automated evaluation
- [ ] Add sample management and batch processing
- [ ] Integrate AI model evaluation capabilities

### Phase 3: Optimization (Weeks 7-8)

- [ ] Implement Fix tab with outlier analysis
- [ ] Add advanced grader refinement tools
- [ ] Performance optimization and polish
- [ ] Comprehensive testing and bug fixes

### Launch Preparation (Week 9)

- [ ] E2E testing across all workflows
- [ ] Security audit for authentication and data handling
- [ ] Performance validation and optimization
- [ ] Documentation and user onboarding flows

## Dependencies and Prerequisites

### Technical Dependencies

- BfDb schema development and migration capabilities
- Google OAuth application setup and configuration
- AI model integration (OpenRouter or similar) for evaluation
- BfDs component library completion for specialized UI needs

### Resource Dependencies

- Full-stack development capacity (2-3 engineers)
- UX/UI design review for web workflow adaptation
- Product management for feature prioritization and user testing
- DevOps support for authentication and deployment configuration

## Future Considerations

### Collaboration Features (Post-V1)

- Multi-user project sharing and permissions
- Real-time collaboration on grader development
- Team analytics and reporting dashboard
- Project templates and community sharing

### Platform Integration

- Seamless upgrade path to full Bolt Foundry platform
- Integration with broader LLM development workflows
- API access for enterprise customers
- Advanced analytics and optimization tools

## Conclusion

Building the aibff functionality as a web platform within boltfoundry-com
creates a natural user acquisition and conversion funnel while providing
immediate value through proven grader building tools. The technical alignment
between existing aibff architecture and boltfoundry-com infrastructure minimizes
implementation risk while the phased approach ensures incremental value
delivery.

The focus on the tabbed workspace interface (starting with System Prompt tab)
provides the core value proposition while establishing the foundation for
complete workflow implementation. Integration with BfDb enables proper data
persistence and future collaboration features.

**Next Steps**:

1. Stakeholder review and approval of this implementation plan
2. BfDb schema design and development planning
3. Google OAuth setup and configuration
4. Begin Phase 1 implementation with System Prompt tab

---

## Appendix: Related Files

### AIBFF GUI Source Files (Reference)

- `apps/aibff/gui/src/components/workspace/` - Tabbed interface components
- `apps/aibff/gui/src/components/SystemPromptTab.tsx` - System prompt
  functionality
- `apps/aibff/gui/src/components/CalibrateTab.tsx` - Manual grading interface
- `apps/aibff/gui/src/components/EvalTab.tsx` - Evaluation tools
- `apps/aibff/gui/src/components/FixTab.tsx` - Outlier analysis
- `apps/aibff/gui/src/lib/persistence/` - File-based storage patterns
- `apps/aibff/gui/src/types/` - Data type definitions

### BoltFoundry-com Target Files

- `apps/boltfoundry-com/server.tsx` - Server implementation for new routes
- `apps/boltfoundry-com/routes.ts` - Routing configuration
- `apps/boltfoundry-com/src/components/` - Component library location
- `apps/boltfoundry-com/contexts/` - Context patterns for state management

### BfDb Integration

- `apps/bfDb/nodeTypes/` - Location for new AibffProject node types
- `apps/bfDb/graphql/` - GraphQL schema definitions
- `apps/bfDb/storage/` - Database adapters and storage configuration
- `lib/types.ts` - Shared type definitions

### Authentication & Infrastructure

- `packages/get-configuration-var/` - Environment configuration management
- `packages/logger/` - Logging infrastructure
- `apps/bfDs/` - Design system components
- `infra/bft/` - Build and deployment tooling

### Documentation & Patterns

- `decks/cards/testing.card.md` - TDD practices
- `decks/cards/coding.card.md` - Code organization standards
- `memos/guides/` - Technical architecture documentation
- `apps/aibff/memos/plans/` - Existing aibff planning documents

_This implementation plan follows Bolt Foundry monorepo conventions and
integrates with existing BFT tooling, testing infrastructure, and development
workflows._
