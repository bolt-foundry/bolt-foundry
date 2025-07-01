# Bolt Foundry SDK

## What are we building?

We're building an open source TypeScript SDK that transforms LLM prompt
engineering from brittle text strings into structured, composable decks with
examples and specifications. Instead of concatenating strings and hoping for the
best, developers can compose prompts using a fluent builder pattern with full
TypeScript type safety.

The SDK lets developers create reusable "deck specifications" that compile to
OpenAI chat completion payloads. These decks are composable, version-controlled,
and automatically tracked through integrated telemetry.

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

| Task                            | Status   | Description                                    |
| ------------------------------- | -------- | ---------------------------------------------- |
| Core card infrastructure (v0.0) | Complete | Base Card class and CardBuilder implementation |
| Deck system & context (v0.1)    | Complete | Simplified API with samples and variables      |
| Enhanced analytics (v0.2)       | Complete | PostHog integration and cost tracking          |
| Package setup                   | Deferred | npm package build and publishing               |

## Versions

| Version                                   | Status   | Description                                                   |
| ----------------------------------------- | -------- | ------------------------------------------------------------- |
| [v0.0](/404.md)                           | Complete | Foundation with immutable builders and basic deck creation    |
| [v0.1](../../../../examples/docs/V0.1.md) | Complete | Simplified deck system with samples and context variables     |
| [v0.2](/404.md)                           | Complete | Enhanced analytics with PostHog integration and cost tracking |

## Planned Changes

- [Samples API Refactor](/404.md) - Unifying sample types and simplifying from
  builder pattern to array pattern (next patch version)

## Potential future directions

| Area                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| Variable interpolation   | Support for {{variables}} in prompt templates |
| Conversation management  | Multi-turn conversation handling              |
| Additional LLM providers | Support beyond OpenAI (Anthropic, etc.)       |
| CLI tool                 | Convert existing prompts to structured specs  |
| Testing framework        | Evaluate prompt performance and consistency   |

## Measurement

| Metric             | Purpose              | Description                          |
| ------------------ | -------------------- | ------------------------------------ |
| npm installs       | Adoption tracking    | Monitor weekly install growth        |
| Time to first card | Developer experience | Should be < 5 minutes from install   |
| Prompt consistency | Reliability          | 90%+ consistent behavior across runs |
| Bundle size        | Performance          | Keep under 50KB compressed           |
| TypeScript errors  | DX quality           | Clear, actionable error messages     |

# Bolt Foundry Library Project Plan

**Status:** Active Development

## Version History

- **v0.0**: Foundation with immutable builders and basic deck creation
- **v0.1**: Simplified deck system with samples and context variables
- **v0.2**: Enhanced analytics with PostHog integration and cost tracking
  (Current)

## Project Purpose

Create an open source TypeScript SDK that transforms LLM prompt engineering from
brittle text strings into structured, semantic APIs. The SDK provides a fluent
builder pattern for composing prompts that compile to OpenAI chat completion
payloads while automatically tracking usage through integrated telemetry.

## Project Goals

- **Developer Experience**: Provide a TypeScript-first API with compile-time
  safety and IntelliSense support
- **Immediate Value**: Output ready-to-use OpenAI chat completion payloads
  without additional transformation
- **Seamless Telemetry**: Automatically track structured prompt usage when
  integrated with existing Bolt Foundry telemetry
- **Ecosystem Standards**: Follow TypeScript/JavaScript best practices to
  maximize adoption

## User Personas

- **Individual Developer**: Frustrated with managing prompt strings across their
  LLM application, wants type safety and reusability
- **LLM Application Team**: Needs to collaborate on prompt development with
  version control and clear structure
- **Early Adopter**: Excited about structured prompts, willing to try alpha
  software and provide feedback

## Features

### Core Features

- **Simple API**: Use `createDeck()` to create named decks with TypeScript type
  safety
- **Decks**: Define AI behavior through hierarchical cards with optional samples
- **Sample System**: Rate examples from -3 (bad) to +3 (good) to guide behavior
- **TypeScript Safety**: Compile-time errors for invalid method chains
- **Flexible Structure**: Organize specs however makes sense for your use case

### Integration Features

- **Telemetry Integration**: Automatically track structured prompt usage through
  existing connectBoltFoundry wrapper
- **Clean Exports**: Standard npm package exports following ecosystem
  conventions
- **Zero Dependencies**: Minimal runtime dependencies for maximum compatibility

## Technical Architecture

The SDK uses a builder pattern with TypeScript's type system to ensure valid
prompt construction:

```typescript
import { createDeck } from "@bolt-foundry/builders";

const codingHelper = createDeck(
  "coding-helper",
  (b) =>
    b.card("persona", (c) =>
      c.spec("You are helping users learn programming")
        .spec("Explains code clearly", {
          samples: [
            {
              messages: [
                { role: "user", content: "Can you explain this function?" },
                {
                  role: "assistant",
                  content: "Here's how this function works step by step...",
                },
              ],
              score: 3,
            },
            {
              messages: [
                { role: "user", content: "Can you explain this function?" },
                { role: "assistant", content: "It just works" },
              ],
              score: -3,
            },
          ],
        })
        .spec("Suggests best practices"))
      .card("security", (c) =>
        c.spec("Never expose secrets")
          .spec("Follow OWASP guidelines")),
);

// The deck can be serialized to JSON or used with LLM APIs
const deckData = codingHelper;
```

## Development Approach

The SDK is developed iteratively with continuous user feedback.

### Before starting

- Vision documents approved
- Technical design reviewed
- npm package namespace secured

### When it's ready

- All unit tests passing
- Documentation complete
- Published to npm as alpha version
- 5+ internal users successfully integrated

## Success Metrics

### User Outcomes

- **Developer Time Saved**: 50% reduction in prompt debugging time
- **Prompt Reliability**: 90%+ consistency in prompt behavior across runs
- **Adoption Rate**: 100+ developers using the SDK within first month of release

### Technical Metrics

- **npm installs**: Track installation growth as primary adoption metric
- **GitHub stars**: Measure developer interest and engagement
- **Import tracking**: Monitor "from '@bolt-foundry/bolt-foundry'" in public
  repositories
- **Telemetry events**: Count structured prompts rendered through the SDK

## Risks and Mitigation

- **Risk**: Developers resist moving from simple strings to structured API
  - **Mitigation**: Provide clear migration examples and emphasize benefits
    (type safety, reusability)

- **Risk**: TypeScript complexity creates poor developer experience
  - **Mitigation**: Extensive IntelliSense hints, clear error messages,
    comprehensive examples

- **Risk**: OpenAI API changes break compatibility
  - **Mitigation**: Version lock OpenAI types, plan for adapter pattern in
    future versions
