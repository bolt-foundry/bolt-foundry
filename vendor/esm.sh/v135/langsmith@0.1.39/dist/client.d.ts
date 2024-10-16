import { AsyncCallerParams } from "./utils/async_caller.d.ts";
import { ComparativeExperiment, DataType, Dataset, DatasetDiffInfo, DatasetShareSchema, Example, ExampleUpdate, ExampleUpdateWithId, Feedback, FeedbackConfig, FeedbackIngestToken, KVMap, LangChainBaseMessage, Run, RunCreate, RunUpdate, ScoreType, TimeDelta, TracerSession, TracerSessionResult, ValueType } from "./schemas.d.ts";
import { EvaluationResult, EvaluationResults, RunEvaluator } from "./evaluation/evaluator.d.ts";
interface ClientConfig {
    apiUrl?: string;
    apiKey?: string;
    callerOptions?: AsyncCallerParams;
    timeout_ms?: number;
    webUrl?: string;
    anonymizer?: (values: KVMap) => KVMap;
    hideInputs?: boolean | ((inputs: KVMap) => KVMap);
    hideOutputs?: boolean | ((outputs: KVMap) => KVMap);
    autoBatchTracing?: boolean;
    pendingAutoBatchedRunLimit?: number;
    fetchOptions?: RequestInit;
}
/**
 * Represents the parameters for listing runs (spans) from the Langsmith server.
 */
interface ListRunsParams {
    /**
     * The ID or IDs of the project(s) to filter by.
     */
    projectId?: string | string[];
    /**
     * The name or names of the project(s) to filter by.
     */
    projectName?: string | string[];
    /**
     * The ID of the trace to filter by.
     */
    traceId?: string;
    /**
     * isRoot - Whether to only include root runs.
     *  */
    isRoot?: boolean;
    /**
     * The execution order to filter by.
     */
    executionOrder?: number;
    /**
     * The ID of the parent run to filter by.
     */
    parentRunId?: string;
    /**
     * The ID of the reference example to filter by.
     */
    referenceExampleId?: string;
    /**
     * The start time to filter by.
     */
    startTime?: Date;
    /**
     * The run type to filter by.
     */
    runType?: string;
    /**
     * Indicates whether to filter by error runs.
     */
    error?: boolean;
    /**
     * The ID or IDs of the runs to filter by.
     */
    id?: string[];
    /**
     * The maximum number of runs to retrieve.
     */
    limit?: number;
    /**
     * The query string to filter by.
     */
    query?: string;
    /**
     * The filter string to apply.
     *
     * Run Filtering:
     * Listing runs with query params is useful for simple queries, but doesn't support many common needs, such as filtering by metadata, tags, or other fields.
     * LangSmith supports a filter query language to permit more complex filtering operations when fetching runs. This guide will provide a high level overview of the grammar as well as a few examples of when it can be useful.
     * If you'd prefer a more visual guide, you can get a taste of the language by viewing the table of runs on any of your projects' pages. We provide some recommended filters to get you started that you can copy and use the SDK.
     *
     * Grammar:
     * The filtering grammar is based on common comparators on fields in the run object. Supported comparators include:
     * - gte (greater than or equal to)
     * - gt (greater than)
     * - lte (less than or equal to)
     * - lt (less than)
     * - eq (equal to)
     * - neq (not equal to)
     * - has (check if run contains a tag or metadata json blob)
     * - search (search for a substring in a string field)
     */
    filter?: string;
    /**
     * Filter to apply to the ROOT run in the trace tree. This is meant to be used in conjunction with the regular
     *  `filter` parameter to let you filter runs by attributes of the root run within a trace. Example is filtering by
     * feedback assigned to the trace.
     */
    traceFilter?: string;
    /**
     * Filter to apply to OTHER runs in the trace tree, including sibling and child runs. This is meant to be used in
     * conjunction with the regular `filter` parameter to let you filter runs by attributes of any run within a trace.
     */
    treeFilter?: string;
    /**
     * The values to include in the response.
     */
    select?: string[];
}
interface UploadCSVParams {
    csvFile: Blob;
    fileName: string;
    inputKeys: string[];
    outputKeys: string[];
    description?: string;
    dataType?: DataType;
    name?: string;
}
interface CreateRunParams {
    name: string;
    inputs: KVMap;
    run_type: string;
    id?: string;
    start_time?: number;
    end_time?: number;
    extra?: KVMap;
    error?: string;
    serialized?: object;
    outputs?: KVMap;
    reference_example_id?: string;
    child_runs?: RunCreate[];
    parent_run_id?: string;
    project_name?: string;
    revision_id?: string;
    trace_id?: string;
    dotted_order?: string;
}
interface ProjectOptions {
    projectName?: string;
    projectId?: string;
}
type RecordStringAny = Record<string, any>;
export type FeedbackSourceType = "model" | "api" | "app";
export type CreateExampleOptions = {
    datasetId?: string;
    datasetName?: string;
    createdAt?: Date;
    exampleId?: string;
    metadata?: KVMap;
    split?: string | string[];
};
export declare class Queue<T> {
    items: [T, () => void][];
    get size(): number;
    push(item: T): Promise<void>;
    pop(upToN: number): [T[], () => void];
}
export declare const DEFAULT_BATCH_SIZE_LIMIT_BYTES = 20971520;
export declare class Client {
    private apiKey?;
    private apiUrl;
    private webUrl?;
    private caller;
    private batchIngestCaller;
    private timeout_ms;
    private _tenantId;
    private hideInputs?;
    private hideOutputs?;
    private tracingSampleRate?;
    private sampledPostUuids;
    private autoBatchTracing;
    private batchEndpointSupported?;
    private autoBatchQueue;
    private pendingAutoBatchedRunLimit;
    private autoBatchTimeout;
    private autoBatchInitialDelayMs;
    private autoBatchAggregationDelayMs;
    private serverInfo;
    private fetchOptions;
    constructor(config?: ClientConfig);
    static getDefaultClientConfig(): {
        apiUrl: string;
        apiKey?: string;
        webUrl?: string;
        hideInputs?: boolean;
        hideOutputs?: boolean;
    };
    getHostUrl(): string;
    private get headers();
    private processInputs;
    private processOutputs;
    private prepareRunCreateOrUpdateInputs;
    private _getResponse;
    private _get;
    private _getPaginated;
    private _getCursorPaginatedList;
    private _filterForSampling;
    private drainAutoBatchQueue;
    private processRunOperation;
    protected _getServerInfo(): Promise<any>;
    protected batchEndpointIsSupported(): Promise<boolean>;
    createRun(run: CreateRunParams): Promise<void>;
    /**
     * Batch ingest/upsert multiple runs in the Langsmith system.
     * @param runs
     */
    batchIngestRuns({ runCreates, runUpdates, }: {
        runCreates?: RunCreate[];
        runUpdates?: RunUpdate[];
    }): Promise<void>;
    private _postBatchIngestRuns;
    updateRun(runId: string, run: RunUpdate): Promise<void>;
    readRun(runId: string, { loadChildRuns }?: {
        loadChildRuns: boolean;
    }): Promise<Run>;
    getRunUrl({ runId, run, projectOpts, }: {
        runId?: string;
        run?: Run;
        projectOpts?: ProjectOptions;
    }): Promise<string>;
    private _loadChildRuns;
    /**
     * List runs from the LangSmith server.
     * @param projectId - The ID of the project to filter by.
     * @param projectName - The name of the project to filter by.
     * @param parentRunId - The ID of the parent run to filter by.
     * @param traceId - The ID of the trace to filter by.
     * @param referenceExampleId - The ID of the reference example to filter by.
     * @param startTime - The start time to filter by.
     * @param isRoot - Indicates whether to only return root runs.
     * @param runType - The run type to filter by.
     * @param error - Indicates whether to filter by error runs.
     * @param id - The ID of the run to filter by.
     * @param query - The query string to filter by.
     * @param filter - The filter string to apply to the run spans.
     * @param traceFilter - The filter string to apply on the root run of the trace.
     * @param limit - The maximum number of runs to retrieve.
     * @returns {AsyncIterable<Run>} - The runs.
     *
     * @example
     * // List all runs in a project
     * const projectRuns = client.listRuns({ projectName: "<your_project>" });
     *
     * @example
     * // List LLM and Chat runs in the last 24 hours
     * const todaysLLMRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   start_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
     *   run_type: "llm",
     * });
     *
     * @example
     * // List traces in a project
     * const rootRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   execution_order: 1,
     * });
     *
     * @example
     * // List runs without errors
     * const correctRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   error: false,
     * });
     *
     * @example
     * // List runs by run ID
     * const runIds = [
     *   "a36092d2-4ad5-4fb4-9c0d-0dba9a2ed836",
     *   "9398e6be-964f-4aa4-8ae9-ad78cd4b7074",
     * ];
     * const selectedRuns = client.listRuns({ run_ids: runIds });
     *
     * @example
     * // List all "chain" type runs that took more than 10 seconds and had `total_tokens` greater than 5000
     * const chainRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   filter: 'and(eq(run_type, "chain"), gt(latency, 10), gt(total_tokens, 5000))',
     * });
     *
     * @example
     * // List all runs called "extractor" whose root of the trace was assigned feedback "user_score" score of 1
     * const goodExtractorRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   filter: 'eq(name, "extractor")',
     *   traceFilter: 'and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
     * });
     *
     * @example
     * // List all runs that started after a specific timestamp and either have "error" not equal to null or a "Correctness" feedback score equal to 0
     * const complexRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   filter: 'and(gt(start_time, "2023-07-15T12:34:56Z"), or(neq(error, null), and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))',
     * });
     *
     * @example
     * // List all runs where `tags` include "experimental" or "beta" and `latency` is greater than 2 seconds
     * const taggedRuns = client.listRuns({
     *   projectName: "<your_project>",
     *   filter: 'and(or(has(tags, "experimental"), has(tags, "beta")), gt(latency, 2))',
     * });
     */
    listRuns(props: ListRunsParams): AsyncIterable<Run>;
    getRunStats({ id, trace, parentRun, runType, projectNames, projectIds, referenceExampleIds, startTime, endTime, error, query, filter, traceFilter, treeFilter, isRoot, dataSourceType, }: {
        id?: string[];
        trace?: string;
        parentRun?: string;
        runType?: string;
        projectNames?: string[];
        projectIds?: string[];
        referenceExampleIds?: string[];
        startTime?: string;
        endTime?: string;
        error?: boolean;
        query?: string;
        filter?: string;
        traceFilter?: string;
        treeFilter?: string;
        isRoot?: boolean;
        dataSourceType?: string;
    }): Promise<any>;
    shareRun(runId: string, { shareId }?: {
        shareId?: string;
    }): Promise<string>;
    unshareRun(runId: string): Promise<void>;
    readRunSharedLink(runId: string): Promise<string | undefined>;
    listSharedRuns(shareToken: string, { runIds, }?: {
        runIds?: string[];
    }): Promise<Run[]>;
    readDatasetSharedSchema(datasetId?: string, datasetName?: string): Promise<DatasetShareSchema>;
    shareDataset(datasetId?: string, datasetName?: string): Promise<DatasetShareSchema>;
    unshareDataset(datasetId: string): Promise<void>;
    readSharedDataset(shareToken: string): Promise<Dataset>;
    createProject({ projectName, description, metadata, upsert, projectExtra, referenceDatasetId, }: {
        projectName: string;
        description?: string | null;
        metadata?: RecordStringAny | null;
        upsert?: boolean;
        projectExtra?: RecordStringAny | null;
        referenceDatasetId?: string | null;
    }): Promise<TracerSession>;
    updateProject(projectId: string, { name, description, metadata, projectExtra, endTime, }: {
        name?: string | null;
        description?: string | null;
        metadata?: RecordStringAny | null;
        projectExtra?: RecordStringAny | null;
        endTime?: string | null;
    }): Promise<TracerSession>;
    hasProject({ projectId, projectName, }: {
        projectId?: string;
        projectName?: string;
    }): Promise<boolean>;
    readProject({ projectId, projectName, includeStats, }: {
        projectId?: string;
        projectName?: string;
        includeStats?: boolean;
    }): Promise<TracerSessionResult>;
    getProjectUrl({ projectId, projectName, }: {
        projectId?: string;
        projectName?: string;
    }): Promise<string>;
    getDatasetUrl({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<string>;
    private _getTenantId;
    listProjects({ projectIds, name, nameContains, referenceDatasetId, referenceDatasetName, referenceFree, }?: {
        projectIds?: string[];
        name?: string;
        nameContains?: string;
        referenceDatasetId?: string;
        referenceDatasetName?: string;
        referenceFree?: boolean;
    }): AsyncIterable<TracerSession>;
    deleteProject({ projectId, projectName, }: {
        projectId?: string;
        projectName?: string;
    }): Promise<void>;
    uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, dataType, name, }: UploadCSVParams): Promise<Dataset>;
    createDataset(name: string, { description, dataType, }?: {
        description?: string;
        dataType?: DataType;
    }): Promise<Dataset>;
    readDataset({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<Dataset>;
    hasDataset({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<boolean>;
    diffDatasetVersions({ datasetId, datasetName, fromVersion, toVersion, }: {
        datasetId?: string;
        datasetName?: string;
        fromVersion: string | Date;
        toVersion: string | Date;
    }): Promise<DatasetDiffInfo>;
    readDatasetOpenaiFinetuning({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<any[]>;
    listDatasets({ limit, offset, datasetIds, datasetName, datasetNameContains, }?: {
        limit?: number;
        offset?: number;
        datasetIds?: string[];
        datasetName?: string;
        datasetNameContains?: string;
    }): AsyncIterable<Dataset>;
    /**
     * Update a dataset
     * @param props The dataset details to update
     * @returns The updated dataset
     */
    updateDataset(props: {
        datasetId?: string;
        datasetName?: string;
        name?: string;
        description?: string;
    }): Promise<Dataset>;
    deleteDataset({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<void>;
    createExample(inputs: KVMap, outputs: KVMap, { datasetId, datasetName, createdAt, exampleId, metadata, split, }: CreateExampleOptions): Promise<Example>;
    createExamples(props: {
        inputs: Array<KVMap>;
        outputs?: Array<KVMap>;
        metadata?: Array<KVMap>;
        splits?: Array<string | Array<string>>;
        sourceRunIds?: Array<string>;
        exampleIds?: Array<string>;
        datasetId?: string;
        datasetName?: string;
    }): Promise<Example[]>;
    createLLMExample(input: string, generation: string | undefined, options: CreateExampleOptions): Promise<Example>;
    createChatExample(input: KVMap[] | LangChainBaseMessage[], generations: KVMap | LangChainBaseMessage | undefined, options: CreateExampleOptions): Promise<Example>;
    readExample(exampleId: string): Promise<Example>;
    listExamples({ datasetId, datasetName, exampleIds, asOf, splits, inlineS3Urls, metadata, limit, offset, filter, }?: {
        datasetId?: string;
        datasetName?: string;
        exampleIds?: string[];
        asOf?: string | Date;
        splits?: string[];
        inlineS3Urls?: boolean;
        metadata?: KVMap;
        limit?: number;
        offset?: number;
        filter?: string;
    }): AsyncIterable<Example>;
    deleteExample(exampleId: string): Promise<void>;
    updateExample(exampleId: string, update: ExampleUpdate): Promise<object>;
    updateExamples(update: ExampleUpdateWithId[]): Promise<object>;
    listDatasetSplits({ datasetId, datasetName, asOf, }: {
        datasetId?: string;
        datasetName?: string;
        asOf?: string | Date;
    }): Promise<string[]>;
    updateDatasetSplits({ datasetId, datasetName, splitName, exampleIds, remove, }: {
        datasetId?: string;
        datasetName?: string;
        splitName: string;
        exampleIds: string[];
        remove?: boolean;
    }): Promise<void>;
    /**
     * @deprecated This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.
     */
    evaluateRun(run: Run | string, evaluator: RunEvaluator, { sourceInfo, loadChildRuns, referenceExample, }?: {
        sourceInfo?: KVMap;
        loadChildRuns: boolean;
        referenceExample?: Example;
    }): Promise<Feedback>;
    createFeedback(runId: string | null, key: string, { score, value, correction, comment, sourceInfo, feedbackSourceType, sourceRunId, feedbackId, feedbackConfig, projectId, comparativeExperimentId, }: {
        score?: ScoreType;
        value?: ValueType;
        correction?: object;
        comment?: string;
        sourceInfo?: object;
        feedbackSourceType?: FeedbackSourceType;
        feedbackConfig?: FeedbackConfig;
        sourceRunId?: string;
        feedbackId?: string;
        eager?: boolean;
        projectId?: string;
        comparativeExperimentId?: string;
    }): Promise<Feedback>;
    updateFeedback(feedbackId: string, { score, value, correction, comment, }: {
        score?: number | boolean | null;
        value?: number | boolean | string | object | null;
        correction?: object | null;
        comment?: string | null;
    }): Promise<void>;
    readFeedback(feedbackId: string): Promise<Feedback>;
    deleteFeedback(feedbackId: string): Promise<void>;
    listFeedback({ runIds, feedbackKeys, feedbackSourceTypes, }?: {
        runIds?: string[];
        feedbackKeys?: string[];
        feedbackSourceTypes?: FeedbackSourceType[];
    }): AsyncIterable<Feedback>;
    /**
     * Creates a presigned feedback token and URL.
     *
     * The token can be used to authorize feedback metrics without
     * needing an API key. This is useful for giving browser-based
     * applications the ability to submit feedback without needing
     * to expose an API key.
     *
     * @param runId - The ID of the run.
     * @param feedbackKey - The feedback key.
     * @param options - Additional options for the token.
     * @param options.expiration - The expiration time for the token.
     *
     * @returns A promise that resolves to a FeedbackIngestToken.
     */
    createPresignedFeedbackToken(runId: string, feedbackKey: string, { expiration, feedbackConfig, }?: {
        expiration?: string | TimeDelta;
        feedbackConfig?: FeedbackConfig;
    }): Promise<FeedbackIngestToken>;
    createComparativeExperiment({ name, experimentIds, referenceDatasetId, createdAt, description, metadata, id, }: {
        name: string;
        experimentIds: Array<string>;
        referenceDatasetId?: string;
        createdAt?: Date;
        description?: string;
        metadata?: Record<string, unknown>;
        id?: string;
    }): Promise<ComparativeExperiment>;
    /**
     * Retrieves a list of presigned feedback tokens for a given run ID.
     * @param runId The ID of the run.
     * @returns An async iterable of FeedbackIngestToken objects.
     */
    listPresignedFeedbackTokens(runId: string): AsyncIterable<FeedbackIngestToken>;
    _selectEvalResults(results: EvaluationResult | EvaluationResults): Array<EvaluationResult>;
    _logEvaluationFeedback(evaluatorResponse: EvaluationResult | EvaluationResults, run?: Run, sourceInfo?: {
        [key: string]: any;
    }): Promise<[results: EvaluationResult[], feedbacks: Feedback[]]>;
    logEvaluationFeedback(evaluatorResponse: EvaluationResult | EvaluationResults, run?: Run, sourceInfo?: {
        [key: string]: any;
    }): Promise<EvaluationResult[]>;
}
export {};
