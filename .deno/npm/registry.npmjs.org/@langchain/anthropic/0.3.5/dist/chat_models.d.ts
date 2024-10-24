import { Anthropic, type ClientOptions } from "@anthropic-ai/sdk";
import type { Stream } from "@anthropic-ai/sdk/streaming";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { AIMessageChunk, type BaseMessage } from "@langchain/core/messages";
import { ChatGenerationChunk, type ChatResult } from "@langchain/core/outputs";
import { BaseChatModel, BaseChatModelCallOptions, LangSmithParams, type BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { type StructuredOutputMethodOptions, type BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { Runnable } from "@langchain/core/runnables";
import { z } from "zod";
import type { Tool as AnthropicTool } from "@anthropic-ai/sdk/resources/index.mjs";
import { AnthropicMessageCreateParams, AnthropicMessageStreamEvent, AnthropicRequestOptions, AnthropicStreamingMessageCreateParams, AnthropicToolChoice, ChatAnthropicToolType } from "./types.js";
export interface ChatAnthropicCallOptions extends BaseChatModelCallOptions, Pick<AnthropicInput, "streamUsage"> {
    tools?: ChatAnthropicToolType[];
    /**
     * Whether or not to specify what tool the model should use
     * @default "auto"
     */
    tool_choice?: AnthropicToolChoice;
    /**
     * Custom headers to pass to the Anthropic API
     * when making a request.
     */
    headers?: Record<string, string>;
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
    /** @deprecated Use "model" instead */
    modelName?: string;
    /** Model name to use */
    model?: string;
    /** Overridable Anthropic ClientOptions */
    clientOptions?: ClientOptions;
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
    /**
     * Optional method that returns an initialized underlying Anthropic client.
     * Useful for accessing Anthropic models hosted on other cloud services
     * such as Google Vertex.
     */
    createClient?: (options: ClientOptions) => any;
}
/**
 * A type representing additional parameters that can be passed to the
 * Anthropic API.
 */
type Kwargs = Record<string, any>;
/**
 * Anthropic chat model integration.
 *
 * Setup:
 * Install `@langchain/anthropic` and set an environment variable named `ANTHROPIC_API_KEY`.
 *
 * ```bash
 * npm install @langchain/anthropic
 * export ANTHROPIC_API_KEY="your-api-key"
 * ```
 *
 * ## [Constructor args](https://api.js.langchain.com/classes/langchain_anthropic.ChatAnthropic.html#constructor)
 *
 * ## [Runtime args](https://api.js.langchain.com/interfaces/langchain_anthropic.ChatAnthropicCallOptions.html)
 *
 * Runtime args can be passed as the second argument to any of the base runnable methods `.invoke`. `.stream`, `.batch`, etc.
 * They can also be passed via `.bind`, or the second arg in `.bindTools`, like shown in the examples below:
 *
 * ```typescript
 * // When calling `.bind`, call options should be passed via the first argument
 * const llmWithArgsBound = llm.bind({
 *   stop: ["\n"],
 *   tools: [...],
 * });
 *
 * // When calling `.bindTools`, call options should be passed via the second argument
 * const llmWithTools = llm.bindTools(
 *   [...],
 *   {
 *     tool_choice: "auto",
 *   }
 * );
 * ```
 *
 * ## Examples
 *
 * <details open>
 * <summary><strong>Instantiate</strong></summary>
 *
 * ```typescript
 * import { ChatAnthropic } from '@langchain/anthropic';
 *
 * const llm = new ChatAnthropic({
 *   model: "claude-3-5-sonnet-20240620",
 *   temperature: 0,
 *   maxTokens: undefined,
 *   maxRetries: 2,
 *   // apiKey: "...",
 *   // baseUrl: "...",
 *   // other params...
 * });
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Invoking</strong></summary>
 *
 * ```typescript
 * const input = `Translate "I love programming" into French.`;
 *
 * // Models also accept a list of chat messages or a formatted prompt
 * const result = await llm.invoke(input);
 * console.log(result);
 * ```
 *
 * ```txt
 * AIMessage {
 *   "id": "msg_01QDpd78JUHpRP6bRRNyzbW3",
 *   "content": "Here's the translation to French:\n\nJ'adore la programmation.",
 *   "response_metadata": {
 *     "id": "msg_01QDpd78JUHpRP6bRRNyzbW3",
 *     "model": "claude-3-5-sonnet-20240620",
 *     "stop_reason": "end_turn",
 *     "stop_sequence": null,
 *     "usage": {
 *       "input_tokens": 25,
 *       "output_tokens": 19
 *     },
 *     "type": "message",
 *     "role": "assistant"
 *   },
 *   "usage_metadata": {
 *     "input_tokens": 25,
 *     "output_tokens": 19,
 *     "total_tokens": 44
 *   }
 * }
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Streaming Chunks</strong></summary>
 *
 * ```typescript
 * for await (const chunk of await llm.stream(input)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * ```txt
 * AIMessageChunk {
 *   "id": "msg_01N8MwoYxiKo9w4chE4gXUs4",
 *   "content": "",
 *   "additional_kwargs": {
 *     "id": "msg_01N8MwoYxiKo9w4chE4gXUs4",
 *     "type": "message",
 *     "role": "assistant",
 *     "model": "claude-3-5-sonnet-20240620"
 *   },
 *   "usage_metadata": {
 *     "input_tokens": 25,
 *     "output_tokens": 1,
 *     "total_tokens": 26
 *   }
 * }
 * AIMessageChunk {
 *   "content": "",
 * }
 * AIMessageChunk {
 *   "content": "Here",
 * }
 * AIMessageChunk {
 *   "content": "'s",
 * }
 * AIMessageChunk {
 *   "content": " the translation to",
 * }
 * AIMessageChunk {
 *   "content": " French:\n\nJ",
 * }
 * AIMessageChunk {
 *   "content": "'adore la programmation",
 * }
 * AIMessageChunk {
 *   "content": ".",
 * }
 * AIMessageChunk {
 *   "content": "",
 *   "additional_kwargs": {
 *     "stop_reason": "end_turn",
 *     "stop_sequence": null
 *   },
 *   "usage_metadata": {
 *     "input_tokens": 0,
 *     "output_tokens": 19,
 *     "total_tokens": 19
 *   }
 * }
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Aggregate Streamed Chunks</strong></summary>
 *
 * ```typescript
 * import { AIMessageChunk } from '@langchain/core/messages';
 * import { concat } from '@langchain/core/utils/stream';
 *
 * const stream = await llm.stream(input);
 * let full: AIMessageChunk | undefined;
 * for await (const chunk of stream) {
 *   full = !full ? chunk : concat(full, chunk);
 * }
 * console.log(full);
 * ```
 *
 * ```txt
 * AIMessageChunk {
 *   "id": "msg_01SBTb5zSGXfjUc7yQ8EKEEA",
 *   "content": "Here's the translation to French:\n\nJ'adore la programmation.",
 *   "additional_kwargs": {
 *     "id": "msg_01SBTb5zSGXfjUc7yQ8EKEEA",
 *     "type": "message",
 *     "role": "assistant",
 *     "model": "claude-3-5-sonnet-20240620",
 *     "stop_reason": "end_turn",
 *     "stop_sequence": null
 *   },
 *   "usage_metadata": {
 *     "input_tokens": 25,
 *     "output_tokens": 20,
 *     "total_tokens": 45
 *   }
 * }
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Bind tools</strong></summary>
 *
 * ```typescript
 * import { z } from 'zod';
 *
 * const GetWeather = {
 *   name: "GetWeather",
 *   description: "Get the current weather in a given location",
 *   schema: z.object({
 *     location: z.string().describe("The city and state, e.g. San Francisco, CA")
 *   }),
 * }
 *
 * const GetPopulation = {
 *   name: "GetPopulation",
 *   description: "Get the current population in a given location",
 *   schema: z.object({
 *     location: z.string().describe("The city and state, e.g. San Francisco, CA")
 *   }),
 * }
 *
 * const llmWithTools = llm.bindTools([GetWeather, GetPopulation]);
 * const aiMsg = await llmWithTools.invoke(
 *   "Which city is hotter today and which is bigger: LA or NY?"
 * );
 * console.log(aiMsg.tool_calls);
 * ```
 *
 * ```txt
 * [
 *   {
 *     name: 'GetWeather',
 *     args: { location: 'Los Angeles, CA' },
 *     id: 'toolu_01WjW3Dann6BPJVtLhovdBD5',
 *     type: 'tool_call'
 *   },
 *   {
 *     name: 'GetWeather',
 *     args: { location: 'New York, NY' },
 *     id: 'toolu_01G6wfJgqi5zRmJomsmkyZXe',
 *     type: 'tool_call'
 *   },
 *   {
 *     name: 'GetPopulation',
 *     args: { location: 'Los Angeles, CA' },
 *     id: 'toolu_0165qYWBA2VFyUst5RA18zew',
 *     type: 'tool_call'
 *   },
 *   {
 *     name: 'GetPopulation',
 *     args: { location: 'New York, NY' },
 *     id: 'toolu_01PGNyP33vxr13tGqr7i3rDo',
 *     type: 'tool_call'
 *   }
 * ]
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Structured Output</strong></summary>
 *
 * ```typescript
 * import { z } from 'zod';
 *
 * const Joke = z.object({
 *   setup: z.string().describe("The setup of the joke"),
 *   punchline: z.string().describe("The punchline to the joke"),
 *   rating: z.number().optional().describe("How funny the joke is, from 1 to 10")
 * }).describe('Joke to tell user.');
 *
 * const structuredLlm = llm.withStructuredOutput(Joke, { name: "Joke" });
 * const jokeResult = await structuredLlm.invoke("Tell me a joke about cats");
 * console.log(jokeResult);
 * ```
 *
 * ```txt
 * {
 *   setup: "Why don't cats play poker in the jungle?",
 *   punchline: 'Too many cheetahs!',
 *   rating: 7
 * }
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Multimodal</strong></summary>
 *
 * ```typescript
 * import { HumanMessage } from '@langchain/core/messages';
 *
 * const imageUrl = "https://example.com/image.jpg";
 * const imageData = await fetch(imageUrl).then(res => res.arrayBuffer());
 * const base64Image = Buffer.from(imageData).toString('base64');
 *
 * const message = new HumanMessage({
 *   content: [
 *     { type: "text", text: "describe the weather in this image" },
 *     {
 *       type: "image_url",
 *       image_url: { url: `data:image/jpeg;base64,${base64Image}` },
 *     },
 *   ]
 * });
 *
 * const imageDescriptionAiMsg = await llm.invoke([message]);
 * console.log(imageDescriptionAiMsg.content);
 * ```
 *
 * ```txt
 * The weather in this image appears to be beautiful and clear. The sky is a vibrant blue with scattered white clouds, suggesting a sunny and pleasant day. The clouds are wispy and light, indicating calm conditions without any signs of storms or heavy weather. The bright green grass on the rolling hills looks lush and well-watered, which could mean recent rainfall or good growing conditions. Overall, the scene depicts a perfect spring or early summer day with mild temperatures, plenty of sunshine, and gentle breezes - ideal weather for enjoying the outdoors or for plant growth.
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Usage Metadata</strong></summary>
 *
 * ```typescript
 * const aiMsgForMetadata = await llm.invoke(input);
 * console.log(aiMsgForMetadata.usage_metadata);
 * ```
 *
 * ```txt
 * { input_tokens: 25, output_tokens: 19, total_tokens: 44 }
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Stream Usage Metadata</strong></summary>
 *
 * ```typescript
 * const streamForMetadata = await llm.stream(
 *   input,
 *   {
 *     streamUsage: true
 *   }
 * );
 * let fullForMetadata: AIMessageChunk | undefined;
 * for await (const chunk of streamForMetadata) {
 *   fullForMetadata = !fullForMetadata ? chunk : concat(fullForMetadata, chunk);
 * }
 * console.log(fullForMetadata?.usage_metadata);
 * ```
 *
 * ```txt
 * { input_tokens: 25, output_tokens: 20, total_tokens: 45 }
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 * <summary><strong>Response Metadata</strong></summary>
 *
 * ```typescript
 * const aiMsgForResponseMetadata = await llm.invoke(input);
 * console.log(aiMsgForResponseMetadata.response_metadata);
 * ```
 *
 * ```txt
 * {
 *   id: 'msg_01STxeQxJmp4sCSpioD6vK3L',
 *   model: 'claude-3-5-sonnet-20240620',
 *   stop_reason: 'end_turn',
 *   stop_sequence: null,
 *   usage: { input_tokens: 25, output_tokens: 19 },
 *   type: 'message',
 *   role: 'assistant'
 * }
 * ```
 * </details>
 *
 * <br />
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
    /**
     * Optional method that returns an initialized underlying Anthropic client.
     * Useful for accessing Anthropic models hosted on other cloud services
     * such as Google Vertex.
     */
    createClient: (options: ClientOptions) => Anthropic;
    constructor(fields?: AnthropicInput & BaseChatModelParams);
    getLsParams(options: this["ParsedCallOptions"]): LangSmithParams;
    /**
     * Formats LangChain StructuredTools to AnthropicTools.
     *
     * @param {ChatAnthropicCallOptions["tools"]} tools The tools to format
     * @returns {AnthropicTool[] | undefined} The formatted tools, or undefined if none are passed.
     */
    formatStructuredToolToAnthropic(tools: ChatAnthropicCallOptions["tools"]): AnthropicTool[] | undefined;
    bindTools(tools: ChatAnthropicToolType[], kwargs?: Partial<CallOptions>): Runnable<BaseLanguageModelInput, AIMessageChunk, CallOptions>;
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams(options?: this["ParsedCallOptions"]): Omit<AnthropicMessageCreateParams | AnthropicStreamingMessageCreateParams, "messages"> & Kwargs;
    /** @ignore */
    _identifyingParams(): {
        system?: string | Anthropic.Messages.TextBlockParam[] | undefined;
        model: Anthropic.Messages.Model;
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
        system?: string | Anthropic.Messages.TextBlockParam[] | undefined;
        model: Anthropic.Messages.Model;
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
        generations: import("@langchain/core/outputs").ChatGeneration[];
        llmOutput: {
            id: string;
            model: Anthropic.Messages.Model;
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
