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

**Status**: ✅ Nearly Complete\
**Current State**: Fully functional test conversation UI with save functionality
**Completed**:

- ✅ Save button added to UI
- ✅ Completion data capture from OpenAI API
- ✅ JSONL storage format implemented
- ✅ Save functionality working end-to-end
- ✅ Full BfDs component migration completed

**Remaining**:

- 🔲 Implement proper Isograph integration for save functionality
- 🔲 Create GraphQL mutations for saving conversations
- 🔲 Visual feedback when save succeeds/fails
- 🔲 Saved Results display UI for JSONL data

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

**Updated approach**: Implement proper Isograph integration for save
functionality instead of continuing with HTTP calls. This will establish better
patterns for future GraphQL migration.

### BfDs Component Migration - COMPLETED

**Status**: ✅ Complete\
**Achievement**: Successfully migrated entire aibff GUI from inline styles to
BfDs components

**Impact Summary**:

- Eliminated ~300 lines of inline styles across 8 components
- Replaced with 20 standardized BfDs components
- Added 80 lines of clean CSS classes in App.css
- Maintained all existing functionality while improving consistency

**Components Migrated**:

1. **WorkflowTextArea** - Replaced inline styling with BfDsTextArea + container
   wrapper
2. **WorkflowPanel** - Migrated from custom tab buttons to BfDsTabs component
3. **ChatWithIsograph** - Added BfDsCallout for loading/error states
4. **MessageInput** - Complete migration to BfDsForm + BfDsTextArea
5. **GraderEditor** - Migrated with BfDsForm + BfDsTextArea + BfDsCallout status
   indicators
6. **SystemPromptTab** - Replaced complex accordion inline styles with
   BfDsList + BfDsListItem
7. **CalibrationTab** - Accordion migration to BfDsList + BfDsListItem
8. **EvalTab** - Accordion migration to BfDsList + BfDsListItem

**Technical Implementation**:

- Consistent accordion pattern using BfDsList + BfDsListItem across all workflow
  tabs
- Form standardization with BfDsForm + BfDsTextArea pattern
- Status indicators using BfDsCallout with appropriate variants
- Preserved special styling (monospace fonts, dark theme) where needed
- All BfDs imports properly structured from "@bfmono/apps/bfDs/components/"

**Files Modified**:

- 8 React component files updated with BfDs imports and component usage
- App.css created with clean container classes replacing inline styles
- All changes maintain backward compatibility and existing functionality

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

**Resolved**:

- ✅ **UI consistency debt**: BfDs component migration completed, eliminating
  300+ lines of inline styles

## Next Steps

1. Complete Step 1 implementation (Isograph integration for save functionality)
2. Design sample management data structures
3. Create wireframes for ground truth scoring interface
4. Begin Phase 1 implementation
