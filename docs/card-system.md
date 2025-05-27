# The Bolt Foundry card system

## Overview

The Bolt Foundry card system transforms prompt engineering from text strings
into structured, composable specifications. Like trading cards, each card has
well-defined attributes, clear rules for combination, and can be collected and
shared across teams.

## Core concepts

### What is a card?

A **card** is a collection of structured specifications that define a particular
aspect of LLM behavior. Cards are:

- **Semantic**: Each card has clear meaning and purpose
- **Composable**: Cards can be combined to create complex behaviors
- **Testable**: Individual cards can be validated in isolation
- **Versionable**: Cards can evolve without breaking existing combinations
- **Shareable**: Cards can be published and reused across projects

### Card structure

Cards are named collections of structured specifications. Each card contains:

- **Name**: A unique identifier for the card
- **Specs**: Hierarchical specifications organized by category
- **Samples**: Optional examples with ratings from -3 (bad) to +3 (good)

Example structure:

```typescript
const card = createCard(
  "assistant",
  (b) =>
    b.specs("persona", (p) =>
      p.spec("helpful and professional")
        .spec("patient and understanding"))
      .specs("capabilities", (c) =>
        c.spec("code review", {
          samples: (s) =>
            s.sample("Provides specific line-by-line feedback", 3)
              .sample("Says 'code looks fine' without details", -3),
        })),
);
```

Cards focus on:

- **Semantic organization**: Group related specs together
- **Example-driven**: Use samples to show good and bad behaviors
- **Composable**: Build complex behaviors from simple specs
- **Flexible**: No prescribed structure - organize as needed

### Card composition

Cards are created using the simple builder API:

```typescript
import { createCard } from "@bolt-foundry/builders";

const codeReviewer = createCard(
  "code-reviewer",
  (b) =>
    b.specs("goals", (g) =>
      g.spec("improve code quality")
        .spec("catch bugs early")
        .spec("enforce standards"))
      .specs("approach", (a) =>
        a.spec("constructive feedback", {
          samples: (s) =>
            s.sample("Here's how to improve this function...", 3)
              .sample("This code is bad", -3),
        })),
);
```

## Implementation

### Card storage

Cards can be stored as:

1. **TypeScript files**: Export card definitions as code
2. **JSON files**: Serialize card structures for storage
3. **Markdown files**: Document card specifications in `.card.md` files

### Card naming convention

- **Card files**: `{name}.card.ts` or `{name}.card.md`
- **Card directories**: Group related cards in directories by domain

## Benefits

### For developers

- **Consistency**: Same card produces reliable behavior
- **Reusability**: Build once, use everywhere
- **Testing**: Validate cards independently
- **Debugging**: Isolate issues to specific cards

### For teams

- **Knowledge sharing**: Codify best practices in cards
- **Onboarding**: New developers inherit proven patterns
- **Governance**: Control and audit LLM behaviors
- **Evolution**: Improve cards without breaking systems

## Best practices

1. **Start specific**: Create focused cards for single responsibilities
2. **Document well**: Clear descriptions help others understand usage

## Vision

The card system aims to make prompt engineering more structured and
maintainable, treating LLM applications with the same rigor as traditional
software.
