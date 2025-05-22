# Bolt Foundry

This package provides utilities for working with the Bolt Foundry platform.

## Features

### `connectBoltFoundry`

A fetch wrapper that adds authentication and logging for OpenAI API requests.

## Usage

### With OpenAI SDK

```typescript
import { connectBoltFoundry } from "@bolt-foundry/bolt-foundry";
import OpenAI from "openai";

// Create OpenAI instance with our custom fetch
const openai = new OpenAI({
  apiKey: "your-api-key-here", // This can be undefined if using fetch wrapper
  fetch: connectBoltFoundry(process.env.OPENAI_API_KEY),
});

// Now use the OpenAI client as normal
const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "Say hello world!",
    },
  ],
});
```

### Integration with NextJS App

Instead of overriding the global fetch function, you can integrate the wrapper
directly in your API handlers or where you initialize the OpenAI client:

```typescript
// pages/api/chat.ts or similar
import { connectBoltFoundry } from "@bolt-foundry/bolt-foundry";
import { OpenAI } from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch: connectBoltFoundry(process.env.OPENAI_API_KEY),
  });

  const response = await openai.chat.completions.create({
    // your configuration
  });

  res.status(200).json(response);
}
```

This approach ensures that only OpenAI API calls are intercepted, while other
fetch calls remain unaffected.

### For Testing

```typescript
import { createMockOpenAi } from "@bolt-foundry/bolt-foundry/mock-openai";

// Create a mock client that doesn't make real API calls
const mockOpenAi = createMockOpenAi();

const completion = await mockOpenAi.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "Say hello world!",
    },
  ],
});
```

## Documentation

- [Project Plan](/docs/project-plan.md)
- [Implementation Plan v0.3](/docs/0.3/implementation-plan.md)
- [Backlog](/docs/backlog.md)

## Development

### Building

```bash
# Build the package
./bin/build.ts
```

### Testing

```bash
# Run tests
bff test packages/bolt-foundry
```

## License

MIT
