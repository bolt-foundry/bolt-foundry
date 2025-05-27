# The Bolt Foundry card system

## Overview

Cards make prompt engineering structured and composable. Like trading cards,
each has defined attributes, clear combination rules, and can be shared across
teams.

## Core concepts

### What is a card?

A **card** defines a specific aspect of LLM behavior through structured
specifications:

- **Semantic**: Clear meaning and purpose
- **Composable**: Combine to create complex behaviors
- **Testable**: Validate in isolation
- **Versionable**: Evolve without breaking combinations
- **Shareable**: Publish and reuse across projects

### Card structure

Each card contains:

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

Key principles:

- Group related specs together
- Use samples to show good and bad behaviors  
- Build complex behaviors from simple specs
- Organize flexibly based on your needs

### Card composition

Create cards using the builder API:

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

Store cards as:

1. **TypeScript files**: Export card definitions as code
2. **JSON files**: Serialize card structures for storage
3. **Markdown files**: Document card specifications in `.card.md` files

### Card naming convention

- **Card files**: `{name}.card.ts` or `{name}.card.md`
- **Card directories**: Group related cards in directories by domain

## Benefits

### For developers

- Same card produces reliable behavior
- Build once, use everywhere
- Validate cards independently
- Isolate issues to specific cards

### For teams

- Codify best practices in cards
- New developers inherit proven patterns
- Control and audit LLM behaviors
- Improve cards without breaking systems

## Best practices

1. **Start specific**: Create focused cards for single responsibilities
2. **Document well**: Clear descriptions help others understand usage

## Vision

Cards bring the rigor of traditional software engineering to LLM applications,
making prompt engineering structured and maintainable.
