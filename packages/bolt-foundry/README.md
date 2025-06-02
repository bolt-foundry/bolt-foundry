# Bolt Foundry

Make your LLM applications reliable with structured, testable prompts.

## What is Bolt Foundry?

Bolt Foundry helps you build LLM applications that actually work in production.
Instead of managing brittle prompt strings, you create structured "decks" that
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

// 2. Define your assistant using decks
const assistant = bf.createDeck("helpful-assistant", (deck) =>
  deck
    .spec("You are a helpful assistant")
    .spec("Be concise and clear")
    .spec("Use examples when explaining concepts"));

// 3. Use with OpenAI (or any compatible LLM)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bf.fetch, // Adds telemetry and debugging
});

// 4. Make requests as normal, wrapped in the deck's render function
const completion = await openai.chat.completions.create(
  assistant.render({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Explain what a closure is in JavaScript" },
    ],
  }),
);
```

### Why use decks?

Traditional prompt engineering:

```typescript
const prompt = "You are a helpful assistant. Be concise. Don't be verbose. " +
  "Always use examples. Make sure examples are practical. " +
  `User query: ${userInput}. Remember to focus on clarity and ` +
  "avoid unnecessary details. Keep responses short.";
```

With Bolt Foundry decks:

```typescript
const assistant = bf.createDeck("assistant", (deck) =>
  deck
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
const emailWriter = bf.createDeck("email-writer", (deck) =>
  deck
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
const codeReviewer = bf.createDeck("code-reviewer", (deck) =>
  deck
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

Pass runtime data to your decks by defining context variables.

Each context variable has:

- **Variable name** (first parameter): Used when passing data to `render()`
- **AI prompt** (second parameter): The prompt the AI uses to gather this
  information

```typescript
const customerSupport = bf.createDeck("support-agent", (deck) =>
  deck
    .spec("You are a customer support agent")
    .spec("Be empathetic and helpful")
    .context((ctx) =>
      ctx
        .string("customerName", "What is the customer's name?")
        .string("issue", "Describe the current issue")
        .number("accountAge", "How many days since the account was created?")
        .boolean("accountActive", "Is the account active?")
    ));

// Use with dynamic data
const rendered = customerSupport.render({
  model: "gpt-3.5-turbo",
  messages: [],
  context: {
    customerName: "Alice", // Answers "What is the customer's name?"
    issue: "Can't reset password", // Answers "Describe the current issue"
    accountAge: 45, // Answers "How many days since the account was created?"
    accountActive: true, // Answers "Is the account active?"
  },
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

## Card examples

Here are some real card examples using the `deck.card()` API:

### Technical writer persona

```typescript
const technicalWriter = bf.createDeck("technical-writer", (deck) =>
  deck
    .card("Assistant persona", (c) =>
      c.spec("You are a technical writer for Bolt Foundry")
        .spec(
          "Create user-facing documentation, internal technical docs, and API documentation",
        ))
    .card("Behavior", (c) =>
      c.card("Writing style", (ws) =>
        ws.spec(
          "Write in active voice and lead with the most important information",
        )
          .spec("Use sentence casing for all headings")
          .spec("Be direct and conversational")
          .spec("Never over-promise or mention 'coming soon' features"))
        .card("Technical approach", (ta) =>
          ta.spec("Reference existing code in the codebase")
            .spec("Create minimal working examples")
            .spec("Focus on clarity over cleverness")
            .spec("Show, don't just tell"))));
```

### Code assistant with samples

```typescript
const coderAssistant = bf.createDeck("coder-assistant", (deck) =>
  deck
    .card("Assistant persona", (c) =>
      c.spec("You are an AI assistant that helps write software")
        .spec("Optimize for speed and business value delivery"))
    .card("Behavior", (c) =>
      c.card("Development approach", (da) =>
        da.spec("Practice Test-Driven Development", {
          samples: [{
            input: {
              text: "Before implementing logic, write a failing test for it.",
              context: "Practicing test-driven development",
            },
            responses: [
              {
                text: "Write test first, then implement",
                rating: 3,
                explanation: "Follows TDD by writing tests first",
              },
              {
                text: "Write code first, add tests later",
                rating: -2,
                explanation: "Doesn't follow TDD approach",
              },
            ],
          }],
        })
          .spec("Follow 'worse is better' philosophy")
          .spec("Ship working solutions quickly"))));
```

### Writing style enforcer

```typescript
const writingStyle = bf.createDeck("writing-style", (deck) =>
  deck
    .card("Behavior", (c) =>
      c.card("Capitalization", (cap) =>
        cap.spec("Always use sentence case", {
          samples: [{
            input: {
              text: "Write a heading for getting started",
              context: "Documentation header",
            },
            responses: [
              {
                text: "Getting started guide",
                rating: 3,
                explanation: "Correct sentence case",
              },
              {
                text: "Getting Started Guide",
                rating: -2,
                explanation: "Uses title case instead of sentence case",
              },
            ],
          }],
        })
          .spec("Never use ALLCAPS except for acronyms"))
        .card("Punctuation", (punc) =>
          punc.spec("Always use Oxford comma", {
            samples: [{
              input: {
                text: "List three programming languages",
                context: "Technical writing",
              },
              responses: [
                {
                  text: "Python, JavaScript, and TypeScript",
                  rating: 3,
                  explanation: "Uses Oxford comma correctly",
                },
                {
                  text: "Python, JavaScript and TypeScript",
                  rating: -2,
                  explanation: "Missing Oxford comma",
                },
              ],
            }],
          })
            .spec("Never use em dashes, use colons instead"))));
```

## License

MIT
