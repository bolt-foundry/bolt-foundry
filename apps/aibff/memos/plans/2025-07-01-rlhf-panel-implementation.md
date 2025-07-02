# RLHF Panel Implementation Plan

## Overview

The RLHF (Reinforcement Learning from Human Feedback) panel enables users to
provide feedback on AI-generated outputs from actor decks. This feedback is
collected to create ground truth data for improving grader performance. The
panel focuses on a single evaluation dimension (initially accuracy) using the
standard aibff gradient scale.

## Core Concept

Users evaluate actor deck outputs on a gradient scale:

- **+3**: Highly accurate
- **+2**: Mostly accurate
- **+1**: Somewhat accurate
- **0**: Unable to evaluate
- **-1**: Somewhat inaccurate
- **-2**: Mostly inaccurate
- **-3**: Highly inaccurate

Each rating must be accompanied by a text explanation justifying the score.

## Technical Architecture

### Integration Points

- **Location**: Right panel tab in aibff GUI (replacing "Coming soon"
  placeholder)
- **Data Storage**: Feedback stored in existing `ground-truth.deck.toml` files
  within conversation directories
- **Input Source**: Actor deck outputs (single assistant messages)
- **UI Framework**: React components using BfDs design system

### Data Flow

1. Actor deck runs generate outputs → saved to `output-samples.jsonl`
2. RLHF panel reads unrated outputs from `output-samples.jsonl`
3. User provides numerical rating (-3 to +3) and text explanation
4. Feedback stored in `ground-truth.deck.toml` in conversation directory
5. Rated items disappear from RLHF panel (no longer shown as needing rating)
6. Ground truth data available for future grader training/evaluation

## User Workflow

### 1. Output Sample Display

- RLHF panel displays all unrated outputs from `output-samples.jsonl`
- Each list item shows the assistant response with rating interface
- No expansion/selection needed - all rating tools visible per item

### 2. Feedback Collection

- Rating selector: Buttons or slider for -3 to +3 scale
- Rating labels: "Highly accurate" to "Highly inaccurate"
- Text area: Required explanation field
- Submit button: Saves feedback to ground truth file

### 3. Item Removal

- Rated items disappear from list immediately after save
- List becomes empty when all outputs are rated
- No need to view/edit previous ratings in this interface

### 4. Ground Truth Integration

- Feedback automatically formatted for `ground-truth.deck.toml`
- Compatible with existing aibff evaluation workflows
- Preserves message context and metadata

## Implementation Details

### UI Components

#### `RLHFPanel.tsx`

- Main panel component replacing placeholder
- Loads unrated outputs from `output-samples.jsonl`
- Manages list of evaluation items

#### `OutputSampleItem.tsx`

- Individual list item component
- Shows assistant response text
- Includes rating buttons (-3 to +3)
- Text area for explanation
- Save button for feedback submission
- Removes item from list after successful save

### Data Model

#### Ground Truth TOML Format (OpenAI Completions API Style)

```toml
[samples.rlhf-sample-001]
score = 2
description = "Response was mostly accurate but missed one key detail about..."

[[samples.rlhf-sample-001.messages]]
role = "user"
content = """Original user input that generated the actor deck response"""

[[samples.rlhf-sample-001.messages]]
role = "assistant"
content = """Actor deck output being evaluated for accuracy"""

[samples.rlhf-sample-002]
score = -1
description = "Contains factual error about..."

[[samples.rlhf-sample-002.messages]]
role = "user" 
content = """User input"""

[[samples.rlhf-sample-002.messages]]
role = "assistant"
content = """Actor deck response with accuracy issues"""
```

#### Sample Identification

- Samples identified by unique names (e.g., "rlhf-sample-001")
- Each sample contains the full conversation context (user input + assistant
  response)
- Links feedback to specific actor deck outputs through message pairs
- Preserves full conversation context for training

### GraphQL Integration

- **Update AibffConversation**: Extend existing conversation class to include
  ground truth samples
- **Single Mutation**: `submitFeedback` - Save rating and explanation to
  ground-truth.deck.toml
- **No Additional Queries**: Use existing conversation data loading mechanisms

## File Structure

```
aibff-conversations/conv-xyz/
├── conversation.md           # Chat history
├── actor-deck.md            # Actor configuration
├── grader-deck.md           # Grader configuration  
├── input-samples.jsonl      # Input data for actor deck
├── output-samples.jsonl     # ← Actor deck outputs (OpenAI API format)
├── ground-truth.deck.toml   # ← RLHF feedback stored here
└── notes.md                 # User notes
```

## Implementation Phases

### Phase 1: Core RLHF Interface

- Replace FileViewer RLHF tab placeholder
- Load unrated outputs from `output-samples.jsonl`
- Create `OutputSampleItem` components with rating interface
- Implement rating buttons (-3 to +3) and explanation text area
- Basic feedback submission to `ground-truth.deck.toml`

### Phase 2: Data Persistence & List Management

- Ground truth TOML integration with OpenAI format
- Item removal after successful rating
- Feedback storage linking to original output samples
- `submitFeedback` GraphQL mutation

## Key Design Decisions

1. **Single Dimension Focus**: Start with accuracy only, expand later
2. **Required Explanations**: All ratings must include text justification
3. **Existing Storage**: Use ground-truth.deck.toml, no new file formats
4. **Complete Context**: Store full OpenAI API call data in
   `output-samples.jsonl`
5. **Disappearing Items**: Rated items removed from list (no editing needed)
6. **Integration**: Seamless integration with existing aibff workflows

## Success Criteria

- Users can rate actor deck outputs from `output-samples.jsonl` on accuracy (-3
  to +3 scale)
- All ratings include explanatory text
- Feedback persists in ground-truth.deck.toml format with full OpenAI API
  context
- Rated items disappear from list immediately after save
- Ground truth data integrates with aibff evaluation commands
- Interface is intuitive and efficient for rapid feedback collection
- No data loss during feedback collection process
