# RLHF Pipeline Data Model Implementation Plan

_Implementation plan for AI-assisted grading and human feedback system_

## Executive Summary

This plan outlines the implementation of a Reinforcement Learning from Human
Feedback (RLHF) pipeline within the Bolt Foundry ecosystem. The system enables
customers to create evaluation decks based on system prompts, collect samples
through API calls and automatic telemetry, and iteratively improve graders
through AI-assisted evaluation with human feedback corrections.

## Four-Phase RLHF Workflow

### Phase Overview

1. **Deck Creation**: User provides system prompt via API → LLM auto-generates
   grader suggestions
2. **Sample Collection**: API-based sample submission + automatic telemetry
   collection from production use
3. **AI-Assisted Grading**: AI evaluates samples with detailed reasoning, humans
   provide corrections
4. **Iterative Improvement**: "Fix UI" allows updating graders and system
   prompts based on feedback

### Entity Relationships

All relationships are implemented as BfEdge instances connecting BfNodes:

```
BfOrganization → BfPerson
BfOrganization → BfDeck
BfDeck → BfSample [tied to system prompt]
BfDeck → BfGrader [auto-generated from system prompt]
BfGrader + BfSample → BfGraderResult [AI evaluation]
BfSample → BfSampleFeedback → BfGrader [human ground truth]
```

### Entity Definitions

#### BfOrganization

- **Purpose**: Customer organization container
- **Authentication**: Hardcoded logins (initial implementation)
- **Relationships**: Owns all RLHF resources (decks, samples, graders)

#### BfPerson

- **Purpose**: Individual users within organizations
- **Authentication**: Hardcoded credentials (to be replaced with OAuth later)
- **Access**: Organization-scoped permissions

#### BfDeck

- **Purpose**: Container for system prompt and associated graders
- **Creation**: Based on user's system prompt with auto-generated graders
- **Scope**: Organization-owned, not shared across orgs
- **Components**: System prompt, auto-generated graders, collected samples

#### BfSample

- **Purpose**: Store AI responses generated using the deck's system prompt
- **Collection**: Manual upload + automatic telemetry integration
- **Format**: Full completion data with conversation messages
- **Metadata**: Timestamps, model info, deck association

#### BfGrader

- **Purpose**: Individual evaluation criteria within decks
- **Creation**: Auto-generated from system prompt analysis via LLM
- **Format**: Full grader definition with detailed rubric (matching aibff
  patterns)
- **Evaluation**: Independent system (no aibff integration)
- **Scoring**: -3 to +3 scale with specific criteria for each level

#### BfGraderResult

- **Purpose**: AI evaluation results
- **AI Output**: Score, explanation, and reasoning process
- **Relationships**: Connected to BfGrader and BfSample via BfEdges
- **Improvement**: Used to update grader definitions over time

#### BfSampleFeedback

- **Purpose**: Human ground truth scoring of samples against graders
- **Creation**: Human takes existing sample and scores it against specific
  grader
- **Data**: Human score (-3 to +3) and explanation
- **Relationships**: Connected to BfSample and BfGrader via BfEdges
- **Usage**: Provides ground truth for grader calibration and improvement

## Implementation Status Update

### Current Implementation Progress (as of analysis)

**✅ COMPLETED COMPONENTS:**

- **All five BfNode types implemented** - `BfDeck`, `BfGrader`, `BfSample`,
  `BfGraderResult`, `BfSampleFeedback`
- **Database patterns working** - Proper BfNode inheritance, organization
  scoping, JSON storage
- **Relationship handling implemented** - Using `createTargetNode` pattern for
  connections
- **Test coverage comprehensive** - All node types have tests, integration tests
  pass
- **Score validation functional** - -3 to +3 range enforced in both result and
  feedback nodes
- **Build system integration** - Code compiles successfully with existing
  infrastructure

**❌ MISSING COMPONENTS:**

- **GraphQL schema exposure** - RLHF types not available in generated schema
- **LLM system prompt analyzer** - No `/packages/system-prompt-analyzer/`
  service
- **API endpoints** - No GraphQL mutations for deck creation or operations
- **Authentication setup** - No hardcoded org/person management for testing

**Current Status: ~60% Complete (significant progress since plan creation)**

**Major Accomplishments Since Plan Creation:**

- Complete data model implementation
- Working relationship patterns between all entities
- Comprehensive test coverage including integration tests
- Build system integration verified
- GraphQL connection test issues resolved

### Original Codebase Patterns Analysis

Based on comprehensive analysis of the Bolt Foundry codebase, the following
patterns have been successfully followed in the implementation:

#### BfNode Implementation Pattern

- **Base Class**: `BfNode<TProps>` extends `GraphQLNode` at
  `apps/bfDb/classes/BfNode.ts:1`
- **Dual Specifications**: Both `gqlSpec` and `bfNodeSpec` required using
  `defineGqlNode()` and `defineBfNode()` methods
- **Organization Scoping**: All nodes use `cv.orgBfOid` for access control via
  `CurrentViewer`
- **File Location**: Node types go in `apps/bfDb/nodeTypes/rlhf/` directory
- **Naming**: PascalCase matching class names (e.g., `BfDeck.ts`)

#### GraphQL Mutation Pattern

- **Location**: GraphQL roots in `apps/bfDb/graphql/roots/`
- **Pattern**: Follow `Waitlist.ts` mutation structure with structured returns
- **Error Handling**: Return objects with `success: boolean` and
  `message: string`
- **Authentication**: Use `BfGraphqlContext` with `CurrentViewer` for auth
- **Testing**: Tests in `apps/bfDb/graphql/__tests__/` directory

#### Testing Framework (TDD Required)

- **Test Location**: `__tests__/` folders next to source files
- **File Naming**: `file.ts` → `__tests__/file.test.ts`
- **Database Testing**: Always use `withIsolatedDb()` for isolation
- **Test Utilities**: `makeLoggedInCv()`, `buildTestSchema()`, `testQuery()`
  helpers
- **Assertions**: Import from `@std/assert`, use `assertEquals`, `assertExists`,
  etc.
- **Test Runner**: Use `bft test` command
- **Testing Philosophy**: If we're going to test something, it should be
  specific to the model, not just arbitrarily testing framework concerns. We
  should lean on the linter and typechecker first, not unit tests.

#### LLM Integration Pattern

- **Service Location**: Create packages in `packages/` directory
- **Telemetry**: Use existing `trackLlmEvent()` for logging
- **Cost Tracking**: Use `calculateLlmCost()` for expense monitoring
- **Configuration**: Use `getConfigurationVariable()` instead of direct env
  access
- **Error Handling**: Graceful fallbacks when AI calls fail

#### Database and Edge Relationships

- **Edge Pattern**: Use preferred `bfNodeInstance.createTarget()` pattern
- **Metadata**: All nodes have `bfOid` for organization scoping
- **JSON Storage**: Use JSONB `props` field for flexible data storage
- **Indexing**: Standard BfNode metadata provides automatic indexing

### File Structure for Phase 1 Implementation

```
apps/bfDb/nodeTypes/rlhf/
├── BfDeck.ts                           # Main deck container
├── BfGrader.ts                         # Evaluation criteria
├── BfSample.ts                         # AI response samples
├── BfGraderResult.ts                   # AI evaluation results
├── BfSampleFeedback.ts               # Human ground truth
└── __tests__/
    ├── BfDeck.test.ts                  # TDD tests for deck
    ├── BfGrader.test.ts                # TDD tests for grader
    ├── BfSample.test.ts                # TDD tests for sample
    ├── BfGraderResult.test.ts          # TDD tests for results
    └── BfSampleFeedback.test.ts       # TDD tests for feedback

apps/bfDb/graphql/roots/
├── DeckCreation.ts                     # Deck creation mutations
└── __tests__/
    └── DeckCreation.test.ts            # GraphQL mutation tests

packages/system-prompt-analyzer/
├── analyzer.ts                         # LLM analysis service
├── types.ts                           # Type definitions
└── __tests__/
    └── analyzer.test.ts               # LLM service tests
```

### Updated Technical Specifications

## Implementation Architecture

### Phase 1: Deck Creation System

#### 1.1 System Prompt Input

- **Manual API Call**: User provides system prompt via API endpoint
- **Simple Integration**: POST request with system prompt payload
- **Testing**: Use curl/Postman to create decks

#### 1.2 System Prompt Analysis

- LLM-based analysis of system prompts (manual or telemetry-sourced)
- Auto-generation of grader suggestions with detailed rubrics
- Grader definition format matching aibff patterns (-3 to +3 scale)
- Preview and refinement interface for generated graders

#### 1.2 BfDeck Node Implementation

- Create BfDeck entity with system prompt storage
- Associate auto-generated graders with deck
- Organization-scoped deck management
- Basic CRUD operations through GraphQL

### Phase 2: Sample Collection System

#### 2.1 Manual Upload Interface

- UI for uploading user message + assistant response pairs
- Batch upload capabilities
- Sample validation and metadata extraction
- Association with specific decks

#### 2.2 Telemetry Integration

- Extend existing bolt-foundry telemetry collection
- Optional sample storage in bfDb during API interception
- Maintain backward compatibility with existing analytics
- Automatic deck association based on system prompt matching

### Phase 3: AI-Assisted Grading

#### 3.1 Grader Evaluation Engine

- Independent grading system (no aibff integration)
- AI evaluation with score, explanation, and reasoning process
- Support for full grader definition format with detailed rubrics
- Batch evaluation capabilities for multiple samples

#### 3.2 Human Feedback Interface

- Display AI evaluation results with full reasoning
- Human correction interface (score + explanation)
- 1:1 ground truth relationship (single human score per sample/grader)
- Feedback storage for grader improvement

### Phase 4: Iterative Improvement

#### 4.1 Fix Tab Interface

- Grader definition editing based on human feedback patterns
- System prompt updating capabilities
- Version control for grader changes
- Impact analysis of grader modifications

#### 4.2 Feedback Analysis

- Pattern detection in human disagreements with AI
- Automated suggestions for grader improvements
- System prompt optimization based on evaluation results
- Performance metrics and improvement tracking

## Technical Specifications

### Database Schema

```typescript
// BfDeck Node - Container for system prompt and evaluation setup
interface BfDeck extends BfNode {
  organizationId: string;
  name: string;
  systemPrompt: string; // Original system prompt
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// BfSample Node - AI responses tied to specific deck
interface BfSample extends BfNode {
  deckId: string; // Tied to deck, not organization
  completionData: OpenAICompletionJSON; // Full API response with messages
  collectionMethod: "manual" | "telemetry";
  createdAt: Date;
}

// BfGrader Node - Auto-generated evaluation criteria
interface BfGrader extends BfNode {
  deckId: string;
  name: string;
  criteria: string; // What is being evaluated
  createdAt: Date;
  updatedAt: Date;
}

// BfGraderResult Node - AI evaluation
interface BfGraderResult extends BfNode {
  graderId: string;
  sampleId: string;
  score: number; // -3 to +3
  explanation: string; // AI's reasoning
  evaluatedAt: Date;
}

// BfSampleFeedback Node - Human ground truth
interface BfSampleFeedback extends BfNode {
  sampleId: string;
  graderId: string;
  score: number; // -3 to +3
  explanation: string; // Human reasoning
  createdAt: Date;
}

## Implementation Phases

### Phase 1: Deck Creation System

- [x] Implement BfDeck, BfGrader, BfSample, BfGraderResult, BfSampleFeedback
      node types ✅ **COMPLETED** - All five node types implemented with proper relationships
- [x] Core database patterns and relationships ✅ **COMPLETED** - BfNode patterns, organization scoping, JSON storage
- [x] Test implementation for node types ✅ **COMPLETED** - Comprehensive test suite with TDD patterns
- [x] Score validation (-3 to +3) ✅ **COMPLETED** - Implemented in both BfGraderResult and BfSampleFeedback
- [x] End-to-end workflow testing ✅ **COMPLETED** - Integration tests verify complete pipeline
- [ ] Build LLM-based system prompt analysis service
- [ ] Create API endpoints for deck creation from system prompt
- [ ] Register RLHF node types in GraphQL schema
- [ ] Test deck creation via API calls (curl/Postman)
- [ ] Add hardcoded authentication (organization/person management)

### Phase 2: Sample Collection

- [x] BfSample node type with JSON completion data **COMPLETED**
- [x] Collection method tracking (manual/telemetry) **COMPLETED**
- [x] Deck association via relationships **COMPLETED**
- [ ] Create API endpoints for sample submission to decks
- [ ] Enhance telemetry collection for comprehensive sample storage
- [ ] Implement automatic sample-to-deck association logic
- [ ] Add batch sample processing capabilities (API + telemetry)
- [ ] Create API endpoints for sample querying and management

### Phase 3: AI-Assisted Grading

- [x] BfGraderResult node type with AI evaluation data **COMPLETED**
- [x] BfSampleFeedback node type for human corrections **COMPLETED**
- [x] Score validation (-3 to +3) and explanation storage **COMPLETED**
- [x] Relationship patterns between graders, samples, and results **COMPLETED**
- [ ] Build independent grading evaluation engine
- [ ] Create AI evaluation interface showing score, explanation, and reasoning
- [ ] Implement human feedback correction system
- [ ] Add grader result visualization and comparison
- [ ] Create batch evaluation workflows

### Phase 4: Iterative Improvement

- [x] Data model for tracking feedback and improvements **COMPLETED**
- [x] Foundation for grader versioning and updates **COMPLETED**
- [ ] Build "Fix UI" interface for grader editing
- [ ] Implement system prompt updating capabilities
- [ ] Add feedback pattern analysis for grader improvement
- [ ] Create performance metrics and improvement tracking
- [ ] End-to-end testing with realistic datasets

## Next Steps

### Immediate Actions - UPDATED

1. ✅ Finalize four-phase workflow and data model validation **DONE**
2. ✅ Set up development environment with bfdb extensions **DONE**
3. ✅ Create initial BfNode implementations (BfDeck, BfSample, BfGrader,
   BfGraderResult, BfSampleFeedback) **DONE**
4. [ ] Build LLM prompt for system prompt analysis and grader generation **NEXT**
5. [ ] Register RLHF node types in GraphQL schema **NEXT**
6. [ ] Create GraphQL mutations for deck creation **NEXT**
7. [ ] Build system prompt analyzer package **NEXT**

### Sprint 1 Goals (Phase 1 - Deck Creation) - UPDATED

1. ✅ Complete all five BfNode implementations **DONE**
2. ✅ Implement core database patterns and relationships **DONE**
3. ✅ Create comprehensive test suite **DONE**
4. [ ] Build system prompt analysis service with LLM integration **IN PROGRESS**
5. [ ] Register RLHF node types in GraphQL schema **NEXT**
6. [ ] Create API endpoints for deck creation from system prompts **NEXT**
7. [ ] Test manual deck creation via API calls **NEXT**
8. [ ] Implement hardcoded authentication for organization/person access **NEXT**
9. [ ] Test end-to-end deck creation workflow via API calls **NEXT**

## Anti-Goals (Future Considerations)

### Manual UI Development

**Future Feature**: Web interface for manual deck creation and sample management

**Components Not Being Built**:

- **Manual Deck Creation UI**: Web forms for system prompt input
- **Sample Upload UI**: Web interface for sample upload and batch processing
- **Sample Management Dashboard**: Visual interfaces for viewing and managing
  samples
- **Grader Editing Interface**: UI for manually editing generated graders

**Current Decision**: Focus on telemetry-driven automation, APIs provide
sufficient functionality for MVP

### Automatic Deck Suggestion System

**Future Feature**: Automatically suggest creating new decks when telemetry
detects new system prompts

**Requirements for Implementation**:

- **System Prompt Detection**: Extract system prompts from telemetry data
- **Organization Task System**: "Inbox" interface for pending deck suggestions
- **Frequency Analysis**: Prioritize suggestions based on usage patterns
- **Notification System**: Alert users to new opportunities for deck creation

**Current Decision**: Focus on telemetry-driven deck creation for MVP, revisit
automatic suggestions later

## Appendix: Key Reference Files and Links

### Core Implementation References

- **BfNode Base Class**: `apps/bfDb/classes/BfNode.ts:1` - Base class for all
  node types
- **BfEdge Pattern**: `apps/bfDb/classes/BfEdge.ts:1` - Relationship creation
  patterns
- **CurrentViewer Auth**: `apps/bfDb/classes/CurrentViewer.ts:1` - Organization
  scoping
- **GraphQL Context**: `apps/bfDb/graphql/BfGraphqlContext.ts:1` -
  Authentication context

### Testing References

- **Testing Guidelines**: `decks/cards/testing.card.md:1` - TDD practices and
  patterns
- **Test Utilities**: `apps/bfDb/utils/testUtils.ts:1` - Helper functions for
  tests
- **Example BfNode Tests**: `apps/bfDb/classes/__tests__/BfNode.test.ts:1` -
  Testing patterns
- **GraphQL Tests**: `apps/bfDb/graphql/__tests__/BasicMutation.test.ts:1` -
  Mutation testing

### LLM Integration References

- **AI Summarizer**: `packages/team-status-analyzer/ai-summarizer.ts:1` - OpenAI
  integration pattern
- **LLM Event Tracking**:
  `apps/collector/__tests__/llm-event-tracker.test.ts:1` - Telemetry patterns
- **Cost Calculation**: `infra/bff/friends/__tests__/llm.test.ts:1` - Cost
  tracking patterns
- **Configuration**: `packages/get-configuration-var/main.ts:1` - Secure config
  access

### GraphQL Pattern References

- **Waitlist Mutation**: `apps/bfDb/graphql/roots/Waitlist.ts:1` - Mutation
  implementation example
- **Schema Building**: `apps/bfDb/graphql/__tests__/TestHelpers.test.ts:1` -
  Test schema creation
- **Query Testing**: `apps/bfDb/graphql/__tests__/Waitlist.test.ts:1` - Mutation
  testing patterns

### Database References

- **Backend Tests**: `apps/bfDb/backend/__tests__/DatabaseBackend.test.ts:1` -
  Database operations
- **Node Examples**: `apps/bfDb/nodeTypes/aibff/AibffConversation.test.ts:1` -
  Complex node testing
- **Isolation Pattern**: Search for `withIsolatedDb` usage patterns

### Development Commands

- **Test Runner**: `bft test` - Run all tests
- **Build System**: `bft build` - Full project build
- **CI Pipeline**: `bft ci` - Complete CI workflow
- **Development**: `bft devTools` - Start development environment

### Documentation Standards

- **Coding Guidelines**: `decks/cards/coding.card.md:1` - Code organization and
  style
- **Version Control**: `decks/cards/version-control.card.md:1` - Sapling SCM
  workflow
- **Architecture Docs**: `memos/guides/` - Technical architecture patterns
```
