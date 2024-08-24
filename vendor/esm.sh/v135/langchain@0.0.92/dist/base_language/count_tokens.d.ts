import { type TiktokenModel } from "https://esm.sh/v135/js-tiktoken@1.0.8/dist/lite.d.ts";
export declare const getModelNameForTiktoken: (modelName: string) => TiktokenModel;
export declare const getEmbeddingContextSize: (modelName?: string) => number;
export declare const getModelContextSize: (modelName: string) => number;
interface CalculateMaxTokenProps {
    prompt: string;
    modelName: TiktokenModel;
}
export declare const calculateMaxTokens: ({ prompt, modelName, }: CalculateMaxTokenProps) => Promise<number>;
export {};
