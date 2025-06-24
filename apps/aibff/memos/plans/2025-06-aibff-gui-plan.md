# aibff GUI Implementation Plan

## Overview

The aibff GUI is a locally-running web application that helps users create
graders for classification tasks. It provides an interactive, AI
assistant-driven interface for building single-dimension graders with gradient
scoring from -3 to +3.

## Core Concept

Users build graders that evaluate classification performance on a gradient
scale:

- **+3**: Correctly classified (true positive/negative)
- **+2**: Mostly correct
- **+1**: Somewhat correct
- **0**: Unable to grade / Invalid input
- **-1**: Somewhat incorrect
- **-2**: Mostly incorrect
- **-3**: Incorrectly classified (false positive/negative)

Note: The grader must make a decision (+3 to -3). Zero is reserved only for
cases where the input cannot be graded.

## MVP: YouTube Comment Topic Classifier

The initial implementation focuses on a complete end-to-end example of building
topic classifiers for YouTube comments. Users will create separate graders for
different topics (e.g., "Is this about the video content?", "Is this about the
creator?", "Is this technical feedback?").

## Technical Architecture

### Stack

- **Backend**: Deno server launched via `aibff gui` command (alias: `aibff web`)
  - Note: aibff is distributed as a compiled binary (see
    [Release Guide](../guides/release-guide.md))
  - The GUI command will be part of the compiled binary, not a separate script
- **Frontend**: Vite + Deno with BfDs components
- **Storage**: BfDb file-backed items (TOML/Markdown files on disk)
- **GraphQL**: Isograph for client-server communication
- **AI Integration**: Uses aibff's existing render methods

### UI Layout

- **Left Panel**: AI assistant chat interface (primary interaction point)
- **Right Panel**: Workspace with tabs:
  - Samples: View and manage collected samples
  - Grader: See the grader definition being built
  - Results: View evaluation results (custom UI for MVP)

## User Workflow

### 1. AI-Driven Onboarding

- User launches `aibff gui`
- Browser opens to localhost
- AI assistant immediately greets user: "Hi! I'm here to help you build a grader
  for your classification task. Let's start with an example - we'll build a
  topic classifier for YouTube comments. This will show you how graders work,
  and then you can apply the same approach to your own use case."
- All subsequent interactions happen through the AI assistant

### 2. Dimension Definition

- AI assistant explains: "Let's start with one topic: 'Is this comment about the
  video content?' This is important - each grader should evaluate just one
  dimension. Later, you can create additional graders for other topics like 'Is
  this about the creator?' or 'Is this technical feedback?'"
- Sets up the first topic classifier example

### 3. Sample Collection

- AI assistant provides example YouTube comments: "Let me show you some example
  YouTube comments. I'll rate each one based on whether it's about the video
  content, and you can tell me if you agree or would rate it differently."
- Shows mix of clearly on-topic, off-topic, and borderline comments
- For each example, AI proposes a rating and explains why
- User confirms or corrects through chat
- AI updates samples based on feedback
- All stored as BfDb items

### 4. Grader Generation

- AI assistant: "Based on your examples, I've created a grader. Let me show you
  what it looks like..."
- Grader appears in workspace
- AI explains the criteria and asks for feedback
- Refinements happen through conversation

### 5. Evaluation

- AI assistant: "Let's test your grader! I'll run it against some test data..."
- Results appear in results tab (simple table/list view for MVP)
- AI highlights interesting cases: "I noticed some classifications that might
  need review..."

### 6. Refinement

- AI assistant guides through misclassifications
- "This comment was marked as off-topic but scored -2. Should we add it as a
  ground truth example?"
- Iterative improvement through conversation

### 7. Export

- AI assistant: "Your grader is ready! I've saved it in both Markdown and TOML
  formats. You can now use it with `aibff eval` command."

## Data Model (BfDb File-Backed)

### File Structure

```
.aibff/
├── sessions/
│   └── {session-id}/
│       └── metadata.toml
├── samples/
│   └── {sample-id}.toml
├── graders/
│   └── {grader-name}/
│       ├── grader.deck.md
│       └── grader.toml
├── evaluations/
│   └── {eval-id}/
│       ├── results.toml
│       └── results.html
└── conversations/
    └── {session-id}/
        └── messages.toml
```

### Isograph Schema

- Queries for reading BfDb items (samples, graders, results)
- Mutations for creating/updating BfDb items
- File system operations wrapped in GraphQL resolvers

## Implementation Phases

### Phase 1: Basic Infrastructure

- Create `gui` command in aibff (part of compiled binary)
- Set up embedded Deno server with Vite
- Set up BfDb file structure
- Set up Isograph with file-backed resolvers
- Integrate BfDs components
- Basic AI assistant with render methods
- Update build process to include GUI assets (see
  [Build Plan](2025-06-build-release-plan.md))

### Phase 2: YouTube Spam Demo

- Implement conversational sample collection
- AI-driven rating proposals
- Samples UI updated based on chat
- Generate grader through conversation

### Phase 3: Evaluation Integration

- AI-initiated evaluation runs
- Simple results display (table/list)
- Conversational result analysis
- AI-guided refinement process

### Phase 4: Polish

- Improve AI assistant personality and responses
- Add context awareness to conversations
- Smooth animations between chat and workspace updates
- Session persistence and history
- Consider integrating generateEvaluationHtml for richer results display

## Key Design Decisions

1. **AI-First Interface**: All interactions through the assistant
2. **Single Dimension Focus**: Each grader evaluates one aspect only
3. **Gradient Scoring**: -3 to +3 scale (0 reserved for "unable to grade")
4. **BfDb File Storage**: All data persisted as TOML/Markdown files
5. **Isograph Communication**: Type-safe GraphQL wrapping file operations
6. **Conversational UX**: Natural language drives all workflows
7. **Compiled Binary**: GUI is part of the aibff compiled binary, not a separate
   app

## Success Criteria

- Users can complete YouTube comment topic classifier example through
  conversation alone
- AI assistant provides clear, helpful guidance throughout
- Generated graders work with existing aibff eval command
- Users understand single-dimension grading through AI explanations
- Smooth, natural conversation flow from start to finish
- Users understand they can create multiple graders for different topics
