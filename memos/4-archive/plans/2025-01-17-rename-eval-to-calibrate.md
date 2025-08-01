# Implementation Plan: Rename `aibff eval` to `aibff calibrate` and Create New `aibff eval`

## Overview

This implementation refactors the current `aibff eval` command by renaming it to
`aibff calibrate` (focused on calibrating graders with embedded samples) and
creates a new `aibff eval` command for grading external samples. The calibrate
command will only accept TOML inputs, while the new eval command will support
JSONL files in OpenAI's messages array format.

## Goals

| Goal                     | Description                                                            | Success Criteria                                        |
| ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| Rename eval to calibrate | Current eval command becomes calibrate, focusing on grader calibration | `aibff calibrate` works with embedded TOML samples only |
| Create new eval command  | New command for evaluating external samples                            | `aibff eval` accepts JSONL files with OpenAI format     |
| Maintain compatibility   | Ensure existing functionality remains intact                           | All existing tests pass, output format unchanged        |
| Clear separation         | Distinct use cases for calibrate vs eval                               | No overlap in input formats between commands            |

## Anti-Goals

| Anti-Goal                        | Reason                                 |
| -------------------------------- | -------------------------------------- |
| Breaking existing workflows      | Users rely on current functionality    |
| Changing output formats          | Consistency in evaluation results      |
| Supporting JSONL in calibrate    | Calibrate is for embedded samples only |
| Running embedded samples in eval | Eval is for external samples only      |

## Technical Approach

The refactoring involves:

1. Duplicating the current eval command as calibrate
2. Modifying calibrate to reject JSONL inputs
3. Creating a new eval command that only accepts JSONL
4. Updating the eval.ts core logic to handle OpenAI message format
5. Updating command registry and documentation

## Components

| Status | Component                             | Purpose                         |
| ------ | ------------------------------------- | ------------------------------- |
| [ ]    | apps/aibff/commands/calibrate.ts      | Renamed eval command, TOML-only |
| [ ]    | apps/aibff/commands/eval.ts           | New eval command, JSONL-only    |
| [ ]    | apps/aibff/commands/index.ts          | Update command registry         |
| [ ]    | packages/bolt-foundry/evals/eval.ts   | Support OpenAI message format   |
| [ ]    | apps/aibff/commands/calibrate.test.ts | Tests for calibrate command     |
| [ ]    | apps/aibff/commands/eval.test.ts      | Tests for new eval command      |

## Technical Decisions

| Decision                      | Reasoning                             | Alternatives Considered       |
| ----------------------------- | ------------------------------------- | ----------------------------- |
| Keep shared eval logic        | Avoid code duplication                | Separate implementations      |
| JSONL uses OpenAI format      | Industry standard for LLM evaluation  | Custom format                 |
| Maintain same output format   | Consistency across commands           | Different outputs per command |
| Update runEval to handle both | Single source of truth for evaluation | Separate evaluation functions |

## Next Steps

| Question                      | How to Explore                  |
| ----------------------------- | ------------------------------- |
| Test file structure?          | Search for existing eval tests  |
| OpenAI message format spec?   | Review OpenAI API documentation |
| Documentation updates needed? | Find existing command docs      |

## Implementation Order

1. Copy eval.ts to calibrate.ts
2. Update calibrate to reject JSONL
3. Update eval.ts to only accept JSONL
4. Modify runEval to parse OpenAI format
5. Update command registry
6. Create/update tests
7. Update documentation
