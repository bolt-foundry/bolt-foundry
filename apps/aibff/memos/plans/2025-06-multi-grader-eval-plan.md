# Implementation Plan: Multi-Grader Evaluation with Progress Tracking

## Overview

This work enhances the aibff eval command to support evaluating multiple graders
in a single session and introduces persistent progress tracking through a
TOML-based result file. This enables systematic comparison of grader variations
and tracking of grader performance over time, helping teams identify which
graders are improving and which need refinement.

The implementation consolidates eval functionality into a single command
interface, removes duplicate code, and introduces a structured output format
that accumulates results across evaluation runs.

## Goals

| Goal                 | Description                                       | Success Criteria                                                           |
| -------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Multi-grader support | Enable evaluating multiple graders in one command | Can run `aibff eval grader1.deck.md grader2.deck.md --output results.toml` |
| Progress tracking    | Track grader performance over time                | Results accumulate in TOML file with timestamps                            |
| Performance metrics  | Calculate average distance to ground truth        | Each grader section shows average distance metric                          |
| Clean architecture   | Single eval implementation                        | eval.ts deleted, only commands/eval.ts remains                             |

## Anti-Goals

| Anti-Goal                          | Reason                                                   |
| ---------------------------------- | -------------------------------------------------------- |
| Backward compatibility with stdout | Moving to explicit file-based output for better tracking |
| In-place file updates              | Creating timestamped files prevents data loss            |
| Complex statistical analysis       | Keep metrics simple (average distance) for now           |

## Technical Approach

The eval command will be updated to accept multiple grader file paths and a
required `--output` flag. Each grader will be evaluated sequentially using the
existing runEval function. Results will be structured in TOML format with
sections for each grader containing metadata and detailed results.

When an output file already exists, a new file will be created with a Unix
timestamp suffix to preserve historical data. The TOML structure uses nested
sections (`[graderResults.graderName]`) to organize results by grader, making it
easy to compare performance across different grader implementations.

## Components

| Status | Component                    | Purpose                                            |
| ------ | ---------------------------- | -------------------------------------------------- |
| [x]    | Multi-grader command parsing | Parse multiple grader paths and --output flag      |
| [x]    | Output file handling         | Check existence and create timestamped versions    |
| [x]    | TOML result structure        | Generate graderResults sections with metadata      |
| [x]    | Average distance calculation | Compute mean absolute difference from ground truth |
| [x]    | Progress reporting           | Update stderr messages for multi-grader runs       |

## Technical Decisions

| Decision                     | Reasoning                                               | Alternatives Considered                         |
| ---------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| Required --output flag       | Explicit output control, no accidental stdout pollution | Optional flag with default filename             |
| Timestamped file creation    | Preserves all historical data                           | Append mode (risk of corruption)                |
| TOML format                  | Human-readable, supports nested structures              | JSON (less readable), YAML (parsing complexity) |
| Sequential grader evaluation | Simpler implementation, clear progress                  | Parallel evaluation (complexity)                |

## Next Steps

| Question                     | How to Explore                                    |
| ---------------------------- | ------------------------------------------------- |
| Test data location           | Find existing test fixtures for eval command      |
| TOML library usage           | Check how other files use @std/toml               |
| Error handling patterns      | Review existing command error handling            |
| runEval modifications needed | Analyze if runEval needs changes for multi-grader |

## Implementation Order (TDD)

1. ✅ Write tests for multi-grader command parsing
2. ✅ Write tests for output file handling with timestamps
3. ✅ Write tests for TOML structure generation
4. ✅ Write tests for average distance calculation
5. ✅ Implement command parsing changes
6. ✅ Implement output file logic
7. ✅ Implement TOML generation
8. ✅ Delete eval.ts file
9. ✅ Update command help text

## Example Output Structure

```toml
[graderResults.tone-grader]
grader = "graders/tone-grader.deck.md"
model = "anthropic/claude-3.5-sonnet"
timestamp = "2024-01-15T10:30:00Z"
samples = 10
average_distance = 0.5

[[graderResults.tone-grader.results]]
id = "sample-1"
grader_score = 2
truth_score = 3
notes = "Slightly formal tone detected"

[[graderResults.tone-grader.results]]
id = "sample-2"
grader_score = 1
truth_score = 1
notes = "Correctly identified casual tone"

[graderResults.formality-grader]
grader = "graders/formality-grader.deck.md"
model = "anthropic/claude-3.5-sonnet"
timestamp = "2024-01-15T10:30:05Z"
samples = 10
average_distance = 0.3

[[graderResults.formality-grader.results]]
id = "sample-1"
grader_score = 1
truth_score = 1
notes = "Correctly identified informal tone"
```
