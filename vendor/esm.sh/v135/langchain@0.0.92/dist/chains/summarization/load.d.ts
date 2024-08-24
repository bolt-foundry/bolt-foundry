import { BaseLanguageModel } from "../../base_language/index.d.ts";
import { BasePromptTemplate } from "../../prompts/base.d.ts";
import { StuffDocumentsChain, MapReduceDocumentsChain, RefineDocumentsChain, MapReduceDocumentsChainInput } from "../combine_docs_chain.d.ts";
type BaseParams = {
    verbose?: boolean;
};
/** @interface */
export type SummarizationChainParams = BaseParams & ({
    type?: "stuff";
    prompt?: BasePromptTemplate;
} | ({
    type?: "map_reduce";
    combineMapPrompt?: BasePromptTemplate;
    combinePrompt?: BasePromptTemplate;
} & Pick<MapReduceDocumentsChainInput, "returnIntermediateSteps">) | {
    type?: "refine";
    refinePrompt?: BasePromptTemplate;
    questionPrompt?: BasePromptTemplate;
});
export declare const loadSummarizationChain: (llm: BaseLanguageModel, params?: SummarizationChainParams) => StuffDocumentsChain | MapReduceDocumentsChain | RefineDocumentsChain;
export {};
