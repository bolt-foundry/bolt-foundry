import { zodToJsonSchema } from "zod-to-json-schema";
import { isOpenAITool, } from "@langchain/core/language_models/base";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, PromptTemplate, } from "@langchain/core/prompts";
import { isStructuredTool } from "@langchain/core/utils/function_calling";
import { LLMChain } from "../../chains/llm_chain.js";
import { Agent, AgentRunnableSequence, } from "../agent.js";
import { StructuredChatOutputParserWithRetries } from "./outputParser.js";
import { FORMAT_INSTRUCTIONS, PREFIX, SUFFIX } from "./prompt.js";
import { renderTextDescriptionAndArgs } from "../../tools/render.js";
import { formatLogToString } from "../format_scratchpad/log.js";
/**
 * Agent that interoperates with Structured Tools using React logic.
 * @augments Agent
 * @deprecated Use the {@link https://api.js.langchain.com/functions/langchain.agents.createStructuredChatAgent.html | createStructuredChatAgent method instead}.
 */
export class StructuredChatAgent extends Agent {
    static lc_name() {
        return "StructuredChatAgent";
    }
    constructor(input) {
        const outputParser = input?.outputParser ?? StructuredChatAgent.getDefaultOutputParser();
        super({ ...input, outputParser });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "agents", "structured_chat"]
        });
    }
    _agentType() {
        return "structured-chat-zero-shot-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    _stop() {
        return ["Observation:"];
    }
    /**
     * Validates that all provided tools have a description. Throws an error
     * if any tool lacks a description.
     * @param tools Array of StructuredTool instances to validate.
     */
    static validateTools(tools) {
        const descriptionlessTool = tools.find((tool) => !tool.description);
        if (descriptionlessTool) {
            const msg = `Got a tool ${descriptionlessTool.name} without a description.` +
                ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    /**
     * Returns a default output parser for the StructuredChatAgent. If an LLM
     * is provided, it creates an output parser with retry logic from the LLM.
     * @param fields Optional fields to customize the output parser. Can include an LLM and a list of tool names.
     * @returns An instance of StructuredChatOutputParserWithRetries.
     */
    static getDefaultOutputParser(fields) {
        if (fields?.llm) {
            return StructuredChatOutputParserWithRetries.fromLLM(fields.llm, {
                toolNames: fields.toolNames,
            });
        }
        return new StructuredChatOutputParserWithRetries({
            toolNames: fields?.toolNames,
        });
    }
    /**
     * Constructs the agent's scratchpad from a list of steps. If the agent's
     * scratchpad is not empty, it prepends a message indicating that the
     * agent has not seen any previous work.
     * @param steps Array of AgentStep instances to construct the scratchpad from.
     * @returns A Promise that resolves to a string representing the agent's scratchpad.
     */
    async constructScratchPad(steps) {
        const agentScratchpad = await super.constructScratchPad(steps);
        if (agentScratchpad) {
            return `This was your previous work (but I haven't seen any of it! I only see what you return as final answer):\n${agentScratchpad}`;
        }
        return agentScratchpad;
    }
    /**
     * Creates a string representation of the schemas of the provided tools.
     * @param tools Array of StructuredTool instances to create the schemas string from.
     * @returns A string representing the schemas of the provided tools.
     */
    static createToolSchemasString(tools) {
        return tools
            .map((tool) => `${tool.name}: ${tool.description}, args: ${JSON.stringify(zodToJsonSchema(tool.schema).properties)}`)
            .join("\n");
    }
    /**
     * Create prompt in the style of the agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.suffix - String to put after the list of tools.
     * @param args.prefix - String to put before the list of tools.
     * @param args.inputVariables List of input variables the final prompt will expect.
     * @param args.memoryPrompts List of historical prompts from memory.
     */
    static createPrompt(tools, args) {
        const { prefix = PREFIX, suffix = SUFFIX, inputVariables = ["input", "agent_scratchpad"], humanMessageTemplate = "{input}\n\n{agent_scratchpad}", memoryPrompts = [], } = args ?? {};
        const template = [prefix, FORMAT_INSTRUCTIONS, suffix].join("\n\n");
        const messages = [
            new SystemMessagePromptTemplate(new PromptTemplate({
                template,
                inputVariables,
                partialVariables: {
                    tool_schemas: StructuredChatAgent.createToolSchemasString(tools),
                    tool_names: tools.map((tool) => tool.name).join(", "),
                },
            })),
            ...memoryPrompts,
            new HumanMessagePromptTemplate(new PromptTemplate({
                template: humanMessageTemplate,
                inputVariables,
            })),
        ];
        return ChatPromptTemplate.fromMessages(messages);
    }
    /**
     * Creates a StructuredChatAgent from an LLM and a list of tools.
     * Validates the tools, creates a prompt, and sets up an LLM chain for the
     * agent.
     * @param llm BaseLanguageModel instance to create the agent from.
     * @param tools Array of StructuredTool instances to create the agent from.
     * @param args Optional arguments to customize the creation of the agent. Can include arguments for creating the prompt and AgentArgs.
     * @returns A new instance of StructuredChatAgent.
     */
    static fromLLMAndTools(llm, tools, args) {
        StructuredChatAgent.validateTools(tools);
        const prompt = StructuredChatAgent.createPrompt(tools, args);
        const outputParser = args?.outputParser ??
            StructuredChatAgent.getDefaultOutputParser({
                llm,
                toolNames: tools.map((tool) => tool.name),
            });
        const chain = new LLMChain({
            prompt,
            llm,
            callbacks: args?.callbacks,
        });
        return new StructuredChatAgent({
            llmChain: chain,
            outputParser,
            allowedTools: tools.map((t) => t.name),
        });
    }
}
/**
 * Create an agent aimed at supporting tools with multiple inputs.
 * @param params Params required to create the agent. Includes an LLM, tools, and prompt.
 * @returns A runnable sequence representing an agent. It takes as input all the same input
 *     variables as the prompt passed in does. It returns as output either an
 *     AgentAction or AgentFinish.
 *
 * @example
 * ```typescript
 * import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
 * import { pull } from "langchain/hub";
 * import type { ChatPromptTemplate } from "@langchain/core/prompts";
 * import { AIMessage, HumanMessage } from "@langchain/core/messages";
 *
 * import { ChatOpenAI } from "@langchain/openai";
 *
 * // Define the tools the agent will have access to.
 * const tools = [...];
 *
 * // Get the prompt to use - you can modify this!
 * // If you want to see the prompt in full, you can at:
 * // https://smith.langchain.com/hub/hwchase17/structured-chat-agent
 * const prompt = await pull<ChatPromptTemplate>(
 *   "hwchase17/structured-chat-agent"
 * );
 *
 * const llm = new ChatOpenAI({
 *   temperature: 0,
 *   modelName: "gpt-3.5-turbo-1106",
 * });
 *
 * const agent = await createStructuredChatAgent({
 *   llm,
 *   tools,
 *   prompt,
 * });
 *
 * const agentExecutor = new AgentExecutor({
 *   agent,
 *   tools,
 * });
 *
 * const result = await agentExecutor.invoke({
 *   input: "what is LangChain?",
 * });
 *
 * // With chat history
 * const result2 = await agentExecutor.invoke({
 *   input: "what's my name?",
 *   chat_history: [
 *     new HumanMessage("hi! my name is cob"),
 *     new AIMessage("Hello Cob! How can I assist you today?"),
 *   ],
 * });
 * ```
 */
export async function createStructuredChatAgent({ llm, tools, prompt, streamRunnable, }) {
    const missingVariables = ["tools", "tool_names", "agent_scratchpad"].filter((v) => !prompt.inputVariables.includes(v));
    if (missingVariables.length > 0) {
        throw new Error(`Provided prompt is missing required input variables: ${JSON.stringify(missingVariables)}`);
    }
    let toolNames = [];
    if (tools.every(isOpenAITool)) {
        toolNames = tools.map((tool) => tool.function.name);
    }
    else if (tools.every(isStructuredTool)) {
        toolNames = tools.map((tool) => tool.name);
    }
    else {
        throw new Error("All tools must be either OpenAI or Structured tools, not a mix.");
    }
    const partialedPrompt = await prompt.partial({
        tools: renderTextDescriptionAndArgs(tools),
        tool_names: toolNames.join(", "),
    });
    // TODO: Add .bind to core runnable interface.
    const llmWithStop = llm.bind({
        stop: ["Observation"],
    });
    const agent = AgentRunnableSequence.fromRunnables([
        RunnablePassthrough.assign({
            agent_scratchpad: (input) => formatLogToString(input.steps),
        }),
        partialedPrompt,
        llmWithStop,
        StructuredChatOutputParserWithRetries.fromLLM(llm, {
            toolNames,
        }),
    ], {
        name: "StructuredChatAgent",
        streamRunnable,
        singleAction: true,
    });
    return agent;
}