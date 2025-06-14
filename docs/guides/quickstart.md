# Quickstart

Welcome to Bolt Foundry! This quickstart guide will help you get up and running
with structured prompts in minutes.

## Installation

```bash
npm install @bolt-foundry/bolt-foundry
```

## Your First Structured Prompt

Here's a simple example showing how Bolt Foundry improves JSON output
reliability:

### Before (Traditional Approach)

```typescript
const prompt =
  `You are a helpful assistant. Please analyze the sentiment of the following text and return JSON with score and reasoning. Text: "${userText}"`;

// Results are inconsistent - sometimes valid JSON, sometimes not
```

### After (Bolt Foundry Approach)

```typescript
import { BfClient } from "@bolt-foundry/bolt-foundry";

const client = BfClient.create();

const sentimentAnalyzer = client.createAssistantCard(
  "sentiment-analyzer",
  (card) =>
    card
      .spec("Analyze sentiment and return structured JSON")
      .context((ctx) => ctx.string("userText", "The text to analyze")),
);

// Always returns valid, structured JSON
const result = await client.generate(sentimentAnalyzer, {
  userText: "I love this product!",
});
```

## Next Steps

- Read the [Getting Started](/404.md) guide for a deeper understanding
- Explore more examples in our documentation
- Join our community for support and updates
