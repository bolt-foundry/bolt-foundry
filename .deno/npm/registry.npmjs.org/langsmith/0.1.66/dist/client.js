import * as uuid from "uuid";
import { AsyncCaller } from "./utils/async_caller.js";
import { convertLangChainMessageToExample, isLangChainMessage, } from "./utils/messages.js";
import { getLangChainEnvVarsMetadata, getLangSmithEnvironmentVariable, getRuntimeEnvironment, } from "./utils/env.js";
import { __version__ } from "./index.js";
import { assertUuid } from "./utils/_uuid.js";
import { warnOnce } from "./utils/warn.js";
import { isVersionGreaterOrEqual, parsePromptIdentifier, } from "./utils/prompts.js";
import { raiseForStatus } from "./utils/error.js";
import { _getFetchImplementation } from "./singletons/fetch.js";
import { stringify as stringifyForTracing } from "./utils/fast-safe-stringify/index.js";
async function mergeRuntimeEnvIntoRunCreates(runs) {
    const runtimeEnv = await getRuntimeEnvironment();
    const envVars = getLangChainEnvVarsMetadata();
    return runs.map((run) => {
        const extra = run.extra ?? {};
        const metadata = extra.metadata;
        run.extra = {
            ...extra,
            runtime: {
                ...runtimeEnv,
                ...extra?.runtime,
            },
            metadata: {
                ...envVars,
                ...(envVars.revision_id || run.revision_id
                    ? { revision_id: run.revision_id ?? envVars.revision_id }
                    : {}),
                ...metadata,
            },
        };
        return run;
    });
}
const getTracingSamplingRate = () => {
    const samplingRateStr = getLangSmithEnvironmentVariable("TRACING_SAMPLING_RATE");
    if (samplingRateStr === undefined) {
        return undefined;
    }
    const samplingRate = parseFloat(samplingRateStr);
    if (samplingRate < 0 || samplingRate > 1) {
        throw new Error(`LANGSMITH_TRACING_SAMPLING_RATE must be between 0 and 1 if set. Got: ${samplingRate}`);
    }
    return samplingRate;
};
// utility functions
const isLocalhost = (url) => {
    const strippedUrl = url.replace("http://", "").replace("https://", "");
    const hostname = strippedUrl.split("/")[0].split(":")[0];
    return (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1");
};
async function toArray(iterable) {
    const result = [];
    for await (const item of iterable) {
        result.push(item);
    }
    return result;
}
function trimQuotes(str) {
    if (str === undefined) {
        return undefined;
    }
    return str
        .trim()
        .replace(/^"(.*)"$/, "$1")
        .replace(/^'(.*)'$/, "$1");
}
const handle429 = async (response) => {
    if (response?.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") ?? "30", 10) * 1000;
        if (retryAfter > 0) {
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
            // Return directly after calling this check
            return true;
        }
    }
    // Fall back to existing status checks
    return false;
};
export class Queue {
    constructor() {
        Object.defineProperty(this, "items", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    get size() {
        return this.items.length;
    }
    push(item) {
        let itemPromiseResolve;
        const itemPromise = new Promise((resolve) => {
            // Setting itemPromiseResolve is synchronous with promise creation:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
            itemPromiseResolve = resolve;
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.items.push([item, itemPromiseResolve, itemPromise]);
        return itemPromise;
    }
    pop(upToN) {
        if (upToN < 1) {
            throw new Error("Number of items to pop off may not be less than 1.");
        }
        const popped = [];
        while (popped.length < upToN && this.items.length) {
            const item = this.items.shift();
            if (item) {
                popped.push(item);
            }
            else {
                break;
            }
        }
        return [popped.map((it) => it[0]), () => popped.forEach((it) => it[1]())];
    }
}
// 20 MB
export const DEFAULT_BATCH_SIZE_LIMIT_BYTES = 20_971_520;
export class Client {
    constructor(config = {}) {
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "webUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "caller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "batchIngestCaller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeout_ms", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tenantId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "hideInputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hideOutputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tracingSampleRate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "filteredPostUuids", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "autoBatchTracing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "batchEndpointSupported", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "autoBatchQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Queue()
        });
        Object.defineProperty(this, "pendingAutoBatchedRunLimit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        Object.defineProperty(this, "autoBatchTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "autoBatchInitialDelayMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 250
        });
        Object.defineProperty(this, "autoBatchAggregationDelayMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
        Object.defineProperty(this, "serverInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fetchOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "blockOnRootRunFinalization", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        const defaultConfig = Client.getDefaultClientConfig();
        this.tracingSampleRate = getTracingSamplingRate();
        this.apiUrl = trimQuotes(config.apiUrl ?? defaultConfig.apiUrl) ?? "";
        if (this.apiUrl.endsWith("/")) {
            this.apiUrl = this.apiUrl.slice(0, -1);
        }
        this.apiKey = trimQuotes(config.apiKey ?? defaultConfig.apiKey);
        this.webUrl = trimQuotes(config.webUrl ?? defaultConfig.webUrl);
        if (this.webUrl?.endsWith("/")) {
            this.webUrl = this.webUrl.slice(0, -1);
        }
        this.timeout_ms = config.timeout_ms ?? 12_000;
        this.caller = new AsyncCaller(config.callerOptions ?? {});
        this.batchIngestCaller = new AsyncCaller({
            ...(config.callerOptions ?? {}),
            onFailedResponseHook: handle429,
        });
        this.hideInputs =
            config.hideInputs ?? config.anonymizer ?? defaultConfig.hideInputs;
        this.hideOutputs =
            config.hideOutputs ?? config.anonymizer ?? defaultConfig.hideOutputs;
        this.autoBatchTracing = config.autoBatchTracing ?? this.autoBatchTracing;
        this.blockOnRootRunFinalization =
            config.blockOnRootRunFinalization ?? this.blockOnRootRunFinalization;
        this.pendingAutoBatchedRunLimit =
            config.pendingAutoBatchedRunLimit ?? this.pendingAutoBatchedRunLimit;
        this.fetchOptions = config.fetchOptions || {};
    }
    static getDefaultClientConfig() {
        const apiKey = getLangSmithEnvironmentVariable("API_KEY");
        const apiUrl = getLangSmithEnvironmentVariable("ENDPOINT") ??
            "https://api.smith.langchain.com";
        const hideInputs = getLangSmithEnvironmentVariable("HIDE_INPUTS") === "true";
        const hideOutputs = getLangSmithEnvironmentVariable("HIDE_OUTPUTS") === "true";
        return {
            apiUrl: apiUrl,
            apiKey: apiKey,
            webUrl: undefined,
            hideInputs: hideInputs,
            hideOutputs: hideOutputs,
        };
    }
    getHostUrl() {
        if (this.webUrl) {
            return this.webUrl;
        }
        else if (isLocalhost(this.apiUrl)) {
            this.webUrl = "http://localhost:3000";
            return this.webUrl;
        }
        else if (this.apiUrl.includes("/api") &&
            !this.apiUrl.split(".", 1)[0].endsWith("api")) {
            this.webUrl = this.apiUrl.replace("/api", "");
            return this.webUrl;
        }
        else if (this.apiUrl.split(".", 1)[0].includes("dev")) {
            this.webUrl = "https://dev.smith.langchain.com";
            return this.webUrl;
        }
        else if (this.apiUrl.split(".", 1)[0].includes("eu")) {
            this.webUrl = "https://eu.smith.langchain.com";
            return this.webUrl;
        }
        else {
            this.webUrl = "https://smith.langchain.com";
            return this.webUrl;
        }
    }
    get headers() {
        const headers = {
            "User-Agent": `langsmith-js/${__version__}`,
        };
        if (this.apiKey) {
            headers["x-api-key"] = `${this.apiKey}`;
        }
        return headers;
    }
    processInputs(inputs) {
        if (this.hideInputs === false) {
            return inputs;
        }
        if (this.hideInputs === true) {
            return {};
        }
        if (typeof this.hideInputs === "function") {
            return this.hideInputs(inputs);
        }
        return inputs;
    }
    processOutputs(outputs) {
        if (this.hideOutputs === false) {
            return outputs;
        }
        if (this.hideOutputs === true) {
            return {};
        }
        if (typeof this.hideOutputs === "function") {
            return this.hideOutputs(outputs);
        }
        return outputs;
    }
    prepareRunCreateOrUpdateInputs(run) {
        const runParams = { ...run };
        if (runParams.inputs !== undefined) {
            runParams.inputs = this.processInputs(runParams.inputs);
        }
        if (runParams.outputs !== undefined) {
            runParams.outputs = this.processOutputs(runParams.outputs);
        }
        return runParams;
    }
    async _getResponse(path, queryParams) {
        const paramsString = queryParams?.toString() ?? "";
        const url = `${this.apiUrl}${path}?${paramsString}`;
        const response = await this.caller.call(_getFetchImplementation(), url, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, `Failed to fetch ${path}`);
        return response;
    }
    async _get(path, queryParams) {
        const response = await this._getResponse(path, queryParams);
        return response.json();
    }
    async *_getPaginated(path, queryParams = new URLSearchParams(), transform) {
        let offset = Number(queryParams.get("offset")) || 0;
        const limit = Number(queryParams.get("limit")) || 100;
        while (true) {
            queryParams.set("offset", String(offset));
            queryParams.set("limit", String(limit));
            const url = `${this.apiUrl}${path}?${queryParams}`;
            const response = await this.caller.call(_getFetchImplementation(), url, {
                method: "GET",
                headers: this.headers,
                signal: AbortSignal.timeout(this.timeout_ms),
                ...this.fetchOptions,
            });
            await raiseForStatus(response, `Failed to fetch ${path}`);
            const items = transform
                ? transform(await response.json())
                : await response.json();
            if (items.length === 0) {
                break;
            }
            yield items;
            if (items.length < limit) {
                break;
            }
            offset += items.length;
        }
    }
    async *_getCursorPaginatedList(path, body = null, requestMethod = "POST", dataKey = "runs") {
        const bodyParams = body ? { ...body } : {};
        while (true) {
            const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}`, {
                method: requestMethod,
                headers: { ...this.headers, "Content-Type": "application/json" },
                signal: AbortSignal.timeout(this.timeout_ms),
                ...this.fetchOptions,
                body: JSON.stringify(bodyParams),
            });
            const responseBody = await response.json();
            if (!responseBody) {
                break;
            }
            if (!responseBody[dataKey]) {
                break;
            }
            yield responseBody[dataKey];
            const cursors = responseBody.cursors;
            if (!cursors) {
                break;
            }
            if (!cursors.next) {
                break;
            }
            bodyParams.cursor = cursors.next;
        }
    }
    _filterForSampling(runs, patch = false) {
        if (this.tracingSampleRate === undefined) {
            return runs;
        }
        if (patch) {
            const sampled = [];
            for (const run of runs) {
                if (!this.filteredPostUuids.has(run.id)) {
                    sampled.push(run);
                }
                else {
                    this.filteredPostUuids.delete(run.id);
                }
            }
            return sampled;
        }
        else {
            const sampled = [];
            for (const run of runs) {
                if ((run.id !== run.trace_id &&
                    !this.filteredPostUuids.has(run.trace_id)) ||
                    Math.random() < this.tracingSampleRate) {
                    sampled.push(run);
                }
                else {
                    this.filteredPostUuids.add(run.id);
                }
            }
            return sampled;
        }
    }
    async drainAutoBatchQueue() {
        while (this.autoBatchQueue.size >= 0) {
            const [batch, done] = this.autoBatchQueue.pop(this.pendingAutoBatchedRunLimit);
            if (!batch.length) {
                done();
                return;
            }
            try {
                await this.batchIngestRuns({
                    runCreates: batch
                        .filter((item) => item.action === "create")
                        .map((item) => item.item),
                    runUpdates: batch
                        .filter((item) => item.action === "update")
                        .map((item) => item.item),
                });
            }
            finally {
                done();
            }
        }
    }
    async processRunOperation(item, immediatelyTriggerBatch) {
        const oldTimeout = this.autoBatchTimeout;
        clearTimeout(this.autoBatchTimeout);
        this.autoBatchTimeout = undefined;
        const itemPromise = this.autoBatchQueue.push(item);
        if (immediatelyTriggerBatch ||
            this.autoBatchQueue.size > this.pendingAutoBatchedRunLimit) {
            await this.drainAutoBatchQueue().catch(console.error);
        }
        if (this.autoBatchQueue.size > 0) {
            this.autoBatchTimeout = setTimeout(() => {
                this.autoBatchTimeout = undefined;
                // This error would happen in the background and is uncatchable
                // from the outside. So just log instead.
                void this.drainAutoBatchQueue().catch(console.error);
            }, oldTimeout
                ? this.autoBatchAggregationDelayMs
                : this.autoBatchInitialDelayMs);
        }
        return itemPromise;
    }
    async _getServerInfo() {
        const response = await _getFetchImplementation()(`${this.apiUrl}/info`, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "get server info");
        return response.json();
    }
    async batchEndpointIsSupported() {
        try {
            this.serverInfo = await this._getServerInfo();
        }
        catch (e) {
            return false;
        }
        return true;
    }
    async _getSettings() {
        if (!this.settings) {
            this.settings = this._get("/settings");
        }
        return await this.settings;
    }
    async createRun(run) {
        if (!this._filterForSampling([run]).length) {
            return;
        }
        const headers = { ...this.headers, "Content-Type": "application/json" };
        const session_name = run.project_name;
        delete run.project_name;
        const runCreate = this.prepareRunCreateOrUpdateInputs({
            session_name,
            ...run,
            start_time: run.start_time ?? Date.now(),
        });
        if (this.autoBatchTracing &&
            runCreate.trace_id !== undefined &&
            runCreate.dotted_order !== undefined) {
            void this.processRunOperation({
                action: "create",
                item: runCreate,
            }).catch(console.error);
            return;
        }
        const mergedRunCreateParams = await mergeRuntimeEnvIntoRunCreates([
            runCreate,
        ]);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs`, {
            method: "POST",
            headers,
            body: stringifyForTracing(mergedRunCreateParams[0]),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create run", true);
    }
    /**
     * Batch ingest/upsert multiple runs in the Langsmith system.
     * @param runs
     */
    async batchIngestRuns({ runCreates, runUpdates, }) {
        if (runCreates === undefined && runUpdates === undefined) {
            return;
        }
        let preparedCreateParams = runCreates?.map((create) => this.prepareRunCreateOrUpdateInputs(create)) ?? [];
        let preparedUpdateParams = runUpdates?.map((update) => this.prepareRunCreateOrUpdateInputs(update)) ?? [];
        if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
            const createById = preparedCreateParams.reduce((params, run) => {
                if (!run.id) {
                    return params;
                }
                params[run.id] = run;
                return params;
            }, {});
            const standaloneUpdates = [];
            for (const updateParam of preparedUpdateParams) {
                if (updateParam.id !== undefined && createById[updateParam.id]) {
                    createById[updateParam.id] = {
                        ...createById[updateParam.id],
                        ...updateParam,
                    };
                }
                else {
                    standaloneUpdates.push(updateParam);
                }
            }
            preparedCreateParams = Object.values(createById);
            preparedUpdateParams = standaloneUpdates;
        }
        const rawBatch = {
            post: this._filterForSampling(preparedCreateParams),
            patch: this._filterForSampling(preparedUpdateParams, true),
        };
        if (!rawBatch.post.length && !rawBatch.patch.length) {
            return;
        }
        preparedCreateParams = await mergeRuntimeEnvIntoRunCreates(preparedCreateParams);
        if (this.batchEndpointSupported === undefined) {
            this.batchEndpointSupported = await this.batchEndpointIsSupported();
        }
        if (!this.batchEndpointSupported) {
            this.autoBatchTracing = false;
            for (const preparedCreateParam of rawBatch.post) {
                await this.createRun(preparedCreateParam);
            }
            for (const preparedUpdateParam of rawBatch.patch) {
                if (preparedUpdateParam.id !== undefined) {
                    await this.updateRun(preparedUpdateParam.id, preparedUpdateParam);
                }
            }
            return;
        }
        const sizeLimitBytes = this.serverInfo?.batch_ingest_config?.size_limit_bytes ??
            DEFAULT_BATCH_SIZE_LIMIT_BYTES;
        const batchChunks = {
            post: [],
            patch: [],
        };
        let currentBatchSizeBytes = 0;
        for (const k of ["post", "patch"]) {
            const key = k;
            const batchItems = rawBatch[key].reverse();
            let batchItem = batchItems.pop();
            while (batchItem !== undefined) {
                const stringifiedBatchItem = stringifyForTracing(batchItem);
                if (currentBatchSizeBytes > 0 &&
                    currentBatchSizeBytes + stringifiedBatchItem.length > sizeLimitBytes) {
                    await this._postBatchIngestRuns(stringifyForTracing(batchChunks));
                    currentBatchSizeBytes = 0;
                    batchChunks.post = [];
                    batchChunks.patch = [];
                }
                currentBatchSizeBytes += stringifiedBatchItem.length;
                batchChunks[key].push(batchItem);
                batchItem = batchItems.pop();
            }
        }
        if (batchChunks.post.length > 0 || batchChunks.patch.length > 0) {
            await this._postBatchIngestRuns(stringifyForTracing(batchChunks));
        }
    }
    async _postBatchIngestRuns(body) {
        const headers = {
            ...this.headers,
            "Content-Type": "application/json",
            Accept: "application/json",
        };
        const response = await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/batch`, {
            method: "POST",
            headers,
            body: body,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "batch create run", true);
    }
    async updateRun(runId, run) {
        assertUuid(runId);
        if (run.inputs) {
            run.inputs = this.processInputs(run.inputs);
        }
        if (run.outputs) {
            run.outputs = this.processOutputs(run.outputs);
        }
        // TODO: Untangle types
        const data = { ...run, id: runId };
        if (!this._filterForSampling([data], true).length) {
            return;
        }
        if (this.autoBatchTracing &&
            data.trace_id !== undefined &&
            data.dotted_order !== undefined) {
            if (run.end_time !== undefined &&
                data.parent_run_id === undefined &&
                this.blockOnRootRunFinalization) {
                // Trigger a batch as soon as a root trace ends and block to ensure trace finishes
                // in serverless environments.
                await this.processRunOperation({ action: "update", item: data }, true);
                return;
            }
            else {
                void this.processRunOperation({ action: "update", item: data }).catch(console.error);
            }
            return;
        }
        const headers = { ...this.headers, "Content-Type": "application/json" };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}`, {
            method: "PATCH",
            headers,
            body: stringifyForTracing(run),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update run", true);
    }
    async readRun(runId, { loadChildRuns } = { loadChildRuns: false }) {
        assertUuid(runId);
        let run = await this._get(`/runs/${runId}`);
        if (loadChildRuns && run.child_run_ids) {
            run = await this._loadChildRuns(run);
        }
        return run;
    }
    async getRunUrl({ runId, run, projectOpts, }) {
        if (run !== undefined) {
            let sessionId;
            if (run.session_id) {
                sessionId = run.session_id;
            }
            else if (projectOpts?.projectName) {
                sessionId = (await this.readProject({ projectName: projectOpts?.projectName })).id;
            }
            else if (projectOpts?.projectId) {
                sessionId = projectOpts?.projectId;
            }
            else {
                const project = await this.readProject({
                    projectName: getLangSmithEnvironmentVariable("PROJECT") || "default",
                });
                sessionId = project.id;
            }
            const tenantId = await this._getTenantId();
            return `${this.getHostUrl()}/o/${tenantId}/projects/p/${sessionId}/r/${run.id}?poll=true`;
        }
        else if (runId !== undefined) {
            const run_ = await this.readRun(runId);
            if (!run_.app_path) {
                throw new Error(`Run ${runId} has no app_path`);
            }
            const baseUrl = this.getHostUrl();
            return `${baseUrl}${run_.app_path}`;
        }
        else {
            throw new Error("Must provide either runId or run");
        }
    }
    async _loadChildRuns(run) {
        const childRuns = await toArray(this.listRuns({ id: run.child_run_ids }));
        const treemap = {};
        const runs = {};
        // TODO: make dotted order required when the migration finishes
        childRuns.sort((a, b) => (a?.dotted_order ?? "").localeCompare(b?.dotted_order ?? ""));
        for (const childRun of childRuns) {
            if (childRun.parent_run_id === null ||
                childRun.parent_run_id === undefined) {
                throw new Error(`Child run ${childRun.id} has no parent`);
            }
            if (!(childRun.parent_run_id in treemap)) {
                treemap[childRun.parent_run_id] = [];
            }
            treemap[childRun.parent_run_id].push(childRun);
            runs[childRun.id] = childRun;
        }
        run.child_runs = treemap[run.id] || [];
        for (const runId in treemap) {
            if (runId !== run.id) {
                runs[runId].child_runs = treemap[runId];
            }
        }
        return run;
    }
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
    async *listRuns(props) {
        const { projectId, projectName, parentRunId, traceId, referenceExampleId, startTime, executionOrder, isRoot, runType, error, id, query, filter, traceFilter, treeFilter, limit, select, } = props;
        let projectIds = [];
        if (projectId) {
            projectIds = Array.isArray(projectId) ? projectId : [projectId];
        }
        if (projectName) {
            const projectNames = Array.isArray(projectName)
                ? projectName
                : [projectName];
            const projectIds_ = await Promise.all(projectNames.map((name) => this.readProject({ projectName: name }).then((project) => project.id)));
            projectIds.push(...projectIds_);
        }
        const default_select = [
            "app_path",
            "child_run_ids",
            "completion_cost",
            "completion_tokens",
            "dotted_order",
            "end_time",
            "error",
            "events",
            "extra",
            "feedback_stats",
            "first_token_time",
            "id",
            "inputs",
            "name",
            "outputs",
            "parent_run_id",
            "parent_run_ids",
            "prompt_cost",
            "prompt_tokens",
            "reference_example_id",
            "run_type",
            "session_id",
            "start_time",
            "status",
            "tags",
            "total_cost",
            "total_tokens",
            "trace_id",
        ];
        const body = {
            session: projectIds.length ? projectIds : null,
            run_type: runType,
            reference_example: referenceExampleId,
            query,
            filter,
            trace_filter: traceFilter,
            tree_filter: treeFilter,
            execution_order: executionOrder,
            parent_run: parentRunId,
            start_time: startTime ? startTime.toISOString() : null,
            error,
            id,
            limit,
            trace: traceId,
            select: select ? select : default_select,
            is_root: isRoot,
        };
        let runsYielded = 0;
        for await (const runs of this._getCursorPaginatedList("/runs/query", body)) {
            if (limit) {
                if (runsYielded >= limit) {
                    break;
                }
                if (runs.length + runsYielded > limit) {
                    const newRuns = runs.slice(0, limit - runsYielded);
                    yield* newRuns;
                    break;
                }
                runsYielded += runs.length;
                yield* runs;
            }
            else {
                yield* runs;
            }
        }
    }
    async getRunStats({ id, trace, parentRun, runType, projectNames, projectIds, referenceExampleIds, startTime, endTime, error, query, filter, traceFilter, treeFilter, isRoot, dataSourceType, }) {
        let projectIds_ = projectIds || [];
        if (projectNames) {
            projectIds_ = [
                ...(projectIds || []),
                ...(await Promise.all(projectNames.map((name) => this.readProject({ projectName: name }).then((project) => project.id)))),
            ];
        }
        const payload = {
            id,
            trace,
            parent_run: parentRun,
            run_type: runType,
            session: projectIds_,
            reference_example: referenceExampleIds,
            start_time: startTime,
            end_time: endTime,
            error,
            query,
            filter,
            trace_filter: traceFilter,
            tree_filter: treeFilter,
            is_root: isRoot,
            data_source_type: dataSourceType,
        };
        // Remove undefined values from the payload
        const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== undefined));
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/stats`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(filteredPayload),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const result = await response.json();
        return result;
    }
    async shareRun(runId, { shareId } = {}) {
        const data = {
            run_id: runId,
            share_token: shareId || uuid.v4(),
        };
        assertUuid(runId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const result = await response.json();
        if (result === null || !("share_token" in result)) {
            throw new Error("Invalid response from server");
        }
        return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
    }
    async unshareRun(runId) {
        assertUuid(runId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "unshare run", true);
    }
    async readRunSharedLink(runId) {
        assertUuid(runId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const result = await response.json();
        if (result === null || !("share_token" in result)) {
            return undefined;
        }
        return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
    }
    async listSharedRuns(shareToken, { runIds, } = {}) {
        const queryParams = new URLSearchParams({
            share_token: shareToken,
        });
        if (runIds !== undefined) {
            for (const runId of runIds) {
                queryParams.append("id", runId);
            }
        }
        assertUuid(shareToken);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/runs${queryParams}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const runs = await response.json();
        return runs;
    }
    async readDatasetSharedSchema(datasetId, datasetName) {
        if (!datasetId && !datasetName) {
            throw new Error("Either datasetId or datasetName must be given");
        }
        if (!datasetId) {
            const dataset = await this.readDataset({ datasetName });
            datasetId = dataset.id;
        }
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const shareSchema = await response.json();
        shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
        return shareSchema;
    }
    async shareDataset(datasetId, datasetName) {
        if (!datasetId && !datasetName) {
            throw new Error("Either datasetId or datasetName must be given");
        }
        if (!datasetId) {
            const dataset = await this.readDataset({ datasetName });
            datasetId = dataset.id;
        }
        const data = {
            dataset_id: datasetId,
        };
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const shareSchema = await response.json();
        shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
        return shareSchema;
    }
    async unshareDataset(datasetId) {
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "unshare dataset", true);
    }
    async readSharedDataset(shareToken) {
        assertUuid(shareToken);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/datasets`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const dataset = await response.json();
        return dataset;
    }
    /**
     * Get shared examples.
     *
     * @param {string} shareToken The share token to get examples for. A share token is the UUID (or LangSmith URL, including UUID) generated when explicitly marking an example as public.
     * @param {Object} [options] Additional options for listing the examples.
     * @param {string[] | undefined} [options.exampleIds] A list of example IDs to filter by.
     * @returns {Promise<Example[]>} The shared examples.
     */
    async listSharedExamples(shareToken, options) {
        const params = {};
        if (options?.exampleIds) {
            params.id = options.exampleIds;
        }
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => urlParams.append(key, v));
            }
            else {
                urlParams.append(key, value);
            }
        });
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/examples?${urlParams.toString()}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const result = await response.json();
        if (!response.ok) {
            if ("detail" in result) {
                throw new Error(`Failed to list shared examples.\nStatus: ${response.status}\nMessage: ${result.detail.join("\n")}`);
            }
            throw new Error(`Failed to list shared examples: ${response.status} ${response.statusText}`);
        }
        return result.map((example) => ({
            ...example,
            _hostUrl: this.getHostUrl(),
        }));
    }
    async createProject({ projectName, description = null, metadata = null, upsert = false, projectExtra = null, referenceDatasetId = null, }) {
        const upsert_ = upsert ? `?upsert=true` : "";
        const endpoint = `${this.apiUrl}/sessions${upsert_}`;
        const extra = projectExtra || {};
        if (metadata) {
            extra["metadata"] = metadata;
        }
        const body = {
            name: projectName,
            extra,
            description,
        };
        if (referenceDatasetId !== null) {
            body["reference_dataset_id"] = referenceDatasetId;
        }
        const response = await this.caller.call(_getFetchImplementation(), endpoint, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create project");
        const result = await response.json();
        return result;
    }
    async updateProject(projectId, { name = null, description = null, metadata = null, projectExtra = null, endTime = null, }) {
        const endpoint = `${this.apiUrl}/sessions/${projectId}`;
        let extra = projectExtra;
        if (metadata) {
            extra = { ...(extra || {}), metadata };
        }
        const body = {
            name,
            extra,
            description,
            end_time: endTime ? new Date(endTime).toISOString() : null,
        };
        const response = await this.caller.call(_getFetchImplementation(), endpoint, {
            method: "PATCH",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update project");
        const result = await response.json();
        return result;
    }
    async hasProject({ projectId, projectName, }) {
        // TODO: Add a head request
        let path = "/sessions";
        const params = new URLSearchParams();
        if (projectId !== undefined && projectName !== undefined) {
            throw new Error("Must provide either projectName or projectId, not both");
        }
        else if (projectId !== undefined) {
            assertUuid(projectId);
            path += `/${projectId}`;
        }
        else if (projectName !== undefined) {
            params.append("name", projectName);
        }
        else {
            throw new Error("Must provide projectName or projectId");
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}?${params}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        try {
            const result = await response.json();
            if (!response.ok) {
                return false;
            }
            // If it's OK and we're querying by name, need to check the list is not empty
            if (Array.isArray(result)) {
                return result.length > 0;
            }
            // projectId querying
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async readProject({ projectId, projectName, includeStats, }) {
        let path = "/sessions";
        const params = new URLSearchParams();
        if (projectId !== undefined && projectName !== undefined) {
            throw new Error("Must provide either projectName or projectId, not both");
        }
        else if (projectId !== undefined) {
            assertUuid(projectId);
            path += `/${projectId}`;
        }
        else if (projectName !== undefined) {
            params.append("name", projectName);
        }
        else {
            throw new Error("Must provide projectName or projectId");
        }
        if (includeStats !== undefined) {
            params.append("include_stats", includeStats.toString());
        }
        const response = await this._get(path, params);
        let result;
        if (Array.isArray(response)) {
            if (response.length === 0) {
                throw new Error(`Project[id=${projectId}, name=${projectName}] not found`);
            }
            result = response[0];
        }
        else {
            result = response;
        }
        return result;
    }
    async getProjectUrl({ projectId, projectName, }) {
        if (projectId === undefined && projectName === undefined) {
            throw new Error("Must provide either projectName or projectId");
        }
        const project = await this.readProject({ projectId, projectName });
        const tenantId = await this._getTenantId();
        return `${this.getHostUrl()}/o/${tenantId}/projects/p/${project.id}`;
    }
    async getDatasetUrl({ datasetId, datasetName, }) {
        if (datasetId === undefined && datasetName === undefined) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        const dataset = await this.readDataset({ datasetId, datasetName });
        const tenantId = await this._getTenantId();
        return `${this.getHostUrl()}/o/${tenantId}/datasets/${dataset.id}`;
    }
    async _getTenantId() {
        if (this._tenantId !== null) {
            return this._tenantId;
        }
        const queryParams = new URLSearchParams({ limit: "1" });
        for await (const projects of this._getPaginated("/sessions", queryParams)) {
            this._tenantId = projects[0].tenant_id;
            return projects[0].tenant_id;
        }
        throw new Error("No projects found to resolve tenant.");
    }
    async *listProjects({ projectIds, name, nameContains, referenceDatasetId, referenceDatasetName, referenceFree, metadata, } = {}) {
        const params = new URLSearchParams();
        if (projectIds !== undefined) {
            for (const projectId of projectIds) {
                params.append("id", projectId);
            }
        }
        if (name !== undefined) {
            params.append("name", name);
        }
        if (nameContains !== undefined) {
            params.append("name_contains", nameContains);
        }
        if (referenceDatasetId !== undefined) {
            params.append("reference_dataset", referenceDatasetId);
        }
        else if (referenceDatasetName !== undefined) {
            const dataset = await this.readDataset({
                datasetName: referenceDatasetName,
            });
            params.append("reference_dataset", dataset.id);
        }
        if (referenceFree !== undefined) {
            params.append("reference_free", referenceFree.toString());
        }
        if (metadata !== undefined) {
            params.append("metadata", JSON.stringify(metadata));
        }
        for await (const projects of this._getPaginated("/sessions", params)) {
            yield* projects;
        }
    }
    async deleteProject({ projectId, projectName, }) {
        let projectId_;
        if (projectId === undefined && projectName === undefined) {
            throw new Error("Must provide projectName or projectId");
        }
        else if (projectId !== undefined && projectName !== undefined) {
            throw new Error("Must provide either projectName or projectId, not both");
        }
        else if (projectId === undefined) {
            projectId_ = (await this.readProject({ projectName })).id;
        }
        else {
            projectId_ = projectId;
        }
        assertUuid(projectId_);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/sessions/${projectId_}`, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, `delete session ${projectId_} (${projectName})`, true);
    }
    async uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, dataType, name, }) {
        const url = `${this.apiUrl}/datasets/upload`;
        const formData = new FormData();
        formData.append("file", csvFile, fileName);
        inputKeys.forEach((key) => {
            formData.append("input_keys", key);
        });
        outputKeys.forEach((key) => {
            formData.append("output_keys", key);
        });
        if (description) {
            formData.append("description", description);
        }
        if (dataType) {
            formData.append("data_type", dataType);
        }
        if (name) {
            formData.append("name", name);
        }
        const response = await this.caller.call(_getFetchImplementation(), url, {
            method: "POST",
            headers: this.headers,
            body: formData,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "upload CSV");
        const result = await response.json();
        return result;
    }
    async createDataset(name, { description, dataType, inputsSchema, outputsSchema, metadata, } = {}) {
        const body = {
            name,
            description,
            extra: metadata ? { metadata } : undefined,
        };
        if (dataType) {
            body.data_type = dataType;
        }
        if (inputsSchema) {
            body.inputs_schema_definition = inputsSchema;
        }
        if (outputsSchema) {
            body.outputs_schema_definition = outputsSchema;
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create dataset");
        const result = await response.json();
        return result;
    }
    async readDataset({ datasetId, datasetName, }) {
        let path = "/datasets";
        // limit to 1 result
        const params = new URLSearchParams({ limit: "1" });
        if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId !== undefined) {
            assertUuid(datasetId);
            path += `/${datasetId}`;
        }
        else if (datasetName !== undefined) {
            params.append("name", datasetName);
        }
        else {
            throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this._get(path, params);
        let result;
        if (Array.isArray(response)) {
            if (response.length === 0) {
                throw new Error(`Dataset[id=${datasetId}, name=${datasetName}] not found`);
            }
            result = response[0];
        }
        else {
            result = response;
        }
        return result;
    }
    async hasDataset({ datasetId, datasetName, }) {
        try {
            await this.readDataset({ datasetId, datasetName });
            return true;
        }
        catch (e) {
            if (
            // eslint-disable-next-line no-instanceof/no-instanceof
            e instanceof Error &&
                e.message.toLocaleLowerCase().includes("not found")) {
                return false;
            }
            throw e;
        }
    }
    async diffDatasetVersions({ datasetId, datasetName, fromVersion, toVersion, }) {
        let datasetId_ = datasetId;
        if (datasetId_ === undefined && datasetName === undefined) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        else if (datasetId_ !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId_ === undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        const urlParams = new URLSearchParams({
            from_version: typeof fromVersion === "string"
                ? fromVersion
                : fromVersion.toISOString(),
            to_version: typeof toVersion === "string" ? toVersion : toVersion.toISOString(),
        });
        const response = await this._get(`/datasets/${datasetId_}/versions/diff`, urlParams);
        return response;
    }
    async readDatasetOpenaiFinetuning({ datasetId, datasetName, }) {
        const path = "/datasets";
        if (datasetId !== undefined) {
            // do nothing
        }
        else if (datasetName !== undefined) {
            datasetId = (await this.readDataset({ datasetName })).id;
        }
        else {
            throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this._getResponse(`${path}/${datasetId}/openai_ft`);
        const datasetText = await response.text();
        const dataset = datasetText
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
        return dataset;
    }
    async *listDatasets({ limit = 100, offset = 0, datasetIds, datasetName, datasetNameContains, metadata, } = {}) {
        const path = "/datasets";
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });
        if (datasetIds !== undefined) {
            for (const id_ of datasetIds) {
                params.append("id", id_);
            }
        }
        if (datasetName !== undefined) {
            params.append("name", datasetName);
        }
        if (datasetNameContains !== undefined) {
            params.append("name_contains", datasetNameContains);
        }
        if (metadata !== undefined) {
            params.append("metadata", JSON.stringify(metadata));
        }
        for await (const datasets of this._getPaginated(path, params)) {
            yield* datasets;
        }
    }
    /**
     * Update a dataset
     * @param props The dataset details to update
     * @returns The updated dataset
     */
    async updateDataset(props) {
        const { datasetId, datasetName, ...update } = props;
        if (!datasetId && !datasetName) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        const _datasetId = datasetId ?? (await this.readDataset({ datasetName })).id;
        assertUuid(_datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${_datasetId}`, {
            method: "PATCH",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(update),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update dataset");
        return (await response.json());
    }
    async deleteDataset({ datasetId, datasetName, }) {
        let path = "/datasets";
        let datasetId_ = datasetId;
        if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetName !== undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        if (datasetId_ !== undefined) {
            assertUuid(datasetId_);
            path += `/${datasetId_}`;
        }
        else {
            throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, `delete ${path}`);
        await response.json();
    }
    async indexDataset({ datasetId, datasetName, tag, }) {
        let datasetId_ = datasetId;
        if (!datasetId_ && !datasetName) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        else if (datasetId_ && datasetName) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (!datasetId_) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        assertUuid(datasetId_);
        const data = {
            tag: tag,
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/index`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "index dataset");
        await response.json();
    }
    /**
     * Lets you run a similarity search query on a dataset.
     *
     * Requires the dataset to be indexed. Please see the `indexDataset` method to set up indexing.
     *
     * @param inputs      The input on which to run the similarity search. Must have the
     *                    same schema as the dataset.
     *
     * @param datasetId   The dataset to search for similar examples.
     *
     * @param limit       The maximum number of examples to return. Will return the top `limit` most
     *                    similar examples in order of most similar to least similar. If no similar
     *                    examples are found, random examples will be returned.
     *
     * @param filter      A filter string to apply to the search. Only examples will be returned that
     *                    match the filter string. Some examples of filters
     *
     *                    - eq(metadata.mykey, "value")
     *                    - and(neq(metadata.my.nested.key, "value"), neq(metadata.mykey, "value"))
     *                    - or(eq(metadata.mykey, "value"), eq(metadata.mykey, "othervalue"))
     *
     * @returns           A list of similar examples.
     *
     *
     * @example
     * dataset_id = "123e4567-e89b-12d3-a456-426614174000"
     * inputs = {"text": "How many people live in Berlin?"}
     * limit = 5
     * examples = await client.similarExamples(inputs, dataset_id, limit)
     */
    async similarExamples(inputs, datasetId, limit, { filter, } = {}) {
        const data = {
            limit: limit,
            inputs: inputs,
        };
        if (filter !== undefined) {
            data["filter"] = filter;
        }
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/search`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "fetch similar examples");
        const result = await response.json();
        return result["examples"];
    }
    async createExample(inputs, outputs, { datasetId, datasetName, createdAt, exampleId, metadata, split, sourceRunId, }) {
        let datasetId_ = datasetId;
        if (datasetId_ === undefined && datasetName === undefined) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        else if (datasetId_ !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId_ === undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        const createdAt_ = createdAt || new Date();
        const data = {
            dataset_id: datasetId_,
            inputs,
            outputs,
            created_at: createdAt_?.toISOString(),
            id: exampleId,
            metadata,
            split,
            source_run_id: sourceRunId,
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create example");
        const result = await response.json();
        return result;
    }
    async createExamples(props) {
        const { inputs, outputs, metadata, sourceRunIds, exampleIds, datasetId, datasetName, } = props;
        let datasetId_ = datasetId;
        if (datasetId_ === undefined && datasetName === undefined) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        else if (datasetId_ !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId_ === undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        const formattedExamples = inputs.map((input, idx) => {
            return {
                dataset_id: datasetId_,
                inputs: input,
                outputs: outputs ? outputs[idx] : undefined,
                metadata: metadata ? metadata[idx] : undefined,
                split: props.splits ? props.splits[idx] : undefined,
                id: exampleIds ? exampleIds[idx] : undefined,
                source_run_id: sourceRunIds ? sourceRunIds[idx] : undefined,
            };
        });
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(formattedExamples),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create examples");
        const result = await response.json();
        return result;
    }
    async createLLMExample(input, generation, options) {
        return this.createExample({ input }, { output: generation }, options);
    }
    async createChatExample(input, generations, options) {
        const finalInput = input.map((message) => {
            if (isLangChainMessage(message)) {
                return convertLangChainMessageToExample(message);
            }
            return message;
        });
        const finalOutput = isLangChainMessage(generations)
            ? convertLangChainMessageToExample(generations)
            : generations;
        return this.createExample({ input: finalInput }, { output: finalOutput }, options);
    }
    async readExample(exampleId) {
        assertUuid(exampleId);
        const path = `/examples/${exampleId}`;
        return await this._get(path);
    }
    async *listExamples({ datasetId, datasetName, exampleIds, asOf, splits, inlineS3Urls, metadata, limit, offset, filter, } = {}) {
        let datasetId_;
        if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId !== undefined) {
            datasetId_ = datasetId;
        }
        else if (datasetName !== undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        else {
            throw new Error("Must provide a datasetName or datasetId");
        }
        const params = new URLSearchParams({ dataset: datasetId_ });
        const dataset_version = asOf
            ? typeof asOf === "string"
                ? asOf
                : asOf?.toISOString()
            : undefined;
        if (dataset_version) {
            params.append("as_of", dataset_version);
        }
        const inlineS3Urls_ = inlineS3Urls ?? true;
        params.append("inline_s3_urls", inlineS3Urls_.toString());
        if (exampleIds !== undefined) {
            for (const id_ of exampleIds) {
                params.append("id", id_);
            }
        }
        if (splits !== undefined) {
            for (const split of splits) {
                params.append("splits", split);
            }
        }
        if (metadata !== undefined) {
            const serializedMetadata = JSON.stringify(metadata);
            params.append("metadata", serializedMetadata);
        }
        if (limit !== undefined) {
            params.append("limit", limit.toString());
        }
        if (offset !== undefined) {
            params.append("offset", offset.toString());
        }
        if (filter !== undefined) {
            params.append("filter", filter);
        }
        let i = 0;
        for await (const examples of this._getPaginated("/examples", params)) {
            for (const example of examples) {
                yield example;
                i++;
            }
            if (limit !== undefined && i >= limit) {
                break;
            }
        }
    }
    async deleteExample(exampleId) {
        assertUuid(exampleId);
        const path = `/examples/${exampleId}`;
        const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, `delete ${path}`);
        await response.json();
    }
    async updateExample(exampleId, update) {
        assertUuid(exampleId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/${exampleId}`, {
            method: "PATCH",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(update),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update example");
        const result = await response.json();
        return result;
    }
    async updateExamples(update) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
            method: "PATCH",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(update),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update examples");
        const result = await response.json();
        return result;
    }
    async listDatasetSplits({ datasetId, datasetName, asOf, }) {
        let datasetId_;
        if (datasetId === undefined && datasetName === undefined) {
            throw new Error("Must provide dataset name or ID");
        }
        else if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId === undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        else {
            datasetId_ = datasetId;
        }
        assertUuid(datasetId_);
        const params = new URLSearchParams();
        const dataset_version = asOf
            ? typeof asOf === "string"
                ? asOf
                : asOf?.toISOString()
            : undefined;
        if (dataset_version) {
            params.append("as_of", dataset_version);
        }
        const response = await this._get(`/datasets/${datasetId_}/splits`, params);
        return response;
    }
    async updateDatasetSplits({ datasetId, datasetName, splitName, exampleIds, remove = false, }) {
        let datasetId_;
        if (datasetId === undefined && datasetName === undefined) {
            throw new Error("Must provide dataset name or ID");
        }
        else if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId === undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        else {
            datasetId_ = datasetId;
        }
        assertUuid(datasetId_);
        const data = {
            split_name: splitName,
            examples: exampleIds.map((id) => {
                assertUuid(id);
                return id;
            }),
            remove,
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/splits`, {
            method: "PUT",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update dataset splits", true);
    }
    /**
     * @deprecated This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.
     */
    async evaluateRun(run, evaluator, { sourceInfo, loadChildRuns, referenceExample, } = { loadChildRuns: false }) {
        warnOnce("This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.");
        let run_;
        if (typeof run === "string") {
            run_ = await this.readRun(run, { loadChildRuns });
        }
        else if (typeof run === "object" && "id" in run) {
            run_ = run;
        }
        else {
            throw new Error(`Invalid run type: ${typeof run}`);
        }
        if (run_.reference_example_id !== null &&
            run_.reference_example_id !== undefined) {
            referenceExample = await this.readExample(run_.reference_example_id);
        }
        const feedbackResult = await evaluator.evaluateRun(run_, referenceExample);
        const [_, feedbacks] = await this._logEvaluationFeedback(feedbackResult, run_, sourceInfo);
        return feedbacks[0];
    }
    async createFeedback(runId, key, { score, value, correction, comment, sourceInfo, feedbackSourceType = "api", sourceRunId, feedbackId, feedbackConfig, projectId, comparativeExperimentId, }) {
        if (!runId && !projectId) {
            throw new Error("One of runId or projectId must be provided");
        }
        if (runId && projectId) {
            throw new Error("Only one of runId or projectId can be provided");
        }
        const feedback_source = {
            type: feedbackSourceType ?? "api",
            metadata: sourceInfo ?? {},
        };
        if (sourceRunId !== undefined &&
            feedback_source?.metadata !== undefined &&
            !feedback_source.metadata["__run"]) {
            feedback_source.metadata["__run"] = { run_id: sourceRunId };
        }
        if (feedback_source?.metadata !== undefined &&
            feedback_source.metadata["__run"]?.run_id !== undefined) {
            assertUuid(feedback_source.metadata["__run"].run_id);
        }
        const feedback = {
            id: feedbackId ?? uuid.v4(),
            run_id: runId,
            key,
            score,
            value,
            correction,
            comment,
            feedback_source: feedback_source,
            comparative_experiment_id: comparativeExperimentId,
            feedbackConfig,
            session_id: projectId,
        };
        const url = `${this.apiUrl}/feedback`;
        const response = await this.caller.call(_getFetchImplementation(), url, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(feedback),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create feedback", true);
        return feedback;
    }
    async updateFeedback(feedbackId, { score, value, correction, comment, }) {
        const feedbackUpdate = {};
        if (score !== undefined && score !== null) {
            feedbackUpdate["score"] = score;
        }
        if (value !== undefined && value !== null) {
            feedbackUpdate["value"] = value;
        }
        if (correction !== undefined && correction !== null) {
            feedbackUpdate["correction"] = correction;
        }
        if (comment !== undefined && comment !== null) {
            feedbackUpdate["comment"] = comment;
        }
        assertUuid(feedbackId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/${feedbackId}`, {
            method: "PATCH",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(feedbackUpdate),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update feedback", true);
    }
    async readFeedback(feedbackId) {
        assertUuid(feedbackId);
        const path = `/feedback/${feedbackId}`;
        const response = await this._get(path);
        return response;
    }
    async deleteFeedback(feedbackId) {
        assertUuid(feedbackId);
        const path = `/feedback/${feedbackId}`;
        const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, `delete ${path}`);
        await response.json();
    }
    async *listFeedback({ runIds, feedbackKeys, feedbackSourceTypes, } = {}) {
        const queryParams = new URLSearchParams();
        if (runIds) {
            queryParams.append("run", runIds.join(","));
        }
        if (feedbackKeys) {
            for (const key of feedbackKeys) {
                queryParams.append("key", key);
            }
        }
        if (feedbackSourceTypes) {
            for (const type of feedbackSourceTypes) {
                queryParams.append("source", type);
            }
        }
        for await (const feedbacks of this._getPaginated("/feedback", queryParams)) {
            yield* feedbacks;
        }
    }
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
    async createPresignedFeedbackToken(runId, feedbackKey, { expiration, feedbackConfig, } = {}) {
        const body = {
            run_id: runId,
            feedback_key: feedbackKey,
            feedback_config: feedbackConfig,
        };
        if (expiration) {
            if (typeof expiration === "string") {
                body["expires_at"] = expiration;
            }
            else if (expiration?.hours || expiration?.minutes || expiration?.days) {
                body["expires_in"] = expiration;
            }
        }
        else {
            body["expires_in"] = {
                hours: 3,
            };
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/tokens`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const result = await response.json();
        return result;
    }
    async createComparativeExperiment({ name, experimentIds, referenceDatasetId, createdAt, description, metadata, id, }) {
        if (experimentIds.length === 0) {
            throw new Error("At least one experiment is required");
        }
        if (!referenceDatasetId) {
            referenceDatasetId = (await this.readProject({
                projectId: experimentIds[0],
            })).reference_dataset_id;
        }
        if (!referenceDatasetId == null) {
            throw new Error("A reference dataset is required");
        }
        const body = {
            id,
            name,
            experiment_ids: experimentIds,
            reference_dataset_id: referenceDatasetId,
            description,
            created_at: (createdAt ?? new Date())?.toISOString(),
            extra: {},
        };
        if (metadata)
            body.extra["metadata"] = metadata;
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/comparative`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        return await response.json();
    }
    /**
     * Retrieves a list of presigned feedback tokens for a given run ID.
     * @param runId The ID of the run.
     * @returns An async iterable of FeedbackIngestToken objects.
     */
    async *listPresignedFeedbackTokens(runId) {
        assertUuid(runId);
        const params = new URLSearchParams({ run_id: runId });
        for await (const tokens of this._getPaginated("/feedback/tokens", params)) {
            yield* tokens;
        }
    }
    _selectEvalResults(results) {
        let results_;
        if ("results" in results) {
            results_ = results.results;
        }
        else {
            results_ = [results];
        }
        return results_;
    }
    async _logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
        const evalResults = this._selectEvalResults(evaluatorResponse);
        const feedbacks = [];
        for (const res of evalResults) {
            let sourceInfo_ = sourceInfo || {};
            if (res.evaluatorInfo) {
                sourceInfo_ = { ...res.evaluatorInfo, ...sourceInfo_ };
            }
            let runId_ = null;
            if (res.targetRunId) {
                runId_ = res.targetRunId;
            }
            else if (run) {
                runId_ = run.id;
            }
            feedbacks.push(await this.createFeedback(runId_, res.key, {
                score: res.score,
                value: res.value,
                comment: res.comment,
                correction: res.correction,
                sourceInfo: sourceInfo_,
                sourceRunId: res.sourceRunId,
                feedbackConfig: res.feedbackConfig,
                feedbackSourceType: "model",
            }));
        }
        return [evalResults, feedbacks];
    }
    async logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
        const [results] = await this._logEvaluationFeedback(evaluatorResponse, run, sourceInfo);
        return results;
    }
    /**
     * API for managing annotation queues
     */
    /**
     * List the annotation queues on the LangSmith API.
     * @param options - The options for listing annotation queues
     * @param options.queueIds - The IDs of the queues to filter by
     * @param options.name - The name of the queue to filter by
     * @param options.nameContains - The substring that the queue name should contain
     * @param options.limit - The maximum number of queues to return
     * @returns An iterator of AnnotationQueue objects
     */
    async *listAnnotationQueues(options = {}) {
        const { queueIds, name, nameContains, limit } = options;
        const params = new URLSearchParams();
        if (queueIds) {
            queueIds.forEach((id, i) => {
                assertUuid(id, `queueIds[${i}]`);
                params.append("ids", id);
            });
        }
        if (name)
            params.append("name", name);
        if (nameContains)
            params.append("name_contains", nameContains);
        params.append("limit", (limit !== undefined ? Math.min(limit, 100) : 100).toString());
        let count = 0;
        for await (const queues of this._getPaginated("/annotation-queues", params)) {
            yield* queues;
            count++;
            if (limit !== undefined && count >= limit)
                break;
        }
    }
    /**
     * Create an annotation queue on the LangSmith API.
     * @param options - The options for creating an annotation queue
     * @param options.name - The name of the annotation queue
     * @param options.description - The description of the annotation queue
     * @param options.queueId - The ID of the annotation queue
     * @returns The created AnnotationQueue object
     */
    async createAnnotationQueue(options) {
        const { name, description, queueId } = options;
        const body = {
            name,
            description,
            id: queueId || uuid.v4(),
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== undefined))),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create annotation queue");
        const data = await response.json();
        return data;
    }
    /**
     * Read an annotation queue with the specified queue ID.
     * @param queueId - The ID of the annotation queue to read
     * @returns The AnnotationQueue object
     */
    async readAnnotationQueue(queueId) {
        // TODO: Replace when actual endpoint is added
        const queueIteratorResult = await this.listAnnotationQueues({
            queueIds: [queueId],
        }).next();
        if (queueIteratorResult.done) {
            throw new Error(`Annotation queue with ID ${queueId} not found`);
        }
        return queueIteratorResult.value;
    }
    /**
     * Update an annotation queue with the specified queue ID.
     * @param queueId - The ID of the annotation queue to update
     * @param options - The options for updating the annotation queue
     * @param options.name - The new name for the annotation queue
     * @param options.description - The new description for the annotation queue
     */
    async updateAnnotationQueue(queueId, options) {
        const { name, description } = options;
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
            method: "PATCH",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify({ name, description }),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update annotation queue");
    }
    /**
     * Delete an annotation queue with the specified queue ID.
     * @param queueId - The ID of the annotation queue to delete
     */
    async deleteAnnotationQueue(queueId) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
            method: "DELETE",
            headers: { ...this.headers, Accept: "application/json" },
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "delete annotation queue");
    }
    /**
     * Add runs to an annotation queue with the specified queue ID.
     * @param queueId - The ID of the annotation queue
     * @param runIds - The IDs of the runs to be added to the annotation queue
     */
    async addRunsToAnnotationQueue(queueId, runIds) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/runs`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(runIds.map((id, i) => assertUuid(id, `runIds[${i}]`).toString())),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "add runs to annotation queue");
    }
    /**
     * Get a run from an annotation queue at the specified index.
     * @param queueId - The ID of the annotation queue
     * @param index - The index of the run to retrieve
     * @returns A Promise that resolves to a RunWithAnnotationQueueInfo object
     * @throws {Error} If the run is not found at the given index or for other API-related errors
     */
    async getRunFromAnnotationQueue(queueId, index) {
        const baseUrl = `/annotation-queues/${assertUuid(queueId, "queueId")}/run`;
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${baseUrl}/${index}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "get run from annotation queue");
        return await response.json();
    }
    async _currentTenantIsOwner(owner) {
        const settings = await this._getSettings();
        return owner == "-" || settings.tenant_handle === owner;
    }
    async _ownerConflictError(action, owner) {
        const settings = await this._getSettings();
        return new Error(`Cannot ${action} for another tenant.\n
      Current tenant: ${settings.tenant_handle}\n
      Requested tenant: ${owner}`);
    }
    async _getLatestCommitHash(promptOwnerAndName) {
        const res = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${promptOwnerAndName}/?limit=${1}&offset=${0}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        const json = await res.json();
        if (!res.ok) {
            const detail = typeof json.detail === "string"
                ? json.detail
                : JSON.stringify(json.detail);
            const error = new Error(`Error ${res.status}: ${res.statusText}\n${detail}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error.statusCode = res.status;
            throw error;
        }
        if (json.commits.length === 0) {
            return undefined;
        }
        return json.commits[0].commit_hash;
    }
    async _likeOrUnlikePrompt(promptIdentifier, like) {
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/likes/${owner}/${promptName}`, {
            method: "POST",
            body: JSON.stringify({ like: like }),
            headers: { ...this.headers, "Content-Type": "application/json" },
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, `${like ? "like" : "unlike"} prompt`);
        return await response.json();
    }
    async _getPromptUrl(promptIdentifier) {
        const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
        if (!(await this._currentTenantIsOwner(owner))) {
            if (commitHash !== "latest") {
                return `${this.getHostUrl()}/hub/${owner}/${promptName}/${commitHash.substring(0, 8)}`;
            }
            else {
                return `${this.getHostUrl()}/hub/${owner}/${promptName}`;
            }
        }
        else {
            const settings = await this._getSettings();
            if (commitHash !== "latest") {
                return `${this.getHostUrl()}/prompts/${promptName}/${commitHash.substring(0, 8)}?organizationId=${settings.id}`;
            }
            else {
                return `${this.getHostUrl()}/prompts/${promptName}?organizationId=${settings.id}`;
            }
        }
    }
    async promptExists(promptIdentifier) {
        const prompt = await this.getPrompt(promptIdentifier);
        return !!prompt;
    }
    async likePrompt(promptIdentifier) {
        return this._likeOrUnlikePrompt(promptIdentifier, true);
    }
    async unlikePrompt(promptIdentifier) {
        return this._likeOrUnlikePrompt(promptIdentifier, false);
    }
    async *listCommits(promptOwnerAndName) {
        for await (const commits of this._getPaginated(`/commits/${promptOwnerAndName}/`, new URLSearchParams(), (res) => res.commits)) {
            yield* commits;
        }
    }
    async *listPrompts(options) {
        const params = new URLSearchParams();
        params.append("sort_field", options?.sortField ?? "updated_at");
        params.append("sort_direction", "desc");
        params.append("is_archived", (!!options?.isArchived).toString());
        if (options?.isPublic !== undefined) {
            params.append("is_public", options.isPublic.toString());
        }
        if (options?.query) {
            params.append("query", options.query);
        }
        for await (const prompts of this._getPaginated("/repos", params, (res) => res.repos)) {
            yield* prompts;
        }
    }
    async getPrompt(promptIdentifier) {
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        if (response.status === 404) {
            return null;
        }
        await raiseForStatus(response, "get prompt");
        const result = await response.json();
        if (result.repo) {
            return result.repo;
        }
        else {
            return null;
        }
    }
    async createPrompt(promptIdentifier, options) {
        const settings = await this._getSettings();
        if (options?.isPublic && !settings.tenant_handle) {
            throw new Error(`Cannot create a public prompt without first\n
        creating a LangChain Hub handle. 
        You can add a handle by creating a public prompt at:\n
        https://smith.langchain.com/prompts`);
        }
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        if (!(await this._currentTenantIsOwner(owner))) {
            throw await this._ownerConflictError("create a prompt", owner);
        }
        const data = {
            repo_handle: promptName,
            ...(options?.description && { description: options.description }),
            ...(options?.readme && { readme: options.readme }),
            ...(options?.tags && { tags: options.tags }),
            is_public: !!options?.isPublic,
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create prompt");
        const { repo } = await response.json();
        return repo;
    }
    async createCommit(promptIdentifier, object, options) {
        if (!(await this.promptExists(promptIdentifier))) {
            throw new Error("Prompt does not exist, you must create it first.");
        }
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        const resolvedParentCommitHash = options?.parentCommitHash === "latest" || !options?.parentCommitHash
            ? await this._getLatestCommitHash(`${owner}/${promptName}`)
            : options?.parentCommitHash;
        const payload = {
            manifest: JSON.parse(JSON.stringify(object)),
            parent_commit: resolvedParentCommitHash,
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "create commit");
        const result = await response.json();
        return this._getPromptUrl(`${owner}/${promptName}${result.commit_hash ? `:${result.commit_hash}` : ""}`);
    }
    async updatePrompt(promptIdentifier, options) {
        if (!(await this.promptExists(promptIdentifier))) {
            throw new Error("Prompt does not exist, you must create it first.");
        }
        const [owner, promptName] = parsePromptIdentifier(promptIdentifier);
        if (!(await this._currentTenantIsOwner(owner))) {
            throw await this._ownerConflictError("update a prompt", owner);
        }
        const payload = {};
        if (options?.description !== undefined)
            payload.description = options.description;
        if (options?.readme !== undefined)
            payload.readme = options.readme;
        if (options?.tags !== undefined)
            payload.tags = options.tags;
        if (options?.isPublic !== undefined)
            payload.is_public = options.isPublic;
        if (options?.isArchived !== undefined)
            payload.is_archived = options.isArchived;
        // Check if payload is empty
        if (Object.keys(payload).length === 0) {
            throw new Error("No valid update options provided");
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
            headers: {
                ...this.headers,
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "update prompt");
        return response.json();
    }
    async deletePrompt(promptIdentifier) {
        if (!(await this.promptExists(promptIdentifier))) {
            throw new Error("Prompt does not exist, you must create it first.");
        }
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        if (!(await this._currentTenantIsOwner(owner))) {
            throw await this._ownerConflictError("delete a prompt", owner);
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        return await response.json();
    }
    async pullPromptCommit(promptIdentifier, options) {
        const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
        const serverInfo = await this._getServerInfo();
        const useOptimization = isVersionGreaterOrEqual(serverInfo.version, "0.5.23");
        let passedCommitHash = commitHash;
        if (!useOptimization && commitHash === "latest") {
            const latestCommitHash = await this._getLatestCommitHash(`${owner}/${promptName}`);
            if (!latestCommitHash) {
                throw new Error("No commits found");
            }
            else {
                passedCommitHash = latestCommitHash;
            }
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}/${passedCommitHash}${options?.includeModel ? "?include_model=true" : ""}`, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
        });
        await raiseForStatus(response, "pull prompt commit");
        const result = await response.json();
        return {
            owner,
            repo: promptName,
            commit_hash: result.commit_hash,
            manifest: result.manifest,
            examples: result.examples,
        };
    }
    /**
     * This method should not be used directly, use `import { pull } from "langchain/hub"` instead.
     * Using this method directly returns the JSON string of the prompt rather than a LangChain object.
     * @private
     */
    async _pullPrompt(promptIdentifier, options) {
        const promptObject = await this.pullPromptCommit(promptIdentifier, {
            includeModel: options?.includeModel,
        });
        const prompt = JSON.stringify(promptObject.manifest);
        return prompt;
    }
    async pushPrompt(promptIdentifier, options) {
        // Create or update prompt metadata
        if (await this.promptExists(promptIdentifier)) {
            if (options && Object.keys(options).some((key) => key !== "object")) {
                await this.updatePrompt(promptIdentifier, {
                    description: options?.description,
                    readme: options?.readme,
                    tags: options?.tags,
                    isPublic: options?.isPublic,
                });
            }
        }
        else {
            await this.createPrompt(promptIdentifier, {
                description: options?.description,
                readme: options?.readme,
                tags: options?.tags,
                isPublic: options?.isPublic,
            });
        }
        if (!options?.object) {
            return await this._getPromptUrl(promptIdentifier);
        }
        // Create a commit with the new manifest
        const url = await this.createCommit(promptIdentifier, options?.object, {
            parentCommitHash: options?.parentCommitHash,
        });
        return url;
    }
    /**
     * Clone a public dataset to your own langsmith tenant.
     * This operation is idempotent. If you already have a dataset with the given name,
     * this function will do nothing.
  
     * @param {string} tokenOrUrl The token of the public dataset to clone.
     * @param {Object} [options] Additional options for cloning the dataset.
     * @param {string} [options.sourceApiUrl] The URL of the langsmith server where the data is hosted. Defaults to the API URL of your current client.
     * @param {string} [options.datasetName] The name of the dataset to create in your tenant. Defaults to the name of the public dataset.
     * @returns {Promise<void>}
     */
    async clonePublicDataset(tokenOrUrl, options = {}) {
        const { sourceApiUrl = this.apiUrl, datasetName } = options;
        const [parsedApiUrl, tokenUuid] = this.parseTokenOrUrl(tokenOrUrl, sourceApiUrl);
        const sourceClient = new Client({
            apiUrl: parsedApiUrl,
            // Placeholder API key not needed anymore in most cases, but
            // some private deployments may have API key-based rate limiting
            // that would cause this to fail if we provide no value.
            apiKey: "placeholder",
        });
        const ds = await sourceClient.readSharedDataset(tokenUuid);
        const finalDatasetName = datasetName || ds.name;
        try {
            if (await this.hasDataset({ datasetId: finalDatasetName })) {
                console.log(`Dataset ${finalDatasetName} already exists in your tenant. Skipping.`);
                return;
            }
        }
        catch (_) {
            // `.hasDataset` will throw an error if the dataset does not exist.
            // no-op in that case
        }
        // Fetch examples first, then create the dataset
        const examples = await sourceClient.listSharedExamples(tokenUuid);
        const dataset = await this.createDataset(finalDatasetName, {
            description: ds.description,
            dataType: ds.data_type || "kv",
            inputsSchema: ds.inputs_schema_definition ?? undefined,
            outputsSchema: ds.outputs_schema_definition ?? undefined,
        });
        try {
            await this.createExamples({
                inputs: examples.map((e) => e.inputs),
                outputs: examples.flatMap((e) => (e.outputs ? [e.outputs] : [])),
                datasetId: dataset.id,
            });
        }
        catch (e) {
            console.error(`An error occurred while creating dataset ${finalDatasetName}. ` +
                "You should delete it manually.");
            throw e;
        }
    }
    parseTokenOrUrl(urlOrToken, apiUrl, numParts = 2, kind = "dataset") {
        // Try parsing as UUID
        try {
            assertUuid(urlOrToken); // Will throw if it's not a UUID.
            return [apiUrl, urlOrToken];
        }
        catch (_) {
            // no-op if it's not a uuid
        }
        // Parse as URL
        try {
            const parsedUrl = new URL(urlOrToken);
            const pathParts = parsedUrl.pathname
                .split("/")
                .filter((part) => part !== "");
            if (pathParts.length >= numParts) {
                const tokenUuid = pathParts[pathParts.length - numParts];
                return [apiUrl, tokenUuid];
            }
            else {
                throw new Error(`Invalid public ${kind} URL: ${urlOrToken}`);
            }
        }
        catch (error) {
            throw new Error(`Invalid public ${kind} URL or token: ${urlOrToken}`);
        }
    }
    /**
     * Awaits all pending trace batches. Useful for environments where
     * you need to be sure that all tracing requests finish before execution ends,
     * such as serverless environments.
     *
     * @example
     * ```
     * import { Client } from "langsmith";
     *
     * const client = new Client();
     *
     * try {
     *   // Tracing happens here
     *   ...
     * } finally {
     *   await client.awaitPendingTraceBatches();
     * }
     * ```
     *
     * @returns A promise that resolves once all currently pending traces have sent.
     */
    awaitPendingTraceBatches() {
        return Promise.all(this.autoBatchQueue.items.map(([, , promise]) => promise));
    }
}