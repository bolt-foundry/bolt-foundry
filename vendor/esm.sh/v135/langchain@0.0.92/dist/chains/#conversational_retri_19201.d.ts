import { BaseLanguageModel } from "../base_language/index.d.ts";
import { SerializedChatVectorDBQAChain } from "./serde.d.ts";
import { ChainValues, BaseRetriever, BaseChatMessage } from "../schema/index.d.ts";
import { BaseChain, ChainInputs } from "./base.d.ts";
import { LLMChain } from "./llm_chain.d.ts";
import { QAChainParams } from "./question_answering/load.d.ts";
import { CallbackManagerForChainRun } from "../callbacks/manager.d.ts";
export type LoadValues = Record<string, any>;
export interface ConversationalRetrievalQAChainInput extends ChainInputs {
    retriever: BaseRetriever;
    combineDocumentsChain: BaseChain;
    questionGeneratorChain: LLMChain;
    returnSourceDocuments?: boolean;
    inputKey?: string;
}
export declare class ConversationalRetrievalQAChain extends BaseChain implements ConversationalRetrievalQAChainInput {
    inputKey: string;
    chatHistoryKey: string;
    get inputKeys(): string[];
    get outputKeys(): string[];
    retriever: BaseRetriever;
    combineDocumentsChain: BaseChain;
    questionGeneratorChain: LLMChain;
    returnSourceDocuments: boolean;
    constructor(fields: ConversationalRetrievalQAChainInput);
    static getChatHistoryString(chatHistory: string | BaseChatMessage[]): string;
    /** @ignore */
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    _chainType(): string;
    static deserialize(_data: SerializedChatVectorDBQAChain, _values: LoadValues): Promise<ConversationalRetrievalQAChain>;
    serialize(): SerializedChatVectorDBQAChain;
    static fromLLM(llm: BaseLanguageModel, retriever: BaseRetriever, options?: {
        outputKey?: string;
        returnSourceDocuments?: boolean;
        /** @deprecated Pass in questionGeneratorChainOptions.template instead */
        questionGeneratorTemplate?: string;
        /** @deprecated Pass in qaChainOptions.prompt instead */
        qaTemplate?: string;
        qaChainOptions?: QAChainParams;
        questionGeneratorChainOptions?: {
            llm?: BaseLanguageModel;
            template?: string;
        };
    } & Omit<ConversationalRetrievalQAChainInput, "retriever" | "combineDocumentsChain" | "questionGeneratorChain">): ConversationalRetrievalQAChain;
}
