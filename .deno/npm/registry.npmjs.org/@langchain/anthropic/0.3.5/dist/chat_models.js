import { Anthropic } from "@anthropic-ai/sdk";
import { AIMessageChunk } from "@langchain/core/messages";
import { ChatGenerationChunk } from "@langchain/core/outputs";
import { getEnvironmentVariable } from "@langchain/core/utils/env";
import { BaseChatModel, } from "@langchain/core/language_models/chat_models";
import { isOpenAITool, } from "@langchain/core/language_models/base";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RunnablePassthrough, RunnableSequence, } from "@langchain/core/runnables";
import { isZodSchema } from "@langchain/core/utils/types";
import { isLangChainTool } from "@langchain/core/utils/function_calling";
import { AnthropicToolsOutputParser } from "./output_parsers.js";
import { extractToolCallChunk, handleToolChoice } from "./utils/tools.js";
import { _convertMessagesToAnthropicPayload } from "./utils/message_inputs.js";
import { _makeMessageChunkFromAnthropicEvent, anthropicResponseToChatMessages, } from "./utils/message_outputs.js";
import { wrapAnthropicClientError } from "./utils/errors.js";
function _toolsInParams(params) {
    return !!(params.tools && params.tools.length > 0);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAnthropicTool(tool) {
    return "input_schema" in tool;
}
function extractToken(chunk) {
    if (typeof chunk.content === "string") {
        return chunk.content;
    }
    else if (Array.isArray(chunk.content) &&
        chunk.content.length >= 1 &&
        "input" in chunk.content[0]) {
        return typeof chunk.content[0].input === "string"
            ? chunk.content[0].input
            : JSON.stringify(chunk.content[0].input);
    }
    else if (Array.isArray(chunk.content) &&
        chunk.content.length >= 1 &&
        "text" in chunk.content[0]) {
        return chunk.content[0].text;
    }
    return undefined;
}
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
export class ChatAnthropicMessages extends BaseChatModel {
    static lc_name() {
        return "ChatAnthropic";
    }
    get lc_secrets() {
        return {
            anthropicApiKey: "ANTHROPIC_API_KEY",
            apiKey: "ANTHROPIC_API_KEY",
        };
    }
    get lc_aliases() {
        return {
            modelName: "model",
        };
    }
    constructor(fields) {
        super(fields ?? {});
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "anthropicApiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "topK", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2048
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "claude-2.1"
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "claude-2.1"
        });
        Object.defineProperty(this, "invocationKwargs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stopSequences", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "streaming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "clientOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Used for non-streaming requests
        Object.defineProperty(this, "batchClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Used for streaming requests
        Object.defineProperty(this, "streamingClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "streamUsage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * Optional method that returns an initialized underlying Anthropic client.
         * Useful for accessing Anthropic models hosted on other cloud services
         * such as Google Vertex.
         */
        Object.defineProperty(this, "createClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.anthropicApiKey =
            fields?.apiKey ??
                fields?.anthropicApiKey ??
                getEnvironmentVariable("ANTHROPIC_API_KEY");
        if (!this.anthropicApiKey && !fields?.createClient) {
            throw new Error("Anthropic API key not found");
        }
        this.clientOptions = fields?.clientOptions ?? {};
        /** Keep anthropicApiKey for backwards compatibility */
        this.apiKey = this.anthropicApiKey;
        // Support overriding the default API URL (i.e., https://api.anthropic.com)
        this.apiUrl = fields?.anthropicApiUrl;
        /** Keep modelName for backwards compatibility */
        this.modelName = fields?.model ?? fields?.modelName ?? this.model;
        this.model = this.modelName;
        this.invocationKwargs = fields?.invocationKwargs ?? {};
        this.temperature = fields?.temperature ?? this.temperature;
        this.topK = fields?.topK ?? this.topK;
        this.topP = fields?.topP ?? this.topP;
        this.maxTokens =
            fields?.maxTokensToSample ?? fields?.maxTokens ?? this.maxTokens;
        this.stopSequences = fields?.stopSequences ?? this.stopSequences;
        this.streaming = fields?.streaming ?? false;
        this.streamUsage = fields?.streamUsage ?? this.streamUsage;
        this.createClient =
            fields?.createClient ??
                ((options) => new Anthropic(options));
    }
    getLsParams(options) {
        const params = this.invocationParams(options);
        return {
            ls_provider: "anthropic",
            ls_model_name: this.model,
            ls_model_type: "chat",
            ls_temperature: params.temperature ?? undefined,
            ls_max_tokens: params.max_tokens ?? undefined,
            ls_stop: options.stop,
        };
    }
    /**
     * Formats LangChain StructuredTools to AnthropicTools.
     *
     * @param {ChatAnthropicCallOptions["tools"]} tools The tools to format
     * @returns {AnthropicTool[] | undefined} The formatted tools, or undefined if none are passed.
     */
    formatStructuredToolToAnthropic(tools) {
        if (!tools || !tools.length) {
            return undefined;
        }
        return tools.map((tool) => {
            if (isAnthropicTool(tool)) {
                return tool;
            }
            if (isOpenAITool(tool)) {
                return {
                    name: tool.function.name,
                    description: tool.function.description,
                    input_schema: tool.function.parameters,
                };
            }
            if (isLangChainTool(tool)) {
                return {
                    name: tool.name,
                    description: tool.description,
                    input_schema: zodToJsonSchema(tool.schema),
                };
            }
            throw new Error(`Unknown tool type passed to ChatAnthropic: ${JSON.stringify(tool, null, 2)}`);
        });
    }
    bindTools(tools, kwargs) {
        return this.bind({
            tools: this.formatStructuredToolToAnthropic(tools),
            ...kwargs,
        });
    }
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams(options) {
        const tool_choice = handleToolChoice(options?.tool_choice);
        return {
            model: this.model,
            temperature: this.temperature,
            top_k: this.topK,
            top_p: this.topP,
            stop_sequences: options?.stop ?? this.stopSequences,
            stream: this.streaming,
            max_tokens: this.maxTokens,
            tools: this.formatStructuredToolToAnthropic(options?.tools),
            tool_choice,
            ...this.invocationKwargs,
        };
    }
    /** @ignore */
    _identifyingParams() {
        return {
            model_name: this.model,
            ...this.invocationParams(),
        };
    }
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams() {
        return {
            model_name: this.model,
            ...this.invocationParams(),
        };
    }
    async *_streamResponseChunks(messages, options, runManager) {
        const params = this.invocationParams(options);
        const formattedMessages = _convertMessagesToAnthropicPayload(messages);
        const coerceContentToString = !_toolsInParams({
            ...params,
            ...formattedMessages,
            stream: false,
        });
        const stream = await this.createStreamWithRetry({
            ...params,
            ...formattedMessages,
            stream: true,
        }, {
            headers: options.headers,
        });
        for await (const data of stream) {
            if (options.signal?.aborted) {
                stream.controller.abort();
                throw new Error("AbortError: User aborted the request.");
            }
            const shouldStreamUsage = this.streamUsage ?? options.streamUsage;
            const result = _makeMessageChunkFromAnthropicEvent(data, {
                streamUsage: shouldStreamUsage,
                coerceContentToString,
            });
            if (!result)
                continue;
            const { chunk } = result;
            const newToolCallChunk = extractToolCallChunk(chunk);
            // Extract the text content token for text field and runManager.
            const token = extractToken(chunk);
            const generationChunk = new ChatGenerationChunk({
                message: new AIMessageChunk({
                    // Just yield chunk as it is and tool_use will be concat by BaseChatModel._generateUncached().
                    content: chunk.content,
                    additional_kwargs: chunk.additional_kwargs,
                    tool_call_chunks: newToolCallChunk ? [newToolCallChunk] : undefined,
                    usage_metadata: shouldStreamUsage ? chunk.usage_metadata : undefined,
                    response_metadata: chunk.response_metadata,
                    id: chunk.id,
                }),
                text: token ?? "",
            });
            yield generationChunk;
            await runManager?.handleLLMNewToken(token ?? "", undefined, undefined, undefined, undefined, { chunk: generationChunk });
        }
    }
    /** @ignore */
    async _generateNonStreaming(messages, params, requestOptions) {
        const response = await this.completionWithRetry({
            ...params,
            stream: false,
            ..._convertMessagesToAnthropicPayload(messages),
        }, requestOptions);
        const { content, ...additionalKwargs } = response;
        const generations = anthropicResponseToChatMessages(content, additionalKwargs);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { role: _role, type: _type, ...rest } = additionalKwargs;
        return { generations, llmOutput: rest };
    }
    /** @ignore */
    async _generate(messages, options, runManager) {
        if (this.stopSequences && options.stop) {
            throw new Error(`"stopSequence" parameter found in input and default params`);
        }
        const params = this.invocationParams(options);
        if (params.stream) {
            let finalChunk;
            const stream = this._streamResponseChunks(messages, options, runManager);
            for await (const chunk of stream) {
                if (finalChunk === undefined) {
                    finalChunk = chunk;
                }
                else {
                    finalChunk = finalChunk.concat(chunk);
                }
            }
            if (finalChunk === undefined) {
                throw new Error("No chunks returned from Anthropic API.");
            }
            return {
                generations: [
                    {
                        text: finalChunk.text,
                        message: finalChunk.message,
                    },
                ],
            };
        }
        else {
            return this._generateNonStreaming(messages, params, {
                signal: options.signal,
                headers: options.headers,
            });
        }
    }
    /**
     * Creates a streaming request with retry.
     * @param request The parameters for creating a completion.
     * @param options
     * @returns A streaming request.
     */
    async createStreamWithRetry(request, options) {
        if (!this.streamingClient) {
            const options_ = this.apiUrl ? { baseURL: this.apiUrl } : undefined;
            this.streamingClient = this.createClient({
                dangerouslyAllowBrowser: true,
                ...this.clientOptions,
                ...options_,
                apiKey: this.apiKey,
                // Prefer LangChain built-in retries
                maxRetries: 0,
            });
        }
        const makeCompletionRequest = async () => {
            try {
                return await this.streamingClient.messages.create({
                    ...request,
                    ...this.invocationKwargs,
                    stream: true,
                }, options);
            }
            catch (e) {
                const error = wrapAnthropicClientError(e);
                throw error;
            }
        };
        return this.caller.call(makeCompletionRequest);
    }
    /** @ignore */
    async completionWithRetry(request, options) {
        if (!this.batchClient) {
            const options = this.apiUrl ? { baseURL: this.apiUrl } : undefined;
            this.batchClient = this.createClient({
                dangerouslyAllowBrowser: true,
                ...this.clientOptions,
                ...options,
                apiKey: this.apiKey,
                maxRetries: 0,
            });
        }
        const makeCompletionRequest = async () => {
            try {
                return await this.batchClient.messages.create({
                    ...request,
                    ...this.invocationKwargs,
                }, options);
            }
            catch (e) {
                const error = wrapAnthropicClientError(e);
                throw error;
            }
        };
        return this.caller.callWithOptions({ signal: options.signal ?? undefined }, makeCompletionRequest);
    }
    _llmType() {
        return "anthropic";
    }
    withStructuredOutput(outputSchema, config) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const schema = outputSchema;
        const name = config?.name;
        const method = config?.method;
        const includeRaw = config?.includeRaw;
        if (method === "jsonMode") {
            throw new Error(`Anthropic only supports "functionCalling" as a method.`);
        }
        let functionName = name ?? "extract";
        let outputParser;
        let tools;
        if (isZodSchema(schema)) {
            const jsonSchema = zodToJsonSchema(schema);
            tools = [
                {
                    name: functionName,
                    description: jsonSchema.description ?? "A function available to call.",
                    input_schema: jsonSchema,
                },
            ];
            outputParser = new AnthropicToolsOutputParser({
                returnSingle: true,
                keyName: functionName,
                zodSchema: schema,
            });
        }
        else {
            let anthropicTools;
            if (typeof schema.name === "string" &&
                typeof schema.description === "string" &&
                typeof schema.input_schema === "object" &&
                schema.input_schema != null) {
                anthropicTools = schema;
                functionName = schema.name;
            }
            else {
                anthropicTools = {
                    name: functionName,
                    description: schema.description ?? "",
                    input_schema: schema,
                };
            }
            tools = [anthropicTools];
            outputParser = new AnthropicToolsOutputParser({
                returnSingle: true,
                keyName: functionName,
            });
        }
        const llm = this.bind({
            tools,
            tool_choice: {
                type: "tool",
                name: functionName,
            },
        });
        if (!includeRaw) {
            return llm.pipe(outputParser).withConfig({
                runName: "ChatAnthropicStructuredOutput",
            });
        }
        const parserAssign = RunnablePassthrough.assign({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsed: (input, config) => outputParser.invoke(input.raw, config),
        });
        const parserNone = RunnablePassthrough.assign({
            parsed: () => null,
        });
        const parsedWithFallback = parserAssign.withFallbacks({
            fallbacks: [parserNone],
        });
        return RunnableSequence.from([
            {
                raw: llm,
            },
            parsedWithFallback,
        ]).withConfig({
            runName: "StructuredOutputRunnable",
        });
    }
}
export class ChatAnthropic extends ChatAnthropicMessages {
}
