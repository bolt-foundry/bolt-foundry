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
const bf = BfClient.create({
  apiKey: process.env.BOLT_FOUNDRY_API_KEY,
});

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
const completion = await openai.chat.completions.create(
  assistant.render({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Explain what a closure is in JavaScript" },
    ],
  }),
);
```

### Why use cards?

Traditional prompt engineering:

```typescript
const prompt = "You are a helpful assistant. Be concise. Don't be verbose. " +
  "Always use examples. Make sure examples are practical. " +
  `User query: ${userInput}. Remember to focus on clarity and ` +
  "avoid unnecessary details. Keep responses short.";
```

With Bolt Foundry cards:

```typescript
const assistant = bf.createCard("assistant", (card) =>
  card
    .spec("You are a helpful assistant")
    .spec("Be concise", {
      samples: [{
        input: {
          text: "What is JavaScript?",
          context: "Common beginner question",
        },
        responses: [
          {
            text: "JavaScript is a programming language",
            rating: 3,
            explanation: "Direct and to the point",
          },
          {
            text: "JavaScript, originally LiveScript, created in 1995...",
            rating: -3,
            explanation: "Too verbose with unnecessary history",
          },
        ],
      }],
    })
    .spec("Use practical examples")
    .spec("Focus on clarity")
    .spec("Avoid unnecessary details")
    .spec("Keep responses short"));
```

Benefits:

- **Testable**: Verify each spec works as intended
- **Reusable**: Share cards across projects and teams
- **Maintainable**: Clear structure, easy to modify
- **Debuggable**: See exactly which parts affect outputs

## Features

### Structured specs with samples

Guide LLM behavior with scored examples using the samples builder:

```typescript
const emailWriter = bf.createCard("email-writer", (card) =>
  card
    .spec("Write professional emails")
    .spec("Match the user's tone", {
      samples: [{
        input: {
          text: "User writes: Hey! Quick question about the project",
          context: "Casual tone from user",
        },
        responses: [
          {
            text: "Dear Sir/Madam, I hope this finds you well...",
            rating: -2,
            explanation: "Too formal for casual user tone",
          },
          {
            text: "Hey! Just following up on...",
            rating: 3,
            explanation: "Matches the casual tone",
          },
        ],
      }],
    }));
```

More complex example with multiple specs:

```typescript
const codeReviewer = bf.createCard("code-reviewer", (card) =>
  card
    .spec("Review code for clarity and best practices")
    .spec("Be constructive, not harsh", {
      samples: [{
        input: {
          text: "Review this code: const x = getData();",
          context: "Vague variable naming example",
        },
        responses: [
          {
            text: "This code is terrible and you should feel bad",
            rating: -3,
            explanation: "Harsh and unprofessional",
          },
          {
            text: "This is wrong. Fix it.",
            rating: -2,
            explanation: "Dismissive without explanation",
          },
          {
            text: "Consider using a more descriptive variable name here",
            rating: 2,
            explanation: "Constructive suggestion",
          },
          {
            text:
              "Great job! This function is well-structured. One suggestion: consider adding a type annotation for better clarity",
            rating: 3,
            explanation: "Positive reinforcement with actionable advice",
          },
        ],
      }],
    })
    .spec("Focus on important issues", {
      samples: [{
        input: {
          text: "Code has a missing semicolon and a memory leak",
          context: "Mix of minor and major issues",
        },
        responses: [
          {
            text: "Missing semicolon on line 5",
            rating: -2,
            explanation: "Minor style issue, not important",
          },
          {
            text: "Potential memory leak in the event listener",
            rating: 3,
            explanation: "Critical issue that affects performance",
          },
        ],
      }],
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

## Learn more

- [Why structured prompts?](https://boltfoundry.com/docs/why)
- [Examples and patterns](https://github.com/bolt-foundry/examples)
- [API reference](https://boltfoundry.com/docs/api)

## License

MIT
