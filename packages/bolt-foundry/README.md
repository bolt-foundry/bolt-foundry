# Bolt Foundry

This package provides utilities for working with the Bolt Foundry platform.

## Features

### `connectBoltFoundry`

A fetch wrapper that adds authentication and logging for OpenAI API requests.

### Builder Pattern

A flexible, immutable builder pattern for creating structured AI assistant
specifications. This pattern provides:

- **Generic `Spec` and `SpecBuilder` types** for creating hierarchical,
  structured data
- **Flexible `.spec()` and `.specs()` methods** for unopinionated composition
- **Immutable builders** that return new instances, ensuring predictable
  behavior

See [builders/README.md](builders/README.md) for detailed documentation.

## Usage

```typescript
import { BfClient } from "@bolt-foundry/bolt-foundry";
import OpenAI from "openai";

// Create a Bolt Foundry client
const bfClient = BfClient.create({
  apiKey: process.env.BOLT_FOUNDRY_API_KEY, // Optional: for telemetry
});

// Use the wrapped fetch with OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: bfClient.fetch,
});

// Create an assistant with structured prompts
const assistant = bfClient.createAssistant(
  "coding-helper",
  (a) =>
    a.specs("persona", (p) =>
      p.spec("An expert TypeScript developer")
        .spec("Detail-oriented and helpful"))
      .specs("constraints", (c) =>
        c.spec("Always use TypeScript")
          .spec("Follow best practices")
          .spec("Explain code clearly")),
);

// Render to OpenAI format and use
const chatParams = assistant.render({
  messages: [{ role: "user", content: "Help me write a function" }],
});

const completion = await openai.chat.completions.create(chatParams);
```

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

- [Project Plan](docs/README.md)
- [v0.0 Implementation](docs/V0.0.md) - Generic spec foundation
- [v0.1 Implementation](docs/V0.1.md) - Simplified card system
- [Changelog](docs/CHANGELOG.md)

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
