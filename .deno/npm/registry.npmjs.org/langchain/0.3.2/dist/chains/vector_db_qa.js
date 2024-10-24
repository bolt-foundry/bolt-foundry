import { BaseChain } from "./base.js";
import { loadQAStuffChain } from "./question_answering/load.js";
/**
 * Class that represents a VectorDBQAChain. It extends the `BaseChain`
 * class and implements the `VectorDBQAChainInput` interface. It performs
 * a similarity search using a vector store and combines the search
 * results using a specified combine documents chain.
 *
 * @deprecated
 * Switch to {@link https://js.langchain.com/docs/modules/chains/ | createRetrievalChain}
 * Will be removed in 0.2.0
 */
export class VectorDBQAChain extends BaseChain {
    static lc_name() {
        return "VectorDBQAChain";
    }
    get inputKeys() {
        return [this.inputKey];
    }
    get outputKeys() {
        return this.combineDocumentsChain.outputKeys.concat(this.returnSourceDocuments ? ["sourceDocuments"] : []);
    }
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "query"
        });
        Object.defineProperty(this, "vectorstore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "combineDocumentsChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnSourceDocuments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.vectorstore = fields.vectorstore;
        this.combineDocumentsChain = fields.combineDocumentsChain;
        this.inputKey = fields.inputKey ?? this.inputKey;
        this.k = fields.k ?? this.k;
        this.returnSourceDocuments =
            fields.returnSourceDocuments ?? this.returnSourceDocuments;
    }
    /** @ignore */
    async _call(values, runManager) {
        if (!(this.inputKey in values)) {
            throw new Error(`Question key ${this.inputKey} not found.`);
        }
        const question = values[this.inputKey];
        const docs = await this.vectorstore.similaritySearch(question, this.k, values.filter, runManager?.getChild("vectorstore"));
        const inputs = { question, input_documents: docs };
        const result = await this.combineDocumentsChain.call(inputs, runManager?.getChild("combine_documents"));
        if (this.returnSourceDocuments) {
            return {
                ...result,
                sourceDocuments: docs,
            };
        }
        return result;
    }
    _chainType() {
        return "vector_db_qa";
    }
    static async deserialize(data, values) {
        if (!("vectorstore" in values)) {
            throw new Error(`Need to pass in a vectorstore to deserialize VectorDBQAChain`);
        }
        const { vectorstore } = values;
        if (!data.combine_documents_chain) {
            throw new Error(`VectorDBQAChain must have combine_documents_chain in serialized data`);
        }
        return new VectorDBQAChain({
            combineDocumentsChain: await BaseChain.deserialize(data.combine_documents_chain),
            k: data.k,
            vectorstore,
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            combine_documents_chain: this.combineDocumentsChain.serialize(),
            k: this.k,
        };
    }
    /**
     * Static method that creates a VectorDBQAChain instance from a
     * BaseLanguageModel and a vector store. It also accepts optional options
     * to customize the chain.
     * @param llm The BaseLanguageModel instance.
     * @param vectorstore The vector store used for similarity search.
     * @param options Optional options to customize the chain.
     * @returns A new instance of VectorDBQAChain.
     */
    static fromLLM(llm, vectorstore, options) {
        const qaChain = loadQAStuffChain(llm);
        return new this({
            vectorstore,
            combineDocumentsChain: qaChain,
            ...options,
        });
    }
}
