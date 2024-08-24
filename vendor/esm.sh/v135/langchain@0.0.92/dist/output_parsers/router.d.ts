import { z } from "https://esm.sh/v135/zod@3.22.4/index.d.ts";
import { JsonMarkdownStructuredOutputParser } from "./structured.d.ts";
export type RouterOutputParserInput = {
    defaultDestination?: string;
    interpolationDepth?: number;
};
export declare class RouterOutputParser<Y extends z.ZodTypeAny> extends JsonMarkdownStructuredOutputParser<Y> {
    defaultDestination: string;
    constructor(schema: Y, options?: RouterOutputParserInput);
    parse(text: string): Promise<z.infer<Y>>;
}
