# Bolt Foundry SDK

## What are we building?

We're building an open source TypeScript SDK that transforms LLM prompt
engineering from brittle text strings into structured, semantic APIs. Think of
it as an "ORM for LLMs" - instead of concatenating strings and hoping for the
best, developers can compose prompts using a fluent builder pattern with full
TypeScript type safety.

The SDK lets developers create reusable "assistant specifications" that compile
to OpenAI chat completion payloads. These specs are composable,
version-controlled, and automatically tracked through integrated telemetry.

## Why do we need to build it?

Managing prompts as raw strings is painful. Developers face several problems:

- No type safety or IntelliSense when building prompts
- Difficult to reuse prompt components across different contexts
- Hard to version control and collaborate on prompt development
- No structured way to track which prompts are being used where
- Prompt behavior is inconsistent and hard to debug

Our SDK solves these problems by treating prompts as code, not strings. This
brings software engineering best practices to LLM development.

## Status

| Task                              | Status   | Description                                    |
| --------------------------------- | -------- | ---------------------------------------------- |
| Core spec infrastructure (v0.0.1) | Complete | Base Spec class and SpecBuilder implementation |
| Public API (v0.0.2)               | Active   | Client pattern and assistant creation working  |
| Package setup (v0.0.3)            | Planned  | npm package build and publishing               |
| Domain builders (v0.1)            | Planned  | Persona, constraints, and behavior builders    |

## Versions

| Version         | Status  | Description                                                   |
| --------------- | ------- | ------------------------------------------------------------- |
| [v0.0](V0.0.md) | Active  | Generic spec foundation with OpenAI-compatible rendering      |
| [v0.1](V0.1.md) | Planned | Domain-specific builders for personas, constraints, behaviors |
| [v0.2](V0.2.md) | Planned | CLI tool for prompt conversion                                |
| [v0.3](V0.3.md) | Planned | Testing framework and evaluation tools                        |

## Future work

| Task                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| Variable interpolation   | Support for {{variables}} in prompt templates |
| Conversation management  | Multi-turn conversation handling              |
| Additional LLM providers | Support beyond OpenAI (Anthropic, etc.)       |
| CLI tool                 | Convert existing prompts to structured specs  |
| Testing framework        | Evaluate prompt performance and consistency   |

## Measurement

| Metric                  | Purpose              | Description                          |
| ----------------------- | -------------------- | ------------------------------------ |
| npm installs            | Adoption tracking    | Monitor weekly install growth        |
| Time to first assistant | Developer experience | Should be < 5 minutes from install   |
| Prompt consistency      | Reliability          | 90%+ consistent behavior across runs |
| Bundle size             | Performance          | Keep under 50KB compressed           |
| TypeScript errors       | DX quality           | Clear, actionable error messages     |
