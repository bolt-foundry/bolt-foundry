+++
[meta]
version = "1.0"
purpose = "Evaluate the quality of commit message generation following Bolt Foundry conventions"
+++

# Commit Message Quality Grader

You are evaluating how well an AI assistant generates commit messages for the
Bolt Foundry monorepo project.

## Context

You will receive:

- **userMessage**: The changes and context provided to the assistant
- **assistantResponse**: The generated commit message(s) and any analysis

## Evaluation Criteria

### 1. Format Compliance (40% weight)

- Follows the exact Bolt Foundry commit message format
- Includes all required sections: title, body, Changes, Test plan
- Includes proper attribution footer
- Uses correct markdown formatting

### 2. Sapling Awareness (20% weight)

- Uses `bft ai status` and `bft ai diff` commands (NOT git commands)
- Does NOT attempt to stage files (Sapling doesn't use staging)
- Uses `bft commit` for the actual commit
- Demonstrates understanding of Sapling workflow

### 3. Content Quality (30% weight)

- Title is clear, concise, and descriptive
- Body explains WHAT and WHY effectively
- Changes section lists specific technical changes
- Test plan provides concrete, actionable steps
- Appropriate logical grouping of changes

### 4. Tool Usage (10% weight)

- Asks appropriate clarifying questions
- Suggests logical commit splits when appropriate
- Follows the deck's workflow instructions

## Scoring Guide

**+3 (Excellent)**

- Perfect format compliance with all sections
- Correctly uses all bft ai commands
- Clear, informative content that captures intent perfectly
- Suggests appropriate commit splits for unrelated changes
- Test plan is specific and executable

**+2 (Very Good)**

- Minor format issues but all sections present
- Uses bft commands but might miss one
- Good content quality with minor improvements possible
- Recognizes when to split commits
- Test plan is reasonable

**+1 (Good)**

- Format mostly correct with 1-2 missing elements
- Shows Sapling awareness but some confusion
- Content is adequate but could be clearer
- Basic understanding of logical grouping
- Test plan exists but generic

**0 (Neutral)**

- Format partially followed
- Mixed use of git and Sapling concepts
- Content is understandable but not ideal
- No consideration of commit splitting
- Minimal test plan

**-1 (Below Average)**

- Format significantly deviates
- Confuses git and Sapling workflows
- Content is vague or incomplete
- Poor organization of changes
- Test plan missing or inadequate

**-2 (Poor)**

- Format barely recognizable
- Attempts to use git staging commands
- Content doesn't explain changes well
- No logical grouping consideration
- No test plan

**-3 (Unacceptable)**

- Wrong format entirely
- Uses git commands exclusively
- Content is confusing or wrong
- Groups unrelated changes inappropriately
- No understanding of requirements

## Output Format

Provide your evaluation as JSON:

```json
{
  "score": <integer from -3 to +3>,
  "reasoning": {
    "format_compliance": "<evaluation of format>",
    "sapling_awareness": "<evaluation of version control usage>",
    "content_quality": "<evaluation of message content>",
    "tool_usage": "<evaluation of command usage>"
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}
```

![](./commit-grader.deck.toml)
