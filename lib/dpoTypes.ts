
/**
 * Types for Direct Preference Optimization (DPO) fine-tuning
 */

/**
 * Message roles in a conversation
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * Structure of a message in a conversation
 */
export interface Message {
  role: MessageRole;
  content: string;
}

/**
 * Tool interface that can be used by the model
 */
export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

/**
 * Input format for DPO example
 */
export interface DpoInput {
  messages: Message[];
  tools: Tool[];
  parallel_tool_calls: boolean;
}

/**
 * Output message from the assistant
 */
export interface OutputMessage {
  role: "assistant";
  content: string;
}

/**
 * Single example for DPO fine-tuning
 */
export interface DpoExample {
  input: DpoInput;
  preferred_output: OutputMessage[];
  non_preferred_output: OutputMessage[];
}

/**
 * Dataset of DPO examples
 */
export type DpoDataset = DpoExample[];
