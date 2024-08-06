import { Anthropic, type ClientOptions } from "https://esm.sh/v135/@anthropic-ai/sdk@0.22.0/index.d.mts";
import type { Stream } from "https://esm.sh/v135/@anthropic-ai/sdk@0.22.0/streaming.d.ts";
import { CallbackManagerForLLMRun } from "https://esm.sh/v135/@langchain/core@0.2.18/callbacks/manager.d.ts";
import { AIMessageChunk, type BaseMessage } from "https://esm.sh/v135/@langchain/core@0.2.18/messages.d.ts";
import { ChatGenerationChunk, type ChatResult } from "https://esm.sh/v135/@langchain/core@0.2.18/outputs.d.ts";
import { BaseChatModel, BaseChatModelCallOptions, LangSmithParams, type BaseChatModelParams } from "https://esm.sh/v135/@langchain/core@0.2.18/language_models/chat_models.d.ts";
import { type StructuredOutputMethodOptions, type BaseLanguageModelInput, type ToolDefinition } from "https://esm.sh/v135/@langchain/core@0.2.18/language_models/base.d.ts";
import { StructuredToolInterface } from "https://esm.sh/v135/@langchain/core@0.2.18/tools.d.ts";
import { Runnable, RunnableToolLike } from "https://esm.sh/v135/@langchain/core@0.2.18/runnables.d.ts";
import { z } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import type { Tool as AnthropicTool } from "https://esm.sh/v135/@anthropic-ai/sdk@0.22.0/resources/index.d.ts";
import { AnthropicToolChoice, AnthropicToolTypes } from "./utils/tools.d.ts";
import { AnthropicMessageCreateParams, AnthropicMessageStreamEvent, AnthropicRequestOptions, AnthropicStreamingMessageCreateParams } from "./types.d.ts";
export interface ChatAnthropicCallOptions extends BaseChatModelCallOptions, Pick<AnthropicInput, "streamUsage"> {
    tools?: AnthropicToolTypes[];
    /**
     * Whether or not to specify what tool the model should use
     * @default "auto"
     */
    tool_choice?: AnthropicToolChoice;
}
/**
 * Input to AnthropicChat class.
 */
export interface AnthropicInput {
    /** Amount of randomness injected into the response. Ranges
     * from 0 to 1. Use temp closer to 0 for analytical /
     * multiple choice, and temp closer to 1 for creative
     * and generative tasks.
     */
    temperature?: number;
    /** Only sample from the top K options for each subsequent
     * token. Used to remove "long tail" low probability
     * responses. Defaults to -1, which disables it.
     */
    topK?: number;
    /** Does nucleus sampling, in which we compute the
     * cumulative distribution over all the options for each
     * subsequent token in decreasing probability order and
     * cut it off once it reaches a particular probability
     * specified by top_p. Defaults to -1, which disables it.
     * Note that you should either alter temperature or top_p,
     * but not both.
     */
    topP?: number;
    /** A maximum number of tokens to generate before stopping. */
    maxTokens?: number;
    /**
     * A maximum number of tokens to generate before stopping.
     * @deprecated Use "maxTokens" instead.
     */
    maxTokensToSample?: number;
    /** A list of strings upon which to stop generating.
     * You probably want `["\n\nHuman:"]`, as that's the cue for
     * the next turn in the dialog agent.
     */
    stopSequences?: string[];
    /** Whether to stream the results or not */
    streaming?: boolean;
    /** Anthropic API key */
    anthropicApiKey?: string;
    /** Anthropic API key */
    apiKey?: string;
    /** Anthropic API URL */
    anthropicApiUrl?: string;
    /** Model name to use */
    modelName: string;
    /** Model name to use */
    model: string;
    /** Overridable Anthropic ClientOptions */
    clientOptions: ClientOptions;
    /** Holds any additional parameters that are valid to pass to {@link
     * https://console.anthropic.com/docs/api/reference |
     * `anthropic.messages`} that are not explicitly specified on this class.
     */
    invocationKwargs?: Kwargs;
    /**
     * Whether or not to include token usage data in streamed chunks.
     * @default true
     */
    streamUsage?: boolean;
}
/**
 * A type representing additional parameters that can be passed to the
 * Anthropic API.
 */
type Kwargs = Record<string, any>;
/**
 * Wrapper around Anthropic large language models.
 *
 * To use you should have the `@anthropic-ai/sdk` package installed, with the
 * `ANTHROPIC_API_KEY` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://console.anthropic.com/docs/api/reference |
 * `anthropic.messages`} can be passed through {@link invocationKwargs},
 * even if not explicitly available on this class.
 * @example
 * ```typescript
 * import { ChatAnthropic } from "@langchain/anthropic";
 *
 * const model = new ChatAnthropic({
 *   temperature: 0.9,
 *   apiKey: 'YOUR-API-KEY',
 * });
 * const res = await model.invoke({ input: 'Hello!' });
 * console.log(res);
 * ```
 */
export declare class ChatAnthropicMessages<CallOptions extends ChatAnthropicCallOptions = ChatAnthropicCallOptions> extends BaseChatModel<CallOptions, AIMessageChunk> implements AnthropicInput {
    static lc_name(): string;
    get lc_secrets(): {
        [key: string]: string;
    } | undefined;
    get lc_aliases(): Record<string, string>;
    lc_serializable: boolean;
    anthropicApiKey?: string;
    apiKey?: string;
    apiUrl?: string;
    temperature: number;
    topK: number;
    topP: number;
    maxTokens: number;
    modelName: string;
    model: string;
    invocationKwargs?: Kwargs;
    stopSequences?: string[];
    streaming: boolean;
    clientOptions: ClientOptions;
    protected batchClient: Anthropic;
    protected streamingClient: Anthropic;
    streamUsage: boolean;
    constructor(fields?: Partial<AnthropicInput> & BaseChatModelParams);
    getLsParams(options: this["ParsedCallOptions"]): LangSmithParams;
    /**
     * Formats LangChain StructuredTools to AnthropicTools.
     *
     * @param {ChatAnthropicCallOptions["tools"]} tools The tools to format
     * @returns {AnthropicTool[] | undefined} The formatted tools, or undefined if none are passed.
     * @throws {Error} If a mix of AnthropicTools and StructuredTools are passed.
     */
    formatStructuredToolToAnthropic(tools: ChatAnthropicCallOptions["tools"]): AnthropicTool[] | undefined;
    bindTools(tools: (AnthropicTool | Record<string, unknown> | StructuredToolInterface | ToolDefinition | RunnableToolLike)[], kwargs?: Partial<CallOptions>): Runnable<BaseLanguageModelInput, AIMessageChunk, CallOptions>;
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams(options?: this["ParsedCallOptions"]): Omit<AnthropicMessageCreateParams | AnthropicStreamingMessageCreateParams, "messages"> & Kwargs;
    /** @ignore */
    _identifyingParams(): {
        system?: string | undefined;
        model: "claude-2.1" | (string & {}) | "claude-3-opus-20240229" | "claude-3-sonnet-20240229" | "claude-3-haiku-20240307" | "claude-2.0" | "claude-instant-1.2";
        max_tokens: number;
        tools?: Anthropic.Messages.Tool[] | undefined;
        tool_choice?: Anthropic.Messages.MessageCreateParams.ToolChoiceAuto | Anthropic.Messages.MessageCreateParams.ToolChoiceAny | Anthropic.Messages.MessageCreateParams.ToolChoiceTool | undefined;
        metadata?: Anthropic.Messages.MessageCreateParams.Metadata | undefined;
        temperature?: number | undefined;
        stream?: boolean | undefined;
        stop_sequences?: string[] | undefined;
        top_k?: number | undefined;
        top_p?: number | undefined;
        model_name: string;
    };
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams(): {
        system?: string | undefined;
        model: "claude-2.1" | (string & {}) | "claude-3-opus-20240229" | "claude-3-sonnet-20240229" | "claude-3-haiku-20240307" | "claude-2.0" | "claude-instant-1.2";
        max_tokens: number;
        tools?: Anthropic.Messages.Tool[] | undefined;
        tool_choice?: Anthropic.Messages.MessageCreateParams.ToolChoiceAuto | Anthropic.Messages.MessageCreateParams.ToolChoiceAny | Anthropic.Messages.MessageCreateParams.ToolChoiceTool | undefined;
        metadata?: Anthropic.Messages.MessageCreateParams.Metadata | undefined;
        temperature?: number | undefined;
        stream?: boolean | undefined;
        stop_sequences?: string[] | undefined;
        top_k?: number | undefined;
        top_p?: number | undefined;
        model_name: string;
    };
    _streamResponseChunks(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): AsyncGenerator<ChatGenerationChunk>;
    /** @ignore */
    _generateNonStreaming(messages: BaseMessage[], params: Omit<Anthropic.Messages.MessageCreateParamsNonStreaming | Anthropic.Messages.MessageCreateParamsStreaming, "messages"> & Kwargs, requestOptions: AnthropicRequestOptions): Promise<{
        generations: import("https://esm.sh/v135/@langchain/core@0.2.18/outputs.d.ts").ChatGeneration[];
        llmOutput: {
            id: string;
            model: string;
            stop_reason: "tool_use" | "stop_sequence" | "end_turn" | "max_tokens" | null;
            stop_sequence: string | null;
            usage: Anthropic.Messages.Usage;
        };
    }>;
    /** @ignore */
    _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
    /**
     * Creates a streaming request with retry.
     * @param request The parameters for creating a completion.
     * @param options
     * @returns A streaming request.
     */
    protected createStreamWithRetry(request: AnthropicStreamingMessageCreateParams & Kwargs, options?: AnthropicRequestOptions): Promise<Stream<AnthropicMessageStreamEvent>>;
    /** @ignore */
    protected completionWithRetry(request: AnthropicMessageCreateParams & Kwargs, options: AnthropicRequestOptions): Promise<Anthropic.Message>;
    _llmType(): string;
    withStructuredOutput<RunOutput extends Record<string, any> = Record<string, any>>(outputSchema: z.ZodType<RunOutput> | Record<string, any>, config?: StructuredOutputMethodOptions<false>): Runnable<BaseLanguageModelInput, RunOutput>;
    withStructuredOutput<RunOutput extends Record<string, any> = Record<string, any>>(outputSchema: z.ZodType<RunOutput> | Record<string, any>, config?: StructuredOutputMethodOptions<true>): Runnable<BaseLanguageModelInput, {
        raw: BaseMessage;
        parsed: RunOutput;
    }>;
}
export declare class ChatAnthropic extends ChatAnthropicMessages {
}
export {};
