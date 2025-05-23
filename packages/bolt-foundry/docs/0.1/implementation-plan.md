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
├── builder/
│   ├── PromptBuilder.ts
│   ├── PersonaBuilder.ts
│   └── ConstraintsBuilder.ts
├── telemetry/
│   └── connectBoltFoundry.ts  (existing)
├── types/
│   └── index.ts
├── bolt-foundry.ts
└── __tests__/
    ├── PromptBuilder.test.ts
    ├── PersonaBuilder.test.ts
    └── ConstraintsBuilder.test.ts
```

### Type Definitions

```typescript
// types/index.ts
import type { ChatCompletionCreateParams } from "openai/resources/chat";

export type RenderOptions = Partial<ChatCompletionCreateParams> & {
  // Future: telemetry options
};

export interface PersonaSpec {
  description?: string;
  traits?: string[];
  constraints?: Record<string, ConstraintSpec>;
}

export interface ConstraintSpec {
  constraints: string[];
}
```

### Builder Implementation

```typescript
// builder/PersonaBuilder.ts
export class PersonaBuilder<T extends PersonaSpec = {}> {
  constructor(private _spec: T) {}

  /** Set persona description */
  description<D extends string>(
    text: D,
  ): PersonaBuilder<T & { description: D }> {
    return new PersonaBuilder({ ...this._spec, description: text });
  }

  /** Add a trait to this persona */
  trait(trait: string): PersonaBuilder<T & { traits: string[] }> {
    const traits = [...(this._spec.traits || []), trait];
    return new PersonaBuilder({ ...this._spec, traits });
  }

  /** Define constraints for this persona */
  constraints<K extends string>(
    name: K,
    builder: (c: ConstraintsBuilder) => ConstraintsBuilder,
  ): PersonaBuilder<T & { constraints: Record<K, ConstraintSpec> }> {
    const constraintsBuilder = builder(new ConstraintsBuilder({}));
    const constraints = {
      ...this._spec.constraints,
      [name]: constraintsBuilder._spec,
    };
    return new PersonaBuilder({ ...this._spec, constraints });
  }

  get _spec(): T {
    return this._spec;
  }
}
```

```typescript
// builder/PromptBuilder.ts
export class PromptBuilder<T = {}> {
  private personas: Map<string, PersonaSpec> = new Map();

  /** Define a persona with traits and constraints */
  persona(
    name: string,
    builder: (p: PersonaBuilder) => PersonaBuilder,
  ): PromptBuilder<T> {
    const personaBuilder = builder(new PersonaBuilder({}));
    const newPersonas = new Map(this.personas);
    newPersonas.set(name, personaBuilder._spec);

    return Object.assign(Object.create(Object.getPrototypeOf(this)), {
      personas: newPersonas,
    });
  }

  /** Render to OpenAI chat completion format */
  render(options?: RenderOptions): ChatCompletionCreateParams {
    if (this.personas.size === 0) {
      throw new Error(
        "Cannot render empty prompt - at least one persona is required",
      );
    }

    const systemMessage = this.buildSystemMessage();

    return {
      ...options,
      messages: [{ role: "system", content: systemMessage }],
    };
  }

  private buildSystemMessage(): string {
    const parts: string[] = [];

    for (const [name, spec] of this.personas) {
      // Add description outside the card
      if (spec.description) {
        parts.push(spec.description);
        parts.push("");
      }

      // Build persona card
      const cardParts: string[] = [`<⚡️persona_card name="${name}"⚡️>`];

      if (spec.traits && spec.traits.length > 0) {
        cardParts.push("Traits:");
        spec.traits.forEach((trait) => cardParts.push(`- ${trait}`));
        cardParts.push("");
      }

      if (spec.constraints) {
        for (
          const [constraintName, constraintSpec] of Object.entries(
            spec.constraints,
          )
        ) {
          cardParts.push(`Constraints (${constraintName}):`);
          constraintSpec.constraints.forEach((c) => cardParts.push(`- ${c}`));
          cardParts.push("");
        }
      }

      cardParts.push(`<⚡️/persona_card⚡️>`);
      parts.push(cardParts.join("\n"));
      parts.push("");
    }

    return parts.join("\n").trim();
  }
}
```

## Implementation Phases

### v0.0.2.1: Core Builder Structure

- [ ] Set up file structure
- [ ] Implement PersonaBuilder with immutable pattern
- [ ] Implement ConstraintsBuilder
- [ ] Implement PromptBuilder with persona method
- [ ] Add TypeScript type tests

### v0.0.2.2: Render Implementation

- [ ] Implement buildSystemMessage with persona card format
- [ ] Add render method with OpenAI types
- [ ] Handle edge cases (empty prompts, etc.)
- [ ] Validate output format

### v0.0.2.3: Testing

- [ ] Unit tests for PersonaBuilder methods
- [ ] Unit tests for ConstraintsBuilder
- [ ] Unit tests for PromptBuilder
- [ ] Unit tests for render output format
- [ ] Type-level tests for builder chains

### v0.0.2.4: Package Setup

- [ ] Configure dnt build for npm
- [ ] Update package.json with correct metadata
- [ ] Add minimal JSDoc comments
- [ ] Set up exports in bolt-foundry.ts
- [ ] Test npm package locally

### v0.0.2.5: Integration & Polish

- [ ] Ensure compatibility with existing telemetry
- [ ] Add basic error messages
- [ ] Final testing pass
- [ ] Prepare for npm publish

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

- PersonaBuilder method chains
- ConstraintsBuilder functionality
- PromptBuilder persona accumulation
- Render output format validation
- Error cases (empty prompts, etc.)

### Example Test

```typescript
Deno.test("PromptBuilder - renders persona with traits", () => {
  const prompt = new PromptBuilder()
    .persona("assistant", (p) =>
      p
        .description("You are helpful")
        .trait("Clear communication")
        .trait("Patient"));

  const result = prompt.render({ model: "gpt-4" });

  assertEquals(result.messages[0].role, "system");
  assert(result.messages[0].content.includes("You are helpful"));
  assert(
    result.messages[0].content.includes('<⚡️persona_card name="assistant"⚡️>'),
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
