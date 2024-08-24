import { BaseCumulativeTransformOutputParser } from "./transform.d.ts";
import { Operation } from "../utils/json_patch.d.ts";
import { ChatGeneration, Generation } from "../outputs.d.ts";
import { parseJsonMarkdown, parsePartialJson } from "../utils/json.d.ts";
/**
 * Class for parsing the output of an LLM into a JSON object.
 */
export declare class JsonOutputParser<T extends Record<string, any> = Record<string, any>> extends BaseCumulativeTransformOutputParser<T> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    protected _diff(prev: unknown | undefined, next: unknown): Operation[] | undefined;
    parsePartialResult(generations: ChatGeneration[] | Generation[]): Promise<T | undefined>;
    parse(text: string): Promise<T>;
    getFormatInstructions(): string;
}
export { parsePartialJson, parseJsonMarkdown };
