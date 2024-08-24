import { type ClientOptions } from "https://esm.sh/v135/openai@4.53.0/index.d.mts";
import { type BaseLLMParams } from "https://esm.sh/v135/@langchain/core@0.2.18/language_models/llms.d.ts";
import { OpenAI } from "../llms.d.ts";
import type { OpenAIInput, AzureOpenAIInput, OpenAICoreRequestOptions, LegacyOpenAIInput } from "../types.d.ts";
export declare class AzureOpenAI extends OpenAI {
    get lc_aliases(): Record<string, string>;
    constructor(fields?: Partial<OpenAIInput> & {
        openAIApiKey?: string;
        openAIApiVersion?: string;
        openAIBasePath?: string;
        deploymentName?: string;
    } & Partial<AzureOpenAIInput> & BaseLLMParams & {
        configuration?: ClientOptions & LegacyOpenAIInput;
    });
    protected _getClientOptions(options: OpenAICoreRequestOptions | undefined): OpenAICoreRequestOptions;
    toJSON(): any;
}
