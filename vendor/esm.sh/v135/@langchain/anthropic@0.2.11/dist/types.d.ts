import Anthropic from "https://esm.sh/v135/@anthropic-ai/sdk@0.22.0/index.d.mts";
export type AnthropicToolResponse = {
    type: "tool_use";
    id: string;
    name: string;
    input: Record<string, any>;
};
export type AnthropicMessageParam = Anthropic.MessageParam;
export type AnthropicMessageResponse = Anthropic.ContentBlock | AnthropicToolResponse;
export type AnthropicMessageCreateParams = Anthropic.MessageCreateParamsNonStreaming;
export type AnthropicStreamingMessageCreateParams = Anthropic.MessageCreateParamsStreaming;
export type AnthropicMessageStreamEvent = Anthropic.MessageStreamEvent;
export type AnthropicRequestOptions = Anthropic.RequestOptions;
