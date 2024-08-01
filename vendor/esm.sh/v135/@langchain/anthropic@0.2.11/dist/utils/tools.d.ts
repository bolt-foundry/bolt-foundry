import type { MessageCreateParams, Tool as AnthropicTool } from "https://esm.sh/v135/@anthropic-ai/sdk@0.22.0/resources/index.d.ts";
import { ToolDefinition } from "https://esm.sh/v135/@langchain/core@0.2.18/language_models/base.d.ts";
import { AIMessageChunk } from "https://esm.sh/v135/@langchain/core@0.2.18/messages.d.ts";
import { ToolCallChunk } from "https://esm.sh/v135/@langchain/core@0.2.18/messages/tool.d.ts";
import { RunnableToolLike } from "https://esm.sh/v135/@langchain/core@0.2.18/runnables.d.ts";
import { StructuredToolInterface } from "https://esm.sh/v135/@langchain/core@0.2.18/tools.d.ts";
export type AnthropicToolChoice = {
    type: "tool";
    name: string;
} | "any" | "auto" | "none" | string;
export type AnthropicToolTypes = StructuredToolInterface | AnthropicTool | Record<string, unknown> | ToolDefinition | RunnableToolLike;
export declare function handleToolChoice(toolChoice?: AnthropicToolChoice): MessageCreateParams.ToolChoiceAuto | MessageCreateParams.ToolChoiceAny | MessageCreateParams.ToolChoiceTool | undefined;
export declare function extractToolCallChunk(chunk: AIMessageChunk): ToolCallChunk | undefined;
