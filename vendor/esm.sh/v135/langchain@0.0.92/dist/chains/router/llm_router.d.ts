import { BasePromptTemplate } from "../../prompts/base.d.ts";
import { LLMChain } from "../../chains/llm_chain.d.ts";
import { RouterChain } from "./multi_route.d.ts";
import { CallbackManagerForChainRun } from "../../callbacks/manager.d.ts";
import { ChainValues } from "../../schema/index.d.ts";
import { BaseLanguageModel } from "../../base_language/index.d.ts";
import { ChainInputs } from "../../chains/base.d.ts";
export type RouterOutputSchema = {
    destination: string;
    next_inputs: {
        [key: string]: string;
    };
};
export interface LLMRouterChainInput extends ChainInputs {
    llmChain: LLMChain<RouterOutputSchema>;
}
export declare class LLMRouterChain extends RouterChain implements LLMRouterChainInput {
    llmChain: LLMChain<RouterOutputSchema>;
    constructor(fields: LLMRouterChainInput);
    get inputKeys(): string[];
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun | undefined): Promise<RouterOutputSchema>;
    _chainType(): string;
    static fromLLM(llm: BaseLanguageModel, prompt: BasePromptTemplate, options?: Omit<LLMRouterChainInput, "llmChain">): LLMRouterChain;
}
