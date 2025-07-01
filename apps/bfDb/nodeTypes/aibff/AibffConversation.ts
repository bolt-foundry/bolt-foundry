import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

export interface AibffMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AibffConversationMetadata {
  id: string;
  created_at: string;
  updated_at: string;
}

export class AibffConversation {
  private metadata: AibffConversationMetadata;
  private messages: Array<AibffMessage>;
  private static conversationsDir = new URL(
    import.meta.resolve("@bfmono/tmp/conversations"),
  ).pathname;

  private get conversationsDir() {
    return AibffConversation.conversationsDir;
  }

  constructor(id?: string) {
    const now = new Date().toISOString();
    this.metadata = {
      id: id || this.generateConversationId(),
      created_at: now,
      updated_at: now,
    };
    this.messages = [];
  }

  // Static factory methods
  static async load(conversationId: string): Promise<AibffConversation> {
    const conversation = new AibffConversation(conversationId);
    await conversation.loadFromFile();
    return conversation;
  }

  static async create(
    initialMessage?: AibffMessage,
  ): Promise<AibffConversation> {
    const conversation = new AibffConversation();
    if (initialMessage) {
      conversation.addMessage(initialMessage);
      await conversation.save();
    }
    return conversation;
  }

  // Getters
  getId(): string {
    return this.metadata.id;
  }

  getMessages(): Array<AibffMessage> {
    return [...this.messages];
  }

  getMetadata(): AibffConversationMetadata {
    return { ...this.metadata };
  }

  // Message management
  addMessage(
    message: Omit<AibffMessage, "id" | "timestamp"> & {
      id?: string;
      timestamp?: string;
    },
  ): AibffMessage {
    const newMessage: AibffMessage = {
      id: message.id || Date.now().toString(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp || new Date().toISOString(),
    };
    this.messages.push(newMessage);
    this.metadata.updated_at = new Date().toISOString();
    return newMessage;
  }

  updateMessage(messageId: string, content: string): boolean {
    const message = this.messages.find((m) => m.id === messageId);
    if (message) {
      message.content = content;
      this.metadata.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Persistence methods
  async save(): Promise<void> {
    try {
      await Deno.mkdir(this.conversationsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const content = this.toMarkdown();
    const filename = `${this.conversationsDir}/${this.metadata.id}.md`;
    await Deno.writeTextFile(filename, content);
    logger.debug(`Saved conversation ${this.metadata.id}`);
  }

  async loadFromFile(): Promise<void> {
    const filename = `${this.conversationsDir}/${this.metadata.id}.md`;

    try {
      const markdown = await Deno.readTextFile(filename);
      this.parseMarkdown(markdown);
      logger.debug(`Loaded conversation ${this.metadata.id}`);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`Conversation ${this.metadata.id} not found`);
      }
      throw error;
    }
  }

  async exists(): Promise<boolean> {
    try {
      const filename = `${this.conversationsDir}/${this.metadata.id}.md`;
      await Deno.stat(filename);
      return true;
    } catch {
      return false;
    }
  }

  // Format conversion
  private toMarkdown(): string {
    const frontmatter = `+++
id = "${this.metadata.id}"
created_at = "${this.metadata.created_at}"
updated_at = "${this.metadata.updated_at}"
+++`;

    const markdownContent = this.messages.map((msg) => {
      const role = msg.role === "user" ? "User" : "Assistant";
      return `## ${role}
_${msg.timestamp}_

${msg.content}`;
    }).join("\n\n");

    return `${frontmatter}\n\n# Conversation ${this.metadata.id}\n\n${markdownContent}`;
  }

  private parseMarkdown(markdown: string): void {
    const lines = markdown.split("\n");
    const messages: Array<AibffMessage> = [];
    let currentMessage: Partial<AibffMessage> | null = null;
    let inFrontmatter = false;
    let messageIdCounter = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Parse frontmatter
      if (line === "+++") {
        inFrontmatter = !inFrontmatter;
        continue;
      }

      if (inFrontmatter) {
        const match = line.match(/^(\w+)\s*=\s*"(.+)"$/);
        if (match) {
          const [, key, value] = match;
          if (key === "id") this.metadata.id = value;
          else if (key === "created_at") this.metadata.created_at = value;
          else if (key === "updated_at") this.metadata.updated_at = value;
        }
        continue;
      }

      // Parse messages
      if (line.startsWith("## User") || line.startsWith("## Assistant")) {
        // Save previous message if exists
        if (currentMessage && currentMessage.content) {
          messages.push({
            id: currentMessage.id || `msg-${messageIdCounter++}`,
            role: currentMessage.role!,
            content: currentMessage.content.trim(),
            timestamp: currentMessage.timestamp || new Date().toISOString(),
          });
        }

        // Start new message
        const role = line.includes("User") ? "user" : "assistant";
        const timestampLine = lines[i + 1];
        const timestamp = timestampLine?.match(/_(.+)_/)?.[1] ||
          new Date().toISOString();

        currentMessage = {
          role: role as "user" | "assistant",
          timestamp,
          content: "",
        };

        i++; // Skip timestamp line
      } else if (currentMessage && line.trim()) {
        // Add content to current message
        currentMessage.content = (currentMessage.content || "") +
          (currentMessage.content ? "\n" : "") + line;
      }
    }

    // Don't forget the last message
    if (currentMessage && currentMessage.content) {
      messages.push({
        id: `msg-${messageIdCounter}`,
        role: currentMessage.role!,
        content: currentMessage.content.trim(),
        timestamp: currentMessage.timestamp || new Date().toISOString(),
      });
    }

    this.messages = messages;
  }

  private generateConversationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `conv-${timestamp}-${random}`;
  }

  // Utility methods for streaming
  createStreamingMessage(
    role: "user" | "assistant" = "assistant",
  ): AibffMessage {
    return this.addMessage({
      role,
      content: "",
    });
  }

  appendToMessage(messageId: string, content: string): boolean {
    const message = this.messages.find((m) => m.id === messageId);
    if (message) {
      message.content += content;
      this.metadata.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Check if conversation is recently created (for initial message generation)
  isRecentlyCreated(thresholdMs: number = 10000): boolean {
    const createdAt = new Date(this.metadata.created_at).getTime();
    const now = Date.now();
    return now - createdAt < thresholdMs;
  }

  // Static method to get conversations directory
  static getConversationsDirectory(): string {
    return AibffConversation.conversationsDir;
  }
}
