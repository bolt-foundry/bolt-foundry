import { Message, Text, ImageFile, TextDelta, Messages } from 'https://esm.sh/v135/openai@4.53.0/resources/beta/threads/messages.d.ts';
import * as Core from 'https://esm.sh/v135/openai@4.53.0/core.d.ts';
import { RequestOptions } from 'https://esm.sh/v135/openai@4.53.0/core.d.ts';
import { Run, RunCreateParamsBase, Runs, RunSubmitToolOutputsParamsBase } from 'https://esm.sh/v135/openai@4.53.0/resources/beta/threads/runs/runs.d.ts';
import { AbstractAssistantRunnerEvents, AbstractAssistantStreamRunner } from "./AbstractAssistantStreamRunner.d.ts";
import { type ReadableStream } from 'https://esm.sh/v135/openai@4.53.0/_shims/index.d.ts';
import { AssistantStreamEvent } from 'https://esm.sh/v135/openai@4.53.0/resources/beta/assistants.d.ts';
import { RunStep, RunStepDelta, ToolCall, ToolCallDelta } from 'https://esm.sh/v135/openai@4.53.0/resources/beta/threads/runs/steps.d.ts';
import { ThreadCreateAndRunParamsBase, Threads } from 'https://esm.sh/v135/openai@4.53.0/resources/beta/threads/threads.d.ts';
import MessageDelta = Messages.MessageDelta;
export interface AssistantStreamEvents extends AbstractAssistantRunnerEvents {
    messageCreated: (message: Message) => void;
    messageDelta: (message: MessageDelta, snapshot: Message) => void;
    messageDone: (message: Message) => void;
    runStepCreated: (runStep: RunStep) => void;
    runStepDelta: (delta: RunStepDelta, snapshot: Runs.RunStep) => void;
    runStepDone: (runStep: Runs.RunStep, snapshot: Runs.RunStep) => void;
    toolCallCreated: (toolCall: ToolCall) => void;
    toolCallDelta: (delta: ToolCallDelta, snapshot: ToolCall) => void;
    toolCallDone: (toolCall: ToolCall) => void;
    textCreated: (content: Text) => void;
    textDelta: (delta: TextDelta, snapshot: Text) => void;
    textDone: (content: Text, snapshot: Message) => void;
    imageFileDone: (content: ImageFile, snapshot: Message) => void;
    end: () => void;
    event: (event: AssistantStreamEvent) => void;
}
export type ThreadCreateAndRunParamsBaseStream = Omit<ThreadCreateAndRunParamsBase, 'stream'> & {
    stream?: true;
};
export type RunCreateParamsBaseStream = Omit<RunCreateParamsBase, 'stream'> & {
    stream?: true;
};
export type RunSubmitToolOutputsParamsStream = Omit<RunSubmitToolOutputsParamsBase, 'stream'> & {
    stream?: true;
};
export declare class AssistantStream extends AbstractAssistantStreamRunner<AssistantStreamEvents> implements AsyncIterable<AssistantStreamEvent> {
    #private;
    [Symbol.asyncIterator](): AsyncIterator<AssistantStreamEvent>;
    static fromReadableStream(stream: ReadableStream): AssistantStream;
    protected _fromReadableStream(readableStream: ReadableStream, options?: Core.RequestOptions): Promise<Run>;
    toReadableStream(): ReadableStream;
    static createToolAssistantStream(threadId: string, runId: string, runs: Runs, body: RunSubmitToolOutputsParamsStream, options: RequestOptions | undefined): AssistantStream;
    protected _createToolAssistantStream(run: Runs, threadId: string, runId: string, params: RunSubmitToolOutputsParamsStream, options?: Core.RequestOptions): Promise<Run>;
    static createThreadAssistantStream(body: ThreadCreateAndRunParamsBaseStream, thread: Threads, options?: RequestOptions): AssistantStream;
    static createAssistantStream(threadId: string, runs: Runs, params: RunCreateParamsBaseStream, options?: RequestOptions): AssistantStream;
    currentEvent(): AssistantStreamEvent | undefined;
    currentRun(): Run | undefined;
    currentMessageSnapshot(): Message | undefined;
    currentRunStepSnapshot(): Runs.RunStep | undefined;
    finalRunSteps(): Promise<Runs.RunStep[]>;
    finalMessages(): Promise<Message[]>;
    finalRun(): Promise<Run>;
    protected _createThreadAssistantStream(thread: Threads, params: ThreadCreateAndRunParamsBase, options?: Core.RequestOptions): Promise<Run>;
    protected _createAssistantStream(run: Runs, threadId: string, params: RunCreateParamsBase, options?: Core.RequestOptions): Promise<Run>;
    static accumulateDelta(acc: Record<string, any>, delta: Record<string, any>): Record<string, any>;
}
//# sourceMappingURL=AssistantStream.d.ts.map
