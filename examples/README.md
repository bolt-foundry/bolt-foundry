# Bolt Foundry examples

Working code that shows how Bolt Foundry works.

## Available examples

### nextjs-sample

Next.js chat app using OpenAI. Shows:

- Decks with cards and specs
- Context variables without string interpolation
- Chat that actually works

[View example](./nextjs-sample/)

## Get started

1. Install Node.js 18+
2. Get an OpenAI API key
3. Run the example:
   ```bash
   cd examples/nextjs-sample
   npm install
   npm run dev
   ```

## Core concepts

Each example demonstrates:

**Decks** - Structure prompts with cards and specs instead of strings

**Context** - Add dynamic values without breaking the prompt

**Samples** - Rate examples from -3 to +3 to guide behavior

**TypeScript** - Full type safety throughout

## Basic pattern

```typescript
import { createDeck } from "@bolt-foundry/bfmono";

const assistantDeck = createDeck("assistant", (b) =>
  b
    .spec("You are a helpful assistant")
    .context((c) =>
      c
        .string("userName", "What is the user's name?")
    ));

// Render with context
const messages = assistantDeck.render({
  context: { userName: "Alice" },
});
```

## Learn more

- [SDK documentation](../packages/bolt-foundry/docs/)
- [Implementation notes](./docs/)
- [Product roadmap](/404.md)
