# Getting Started

## Why Structured Prompts?

Every LLM prompt today is a text string. While this works for simple cases, it
creates problems as applications grow:

- **Brittleness**: Changing one part breaks unrelated functionality
- **Maintainability**: No clear structure or semantic meaning
- **Testability**: Hard to verify prompt components work as intended
- **Composability**: Difficult to reuse prompt patterns across projects

Bolt Foundry solves these problems by transforming prompts from strings into
**composable cards** with specifications and examples.

## Core Concepts

### Cards

Cards are the building blocks of structured prompts. Each card encapsulates:

- **Specifications**: What the AI should do
- **Examples**: Scored samples showing good (-3 to +3) behavior
- **Context**: Required inputs and their descriptions

### Specifications

Specifications define the behavior you want from the AI. They're organized
hierarchically:

```typescript
card
  .spec("Main behavior")
  .specs("category", (s) =>
    s.spec("Specific behavior 1")
      .spec("Specific behavior 2"));
```

### Scoring System

The -3 to +3 scoring isn't just about examples - it's about achieving 99%
reliability through inference-time control:

- **+3**: Excellent example of desired behavior
- **+2**: Good example
- **+1**: Acceptable
- **-1**: Mildly undesirable
- **-2**: Bad example
- **-3**: Completely wrong behavior

## Your First Card

Let's build a customer support assistant step by step:

```typescript
import { BfClient } from "@bolt-foundry/bolt-foundry";

const client = BfClient.create();

const supportAgent = client.createAssistantCard(
  "customer-support",
  (card) =>
    card
      .spec("You are a helpful customer support agent")
      .specs("personality", (p) =>
        p.spec("Be empathetic and professional", {
          samples: (s) =>
            s.sample("I understand your frustration. Let me help.", 3)
              .sample("Whatever, that's not my problem.", -3),
        }))
      .context((ctx) =>
        ctx.string("customerQuery", "What the customer is asking")
      ),
);
```

## Next Steps

- Check out the [Quickstart](/docs/quickstart) for a practical example
- Learn about advanced patterns in our guides
- Explore the API reference for detailed documentation
