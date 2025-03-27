
# Bolt Foundry

This package provides utilities for working with the Bolt Foundry platform.

## Features

### `createFoundry`

A fetch wrapper that modifies OpenAI API requests to include authentication and model override.

### `createMockOpenAi`

Creates a mock OpenAI client for testing without making real API calls.

## Usage

### With real OpenAI

```typescript
import { createFoundry } from "@bolt-foundry/bolt-foundry";
import OpenAi from "@openai/openai";

const openai = new OpenAi({
  fetch: createFoundry(Deno.env.get("OPENAI_API_KEY"))
});

const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant."
    },
    {
      role: "user",
      content: "Say hello world!"
    }
  ],
});
```

### With mock OpenAI

```typescript
import { createMockOpenAi } from "@bolt-foundry/bolt-foundry/mock-openai";

// Create a mock client that doesn't make real API calls
const mockOpenAi = createMockOpenAi();

const completion = await mockOpenAi.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant."
    },
    {
      role: "user",
      content: "Say hello world!"
    }
  ],
});
```

