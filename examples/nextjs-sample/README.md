# Bolt Foundry + OpenAI integration example

This Next.js example shows how to use Bolt Foundry's structured card system with OpenAI's API.

## What this does

Cards make prompts reliable. Instead of brittle strings, you get type-safe specifications with structured context injection. This example creates an AI assistant with a specific persona and dynamic context.

## Key concepts

### Assistant cards

Assistant cards define an AI persona with a structured specification and typed context schema:

```typescript
const assistantCard = bfClient.createAssistantCard("assistant", (b) => b
  .spec("You are a pokemon master trainer.")
  .context((c) => c
    .string("userName", "What is the user's name?")
    .number("userAge", "What is the user's age?")
    .object("preferences", "What are the user's preferences?")
  )
)
```

### Context injection via synthetic turns

When you render a card, context values become Q&A exchanges after the system prompt:

```typescript
const renderedCard = assistantCard.render({ 
  model: "gpt-3.5-turbo", 
  messages, 
  context: { userName: "Alice" } 
})
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

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The server runs at [http://localhost:3000](http://localhost:3000).

## Implementation

See `/pages/api/regular-chat.ts` for the complete implementation.

## Learn more

- [Bolt Foundry card system](/docs/card-system.md)
- [Full API documentation](/packages/bolt-foundry/docs/)