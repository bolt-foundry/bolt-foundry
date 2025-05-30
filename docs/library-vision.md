# Bolt Foundry library vision

## What is Bolt Foundry?

Bolt Foundry is a TypeScript/JavaScript library that makes LLM applications
reliable. Instead of writing brittle prompt strings, you compose structured,
testable prompts using cards.

```typescript
// Before: Brittle, untestable prompt strings
const prompt = "You are a helpful assistant. Be concise. User: " + userInput;

// After: Structured, testable, maintainable cards
import { createCard } from "@bolt-foundry/cards";

const assistant = createCard("assistant")
  .spec("You are a helpful assistant")
  .spec("Be concise", {
    samples: [
      { text: "The answer is 42", score: 3 },
      { text: "Well, to understand this we need to go back to...", score: -3 },
    ],
  })
  .context((ctx) =>
    ctx.string("userInput", "Input from the user")
  );
```

## Why we're building this

Every developer building LLM applications faces the same problems:

1. **Can't debug prompts**: When something goes wrong, there's no way to figure
   out why without extensive reproduction attempts
2. **Can't predict changes**: It's impossible to intuit or prove changing a few
   words won't break other situations
3. **Slow iteration cycles**: Testing is largely manual, and challenging (or
   impossible) to automate
4. **No reusability**: Every prompt starts from a blank slate. Users can't take
   advantage of other attempts to drive attention, they're stuck writing every
   prompt from scratch. It's like if coding was only possible using copy/paste,
   or concatenating source code

## Our vision: LLM development at web speed

LLM development should feel as natural and fast as web development:

- **Instant feedback**: See how your changes affect outputs immediately
- **Visual debugging**: Heatmaps show which parts of your prompts matter
- **Production confidence**: A/B test and backtest changes before deployment
- **Runtime updates**: Update prompts without redeploying code

## Architecture: two packages, one vision

### 1. `@bolt-foundry/cards`: The card creator

A lightweight, tree-shakeable package for creating structured prompts:

- Zero dependencies on our platform
- Works with any LLM provider (OpenAI, Anthropic, Google, and more)
- Full TypeScript support
- Use standalone in any project

### 2. `@bolt-foundry/client`: The platform client

Connects your cards to the Bolt Foundry platform for advanced features:

- Automatic telemetry and analytics
- A/B testing and experimentation
- Prompt performance insights
- Runtime prompt optimization
