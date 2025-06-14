# NextJS Minimal Example

A minimal example demonstrating how to use the Bolt Foundry SDK with Next.js.
This example shows the core functionality with the absolute minimum setup
required.

## Features

- 🤖 Simple chat interface powered by OpenAI
- 📦 Minimal dependencies (just the essentials)
- 🎯 Clear, commented code that's easy to understand
- ⚡ Ready to run in under 5 minutes

## Quick Start

### 1. Clone and Install

```bash
cd examples/nextjs-minimal
npm install
```

### 2. Set up your OpenAI API Key

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-api-key-here
```

Get your API key at: https://platform.openai.com/api-keys

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the chat interface.

## How It Works

This example demonstrates the basic Bolt Foundry pattern:

1. **Frontend** (`pages/index.tsx`): A simple React component that handles the
   chat UI
2. **API Route** (`pages/api/chat.ts`): Uses the Bolt Foundry SDK to process
   messages
3. **Assistant Deck**: Defines the AI's behavior and personality

The key code is in the API route:

```typescript
// Create an assistant deck that defines the AI's behavior
const assistantDeck = bfClient.createAssistantDeck(
  "helpful-assistant",
  (builder) => builder.spec("You are a helpful, friendly assistant."),
);

// Use the deck to process messages
const completion = await client.chat.completions.create(
  assistantDeck.render({
    model: "gpt-3.5-turbo",
    messages,
  }),
);
```

## Project Structure

```
nextjs-minimal/
├── pages/
│   ├── index.tsx        # Main chat interface
│   ├── _app.tsx         # Next.js app wrapper
│   └── api/
│       └── chat.ts      # API endpoint using Bolt Foundry
├── styles/
│   └── globals.css      # Basic styling
├── package.json         # Minimal dependencies
├── tsconfig.json        # TypeScript config
└── .env.example         # Environment variables template
```

## Next Steps

- Customize the assistant's personality in `pages/api/chat.ts`
- Add context parameters to pass user information
- Explore more complex deck compositions
- Check out the [full example](../nextjs-sample) for advanced features

## Learn More

- [Bolt Foundry Documentation](https://boltfoundry.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
