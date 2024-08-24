import { type Completions, type ChatCompletionMessageParam, type ChatCompletionCreateParamsNonStreaming } from 'https://esm.sh/v135/openai@4.53.0/resources/chat/completions.d.ts';
import { type RunnableFunctions, type BaseFunctionsArgs, RunnableTools } from "./RunnableFunction.d.ts";
import { AbstractChatCompletionRunner, AbstractChatCompletionRunnerEvents, RunnerOptions } from "./AbstractChatCompletionRunner.d.ts";
export interface ChatCompletionRunnerEvents extends AbstractChatCompletionRunnerEvents {
    content: (content: string) => void;
}
export type ChatCompletionFunctionRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<ChatCompletionCreateParamsNonStreaming, 'functions'> & {
    functions: RunnableFunctions<FunctionsArgs>;
};
export type ChatCompletionToolRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<ChatCompletionCreateParamsNonStreaming, 'tools'> & {
    tools: RunnableTools<FunctionsArgs>;
};
export declare class ChatCompletionRunner extends AbstractChatCompletionRunner<ChatCompletionRunnerEvents> {
    /** @deprecated - please use `runTools` instead. */
    static runFunctions(completions: Completions, params: ChatCompletionFunctionRunnerParams<any[]>, options?: RunnerOptions): ChatCompletionRunner;
    static runTools(completions: Completions, params: ChatCompletionToolRunnerParams<any[]>, options?: RunnerOptions): ChatCompletionRunner;
    _addMessage(message: ChatCompletionMessageParam): void;
}
//# sourceMappingURL=ChatCompletionRunner.d.ts.map
