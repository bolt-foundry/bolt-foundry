# Bolt Foundry Builders

This directory contains the core builder pattern implementation for Bolt
Foundry.

## Architecture

The builder pattern here is designed to be generic and reusable across the
codebase, modeled after the successful pattern used in bfDb.

### Core Components

- **`Spec`**: A generic data structure for holding structured specifications. It
  can contain either:
  - A simple string value
  - An array of nested Spec objects (for hierarchical structures)
  - An optional name for grouping/categorization

- **`SpecBuilder`**: A generic, immutable builder for creating `Spec` instances.
  Each method returns a new builder instance, ensuring immutability.

### Design Principles

1. **Generic and Reusable**: `Spec` and `SpecBuilder` are intentionally generic.
   They don't contain any domain-specific logic or rendering capabilities.

2. **Immutable Builders**: All builder methods return new instances rather than
   mutating the existing one. This ensures predictable behavior and enables
   method chaining without side effects.

3. **Domain-Specific Extensions**: Classes like `SpecForAssistant` extend `Spec`
   to add domain-specific functionality (e.g., rendering to OpenAI format). The
   rendering logic belongs in these specialized classes, not in the base `Spec`.

4. **Composable**: Builders can be composed to create complex hierarchical
   structures while maintaining type safety and immutability.

## Usage Example

```typescript
import { BfClient } from "@bolt-foundry/bolt-foundry";

// Create a client
const client = BfClient.create();

// Generic spec building
const spec = new SpecBuilder()
  .spec("simple value")
  .specs("persona", (b) =>
    b
      .spec("description: A helpful assistant")
      .spec("trait: patient"))
  .build();

// Domain-specific usage (assistants)
const assistant = client.createAssistant(
  "helper",
  (b) =>
    b.persona("character", (p) => p.description("..."))
      .traits("personality", (t) => t.trait("...").trait("..."))
      .constraints("rules", (c) => c.constraint("...")),
);
```

## Future Considerations

This pattern is designed to be extended for other use cases beyond assistants,
such as:

- Configuration builders
- Schema builders
- Query builders
- Any domain requiring structured, hierarchical specifications
