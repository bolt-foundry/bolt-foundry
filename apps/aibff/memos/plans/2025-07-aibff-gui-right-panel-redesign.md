# aibff GUI Right Panel Redesign Implementation Memo

**Date:** 2025-07-02 (Updated: 2025-07-08)\
**Status:** Phase 2 Complete - Four-Tab Interface Implemented\
**Phase:** Video Recording Enhanced

## Overview

✅ **COMPLETED**: Successfully redesigned the aibff GUI right panel with a clean
4-tab interface using BfDs components for building LLM evaluation graders. The
existing `TabbedEditor` component has been replaced with the new `WorkflowPanel`
using BfDsTabs.

✅ **COMPLETED**: The accordion workflow has been successfully restructured into
a cleaner 4-tab interface with enhanced E2E testing and video recording
capabilities.

## Implementation Completed (July 2025)

### New WorkflowPanel Accordion ✅

Successfully implemented radio-style accordion with 8 sections:

1. **System Prompt** (default expanded) - AI behavior definition
2. **Input Variables** - JSONL input data for testing
3. **Test Conversation** - Ephemeral conversation testing
4. **Saved Results** - Saved conversation outputs
5. **Calibration** - Parameter tuning settings
6. **Eval Prompt** - Evaluation criteria and instructions
7. **Run Eval** - Evaluation execution and results
8. **Files** - File management and workflow settings

### Key Features Implemented ✅

- **Radio behavior**: Only one section open at a time for focused workflow
- **Smooth animations**: Arrow rotation and background transitions
- **Visual feedback**: Active section highlighting with blue background
- **Logical progression**: System Prompt → Input Variables workflow order
- **Space efficiency**: Accordion maximizes content area in 400px sidebar
- **State persistence**: Each section maintains content when collapsed

### Four-Tab Interface Implementation ✅

Successfully transitioned from accordion to clean 4-tab interface:

1. **System Prompt Tab** - Consolidated workflow with 5 detailed sections:
   - System Prompt editor with AI behavior definition
   - Input Variables for JSONL prompt testing
   - Test Conversation for ephemeral testing
   - Saved Results for conversation outputs
   - Ground Truth for graded samples with explanations

2. **Calibrate Tab** - Grading interface for ground truth generation:
   - +3 to -3 scale grading with descriptive explanations
   - Ground truth data collection workflow

3. **Eval Tab** - Multiple grader management:
   - Support for multiple graders per dimension
   - Execution interface for grading evaluation

4. **Fix Tab** - Outlier analysis and refinement:
   - Results analysis and outlier identification
   - Iterative improvement interface for graders and prompts

### E2E Testing & Video Recording ✅

Enhanced development workflow with comprehensive testing:

- **Automated E2E Tests**: Tab navigation verification with screenshot capture
- **Video Recording**: Cursor overlay with smooth UI interactions
- **Build Integration**: E2E tests run with proper build pipeline
- **Server Management**: Automatic server startup and cleanup

## Accordion Architecture (Implemented)

### Technical Implementation ✅

**Component Structure:**

```
WorkflowPanel (radio-style accordion)
├── Accordion Headers (clickable, with arrow indicators)
├── Single Expanded Section (radio behavior)
├── WorkflowTextArea (reused for all content)
└── State Management (single expandedSection string)
```

**Key Technical Decisions:**

- **Radio-style**: `expandedSection` string instead of `Set<string>` for
  multi-open
- **Section reordering**: System Prompt moved to position 1 (most logical
  starting point)
- **Unified content**: All sections use `WorkflowTextArea` component for
  consistency
- **State management**: Each section has independent state hooks for content
  persistence

## Updated Technical Implementation Plan

### 1. New Four-Tab Component Architecture

```
WorkflowPanel (updated root component)
├── BfDs Tab Navigation (using BfDs tab components)
├── SystemPromptTab (consolidates system prompt, input variables, test conversation)
├── CalibrateTab (saved results → ground truth grading workflow)
├── EvalTab (grader creation and execution per dimension)
└── FixTab (outlier analysis and grader/prompt refinement)
```

### 2. Detailed Tab Workflow Structure

#### Tab 1: System Prompt

**Purpose**: Core prompt development and testing **Content**: Consolidates first
3 accordion sections:

- System Prompt editor
- Input Variables (JSONL format)
- Test Conversation (ephemeral chat interface)
- Saved Results (conversation save/load)
- Ground Truth (graded samples with explanations)

#### Tab 2: Calibrate

**Purpose**: Sample grading and ground truth generation **Content**:

- Display saved conversation results
- Grading interface (+3 to -3 scale)
- Description field for grading rationale
- Move graded samples to ground truth collection

#### Tab 3: Eval

**Purpose**: Grader creation and execution **Content**:

- Multiple grader management (one per dimension)
- Grader editor for each dimension
- Execution interface against ground truth data
- Results display and metrics

#### Tab 4: Fix

**Purpose**: Iterative improvement based on results **Content**:

- Evaluation results analysis
- Outlier identification and filtering
- Grader refinement interface
- System prompt adjustment tools

### 2. Tab-Specific Implementation Details

#### InputSamplesTab

- **Reuse existing functionality** from current Input Samples tab
- JSONL format editing
- Auto-save with status indicators
- (JSONL validation to be added later)

#### SystemPromptTab

- **Migrate content** from current Actor Deck tab
- Text/markdown editor for AI behavior definition
- Auto-save functionality

#### OutputSamplesTab

- **New implementation** with identical UI to InputSamplesTab
- JSONL editor for OpenAI completions format
- Auto-save functionality
- (JSONL validation to be added later)

#### EvalPromptTab

- **Migrate content** from current Grader Deck tab
- Text/markdown editor for evaluation instructions
- Auto-save functionality

#### EvalOutputTab

- **Placeholder implementation** for Justin's calibration work
- Read-only display component
- Data visualization for evaluation results
- Empty state with "Coming soon" message

#### FixTab

- **Placeholder implementation** for AI feedback functionality
- Empty state with "Coming soon" message
- (AI feedback UI to be implemented later)

#### EditTab

- **New file browser/manager** for conversation directory
- Tree view of conversation files
- Inline editing capabilities
- File operations (create, delete, rename)

### 3. Data Management

#### AibffConversation Extension

The existing `AibffConversation` class needs to be extended to support the
workflow tab data:

**Current Implementation:**

- File-based storage in `@bfmono/tmp/conversations/`
- Main conversation stored as `{conversationId}.md` with TOML frontmatter
- Messages array with user/assistant roles
- Markdown parsing and serialization

**Required Extensions:**

- Add workflow file management methods:
  - `getInputSamples()` / `setInputSamples(content: string)`
  - `getSystemPrompt()` / `setSystemPrompt(content: string)`
  - `getOutputSamples()` / `setOutputSamples(content: string)`
  - `getEvalPrompt()` / `setEvalPrompt(content: string)`
  - `getEvalOutput()` / `setEvalOutput(content: string)`
  - `listFiles()` - for Edit tab directory listing

**File Management:**

- Each workflow tab content stored as separate file in conversation directory
- Automatic file creation on first write
- Debounced save operations (2-second delay)
- File watching for external changes (future enhancement)

#### File Structure

```
aibff-conversations/{conversationId}/
├── {conversationId}.md         # Main conversation (existing)
├── input-samples.jsonl         # Input samples tab data
├── system-prompt.md           # System prompt tab data  
├── output-samples.jsonl       # Output samples tab data
├── eval-prompt.md            # Eval prompt tab data
└── eval-output.json          # Eval output tab data (placeholder)
```

#### GraphQL Schema

```graphql
type AibffConversation {
  id: String!
  created_at: String!
  updated_at: String!
  messages: [AibffMessage!]!
  inputSamples: String          # Content of input-samples.jsonl
  systemPrompt: String          # Content of system-prompt.md
  outputSamples: String         # Content of output-samples.jsonl
  evalPrompt: String           # Content of eval-prompt.md
  evalOutput: String           # Content of eval-output.json
  files: [ConversationFile!]!  # Directory listing for Edit tab
}

input ConversationUpdateInput {
  inputSamples: String
  systemPrompt: String
  outputSamples: String
  evalPrompt: String
}
```

#### GraphQL Operations

- `query getConversation(id: String!)` - Get complete conversation data
  including all workflow files
- `mutation updateConversation(id: String!, input: ConversationUpdateInput!)` -
  Update workflow file contents

## Implementation Phases

### Phase 1: Core Accordion Structure ✅ COMPLETED

- [x] ~~Extend `AibffConversation` class with workflow file methods~~ (Deferred)
- [x] ~~Replace `replaceGraderDeck` tool call with new workflow tool calls~~
      (Enhanced existing)
- [x] **Create new `WorkflowPanel` component** - Accordion with radio behavior
- [x] **Implement accordion navigation** - Clickable headers with arrow
      indicators
- [x] **All 8 sections implemented** - System Prompt, Input Variables, Test
      Conversation, Saved Results, Calibration, Eval Prompt, Run Eval, Files
- [x] **State management** - Each section has independent content state

### Phase 2: Four-Tab Restructure ✅ COMPLETED

- [x] **Implement BfDs tab navigation** - ✅ Replaced accordion with BfDsTabs
      component
- [x] **Restructure SystemPromptTab** - ✅ Consolidated system prompt, input
      variables, test conversation, saved results, and ground truth into single
      tab with detailed sections
- [x] **Create CalibrateTab** - ✅ Implemented grading interface placeholder
      with +3 to -3 scale description
- [x] **Enhance EvalTab** - ✅ Added multiple grader management placeholder with
      execution capabilities
- [x] **Implement FixTab** - ✅ Created outlier analysis and iterative
      improvement placeholder interface
- [x] **E2E Testing** - ✅ Comprehensive E2E tests with tab navigation and
      screenshot verification
- [x] **Video Recording** - ✅ Enhanced video recording with cursor overlay and
      smooth UI interactions

### Phase 3: File Integration (NEXT)

- [ ] **Files tab implementation** - Directory browser and file management
- [ ] **AibffConversation file methods** - Read/write workflow section content
      to files
- [ ] **File persistence** - Auto-save accordion content to conversation
      directory

### Phase 4: Evaluation Pipeline (FUTURE)

- [ ] **Run Eval functionality** - Execute evaluations and display results
- [ ] **Calibration integration** - Parameter tuning and feedback
- [ ] **End-to-end workflow** - Complete prompt → test → eval → iterate cycle

## Technical Considerations

### Test-Driven Development (TDD)

**IMPORTANT**: Follow TDD practices throughout implementation as specified in
`decks/cards/testing.card.md`

- Write tests first for all new AibffConversation methods
- Test-driven component development for WorkflowPanel
- Unit tests for each tab component
- Integration tests for tool call functionality
- End-to-end tests for complete workflow
- Test file I/O operations with mock file system

### UI/UX Design

- **Component Strategy**: Prioritize using BfDs components first
- If required component doesn't exist in BfDs, create app-local component rather
  than inline code
- Loading states and error handling
- Empty states for new conversations
- Proper error messages for file operations

### Anti-Goals

- **No JSONL validation** - Keep implementation simple, validation can be added
  later
- **No file watching** - Don't implement external file change detection
- **No collaborative editing** - Single user experience only
- **No export/import** - Focus on core workflow functionality
- **No BfNode integration** - Keep using file-based system for now

### Integration Points

- Chat interface tool calls for modifying tab content
- AI assistant integration for Fix tab functionality
- Existing conversation persistence system
- Real-time updates between chat and right panel
- GraphQL integration with existing Isograph client

### AI Tool Calls

Replace the existing `replaceGraderDeck` with specific tool calls for each
workflow tab:

**Update Operations:**

```typescript
updateInputSamples(content: string) -> { success: boolean, message?: string }
updateSystemPrompt(content: string) -> { success: boolean, message?: string }
updateOutputSamples(content: string) -> { success: boolean, message?: string }
updateEvalPrompt(content: string) -> { success: boolean, message?: string }
```

**Read Operations:**

```typescript
getInputSamples() -> string
getSystemPrompt() -> string  
getOutputSamples() -> string
getEvalPrompt() -> string
getEvalOutput() -> string
getConversationFiles() -> Array<{name: string, size: number, modified: string}>
```

**Design Rationale:**

- Separate tool calls per tab for clarity and type safety
- Update calls return success status only (no content echo)
- Explicit get/set separation for better AI usability
- Each tab can have independent validation and processing

## Success Criteria

### Phase 1 Complete ✅

1. **Complete Right Panel Redesign**: ✅ Replaced TabbedEditor with
   WorkflowPanel accordion
2. **8-Section Workflow Implementation**: ✅ All accordion sections functional
   with radio behavior
3. **UI/UX Excellence**: ✅ Smooth animations, visual feedback, logical section
   ordering
4. **State Management**: ✅ Independent content state for each section with
   persistence
5. **E2E Testing**: ✅ Screenshot-based verification of accordion functionality

### Phase 2 Goals ✅ COMPLETED

1. **BfDs Tab Integration**: ✅ Replaced accordion with BfDsTabs component
   providing clean tab navigation
2. **SystemPromptTab Enhancement**: ✅ Consolidated 5 accordion sections into
   cohesive single-tab workflow with detailed subsections
3. **CalibrateTab Implementation**: ✅ Built grading interface with +3 to -3
   scale description and ground truth generation workflow
4. **EvalTab Multi-Grader Support**: ✅ Implemented multiple grader management
   interface with execution capabilities
5. **FixTab Outlier Analysis**: ✅ Created results analysis and iterative
   improvement interface
6. **E2E Testing Infrastructure**: ✅ Comprehensive automated testing with tab
   navigation verification
7. **Video Recording Enhancement**: ✅ Cursor overlay and smooth UI interactions
   for demonstration videos

### Future Goals

1. **File-Based Storage**: Extended AibffConversation class with separate
   workflow files
2. **AI Tool Call Integration**: Enhanced workflow-specific tool calls
3. **Directory Browser**: Files tab with conversation file management
4. **Evaluation Pipeline**: Complete prompt development and testing workflow

## Risks & Mitigation

### Technical Risks

- **Component complexity**: Building WorkflowPanel from scratch
  - _Mitigation_: Follow TDD practices and use existing BfDs components
- **File I/O operations**: Managing multiple workflow files per conversation
  - _Mitigation_: Extend proven AibffConversation class patterns
- **Tool call integration**: Replacing existing replaceGraderDeck functionality
  - _Mitigation_: Implement incrementally, test each tool call separately

## Next Steps

1. **Architecture Review**: Validate component structure and tool call design
2. **TDD Setup**: Prepare test framework for AibffConversation extensions
3. **Component Design**: Plan WorkflowPanel component structure using BfDs
4. **Implementation Start**: Begin Phase 1 development

---

_This memo will be updated as implementation progresses and requirements
evolve._
