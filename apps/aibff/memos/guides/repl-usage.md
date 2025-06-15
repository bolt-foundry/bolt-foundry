# AIBFF REPL Usage Guide

## Overview

The AIBFF REPL (Read-Eval-Print Loop) provides an interactive, Claude-code-like
experience for building and refining LLM evaluation graders. Instead of writing
code from scratch, you can iteratively develop graders through conversation and
immediate testing.

## Getting Started

Launch the REPL by running:

```bash
aibff
```

You'll be greeted with an interactive prompt that guides you through the grader
creation process.

## Core Workflows

### 1. Creating a Grader from Examples

The REPL excels at learning from examples. You can:

1. **Paste examples** of user inputs, assistant responses, and scores
2. **Describe** what you're trying to evaluate
3. **Generate** a grader automatically
4. **Test** immediately against your examples
5. **Refine** based on results

Example interaction:

```
> I want to create a grader for professional tone in emails
> Here are some examples:

| User Input | Assistant Response | Score | Notes |
|------------|-------------------|-------|-------|
| Write a resignation email | Dear Manager, I am writing to formally notify... | 3 | Professional and clear |
| Tell boss I quit | Hey, I'm out. Found better job. | -3 | Too casual |

REPL: I'll create a grader based on your examples...
[Generates grader code]
[Shows test results]
```

### 2. Testing and Calibration

Once you have a grader, the REPL helps you:

- **Run tests** against your sample data
- **See detailed results** with scores and reasoning
- **Identify disagreements** between expected and actual scores
- **Get suggestions** for improving criteria

### 3. Iterative Refinement

The REPL supports rapid iteration:

```
> The grader is scoring informal language too harshly
REPL: I'll adjust the scoring criteria...
[Updates grader]
[Re-runs tests]
[Shows improved results]
```

### 4. Exporting Your Work

When satisfied, export your grader:

```
> Export this grader
REPL: Created:
  - grader.deck.md (your grader definition)
  - samples.jsonl (your test data)
  - Run with: aibff eval --grader grader.deck.md --input samples.jsonl
```

## REPL vs CLI Comparison

| Feature             | REPL Mode                 | CLI Mode                       |
| ------------------- | ------------------------- | ------------------------------ |
| **Best for**        | Development & exploration | Automation & CI/CD             |
| **Workflow**        | Interactive, guided       | Command-based                  |
| **Feedback**        | Immediate                 | Batch results                  |
| **Learning curve**  | Minimal                   | Requires knowledge of commands |
| **Iteration speed** | Very fast                 | Slower (manual edits)          |

## Advanced Features

### Working with Existing Graders

```
> Load grader from ./my-grader.deck.md
REPL: Loaded grader. You can now:
  - Test it with new samples
  - Refine the criteria
  - Compare against other graders
```

### Multi-Model Comparison

```
> Compare this grader across gpt-4o and claude-3-opus
REPL: Running grader with multiple models...
[Shows comparative results]
```

### Synthetic Data Generation

```
> Generate more test cases like these
REPL: Creating synthetic samples based on your patterns...
[Shows generated samples]
> Add the good ones to my test set
```

## Tips for Effective REPL Usage

1. **Start with clear examples**: The better your examples, the better the
   generated grader
2. **Include edge cases**: Don't just show perfect examples - include borderline
   cases
3. **Describe the "why"**: When providing examples, explain why they deserve
   their scores
4. **Test incrementally**: Run tests after each change to see the impact
5. **Save your work**: Export graders regularly as you refine them

## Common Commands

While the REPL is conversational, some common phrases trigger specific actions:

- `"Create a grader for..."` - Start grader generation
- `"Test this grader"` - Run evaluation
- `"Show me the results"` - Display detailed test outcomes
- `"Refine the scoring"` - Adjust grader criteria
- `"Export"` or `"Save"` - Export grader and samples
- `"Help"` - Show available commands
- `"Exit"` or `"Quit"` - Leave the REPL

## Integration with CLI

Graders created in the REPL can be used directly with the CLI:

```bash
# After exporting from REPL
aibff eval --grader exported-grader.deck.md --input test-data.jsonl
```

This allows you to develop interactively and deploy to automated workflows
seamlessly.

## Next Steps

- Try the REPL with your own evaluation scenarios
- See [Creating Your First Grader](../plans/first-grader-tutorial.md) for a
  detailed walkthrough
- Check the [Grader Best Practices](../../memos/guides/grader-best-practices.md)
  guide
- Join our community to share graders and get feedback
