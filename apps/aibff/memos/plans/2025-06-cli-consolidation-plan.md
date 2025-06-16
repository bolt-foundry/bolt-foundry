# CLI Consolidation Implementation Plan

## Overview

This plan outlines the consolidation of three separate CLI tools (bff, bff-eval,
and aibff) into a single, standardized aibff command. The consolidation will
improve maintainability, provide consistent argument parsing and output
handling, and establish clear boundaries between AI-safe commands and internal
team tools.

The approach prioritizes learning through prototyping within aibff before
extracting reusable patterns into shared packages.

## Goals

| Goal                   | Description                                           | Success Criteria                           |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------ |
| Unified CLI            | Consolidate bff, bff-eval, and aibff into single tool | All functionality accessible through aibff |
| Standardized Arguments | Consistent argument parsing across all commands       | Single parsing library/pattern used        |
| Unix Compliance        | Proper stdout/stderr usage and exit codes             | Commands work well in pipes and scripts    |
| Clear Namespacing      | Separate internal tools from AI-safe commands         | `aibff internal` namespace implemented     |

## Anti-Goals

| Anti-Goal                         | Reason                                        |
| --------------------------------- | --------------------------------------------- |
| Immediate extraction to packages  | Need to discover patterns through usage first |
| Breaking changes to eval commands | Maintain compatibility during transition      |
| Complex CLI framework             | Keep it simple and Deno-native where possible |
| Overly generic solution           | Focus on our specific needs                   |

## Technical Approach

Start with a spike implementation directly in aibff to discover what patterns
work well for our needs. This includes experimenting with argument parsing
approaches, output handling patterns, and command structure organization.

Once patterns are proven, we'll extract common functionality into shared
packages. The migration of existing commands will happen gradually, starting
with less critical commands to validate the approach.

## Components

| Status | Component           | Purpose                                    |
| ------ | ------------------- | ------------------------------------------ |
| [ ]    | CLI argument parser | Standardized parsing with help generation  |
| [ ]    | Output handlers     | stdout/stderr helpers with Unix compliance |
| [ ]    | Command router      | Dispatch to eval/internal namespaces       |
| [ ]    | Error handling      | Consistent error output and exit codes     |
| [ ]    | Help system         | Auto-generated help for all commands       |

## Technical Decisions

| Decision                               | Reasoning                         | Alternatives Considered      |
| -------------------------------------- | --------------------------------- | ---------------------------- |
| Prototype in aibff first               | Learn through implementation      | Immediate package extraction |
| Keep existing file structure initially | Minimize disruption during spike  | Full restructure upfront     |
| Use `internal` namespace               | Clear separation from AI commands | `team`, `admin`, `private`   |

## Next Steps

| Question                   | How to Explore                                 |
| -------------------------- | ---------------------------------------------- |
| Best arg parsing approach? | Try Deno's parseArgs vs small library          |
| Output handling patterns?  | Test with piping, redirects, and TTY detection |
| Command structure?         | Implement 1-2 commands as proof of concept     |
| Logger integration?        | Experiment with CLI-specific logger methods    |

## Roadmap

### Phase 1: Prototype (Current)

- Implement basic command routing in aibff
- Experiment with argument parsing patterns
- Create output handling helpers
- Build help generation system

### Phase 2: Pattern Extraction

- Extract proven patterns to `@packages/cli-utils/`
- Standardize error handling across commands
- Document CLI conventions

### Phase 3: Migration

- Migrate bff-eval commands to `aibff eval`
- Migrate bff commands to `aibff internal`
- Deprecate and unpublish old packages

### Phase 4: Enhancement

- Add structured output formats (JSON, etc.)
- Implement progress indicators
- Add command aliasing and shortcuts
