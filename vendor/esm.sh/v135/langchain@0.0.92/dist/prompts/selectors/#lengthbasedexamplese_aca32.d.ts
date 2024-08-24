import { Example } from "../../schema/index.d.ts";
import type { BaseExampleSelector } from "../base.d.ts";
import { PromptTemplate } from "../prompt.d.ts";
export interface LengthBasedExampleSelectorInput {
    examplePrompt: PromptTemplate;
    maxLength?: number;
    getTextLength?: (text: string) => number;
}
export declare class LengthBasedExampleSelector implements BaseExampleSelector {
    protected examples: Example[];
    examplePrompt: PromptTemplate;
    getTextLength: (text: string) => number;
    maxLength: number;
    exampleTextLengths: number[];
    constructor(data: LengthBasedExampleSelectorInput);
    addExample(example: Example): Promise<void>;
    calculateExampleTextLengths(v: number[], values: LengthBasedExampleSelector): Promise<number[]>;
    selectExamples(inputVariables: Example): Promise<Example[]>;
    static fromExamples(examples: Example[], args: LengthBasedExampleSelectorInput): Promise<LengthBasedExampleSelector>;
}
