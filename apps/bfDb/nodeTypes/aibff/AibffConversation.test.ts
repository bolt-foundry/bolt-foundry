import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { AibffConversation, type AibffMessage } from "./AibffConversation.ts";

// Helper to clean up test conversations
async function cleanupTestConversations() {
  try {
    const dir = AibffConversation.getConversationsDirectory();
    for await (const entry of Deno.readDir(dir)) {
      if (entry.name.startsWith("conv-test-")) {
        await Deno.remove(`${dir}/${entry.name}`, { recursive: true });
      }
    }
  } catch {
    // Directory might not exist
  }
}

Deno.test("AibffConversation - create new conversation", () => {
  const conversation = new AibffConversation();

  assertExists(conversation.getId());
  assertEquals(conversation.getId().startsWith("conv-"), true);
  assertEquals(conversation.getMessages().length, 0);

  const metadata = conversation.getMetadata();
  assertExists(metadata.created_at);
  assertExists(metadata.updated_at);
  assertEquals(metadata.created_at, metadata.updated_at);
});

Deno.test("AibffConversation - create with custom ID", () => {
  const customId = "conv-test-123";
  const conversation = new AibffConversation(customId);

  assertEquals(conversation.getId(), customId);
});

Deno.test("AibffConversation - add messages", () => {
  const conversation = new AibffConversation();

  const message1 = conversation.addMessage({
    role: "user",
    content: "Hello, world!",
  });

  assertExists(message1.id);
  assertExists(message1.timestamp);
  assertEquals(message1.role, "user");
  assertEquals(message1.content, "Hello, world!");

  const message2 = conversation.addMessage({
    role: "assistant",
    content: "Hi there!",
    id: "custom-id",
    timestamp: "2024-01-01T00:00:00Z",
  });

  assertEquals(message2.id, "custom-id");
  assertEquals(message2.timestamp, "2024-01-01T00:00:00Z");

  const messages = conversation.getMessages();
  assertEquals(messages.length, 2);
  assertEquals(messages[0], message1);
  assertEquals(messages[1], message2);
});

Deno.test("AibffConversation - update message", () => {
  const conversation = new AibffConversation();

  const message = conversation.addMessage({
    role: "user",
    content: "Original content",
  });

  const updated = conversation.updateMessage(message.id, "Updated content");
  assertEquals(updated, true);

  const messages = conversation.getMessages();
  assertEquals(messages[0].content, "Updated content");

  // Try updating non-existent message
  const notUpdated = conversation.updateMessage("non-existent", "Content");
  assertEquals(notUpdated, false);
});

Deno.test("AibffConversation - save and load", async () => {
  await cleanupTestConversations();

  const conversation = new AibffConversation("conv-test-save-load");

  conversation.addMessage({
    role: "user",
    content: "Test message 1",
  });

  conversation.addMessage({
    role: "assistant",
    content: "Test response 1",
  });

  await conversation.save();

  // Load the saved conversation
  const loaded = await AibffConversation.load("conv-test-save-load");

  assertEquals(loaded.getId(), conversation.getId());
  assertEquals(loaded.getMessages().length, 2);
  assertEquals(loaded.getMessages()[0].content, "Test message 1");
  assertEquals(loaded.getMessages()[1].content, "Test response 1");

  const metadata = loaded.getMetadata();
  assertEquals(metadata.id, conversation.getMetadata().id);
  assertEquals(metadata.created_at, conversation.getMetadata().created_at);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - load non-existent conversation", async () => {
  await assertRejects(
    async () => {
      await AibffConversation.load("conv-non-existent");
    },
    Error,
    "Conversation conv-non-existent not found",
  );
});

Deno.test("AibffConversation - exists method", async () => {
  await cleanupTestConversations();

  const conversation = new AibffConversation("conv-test-exists");

  assertEquals(await conversation.exists(), false);

  await conversation.save();

  assertEquals(await conversation.exists(), true);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - streaming methods", () => {
  const conversation = new AibffConversation();

  const streamingMessage = conversation.createStreamingMessage();

  assertEquals(streamingMessage.role, "assistant");
  assertEquals(streamingMessage.content, "");
  assertExists(streamingMessage.id);

  // Append content
  conversation.appendToMessage(streamingMessage.id, "Hello");
  conversation.appendToMessage(streamingMessage.id, " world!");

  const messages = conversation.getMessages();
  assertEquals(messages[0].content, "Hello world!");

  // Try appending to non-existent message
  const appended = conversation.appendToMessage("non-existent", "content");
  assertEquals(appended, false);
});

Deno.test("AibffConversation - isRecentlyCreated", async () => {
  const conversation = new AibffConversation();

  assertEquals(conversation.isRecentlyCreated(), true);
  assertEquals(conversation.isRecentlyCreated(1000), true);

  // Create a conversation with old timestamp
  const oldConversation = new AibffConversation("conv-test-old");
  await oldConversation.save();

  // Manually modify the created_at in the file
  const filename =
    `${AibffConversation.getConversationsDirectory()}/conv-test-old/conv-test-old.md`;
  const content = await Deno.readTextFile(filename);
  const oldDate = new Date(Date.now() - 20000).toISOString(); // 20 seconds ago
  const modifiedContent = content.replace(
    /created_at = "(.+)"/,
    `created_at = "${oldDate}"`,
  );
  await Deno.writeTextFile(filename, modifiedContent);

  // Load and check
  const loaded = await AibffConversation.load("conv-test-old");
  assertEquals(loaded.isRecentlyCreated(), false);
  assertEquals(loaded.isRecentlyCreated(30000), true); // 30 second threshold

  await cleanupTestConversations();
});

Deno.test("AibffConversation - markdown format", async () => {
  await cleanupTestConversations();

  const conversation = new AibffConversation("conv-test-markdown");

  conversation.addMessage({
    role: "user",
    content: "Multi-line\nmessage\ncontent",
    timestamp: "2024-01-01T10:00:00Z",
  });

  conversation.addMessage({
    role: "assistant",
    content: "Response with **markdown**",
    timestamp: "2024-01-01T10:01:00Z",
  });

  await conversation.save();

  // Read the raw file to check format
  const filename =
    `${AibffConversation.getConversationsDirectory()}/conv-test-markdown/conv-test-markdown.md`;
  const content = await Deno.readTextFile(filename);

  // Check frontmatter
  assertEquals(content.includes('id = "conv-test-markdown"'), true);
  assertEquals(content.includes("+++"), true);

  // Check message format
  assertEquals(content.includes("## User\n_2024-01-01T10:00:00Z_"), true);
  assertEquals(content.includes("## Assistant\n_2024-01-01T10:01:00Z_"), true);
  assertEquals(content.includes("Multi-line\nmessage\ncontent"), true);
  assertEquals(content.includes("Response with **markdown**"), true);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - static create method", async () => {
  await cleanupTestConversations();

  // Create without initial message
  const conv1 = await AibffConversation.create();
  assertExists(conv1.getId());
  assertEquals(conv1.getMessages().length, 0);

  // Create with initial message
  const initialMessage: AibffMessage = {
    id: "init-1",
    role: "assistant",
    content: "Welcome!",
    timestamp: new Date().toISOString(),
  };

  const conv2 = await AibffConversation.create(initialMessage);
  assertEquals(conv2.getMessages().length, 1);
  assertEquals(conv2.getMessages()[0].content, "Welcome!");

  // Verify it was saved
  assertEquals(await conv2.exists(), true);

  await cleanupTestConversations();
});

// Workflow file method tests
Deno.test("AibffConversation - workflow files - input samples", async () => {
  await cleanupTestConversations();

  const conversation = await AibffConversation.create();
  const inputSamples = '{"input": "test sample 1"}\n{"input": "test sample 2"}';
  
  // Set input samples
  await conversation.setInputSamples(inputSamples);
  
  // Get input samples
  const retrieved = await conversation.getInputSamples();
  assertEquals(retrieved, inputSamples);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - workflow files - system prompt", async () => {
  await cleanupTestConversations();

  const conversation = await AibffConversation.create();
  const systemPrompt = "You are a helpful AI assistant that provides clear and concise answers.";
  
  // Set system prompt
  await conversation.setSystemPrompt(systemPrompt);
  
  // Get system prompt
  const retrieved = await conversation.getSystemPrompt();
  assertEquals(retrieved, systemPrompt);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - workflow files - output samples", async () => {
  await cleanupTestConversations();

  const conversation = await AibffConversation.create();
  const outputSamples = '{"choices": [{"message": {"content": "response 1"}}]}\n{"choices": [{"message": {"content": "response 2"}}]}';
  
  // Set output samples
  await conversation.setOutputSamples(outputSamples);
  
  // Get output samples
  const retrieved = await conversation.getOutputSamples();
  assertEquals(retrieved, outputSamples);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - workflow files - eval prompt", async () => {
  await cleanupTestConversations();

  const conversation = await AibffConversation.create();
  const evalPrompt = "# Evaluation Criteria\n\nRate the response on accuracy and helpfulness.";
  
  // Set eval prompt
  await conversation.setEvalPrompt(evalPrompt);
  
  // Get eval prompt
  const retrieved = await conversation.getEvalPrompt();
  assertEquals(retrieved, evalPrompt);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - workflow files - eval output", async () => {
  await cleanupTestConversations();

  const conversation = await AibffConversation.create();
  const evalOutput = '{"results": [{"score": 8, "reasoning": "Good response"}]}';
  
  // Set eval output
  await conversation.setEvalOutput(evalOutput);
  
  // Get eval output
  const retrieved = await conversation.getEvalOutput();
  assertEquals(retrieved, evalOutput);

  await cleanupTestConversations();
});

Deno.test("AibffConversation - workflow files - list files", async () => {
  await cleanupTestConversations();

  const conversation = await AibffConversation.create();
  await conversation.save(); // Save the main conversation file
  
  // Create some workflow files
  await conversation.setInputSamples('{"test": "input"}');
  await conversation.setSystemPrompt("Test system prompt");
  await conversation.setOutputSamples('{"test": "output"}');
  
  // List files
  const files = await conversation.listFiles();
  
  // Should include the main conversation file and workflow files
  const fileNames = files.map(f => f.name).sort();
  assertEquals(fileNames.includes(`${conversation.getId()}.md`), true);
  assertEquals(fileNames.includes("input-samples.jsonl"), true);
  assertEquals(fileNames.includes("system-prompt.md"), true);
  assertEquals(fileNames.includes("output-samples.jsonl"), true);
  
  // Check file properties
  const inputFile = files.find(f => f.name === "input-samples.jsonl");
  assertExists(inputFile);
  assertExists(inputFile.size);
  assertExists(inputFile.modified);

  await cleanupTestConversations();
});
