import { Runnable, type RunnableBatchOptions } from "./base.d.ts";
import { IterableReadableStream } from "../utils/stream.d.ts";
import { type RunnableConfig } from "./config.d.ts";
export type RouterInput = {
    key: string;
    input: any;
};
/**
 * A runnable that routes to a set of runnables based on Input['key'].
 * Returns the output of the selected runnable.
 */
export declare class RouterRunnable<RunInput extends RouterInput, RunnableInput, RunOutput> extends Runnable<RunInput, RunOutput> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    runnables: Record<string, Runnable<RunnableInput, RunOutput>>;
    constructor(fields: {
        runnables: Record<string, Runnable<RunnableInput, RunOutput>>;
    });
    invoke(input: RunInput, options?: Partial<RunnableConfig>): Promise<RunOutput>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions?: false;
    }): Promise<RunOutput[]>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions & {
        returnExceptions: true;
    }): Promise<(RunOutput | Error)[]>;
    batch(inputs: RunInput[], options?: Partial<RunnableConfig> | Partial<RunnableConfig>[], batchOptions?: RunnableBatchOptions): Promise<(RunOutput | Error)[]>;
    stream(input: RunInput, options?: Partial<RunnableConfig>): Promise<IterableReadableStream<RunOutput>>;
}
