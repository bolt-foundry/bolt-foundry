# Bolt Foundry SDK v0.1 Implementation Plan

## Overview

This document outlines the technical implementation for the Bolt Foundry SDK
v0.1, focusing on a TypeScript-first fluent builder API for creating structured
prompts that compile to OpenAI chat completion format.

## Technical Reasoning

### Why a Builder Pattern?

The builder pattern provides several critical advantages for structured prompt
construction:

1. **Type Safety**: TypeScript's type system can enforce valid method chains at
   compile time
2. **Composability**: Immutable builders allow safe reuse and branching of base
   configurations
3. **Discoverability**: IDE autocomplete guides developers through available
   options
4. **Validation**: Invalid states become impossible to represent

### Why Immutable Builders?

Following functional programming principles and our existing bfDb patterns:

1. **Predictable State**: Each method returns a new instance, preventing
   surprising mutations
2. **Safe Sharing**: Builders can be passed between functions without defensive
   copying
3. **Time Travel**: Intermediate states can be captured and tested independently
4. **Parallel Safety**: Multiple branches can be created from a single base
   configuration

### Why Persona Cards with XML?

The `<⚡️persona_card⚡️>` format solves critical challenges:

1. **Collision Avoidance**: Near-zero chance of appearing in user content
2. **Parser-Friendly**: Clear boundaries for future analysis and optimization
3. **Visual Distinction**: Immediately recognizable as Bolt Foundry structure
4. **LLM Attention**: Unique tokens may receive special attention from models

## Core Architecture

### File Structure

```
packages/bolt-foundry/
├── builders/
│   └── builders.ts              (temporary single file for API development)
├── lib/
│   └── BfError.ts               (existing)
├── telemetry/
│   └── connectBoltFoundry.ts    (existing)
├── bolt-foundry.ts              (main exports)
└── __tests__/
    └── SpecBuilder.test.ts      (all builder tests)
```

**Note**: `builders.ts` is our temporary starting point for API definition and
experimentation. As the API stabilizes, we may split this into separate files
for better organization (e.g., `specs.ts`, `builders.ts`, `types.ts`).

### Current Implementation

See the live implementation in [`builders/builders.ts`](../builders/builders.ts)
which contains:

- `Spec` class: Base data structure with `value` (string or Array<Spec>) and
  optional `name`
- `SpecBuilder` class: Immutable builder with `.spec()` for individual values,
  `.specs()` for groups, and `.getSpecs()` to retrieve all specs
- `RenderOptions` type: OpenAI chat completion parameters
- Minimal, flexible API using immutable builder pattern

## Key Architectural Changes

### Simple Spec-Based Architecture

The system uses a minimal, flexible architecture:

1. **Single Spec Class**: All data uses the base `Spec` class with `value` and
   `name` properties
2. **Flexible Value**: `value` can be a string (leaf node) or Array<Spec>
   (container)
3. **Named Groups**: Optional `name` property enables grouping and
   categorization

### Example Usage

```typescript
const pokemonTrainer = new SpecBuilder()
  .spec(
    "You are an experienced Pokemon trainer on a journey to become a Pokemon Master",
  )
  .specs("wants", (s) =>
    s
      .spec("To be the very best like no one ever was")
      .spec("To catch them all")
      .spec("To travel across the land searching far and wide"))
  .specs("needs", (s) =>
    s
      .spec("Trust and loyalty from Pokemon")
      .spec("Challenging battles to grow")
      .spec("Connection with other trainers"))
  .specs("fears", (s) =>
    s
      .spec("Losing a Pokemon permanently")
      .spec("Being unable to protect those they care about"))
  .specs("values", (s) =>
    s
      .spec("Friendship over victory")
      .spec("Perseverance through hardship"))
  .specs("skills", (s) =>
    s
      .spec("Reading Pokemon emotions")
      .spec("Strategic battle planning"))
  .spec("Optimistic")
  .spec("Empathetic")
  .specs("constraints", (s) =>
    s
      .spec("Always treat Pokemon with respect")
      .spec("Learn from every defeat"));

// Result structure shows flexible composition:
// SpecBuilder {
//   _specs: [
//     Spec { value: "You are an experienced Pokemon trainer...", name: undefined },
//     Spec {
//       value: [
//         Spec { value: "To be the very best like no one ever was", name: undefined },
//         Spec { value: "To catch them all", name: undefined },
//         Spec { value: "To travel across the land searching far and wide", name: undefined }
//       ],
//       name: "wants"
//     },
//     Spec {
//       value: [
//         Spec { value: "Trust and loyalty from Pokemon", name: undefined },
//         Spec { value: "Challenging battles to grow", name: undefined },
//         Spec { value: "Connection with other trainers", name: undefined }
//       ],
//       name: "needs"
//     },
//     Spec { name: "fears", value: [...] },
//     Spec { name: "values", value: [...] },
//     Spec { name: "skills", value: [...] },
//     Spec { value: "Optimistic", name: undefined },
//     Spec { value: "Empathetic", name: undefined },
//     Spec { name: "constraints", value: [...] }
//   ]
// }
```

## Implementation Phases

### v0.0.2.1: API Definition and Design ✅

- [x] Design uniform Spec base class with specs array concept
- [x] Define SpecFor* data structure hierarchy
- [x] Define SpecBuilderFor* builder hierarchy
- [x] Create test cases to validate API design
- [x] Eliminate Entry classes in favor of Spec-only architecture
- [x] Finalize API design decisions
- [x] Implement simple, flexible API with .spec() and .specs() methods
- [x] Add .getSpecs() method to retrieve specs

### v0.0.2.2: Public API

- [ ] Design main entry points for developers
      (boltFoundryClient.createCard())
- [ ] Define how users create and compose named cards
- [ ] Specify how specs compile to OpenAI chat completion format
- [ ] Design persona card rendering with XML format
- [ ] Design render options bag (model, temperature, variables, telemetry, etc.)
- [ ] Implement boltFoundryClient with createCard() method
- [ ] Implement card builder using underlying SpecBuilder
      infrastructure
- [ ] Create render/compile methods for OpenAI format
- [ ] Implement persona card XML generation
- [ ] Ensure immutable builders return new instances
- [ ] Handle edge cases and error scenarios
- [ ] Document intended developer workflow and examples

### v0.0.2.3: Testing & Package Setup

- [ ] Comprehensive unit tests for core functionality
- [ ] Basic integration tests for card creation and rendering
- [ ] Configure dnt build for npm
- [ ] Update package.json with correct metadata
- [ ] Add minimal JSDoc comments
- [ ] Set up exports in bolt-foundry.ts
- [ ] Test npm package locally

## v0.1 Series Goals

### v0.1.1: Variables System

- [ ] Design variable interpolation system for dynamic content
- [ ] Define variable spec structure (similar to but different from specs)
- [ ] Implement variable builders and composition
- [ ] Create variable validation and type checking
- [ ] Integrate variables with render pipeline
- [ ] Handle variable scoping and inheritance
- [ ] Add comprehensive tests for variable system

### v0.1.2: Conversation Management

- [ ] Design conversation management API (.addUser(), .addAssistant(), etc.)
- [ ] Design automatic conversation tracking with connectBoltFoundry integration
- [ ] Implement basic conversation management (manual
      .addUser()/.addAssistant())
- [ ] Create conversation state tracking and immutable updates
- [ ] Handle conversation context and turn management
- [ ] Add comprehensive tests for conversation system

### v0.1.3: Advanced Testing

- [ ] Comprehensive unit tests for all builder methods
- [ ] Integration tests for complex spec building scenarios
- [ ] Performance tests for large spec trees
- [ ] Error handling and validation tests
- [ ] Type-level tests for builder chains

### v0.1.4: Advanced Conversation Integration

- [ ] Implement automatic conversation tracking in connectBoltFoundry
- [ ] Add response interception and conversation state updates
- [ ] Integrate conversation management with telemetry tracking
- [ ] Handle edge cases (streaming responses, errors, etc.)

### v0.1.5: Integration & Polish

- [ ] Ensure compatibility with existing telemetry
- [ ] Add basic error messages
- [ ] Final testing pass
- [ ] Prepare for production release

## Technical Decisions

### Immutable Builder Pattern

Following the bfDb pattern, each method returns a new instance:

- Enables safe composition and reuse
- Prevents accidental mutations
- Allows branching from base configurations

### Type-Only OpenAI Dependency

Using `import type` ensures:

- No runtime dependency for users who don't need it
- Full type safety for those who do
- Forward compatibility with OpenAI API changes

### Persona Card Format

Using `<⚡️persona_card⚡️>` XML format:

- Nearly impossible to collide with user content
- Clear visual distinction in prompts
- Parser-friendly for future analysis

### Minimal Documentation

Using brief JSDoc comments:

- Leverages Deno's built-in doc generator
- Provides IDE intellisense
- Keeps focus on shipping v0.1

## Testing Strategy

### Unit Tests Only

Focus on testing individual methods:

- boltFoundryClient.createCard() method
- Card builder method chains
- PersonaBuilder functionality
- ConstraintsBuilder functionality
- Render output format validation
- Error cases (empty card configs, etc.)

### Example Test

```typescript
Deno.test("boltFoundryClient.createCard - renders persona with traits", () => {
  const card = boltFoundryClient.createCard("helpful-assistant", (b) => {
    return b
      .persona((p) =>
        p
          .description("You are helpful")
          .trait("Clear communication")
          .trait("Patient")
      );
  });

  const result = spec.render({ model: "gpt-4" });

  assertEquals(result.messages[0].role, "system");
  assert(result.messages[0].content.includes("You are helpful"));
  assert(
    result.messages[0].content.includes(
      '<⚡️persona_card name="helpful-assistant"⚡️>',
    ),
  );
  assert(result.messages[0].content.includes("Clear communication"));
});
```

## Success Criteria

### Technical Success

- All unit tests passing
- TypeScript compilation with strict mode
- Clean dnt build to npm package
- No runtime errors in basic usage

### API Success

- Intuitive method chaining
- Clear TypeScript errors for invalid usage
- Renders valid OpenAI payloads
- Maintains immutability throughout

## Risks and Mitigations

### Risk: Unicode/Emoji Issues

**Mitigation**: Test thoroughly across platforms. Have fallback plan for
non-emoji markers if needed.

### Risk: OpenAI Type Changes

**Mitigation**: Pin OpenAI package version in v0.1. Plan migration strategy for
major updates.

### Risk: Builder Complexity

**Mitigation**: Keep v0.1 minimal. Only persona with traits/constraints. Save
behaviors and advanced features for later.

## Next Steps

1. Create feature branch for v0.1 implementation
2. Set up basic file structure
3. Implement PersonaBuilder first (smallest unit)
4. Build up to PromptBuilder
5. Add render logic
6. Write comprehensive unit tests
