# Bolt Foundry + OpenAI integration example

This Next.js example shows how to use Bolt Foundry's structured deck system with
OpenAI's API.

## What this does

Decks make prompts reliable. Instead of brittle strings, you get type-safe
specifications with structured context injection. This example creates an AI
assistant with a specific persona and dynamic context.

## Key concepts

### Assistant decks

Assistant decks define an AI persona with a structured specification and typed
context schema:

```typescript
const assistantDeck = bfClient.createAssistantDeck("assistant", (b) =>
  b
    .spec("You are a pokemon master trainer.")
    .context((c) =>
      c
        .string("userName", "What is the user's name?")
        .number("userAge", "What is the user's age?")
        .object("preferences", "What are the user's preferences?")
    ));
```

### Context injection via synthetic turns

When you render a deck, context values become Q&A exchanges after the system
prompt:

```typescript
const renderedDeck = assistantDeck.render({
  model: "gpt-3.5-turbo",
  messages,
  context: { userName: "Alice" },
});
```

This produces:

```
System: "You are a pokemon master trainer."
Assistant: "What is the user's name?"
User: "Alice"
[...original conversation messages...]
```

### Why this works

- **Type safety**: Context schema is typed and validated
- **Flexibility**: Provide only the context you need
- **No string interpolation**: Preserves model attention patterns
- **Reusability**: Define once, use with different contexts
- **Testability**: Structured format enables consistent testing

## Getting started

### 1. Set up your OpenAI API key

This example requires an OpenAI API key. You have two options:

**Option A: Environment variable (recommended)**
```bash
# Create a .env.local file
echo "OPENAI_API_KEY=your-api-key-here" > .env.local
```

**Option B: Enter in the UI**
You can also enter your API key directly in the web interface (for testing only).

> **Note:** Never commit API keys to version control. The `.env.local` file is already in `.gitignore`.

### 2. Install and run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The server runs at [http://localhost:3000](http://localhost:3000).

### 3. Try the examples

- **[/chat](http://localhost:3000/chat)** - Streaming chat with OpenAI
- **[/regular-chat](http://localhost:3000/regular-chat)** - Non-streaming chat
- **[/bolt-foundry-example](http://localhost:3000/bolt-foundry-example)** - Bolt Foundry integration

## Implementation

See `/pages/api/regular-chat.ts` for the complete implementation.

## Learn more

- [Bolt Foundry deck system](../../docs/guides/deck-system.md)
- [Full API documentation](/packages/bolt-foundry/docs/)
