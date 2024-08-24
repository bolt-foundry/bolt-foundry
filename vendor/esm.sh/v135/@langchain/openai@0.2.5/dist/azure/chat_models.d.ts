import { type ClientOptions } from "https://esm.sh/v135/openai@4.53.0/index.d.mts";
import { LangSmithParams, type BaseChatModelParams } from "https://esm.sh/v135/@langchain/core@0.2.18/language_models/chat_models.d.ts";
import { ChatOpenAI } from "../chat_models.d.ts";
import { AzureOpenAIInput, LegacyOpenAIInput, OpenAIChatInput, OpenAICoreRequestOptions } from "../types.d.ts";
export declare class AzureChatOpenAI extends ChatOpenAI {
    _llmType(): string;
    get lc_aliases(): Record<string, string>;
    constructor(fields?: Partial<OpenAIChatInput> & Partial<AzureOpenAIInput> & {
        openAIApiKey?: string;
        openAIApiVersion?: string;
        openAIBasePath?: string;
        deploymentName?: string;
    } & BaseChatModelParams & {
        configuration?: ClientOptions & LegacyOpenAIInput;
    });
    getLsParams(options: this["ParsedCallOptions"]): LangSmithParams;
    protected _getClientOptions(options: OpenAICoreRequestOptions | undefined): OpenAICoreRequestOptions;
    toJSON(): any;
}
