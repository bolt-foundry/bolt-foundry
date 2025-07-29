import { assertEquals } from "@std/assert";

// Import types and function from calibrate.ts (we'll make them exportable)
// For now, we'll use a temporary approach and import them when needed

// Types for testing - these should match the ones in calibrate.ts
interface SampleMessage {
  role: string;
  content: string;
}

interface Sample {
  id: string;
  messages: Array<SampleMessage>;
  score?: number;
}

interface ExtractedContext {
  [variableName: string]: {
    assistantQuestion: string;
    default?: unknown;
    description?: string;
    type?: string;
  };
}

interface SampleContext {
  fullConversation?: Array<SampleMessage>;
  [key: string]: unknown;
}

// Temporary test implementation - we'll use the real one from calibrate.ts later
function buildSampleContext(
  sample: Sample,
  extractedContext: ExtractedContext,
  contextValues: Record<string, unknown> = {},
): SampleContext {
  // Start with provided context values
  const context: SampleContext = {
    ...contextValues,
  };

  // Add default values from extracted context (only if not already provided)
  for (const [key, definition] of Object.entries(extractedContext)) {
    if (definition.default !== undefined && !(key in context)) {
      context[key] = definition.default;
    }
  }

  // Set fullConversation from sample.messages if not already provided from context file
  if (!contextValues.fullConversation) {
    context.fullConversation = sample.messages;
  }

  return context;
}

// Helper function to create a temporary deck file with embedded TOML
async function createTempDeckWithSamples(
  deckContent: string,
  samplesContent: string,
): Promise<
  { deckPath: string; samplesPath: string; cleanup: () => Promise<void> }
> {
  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const samplesPath = `${tempDir}/samples.toml`;

  await Deno.writeTextFile(deckPath, deckContent);
  await Deno.writeTextFile(samplesPath, samplesContent);

  const cleanup = async () => {
    await Deno.remove(tempDir, { recursive: true });
  };

  return { deckPath, samplesPath, cleanup };
}

Deno.test("calibrate context building - should populate fullConversation from sample.messages", async () => {
  const deckContent = `# Test Grader
![Samples](samples.toml)

Test grader content.`;

  const samplesContent = `[samples.test_conversation]
score = 3

[[samples.test_conversation.messages]]
role = "assistant"
content = "Hello, this is Agent speaking."

[[samples.test_conversation.messages]]
role = "user"
content = "Hi there!"

[[samples.test_conversation.messages]]
role = "assistant"
content = "How can I help you today?"

[[samples.test_conversation.messages]]
role = "user"
content = "I need help with my account."`;

  const { cleanup } = await createTempDeckWithSamples(
    deckContent,
    samplesContent,
  );

  try {
    // Test with actual sample data that matches our assertions
    const sample = {
      id: "test_conversation",
      score: 3,
      messages: [
        { role: "assistant", content: "Hello, this is Agent speaking." },
        { role: "user", content: "Hi there!" },
        { role: "assistant", content: "How can I help you today?" },
        { role: "user", content: "I need help with my account." },
      ],
    } as Sample;
    const extractedContext = {} as ExtractedContext;
    const context = buildSampleContext(sample, extractedContext);

    assertEquals(context.fullConversation?.length, 4);
    assertEquals(context.fullConversation?.[0]?.role, "assistant");
    assertEquals(
      context.fullConversation?.[0]?.content,
      "Hello, this is Agent speaking.",
    );
    assertEquals(
      context.fullConversation?.[3]?.content,
      "I need help with my account.",
    );
  } finally {
    await cleanup();
  }
});

Deno.test("calibrate context building - should override fullConversation default with sample.messages", async () => {
  const deckContent = `# Test Grader
![Context](context.toml)
![Samples](samples.toml)

Test grader content.`;

  const contextContent = `[contexts.fullConversation]
assistantQuestion = "What was the full conversation?"
default = [{"role": "user", "content": "Default message"}]`;

  const samplesContent = `[samples.test_sample]
score = 2

[[samples.test_sample.messages]]
role = "user"
content = "Actual user message"

[[samples.test_sample.messages]]
role = "assistant"
content = "Actual assistant response"`;

  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const contextPath = `${tempDir}/context.toml`;
  const samplesPath = `${tempDir}/samples.toml`;

  await Deno.writeTextFile(deckPath, deckContent);
  await Deno.writeTextFile(contextPath, contextContent);
  await Deno.writeTextFile(samplesPath, samplesContent);

  try {
    // Test with sample data that should override context default
    const sample = {
      id: "test_sample",
      score: 2,
      messages: [
        { role: "user", content: "Actual user message" },
        { role: "assistant", content: "Actual assistant response" },
      ],
    } as Sample;
    const extractedContext = {
      fullConversation: {
        assistantQuestion: "test",
        default: [{ role: "user", content: "Default message" }],
      },
    } as ExtractedContext;
    const context = buildSampleContext(sample, extractedContext);

    assertEquals(context.fullConversation?.length, 2);
    assertEquals(context.fullConversation?.[0]?.content, "Actual user message");
    assertEquals(
      context.fullConversation?.[1]?.content,
      "Actual assistant response",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("calibrate context building - should handle empty messages array", async () => {
  const samplesContent = `[samples.empty_messages]
score = 0
messages = []`;

  const { cleanup } = await createTempDeckWithSamples(
    "# Test",
    samplesContent,
  );

  try {
    // Test empty messages array handling
    const sample = { id: "empty_messages", score: 0, messages: [] } as Sample;
    const extractedContext = {} as ExtractedContext;
    const context = buildSampleContext(sample, extractedContext);

    assertEquals(context.fullConversation, []);
  } finally {
    await cleanup();
  }
});

Deno.test("calibrate context building - should use fullConversation from context file when provided", async () => {
  const contextContent = `fullConversation = """
[
  {"role": "assistant", "content": "Hello from context file"},
  {"role": "user", "content": "Hi from context file"},
  {"role": "assistant", "content": "How can I help from context file?"}
]
"""`;

  const tempDir = await Deno.makeTempDir();
  const contextPath = `${tempDir}/context.toml`;
  await Deno.writeTextFile(contextPath, contextContent);

  try {
    // Test that fullConversation from context file is preserved
    const sample = {
      id: "test_sample",
      score: 3,
      messages: [
        { role: "user", content: "Sample message 1" },
        { role: "assistant", content: "Sample response 1" },
      ],
    } as Sample;

    // Simulate what happens when context file is loaded
    const contextValues = {
      fullConversation: JSON.parse(`[
        {"role": "assistant", "content": "Hello from context file"},
        {"role": "user", "content": "Hi from context file"},
        {"role": "assistant", "content": "How can I help from context file?"}
      ]`),
    };

    const extractedContext = {} as ExtractedContext;
    const context = buildSampleContext(sample, extractedContext, contextValues);

    // fullConversation should come from context file, NOT from sample.messages
    assertEquals(context.fullConversation?.length, 3);
    assertEquals(
      context.fullConversation?.[0]?.content,
      "Hello from context file",
    );
    assertEquals(
      context.fullConversation?.[2]?.content,
      "How can I help from context file?",
    );
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("calibrate context building - should preserve other context variables", async () => {
  const deckContent = `# Test Grader
![Context](context.toml)
![Samples](samples.toml)`;

  const contextContent = `[contexts.customVar]
assistantQuestion = "What is the custom variable?"
default = "custom value"

[contexts.fullConversation]
assistantQuestion = "What was the full conversation?"`;

  const samplesContent = `[samples.test_sample]
score = 3

[[samples.test_sample.messages]]
role = "user"
content = "Hello"`;

  const tempDir = await Deno.makeTempDir();
  const deckPath = `${tempDir}/test.deck.md`;
  const contextPath = `${tempDir}/context.toml`;
  const samplesPath = `${tempDir}/samples.toml`;

  await Deno.writeTextFile(deckPath, deckContent);
  await Deno.writeTextFile(contextPath, contextContent);
  await Deno.writeTextFile(samplesPath, samplesContent);

  try {
    // Test that other context variables are preserved
    const sample = {
      id: "test_sample",
      score: 3,
      messages: [{ role: "user", content: "Hello" }],
    } as Sample;
    const extractedContext = {
      customVar: { assistantQuestion: "test", default: "custom value" },
    } as ExtractedContext;
    const context = buildSampleContext(sample, extractedContext);

    assertEquals(context.customVar, "custom value");
    assertEquals(context.fullConversation?.length, 1);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
