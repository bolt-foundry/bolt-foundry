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

The key innovation is that users define their own evaluation dimension through
natural conversation, rather than being limited to predefined categories.

## MVP: YouTube Comment Topic Classifier

The initial implementation focuses on a complete end-to-end example of building
topic classifiers for YouTube comments. The AI provides example dimensions, but
users define their own specific dimension to evaluate (e.g., "Is this
constructive feedback?", "Is this asking for help?", "Is this expressing
appreciation?").

## Technical Architecture

### Stack

- **Backend**: Deno server launched via `aibff gui` command (alias: `aibff web`)
  - Note: aibff is distributed as a compiled binary (see
    [Release Guide](../guides/release-guide.md))
  - The GUI command will be part of the compiled binary, not a separate script
- **Frontend**: Vite + Deno with BfDs components
  - This Vite-based setup will serve as the foundation for apps/boltFoundry
  - Architecture decisions here should consider future boltFoundry requirements
  - PostHog integration for analytics and user behavior tracking
- **Storage**: AibffNode-based classes persisted as TOML/Markdown files on disk
- **GraphQL**: Isolated Isograph schema specific to aibff GUI
- **AI Integration**: Uses aibff's existing render command to power AI
  conversations
  - Each AI response is generated using `aibff render` with appropriate decks
  - Ensures consistency between GUI and CLI experiences

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
- System checks for OpenRouter API key:
  - First checks environment variables
  - Then checks `.env.local` file next to aibff binary
  - If not found, AI assistant prompts: "To help you build graders, I'll need
    access to AI models. Please enter your OpenRouter API key:"
  - Key is saved to `.env.local` for future sessions
- AI assistant greets user: "Hi! I'm here to help you build a grader for your
  classification task. Let's start with an example - we'll build a topic
  classifier for YouTube comments. This will show you how graders work, and then
  you can apply the same approach to your own use case."
- All subsequent interactions happen through the AI assistant

### 2. Dimension Definition

- AI assistant explains: "Each grader evaluates one specific dimension. For
  YouTube comments, here are some examples:
  - 'Is this comment about the video content?'
  - 'Is this about the creator?'
  - 'Is this technical feedback?'
  - 'Is this spam or promotional?'

  What dimension would you like your grader to evaluate?"
- User types their chosen dimension (e.g., "Is this comment constructive
  criticism?")
- AI confirms: "Great! We'll build a grader to evaluate: '[user's dimension]'.
  Let me help you collect some example comments to train it."

### 3. Sample Collection

- AI assistant provides example YouTube comments: "Let me show you some example
  YouTube comments. I'll rate each one based on your dimension '[user's
  dimension]', and you can tell me if you agree or would rate it differently."
- Shows mix of clearly on-topic, off-topic, and borderline comments
- For each example, AI proposes a rating and explains why
- User confirms or corrects through chat
- AI updates samples based on feedback
- All stored as AibffSample instances (extends AibffNode)

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

### 7. Completion

- AI assistant: "Your grader is ready! It's been saved to the
  'youtube-comment-classification' folder. You can now use it with the
  `aibff
  eval` command from that directory."
- All data is already persisted throughout the process - no explicit export
  needed

## Data Model

### File Structure

```
{scenario-name}/           # e.g., youtube-comment-classification/
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

### Node Classes

- **AibffNode**: Base class extending GraphQLNode for all aibff-specific nodes
  - Handles common functionality like file persistence, ID generation
  - Provides shared methods for TOML/Markdown serialization

Concrete classes extending AibffNode:

- **AibffSample**: Individual training samples with text, expected
  classification, and rating
- **AibffGrader**: Grader definitions with criteria and prompt templates
- **AibffEvaluation**: Evaluation results linking graders to test runs
- **AibffSession**: Session metadata for tracking user interactions
- **AibffConversation**: Chat messages between user and AI assistant

### Isograph Schema

- **Isolated Schema**: Separate Isograph instance for aibff GUI, not shared with
  main bfDb
- **Location**: Built within the aibff GUI folder structure (e.g.,
  `apps/aibff/gui/isograph/`)
- **Queries**: Reading AibffNode instances (AibffSample, AibffGrader,
  AibffEvaluation)
- **Mutations**: Creating/updating AibffNode instances
- **Resolvers**: File system operations for TOML/Markdown persistence

## Implementation Phases

### Phase 1: Basic Infrastructure

- Create `gui` command in aibff (part of compiled binary)
- Set up embedded Deno server with Vite
- Create AibffNode base class extending GraphQLNode
- Create concrete node classes (AibffSample, AibffGrader, etc.)
- Set up isolated Isograph instance in aibff GUI folder
- Integrate BfDs components
- Set up PostHog analytics with basic event tracking
- Basic AI assistant powered by aibff render command
- Update build process to include GUI assets (see
  [Build Plan](2025-06-build-release-plan.md))

### Phase 2: Dynamic Dimension Demo

- Implement conversational dimension selection
- AI-driven rating proposals based on user's chosen dimension
- Samples UI updated based on chat
- Generate grader through conversation for any user-defined dimension

### Phase 3: Evaluation Integration

- AI-initiated evaluation runs
- Simple results display (table/list)
- Conversational result analysis
- AI-guided refinement process

### Phase 4: Custom Non-YouTube Grader

- Support graders for any text classification task beyond YouTube comments
- AI adapts example generation to user's domain (e.g., support tickets, product
  reviews, chat messages)
- Domain-specific sample collection workflows
- Flexible grader templates for different use cases

### Phase 5: Custom Eval

- Support custom evaluation datasets beyond built-in examples
- Upload or paste custom test data for evaluation
- Batch evaluation workflows
- Custom evaluation metrics and reporting
- Integration with generateEvaluationHtml for rich results visualization
- **Meta use case**: Use aibff GUI to build graders for evaluating aibff GUI
  itself
  - First custom eval integration will be self-referential
  - Helps validate the tool's capabilities while improving it

## Key Design Decisions

1. **AI-First Interface**: All interactions through the assistant
2. **Single Dimension Focus**: Each grader evaluates one aspect only
3. **Gradient Scoring**: -3 to +3 scale (0 reserved for "unable to grade")
4. **AibffNode Storage**: All data persisted as TOML/Markdown files via
   AibffNode base class and its subclasses
5. **Isolated Isograph**: Separate GraphQL schema for aibff GUI independence
6. **Conversational UX**: Natural language drives all workflows
7. **Compiled Binary**: GUI is part of the aibff compiled binary, not a separate
   app
8. **Analytics**: PostHog integration for tracking user interactions and grader
   creation patterns
9. **Privacy**: Telemetry collection opt-out mechanism (implementation details
   TBD)

## Success Criteria

- Users can complete YouTube comment topic classifier example through
  conversation alone
- AI assistant provides clear, helpful guidance throughout
- Generated graders work with existing aibff eval command
- All data persisted incrementally throughout the workflow (no export step)
- Users understand single-dimension grading through AI explanations
- Smooth, natural conversation flow from start to finish
- Users understand they can create multiple graders for different topics
- aibff GUI can be used to build graders that evaluate aibff GUI's own
  performance
