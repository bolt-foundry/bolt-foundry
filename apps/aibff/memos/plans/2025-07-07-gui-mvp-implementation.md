# aibff GUI MVP Implementation Plan

**Date**: 2025-07-07\
**Status**: Planning\
**Goal**: Build minimum viable end-to-end flow for AI pipeline evaluation

## Overview

Users need a tool to systematically improve their LLM applications by
establishing ground truth, discovering evaluation dimensions, and iteratively
refining graders. The current aibff GUI has good UX patterns but lacks the
business logic to support this workflow.

## MVP User Flow

1. **Test Conversation** - Run sample prompts to generate responses
2. **Save Conversation** - Persist test results for evaluation
3. **Grade Results** - Score responses using multiple evaluation dimensions
4. **Calibration** - Compare grader scores against user ground truth
5. **Iterate Grader** - Refine graders based on calibration feedback

## Implementation Plan by Step

### Step 1: Test Conversation

**Status**: ✅ Partially Complete\
**Current State**: Basic test conversation UI exists with save button
**Needed**:

- ✅ Save button added to UI
- ✅ Completion data capture from OpenAI API
- ✅ JSONL storage format implemented
- 🔲 Pass conversationId through component hierarchy
- 🔲 Visual feedback when save succeeds/fails

### Step 2: Save Conversation

**Status**: 🔲 Needs Implementation **Current State**: Basic conversation
persistence exists **Needed**:

- 🔲 Structured sample storage (input + output + metadata)
- 🔲 Sample management UI in right panel
- 🔲 Sample editing/deletion capabilities
- 🔲 Bulk import of existing samples
- 🔲 Sample tagging/categorization

### Step 3: Grade Results

**Status**: 🔲 Needs Implementation\
**Current State**: Empty grader framework exists **Needed**:

- 🔲 Ground truth scoring interface (-3 to +3 scale)
- 🔲 Natural language feedback capture
- 🔲 AI assistant dimension discovery from feedback
- 🔲 Multiple grader creation/management
- 🔲 Grader execution against sample sets
- 🔲 Score visualization and comparison

### Step 4: Calibration

**Status**: 🔲 Needs Implementation **Current State**: CalibrationTab UI exists
but not functional **Needed**:

- 🔲 Ground truth vs grader score comparison
- 🔲 Performance metrics calculation (accuracy, correlation)
- 🔲 Mismatch identification and highlighting
- 🔲 Calibration results visualization
- 🔲 Export calibration reports

### Step 5: Iterate Grader

**Status**: 🔲 Needs Implementation **Current State**: No iteration workflow
exists **Needed**:

- 🔲 AI assistant guidance for grader improvement
- 🔲 Prompt refinement suggestions based on mismatches
- 🔲 A/B testing between grader versions
- 🔲 Grader version history and rollback
- 🔲 Batch re-evaluation after grader changes

## Technical Architecture

### Existing Assets to Leverage

- ✅ Chat interface with streaming responses
- ✅ Three-tab workflow panel (System Prompt, Calibration, Eval)
- ✅ Accordion-style subsections within tabs
- ✅ AibffConversation class with file management
- ⚠️ GraphQL/Isograph setup (minimal implementation, needs migration)
- ✅ Dark theme UI components

### New Components Needed

- `SampleManager` - Upload, edit, organize text samples
- `GroundTruthScorer` - -3 to +3 scoring interface
- `GraderBuilder` - Create/edit grader prompts and configs
- `CalibrationRunner` - Execute graders against ground truth
- `PerformanceViewer` - Visualize score comparisons and metrics
- `IterationAssistant` - AI-guided grader improvement workflow

### Data Model Updates

- `Sample` - Input text + expected output + metadata + ground truth scores
- `Grader` - Prompt + dimension focus + version history
- `GraderRun` - Execution results for grader against sample set
- `GroundTruth` - User scores and feedback for specific samples
- `CalibrationResult` - Performance metrics and mismatch analysis

### GraphQL/Isograph Integration Status

**Current State**: Minimal implementation using mostly direct HTTP calls

**What exists**:

- ✅ Isograph configuration and generated types
- ✅ Basic GraphQL server setup in guiServer.ts
- ✅ Minimal schema with conversation/message types
- ✅ Two demo components using Isograph

**Critical gaps**:

- 🔲 95% of data operations use direct HTTP calls (`/api/*` endpoints)
- 🔲 No GraphQL mutations for saving conversations, test results, workflow data
- 🔲 No resolvers connecting GraphQL to AibffConversation class
- 🔲 Tool calls completely outside GraphQL system
- 🔲 Streaming responses use SSE, not GraphQL subscriptions

**Migration decision needed**: Either fully migrate to GraphQL or acknowledge
hybrid approach and plan accordingly.

**Recommended approach for MVP**: Continue with direct HTTP calls for now,
migrate to GraphQL in Phase 2/3 to avoid architectural delays.

## Implementation Priority

### Phase 1: Core Sample Management (Week 1)

1. Complete conversationId propagation for test conversation saves
2. Build sample management UI in workflow panel
3. Implement ground truth scoring interface
4. Create basic grader execution framework

### Phase 2: Calibration & Visualization (Week 2)

1. Build calibration comparison logic
2. Implement performance metrics calculation
3. Create score visualization components
4. Add mismatch identification and highlighting

### Phase 3: AI-Assisted Iteration (Week 3)

1. Implement dimension discovery from natural language feedback
2. Build grader improvement suggestion system
3. Add grader versioning and A/B testing
4. Complete end-to-end workflow testing

## Success Criteria

- User can upload text samples and test prompts
- User can score results with natural language feedback
- System discovers evaluation dimensions automatically
- Multiple graders can be created and executed
- Calibration shows clear performance comparison
- AI assistant guides grader improvement process
- Complete workflow takes <30 minutes for typical use case

## Technical Debt & Risks

- **GraphQL/Isograph migration debt**: Currently using hybrid approach with
  mostly direct HTTP calls
- Current file structure may not scale with multiple graders
- AI assistant responses need structured tool calling
- Performance may degrade with large sample sets
- Need error handling for API failures and edge cases
- **Decision point**: Full GraphQL migration vs. hybrid approach impacts
  long-term maintainability

## Next Steps

1. Complete Step 1 implementation (conversationId propagation)
2. Design sample management data structures
3. Create wireframes for ground truth scoring interface
4. Begin Phase 1 implementation
