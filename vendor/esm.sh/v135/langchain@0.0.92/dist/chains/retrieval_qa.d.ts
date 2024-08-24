import { BaseChain, ChainInputs } from "./base.d.ts";
import { BaseLanguageModel } from "../base_language/index.d.ts";
import { SerializedVectorDBQAChain } from "./serde.d.ts";
import { ChainValues, BaseRetriever } from "../schema/index.d.ts";
import { StuffQAChainParams } from "./question_answering/load.d.ts";
import { CallbackManagerForChainRun } from "../callbacks/manager.d.ts";
export type LoadValues = Record<string, any>;
export interface RetrievalQAChainInput extends Omit<ChainInputs, "memory"> {
    retriever: BaseRetriever;
    combineDocumentsChain: BaseChain;
    inputKey?: string;
    returnSourceDocuments?: boolean;
}
export declare class RetrievalQAChain extends BaseChain implements RetrievalQAChainInput {
    inputKey: string;
    get inputKeys(): string[];
    get outputKeys(): string[];
    retriever: BaseRetriever;
    combineDocumentsChain: BaseChain;
    returnSourceDocuments: boolean;
    constructor(fields: RetrievalQAChainInput);
    /** @ignore */
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    _chainType(): "retrieval_qa";
    static deserialize(_data: SerializedVectorDBQAChain, _values: LoadValues): Promise<RetrievalQAChain>;
    serialize(): SerializedVectorDBQAChain;
    static fromLLM(llm: BaseLanguageModel, retriever: BaseRetriever, options?: Partial<Omit<RetrievalQAChainInput, "retriever" | "combineDocumentsChain" | "index">> & StuffQAChainParams): RetrievalQAChain;
}
