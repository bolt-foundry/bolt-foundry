"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPromptToAnthropic = void 0;
const message_inputs_js_1 = require("./message_inputs.cjs");
/**
 * Convert a formatted LangChain prompt (e.g. pulled from the hub) into
 * a format expected by Anthropic's JS SDK.
 *
 * Requires the "@langchain/anthropic" package to be installed in addition
 * to the Anthropic SDK.
 *
 * @example
 * ```ts
 * import { convertPromptToAnthropic } from "langsmith/utils/hub/anthropic";
 * import { pull } from "langchain/hub";
 *
 * import Anthropic from '@anthropic-ai/sdk';
 *
 * const prompt = await pull("jacob/joke-generator");
 * const formattedPrompt = await prompt.invoke({
 *   topic: "cats",
 * });
 *
 * const { system, messages } = convertPromptToAnthropic(formattedPrompt);
 *
 * const anthropicClient = new Anthropic({
 *   apiKey: 'your_api_key',
 * });
 *
 * const anthropicResponse = await anthropicClient.messages.create({
 *   model: "claude-3-5-sonnet-20240620",
 *   max_tokens: 1024,
 *   stream: false,
 *   system,
 *   messages,
 * });
 * ```
 * @param formattedPrompt
 * @returns A partial Anthropic payload.
 */
function convertPromptToAnthropic(formattedPrompt) {
    const messages = formattedPrompt.toChatMessages();
    const anthropicBody = (0, message_inputs_js_1._convertMessagesToAnthropicPayload)(messages);
    if (anthropicBody.messages === undefined) {
        anthropicBody.messages = [];
    }
    return anthropicBody;
}
exports.convertPromptToAnthropic = convertPromptToAnthropic;
