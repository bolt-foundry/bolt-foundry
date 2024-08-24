import { Completions, type ChatCompletionChunk, type ChatCompletionCreateParamsStreaming } from 'https://esm.sh/v135/openai@4.53.0/resources/chat/completions.d.ts';
import { RunnerOptions, type AbstractChatCompletionRunnerEvents } from "./AbstractChatCompletionRunner.d.ts";
import { type ReadableStream } from 'https://esm.sh/v135/openai@4.53.0/_shims/index.d.ts';
import { RunnableTools, type BaseFunctionsArgs, type RunnableFunctions } from "./RunnableFunction.d.ts";
import { ChatCompletionSnapshot, ChatCompletionStream } from "./ChatCompletionStream.d.ts";
export interface ChatCompletionStreamEvents extends AbstractChatCompletionRunnerEvents {
    content: (contentDelta: string, contentSnapshot: string) => void;
    chunk: (chunk: ChatCompletionChunk, snapshot: ChatCompletionSnapshot) => void;
}
export type ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<ChatCompletionCreateParamsStreaming, 'functions'> & {
    functions: RunnableFunctions<FunctionsArgs>;
};
export type ChatCompletionStreamingToolRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<ChatCompletionCreateParamsStreaming, 'tools'> & {
    tools: RunnableTools<FunctionsArgs>;
};
export declare class ChatCompletionStreamingRunner extends ChatCompletionStream implements AsyncIterable<ChatCompletionChunk> {
    static fromReadableStream(stream: ReadableStream): ChatCompletionStreamingRunner;
    /** @deprecated - please use `runTools` instead. */
    static runFunctions<T extends (string | object)[]>(completions: Completions, params: ChatCompletionStreamingFunctionRunnerParams<T>, options?: RunnerOptions): ChatCompletionStreamingRunner;
    static runTools<T extends (string | object)[]>(completions: Completions, params: ChatCompletionStreamingToolRunnerParams<T>, options?: RunnerOptions): ChatCompletionStreamingRunner;
}
//# sourceMappingURL=ChatCompletionStreamingRunner.d.ts.map
