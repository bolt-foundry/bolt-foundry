import { z } from "zod";
import { type TraceableFunction } from "langsmith/singletons/traceable";
import type { RunnableInterface, RunnableBatchOptions } from "./types.js";
import { CallbackManagerForChainRun } from "../callbacks/manager.js";
import { LogStreamCallbackHandler, LogStreamCallbackHandlerInput, RunLogPatch } from "../tracers/log_stream.js";
import { EventStreamCallbackHandlerInput, StreamEvent } from "../tracers/event_stream.js";
import { Serializable } from "../load/serializable.js";
import { IterableReadableStream } from "../utils/stream.js";
import { RunnableConfig } from "./config.js";
import { Run } from "../tracers/base.js";
import { Graph } from "./graph.js";
import { ToolCall } from "../messages/tool.js";
export { type RunnableInterface, RunnableBatchOptions };
export type RunnableFunc<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig> = (input: RunInput, options?: ({
    /** @deprecated Use top-level config fields instead. */
    config?: CallOptions;
} & CallOptions) | Record<string, any> | (Record<string, any> & {
    /** @deprecated Use top-level config fields instead. */
    config: CallOptions;
} & CallOptions)) => RunOutput | Promise<RunOutput>;
export type RunnableMapLike<RunInput, RunOutput> = {
    [K in keyof RunOutput]: RunnableLike<RunInput, RunOutput[K]>;
};
export type RunnableLike<RunInput = any, RunOutput = any, CallOptions extends RunnableConfig = RunnableConfig> = RunnableInterface<RunInput, RunOutput, CallOptions> | RunnableFunc<RunInput, RunOutput, CallOptions> | RunnableMapLike<RunInput, RunOutput>;
export type RunnableRetryFailedAttemptHandler = (error: any, input: any) => any;
export declare function _coerceToDict(value: any, defaultKey: string): any;
/**
 * A Runnable is a generic unit of work that can be invoked, batched, streamed, and/or
 * transformed.
 */
export declare abstract class Runnable<RunInput = any, RunOutput = any, CallOptions extends RunnableConfig = RunnableConfig> extends Serializable implements RunnableInterface<RunInput, RunOutput, CallOptions> {
    protected lc_runnable: boolean;
    name?: string;
    getName(suffix?: string): string;
    abstract invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
    /**
     * Bind arguments to a Runnable, returning a new Runnable.
     * @param kwargs
     * @returns A new RunnableBinding that, when invoked, will apply the bound args.
     */
    bind(kwargs: Partial<CallOptions>): Runnable<RunInput, RunOutput, CallOptions>;
    /**
     * Return a new Runnable that maps a list of inputs to a list of outputs,
     * by calling invoke() with each input.
     */
    map(): Runnable<RunInput[], RunOutput[], CallOptions>;
    /**
     * Add retry logic to an existing runnable.
     * @param kwargs
     * @returns A new RunnableRetry that, when invoked, will retry according to the parameters.
     */
    withRetry(fields?: {
        stopAfterAttempt?: number;
        onFailedAttempt?: RunnableRetryFailedAttemptHandler;
    }): RunnableRetry<RunInput, RunOutput, CallOptions>;
    /**
     * Bind config to a Runnable, returning a new Runnable.
     * @param config New configuration parameters to attach to the new runnable.
     * @returns A new RunnableBinding with a config matching what's passed.
     */
    withConfig(config: RunnableConfig): RunnableBinding<RunInput, RunOutput, CallOptions>;
    /**
     * Create a new runnable from the current one that will try invoking
     * other passed fallback runnables if the initial invocation fails.
     * @param fields.fallbacks Other runnables to call if the runnable errors.
     * @returns A new RunnableWithFallbacks.
     */
    withFallbacks(fields: {
        fallbacks: Runnable<RunInput, RunOutput>[];
    } | Runnable<RunInput, RunOutput>[]): RunnableWithFallbacks<RunInput, RunOutput>;
    protected _getOptionsList<O extends CallOptions & {
        runType?: string;
    }>(options: Partial<O> | Partial<O>[], length?: number): Partial<O>[];
    /**
     * Default implementation of batch, which calls invoke N times.
     * Subclasses should override this method if they can batch more efficiently.
     * @param inputs Array of inputs to each batch call.
     * @param options Either a single call options object to apply to each batch call or an array for each call.
     * @param batchOptions.returnExceptions Whether to return errors rather than throwing on the first one
     * @returns An array of RunOutputs, or mixed RunOutputs and errors if batchOptions.returnExceptions is set
     */
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
    /**
     * Default streaming implementation.
     * Subclasses should override this method if they support streaming output.
     * @param input
     * @param options
     */
    _streamIterator(input: RunInput, options?: Partial<CallOptions>): AsyncGenerator<RunOutput>;
    /**
     * Stream output in chunks.
     * @param input
     * @param options
     * @returns A readable stream that is also an iterable.
     */
    stream(input: RunInput, options?: Partial<CallOptions>): Promise<IterableReadableStream<RunOutput>>;
    protected _separateRunnableConfigFromCallOptions(options?: Partial<CallOptions>): [RunnableConfig, Omit<Partial<CallOptions>, keyof RunnableConfig>];
    protected _callWithConfig<T extends RunInput>(func: ((input: T) => Promise<RunOutput>) | ((input: T, config?: Partial<CallOptions>, runManager?: CallbackManagerForChainRun) => Promise<RunOutput>), input: T, options?: Partial<CallOptions> & {
        runType?: string;
    }): Promise<RunOutput>;
    /**
     * Internal method that handles batching and configuration for a runnable
     * It takes a function, input values, and optional configuration, and
     * returns a promise that resolves to the output values.
     * @param func The function to be executed for each input value.
     * @param input The input values to be processed.
     * @param config Optional configuration for the function execution.
     * @returns A promise that resolves to the output values.
     */
    _batchWithConfig<T extends RunInput>(func: (inputs: T[], options?: Partial<CallOptions>[], runManagers?: (CallbackManagerForChainRun | undefined)[], batchOptions?: RunnableBatchOptions) => Promise<(RunOutput | Error)[]>, inputs: T[], options?: Partial<CallOptions & {
        runType?: string;
    }> | Partial<CallOptions & {
        runType?: string;
    }>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
    /**
     * Helper method to transform an Iterator of Input values into an Iterator of
     * Output values, with callbacks.
     * Use this to implement `stream()` or `transform()` in Runnable subclasses.
     */
    protected _transformStreamWithConfig<I extends RunInput, O extends RunOutput>(inputGenerator: AsyncGenerator<I>, transformer: (generator: AsyncGenerator<I>, runManager?: CallbackManagerForChainRun, options?: Partial<CallOptions>) => AsyncGenerator<O>, options?: Partial<CallOptions> & {
        runType?: string;
    }): AsyncGenerator<O>;
    getGraph(_?: RunnableConfig): Graph;
    /**
     * Create a new runnable sequence that runs each individual runnable in series,
     * piping the output of one runnable into another runnable or runnable-like.
     * @param coerceable A runnable, function, or object whose values are functions or runnables.
     * @returns A new runnable sequence.
     */
    pipe<NewRunOutput>(coerceable: RunnableLike<RunOutput, NewRunOutput>): Runnable<RunInput, Exclude<NewRunOutput, Error>>;
    /**
     * Pick keys from the dict output of this runnable. Returns a new runnable.
     */
    pick(keys: string | string[]): Runnable;
    /**
     * Assigns new fields to the dict output of this runnable. Returns a new runnable.
     */
    assign(mapping: RunnableMapLike<Record<string, unknown>, Record<string, unknown>>): Runnable;
    /**
     * Default implementation of transform, which buffers input and then calls stream.
     * Subclasses should override this method if they can start producing output while
     * input is still being generated.
     * @param generator
     * @param options
     */
    transform(generator: AsyncGenerator<RunInput>, options: Partial<CallOptions>): AsyncGenerator<RunOutput>;
    /**
     * Stream all output from a runnable, as reported to the callback system.
     * This includes all inner runs of LLMs, Retrievers, Tools, etc.
     * Output is streamed as Log objects, which include a list of
     * jsonpatch ops that describe how the state of the run has changed in each
     * step, and the final state of the run.
     * The jsonpatch ops can be applied in order to construct state.
     * @param input
     * @param options
     * @param streamOptions
     */
    streamLog(input: RunInput, options?: Partial<CallOptions>, streamOptions?: Omit<LogStreamCallbackHandlerInput, "autoClose">): AsyncGenerator<RunLogPatch>;
    protected _streamLog(input: RunInput, logStreamCallbackHandler: LogStreamCallbackHandler, config: Partial<CallOptions>): AsyncGenerator<RunLogPatch>;
    /**
     * Generate a stream of events emitted by the internal steps of the runnable.
     *
     * Use to create an iterator over StreamEvents that provide real-time information
     * about the progress of the runnable, including StreamEvents from intermediate
     * results.
     *
     * A StreamEvent is a dictionary with the following schema:
     *
     * - `event`: string - Event names are of the format: on_[runnable_type]_(start|stream|end).
     * - `name`: string - The name of the runnable that generated the event.
     * - `run_id`: string - Randomly generated ID associated with the given execution of
     *   the runnable that emitted the event. A child runnable that gets invoked as part of the execution of a
     *   parent runnable is assigned its own unique ID.
     * - `tags`: string[] - The tags of the runnable that generated the event.
     * - `metadata`: Record<string, any> - The metadata of the runnable that generated the event.
     * - `data`: Record<string, any>
     *
     * Below is a table that illustrates some events that might be emitted by various
     * chains. Metadata fields have been omitted from the table for brevity.
     * Chain definitions have been included after the table.
     *
     * **ATTENTION** This reference table is for the V2 version of the schema.
     *
     * ```md
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | event                | name             | chunk                           | input                                         | output                                          |
     * +======================+==================+=================================+===============================================+=================================================+
     * | on_chat_model_start  | [model name]     |                                 | {"messages": [[SystemMessage, HumanMessage]]} |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_chat_model_stream | [model name]     | AIMessageChunk(content="hello") |                                               |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_chat_model_end    | [model name]     |                                 | {"messages": [[SystemMessage, HumanMessage]]} | AIMessageChunk(content="hello world")           |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_llm_start         | [model name]     |                                 | {'input': 'hello'}                            |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_llm_stream        | [model name]     | 'Hello'                         |                                               |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_llm_end           | [model name]     |                                 | 'Hello human!'                                |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_chain_start       | some_runnable    |                                 |                                               |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_chain_stream      | some_runnable    | "hello world!, goodbye world!"  |                                               |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_chain_end         | some_runnable    |                                 | [Document(...)]                               | "hello world!, goodbye world!"                  |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_tool_start        | some_tool        |                                 | {"x": 1, "y": "2"}                            |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_tool_end          | some_tool        |                                 |                                               | {"x": 1, "y": "2"}                              |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_retriever_start   | [retriever name] |                                 | {"query": "hello"}                            |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_retriever_end     | [retriever name] |                                 | {"query": "hello"}                            | [Document(...), ..]                             |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_prompt_start      | [template_name]  |                                 | {"question": "hello"}                         |                                                 |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * | on_prompt_end        | [template_name]  |                                 | {"question": "hello"}                         | ChatPromptValue(messages: [SystemMessage, ...]) |
     * +----------------------+------------------+---------------------------------+-----------------------------------------------+-------------------------------------------------+
     * ```
     *
     * The "on_chain_*" events are the default for Runnables that don't fit one of the above categories.
     *
     * In addition to the standard events above, users can also dispatch custom events.
     *
     * Custom events will be only be surfaced with in the `v2` version of the API!
     *
     * A custom event has following format:
     *
     * ```md
     * +-----------+------+-----------------------------------------------------------------------------------------------------------+
     * | Attribute | Type | Description                                                                                               |
     * +===========+======+===========================================================================================================+
     * | name      | str  | A user defined name for the event.                                                                        |
     * +-----------+------+-----------------------------------------------------------------------------------------------------------+
     * | data      | Any  | The data associated with the event. This can be anything, though we suggest making it JSON serializable.  |
     * +-----------+------+-----------------------------------------------------------------------------------------------------------+
     * ```
     *
     * Here's an example:
     *
     * ```ts
     * import { RunnableLambda } from "@langchain/core/runnables";
     * import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";
     * // Use this import for web environments that don't support "async_hooks"
     * // and manually pass config to child runs.
     * // import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
     *
     * const slowThing = RunnableLambda.from(async (someInput: string) => {
     *   // Placeholder for some slow operation
     *   await new Promise((resolve) => setTimeout(resolve, 100));
     *   await dispatchCustomEvent("progress_event", {
     *    message: "Finished step 1 of 2",
     *  });
     *  await new Promise((resolve) => setTimeout(resolve, 100));
     *  return "Done";
     * });
     *
     * const eventStream = await slowThing.streamEvents("hello world", {
     *   version: "v2",
     * });
     *
     * for await (const event of eventStream) {
     *  if (event.event === "on_custom_event") {
     *    console.log(event);
     *  }
     * }
     * ```
     */
    streamEvents(input: RunInput, options: Partial<CallOptions> & {
        version: "v1" | "v2";
    }, streamOptions?: Omit<EventStreamCallbackHandlerInput, "autoClose">): IterableReadableStream<StreamEvent>;
    streamEvents(input: RunInput, options: Partial<CallOptions> & {
        version: "v1" | "v2";
        encoding: "text/event-stream";
    }, streamOptions?: Omit<EventStreamCallbackHandlerInput, "autoClose">): IterableReadableStream<Uint8Array>;
    private _streamEventsV2;
    private _streamEventsV1;
    static isRunnable(thing: any): thing is Runnable;
    /**
     * Bind lifecycle listeners to a Runnable, returning a new Runnable.
     * The Run object contains information about the run, including its id,
     * type, input, output, error, startTime, endTime, and any tags or metadata
     * added to the run.
     *
     * @param {Object} params - The object containing the callback functions.
     * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
     * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
     * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
     */
    withListeners({ onStart, onEnd, onError, }: {
        onStart?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
        onEnd?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
        onError?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
    }): Runnable<RunInput, RunOutput, CallOptions>;
    /**
     * Convert a runnable to a tool. Return a new instance of `RunnableToolLike`
     * which contains the runnable, name, description and schema.
     *
     * @template {T extends RunInput = RunInput} RunInput - The input type of the runnable. Should be the same as the `RunInput` type of the runnable.
     *
     * @param fields
     * @param {string | undefined} [fields.name] The name of the tool. If not provided, it will default to the name of the runnable.
     * @param {string | undefined} [fields.description] The description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided.
     * @param {z.ZodType<T>} [fields.schema] The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable.
     * @returns {RunnableToolLike<z.ZodType<T>, RunOutput>} An instance of `RunnableToolLike` which is a runnable that can be used as a tool.
     */
    asTool<T extends RunInput = RunInput>(fields: {
        name?: string;
        description?: string;
        schema: z.ZodType<T>;
    }): RunnableToolLike<z.ZodType<T | ToolCall>, RunOutput>;
}
export type RunnableBindingArgs<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig> = {
    bound: Runnable<RunInput, RunOutput, CallOptions>;
    kwargs?: Partial<CallOptions>;
    config: RunnableConfig;
    configFactories?: Array<(config: RunnableConfig) => RunnableConfig>;
};
/**
 * A runnable that delegates calls to another runnable with a set of kwargs.
 */
export declare class RunnableBinding<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig> extends Runnable<RunInput, RunOutput, CallOptions> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    bound: Runnable<RunInput, RunOutput, CallOptions>;
    config: RunnableConfig;
    kwargs?: Partial<CallOptions>;
    configFactories?: Array<(config: RunnableConfig) => RunnableConfig | Promise<RunnableConfig>>;
    constructor(fields: RunnableBindingArgs<RunInput, RunOutput, CallOptions>);
    getName(suffix?: string | undefined): string;
    _mergeConfig(...options: (Partial<CallOptions> | RunnableConfig | undefined)[]): Promise<Partial<CallOptions>>;
    bind(kwargs: Partial<CallOptions>): RunnableBinding<RunInput, RunOutput, CallOptions>;
    withConfig(config: RunnableConfig): RunnableBinding<RunInput, RunOutput, CallOptions>;
    withRetry(fields?: {
        stopAfterAttempt?: number;
        onFailedAttempt?: RunnableRetryFailedAttemptHandler;
    }): RunnableRetry<RunInput, RunOutput, CallOptions>;
    invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
    _streamIterator(input: RunInput, options?: Partial<CallOptions> | undefined): AsyncGenerator<Awaited<RunOutput>, void, unknown>;
    stream(input: RunInput, options?: Partial<CallOptions> | undefined): Promise<IterableReadableStream<RunOutput>>;
    transform(generator: AsyncGenerator<RunInput>, options: Partial<CallOptions>): AsyncGenerator<RunOutput>;
    streamEvents(input: RunInput, options: Partial<CallOptions> & {
        version: "v1" | "v2";
    }, streamOptions?: Omit<LogStreamCallbackHandlerInput, "autoClose">): IterableReadableStream<StreamEvent>;
    streamEvents(input: RunInput, options: Partial<CallOptions> & {
        version: "v1" | "v2";
        encoding: "text/event-stream";
    }, streamOptions?: Omit<LogStreamCallbackHandlerInput, "autoClose">): IterableReadableStream<Uint8Array>;
    static isRunnableBinding(thing: any): thing is RunnableBinding<any, any, any>;
    /**
     * Bind lifecycle listeners to a Runnable, returning a new Runnable.
     * The Run object contains information about the run, including its id,
     * type, input, output, error, startTime, endTime, and any tags or metadata
     * added to the run.
     *
     * @param {Object} params - The object containing the callback functions.
     * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
     * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
     * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
     */
    withListeners({ onStart, onEnd, onError, }: {
        onStart?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
        onEnd?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
        onError?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
    }): Runnable<RunInput, RunOutput, CallOptions>;
}
/**
 * A runnable that delegates calls to another runnable
 * with each element of the input sequence.
 */
export declare class RunnableEach<RunInputItem, RunOutputItem, CallOptions extends RunnableConfig> extends Runnable<RunInputItem[], RunOutputItem[], CallOptions> {
    static lc_name(): string;
    lc_serializable: boolean;
    lc_namespace: string[];
    bound: Runnable<RunInputItem, RunOutputItem, CallOptions>;
    constructor(fields: {
        bound: Runnable<RunInputItem, RunOutputItem, CallOptions>;
    });
    /**
     * Binds the runnable with the specified arguments.
     * @param kwargs The arguments to bind the runnable with.
     * @returns A new instance of the `RunnableEach` class that is bound with the specified arguments.
     */
    bind(kwargs: Partial<CallOptions>): RunnableEach<RunInputItem, RunOutputItem, CallOptions>;
    /**
     * Invokes the runnable with the specified input and configuration.
     * @param input The input to invoke the runnable with.
     * @param config The configuration to invoke the runnable with.
     * @returns A promise that resolves to the output of the runnable.
     */
    invoke(inputs: RunInputItem[], config?: Partial<CallOptions>): Promise<RunOutputItem[]>;
    /**
     * A helper method that is used to invoke the runnable with the specified input and configuration.
     * @param input The input to invoke the runnable with.
     * @param config The configuration to invoke the runnable with.
     * @returns A promise that resolves to the output of the runnable.
     */
    protected _invoke(inputs: RunInputItem[], config?: Partial<CallOptions>, runManager?: CallbackManagerForChainRun): Promise<RunOutputItem[]>;
    /**
     * Bind lifecycle listeners to a Runnable, returning a new Runnable.
     * The Run object contains information about the run, including its id,
     * type, input, output, error, startTime, endTime, and any tags or metadata
     * added to the run.
     *
     * @param {Object} params - The object containing the callback functions.
     * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
     * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
     * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
     */
    withListeners({ onStart, onEnd, onError, }: {
        onStart?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
        onEnd?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
        onError?: (run: Run, config?: RunnableConfig) => void | Promise<void>;
    }): Runnable<any, any, CallOptions>;
}
/**
 * Base class for runnables that can be retried a
 * specified number of times.
 */
export declare class RunnableRetry<RunInput = any, RunOutput = any, CallOptions extends RunnableConfig = RunnableConfig> extends RunnableBinding<RunInput, RunOutput, CallOptions> {
    static lc_name(): string;
    lc_namespace: string[];
    protected maxAttemptNumber: number;
    onFailedAttempt: RunnableRetryFailedAttemptHandler;
    constructor(fields: RunnableBindingArgs<RunInput, RunOutput, CallOptions> & {
        maxAttemptNumber?: number;
        onFailedAttempt?: RunnableRetryFailedAttemptHandler;
    });
    _patchConfigForRetry(attempt: number, config?: Partial<CallOptions>, runManager?: CallbackManagerForChainRun): Partial<CallOptions>;
    protected _invoke(input: RunInput, config?: CallOptions, runManager?: CallbackManagerForChainRun): Promise<RunOutput>;
    /**
     * Method that invokes the runnable with the specified input, run manager,
     * and config. It handles the retry logic by catching any errors and
     * recursively invoking itself with the updated config for the next retry
     * attempt.
     * @param input The input for the runnable.
     * @param runManager The run manager for the runnable.
     * @param config The config for the runnable.
     * @returns A promise that resolves to the output of the runnable.
     */
    invoke(input: RunInput, config?: CallOptions): Promise<RunOutput>;
    _batch<ReturnExceptions extends boolean = false>(inputs: RunInput[], configs?: RunnableConfig[], runManagers?: (CallbackManagerForChainRun | undefined)[], batchOptions?: RunnableBatchOptions): Promise<ReturnExceptions extends false ? RunOutput[] : (Error | RunOutput)[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
}
/**
 * A sequence of runnables, where the output of each is the input of the next.
 * @example
 * ```typescript
 * const promptTemplate = PromptTemplate.fromTemplate(
 *   "Tell me a joke about {topic}",
 * );
 * const chain = RunnableSequence.from([promptTemplate, new ChatOpenAI({})]);
 * const result = await chain.invoke({ topic: "bears" });
 * ```
 */
export declare class RunnableSequence<RunInput = any, RunOutput = any> extends Runnable<RunInput, RunOutput> {
    static lc_name(): string;
    protected first: Runnable<RunInput>;
    protected middle: Runnable[];
    protected last: Runnable<any, RunOutput>;
    lc_serializable: boolean;
    lc_namespace: string[];
    constructor(fields: {
        first: Runnable<RunInput>;
        middle?: Runnable[];
        last: Runnable<any, RunOutput>;
        name?: string;
    });
    get steps(): Runnable<any, any, RunnableConfig<Record<string, any>>>[];
    invoke(input: RunInput, options?: RunnableConfig): Promise<RunOutput>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
    _streamIterator(input: RunInput, options?: RunnableConfig): AsyncGenerator<RunOutput>;
    getGraph(config?: RunnableConfig): Graph;
    pipe<NewRunOutput>(coerceable: RunnableLike<RunOutput, NewRunOutput>): RunnableSequence<RunInput, Exclude<NewRunOutput, Error>>;
    static isRunnableSequence(thing: any): thing is RunnableSequence;
    static from<RunInput = any, RunOutput = any>([first, ...runnables]: [
        RunnableLike<RunInput>,
        ...RunnableLike[],
        RunnableLike<any, RunOutput>
    ], name?: string): RunnableSequence<RunInput, Exclude<RunOutput, Error>>;
}
/**
 * A runnable that runs a mapping of runnables in parallel,
 * and returns a mapping of their outputs.
 * @example
 * ```typescript
 * const mapChain = RunnableMap.from({
 *   joke: PromptTemplate.fromTemplate("Tell me a joke about {topic}").pipe(
 *     new ChatAnthropic({}),
 *   ),
 *   poem: PromptTemplate.fromTemplate("write a 2-line poem about {topic}").pipe(
 *     new ChatAnthropic({}),
 *   ),
 * });
 * const result = await mapChain.invoke({ topic: "bear" });
 * ```
 */
export declare class RunnableMap<RunInput = any, RunOutput extends Record<string, any> = Record<string, any>> extends Runnable<RunInput, RunOutput> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    protected steps: Record<string, Runnable<RunInput>>;
    getStepsKeys(): string[];
    constructor(fields: {
        steps: RunnableMapLike<RunInput, RunOutput>;
    });
    static from<RunInput, RunOutput extends Record<string, any> = Record<string, any>>(steps: RunnableMapLike<RunInput, RunOutput>): RunnableMap<RunInput, RunOutput>;
    invoke(input: RunInput, options?: Partial<RunnableConfig>): Promise<RunOutput>;
    _transform(generator: AsyncGenerator<RunInput>, runManager?: CallbackManagerForChainRun, options?: Partial<RunnableConfig>): AsyncGenerator<RunOutput>;
    transform(generator: AsyncGenerator<RunInput>, options?: Partial<RunnableConfig>): AsyncGenerator<RunOutput>;
    stream(input: RunInput, options?: Partial<RunnableConfig>): Promise<IterableReadableStream<RunOutput>>;
}
type AnyTraceableFunction = TraceableFunction<(...any: any[]) => any>;
/**
 * A runnable that wraps a traced LangSmith function.
 */
export declare class RunnableTraceable<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
    lc_serializable: boolean;
    lc_namespace: string[];
    protected func: AnyTraceableFunction;
    constructor(fields: {
        func: AnyTraceableFunction;
    });
    invoke(input: RunInput, options?: Partial<RunnableConfig>): Promise<RunOutput>;
    _streamIterator(input: RunInput, options?: Partial<RunnableConfig>): AsyncGenerator<RunOutput>;
    static from(func: AnyTraceableFunction): RunnableTraceable<unknown, unknown>;
}
/**
 * A runnable that runs a callable.
 */
export declare class RunnableLambda<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig> extends Runnable<RunInput, RunOutput, CallOptions> {
    static lc_name(): string;
    lc_namespace: string[];
    protected func: RunnableFunc<RunInput, RunOutput | Runnable<RunInput, RunOutput, CallOptions>, CallOptions>;
    constructor(fields: {
        func: RunnableFunc<RunInput, RunOutput | Runnable<RunInput, RunOutput, CallOptions>, CallOptions> | TraceableFunction<RunnableFunc<RunInput, RunOutput | Runnable<RunInput, RunOutput, CallOptions>, CallOptions>>;
    });
    static from<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig>(func: RunnableFunc<RunInput, RunOutput | Runnable<RunInput, RunOutput, CallOptions>, CallOptions>): RunnableLambda<RunInput, RunOutput, CallOptions>;
    static from<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig>(func: TraceableFunction<RunnableFunc<RunInput, RunOutput | Runnable<RunInput, RunOutput, CallOptions>, CallOptions>>): RunnableLambda<RunInput, RunOutput, CallOptions>;
    _invoke(input: RunInput, config?: Partial<CallOptions>, runManager?: CallbackManagerForChainRun): Promise<RunOutput>;
    invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
    _transform(generator: AsyncGenerator<RunInput>, runManager?: CallbackManagerForChainRun, config?: Partial<CallOptions>): AsyncGenerator<RunOutput>;
    transform(generator: AsyncGenerator<RunInput>, options?: Partial<CallOptions>): AsyncGenerator<RunOutput>;
    stream(input: RunInput, options?: Partial<CallOptions>): Promise<IterableReadableStream<RunOutput>>;
}
export declare class RunnableParallel<RunInput> extends RunnableMap<RunInput> {
}
/**
 * A Runnable that can fallback to other Runnables if it fails.
 * External APIs (e.g., APIs for a language model) may at times experience
 * degraded performance or even downtime.
 *
 * In these cases, it can be useful to have a fallback Runnable that can be
 * used in place of the original Runnable (e.g., fallback to another LLM provider).
 *
 * Fallbacks can be defined at the level of a single Runnable, or at the level
 * of a chain of Runnables. Fallbacks are tried in order until one succeeds or
 * all fail.
 *
 * While you can instantiate a `RunnableWithFallbacks` directly, it is usually
 * more convenient to use the `withFallbacks` method on an existing Runnable.
 *
 * When streaming, fallbacks will only be called on failures during the initial
 * stream creation. Errors that occur after a stream starts will not fallback
 * to the next Runnable.
 */
export declare class RunnableWithFallbacks<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    runnable: Runnable<RunInput, RunOutput>;
    fallbacks: Runnable<RunInput, RunOutput>[];
    constructor(fields: {
        runnable: Runnable<RunInput, RunOutput>;
        fallbacks: Runnable<RunInput, RunOutput>[];
    });
    runnables(): Generator<Runnable<RunInput, RunOutput, RunnableConfig<Record<string, any>>>, void, unknown>;
    invoke(input: RunInput, options?: Partial<RunnableConfig>): Promise<RunOutput>;
    _streamIterator(input: RunInput, options?: Partial<RunnableConfig> | undefined): AsyncGenerator<RunOutput>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
}
export declare function _coerceToRunnable<RunInput, RunOutput, CallOptions extends RunnableConfig = RunnableConfig>(coerceable: RunnableLike<RunInput, RunOutput, CallOptions>): Runnable<RunInput, Exclude<RunOutput, Error>, CallOptions>;
export interface RunnableAssignFields<RunInput> {
    mapper: RunnableMap<RunInput>;
}
/**
 * A runnable that assigns key-value pairs to inputs of type `Record<string, unknown>`.
 */
export declare class RunnableAssign<RunInput extends Record<string, any> = Record<string, any>, RunOutput extends Record<string, any> = Record<string, any>, CallOptions extends RunnableConfig = RunnableConfig> extends Runnable<RunInput, RunOutput> implements RunnableAssignFields<RunInput> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    mapper: RunnableMap<RunInput>;
    constructor(fields: RunnableMap<RunInput> | RunnableAssignFields<RunInput>);
    invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
    _transform(generator: AsyncGenerator<RunInput>, runManager?: CallbackManagerForChainRun, options?: Partial<RunnableConfig>): AsyncGenerator<RunOutput>;
    transform(generator: AsyncGenerator<RunInput>, options?: Partial<RunnableConfig>): AsyncGenerator<RunOutput>;
    stream(input: RunInput, options?: Partial<RunnableConfig>): Promise<IterableReadableStream<RunOutput>>;
}
export interface RunnablePickFields {
    keys: string | string[];
}
/**
 * A runnable that assigns key-value pairs to inputs of type `Record<string, unknown>`.
 */
export declare class RunnablePick<RunInput extends Record<string, any> = Record<string, any>, RunOutput extends Record<string, any> | any = Record<string, any> | any, CallOptions extends RunnableConfig = RunnableConfig> extends Runnable<RunInput, RunOutput> implements RunnablePickFields {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    keys: string | string[];
    constructor(fields: string | string[] | RunnablePickFields);
    _pick(input: RunInput): Promise<RunOutput>;
    invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
    _transform(generator: AsyncGenerator<RunInput>): AsyncGenerator<RunOutput>;
    transform(generator: AsyncGenerator<RunInput>, options?: Partial<RunnableConfig>): AsyncGenerator<RunOutput>;
    stream(input: RunInput, options?: Partial<RunnableConfig>): Promise<IterableReadableStream<RunOutput>>;
}
export interface RunnableToolLikeArgs<RunInput extends z.ZodType = z.ZodType, RunOutput = unknown> extends Omit<RunnableBindingArgs<z.infer<RunInput>, RunOutput>, "config"> {
    name: string;
    description?: string;
    schema: RunInput;
    config?: RunnableConfig;
}
export declare class RunnableToolLike<RunInput extends z.ZodType = z.ZodType, RunOutput = unknown> extends RunnableBinding<z.infer<RunInput>, RunOutput> {
    name: string;
    description?: string;
    schema: RunInput;
    constructor(fields: RunnableToolLikeArgs<RunInput, RunOutput>);
    static lc_name(): string;
}
/**
 * Given a runnable and a Zod schema, convert the runnable to a tool.
 *
 * @template RunInput The input type for the runnable.
 * @template RunOutput The output type for the runnable.
 *
 * @param {Runnable<RunInput, RunOutput>} runnable The runnable to convert to a tool.
 * @param fields
 * @param {string | undefined} [fields.name] The name of the tool. If not provided, it will default to the name of the runnable.
 * @param {string | undefined} [fields.description] The description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided.
 * @param {z.ZodType<RunInput>} [fields.schema] The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable.
 * @returns {RunnableToolLike<z.ZodType<RunInput>, RunOutput>} An instance of `RunnableToolLike` which is a runnable that can be used as a tool.
 */
export declare function convertRunnableToTool<RunInput, RunOutput>(runnable: Runnable<RunInput, RunOutput>, fields: {
    name?: string;
    description?: string;
    schema: z.ZodType<RunInput>;
}): RunnableToolLike<z.ZodType<RunInput | ToolCall>, RunOutput>;
