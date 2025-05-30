# Bolt Foundry

Make your LLM applications reliable with structured, testable prompts.

## What is Bolt Foundry?

Bolt Foundry helps you build LLM applications that actually work in production.
Instead of managing brittle prompt strings, you create structured "cards" that
are testable, reusable, and maintainable.

## Quick start

```bash
npm install @bolt-foundry/bolt-foundry
```

### Basic example

```typescript
import { BfClient } from "@bolt-foundry/bolt-foundry";
import OpenAI from "openai";

// 1. Create a Bolt Foundry client
const bf = BfClient.create();

// 2. Define your assistant using cards
const assistant = bf.createCard("helpful-assistant", (card) =>
  card
    .spec("You are a helpful assistant")
    .spec("Be concise and clear")
    .spec("Use examples when explaining concepts"));

// 3. Use with OpenAI (or any compatible LLM)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bf.fetch, // Adds telemetry and debugging
});

// 4. Make requests as normal
const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: assistant.render() },
    { role: "user", content: "Explain what a closure is in JavaScript" },
  ],
});
```

### Why use cards?

Traditional prompt engineering:

```typescript
const prompt = "You are a helpful assistant. Be concise. Don't be verbose. " +
  "Always use examples. Make sure examples are practical. " +
  "Focus on clarity. User: " + userInput;
```

With Bolt Foundry cards:

```typescript
const assistant = bf.createCard("assistant", (card) =>
  card
    .spec("You are a helpful assistant")
    .spec("Be concise", {
      samples: [
        { text: "JavaScript is a programming language", score: 3 },
        {
          text: "JavaScript, originally LiveScript, created in 1995...",
          score: -3,
        },
      ],
    })
    .spec("Use practical examples"));
```

Benefits:

- **Testable**: Verify each spec works as intended
- **Reusable**: Share cards across projects and teams
- **Maintainable**: Clear structure, easy to modify
- **Debuggable**: See exactly which parts affect outputs

## Features

### Structured specs with samples

Guide LLM behavior with scored examples:

```typescript
const emailWriter = bf.createCard("email-writer", (card) =>
  card
    .spec("Write professional emails")
    .spec("Match the user's tone", {
      samples: [
        { text: "Dear Sir/Madam, I hope this finds you well...", score: -2 },
        { text: "Hey! Just following up on...", score: 3 },
      ],
    }));
```

Or use the samples builder for better readability:

```typescript
const codeReviewer = bf.createCard("code-reviewer", (card) =>
  card
    .spec("Review code for clarity and best practices")
    .spec("Be constructive, not harsh", {
      samples: (s) =>
        s
          .sample("This code is terrible and you should feel bad", -3)
          .sample("This is wrong. Fix it.", -2)
          .sample("Consider using a more descriptive variable name here", 2)
          .sample(
            "Great job! This function is well-structured. One suggestion: consider adding a type annotation for better clarity",
            3,
          ),
    })
    .spec("Focus on important issues", {
      samples: (s) =>
        s
          .sample("Missing semicolon on line 5", -2)
          .sample("Potential memory leak in the event listener", 3),
    }));
```

### Dynamic context

Pass runtime data to your cards:

```typescript
const customerSupport = bf.createCard("support-agent", (card) =>
  card
    .spec("You are a customer support agent")
    .spec("Be empathetic and helpful")
    .context((ctx) =>
      ctx
        .string("customerName", "Customer's name")
        .string("issue", "Current issue description")
        .number("accountAge", "Days since account creation")
    ));

// Use with dynamic data
const rendered = customerSupport.render({
  customerName: "Alice",
  issue: "Can't reset password",
  accountAge: 45,
});
// The context values are automatically injected into the prompt
```

### Composable cards

Build complex behaviors from simple pieces:

```typescript
const baseAssistant = bf.createCard(
  "base",
  (card) => card.spec("You are a helpful AI assistant"),
);

const codeAssistant = bf.createCard("code-helper", (card) =>
  card
    .import(baseAssistant)
    .spec("You specialize in TypeScript and React")
    .spec("Always include type annotations"));
```

### Platform integration (optional)

Add telemetry and analytics when you're ready:

```typescript
const bf = BfClient.create({
  apiKey: process.env.BOLT_FOUNDRY_API_KEY,
});

// Now all your LLM calls include:
// - Automatic performance tracking
// - Debugging traces
// - A/B testing support
// - Usage analytics
```

## Testing

For unit tests, use our mock client:

```typescript
import { createMockOpenAi } from "@bolt-foundry/bolt-foundry/mock-openai";

const mockOpenAi = createMockOpenAi();
// Use exactly like the real OpenAI client in your tests
```

## Learn more

- [Why structured prompts?](https://boltfoundry.com/docs/why)
- [Examples and patterns](https://github.com/bolt-foundry/examples)
- [API reference](https://boltfoundry.com/docs/api)

## License

MIT
