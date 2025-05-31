# Bolt Foundry Builders

This directory contains the core builder pattern implementation for Bolt
Foundry.

## Architecture

The builder pattern here is designed to be generic and reusable across the
codebase, modeled after the successful pattern used in bfDb.

### Core Components

- **`Card`**: A generic data structure for holding structured specifications. It
  can contain either:
  - A simple string value
  - An array of nested Card objects (for hierarchical structures)
  - An optional name for grouping/categorization

- **`CardBuilder`**: A generic, immutable builder for creating `Card` instances.
  Each method returns a new builder instance, ensuring immutability.

### Design Principles

1. **Generic and Reusable**: `Card` and `CardBuilder` are intentionally generic.
   They don't contain any domain-specific logic or rendering capabilities.

2. **Immutable Builders**: All builder methods return new instances rather than
   mutating the existing one. This ensures predictable behavior and enables
   method chaining without side effects.

3. **Domain-Specific Extensions**: Classes like `DeckBuilder` extend `Card` to
   add domain-specific functionality (e.g., rendering to OpenAI format). The
   rendering logic belongs in these specialized classes, not in the base `Card`.

4. **Composable**: Builders can be composed to create complex hierarchical
   structures while maintaining type safety and immutability.

## Usage Example

```typescript
import { createDeck } from "@bolt-foundry/builders";

// Create a deck with structured cards
const assistantDeck = createDeck(
  "assistant",
  (b) =>
    b.card("persona", (c) =>
      c.spec("A helpful assistant")
        .spec("Patient and understanding"))
      .card("capabilities", (c) =>
        c.spec("Answer questions", {
          samples: (s) =>
            s.sample("Provides detailed, accurate responses", 3)
              .sample("Gives vague or incorrect information", -3),
        })),
);

// Decks are simple data structures
console.log(assistantDeck.name); // "assistant"
console.log(assistantDeck.cards); // Array of cards
```

## Future Considerations

This pattern is designed to be extended for other use cases beyond assistants,
such as:

- Configuration builders
- Schema builders
- Query builders
- Any domain requiring structured, hierarchical specifications
