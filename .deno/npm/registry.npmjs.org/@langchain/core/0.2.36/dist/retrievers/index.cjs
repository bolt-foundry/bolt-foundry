"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRetriever = void 0;
const manager_js_1 = require("../callbacks/manager.cjs");
const base_js_1 = require("../runnables/base.cjs");
const config_js_1 = require("../runnables/config.cjs");
/**
 * Abstract base class for a Document retrieval system. A retrieval system
 * is defined as something that can take string queries and return the
 * most 'relevant' Documents from some source.
 */
class BaseRetriever extends base_js_1.Runnable {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metadata", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.callbacks = fields?.callbacks;
        this.tags = fields?.tags ?? [];
        this.metadata = fields?.metadata ?? {};
        this.verbose = fields?.verbose ?? false;
    }
    /**
     * TODO: This should be an abstract method, but we'd like to avoid breaking
     * changes to people currently using subclassed custom retrievers.
     * Change it on next major release.
     */
    _getRelevantDocuments(_query, _callbacks) {
        throw new Error("Not implemented!");
    }
    async invoke(input, options) {
        return this.getRelevantDocuments(input, (0, config_js_1.ensureConfig)(options));
    }
    /**
     * @deprecated Use .invoke() instead. Will be removed in 0.3.0.
     *
     * Main method used to retrieve relevant documents. It takes a query
     * string and an optional configuration object, and returns a promise that
     * resolves to an array of `Document` objects. This method handles the
     * retrieval process, including starting and ending callbacks, and error
     * handling.
     * @param query The query string to retrieve relevant documents for.
     * @param config Optional configuration object for the retrieval process.
     * @returns A promise that resolves to an array of `Document` objects.
     */
    async getRelevantDocuments(query, config) {
        const parsedConfig = (0, config_js_1.ensureConfig)((0, manager_js_1.parseCallbackConfigArg)(config));
        const callbackManager_ = await manager_js_1.CallbackManager.configure(parsedConfig.callbacks, this.callbacks, parsedConfig.tags, this.tags, parsedConfig.metadata, this.metadata, { verbose: this.verbose });
        const runManager = await callbackManager_?.handleRetrieverStart(this.toJSON(), query, parsedConfig.runId, undefined, undefined, undefined, parsedConfig.runName);
        try {
            const results = await this._getRelevantDocuments(query, runManager);
            await runManager?.handleRetrieverEnd(results);
            return results;
        }
        catch (error) {
            await runManager?.handleRetrieverError(error);
            throw error;
        }
    }
}
exports.BaseRetriever = BaseRetriever;