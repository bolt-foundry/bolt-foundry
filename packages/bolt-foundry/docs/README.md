# Bolt Foundry SDK

## What are we building?

We're building an open source TypeScript SDK that transforms LLM prompt
engineering from brittle text strings into structured, composable cards with
examples and specifications. Instead of concatenating strings and hoping for the
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

# Bolt Foundry Library Project Plan

**Status:** Active Development

## Version History

- **v0.1**: TypeScript SDK with fluent builder API (Current)
- **v0.2**: CLI tool for prompt conversion (Planned)
- **v0.3**: Testing framework and evaluation tools (Planned)

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

- **Client API**: Use `boltFoundryClient.createCard()` to create named cards
  with full TypeScript type safety
- **Cards**: Define AI cards with personas, descriptions, traits, and
  constraints using fluent builder functions
- **OpenAI Integration**: Render directly to OpenAI chat completions format with
  configurable model parameters
- **TypeScript Safety**: Compile-time errors for invalid method chains, runtime
  validation only at render

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
import { boltFoundryClient } from "@bolt-foundry/bolt-foundry";

const card = boltFoundryClient.createCard("coding-helper", (b) => {
  return b
    .persona((p) =>
      p
        .description(
          "You are helping {{userName}} learn {{language}} programming",
        )
        .trait("Explains code clearly")
        .trait("Suggests best practices")
    )
    .constraints("security", (c) =>
      c
        .constraint("Never expose secrets")
        .constraint("Follow OWASP guidelines"));
});

const payload = card.render({
  model: "gpt-4",
  temperature: 0.7,
  variables: { userName: "Alice", language: "Python" },
  telemetry: { apiKey: "...", sessionId: "..." },
});
```

## Development Approach

The SDK will be developed iteratively with continuous user feedback:

### v0.1 Development Phases

- **Phase 1**: Core builder implementation with TypeScript types
- **Phase 2**: Client API with createCard() method and nested builders for
  personas, description, traits, constraints
- **Phase 3**: OpenAI render method with model parameters
- **Phase 4**: Telemetry integration and package publishing setup

### Entry Criteria

- Vision documents approved
- Technical design reviewed
- npm package namespace secured

### Exit Criteria

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

## Next Steps

1. Create detailed v0.1 implementation plan with technical specifications
2. Set up package build pipeline with Deno-to-npm compilation
3. Implement core builder with TypeScript type system
4. Write comprehensive tests and documentation
