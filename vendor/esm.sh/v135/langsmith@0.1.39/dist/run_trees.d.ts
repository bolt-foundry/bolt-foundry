import { BaseRun, KVMap, RunCreate } from "./schemas.d.ts";
import { Client } from "./client.d.ts";
export declare function convertToDottedOrderFormat(epoch: number, runId: string, executionOrder?: number): string;
export interface RunTreeConfig {
    name: string;
    run_type?: string;
    id?: string;
    project_name?: string;
    parent_run?: RunTree;
    parent_run_id?: string;
    child_runs?: RunTree[];
    start_time?: number;
    end_time?: number;
    extra?: KVMap;
    metadata?: KVMap;
    tags?: string[];
    error?: string;
    serialized?: object;
    inputs?: KVMap;
    outputs?: KVMap;
    reference_example_id?: string;
    client?: Client;
    tracingEnabled?: boolean;
    on_end?: (runTree: RunTree) => void;
    execution_order?: number;
    child_execution_order?: number;
    trace_id?: string;
    dotted_order?: string;
}
export interface RunnableConfigLike {
    /**
     * Tags for this call and any sub-calls (eg. a Chain calling an LLM).
     * You can use these to filter calls.
     */
    tags?: string[];
    /**
     * Metadata for this call and any sub-calls (eg. a Chain calling an LLM).
     * Keys should be strings, values should be JSON-serializable.
     */
    metadata?: Record<string, unknown>;
    /**
     * Callbacks for this call and any sub-calls (eg. a Chain calling an LLM).
     * Tags are passed to all callbacks, metadata is passed to handle*Start callbacks.
     */
    callbacks?: any;
}
interface HeadersLike {
    get(name: string): string | null;
    set(name: string, value: string): void;
}
export declare class RunTree implements BaseRun {
    id: string;
    name: RunTreeConfig["name"];
    run_type: string;
    project_name: string;
    parent_run?: RunTree;
    child_runs: RunTree[];
    start_time: number;
    end_time?: number;
    extra: KVMap;
    tags?: string[];
    error?: string;
    serialized: object;
    inputs: KVMap;
    outputs?: KVMap;
    reference_example_id?: string;
    client: Client;
    events?: KVMap[] | undefined;
    trace_id: string;
    dotted_order: string;
    tracingEnabled?: boolean;
    execution_order: number;
    child_execution_order: number;
    constructor(originalConfig: RunTreeConfig);
    private static getDefaultConfig;
    createChild(config: RunTreeConfig): RunTree;
    end(outputs?: KVMap, error?: string, endTime?: number): Promise<void>;
    private _convertToCreate;
    postRun(excludeChildRuns?: boolean): Promise<void>;
    patchRun(): Promise<void>;
    toJSON(): RunCreate;
    static fromRunnableConfig(parentConfig: RunnableConfigLike, props: RunTreeConfig): RunTree;
    static fromDottedOrder(dottedOrder: string): RunTree | undefined;
    static fromHeaders(headers: Record<string, string | string[]> | HeadersLike, inheritArgs?: RunTreeConfig): RunTree | undefined;
    toHeaders(headers?: HeadersLike): {
        "langsmith-trace": string;
        baggage: string;
    };
}
export declare function isRunTree(x?: unknown): x is RunTree;
export declare function isRunnableConfigLike(x?: unknown): x is RunnableConfigLike;
export {};