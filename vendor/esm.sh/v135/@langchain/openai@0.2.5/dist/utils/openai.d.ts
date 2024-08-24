import { OpenAI as OpenAIClient } from "https://esm.sh/v135/openai@4.53.0/index.d.mts";
import type { StructuredToolInterface } from "https://esm.sh/v135/@langchain/core@0.2.18/tools.d.ts";
import { convertToOpenAIFunction, convertToOpenAITool } from "https://esm.sh/v135/@langchain/core@0.2.18/utils/function_calling.d.ts";
export declare function wrapOpenAIClientError(e: any): any;
export { convertToOpenAIFunction as formatToOpenAIFunction, convertToOpenAITool as formatToOpenAITool, };
export declare function formatToOpenAIAssistantTool(tool: StructuredToolInterface): {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: import("https://esm.sh/v135/zod-to-json-schema@3.23.1/dist/types/index.d.ts").JsonSchema7Type & {
            $schema?: string | undefined;
            definitions?: {
                [key: string]: import("https://esm.sh/v135/zod-to-json-schema@3.23.1/dist/types/index.d.ts").JsonSchema7Type;
            } | undefined;
        };
    };
};
export type OpenAIToolChoice = OpenAIClient.ChatCompletionToolChoiceOption | "any" | string;
export declare function formatToOpenAIToolChoice(toolChoice?: OpenAIToolChoice): OpenAIClient.ChatCompletionToolChoiceOption | undefined;
