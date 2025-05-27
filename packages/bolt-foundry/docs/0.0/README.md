# Bolt Foundry SDK v0.0 Project Overview

**Status:** Active Development (v0.0.2.2 in progress)

## Project Scope

Version 0.0 establishes the foundational architecture and basic functionality
for the Bolt Foundry SDK. This version focuses on creating a minimal viable
product that demonstrates the core concept of structured card specifications.

## Key Features

### Core Infrastructure (v0.0.2.1) ✅

- **Spec System**: Base `Spec` class with flexible `value` (string or
  Array<Spec>) and optional `name` properties
- **SpecBuilder**: Immutable builder with `.spec()` for individual values,
  `.specs()` for groups, and `.getSpecs()` to retrieve specs
- **Type Safety**: TypeScript-first API with compile-time safety

### Public API (v0.0.2.2) 🔄

- **Client Pattern**: `boltFoundryClient.createCard(name, builderFn)` as main
  entry point
- **Cards**: Named cards with fluent builder functions
- **Basic Rendering**: Compile specs to OpenAI chat completion format
- **Persona Cards**: XML-formatted persona cards with `<⚡️persona_card⚡️>`
  markers

### Testing & Package (v0.0.2.3) 📋

- **Core Testing**: Unit tests for card creation and rendering
- **npm Package**: Configured dnt build and package metadata
- **Documentation**: Basic JSDoc comments and usage examples

## Current Status

- ✅ **v0.0.2.1**: Completed - Core spec infrastructure ready
- 🔄 **v0.0.2.2**: In Progress - Implementing public API
- 📋 **v0.0.2.3**: Pending - Testing and package setup

## Architecture Decisions

### Immutable Builder Pattern

Following functional programming principles, each builder method returns a new
instance, enabling:

- Safe sharing between functions without defensive copying
- Predictable state management
- Easy branching from base configurations

### Client-Based API

Using `boltFoundryClient.createCard()` instead of direct constructors provides:

- Familiar pattern from established SDKs
- Future extensibility for configuration and telemetry
- Clear separation between creation and usage

### Persona Card Format

The `<⚡️persona_card⚡️>` XML format ensures:

- Near-zero collision chance with user content
- Clear visual distinction in rendered prompts
- Parser-friendly structure for future analysis

## Exit Criteria for v0.1

To graduate from v0.0 to v0.1, the following must be completed:

### Technical Requirements

- [ ] All v0.0.2.x unit tests passing
- [ ] TypeScript compilation with strict mode
- [ ] Clean dnt build producing working npm package
- [ ] Basic card creation and rendering functional

### API Requirements

- [ ] `boltFoundryClient.createCard()` working end-to-end
- [ ] Cards compile to valid OpenAI chat completion format
- [ ] Persona cards render with proper XML formatting
- [ ] Immutable builders maintain state correctly

### Documentation Requirements

- [ ] Core API documented with JSDoc comments
- [ ] Basic usage examples working
- [ ] Package published to npm as alpha version

### User Validation

- [ ] 3+ internal developers can successfully create basic cards
- [ ] No major API design issues identified during testing
- [ ] Clear path forward for v0.1 advanced features

## What's NOT in v0.0

The following features are explicitly deferred to v0.1:

- **Variables System**: Dynamic content interpolation
- **Conversation Management**: Multi-turn conversation handling
- **Automatic Integration**: Seamless connectBoltFoundry integration
- **Advanced Testing**: Performance and stress testing
- **Production Polish**: Error handling and edge cases

## Success Metrics

### Developer Experience

- Time from npm install to first working card: < 5 minutes
- Clear TypeScript errors for invalid usage
- Intuitive API that follows established patterns

### Technical Performance

- Package size: < 50KB compressed
- Zero runtime dependencies beyond Deno/Node compatibility shims
- Clean integration with existing OpenAI SDK usage

v0.0 establishes the foundation that v0.1 will build upon with advanced features
and production readiness.
