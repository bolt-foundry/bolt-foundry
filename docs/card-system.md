# The Bolt Foundry Card System

## Overview

The Bolt Foundry Card System transforms prompt engineering from brittle text
strings into structured, composable specifications. Like trading cards, each
card has well-defined attributes, clear rules for combination, and can be
collected and shared across teams.

## Core Concepts

### What is a Card?

A **card** is a collection of structured specifications that define a particular
aspect of LLM behavior. Cards are:

- **Semantic**: Each card has clear meaning and purpose
- **Composable**: Cards can be combined to create complex behaviors
- **Testable**: Individual cards can be validated in isolation
- **Versionable**: Cards can evolve without breaking existing combinations
- **Shareable**: Cards can be published and reused across projects

### Card Structure

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

- **Semantic Organization**: Group related specs together
- **Example-Driven**: Use samples to show good and bad behaviors
- **Composable**: Build complex behaviors from simple specs
- **Flexible**: No prescribed structure - organize as needed

### Card Composition

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

### Card Storage

Cards can be stored as:

1. **TypeScript files**: Export card definitions as code
2. **JSON files**: Serialize card structures for storage
3. **Markdown files**: Document card specifications in `.card.md` files

### Card Naming Convention

- **Card files**: `{name}.card.ts` or `{name}.card.md`
- **Card directories**: Group related cards in directories by domain


## Benefits

### For Developers

- **Consistency**: Same card produces reliable behavior
- **Reusability**: Build once, use everywhere
- **Testing**: Validate cards independently
- **Debugging**: Isolate issues to specific cards

### For Teams

- **Knowledge Sharing**: Codify best practices in cards
- **Onboarding**: New developers inherit proven patterns
- **Governance**: Control and audit LLM behaviors
- **Evolution**: Improve cards without breaking systems


## Best Practices

1. **Start Specific**: Create focused cards for single responsibilities
2. **Document Well**: Clear descriptions help others understand usage

## Future Vision

The card system will evolve to support:

- **Card Analytics**: Track performance and usage metrics
- **Card Optimization**: AI-powered improvements to existing cards

The card system transforms prompt engineering from an art into a science, making
LLM applications as reliable and maintainable as traditional software.
