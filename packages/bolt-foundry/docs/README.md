# Bolt Foundry Library Project Plan

**Status:** Active Development

## Version History

- **v0.0**: Generic spec foundation with OpenAI-compatible rendering (Current)
- **v0.1**: Domain-specific builders extending base specs (Planned)
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

- **Client API**: Use `boltFoundryClient.createAssistant()` to create named
  assistant specifications with full TypeScript type safety
- **Assistant Specs**: Define AI assistants with personas, descriptions, traits,
  and constraints using fluent builder functions
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

## Version Details

### v0.0: Generic Spec Foundation

Establishes the core architecture with a flexible, unopinionated spec system:

- Generic `Spec` class with `value` (string or Array<Spec>) and optional `name`
- Base `SpecBuilder` with `.spec()` and `.specs()` methods
- Direct OpenAI chat completion rendering
- Foundation for future domain-specific extensions

### v0.1: Domain-Specific Builders

Extends v0.0 with structured builders for common LLM patterns:

- `SpecBuilderForPersona`: Persona descriptions and traits
- `SpecBuilderForConstraints`: Rules and boundaries
- `SpecBuilderForBehaviors`: Expected actions and responses
- Type-safe composition of domain-specific specs

## Technical Architecture

The SDK uses a builder pattern with TypeScript's type system to ensure valid
prompt construction:

```typescript
import { boltFoundryClient } from "@bolt-foundry/bolt-foundry";

const spec = boltFoundryClient.createAssistant("coding-helper", (b) => {
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

const payload = spec.render({
  model: "gpt-4",
  temperature: 0.7,
  variables: { userName: "Alice", language: "Python" },
  telemetry: { apiKey: "...", sessionId: "..." },
});
```

## Development Approach

The SDK will be developed iteratively with continuous user feedback:

### v0.0 Versions

- **v0.0.1**: Core spec and builder implementation with TypeScript types
- **v0.0.2**: Generic OpenAI-compatible rendering and client API
- **v0.0.3**: Package setup and alpha release

### v0.1 Versions

- **v0.1.0**: SpecBuilderForPersona with descriptions and traits
- **v0.1.1**: SpecBuilderForConstraints with rules and boundaries
- **v0.1.2**: SpecBuilderForBehaviors with expected actions
- **v0.1.3**: Full integration with type-safe composition

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
