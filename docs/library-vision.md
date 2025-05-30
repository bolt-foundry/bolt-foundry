# Bolt Foundry library vision

## What is Bolt Foundry?

Bolt Foundry is a TypeScript/JavaScript library that makes LLM applications
reliable. Instead of writing brittle prompt strings, you compose structured,
testable prompts using cards.

```typescript
// Before: Brittle, untestable prompt strings
const prompt = "You are a helpful assistant. Be concise. User: " + userInput;

// After: Structured, testable, maintainable cards
import { createAssistantCard } from "@bolt-foundry/bolt-foundry";

const assistant = createAssistantCard("assistant")
  .spec("You are a helpful assistant")
  .spec("Be concise", {
    samples: [
      { text: "The answer is 42", score: 3 },
      { text: "Well, to understand this we need to go back to...", score: -3 },
    ],
  })
  .context((ctx) => ctx.string("userInput", "Input from the user"));
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

## Architecture: One package, multiple use cases

### `@bolt-foundry/bolt-foundry`: Everything you need

A comprehensive package for creating structured prompts with optional platform
features:

- **Standalone usage**: Use `createAssistantCard` without any client setup
- **Platform integration**: Create a client for telemetry, analytics, and
  advanced features
- **Zero lock-in**: Works with any LLM provider (OpenAI, Anthropic, Google, and
  more)
- **Full TypeScript support**: Type-safe from development to production
- **Progressive enhancement**: Start simple, add platform features when needed

Platform features (when using a client):

- Automatic telemetry and analytics
- A/B testing and experimentation
- Prompt performance insights
- Runtime prompt optimization
