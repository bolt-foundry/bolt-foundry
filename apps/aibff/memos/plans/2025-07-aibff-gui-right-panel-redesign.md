# aibff GUI Right Panel Redesign Implementation Memo

**Date:** 2025-07-02\
**Status:** Planning\
**Phase:** Design & Implementation

## Overview

Complete redesign of the aibff GUI right panel to support a comprehensive 7-step
workflow for building LLM evaluation graders. This will replace the existing
`TabbedEditor` component with an entirely new component built from scratch.

## Current State Analysis

### Existing Right Panel Structure (To Be Removed)

- `TabbedEditor` component with 5 tabs:
  - Input Samples (JSONL editor)
  - Actor Deck (Markdown editor)
  - Grader Deck (Markdown editor)
  - Ground Truth (Data editor)
  - Notes (Markdown editor)

### Issues with Current Implementation

- Static text editors without workflow integration
- No specialized UI for different content types
- Missing key workflow steps (calibration, feedback, file management)
- No AI assistance integration in right panel

## New 7-Step Workflow Design

### Step-by-Step Process

1. **Input Samples** - Collect evaluation input data (JSONL format)
2. **System Prompt** - Define AI assistant behavior (text/markdown)
3. **Output Samples** - AI-generated outputs matching OpenAI completions format
   (JSONL)
4. **Eval Prompt** - Evaluation criteria and grader instructions (text/markdown)
5. **Eval Output** - Calibration results and evaluation data (read-only display)
6. **Fix** - AI-powered feedback and improvement suggestions (interactive UI)
7. **Edit** - Directory browser and file management (file explorer UI)

## Technical Implementation Plan

### 1. New Component Architecture

```
WorkflowPanel (new root component)
├── WorkflowTabs (tab navigation)
├── InputSamplesTab (existing functionality)
├── SystemPromptTab (renamed from Actor Deck)
├── OutputSamplesTab (new JSONL editor)
├── EvalPromptTab (renamed from Grader Deck)
├── EvalOutputTab (new results display)
├── FixTab (new AI feedback UI)
└── EditTab (new file browser)
```

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

### Phase 1: Core Tab Structure

- [ ] Extend `AibffConversation` class with workflow file methods
- [ ] Replace `replaceGraderDeck` tool call with new workflow tool calls
- [ ] Create new `WorkflowPanel` component
- [ ] Implement basic tab navigation
- [ ] Migrate InputSamples and SystemPrompt tabs
- [ ] Update GraphQL resolvers to use extended conversation methods

### Phase 2: New Content Tabs

- [ ] Implement OutputSamplesTab (validation deferred)
- [ ] Migrate EvalPromptTab from Grader Deck
- [ ] Create placeholder EvalOutputTab
- [ ] Add remaining workflow file methods to AibffConversation
- [ ] Update GraphQL schema and resolvers for all workflow fields

### Phase 3: Advanced Features

- [ ] Create EditTab file browser
- [ ] Enhanced file operations and management
- [ ] FixTab placeholder (AI feedback deferred)

### Phase 4: Polish & Integration

- [ ] UI/UX improvements and consistency
- [ ] Error handling and validation
- [ ] Performance optimizations
- [ ] Integration testing with existing chat interface

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

1. **Complete Right Panel Redesign**: Replace TabbedEditor with new
   WorkflowPanel component
2. **7-Step Workflow Implementation**: All tabs functional (Input Samples,
   System Prompt, Output Samples, Eval Prompt, Eval Output, Fix, Edit)
3. **File-Based Storage**: Extended AibffConversation class with separate
   workflow files
4. **AI Tool Call Integration**: New workflow-specific tool calls replace
   replaceGraderDeck
5. **Placeholder Tabs**: Eval Output and Fix tabs show "Coming soon"
   placeholders
6. **Directory Browser**: Edit tab displays conversation files with basic
   operations

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
