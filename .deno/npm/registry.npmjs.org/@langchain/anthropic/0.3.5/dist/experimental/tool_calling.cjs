"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatAnthropicTools = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const messages_1 = require("@langchain/core/messages");
const chat_models_1 = require("@langchain/core/language_models/chat_models");
const runnables_1 = require("@langchain/core/runnables");
const openai_tools_1 = require("@langchain/core/output_parsers/openai_tools");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const chat_models_js_1 = require("../chat_models.cjs");
const tool_calling_js_1 = require("./utils/tool_calling.cjs");
/**
 * Experimental wrapper over Anthropic chat models that adds support for
 * a function calling interface.
 * @deprecated Prefer traditional tool use through ChatAnthropic.
 */
class ChatAnthropicTools extends chat_models_1.BaseChatModel {
    static lc_name() {
        return "ChatAnthropicTools";
    }
    constructor(fields) {
        if (fields?.cache !== undefined) {
            throw new Error("Caching is not supported for this model.");
        }
        super(fields ?? {});
        Object.defineProperty(this, "llm", {
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
        Object.defineProperty(this, "systemPromptTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "experimental", "chat_models"]
        });
        this.llm = fields?.llm ?? new chat_models_js_1.ChatAnthropic(fields);
        this.systemPromptTemplate =
            fields?.systemPromptTemplate ?? tool_calling_js_1.DEFAULT_TOOL_SYSTEM_PROMPT;
        this.stopSequences =
            fields?.stopSequences ?? this.llm.stopSequences;
    }
    invocationParams() {
        return this.llm.invocationParams();
    }
    /** @ignore */
    _identifyingParams() {
        return this.llm._identifyingParams();
    }
    async *_streamResponseChunks(messages, options, runManager) {
        yield* this.llm._streamResponseChunks(messages, options, runManager);
    }
    async _prepareAndParseToolCall({ messages, options, systemPromptTemplate = tool_calling_js_1.DEFAULT_TOOL_SYSTEM_PROMPT, stopSequences, }) {
        let promptMessages = messages;
        let forced = false;
        let toolCall;
        const tools = options.tools === undefined ? [] : [...options.tools];
        if (options.tools !== undefined && options.tools.length > 0) {
            const content = await systemPromptTemplate.format({
                tools: `<tools>\n${options.tools
                    .map(tool_calling_js_1.formatAsXMLRepresentation)
                    .join("\n\n")}</tools>`,
            });
            if (promptMessages.length && promptMessages[0]._getType() !== "system") {
                const systemMessage = new messages_1.SystemMessage({ content });
                promptMessages = [systemMessage].concat(promptMessages);
            }
            else {
                const systemMessage = new messages_1.SystemMessage({
                    content: `${content}\n\n${promptMessages[0].content}`,
                });
                promptMessages = [systemMessage].concat(promptMessages.slice(1));
            }
            // eslint-disable-next-line no-param-reassign
            options.stop = stopSequences.concat(["</function_calls>"]);
            if (options.tool_choice && options.tool_choice !== "auto") {
                toolCall = options.tool_choice.function.name;
                forced = true;
                const matchingFunction = options.tools.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (tool) => tool.function.name === toolCall);
                if (!matchingFunction) {
                    throw new Error(`No matching function found for passed "tool_choice"`);
                }
                promptMessages = promptMessages.concat([
                    new messages_1.AIMessage({
                        content: `<function_calls>\n<invoke><tool_name>${toolCall}</tool_name>`,
                    }),
                ]);
                // eslint-disable-next-line no-param-reassign
                delete options.tool_choice;
            }
            // eslint-disable-next-line no-param-reassign
            delete options.tools;
        }
        else if (options.tool_choice !== undefined) {
            throw new Error(`If "tool_choice" is provided, "tools" must also be.`);
        }
        const chatResult = await this.llm
            .withConfig({ runName: "ChatAnthropicTools" })
            .invoke(promptMessages, options);
        const chatGenerationContent = chatResult.content;
        if (typeof chatGenerationContent !== "string") {
            throw new Error("AnthropicFunctions does not support non-string output.");
        }
        if (forced) {
            const parser = new fast_xml_parser_1.XMLParser();
            const result = parser.parse(`<function_calls>\n<invoke><tool_name>${toolCall}</tool_name>${chatGenerationContent}</function_calls>`);
            if (toolCall === undefined) {
                throw new Error(`Could not parse called function from model output.`);
            }
            const invocations = Array.isArray(result.function_calls?.invoke ?? [])
                ? result.function_calls.invoke
                : [result.function_calls.invoke];
            const responseMessageWithFunctions = new messages_1.AIMessage({
                content: "",
                additional_kwargs: {
                    tool_calls: invocations.map((toolInvocation, i) => {
                        const calledTool = tools.find((tool) => tool.function.name === toolCall);
                        if (calledTool === undefined) {
                            throw new Error(`Called tool "${toolCall}" did not match an existing tool.`);
                        }
                        return {
                            id: i.toString(),
                            type: "function",
                            function: {
                                name: toolInvocation.tool_name,
                                arguments: JSON.stringify((0, tool_calling_js_1.fixArrayXMLParameters)(calledTool.function.parameters, toolInvocation.parameters)),
                            },
                        };
                    }),
                },
            });
            return {
                generations: [{ message: responseMessageWithFunctions, text: "" }],
            };
        }
        else if (chatGenerationContent.includes("<function_calls>")) {
            const parser = new fast_xml_parser_1.XMLParser();
            const result = parser.parse(`${chatGenerationContent}</function_calls>`);
            const invocations = Array.isArray(result.function_calls?.invoke ?? [])
                ? result.function_calls.invoke
                : [result.function_calls.invoke];
            const responseMessageWithFunctions = new messages_1.AIMessage({
                content: chatGenerationContent.split("<function_calls>")[0],
                additional_kwargs: {
                    tool_calls: invocations.map((toolInvocation, i) => {
                        const calledTool = tools.find((tool) => tool.function.name === toolInvocation.tool_name);
                        if (calledTool === undefined) {
                            throw new Error(`Called tool "${toolCall}" did not match an existing tool.`);
                        }
                        return {
                            id: i.toString(),
                            type: "function",
                            function: {
                                name: toolInvocation.tool_name,
                                arguments: JSON.stringify((0, tool_calling_js_1.fixArrayXMLParameters)(calledTool.function.parameters, toolInvocation.parameters)),
                            },
                        };
                    }),
                },
            });
            return {
                generations: [{ message: responseMessageWithFunctions, text: "" }],
            };
        }
        return { generations: [{ message: chatResult, text: "" }] };
    }
    async generate(messages, parsedOptions, callbacks) {
        const baseMessages = messages.map((messageList) => messageList.map(messages_1.coerceMessageLikeToMessage));
        // generate results
        const chatResults = await Promise.all(baseMessages.map((messageList) => this._prepareAndParseToolCall({
            messages: messageList,
            options: { callbacks, ...parsedOptions },
            systemPromptTemplate: this.systemPromptTemplate,
            stopSequences: this.stopSequences ?? [],
        })));
        // create combined output
        const output = {
            generations: chatResults.map((chatResult) => chatResult.generations),
        };
        return output;
    }
    async _generate(_messages, _options, _runManager) {
        throw new Error("Unused.");
    }
    _llmType() {
        return "anthropic_tool_calling";
    }
    withStructuredOutput(outputSchema, config) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let schema;
        let name;
        let method;
        let includeRaw;
        let force;
        if (isStructuredOutputMethodParams(outputSchema)) {
            schema = outputSchema.schema;
            name = outputSchema.name;
            method = outputSchema.method;
            includeRaw = outputSchema.includeRaw;
        }
        else {
            schema = outputSchema;
            name = config?.name;
            method = config?.method;
            includeRaw = config?.includeRaw;
            force = config?.force ?? false;
        }
        if (method === "jsonMode") {
            throw new Error(`Anthropic only supports "functionCalling" as a method.`);
        }
        let functionName = name ?? "extract";
        let outputParser;
        let tools;
        if (isZodSchema(schema)) {
            const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema);
            tools = [
                {
                    type: "function",
                    function: {
                        name: functionName,
                        description: jsonSchema.description,
                        parameters: jsonSchema,
                    },
                },
            ];
            outputParser = new openai_tools_1.JsonOutputKeyToolsParser({
                returnSingle: true,
                keyName: functionName,
                zodSchema: schema,
            });
        }
        else {
            let openAIFunctionDefinition;
            if (typeof schema.name === "string" &&
                typeof schema.parameters === "object" &&
                schema.parameters != null) {
                openAIFunctionDefinition = schema;
                functionName = schema.name;
            }
            else {
                openAIFunctionDefinition = {
                    name: functionName,
                    description: schema.description ?? "",
                    parameters: schema,
                };
            }
            tools = [
                {
                    type: "function",
                    function: openAIFunctionDefinition,
                },
            ];
            outputParser = new openai_tools_1.JsonOutputKeyToolsParser({
                returnSingle: true,
                keyName: functionName,
            });
        }
        const llm = this.bind({
            tools,
            tool_choice: force
                ? {
                    type: "function",
                    function: {
                        name: functionName,
                    },
                }
                : "auto",
        });
        if (!includeRaw) {
            return llm.pipe(outputParser).withConfig({
                runName: "ChatAnthropicStructuredOutput",
            });
        }
        const parserAssign = runnables_1.RunnablePassthrough.assign({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsed: (input, config) => outputParser.invoke(input.raw, config),
        });
        const parserNone = runnables_1.RunnablePassthrough.assign({
            parsed: () => null,
        });
        const parsedWithFallback = parserAssign.withFallbacks({
            fallbacks: [parserNone],
        });
        return runnables_1.RunnableSequence.from([
            {
                raw: llm,
            },
            parsedWithFallback,
        ]).withConfig({
            runName: "StructuredOutputRunnable",
        });
    }
}
exports.ChatAnthropicTools = ChatAnthropicTools;
function isZodSchema(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
input) {
    // Check for a characteristic method of Zod schemas
    return typeof input?.parse === "function";
}
function isStructuredOutputMethodParams(x
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    return (x !== undefined &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof x.schema ===
            "object");
}