import type { MessageCreateParams } from "@anthropic-ai/sdk/resources/index.mjs";
import { AIMessageChunk } from "@langchain/core/messages";
import { ToolCallChunk } from "@langchain/core/messages/tool";
import { AnthropicToolChoice } from "../types.js";
export declare function handleToolChoice(toolChoice?: AnthropicToolChoice): MessageCreateParams.ToolChoiceAuto | MessageCreateParams.ToolChoiceAny | MessageCreateParams.ToolChoiceTool | undefined;
export declare function extractToolCallChunk(chunk: AIMessageChunk): ToolCallChunk | undefined;
