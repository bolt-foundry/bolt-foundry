import { type ClientOptions, OpenAI as OpenAIClient } from "https://esm.sh/v135/openai@4.53.0/index.d.mts";
import { OpenAIEmbeddings, OpenAIEmbeddingsParams } from "../embeddings.d.ts";
import { AzureOpenAIInput, LegacyOpenAIInput } from "../types.d.ts";
export declare class AzureOpenAIEmbeddings extends OpenAIEmbeddings {
    constructor(fields?: Partial<OpenAIEmbeddingsParams> & Partial<AzureOpenAIInput> & {
        verbose?: boolean;
        /** The OpenAI API key to use. */
        apiKey?: string;
        configuration?: ClientOptions;
        deploymentName?: string;
        openAIApiVersion?: string;
    }, configuration?: ClientOptions & LegacyOpenAIInput);
    protected embeddingWithRetry(request: OpenAIClient.EmbeddingCreateParams): Promise<OpenAIClient.Embeddings.CreateEmbeddingResponse>;
}
