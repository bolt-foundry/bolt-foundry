import { BaseOutputParser } from "../schema/output_parser.d.ts";
import { BasePromptTemplate } from "../prompts/base.d.ts";
import { LLMChain } from "../chains/llm_chain.d.ts";
import { BaseLanguageModel } from "../base_language/index.d.ts";
import { Callbacks } from "../callbacks/manager.d.ts";
export declare class OutputFixingParser<T> extends BaseOutputParser<T> {
    parser: BaseOutputParser<T>;
    retryChain: LLMChain;
    static fromLLM<T>(llm: BaseLanguageModel, parser: BaseOutputParser<T>, fields?: {
        prompt?: BasePromptTemplate;
    }): OutputFixingParser<T>;
    constructor({ parser, retryChain, }: {
        parser: BaseOutputParser<T>;
        retryChain: LLMChain;
    });
    parse(completion: string, callbacks?: Callbacks): Promise<T>;
    getFormatInstructions(): string;
}
