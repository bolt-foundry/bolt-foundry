# The Bolt Foundry deck system

## Overview

Decks make prompt engineering structured and composable. Like trading card
decks, each has defined cards with clear combination rules, and can be shared
across teams.

## Core concepts

### What is a deck?

A **deck** defines a specific aspect of LLM behavior through structured
specifications:

- **Semantic**: Clear meaning and purpose
- **Composable**: Combine to create complex behaviors
- **Testable**: Validate in isolation
- **Evolvable**: Can be updated without breaking existing combinations
- **Shareable**: Publish and reuse across projects

### Deck structure

Each deck contains:

- **Name**: A unique identifier for the deck
- **Cards**: Hierarchical specifications organized by category
- **Samples**: Optional examples with ratings from -3 (bad) to +3 (good)

Example structure:

```typescript
const deck = createDeck(
  "assistant",
  (b) =>
    b.card("persona", (c) =>
      c.spec("helpful and professional")
        .spec("patient and understanding"))
      .card("capabilities", (c) =>
        c.spec("code review", {
          samples: (s) =>
            s.sample("Provides specific line-by-line feedback", 3)
              .sample("Says 'code looks fine' without details", -3),
        })),
);
```

Key principles:

- Group related specs into logical cards
- Use samples to show good and bad behaviors
- Build complex behaviors from simple specs
- Organize flexibly based on your needs

### Deck composition

Create decks using the builder API:

```typescript
import { createDeck } from "@bolt-foundry/builders";

const codeReviewer = createDeck(
  "code-reviewer",
  (b) =>
    b.card("goals", (c) =>
      c.spec("improve code quality")
        .spec("catch bugs early")
        .spec("enforce standards"))
      .card("approach", (c) =>
        c.spec("constructive feedback", {
          samples: (s) =>
            s.sample("Here's how to improve this function...", 3)
              .sample("This code is bad", -3),
        })),
);
```

## Implementation

### Deck storage

Store decks as:

1. **TypeScript files**: Export deck definitions as code
2. **JSON files**: Serialize deck structures for storage
3. **Markdown files**: Document deck specifications in `.deck.md` files

### Deck naming convention

- **Deck files**: `{name}.deck.ts` or `{name}.deck.md`
- **Deck directories**: Group related decks in directories by domain

## Benefits

### For developers

- Same deck produces reliable behavior
- Build once, use everywhere
- Validate decks independently
- Isolate issues to specific cards within decks

### For teams

- Codify best practices in decks
- New developers inherit proven patterns
- Control and audit LLM behaviors
- Improve decks without breaking systems

## Best practices

1. **Start specific**: Create focused decks for single responsibilities
2. **Document well**: Clear descriptions help others understand usage

## Vision

Decks bring the rigor of traditional software engineering to LLM applications,
making prompt engineering structured and maintainable.
