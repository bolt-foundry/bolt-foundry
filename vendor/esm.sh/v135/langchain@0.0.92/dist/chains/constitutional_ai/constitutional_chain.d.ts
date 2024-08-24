import { BaseLanguageModel } from "../../base_language/index.d.ts";
import { CallbackManagerForChainRun } from "../../callbacks/manager.d.ts";
import { ChainValues } from "../../schema/index.d.ts";
import { BaseChain, ChainInputs } from "../base.d.ts";
import { LLMChain } from "../llm_chain.d.ts";
import { SerializedBaseChain } from "../serde.d.ts";
import { ConstitutionalPrinciple } from "./constitutional_principle.d.ts";
export interface ConstitutionalChainInput extends ChainInputs {
    chain: LLMChain;
    constitutionalPrinciples: ConstitutionalPrinciple[];
    critiqueChain: LLMChain;
    revisionChain: LLMChain;
}
export declare class ConstitutionalChain extends BaseChain implements ConstitutionalChainInput {
    chain: LLMChain;
    constitutionalPrinciples: ConstitutionalPrinciple[];
    critiqueChain: LLMChain;
    revisionChain: LLMChain;
    get inputKeys(): string[];
    get outputKeys(): string[];
    constructor(fields: ConstitutionalChainInput);
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    static getPrinciples(names?: string[]): ConstitutionalPrinciple[];
    static fromLLM(llm: BaseLanguageModel, options: Omit<ConstitutionalChainInput, "critiqueChain" | "revisionChain"> & {
        critiqueChain?: LLMChain;
        revisionChain?: LLMChain;
    }): ConstitutionalChain;
    private static _parseCritique;
    _chainType(): "constitutional_chain";
    serialize(): SerializedBaseChain;
}
