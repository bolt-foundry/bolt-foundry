import { Client } from "https://esm.sh/v135/langsmith@0.1.39/dist/index.d.ts";
import { RunTree } from "https://esm.sh/v135/langsmith@0.1.39/run_trees.d.ts";
import { BaseRun, RunCreate, RunUpdate as BaseRunUpdate, KVMap } from "https://esm.sh/v135/langsmith@0.1.39/schemas.d.ts";
import { BaseTracer } from "./base.d.ts";
import { BaseCallbackHandlerInput } from "../callbacks/base.d.ts";
export interface Run extends BaseRun {
    id: string;
    child_runs: this[];
    child_execution_order: number;
    dotted_order?: string;
    trace_id?: string;
}
export interface RunCreate2 extends RunCreate {
    trace_id?: string;
    dotted_order?: string;
}
export interface RunUpdate extends BaseRunUpdate {
    events: BaseRun["events"];
    inputs: KVMap;
    trace_id?: string;
    dotted_order?: string;
}
export interface LangChainTracerFields extends BaseCallbackHandlerInput {
    exampleId?: string;
    projectName?: string;
    client?: Client;
}
export declare class LangChainTracer extends BaseTracer implements LangChainTracerFields {
    name: string;
    projectName?: string;
    exampleId?: string;
    client: Client;
    constructor(fields?: LangChainTracerFields);
    private _convertToCreate;
    protected persistRun(_run: Run): Promise<void>;
    onRunCreate(run: Run): Promise<void>;
    onRunUpdate(run: Run): Promise<void>;
    getRun(id: string): Run | undefined;
    updateFromRunTree(runTree: RunTree): void;
    convertToRunTree(id: string): RunTree | undefined;
    static getTraceableRunTree(): RunTree | undefined;
}
