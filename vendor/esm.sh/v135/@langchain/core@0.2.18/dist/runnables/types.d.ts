import type { z } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import type { IterableReadableStreamInterface } from "../utils/stream.d.ts";
import type { SerializableInterface } from "../load/serializable.d.ts";
import type { BaseCallbackConfig } from "../callbacks/manager.d.ts";
export type RunnableBatchOptions = {
    /** @deprecated Pass in via the standard runnable config object instead */
    maxConcurrency?: number;
    returnExceptions?: boolean;
};
export type RunnableIOSchema = {
    name?: string;
    schema: z.ZodType;
};
/**
 * Base interface implemented by all runnables.
 * Used for cross-compatibility between different versions of LangChain core.
 *
 * Should not change on patch releases.
 */
export interface RunnableInterface<RunInput = any, RunOutput = any, CallOptions extends RunnableConfig = RunnableConfig> extends SerializableInterface {
    lc_serializable: boolean;
    invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<CallOptions> | Partial<CallOptions>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
    stream(input: RunInput, options?: Partial<CallOptions>): Promise<IterableReadableStreamInterface<RunOutput>>;
    transform(generator: AsyncGenerator<RunInput>, options: Partial<CallOptions>): AsyncGenerator<RunOutput>;
    getName(suffix?: string): string;
}
export interface Edge {
    source: string;
    target: string;
    data?: string;
    conditional?: boolean;
}
export interface Node {
    id: string;
    data: RunnableIOSchema | RunnableInterface;
}
export interface RunnableConfig extends BaseCallbackConfig {
    /**
     * Runtime values for attributes previously made configurable on this Runnable,
     * or sub-Runnables.
     */
    configurable?: Record<string, any>;
    /**
     * Maximum number of times a call can recurse. If not provided, defaults to 25.
     */
    recursionLimit?: number;
    /** Maximum number of parallel calls to make. */
    maxConcurrency?: number;
}
