# Early content marketing plan: Launch week

## Task tracking

| Task                                           | Done | Assignee     |
| ---------------------------------------------- | ---- | ------------ |
| Prepare and publish documentation on website   | [ ]  | Randall      |
| Build eval framework MVP (CLI tool)            | [ ]  | Josh         |
| Write customer case study with approved quotes | [ ]  | Dan + Justin |
| Create social posts for launch                 | [ ]  | Dan + Justin |

## Overview

We're launching Bolt Foundry on Monday to capitalize on the AI World's Fair
happening next week in San Francisco. We have a validated case study (20% to
100% XML reliability in 30 minutes) and a clear product focus: an open-source
eval framework for LLMs.

## Strategic positioning

- **Hook**: Structured prompt engineering philosophy (the "cone metaphor")
- **Product**: Open-source eval framework for testing LLM reliability
- **Proof**: Real case study demonstrating immediate, dramatic improvements

## Launch priorities (in order)

### 1. Documentation (status: ready)

- Publish key docs to website for easy discovery
- Already public on GitHub, just need visibility

### 2. Eval framework MVP

**Core features:**

- Deno-compiled binary within @bolt-foundry/bolt-foundry package
- Command structure:
  `bf-eval run --input messages.json --judges judges.js --iterations 5`
- Accepts OpenAI message format
- Supports parallel eval execution
- Judges defined using Bolt Foundry spec format (optional for prompts)
- Default 5 iterations per eval (configurable with --iterations flag)

**Key design decisions:**

- Judges use our spec format for consistency and clarity
- Main prompts don't need to use our format (low barrier to entry)
- Focus on JSON/XML parsing reliability as primary use case
- Iterations run in parallel for speed
- Output: summary of issues found across all iterations

### 3. Customer case study

**Key points:**

- Company struggling with XML citation generation
- 20% success rate � 100% valid XML in 30 minutes
- Simple technique: moving examples to user/assistant turns
- Sets up need for proper evals to tune content quality

**Required:**

- Get approval for quotes from transcript
- Highlight the simplicity of the fix
- Connect to broader reliability challenges

### 4. Social post (targeting prompt engineering communities)

**Approach:**

- Lead with customer case study
- Explain the cone philosophy
- Introduce eval framework as the solution
- No direct website links (community contribution focus)
- Engage actively in comments

## Key messages

### Primary: "How to get consistent XML/JSON output from LLMs"

- XML parsing that works 100% of the time instead of 20%
- Case study: specific technique that fixed XML parsing
- Reproducible approach you can apply today

### Secondary: "Testing LLM outputs with structured evals"

- Structure gets you consistent output format
- Evals verify output quality
- Open-source framework for building eval judges

### The cone metaphor

Every token either:

- Narrows the cone (increases focus/reliability)
- Keeps it straight (maintains current trajectory)
- Widens the cone (introduces uncertainty)

Goal: Guide attention consistently to a predictable output space

## Open questions

1. Should we create a simple web demo for the eval tool?
2. Do we need video content for launch (walkthrough, demo)?

## Next steps

1. Finalize eval tool CLI interface design
2. Get customer approval for case study quotes
3. Draft social posts with multiple title options
4. Prepare Randall's talking points for SF
5. Set up measurement tracking
